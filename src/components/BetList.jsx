// src/components/BetList.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

/** Konfiguration */
const SHEET_ID = "1XUh7MYzti9EnVh4w5Jw7vre2dg6nYyWYMH9rg9VhPd0";
const SHEET_PREFIX = "Bet tracker_";
// Juni 25 er den første måneds-fane i regnearket.
const FIRST_SHEET_YEAR = 2025;
const FIRST_SHEET_MONTH = 6;

// Web-app'ens bets kommer med fra juni 26 og lægges oveni regnearkets for de
// måneder hvor begge har data. Det er to forskellige datasæt — regnearket er
// den håndførte tracker, app'en er medlemmernes egne spil — og de dækker
// hinanden næsten ikke: under 10 % af regnearkets juni-bets har samme dato,
// odds og udfald som et af app'ens, hvilket er på niveau med hvad rent
// tilfælde giver ved 19 spil om dagen i et smalt odds-interval.
// App'en har også et par dage i maj 26, men kun fra den 27. Så halv måned
// ville trække maj skævt, og der står regnearket alene.
const APP_START_YEAR = 2026;
const APP_START_MONTH = 6;
const APP_CUTOVER = APP_START_YEAR * 12 + (APP_START_MONTH - 1);
const APP_API_URL = "/api/bet365";

// Indsats pr. spil som andel af bankrollen. Der falder omkring 25 spil om
// dagen, så en gennemsnitsdag binder cirka halvdelen af bankrollen ved 2 %.
// Den besøgende kan skifte selv; 2 % er hvad siden lander på.
const UNIT_PCT = 0.02;
const UNIT_VALG = [0.02, 0.03];
const MONTH_NAMES_DA = [
  "Januar",
  "Februar",
  "Marts",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "December",
];

// Reserveliste hvis fanelisten ikke kan hentes: gæt navnene ud fra mønstret
// "Bet tracker_<Måned><ÅÅ>", fra juni 25 til og med næste måned. Faner der
// ikke findes svarer 400 og bliver sorteret fra. (opensheet er
// case-insensitiv, så "juli26" og "Juli26" rammer samme fane.)
const monthCandidates = () => {
  const now = new Date();
  const first = FIRST_SHEET_YEAR * 12 + (FIRST_SHEET_MONTH - 1);
  const last = now.getFullYear() * 12 + now.getMonth() + 1;
  const list = [];
  for (let t = first; t <= last; t++) {
    const y = Math.floor(t / 12);
    const m = t % 12;
    const yy = String(y).slice(2);
    list.push({
      key: t,
      label: `${MONTH_NAMES_DA[m]} ${yy}`,
      sheet: `${SHEET_PREFIX}${MONTH_NAMES_DA[m]}${yy}`,
    });
  }
  return list;
};

/** Hjælpere */
const canon = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
// Tåler både "1,975", "kr 1.343,00" og "-kr 680,00".
const parseNumber = (v) => {
  if (v == null) return 0;
  const s = String(v)
    .replace(/[^0-9,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};
const findKey = (row, navn) =>
  Object.keys(row || {}).find((k) => canon(k) === navn);
// Hvert måneds-ark har et dashboard øverst; selve bet-tabellen starter
// længere nede. Vi finder header-rækken (Dato/Odds/Unit/Status) og læser
// hvilke nøgler kolonnerne ligger under, og henter så data derfra.
const parseSheet = (rows) => {
  if (!Array.isArray(rows) || !rows.length) return [];
  const cols = {
    dato: null,
    odds: null,
    unit: null,
    status: null,
    potentiel: null,
    profit: null,
  };
  let headerIdx = -1;
  for (let i = 0; i < rows.length; i++) {
    const entries = Object.entries(rows[i]);
    const found = {};
    for (const [k, v] of entries) {
      const cv = canon(v);
      if (cv === "dato") found.dato = k;
      else if (cv === "odds") found.odds = k;
      else if (cv === "unit") found.unit = k;
      else if (cv === "status") found.status = k;
      else if (cv === "potentieludbetaling") found.potentiel = k;
      else if (cv === "profitpabet") found.profit = k;
    }
    if (found.dato != null) {
      Object.assign(cols, found);
      headerIdx = i;
      break;
    }
  }
  if (headerIdx === -1) return [];

  // opensheet bruger arkets række 1 som nøgler. Er række 1 tom over to
  // kolonner (fx Unit og "Expected Profit1" i August 25-fanen), kolliderer
  // nøglerne og Unit-kolonnen falder helt ud af svaret — så bliver indsatsen
  // 0 kr og måneden viser lydløst 0 % vækst. Mangler Unit, regner vi den ud
  // fra fanens egen stake i stedet: tabt = |profit|, vundet = profit/(odds-1),
  // og ellers potentiel udbetaling/odds (push o.l., hvor profit er 0).
  // Bemærk: "" er en gyldig nøgle, så testen skal være mod null — ikke falsy.
  const stakeKey = findKey(rows[0], "stakesize");
  const arkStake = stakeKey ? parseNumber(rows[0][stakeKey]) : 0;
  const manglerUnit = cols.unit == null;

  return rows.slice(headerIdx + 1).map((r) => {
    const odds = parseNumber(r[cols.odds]);
    const status = r[cols.status];
    let unit = manglerUnit ? 0 : parseNumber(r[cols.unit]);
    if (manglerUnit && arkStake) {
      const s = canon(status);
      const profit = cols.profit == null ? 0 : parseNumber(r[cols.profit]);
      const potentiel =
        cols.potentiel == null ? 0 : parseNumber(r[cols.potentiel]);
      let indsats = 0;
      if (s.startsWith("tab") && profit) indsats = Math.abs(profit);
      else if (s.startsWith("vun") && profit && odds > 1)
        indsats = profit / (odds - 1);
      else if (potentiel && odds) indsats = potentiel / odds;
      unit = Math.round((indsats / arkStake) * 1000) / 1000;
    }
    return { dato: r[cols.dato], odds, unit, status };
  });
};
const parseDateDA = (s) => {
  if (!s) return 0;
  const m = String(s)
    .trim()
    .match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (!m) return 0;
  const [_, d, mo, y] = m;
  const t = new Date(+y, +mo - 1, +d).getTime();
  return Number.isFinite(t) ? t : 0;
};
const normStatus = (v) => {
  const s = String(v || "").toLowerCase();
  if (s.startsWith("vun")) return "Vundet";
  if (s.startsWith("tab")) return "Tabt";
  if (s.startsWith("pus") || s === "push") return "Push";
  if (s.startsWith("vaer") || s.startsWith("vær")) return "Værdi";
  return "Ukendt";
};
const kr = (n) =>
  new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    minimumFractionDigits: 0,
  }).format(Math.round(n));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Fanenavnene læses direkte fra regnearket, så en fane kommer med uanset hvad
// den er døbt — august 26 blev fx oprettet som "Bet tracer_august26". Google
// sender CORS-headers på htmlview, så listen kan hentes fra browseren uden
// API-nøgle.
const SHEET_TABS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/htmlview`;
const decodeTabName = (s) =>
  s
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    )
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    )
    .replace(/\\(.)/g, "$1");
const fetchSheetNames = async () => {
  const res = await axios.get(SHEET_TABS_URL, { responseType: "text" });
  const html = String(res.data || "");
  const re = /\{name:\s*"((?:[^"\\]|\\.)*)"\s*,\s*pageUrl:/g;
  const navne = [];
  let m;
  while ((m = re.exec(html)) !== null) navne.push(decodeTabName(m[1]));
  return navne;
};

// En måneds-fane er en fane hvis navn slutter på måned + årstal — uanset hvad
// der står foran. Så tæller "Bet tracker_Juli26" og "Bet tracer_august26" ens,
// mens Samlet, Skabelon, Unibet osv. sorteres fra.
const MONTH_RE = new RegExp(
  `(${MONTH_NAMES_DA.map((m) => m.toLowerCase()).join("|")})(\\d{2})$`
);
const monthFromName = (navn) => {
  const m = MONTH_RE.exec(canon(navn));
  if (!m) return null;
  const idx = MONTH_NAMES_DA.findIndex((n) => n.toLowerCase() === m[1]);
  return {
    key: (2000 + Number(m[2])) * 12 + idx,
    label: `${MONTH_NAMES_DA[idx]} ${m[2]}`,
    sheet: navn,
  };
};

const discoverMonths = async () => {
  try {
    const fundet = (await fetchSheetNames()).map(monthFromName).filter(Boolean);
    if (fundet.length) return fundet;
  } catch (e) {
    console.warn("[BetList] kunne ikke læse fanelisten — gætter navnene", e);
  }
  return monthCandidates();
};

const fetchSheet = async (sheet) => {
  const url = `https://opensheet.elk.sh/${SHEET_ID}/${encodeURIComponent(
    sheet
  )}`;
  for (let forsøg = 0; forsøg < 3; forsøg++) {
    try {
      const res = await axios.get(url);
      return Array.isArray(res.data) ? res.data : null;
    } catch (e) {
      // 400 = fanen findes ikke (endnu). Alt andet er typisk opensheets
      // rate-limit — der venter vi lidt og prøver igen.
      if (e?.response?.status === 400) return null;
      if (forsøg === 2) return null;
      await sleep(600 * (forsøg + 1));
    }
  }
  return null;
};

// Fanerne hentes få ad gangen; alle på én gang rammer rate-limiten.
const runPooled = async (items, limit, fn) => {
  const out = new Array(items.length);
  let næste = 0;
  const arbejder = async () => {
    while (næste < items.length) {
      const i = næste++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, arbejder)
  );
  return out;
};

const normalizeBets = (rows) =>
  rows
    .map((r) => ({
      dato: r.dato || "",
      datoTS: parseDateDA(r.dato),
      odds: r.odds,
      unit: r.unit,
      status: normStatus(r.status),
    }))
    .filter((o) => o.datoTS > 0)
    .sort((a, b) => a.datoTS - b.datoTS);

// App'ens serie er ét spil pr. række med flad indsats — 1 unit hver. Den
// støbes om til samme form som regnearkets bets, så resten af komponenten
// ikke behøver vide hvor tallene kommer fra.
const APP_STATUS = { won: "Vundet", lost: "Tabt", push: "Push" };
const isoTilDA = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
};

const loadAppMonths = async () => {
  const res = await axios.get(APP_API_URL);
  const serie = Array.isArray(res.data?.series) ? res.data.series : [];
  const perMåned = new Map();
  for (const s of serie) {
    const m = /^(\d{4})-(\d{2})-\d{2}$/.exec(String(s.date || ""));
    if (!m) continue;
    const år = Number(m[1]);
    const mdIdx = Number(m[2]) - 1;
    const key = år * 12 + mdIdx;
    if (key < APP_CUTOVER) continue;
    if (!perMåned.has(key)) {
      perMåned.set(key, {
        key,
        label: `${MONTH_NAMES_DA[mdIdx]} ${String(år).slice(2)}`,
        // Egen id-form, så en app-måned aldrig kolliderer med et fanenavn.
        sheet: `app:${m[1]}-${m[2]}`,
        bets: [],
      });
    }
    const dato = isoTilDA(s.date);
    perMåned.get(key).bets.push({
      dato,
      datoTS: parseDateDA(dato),
      odds: Number(s.odds) || 0,
      unit: 1,
      status: APP_STATUS[s.outcome] || "Ukendt",
    });
  }
  return [...perMåned.values()]
    .map((m) => ({
      ...m,
      bets: m.bets.filter((b) => b.datoTS > 0).sort((a, b) => a.datoTS - b.datoTS),
    }))
    .filter((m) => m.bets.length)
    .sort((a, b) => a.key - b.key);
};

// Alle måneder hentes én gang pr. sidevisning og genbruges på tværs af
// knapperne, så skift mellem måneder ikke koster nye kald.
let monthsCache = null;
const loadMonths = async () => {
  if (monthsCache) return monthsCache;
  const [resultater, appMåneder] = await Promise.all([
    (async () =>
      runPooled(await discoverMonths(), 4, async (m) => {
        const rows = await fetchSheet(m.sheet);
        if (!rows) return null;
        const bets = normalizeBets(parseSheet(rows));
        return bets.length ? { ...m, bets } : null;
      }))(),
    loadAppMonths().catch((e) => {
      console.warn("[BetList] kunne ikke hente app'ens bets", e);
      return null;
    }),
  ]);
  // Skulle to faner dække samme måned (fx en omdøbning undervejs), beholder
  // vi den med flest bets i stedet for at vise måneden to gange.
  const ark = resultater
    .filter(Boolean)
    .sort((a, b) => a.key - b.key || b.bets.length - a.bets.length)
    .filter((m, i, arr) => i === 0 || arr[i - 1].key !== m.key);

  // App'ens måneder lægges oveni regnearkets. Findes måneden begge steder,
  // slås spillene sammen til én liste; ellers står kilden alene. Kan app'en
  // ikke nås, bliver regnearket stående som det er — en historik der stopper
  // i maj ville se ud som om vi holdt op med at spille.
  const flettet = new Map(ark.map((m) => [m.key, m]));
  for (const m of appMåneder ?? []) {
    const fra_ark = flettet.get(m.key);
    flettet.set(
      m.key,
      fra_ark
        ? {
            ...fra_ark,
            bets: [...fra_ark.bets, ...m.bets].sort(
              (a, b) => a.datoTS - b.datoTS
            ),
          }
        : m
    );
  }
  monthsCache = [...flettet.values()].sort((a, b) => a.key - b.key);
  return monthsCache;
};

export default function BetList() {
  const [selectedMonth, setSelectedMonth] = useState("Alle");
  const [bankroll, setBankroll] = useState(10000);
  const [stake, setStake] = useState(10000 * UNIT_PCT);
  const [unitPct, setUnitPct] = useState(UNIT_PCT);
  const [months, setMonths] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [debug, setDebug] = useState(false);
  const dref = useRef(debug);
  useEffect(() => {
    dref.current = debug;
  }, [debug]);
  const log = (...a) => dref.current && console.log("[BetList]", ...a);

  useEffect(() => {
    const s = Math.max(1, Math.round((+bankroll || 0) * unitPct));
    setStake(s);
  }, [bankroll, unitPct]);

  useEffect(() => {
    let dead = false;
    const run = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const hentede = await loadMonths();
        if (dead) return;
        setMonths(hentede);
        log("Måneder hentet:", hentede.map((m) => m.label).join(", "));
        if (!hentede.length) setErrorMsg("Kunne ikke hente data.");
      } catch (e) {
        console.error(e);
        if (!dead) setErrorMsg("Kunne ikke hente data.");
      } finally {
        if (!dead) setLoading(false);
      }
    };
    run();
    return () => {
      dead = true;
    };
  }, []);

  const bets = useMemo(() => {
    if (selectedMonth === "Alle")
      return months
        .flatMap((m) => m.bets)
        .slice()
        .sort((a, b) => a.datoTS - b.datoTS);
    return months.find((m) => m.sheet === selectedMonth)?.bets || [];
  }, [months, selectedMonth]);

  // Måneden hvor app'en kom til. Knappen har en prik, og vælger man den,
  // folder forklaringen sig ud — ellers står prikken uforklaret.
  const viserLancering = useMemo(
    () =>
      months.some(
        (m) => m.key === APP_CUTOVER && m.sheet === selectedMonth
      ),
    [months, selectedMonth]
  );

  // Push er indsatsen retur. Den tæller hverken som vundet eller tabt, og
  // holdes derfor uden for winraten — ellers ville en måned med mange
  // annullerede kampe se ud til at have tabt dem. Samme regnestykke som i
  // app'en, så det samme spil giver den samme winrate begge steder.
  const tæl = useMemo(() => {
    const vundet = bets.filter((b) => b.status === "Vundet").length;
    const tabt = bets.filter((b) => b.status === "Tabt").length;
    const afgjort = vundet + tabt;
    return {
      vundet,
      tabt,
      push: bets.filter((b) => b.status === "Push").length,
      winrate: afgjort ? (vundet / afgjort) * 100 : 0,
    };
  }, [bets]);

  const simSaldo = useMemo(() => {
    let saldo = +bankroll || 0;
    bets.forEach((b) => {
      const indsats = stake * b.unit;
      if (b.status === "Vundet") saldo += b.odds * indsats - indsats;
      else if (b.status === "Tabt") saldo -= indsats;
    });
    return Math.round(saldo);
  }, [bets, stake, bankroll]);

  const roiPct = useMemo(() => {
    if (!bankroll) return 0;
    return ((simSaldo - bankroll) / bankroll) * 100;
  }, [simSaldo, bankroll]);

  const history = useMemo(() => {
    let saldo = +bankroll || 0;
    return bets.map((b, i) => {
      const indsats = stake * b.unit;
      if (b.status === "Vundet") saldo += b.odds * indsats - indsats;
      else if (b.status === "Tabt") saldo -= indsats;
      return { index: i + 1, saldo: Math.round(saldo) };
    });
  }, [bets, stake, bankroll]);

  /* Skeleton components */
  const SkeletonCard = () => (
    <div className="card-accent p-5 animate-pulse">
      <div className="h-4 bg-[var(--line)] rounded w-1/3 mb-3"></div>
      <div className="h-3 bg-[var(--line)] rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-[var(--line)] rounded w-1/4"></div>
    </div>
  );

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );

  /** UI */
  return (
    <div className="space-y-6">
      {/* Filter/inputs */}
      <div className="card-accent p-6">
        <div className="flex flex-wrap items-center gap-3">
          {months.map((m) => (
            <button
              key={m.sheet}
              onClick={() => {
                setSelectedMonth(m.sheet);
                setVisibleCount(12);
              }}
              className={`chip ${
                selectedMonth === m.sheet ? "chip--active" : ""
              } ${m.key === APP_CUTOVER ? "chip--lancering" : ""}`}
              title={
                m.key === APP_CUTOVER ? "Appen blev lanceret her" : undefined
              }
            >
              {m.label}
            </button>
          ))}
          <button
            onClick={() => {
              setSelectedMonth("Alle");
              setVisibleCount(12);
            }}
            className={`chip ${selectedMonth === "Alle" ? "chip--active" : ""}`}
          >
            Alle måneder
          </button>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <label className="text-sm text-[var(--ink-2)]">Bankroll</label>
            <input
              type="number"
              value={bankroll}
              onChange={(e) => setBankroll(Number(e.target.value) || 0)}
              className="input-accent w-32 text-right"
            />

            <span className="text-sm text-[var(--ink-2)]">Indsats pr. spil</span>
            <div className="flex items-center gap-1">
              {UNIT_VALG.map((p) => (
                <button
                  key={p}
                  onClick={() => setUnitPct(p)}
                  className={`chip chip--sm ${
                    unitPct === p ? "chip--active" : ""
                  }`}
                >
                  {Math.round(p * 100)} %
                </button>
              ))}
            </div>

            <span className="text-sm text-accent font-semibold">
              1 unit = {stake} kr
            </span>
          </div>
        </div>

        {viserLancering && (
          <p className="mt-4 rounded-lg border-l-2 border-[var(--accent)] bg-[rgba(71,250,190,0.06)] px-3 py-2 text-sm text-[var(--ink-2)]">
            Appen blev lanceret i juni 26.
          </p>
        )}

        <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-4 text-sm text-[var(--ink-2)]">
          <p>
            Alle spil i oversigten er bets der er spillet — også i månederne før
            appen blev lanceret i juni 26.
          </p>
          <p>
            Tallene tager udgangspunkt i{" "}
            <span className="font-semibold text-accent">én bookmaker</span>, så
            opgørelsen er simpel og til at overskue. I praksis spiller vi på en
            del flere danske bookmakere.
          </p>
        </div>
      </div>

      {loading ? (
        <>
          {/* KPI skeleton */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-accent p-6 animate-pulse">
              <div className="h-4 bg-[var(--line)] rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-[var(--line)] rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-[var(--line)] rounded w-1/4"></div>
            </div>
            <div className="card-accent p-6 animate-pulse">
              <div className="h-full bg-[var(--line)] rounded"></div>
            </div>
          </div>

          {/* Bet cards skeleton */}
          <SkeletonGrid />
        </>
      ) : errorMsg ? (
        <div className="card-accent p-6 text-center">
          <p className="font-semibold">{errorMsg}</p>
          <p className="mt-1 text-sm text-[var(--ink-2)]">
            Tallene hentes direkte fra vores bet tracker. Prøv at genindlæse
            siden om lidt.
          </p>
        </div>
      ) : (
        <>
          {/* KPI + graf */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-accent p-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[15px]">
                <div className="text-[var(--ink-2)]">Total væddemål</div>
                <div className="font-semibold text-accent">{bets.length}</div>

                <div className="text-[var(--ink-2)]">Vundet</div>
                <div className="font-semibold text-accent">{tæl.vundet}</div>

                <div className="text-[var(--ink-2)]">Tabt</div>
                <div className="font-semibold">{tæl.tabt}</div>

                {tæl.push > 0 && (
                  <>
                    <div className="text-[var(--ink-2)]">Push</div>
                    <div className="font-semibold">{tæl.push}</div>
                  </>
                )}

                <div className="text-[var(--ink-2)]">Winrate</div>
                <div className="font-semibold text-accent">
                  {tæl.winrate.toFixed(1).replace(".", ",")}%
                </div>

                <div className="text-[var(--ink-2)]">Vækst i %</div>
                <div className="font-semibold text-accent">
                  {roiPct.toFixed(1).replace(".", ",")}%
                </div>

                <div className="text-[var(--ink-2)]">Gns. odds</div>
                <div className="font-semibold text-accent">
                  {(
                    bets.reduce((a, b) => a + (b.odds || 0), 0) /
                    (bets.length || 1)
                  ).toFixed(2)}
                </div>

                <div className="text-[var(--ink-2)]">Gns. sats/spil</div>
                <div className="font-semibold text-accent">
                  {kr(
                    bets.reduce((a, b) => a + (b.unit || 0) * stake, 0) /
                      (bets.length || 1)
                  )}
                </div>

                <div className="text-[var(--ink-2)]">Aktiv måned</div>
                <div className="font-semibold">
                  {selectedMonth === "Alle"
                    ? "Alle"
                    : months.find((m) => m.sheet === selectedMonth)?.label ||
                      selectedMonth}
                </div>
              </div>

              <p className="mt-5 text-base font-extrabold">
                Din saldo ville være:{" "}
                <span className="glow-accent">{kr(simSaldo)}</span>
              </p>
            </div>

            <div className="card-accent p-6">
              <div className="h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid stroke="rgba(71,250,190,.18)" />
                    <XAxis
                      dataKey="index"
                      stroke="#8b929a"
                      tick={{ fill: "#8b929a", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#8b929a"
                      tick={{ fill: "#8b929a", fontSize: 12 }}
                      domain={["dataMin", "dataMax"]}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f1113",
                        border: "1px solid rgba(71,250,190,.35)",
                        borderRadius: "8px",
                        color: "#e9eef2",
                      }}
                      labelStyle={{ color: "#ffffff", fontWeight: 800 }}
                      formatter={(v, name) =>
                        name === "saldo" ? [`${v} kr`, "Saldo"] : [v, name]
                      }
                      labelFormatter={(l) => `Væddemål #${l}`}
                    />
                    <ReferenceLine
                      y={+bankroll || 0}
                      stroke="rgba(71,250,190,.6)"
                      strokeDasharray="6 6"
                    />
                    <Line
                      type="linear"
                      dataKey="saldo"
                      stroke="#47FABE"
                      strokeWidth={2.5}
                      dot={false}
                      isAnimationActive
                      animationDuration={500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Kort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {bets.slice(0, visibleCount).map((b, i) => {
              const indsats = stake * b.unit;
              const res = b.status === "Vundet";
              const push = b.status === "Push";
              // Gevinsten er det man sidder tilbage med ud over sin egen
              // indsats — ikke hele udbetalingen. Push er indsatsen retur og
              // giver hverken plus eller minus.
              const profit = res
                ? Math.round((b.odds - 1) * indsats)
                : push
                ? 0
                : -Math.round(indsats);
              return (
                <div key={i} className="card-accent p-5">
                  <div className="flex items-baseline justify-between">
                    <p className="text-xs text-[var(--muted)]">
                      {b.dato || "—"}
                    </p>
                    <p className="text-xs font-semibold">
                      {res ? (
                        <span className="text-accent">Vundet</span>
                      ) : push ? (
                        <span className="text-accent/80">Push</span>
                      ) : (
                        <span className="text-rose-300">{b.status}</span>
                      )}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-[var(--ink-2)]">
                    Odds: {b.odds?.toString().replace(".", ",")}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    Unit: {b.unit} • Indsats: {kr(indsats)}
                  </p>
                  <p
                    className={`mt-1 text-base font-semibold ${
                      profit > 0 ? "text-accent" : ""
                    }`}
                  >
                    {profit > 0 ? "+" : ""}
                    {profit} kr
                  </p>
                </div>
              );
            })}
          </div>

          {visibleCount < bets.length && (
            <div className="text-center">
              <button
                onClick={() => setVisibleCount((v) => v + 9)}
                className="btn-outline-accent"
              >
                Vis flere væddemål
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

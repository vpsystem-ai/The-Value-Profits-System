/**
 * GET /api/bet365 – Bet365-performance fra web-appen.
 *
 * Endpointet i app'en kræver en nøgle. Kaldte sitet det direkte fra browseren,
 * ville nøglen ligge i JavaScript-bundlen hvor enhver kan læse den — så den
 * bliver her på serveren i stedet, og kan skiftes uden at deploye frontenden.
 */

const API_URL =
  process.env.VPP_API_URL ||
  "https://app.valueprofitsprotocol.dk/api/public/bet365-performance";

// De parametre app'ens endpoint selv kender. Resten sendes ikke videre.
const TILLADTE = ["bookmaker", "minOdds", "maxOdds", "month"];

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function GET(request) {
  const nøgle = process.env.PUBLIC_STATS_API_KEY;
  if (!nøgle) {
    console.error("PUBLIC_STATS_API_KEY mangler");
    return json(503, { error: "Statistikken er ikke konfigureret." });
  }

  const ind = new URL(request.url).searchParams;
  const url = new URL(API_URL);
  for (const p of TILLADTE) {
    const v = ind.get(p);
    if (v) url.searchParams.set(p, v);
  }

  let svar;
  try {
    svar = await fetch(url, { headers: { "x-api-key": nøgle } });
  } catch (e) {
    console.error("Kunne ikke nå app'ens statistik-API:", e);
    return json(502, { error: "Kunne ikke hente data." });
  }

  if (!svar.ok) {
    // 404 betyder typisk at ruten ikke er deployet i app'en endnu. Udadtil er
    // det samme situation som en nedadgående backend: vi har ingen tal.
    console.error("App'ens statistik-API svarede", svar.status);
    return json(502, { error: "Kunne ikke hente data." });
  }

  return new Response(await svar.text(), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // Tallene flytter sig kun når nye spil afgøres.
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

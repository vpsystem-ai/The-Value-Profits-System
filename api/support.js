import { Resend } from "resend";

/**
 * POST /api/support – tager imod support-formularen og sender den som mail.
 *
 * Afsender er et verificeret domæne-afsendernavn; brugerens egen adresse
 * sættes som replyTo, så man kan svare direkte fra indbakken.
 */

const SUPPORT_TO = process.env.SUPPORT_TO_EMAIL || "asger@valueprofitssystem.dk";
const SUPPORT_FROM =
  process.env.SUPPORT_FROM_EMAIL || "Support <support@valueprofitssystem.dk>";

// Skal matche listen i src/pages/Support.jsx
const EMNER = [
  "Spørgsmål til app'en",
  "Problem med login",
  "Fejl eller nedbrud",
  "Abonnement og betaling",
  "Sletning af konto",
  "Andet",
];

const MAX = { navn: 100, email: 254, besked: 5000 };

// Simpel rate limiting pr. IP. Nulstilles når instansen genstarter – det er
// nok til at bremse triviel spam, ikke et rigtigt forsvar mod en målrettet flood.
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  list.push(now);
  hits.set(ip, list);

  // Ryd op så map'en ikke vokser i en langtidskørende instans
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }

  return list.length > RATE_LIMIT.max;
}

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// Undgå at brugerinput kan injicere markup i HTML-mailen
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Nye linjer i headere kan bruges til header-injection
const oneLine = (s) => String(s).replace(/[\r\n]+/g, " ").trim();

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Ugyldig anmodning." });
  }

  const navn = typeof body.navn === "string" ? body.navn.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const besked = typeof body.besked === "string" ? body.besked.trim() : "";
  const emne = typeof body.emne === "string" ? body.emne : "";
  const honeypot = typeof body.website === "string" ? body.website.trim() : "";

  // Honeypot: feltet er skjult for rigtige brugere, så udfyldt = bot.
  // Vi svarer 200, så botten ikke lærer at den blev opdaget.
  if (honeypot) return json(200, { ok: true });

  if (!navn || !email || !besked) {
    return json(400, { error: "Udfyld venligst navn, e-mail og besked." });
  }
  if (!isEmail(email)) {
    return json(400, { error: "Indtast venligst en gyldig e-mailadresse." });
  }
  if (navn.length > MAX.navn || email.length > MAX.email || besked.length > MAX.besked) {
    return json(400, { error: "Et af felterne er for langt." });
  }

  const validEmne = EMNER.includes(emne) ? emne : "Andet";

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return json(429, {
      error: "Du har sendt for mange beskeder. Prøv igen om lidt.",
    });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY mangler");
    return json(500, {
      error: "Support-formularen er ikke konfigureret korrekt. Skriv til os direkte.",
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: SUPPORT_FROM,
    to: [SUPPORT_TO],
    replyTo: oneLine(email),
    subject: `[Support] ${oneLine(validEmne)} – ${oneLine(navn)}`,
    text: `Emne: ${validEmne}\nNavn: ${navn}\nE-mail: ${email}\n\n${besked}`,
    html: `
      <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 16px">Ny supporthenvendelse</h2>
        <p style="margin:0 0 4px"><strong>Emne:</strong> ${esc(validEmne)}</p>
        <p style="margin:0 0 4px"><strong>Navn:</strong> ${esc(navn)}</p>
        <p style="margin:0 0 16px"><strong>E-mail:</strong> ${esc(email)}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">
        <p style="white-space:pre-wrap;margin:0">${esc(besked)}</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend-fejl:", error);
    return json(502, {
      error: "Beskeden kunne ikke sendes lige nu. Prøv igen, eller skriv direkte til os.",
    });
  }

  return json(200, { ok: true });
}

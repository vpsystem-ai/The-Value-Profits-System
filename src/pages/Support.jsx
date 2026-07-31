import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

/**
 * Support – kontaktside der opfylder App Store Review Guideline 1.5
 * (app'en skal linke til en side hvor brugere kan få support).
 *
 * Formularen POSTer til /api/support, som sender mailen via Resend.
 * Adressen står også i klartekst, så brugeren kan skrive direkte hvis
 * afsendelsen fejler.
 */

const SUPPORT_EMAIL = "asger@valueprofitssystem.dk";
const SKOOL_URL = "https://www.skool.com/the-value-profits-system";
const CALENDLY_URL = "https://calendly.com/vpsystem1/30min";

const EMNER = [
  "Spørgsmål til app'en",
  "Problem med login",
  "Fejl eller nedbrud",
  "Abonnement og betaling",
  "Sletning af konto",
  "Andet",
];

const FAQ = [
  {
    q: "Hvor hurtigt svarer I?",
    a: "Vi svarer normalt inden for 24 timer på hverdage. I weekender og på helligdage kan der gå lidt længere.",
  },
  {
    q: "Jeg kan ikke logge ind i app'en",
    a: "Prøv først at nulstille din adgangskode via 'Glemt adgangskode' på loginsiden. Hjælper det ikke, så skriv til os med den e-mail, du oprettede kontoen med, så åbner vi den for dig.",
  },
  {
    q: "Hvordan sletter jeg min konto og mine data?",
    a: "Skriv til os fra den e-mail, der er knyttet til kontoen, med emnet 'Sletning af konto'. Vi sletter kontoen og tilhørende personoplysninger og bekræfter, når det er gjort.",
  },
];

export default function Support() {
  const [emne, setEmne] = useState(EMNER[0]);
  const [navn, setNavn] = useState("");
  const [email, setEmail] = useState("");
  const [besked, setBesked] = useState("");
  const [website, setWebsite] = useState(""); // honeypot – skal forblive tom
  const [status, setStatus] = useState("idle"); // idle | sender | ok | fejl
  const [fejl, setFejl] = useState("");
  const [aabenFaq, setAabenFaq] = useState(null);

  const kanSendes =
    navn.trim() !== "" && email.trim() !== "" && besked.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kanSendes || status === "sender") return;

    setStatus("sender");
    setFejl("");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ navn, email, emne, besked, website }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFejl(data.error || "Beskeden kunne ikke sendes. Prøv igen.");
        setStatus("fejl");
        return;
      }

      setStatus("ok");
      setNavn("");
      setEmail("");
      setBesked("");
      setEmne(EMNER[0]);
    } catch {
      setFejl(
        "Der opstod en netværksfejl. Tjek din forbindelse, eller skriv direkte til os."
      );
      setStatus("fejl");
    }
  };

  return (
    <>
      <SEO
        title="Support & kontakt | Value Profits System"
        description="Få hjælp til Value Profits System-app'en. Skriv til vores support om login, abonnement, fejl eller sletning af konto – vi svarer normalt inden for 24 timer."
        canonical="https://valueprofitssystem.dk/support"
      />

      <div className="container-xl py-16">
        {/* Header */}
        <div className="max-w-3xl">
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold"
            style={{
              color: "var(--accent)",
              background: "rgba(71, 250, 190, 0.1)",
              border: "1px solid rgba(71, 250, 190, 0.25)",
            }}
          >
            Support
          </span>
          <h1 className="h1">Vi hjælper dig gerne</h1>
          <p className="mt-4 text-[15px] leading-7 text-[var(--ink-2)]">
            Har du spørgsmål til app'en, dit abonnement eller din konto? Skriv til
            os herunder, så vender vi tilbage hurtigst muligt – normalt inden for
            24 timer på hverdage.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Kontaktformular */}
          <div
            className="rounded-2xl border p-6 sm:p-8"
            style={{
              background: "var(--surface-glass)",
              borderColor: "var(--border-default)",
            }}
          >
            <h2 className="h3 text-white">Skriv til supporten</h2>
            <p className="mt-2 text-sm text-[var(--ink-2)]">
              Udfyld felterne og send – så vender vi tilbage på den e-mail, du
              angiver.
            </p>

            <form onSubmit={handleSubmit} className="relative mt-6 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="navn" className="mb-2 block text-sm font-semibold text-white">
                    Navn
                  </label>
                  <input
                    id="navn"
                    type="text"
                    required
                    value={navn}
                    onChange={(e) => setNavn(e.target.value)}
                    placeholder="Dit navn"
                    className="w-full rounded-xl border bg-transparent px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                    style={{ borderColor: "var(--border-default)" }}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-white">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dig@eksempel.dk"
                    className="w-full rounded-xl border bg-transparent px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                    style={{ borderColor: "var(--border-default)" }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="emne" className="mb-2 block text-sm font-semibold text-white">
                  Emne
                </label>
                <select
                  id="emne"
                  value={emne}
                  onChange={(e) => setEmne(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-[var(--accent)]"
                  style={{
                    borderColor: "var(--border-default)",
                    background: "var(--bg-elevated)",
                  }}
                >
                  {EMNER.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="besked" className="mb-2 block text-sm font-semibold text-white">
                  Besked
                </label>
                <textarea
                  id="besked"
                  required
                  rows={6}
                  value={besked}
                  onChange={(e) => setBesked(e.target.value)}
                  placeholder="Beskriv dit spørgsmål eller problem så præcist som muligt – gerne med hvilken enhed og app-version du bruger."
                  className="w-full resize-y rounded-xl border bg-transparent px-4 py-3 text-[15px] leading-6 text-white outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                  style={{ borderColor: "var(--border-default)" }}
                />
              </div>

              {/* Honeypot – skjult for rigtige brugere, fanger simple bots */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Efterlad dette felt tomt</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={!kanSendes || status === "sender"}
                className="btn-accent w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                {status === "sender" ? "Sender…" : "Send besked"}
              </button>

              <p aria-live="polite" className="sr-only">
                {status === "sender" ? "Sender din besked" : ""}
              </p>

              {status === "ok" && (
                <p
                  role="status"
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    color: "var(--success)",
                    background: "var(--success-bg)",
                    border: "1px solid var(--success-glow)",
                  }}
                >
                  Tak for din besked! Vi har modtaget den og vender tilbage
                  hurtigst muligt – normalt inden for 24 timer på hverdage.
                </p>
              )}

              {status === "fejl" && (
                <p
                  role="alert"
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    color: "var(--error)",
                    background: "var(--error-bg)",
                    border: "1px solid var(--error-glow)",
                  }}
                >
                  {fejl} Du kan også skrive direkte til{" "}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="link-accent underline">
                    {SUPPORT_EMAIL}
                  </a>
                  .
                </p>
              )}
            </form>
          </div>

          {/* Sidebar: direkte kontakt */}
          <div className="grid content-start gap-6">
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--surface-glass)",
                borderColor: "var(--border-default)",
              }}
            >
              <h2 className="h3 text-white">Kontakt direkte</h2>
              <div className="mt-4 grid gap-4 text-[15px] leading-7 text-[var(--ink-2)]">
                <div>
                  <div className="text-sm font-semibold text-white">E-mail</div>
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="link-accent break-all">
                    {SUPPORT_EMAIL}
                  </a>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Svartid</div>
                  <p className="text-sm">Normalt inden for 24 timer på hverdage.</p>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Udbyder</div>
                  <p className="text-sm">Value Profits System</p>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--surface-glass)",
                borderColor: "var(--border-default)",
              }}
            >
              <h2 className="h3 text-white">Andre muligheder</h2>
              <div className="mt-4 grid gap-3">
                <a
                  href={SKOOL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-accent w-full text-center"
                >
                  Spørg i vores community
                </a>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-accent w-full text-center"
                >
                  Book et møde
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl">
          <h2 className="h2 text-white">Ofte stillede spørgsmål</h2>
          <div className="mt-6 grid gap-3">
            {FAQ.map((item, i) => {
              const aaben = aabenFaq === i;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-xl border"
                  style={{
                    background: "var(--surface-glass)",
                    borderColor: "var(--border-default)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setAabenFaq(aaben ? null : i)}
                    aria-expanded={aaben}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-white"
                  >
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-xl leading-none transition-transform"
                      style={{
                        color: "var(--accent)",
                        transform: aaben ? "rotate(45deg)" : "none",
                      }}
                    >
                      +
                    </span>
                  </button>
                  {aaben && (
                    <p className="px-5 pb-4 text-[15px] leading-7 text-[var(--ink-2)]">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Juridiske links */}
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--ink-2)]">
          <Link to="/privatliv" className="link-accent">
            Privatlivspolitik
          </Link>
          <Link to="/betingelser" className="link-accent">
            Handelsbetingelser
          </Link>
        </div>
      </div>
    </>
  );
}

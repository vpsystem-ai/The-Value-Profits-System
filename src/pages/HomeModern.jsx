import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BetList from "../components/BetList";

export default function HomeModern() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Animated mesh background */}
      <div className="mesh-background"></div>

      <main className="relative">
        {/* HERO SECTION - Ultra modern */}
        <section className="section" style={{ paddingTop: '8rem' }}>
          <div className="container-modern">
            <div className="max-w-5xl mx-auto text-center">
              {/* Floating badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 fade-in"
                   style={{
                     background: 'var(--accent-soft)',
                     border: '1px solid var(--accent-primary)',
                     boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
                   }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  200+ Aktive medlemmer • Dokumenteret vækst
                </span>
              </div>

              {/* Main heading with gradient */}
              <h1 className="display-xl mb-6 fade-in" style={{ animationDelay: '0.1s' }}>
                Mestre Value Betting
              </h1>

              <p className="text-lg md:text-xl mb-4 fade-in"
                 style={{
                   color: 'var(--text-secondary)',
                   maxWidth: '42rem',
                   margin: '0 auto 1.5rem',
                   animationDelay: '0.2s'
                 }}>
                En datadrevet, matematisk tilgang til sportsbetting der leverer
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}> konsistent vækst</span> og langsigtet profit.
              </p>

              <p className="text-base mb-10 fade-in"
                 style={{
                   color: 'var(--text-tertiary)',
                   maxWidth: '38rem',
                   margin: '0 auto 2.5rem',
                   animationDelay: '0.3s'
                 }}>
                Få adgang til omfattende kursus, avancerede værktøjer, daglig analyse,
                og en aktiv community af 200+ value bettere.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 fade-in"
                   style={{ animationDelay: '0.4s' }}>
                <a href="https://links.asgerleerskov.dk/widget/bookings/vps-strategisamtale?utm_source=hjemmeside&utm_medium=website"
                   target="_blank"
                   rel="noreferrer"
                   className="btn btn-primary text-lg px-8 py-4 group">
                  <span>Book gratis demo</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a href="https://www.skool.com/the-value-profits-system/about"
                   target="_blank"
                   rel="noreferrer"
                   className="btn btn-secondary text-lg px-8 py-4">
                  <span>Gratis community</span>
                </a>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto fade-in"
                   style={{ animationDelay: '0.5s' }}>
                <div className="stat-card">
                  <div className="stat-value">200+</div>
                  <div className="stat-label">Medlemmer</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">+EV</div>
                  <div className="stat-label">Fokus</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">3+</div>
                  <div className="stat-label">År aktiv</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">900+</div>
                  <div className="stat-label">Bets tracked</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - Modern 3-step */}
        <section className="section">
          <div className="container-modern">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="badge badge-primary mb-4">Simpel proces</div>
              <h2 className="heading-xl mb-4">Sådan kommer du i gang</h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Fra begynder til profitabel value better på 3 simple skridt
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  step: "01",
                  icon: "📚",
                  title: "Lær fundamentet",
                  description: "Gennemfør vores strukturerede kursus der lærer dig value betting fra bunden. Matematikken, strategien og psykologien bag langsigtet profit."
                },
                {
                  step: "02",
                  icon: "🎯",
                  title: "Brug værktøjerne",
                  description: "Få adgang til vores proprietære bet-finding værktøjer, ROI calculators, og daglige analyser fra erfarne bettere."
                },
                {
                  step: "03",
                  icon: "📈",
                  title: "Optimer & voks",
                  description: "Track dine bets, analyser din performance, og optimer kontinuerligt med feedback fra community og mentorer."
                }
              ].map((item, idx) => (
                <div key={idx}
                     className="card-modern text-center group fade-in"
                     style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="text-6xl mb-6 floating"
                       style={{ animationDelay: `${idx * 0.2}s` }}>
                    {item.icon}
                  </div>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 transition-all"
                       style={{
                         background: 'var(--accent-soft)',
                         border: '2px solid var(--accent-primary)',
                         fontSize: '1.25rem',
                         fontWeight: 900,
                         color: 'var(--accent-primary)'
                       }}>
                    {item.step}
                  </div>
                  <h3 className="heading-md mb-3">{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKOOL COMMUNITY - Highlighted section */}
        <section className="section">
          <div className="container-modern">
            <div className="max-w-6xl mx-auto">
              <div className="card-glow p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Left side - Content */}
                  <div>
                    <div className="badge badge-success mb-6">
                      <span>✓</span>
                      <span>100% GRATIS</span>
                    </div>

                    <h2 className="heading-xl mb-6">
                      Bliv en del af vores
                      <span className="glow-text"> aktive community</span>
                    </h2>

                    <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      Vil du teste vandene først? Få adgang til vores gratis Skool community
                      hvor du kan lære basics, stille spørgsmål og se hvad value betting handler om.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {[
                        { icon: "💬", label: "Daglige diskussioner" },
                        { icon: "📊", label: "Gratis analyser" },
                        { icon: "🎓", label: "Læremateriale" },
                        { icon: "👥", label: "200+ medlemmer" }
                      ].map((benefit, idx) => (
                        <div key={idx}
                             className="flex items-center gap-3 p-3 rounded-lg transition-all"
                             style={{ background: 'var(--bg-elevated)' }}>
                          <span className="text-2xl">{benefit.icon}</span>
                          <span className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {benefit.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <a href="https://www.skool.com/the-value-profits-system/about"
                         target="_blank"
                         rel="noreferrer"
                         className="btn btn-primary group">
                        <span>Tilmeld community gratis</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>
                      <a href="https://links.asgerleerskov.dk/widget/bookings/vps-strategisamtale?utm_source=hjemmeside&utm_medium=website"
                         target="_blank"
                         rel="noreferrer"
                         className="btn btn-ghost">
                        Eller book 1-til-1 demo
                      </a>
                    </div>

                    <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
                      Ingen kreditkort påkrævet • Tilmeld dig på 30 sekunder
                    </p>
                  </div>

                  {/* Right side - Stats visual */}
                  <div className="relative">
                    <div className="aspect-square rounded-2xl p-8 flex flex-col items-center justify-center text-center"
                         style={{
                           background: 'linear-gradient(135deg, var(--accent-soft) 0%, transparent 100%)',
                           border: '1px solid var(--accent-primary)',
                           boxShadow: 'inset 0 0 60px rgba(0, 212, 255, 0.1)'
                         }}>
                      <div className="text-7xl mb-6">🎯</div>
                      <div className="heading-xl mb-2 glow-text">200+</div>
                      <div className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                        Aktive medlemmer
                      </div>

                      <div className="w-full space-y-4">
                        <div className="divider-gradient"></div>
                        {[
                          { label: "Daglige posts", value: "50+" },
                          { label: "Avg. responstid", value: "<2 timer" },
                          { label: "Tilfredshed", value: "4.8/5 ⭐" }
                        ].map((stat, idx) => (
                          <div key={idx}
                               className="flex items-center justify-between p-3 rounded-lg"
                               style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {stat.label}
                            </span>
                            <span className="font-bold glow-text">
                              {stat.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PERFORMANCE / BETLIST */}
        <section id="performance" className="section">
          <div className="container-modern">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="badge badge-outline mb-4">Fuld gennemsigtighed</div>
              <h2 className="heading-xl mb-4">
                Dokumenteret performance
                <span className="glow-text"> i realtid</span>
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Hver eneste bet vi tager bliver logget og vist her. Se vores winrate,
                profit udvikling, og simuler hvordan din bankroll ville vokse.
              </p>
            </div>

            {/* BetList component with modern styling */}
            <div className="glass-card p-6 md:p-8">
              <BetList />
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF / TESTIMONIALS */}
        <section className="section" style={{ paddingTop: '2rem' }}>
          <div className="container-modern">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="badge badge-primary mb-4">Social proof</div>
              <h2 className="heading-xl mb-4">Hvad siger vores medlemmer?</h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Rigtige anmeldelser fra rigtige medlemmer
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="aspect-video w-full rounded-xl overflow-hidden">
                <iframe
                  src="https://embed-v2.testimonial.to/w/value-profits-system---gratis?animated=on&theme=dark&speed=1&tag=all&cc=off"
                  title="Anmeldelser"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="container-modern">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="badge badge-outline mb-4">Spørgsmål & svar</div>
              <h2 className="heading-xl mb-4">Ofte stillede spørgsmål</h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Find svar på de mest almindelige spørgsmål
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: "Kræver det erfaring med betting?",
                  a: "Nej, vi starter fra bunden. Alt du behøver er disciplin og vilje til at følge systemet. Vi lærer dig alt fra grundlæggende sandsynlighedsregning til avanceret bankroll management."
                },
                {
                  q: "Hvor meget tid tager det?",
                  a: "De fleste bruger 30-60 minutter dagligt på at placere bets. Kurset tager ca. 4-6 timer at gennemføre, men du kan tage det i dit eget tempo."
                },
                {
                  q: "Hvad er penge-tilbage garantien?",
                  a: "Hvis du følger systemet 100% i minimum 90 dage med 900+ bets og ikke har profit, får du fuld refundering. Vi står bag vores metode."
                },
                {
                  q: "Er det lovligt i Danmark?",
                  a: "Ja, sportsbetting er 100% lovligt i Danmark, og gevinster er skattefrie. Du skal blot være over 18 år og bruge licenserede bookmakere."
                }
              ].map((faq, idx) => (
                <details key={idx}
                         className="group card-modern cursor-pointer"
                         style={{ padding: 0 }}>
                  <summary className="flex items-center justify-between p-6 font-bold text-lg list-none cursor-pointer">
                    <span>{faq.q}</span>
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180"
                         fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="section">
          <div className="container-modern">
            <div className="max-w-4xl mx-auto">
              <div className="card-glow p-12 text-center">
                <h2 className="heading-xl mb-6">
                  Klar til at starte din
                  <span className="glow-text"> value betting rejse</span>?
                </h2>
                <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Book en gratis 30 minutters demo hvor vi viser dig systemet,
                  eller start med at tilmelde dig vores gratis community.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                  <a href="https://links.asgerleerskov.dk/widget/bookings/vps-strategisamtale?utm_source=hjemmeside&utm_medium=website"
                     target="_blank"
                     rel="noreferrer"
                     className="btn btn-primary text-lg px-10 py-4">
                    Book gratis demo
                  </a>
                  <a href="https://www.skool.com/the-value-profits-system/about"
                     target="_blank"
                     rel="noreferrer"
                     className="btn btn-secondary text-lg px-10 py-4">
                    Tilmeld gratis community
                  </a>
                </div>

                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Ingen kreditkort påkrævet • 100% risikofrit • Penge-tilbage garanti
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="section" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="container-modern">
            <div className="divider-gradient mb-8"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm"
                 style={{ color: 'var(--text-tertiary)' }}>
              <div className="font-bold">
                © {new Date().getFullYear()} Value Profits System
              </div>
              <div className="flex items-center gap-6">
                <Link to="/support" className="hover:text-white transition-colors">
                  Support
                </Link>
                <Link to="/betingelser" className="hover:text-white transition-colors">
                  Handelsbetingelser
                </Link>
                <Link to="/privatliv" className="hover:text-white transition-colors">
                  Privatlivspolitik
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

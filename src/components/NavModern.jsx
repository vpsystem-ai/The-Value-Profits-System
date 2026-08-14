import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function NavModern() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="glass-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none'
      }}
    >
      <nav className="container-modern h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-black text-xl tracking-tight relative group"
        >
          <span className="relative z-10">Value Profits</span>
          <span className="absolute inset-0 blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'var(--gradient-accent)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
            Value Profits
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#performance"
            className="text-sm font-medium transition-colors hover:text-[var(--accent-primary)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            Performance
          </a>
          <a
            href="https://www.skool.com/the-value-profits-system/about"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium transition-colors hover:text-[var(--accent-primary)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            Community
          </a>
          <a
            href="#faq"
            className="text-sm font-medium transition-colors hover:text-[var(--accent-primary)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            FAQ
          </a>
        </div>

        {/* Desktop CTA */}
        <a
          href="https://links.asgerleerskov.dk/widget/bookings/vps-strategisamtale?utm_source=hjemmeside&utm_medium=website"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex btn btn-primary"
        >
          Book gratis demo
        </a>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{
            background: mobileMenuOpen ? 'var(--surface)' : 'transparent',
            color: 'var(--accent-primary)'
          }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(20px)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div className="container-modern py-6 flex flex-col gap-4">
            <a
              href="#performance"
              className="text-base font-medium py-2 transition-colors hover:text-[var(--accent-primary)]"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Performance
            </a>
            <a
              href="https://www.skool.com/the-value-profits-system/about"
              target="_blank"
              rel="noreferrer"
              className="text-base font-medium py-2 transition-colors hover:text-[var(--accent-primary)]"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </a>
            <a
              href="#faq"
              className="text-base font-medium py-2 transition-colors hover:text-[var(--accent-primary)]"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <a
                href="https://links.asgerleerskov.dk/widget/bookings/vps-strategisamtale?utm_source=hjemmeside&utm_medium=website"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book gratis demo
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

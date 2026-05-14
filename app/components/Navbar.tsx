"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UtensilsCrossed, Menu, X } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";

const navLinks = [
  { href: "/",            label: "Home" },
  { href: "/explore",     label: "Explore" },
  { href: "/quick",       label: "Quick Recs" },
  { href: "/personalized",label: "Personalized" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header style={styles.header}>
      <div className="page-wrapper" style={styles.inner}>
        {/* Logo */}
        <Link href="/" style={styles.logo}>
          <span style={styles.logoIcon}>
            <UtensilsCrossed size={22} color="#2D6A4F" strokeWidth={2.2} />
          </span>
          <span style={styles.logoText}>
            Food<span style={styles.logoAccent}>AI</span>
          </span>
        </Link>

        {/* Desktop nav — hidden on mobile via CSS class */}
        <nav className="nav-desktop-links">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  ...styles.navLink,
                  ...(active ? styles.navLinkActive : {}),
                }}
              >
                {link.label}
                {active && <span style={styles.activeDot} />}
              </Link>
            );
          })}
        </nav>

        {/* CTA — hidden on mobile via CSS class */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }} className="nav-cta-desktop">
          {(!isLoaded || !isSignedIn) ? (
            <Link href="/sign-in" style={styles.ctaBtn}>
              Sign In
            </Link>
          ) : (
            <>
              <Link href="/personalized" style={styles.ctaBtn}>
                Dashboard
              </Link>
              <UserButton/>
            </>
          )}
        </div>

        {/* Hamburger — shown only on mobile via CSS class */}
        <button
          style={styles.hamburger}
          className="nav-hamburger"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          id="nav-hamburger-btn"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={styles.mobileDrawer} className="animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                ...styles.mobileLink,
                ...(pathname === link.href ? styles.mobileLinkActive : {}),
              }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {(!isLoaded || !isSignedIn) ? (
            <Link
              href="/sign-in"
              style={styles.mobileCta}
              onClick={() => setOpen(false)}
              id="nav-mobile-cta"
            >
              Sign In
            </Link>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--green-50)', borderRadius: '10px', marginTop: '8px' }}>
                <span style={{ fontWeight: 600, color: 'var(--green-600)' }}>My Account</span>
                <UserButton />
              </div>
              <Link
                href="/personalized"
                style={styles.mobileCta}
                onClick={() => setOpen(false)}
                id="nav-mobile-cta"
              >
                Dashboard
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    backgroundColor: "rgba(250,247,242,0.92)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
  },
  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "68px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "var(--green-50)",
    flexShrink: 0,
  },
  logoText: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "var(--charcoal)",
    letterSpacing: "-0.03em",
  },
  logoAccent: { color: "var(--green-500)" },
  navLink: {
    position: "relative",
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "var(--text-secondary)",
    transition: "all var(--transition)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  navLinkActive: {
    color: "var(--green-500)",
    backgroundColor: "var(--green-50)",
  },
  activeDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    backgroundColor: "var(--green-500)",
  },
  ctaBtn: {
    display: "flex",
    alignItems: "center",
    padding: "8px 20px",
    borderRadius: "var(--radius-full)",
    backgroundColor: "var(--primary)",
    color: "#fff",
    fontSize: "0.875rem",
    fontWeight: 600,
    transition: "background-color var(--transition)",
  },
  hamburger: {
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "transparent",
    cursor: "pointer",
    color: "var(--charcoal)",
    flexShrink: 0,
  },
  mobileDrawer: {
    display: "flex",
    flexDirection: "column",
    padding: "12px 16px 20px",
    borderTop: "1px solid var(--border)",
    background: "var(--cream)",
    gap: "4px",
  },
  mobileLink: {
    padding: "13px 16px",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: 500,
    color: "var(--text-secondary)",
    borderBottom: "1px solid transparent",
    transition: "all var(--transition)",
  },
  mobileLinkActive: {
    color: "var(--green-500)",
    backgroundColor: "var(--green-50)",
  },
  mobileCta: {
    marginTop: "8px",
    padding: "13px 16px",
    borderRadius: "10px",
    backgroundColor: "var(--primary)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    textAlign: "center",
  },
};

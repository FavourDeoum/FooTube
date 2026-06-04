import Image from "next/image";
import Link from "next/link";
import { Brain, Zap, UtensilsCrossed, Sparkles, ChevronRight, MessageSquareText, Smartphone, Leaf } from "lucide-react";
import ModeCard from "./components/ModeCard";
import { RevealSection } from "./components/RevealSection";

export default function HomePage() {
  return (
    <div style={styles.page}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={styles.hero} className="hero-section">
        <div className="page-wrapper hero-grid">
          {/* Text */}
          <div style={styles.heroText} className="animate-fade-in-up">
            <div style={styles.heroChip}>
              <Sparkles size={13} color="var(--green-500)" />
              AI-Powered Food Recommendations
            </div>

            <h1 style={styles.heroHeading}>
              Discover Meals
              <br />
              <span style={styles.heroAccent}>Made For You</span>
            </h1>

            <p style={styles.heroPara}>
              Explore authentic Cameroonian dishes, get smart meal recommendations tailored to your health goals, and chat with your personal food AI, all in one place.
            </p>

            <div className="hero-actions">
              <Link href="/personalized" style={styles.primaryBtn} id="hero-personalized-btn" className="btn-shine btn-primary-hover">
                Get Personalized Recs
                <ChevronRight size={16} />
              </Link>
              <Link href="/explore" style={styles.secondaryBtn} id="hero-explore-btn" className="btn-secondary-hover">
                Explore Dishes
              </Link>
            </div>

            {/* Stats — stagger reveal */}
            <RevealSection stagger>
              <div style={styles.statsRow}>
                {[
                  { value: "20+", label: "Dishes" },
                  { value: "3", label: "AI Modes" },
                  { value: "100%", label: "Free" },
                ].map((s) => (
                  <div key={s.label} style={styles.stat}>
                    <span style={styles.statValue}>{s.value}</span>
                    <span style={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>

          {/* Hero image */}
          <div
            className="hero-image-col animate-fade-in-up"
            style={{ animationDelay: "150ms" }}
          >
            <div style={styles.heroImageCard}>
              <Image
                src="/hero-food.jpg"
                alt="Colourful bowl of Cameroonian jollof rice surrounded by fresh ingredients"
                width={480}
                height={420}
                priority
                unoptimized={true}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "24px" }}
              />
              {/* Floating nutrition card */}
              <div style={styles.floatCard} className="animate-fade-in float-anim">
                <div style={styles.floatCardInner}>
                  <span style={styles.floatIcon}><Zap size={24} color="var(--green-500)" /></span>
                  <div>
                    <div style={styles.floatTitle}>Personalised Plan</div>
                    <div style={styles.floatSub}>Based on your health goals</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modes ────────────────────────────────────────────── */}
      <section style={styles.modesSection}>
        <div className="page-wrapper">
          <RevealSection direction="up">
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Choose Your Mode</h2>
              <p style={styles.sectionSub}>
                Three powerful ways to find your perfect meal.
              </p>
            </div>
          </RevealSection>

          <RevealSection stagger>
            <div style={styles.modesGrid}>
              <ModeCard
                href="/personalized"
                icon={<Brain size={26} color="var(--green-500)" strokeWidth={1.8} />}
                title="Personalized Mode"
                description="Tell us about your health, diet, and lifestyle. Our AI crafts a meal plan unique to you."
                tag="Most Popular"
                animDelay={0}
              />
              <ModeCard
                href="/quick"
                icon={<Zap size={26} color="var(--green-500)" strokeWidth={1.8} />}
                title="Quick Recommendation"
                description="Pick your meal type and food category. Get instant dish suggestions in seconds."
                animDelay={100}
              />
              <ModeCard
                href="/explore"
                icon={<UtensilsCrossed size={26} color="var(--green-500)" strokeWidth={1.8} />}
                title="Explore Dishes"
                description="Browse our full catalogue of Cameroonian dishes. Filter by category, meal time, or dietary needs."
                animDelay={200}
              />
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Feature strip ────────────────────────────────────── */}
      <section style={styles.featureStrip}>
        <RevealSection stagger>
          <div className="page-wrapper" style={styles.featureGrid}>
            {[
              { icon: <Brain size={32} color="var(--green-500)" strokeWidth={1.5} />, title: "AI-Driven", desc: "Recommendations powered by smart algorithms that learn your preferences." },
              { icon: <Leaf size={32} color="var(--green-500)" strokeWidth={1.5} />, title: "Health-Aware", desc: "Accounts for diabetes, BP, allergies, weight goals, and more." },
              { icon: <MessageSquareText size={32} color="var(--green-500)" strokeWidth={1.5} />, title: "Chat Anytime", desc: "Ask our food assistant anything — available on every page." },
              { icon: <Smartphone size={32} color="var(--green-500)" strokeWidth={1.5} />, title: "Mobile Ready", desc: "Looks great on phones, tablets, and desktops alike." },
            ].map((f) => (
              <div key={f.title} style={styles.featureItem} className="feature-item-hover">
                <span style={styles.featureIcon}>{f.icon}</span>
                <div>
                  <div style={styles.featureTitle}>{f.title}</div>
                  <div style={styles.featureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section style={styles.ctaBanner}>
        <RevealSection direction="scale">
          <div className="page-wrapper cta-banner-inner">
            <div>
              <h2 style={styles.ctaTitle}>Ready to eat smarter?</h2>
              <p style={styles.ctaSub}>Start with a personalised recommendation, it only takes less than 2 minutes.</p>
            </div>
            <Link href="/personalized" style={styles.ctaBannerBtn} id="cta-banner-btn" className="btn-shine">
              Get Started <ChevronRight size={16} />
            </Link>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: "flex", flexDirection: "column" },

  /* === Hero === */
  hero: {
    backgroundColor: "var(--cream)",
    padding: "60px 0 80px",
    overflow: "hidden",
  },
  heroText: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  heroChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--green-600)",
    backgroundColor: "var(--green-50)",
    border: "1px solid var(--green-100)",
    borderRadius: "var(--radius-full)",
    padding: "5px 14px",
    width: "fit-content",
  },
  heroHeading: {
    fontSize: "clamp(2rem, 4vw, 3.2rem)",
    fontWeight: 800,
    color: "var(--charcoal)",
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
    margin: 0,
  },
  heroAccent: {
    color: "var(--green-500)",
  },
  heroPara: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
    lineHeight: 1.7,
    maxWidth: "480px",
    margin: 0,
  },

  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "12px 24px",
    backgroundColor: "var(--green-500)",
    color: "#fff",
    borderRadius: "var(--radius-full)",
    fontWeight: 600,
    fontSize: "0.9rem",
    textDecoration: "none",
    transition: "background-color var(--transition)",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: "transparent",
    color: "var(--charcoal)",
    border: "1.5px solid var(--cream-200)",
    borderRadius: "var(--radius-full)",
    fontWeight: 600,
    fontSize: "0.9rem",
    textDecoration: "none",
    transition: "border-color var(--transition), background-color var(--transition)",
  },
  statsRow: {
    display: "flex",
    gap: "32px",
    flexWrap: "wrap",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "var(--charcoal)",
    letterSpacing: "-0.03em",
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    fontWeight: 500,
  },

  /* Hero image */

  heroImageCard: {
    position: "relative",
    width: "100%",
    maxWidth: "480px",
    aspectRatio: "1 / 0.9",
    borderRadius: "24px",
    overflow: "visible",
  },
  floatCard: {
    position: "absolute",
    bottom: "-18px",
    left: "-18px",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    padding: "12px 16px",
    animationDelay: "400ms",
  },
  floatCardInner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  floatIcon: {
    fontSize: "1.5rem",
  },
  floatTitle: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "var(--charcoal)",
  },
  floatSub: {
    fontSize: "0.72rem",
    color: "var(--text-secondary)",
  },

  /* === Modes === */
  modesSection: {
    backgroundColor: "var(--surface)",
    padding: "72px 0",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "48px",
  },
  sectionTitle: {
    fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
    fontWeight: 800,
    color: "var(--charcoal)",
    marginBottom: "10px",
    letterSpacing: "-0.03em",
  },
  sectionSub: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
    margin: 0,
  },
  modesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  /* === Feature strip === */
  featureStrip: {
    backgroundColor: "var(--cream-100)",
    borderTop: "1px solid var(--border)",
    borderBottom: "1px solid var(--border)",
    padding: "48px 0",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "32px",
  },
  featureItem: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
  },
  featureIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "var(--charcoal)",
    marginBottom: "4px",
  },
  featureDesc: {
    fontSize: "0.83rem",
    color: "var(--text-secondary)",
    lineHeight: 1.55,
  },

  /* === CTA Banner === */
  ctaBanner: {
    backgroundColor: "var(--green-500)",
    padding: "56px 0",
  },
  ctaTitle: {
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.03em",
    marginBottom: "6px",
  },
  ctaSub: {
    fontSize: "0.95rem",
    color: "rgba(255,255,255,0.8)",
    margin: 0,
  },
  ctaBannerBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "13px 28px",
    backgroundColor: "#fff",
    color: "var(--green-600)",
    borderRadius: "var(--radius-full)",
    fontWeight: 700,
    fontSize: "0.9rem",
    textDecoration: "none",
    flexShrink: 0,
    transition: "box-shadow var(--transition)",
    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  },
};

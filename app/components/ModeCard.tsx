import Link from "next/link";

interface ModeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  tag?: string;
  animDelay?: number;
}

export default function ModeCard({
  icon,
  title,
  description,
  href,
  tag,
  animDelay = 0,
}: ModeCardProps) {
  return (
    <Link
      href={href}
      style={{ ...styles.card, animationDelay: `${animDelay}ms` }}
      className="animate-fade-in-up mode-card-hover"
    >
      {tag && <span style={styles.tag}>{tag}</span>}
      <div style={styles.iconWrap}>{icon}</div>
      <div style={styles.body}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.desc}>{description}</p>
      </div>
      <div style={styles.arrow} className="mode-card-arrow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "28px 24px",
    boxShadow: "var(--shadow-sm)",
    textDecoration: "none",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform var(--transition), box-shadow var(--transition), border-color var(--transition)",
  },
  tag: {
    position: "absolute",
    top: "16px",
    right: "16px",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--green-600)",
    backgroundColor: "var(--green-50)",
    border: "1px solid var(--green-100)",
    borderRadius: "var(--radius-full)",
    padding: "3px 8px",
  },
  iconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    backgroundColor: "var(--green-50)",
    border: "1px solid var(--green-100)",
    flexShrink: 0,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--charcoal)",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  desc: {
    fontSize: "0.875rem",
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    margin: 0,
  },
  arrow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "var(--cream-100)",
    color: "var(--green-500)",
    alignSelf: "flex-start",
    transition: "background-color var(--transition), transform var(--transition-bounce)",
  },
};

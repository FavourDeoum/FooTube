import Image from "next/image";
import Link from "next/link";
import type { Dish } from "../../lib/mockData";
import Badge from "./ui/Badge";
import { Sparkles, ArrowRight } from "lucide-react";

interface RecommendationCardProps {
  dish: Dish;
  reason?: string;
  animDelay?: number;
}

export default function RecommendationCard({
  dish,
  reason,
  animDelay = 0,
}: RecommendationCardProps) {
  return (
    <article
      style={{ ...styles.card, animationDelay: `${animDelay}ms` }}
      className="animate-fade-in-up"
    >
      {/* Image strip */}
      <div style={styles.imageWrap}>
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
        <div style={styles.overlay} />
        {/* Recommended tag */}
        <div style={styles.recTag}>
          <Sparkles size={12} color="#2D6A4F" />
          <span>Recommended</span>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.header}>
          <h3 style={styles.title}>{dish.name}</h3>
          <Badge label={dish.category} variant="green" />
        </div>

        {/* Reason */}
        {reason && (
          <p style={styles.reason}>
            <Sparkles size={13} color="var(--green-500)" style={{ flexShrink: 0 }} />
            {reason}
          </p>
        )}

        {/* Nutrition highlights */}
        <div style={styles.nutritionGrid}>
          <div style={styles.nutriItem}>
            <span style={styles.nutriValue}>{dish.nutrition.calories}</span>
            <span style={styles.nutriLabel}>kcal</span>
          </div>
          <div style={styles.nutriDivider} />
          <div style={styles.nutriItem}>
            <span style={styles.nutriValue}>{dish.nutrition.protein}g</span>
            <span style={styles.nutriLabel}>Protein</span>
          </div>
          <div style={styles.nutriDivider} />
          <div style={styles.nutriItem}>
            <span style={styles.nutriValue}>{dish.nutrition.carbs}g</span>
            <span style={styles.nutriLabel}>Carbs</span>
          </div>
          <div style={styles.nutriDivider} />
          <div style={styles.nutriItem}>
            <span style={styles.nutriValue}>{dish.nutrition.fat}g</span>
            <span style={styles.nutriLabel}>Fat</span>
          </div>
        </div>

        {/* Suitability tags */}
        <div style={styles.tags}>
          {dish.suitableFor.slice(0, 3).map((tag) => (
            <Badge key={tag} label={tag} variant="cream" size="sm" />
          ))}
        </div>

        <Link href={`/dishes/${dish.id}`} style={styles.viewBtn}>
          View Full Details <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: "var(--surface)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-md)",
    display: "flex",
    flexDirection: "column",
  },
  imageWrap: {
    position: "relative",
    height: "180px",
    overflow: "hidden",
    backgroundColor: "var(--cream-100)",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(28,28,30,0.18), transparent)",
  },
  recTag: {
    position: "absolute",
    top: "12px",
    right: "12px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "rgba(250,247,242,0.92)",
    backdropFilter: "blur(8px)",
    borderRadius: "var(--radius-full)",
    padding: "4px 10px",
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "var(--green-600)",
    border: "1px solid var(--green-100)",
  },
  content: {
    padding: "18px 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1,
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
  },
  title: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "var(--charcoal)",
    lineHeight: 1.3,
    margin: 0,
  },
  reason: {
    display: "flex",
    alignItems: "flex-start",
    gap: "7px",
    fontSize: "0.83rem",
    color: "var(--charcoal-400)",
    lineHeight: 1.5,
    backgroundColor: "var(--green-50)",
    padding: "10px 12px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--green-100)",
    margin: 0,
  },
  nutritionGrid: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "var(--cream-100)",
    borderRadius: "var(--radius-md)",
    padding: "10px 14px",
    gap: "0",
  },
  nutriItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    gap: "2px",
  },
  nutriValue: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "var(--charcoal)",
  },
  nutriLabel: {
    fontSize: "0.68rem",
    color: "var(--charcoal-400)",
    fontWeight: 500,
  },
  nutriDivider: {
    width: "1px",
    height: "28px",
    backgroundColor: "var(--cream-200)",
    flexShrink: 0,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  viewBtn: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--green-500)",
    textDecoration: "none",
    paddingTop: "4px",
  },
};

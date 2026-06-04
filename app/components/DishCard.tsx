"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import type { Dish } from "../../lib/mockData";
import Badge from "./ui/Badge";
import { ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { saveDishSentiment, fetchUserSentiment } from "../../lib/api";

interface DishCardProps {
  dish: Dish;
  animDelay?: number;
}

export default function DishCard({ dish, animDelay = 0 }: DishCardProps) {
  const { user } = useUser();
  const router = useRouter();
  const [sentiment, setSentiment] = useState<"like" | "unlike" | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load existing sentiment on mount
  useEffect(() => {
    async function getInitialSentiment() {
      if (user) {
        try {
          const existing = await fetchUserSentiment(user.id, dish.id);
          setSentiment(existing as "like" | "unlike" | null);
        } catch (err) {
          console.error("Error loading sentiment:", err);
        }
      }
    }
    getInitialSentiment();
  }, [user, dish.id]);

  const handleSentiment = async (e: React.MouseEvent, type: "like" | "unlike") => {
    e.preventDefault(); // Prevent navigating to the dish detail page
    e.stopPropagation(); // Prevent card click
    if (!user) return alert("Please sign in to rate meals");

    const newSentiment = sentiment === type ? null : type;
    setSentiment(newSentiment);
    setIsSyncing(true);

    try {
      await saveDishSentiment({
        userId: user.id,
        dishId: dish.id,
        sentiment: newSentiment,
      });
    } catch (err) {
      console.error("Failed to sync sentiment", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <article
      onClick={() => router.push(`/dishes/${dish.id}`)}
      style={{
        ...styles.card,
        animationDelay: `${animDelay}ms`,
      }}
      className="animate-fade-in-up dish-card-item"
    >
      {/* Image */}
      <div style={styles.imageWrap}>
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          unoptimized={true}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="image-zoom"
          style={{ objectFit: "cover" }}
        />
        <div style={styles.categoryBadge}>
          <Badge label={dish.category} variant="green" />
        </div>
        {dish.isAvailable && (
          <div style={styles.availabilityBadge}>
            <Badge label="Available" variant="solid" />
          </div>
        )}
      </div>

      {/* Body */}
      <div style={styles.body}>
        <h3 style={styles.title}>{dish.name}</h3>
        <p style={styles.desc}>{dish.shortDescription}</p>

        {/* Nutrition row */}
        <div style={styles.nutritionRow}>
          <span style={styles.nutriStat}>
            <strong>{dish.nutrition.calories}</strong> kcal
          </span>
          <span style={styles.dot} />
          <span style={styles.nutriStat}>
            <strong>{dish.nutrition.protein}g</strong> protein
          </span>
          <span style={styles.dot} />
          <span style={styles.nutriStat}>
            <strong>{dish.nutrition.carbs}g</strong> carbs
          </span>
        </div>

        {/* Labels */}
        <div style={styles.labels}>
          {dish.dietaryLabels.slice(0, 2).map((label) => (
            <Badge key={label} label={label} variant="cream" />
          ))}
        </div>

        {/* Bottom Action Row */}
        <div style={styles.footerRow}>
          <div style={styles.viewBtn}>
            View Details
            <ArrowRight size={15} strokeWidth={2.2} />
          </div>

          <div style={styles.sentimentGroup}>
            <button
              onClick={(e) => handleSentiment(e, "like")}
              disabled={isSyncing}
              style={{
                ...styles.iconBtn,
                ...(sentiment === "like" ? styles.activeLike : {}),
              }}
              aria-label="Like"
            >
              <ThumbsUp size={15} fill={sentiment === "like" ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => handleSentiment(e, "unlike")}
              disabled={isSyncing}
              style={{
                ...styles.iconBtn,
                ...(sentiment === "unlike" ? styles.activeUnlike : {}),
              }}
              aria-label="Dislike"
            >
              <ThumbsDown size={15} fill={sentiment === "unlike" ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
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
    boxShadow: "var(--shadow-sm)",
    display: "flex",
    flexDirection: "column",
    transition: "transform var(--transition), box-shadow var(--transition)",
    cursor: "pointer",
  },
  imageWrap: {
    position: "relative",
    height: "200px",
    width: "100%",
    backgroundColor: "var(--cream-100)",
    overflow: "hidden",
  },
  categoryBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    zIndex: 2,
  },
  availabilityBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 2,
  },
  body: {
    padding: "18px 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },
  title: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "var(--charcoal)",
    margin: 0,
  },
  desc: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: 1.55,
    margin: 0,
  },
  nutritionRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  nutriStat: {
    fontSize: "0.78rem",
    color: "var(--charcoal-400)",
  },
  dot: {
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    backgroundColor: "var(--charcoal-100)",
    display: "inline-block",
  },
  labels: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  footerRow: {
    marginTop: "auto",
    paddingTop: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid var(--border-light, #f5f5f5)",
  },
  viewBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--green-500)",
    textDecoration: "none",
    transition: "gap var(--transition)",
  },
  sentimentGroup: {
    display: "flex",
    gap: "6px",
  },
  iconBtn: {
    background: "none",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-secondary)",
    transition: "all 0.2s ease",
  },
  activeLike: {
    color: "var(--green-600)",
    backgroundColor: "var(--green-50)",
    borderColor: "var(--green-200)",
  },
  activeUnlike: {
    color: "#ef4444",
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
};
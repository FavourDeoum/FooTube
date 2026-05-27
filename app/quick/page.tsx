"use client";

import { useState } from "react";
import { Zap, Coffee, Sun, Moon, Beef, Leaf, Utensils, ChevronRight, ArrowLeft } from "lucide-react";
import { getQuickRecommendations, recommendationReasons } from "../../lib/api";
import type { Dish } from "../../lib/mockData";
import RecommendationCard from "../components/RecommendationCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Link from "next/link";

const MEAL_OPTIONS = [
  { value: "Breakfast", label: "Breakfast", icon: <Coffee size={20} strokeWidth={1.8} color="var(--green-500)" /> },
  { value: "Lunch", label: "Lunch", icon: <Sun size={20} strokeWidth={1.8} color="var(--green-500)" /> },
  { value: "Dinner", label: "Dinner", icon: <Moon size={20} strokeWidth={1.8} color="var(--green-500)" /> },
];

const CATEGORY_OPTIONS = [
  { value: "Traditional", label: "Traditional", icon: <Utensils size={20} strokeWidth={1.8} color="var(--green-500)" /> },
  { value: "Protein", label: "Protein Meals", icon: <Beef size={20} strokeWidth={1.8} color="var(--green-500)" /> },
  { value: "Light", label: "Light Meals", icon: <Leaf size={20} strokeWidth={1.8} color="var(--green-500)" /> },
];

export default function QuickPage() {
  const [mealType, setMealType] = useState("");
  const [foodCategory, setFoodCategory] = useState("");
  const [results, setResults] = useState<Dish[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!mealType || !foodCategory) {
      setError("Please select both a meal type and a food category.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const recs = await getQuickRecommendations({ mealType, foodCategory });
      setResults(recs);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResults(null);
    setMealType("");
    setFoodCategory("");
    setError("");
  }

  return (
    <div style={styles.page}>
      <div className="page-wrapper" style={{ maxWidth: "720px" }}>
        {/* Back */}
        <Link href="/" style={styles.backLink}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Page header */}
        <div style={styles.pageHeader}>
          <div style={styles.pageIcon}>
            <Zap size={28} color="var(--green-500)" strokeWidth={1.8} />
          </div>
          <div>
            <h1 style={styles.pageTitle}>Quick Recommendations</h1>
            <p style={styles.pageSub}>Two quick picks — instant meal suggestions.</p>
          </div>
        </div>

        {/* Form or results */}
        {results ? (
          <div style={styles.resultsSection}>
            <div style={styles.resultsHeader}>
              <div>
                <h2 style={styles.resultsTitle}>Your Quick Picks</h2>
                <p style={styles.resultsSub}>
                  {mealType} · {foodCategory} — {results.length} dish{results.length !== 1 ? "es" : ""} found
                </p>
              </div>
              <button onClick={handleReset} style={styles.resetBtn} id="quick-reset-btn">
                Try Again
              </button>
            </div>
            <div style={styles.resultsGrid}>
              {results.map((dish, i) => (
                <RecommendationCard
                  key={dish.id}
                  dish={dish}
                  reason={dish.recommendationReason || recommendationReasons[dish.id]}
                  animDelay={i * 80}
                />
              ))}
            </div>
          </div>
        ) : (
          <div style={styles.formCard}>
            {/* Step 1 */}
            <div style={styles.step}>
              <div style={styles.stepLabel}>
                <span style={styles.stepNum}>1</span>
                What meal are you planning?
              </div>
              <div style={styles.optionGrid}>
                {MEAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    id={`meal-${opt.value.toLowerCase()}`}
                    style={{
                      ...styles.optionBtn,
                      ...(mealType === opt.value ? styles.optionBtnActive : {}),
                    }}
                    onClick={() => setMealType(opt.value)}
                  >
                    <span style={styles.optionIcon}>{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.divider} />

            {/* Step 2 */}
            <div style={styles.step}>
              <div style={styles.stepLabel}>
                <span style={styles.stepNum}>2</span>
                What kind of food are you in the mood for?
              </div>
              <div style={styles.optionGrid}>
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    id={`category-${opt.value.toLowerCase()}`}
                    style={{
                      ...styles.optionBtn,
                      ...(foodCategory === opt.value ? styles.optionBtnActive : {}),
                    }}
                    onClick={() => setFoodCategory(opt.value)}
                  >
                    <span style={styles.optionIcon}>{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p style={styles.errorMsg}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.8 : 1 }}
              id="quick-submit-btn"
            >
              {loading ? (
                <><LoadingSpinner size={18} /> Finding meals…</>
              ) : (
                <>Get Recommendations <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "40px 0 80px", backgroundColor: "var(--cream)", minHeight: "100vh" },
  backLink: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)",
    textDecoration: "none", marginBottom: "32px",
    transition: "color var(--transition)",
  },
  pageHeader: {
    display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px",
  },
  pageIcon: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "60px", height: "60px", borderRadius: "18px",
    backgroundColor: "var(--green-50)", border: "1px solid var(--green-100)",
    flexShrink: 0,
  },
  pageTitle: { fontSize: "1.8rem", fontWeight: 800, color: "var(--charcoal)", margin: 0, letterSpacing: "-0.03em" },
  pageSub: { fontSize: "0.9rem", color: "var(--text-secondary)", margin: "4px 0 0" },
  formCard: {
    backgroundColor: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)", padding: "40px",
    boxShadow: "var(--shadow-md)", display: "flex", flexDirection: "column", gap: "32px",
    maxWidth: "680px",
  },
  step: { display: "flex", flexDirection: "column", gap: "16px" },
  stepLabel: {
    display: "flex", alignItems: "center", gap: "12px",
    fontSize: "1rem", fontWeight: 600, color: "var(--charcoal)",
  },
  stepNum: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: "28px", height: "28px", borderRadius: "50%",
    backgroundColor: "var(--green-500)", color: "#fff",
    fontSize: "0.8rem", fontWeight: 700, flexShrink: 0,
  },
  optionGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px",
  },
  optionBtn: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
    padding: "18px 12px", borderRadius: "var(--radius-md)",
    border: "2px solid var(--border)", backgroundColor: "var(--cream)",
    cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem",
    fontWeight: 600, color: "var(--text-secondary)",
    transition: "all var(--transition)",
  },
  optionBtnActive: {
    border: "2px solid var(--green-500)", backgroundColor: "var(--green-50)",
    color: "var(--green-600)",
  },
  optionIcon: { display: "flex", alignItems: "center" },
  divider: { height: "1px", backgroundColor: "var(--border)", marginBlock: "-8px" },
  errorMsg: { color: "#c0392b", fontSize: "0.875rem", margin: 0 },
  submitBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    padding: "14px 28px", borderRadius: "var(--radius-full)",
    backgroundColor: "var(--green-500)", color: "#fff",
    border: "none", cursor: "pointer", fontSize: "0.95rem", fontWeight: 600,
    fontFamily: "inherit", transition: "background-color var(--transition)",
    alignSelf: "flex-start",
  },
  resultsSection: { display: "flex", flexDirection: "column", gap: "28px" },
  resultsHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
  },
  resultsTitle: { fontSize: "1.5rem", fontWeight: 800, color: "var(--charcoal)", margin: 0, letterSpacing: "-0.02em" },
  resultsSub: { fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" },
  resetBtn: {
    padding: "8px 20px", borderRadius: "var(--radius-full)",
    border: "1.5px solid var(--border)", backgroundColor: "transparent",
    cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem",
    fontWeight: 600, color: "var(--text-secondary)",
    transition: "border-color var(--transition)",
  },
  resultsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px",
  },
};

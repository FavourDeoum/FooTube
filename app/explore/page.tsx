"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, UtensilsCrossed } from "lucide-react";
import { getExploreFeed, logSearch } from "../../lib/api";
import type { Dish } from "../../lib/mockData";
import { useAuth } from "@clerk/nextjs";
import DishCard from "../components/DishCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { RevealSection } from "../components/RevealSection";

const CATEGORIES = ["All", "Traditional", "Soup", "Protein", "Breakfast", "Light", "Snack"] as const;
const MEAL_TYPES = ["All", "Breakfast", "Lunch", "Dinner"] as const;

export default function ExplorePage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeMeal, setActiveMeal] = useState<string>("All");

  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    getExploreFeed(userId || undefined).then((data) => {
      setDishes(data);
      setLoading(false);
    });
  }, [userId, isLoaded]);

  // Debounced search logging
  useEffect(() => {
    if (!userId || !search.trim()) return;
    const timeoutId = setTimeout(() => {
      logSearch(userId, search.trim());
    }, 1500); // 1.5 second debounce

    return () => clearTimeout(timeoutId);
  }, [search, userId]);

  const filtered = dishes.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || d.category === activeCategory;
    const matchMeal =
      activeMeal === "All" || d.mealType.includes(activeMeal as Dish["mealType"][0]);
    return matchSearch && matchCat && matchMeal;
  });

  return (
    <div style={styles.page}>
      <div className="page-wrapper">
        {/* Page header */}
        <RevealSection direction="up">
          <div style={styles.pageHeader}>
            <div style={styles.headerLeft}>
              <div style={styles.pageIcon}>
                <UtensilsCrossed size={28} color="var(--green-500)" strokeWidth={1.8} />
              </div>
              <div>
                <h1 style={styles.pageTitle}>Explore Dishes</h1>
                <p style={styles.pageSub}>Browse {dishes.length} authentic Cameroonian dishes</p>
              </div>
            </div>

            {/* Search */}
            <div style={styles.searchWrap}>
              <Search size={16} color="var(--charcoal-200)" style={styles.searchIcon} />
              <input
                id="explore-search"
                style={styles.searchInput}
                placeholder="Search dishes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </RevealSection>

        {/* Filters */}
        <RevealSection direction="fade" delay={120}>
          <div style={styles.filtersBar}>
            <div style={styles.filterGroup}>
              <SlidersHorizontal size={14} color="var(--text-secondary)" />
              <span style={styles.filterGroupLabel}>Category:</span>
              <div className="filter-pills-scroll">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    id={`cat-${cat.toLowerCase()}`}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      ...styles.filterPill,
                      ...(activeCategory === cat ? styles.filterPillActive : {}),
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.filterGroup}>
              <span style={styles.filterGroupLabel}>Meal:</span>
              <div style={styles.filterPills}>
                {MEAL_TYPES.map((m) => (
                  <button
                    key={m}
                    id={`meal-${m.toLowerCase()}`}
                    onClick={() => setActiveMeal(m)}
                    style={{
                      ...styles.filterPill,
                      ...(activeMeal === m ? styles.filterPillActive : {}),
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Results count */}
        {!loading && (
          <p style={styles.resultsCount}>
            Showing <strong>{filtered.length}</strong> dish{filtered.length !== 1 ? "es" : ""}
            {search && ` for "${search}"`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div style={styles.loadingWrap}>
            <LoadingSpinner size={36} />
            <p style={styles.loadingText}>Loading dishes…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}><UtensilsCrossed size={48} color="var(--charcoal-200)" strokeWidth={1.5} /></span>
            <h3 style={styles.emptyTitle}>No dishes found</h3>
            <p style={styles.emptySub}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((dish, i) => (
              <DishCard key={dish.id} dish={dish} animDelay={i * 60} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "40px 0 80px", backgroundColor: "var(--cream)", minHeight: "100vh" },
  pageHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: "16px", marginBottom: "28px",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "16px" },
  pageIcon: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "60px", height: "60px", borderRadius: "18px",
    backgroundColor: "var(--green-50)", border: "1px solid var(--green-100)", flexShrink: 0,
  },
  pageTitle: { fontSize: "1.8rem", fontWeight: 800, color: "var(--charcoal)", margin: 0, letterSpacing: "-0.03em" },
  pageSub: { fontSize: "0.875rem", color: "var(--text-secondary)", margin: "4px 0 0" },
  searchWrap: {
    position: "relative", display: "flex", alignItems: "center",
    flex: "0 0 280px", maxWidth: "100%",
  },
  searchIcon: { position: "absolute", left: "12px", pointerEvents: "none" },
  searchInput: {
    width: "100%", padding: "10px 14px 10px 36px",
    borderRadius: "var(--radius-full)", border: "1.5px solid var(--border)",
    backgroundColor: "var(--surface)", fontSize: "0.875rem", color: "var(--charcoal)",
    fontFamily: "inherit", outline: "none",
    transition: "border-color var(--transition)",
  },
  filtersBar: {
    display: "flex", flexDirection: "column", gap: "10px",
    backgroundColor: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)", padding: "16px 20px", marginBottom: "24px",
  },
  filterGroup: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
  filterGroupLabel: { fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", flexShrink: 0 },
  filterPills: { display: "flex", flexWrap: "wrap", gap: "6px" },
  filterPill: {
    padding: "5px 14px", borderRadius: "var(--radius-full)",
    border: "1.5px solid var(--border)", backgroundColor: "transparent",
    fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)",
    cursor: "pointer", fontFamily: "inherit", transition: "all var(--transition)",
  },
  filterPillActive: {
    border: "1.5px solid var(--green-500)", backgroundColor: "var(--green-50)",
    color: "var(--green-600)", fontWeight: 600,
  },
  resultsCount: {
    fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "20px",
  },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px",
  },
  loadingWrap: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "80px 0",
  },
  loadingText: { fontSize: "0.9rem", color: "var(--text-secondary)" },
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "80px 0",
  },
  emptyIcon: { display: "flex", justifyContent: "center" },
  emptyTitle: { fontSize: "1.2rem", fontWeight: 700, color: "var(--charcoal)" },
  emptySub: { fontSize: "0.875rem", color: "var(--text-secondary)" },
};

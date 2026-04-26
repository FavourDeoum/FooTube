import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Flame, Beef, Wheat, Droplets, List, CheckCircle, User, BookOpen } from "lucide-react";
import { fetchDishById } from "../../../lib/api";
import { dishes } from "../../../lib/mockData";
import Badge from "../../components/ui/Badge";

// Generate static params for all dishes
export async function generateStaticParams() {
  return dishes.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dish = await fetchDishById(id);
  if (!dish) return { title: "Dish Not Found – FoodAI" };
  return {
    title: `${dish.name} – FoodAI`,
    description: dish.shortDescription,
  };
}

export default async function DishDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dish = await fetchDishById(id);
  if (!dish) notFound();

  return (
    <div style={styles.page}>
      <div className="page-wrapper" style={styles.backWrap}>
        <Link href="/explore" style={styles.backLink}>
          <ArrowLeft size={16} /> Back to Explore
        </Link>
      </div>

      {/* Main product header */}
      <div className="page-wrapper dish-detail-cols" style={styles.headerArea}>
        {/* Image Card */}
        <div style={styles.mainImageCard} className="animate-fade-in-up">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            priority
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Product Meta */}
        <div style={styles.headerMeta} className="animate-fade-in-up" strokeWidth="100ms">
          <div style={styles.badgeRow}>
            <Badge label={dish.category} variant="green" size="md" />
          </div>
          <h1 style={styles.headerTitle}>{dish.name}</h1>
          <p style={styles.headerDesc}>{dish.shortDescription}</p>
          <div style={styles.mealBadgeRow}>
            {dish.mealType.map((m) => (
               <Badge key={m} label={m} variant="cream" size="sm" />
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="page-wrapper" style={styles.body}>
        {/* Nutrition card */}
        <section style={styles.nutritionCard} aria-label="Nutritional information">
          <h2 style={styles.cardTitle}>
            <Flame size={18} color="var(--green-500)" /> Nutritional Information
          </h2>
          <div style={styles.nutritionGrid}>
            {[
              { icon: <Flame size={18} color="var(--green-500)" />, value: dish.nutrition.calories, unit: "kcal", label: "Calories" },
              { icon: <Beef size={18} color="var(--green-500)" />, value: `${dish.nutrition.protein}g`, unit: "", label: "Protein" },
              { icon: <Wheat size={18} color="var(--green-500)" />, value: `${dish.nutrition.carbs}g`, unit: "", label: "Carbohydrates" },
              { icon: <Droplets size={18} color="var(--green-500)" />, value: `${dish.nutrition.fat}g`, unit: "", label: "Fat" },
              { icon: <Wheat size={18} color="var(--green-500)" />, value: `${dish.nutrition.fiber}g`, unit: "", label: "Fiber" },
            ].map((n) => (
              <div key={n.label} style={styles.nutriCell}>
                <div style={styles.nutriIcon}>{n.icon}</div>
                <span style={styles.nutriVal}>{n.value}{n.unit}</span>
                <span style={styles.nutriLbl}>{n.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Two-column layout */}
        <div className="dish-detail-cols">
          {/* Left */}
          <div style={styles.leftCol}>
            {/* Ingredients */}
            <section style={styles.card} aria-label="Ingredients">
              <h2 style={styles.cardTitle}><List size={18} color="var(--green-500)" /> Ingredients</h2>
              <ul style={styles.ingredientList}>
                {dish.ingredients.map((ing) => (
                  <li key={ing} style={styles.ingredientItem}>
                    <span style={styles.bullet} />
                    {ing}
                  </li>
                ))}
              </ul>
            </section>

            {/* Dietary Labels */}
            <section style={styles.card} aria-label="Dietary suitability">
              <h2 style={styles.cardTitle}><CheckCircle size={18} color="var(--green-500)" /> Dietary Labels</h2>
              <div style={styles.badgeWrap}>
                {dish.dietaryLabels.map((l) => (
                  <Badge key={l} label={l} variant="green" size="md" />
                ))}
              </div>
            </section>

            {/* Suitable For */}
            <section style={styles.card} aria-label="Who this is suitable for">
              <h2 style={styles.cardTitle}><User size={18} color="var(--green-500)" /> Suitable For</h2>
              <div style={styles.badgeWrap}>
                {dish.suitableFor.map((s) => (
                  <Badge key={s} label={s} variant="cream" size="md" />
                ))}
              </div>
            </section>
          </div>

          {/* Right – Preparation steps */}
          <div style={styles.rightCol}>
            <section style={styles.card} aria-label="Preparation steps">
              <h2 style={styles.cardTitle}>
                <Clock size={18} color="var(--green-500)" /> Preparation Steps
              </h2>
              <ol style={styles.stepList}>
                {dish.preparationSteps.map((step, i) => (
                  <li key={i} style={styles.stepItem}>
                    <span style={styles.stepNum}>{i + 1}</span>
                    <p style={styles.stepText}>{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>

        {/* Full description */}
        <section style={styles.card} aria-label="About this dish">
          <h2 style={styles.cardTitle}><BookOpen size={18} color="var(--green-500)" /> About This Dish</h2>
          <p style={styles.description}>{dish.description}</p>
        </section>

        {/* CTA */}
        <div style={styles.ctaRow}>
          <Link href="/quick" style={styles.ctaBtn} id="dish-detail-quick-btn">
            Get Quick Recommendations
          </Link>
          <Link href="/personalized" style={styles.ctaOutlineBtn} id="dish-detail-personalized-btn">
            Try Personalised Mode
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { backgroundColor: "var(--cream)", minHeight: "100vh" },

  /* Header Area */
  backWrap: { paddingTop: "24px", paddingBottom: "16px" },
  backLink: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)",
    textDecoration: "none", width: "fit-content",
    transition: "color var(--transition)",
  },
  headerArea: { paddingBottom: "16px", alignItems: "center" },
  mainImageCard: {
    position: "relative", width: "100%", aspectRatio: "4 / 3",
    borderRadius: "24px", overflow: "hidden", boxShadow: "var(--shadow-md)",
    backgroundColor: "var(--cream-200)",
  },
  headerMeta: { display: "flex", flexDirection: "column", gap: "10px", padding: "12px 0" },
  badgeRow: { display: "flex", marginBottom: "4px" },
  headerTitle: { fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, color: "var(--charcoal)", margin: 0, letterSpacing: "-0.03em", lineHeight: 1.15 },
  headerDesc: { fontSize: "1.05rem", color: "var(--text-secondary)", margin: "0 0 8px", lineHeight: 1.6, maxWidth: "560px" },
  mealBadgeRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" },

  /* Body */
  body: { padding: "40px 0 80px", display: "flex", flexDirection: "column", gap: "20px" },

  /* Nutrition */
  nutritionCard: {
    backgroundColor: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)", padding: "24px 28px",
    boxShadow: "var(--shadow-sm)",
  },
  cardTitle: {
    display: "flex", alignItems: "center", gap: "8px",
    fontSize: "1rem", fontWeight: 700, color: "var(--charcoal)", marginBottom: "16px",
  },
  nutritionGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1px",
    backgroundColor: "var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden",
  },
  nutriCell: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
    padding: "16px 12px", backgroundColor: "var(--cream)",
  },
  nutriIcon: { marginBottom: "4px" },
  nutriVal: { fontSize: "1.2rem", fontWeight: 800, color: "var(--charcoal)", letterSpacing: "-0.02em" },
  nutriLbl: { fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 500 },

  /* Two-col */
  twoCol: {
    display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "20px", alignItems: "start",
  },
  leftCol: { display: "flex", flexDirection: "column", gap: "20px" },
  rightCol: {},
  card: {
    backgroundColor: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)", padding: "24px 28px", boxShadow: "var(--shadow-sm)",
  },
  ingredientList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" },
  ingredientItem: { display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.9rem", color: "var(--charcoal)" },
  bullet: { width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "var(--green-500)", marginTop: "6px", flexShrink: 0 },
  badgeWrap: { display: "flex", flexWrap: "wrap", gap: "8px" },
  stepList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" },
  stepItem: { display: "flex", gap: "14px", alignItems: "flex-start" },
  stepNum: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "28px", height: "28px", borderRadius: "50%",
    backgroundColor: "var(--green-500)", color: "#fff",
    fontSize: "0.78rem", fontWeight: 700, flexShrink: 0, marginTop: "2px",
  },
  stepText: { fontSize: "0.9rem", lineHeight: 1.6, color: "var(--charcoal)", margin: 0 },
  description: { fontSize: "0.95rem", lineHeight: 1.75, color: "var(--text-secondary)", margin: 0 },
  ctaRow: { display: "flex", gap: "12px", flexWrap: "wrap" },
  ctaBtn: {
    display: "inline-flex", alignItems: "center", padding: "12px 24px",
    borderRadius: "var(--radius-full)", backgroundColor: "var(--green-500)", color: "#fff",
    fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
  },
  ctaOutlineBtn: {
    display: "inline-flex", alignItems: "center", padding: "12px 24px",
    borderRadius: "var(--radius-full)", backgroundColor: "transparent",
    border: "1.5px solid var(--border)", color: "var(--charcoal)",
    fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
  },
};

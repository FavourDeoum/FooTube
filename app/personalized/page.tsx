"use client";

import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { supabase } from "../../lib/supabase";
import {
  Brain, ArrowLeft, ChevronRight, ChevronLeft,
  User, Heart, Salad, Activity, Lock
} from "lucide-react";
import { getPersonalizedRecommendations, recommendationReasons } from "../../lib/api";
import type { PersonalizedInput } from "../../lib/api";
import RecommendationCard from "../components/RecommendationCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Link from "next/link";

/* ── Step metadata ────────────────────────────────────────── */
const STEPS = [
  { label: "Basic Info", icon: <User size={16} /> },
  { label: "Health", icon: <Heart size={16} /> },
  { label: "Preferences", icon: <Salad size={16} /> },
];

const HEALTH_CONDITIONS = ["BP", "Hypertension", "Diabetes", "Allergies", "Ulcer", "Weight Loss", "Weight Gain", "None"];
const DIETARY_PREFS = ["Protein-rich meals", "Low-carb meals", "Vegetarian meals", "Balanced diet", "High-fiber meals"];
const FOOD_ALLERGIES = ["Groundnuts", "Seafood", "Dairy", "Gluten", "Eggs", "None"];
const ACTIVITY_LEVELS = [
  { value: "Low activity", label: "Sedentary", desc: "Little to no exercise" },
  { value: "Moderate activity", label: "Moderate", desc: "2–3 workouts/week" },
  { value: "High activity", label: "Active", desc: "Daily workouts" },
];
const MEAL_CATEGORIES = ["Breakfast", "Lunch", "Dinner"];

type MultiSelect = string[];

/* ── UI Components (ToggleChip & RadioCard) ───────────────── */
function ToggleChip({
  label, selected, onToggle, id,
}: { label: string; selected: boolean; onToggle: () => void; id: string }) {
  return (
    <button
      id={id}
      onClick={onToggle}
      style={{
        padding: "8px 16px",
        borderRadius: "var(--radius-full)",
        border: `2px solid ${selected ? "var(--green-500)" : "var(--border)"}`,
        backgroundColor: selected ? "var(--green-50)" : "var(--cream)",
        color: selected ? "var(--green-600)" : "var(--text-secondary)",
        fontFamily: "inherit",
        fontSize: "0.85rem",
        fontWeight: selected ? 600 : 500,
        cursor: "pointer",
        transition: "all var(--transition)",
      }}
    >
      {label}
    </button>
  );
}

function RadioCard({
  value, label, desc, selected, onSelect, id,
}: { value: string; label: string; desc: string; selected: boolean; onSelect: () => void; id: string }) {
  return (
    <button
      id={id}
      onClick={onSelect}
      style={{
        display: "flex", flexDirection: "column", gap: "4px",
        padding: "14px 18px", borderRadius: "var(--radius-md)",
        border: `2px solid ${selected ? "var(--green-500)" : "var(--border)"}`,
        backgroundColor: selected ? "var(--green-50)" : "var(--cream)",
        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
        transition: "all var(--transition)",
      }}
    >
      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: selected ? "var(--green-600)" : "var(--charcoal)" }}>
        {label}
      </span>
      <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{desc}</span>
    </button>
  );
}

export default function PersonalizedPage() {
  const { user, isLoaded } = useUser();
  const [mode, setMode] = useState<"checking" | "form" | "dashboard" | "unauthorized">("checking");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<any[] | null>(null);
  const [timeOfDayMeal, setTimeOfDayMeal] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  /* ── Form States ────────────────────────────────────────── */
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [healthConditions, setHealthConditions] = useState<MultiSelect>([]);
  const [customHealthCondition, setCustomHealthCondition] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [customDietaryPref, setCustomDietaryPref] = useState("");
  const [foodAllergies, setFoodAllergies] = useState<MultiSelect>(["None"]);
  const [customFoodAllergy, setCustomFoodAllergy] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [mealCategory, setMealCategory] = useState("");

  /* ── Sync logic ─────────────────────────────────────────── */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setMode("unauthorized");
      return;
    }

    async function fetchProfile() {
      try {
        const { data, error: dbError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user?.id)
          .single();

        if (data) {
          // Fill states from Database
          setName(data.name);
          setAge(data.age.toString());
          setGender(data.gender);
          setLocation(data.location || "");
          setWeight(data.weight ? data.weight.toString() : "");
          setHeight(data.height ? data.height.toString() : "");
          setHealthConditions(data.health_conditions || []);
          setDietaryPreference(data.dietary_preference || "");
          setFoodAllergies(data.food_allergies || ["None"]);
          setActivityLevel(data.activity_level || "");
          setMealCategory(data.meal_category || "");

          // Determine current meal time
          const hour = new Date().getHours();
          let autoMeal = "Lunch";
          if (hour >= 4 && hour < 11) autoMeal = "Breakfast";
          else if (hour >= 17 || hour < 4) autoMeal = "Dinner";
          setTimeOfDayMeal(autoMeal);

          // Get recommendations using DB values
          const input: PersonalizedInput = {
            name: data.name,
            age: data.age,
            gender: data.gender,
            healthConditions: data.health_conditions,
            dietaryPreference: data.dietary_preference,
            foodAllergies: data.food_allergies,
            activityLevel: data.activity_level,
            mealCategory: autoMeal,
          };

          const recs = await getPersonalizedRecommendations(input, user?.id);
          setResults(recs);
          setMode("dashboard");
        } else {
          // No profile found, go to form
          setName(user?.firstName || "");
          setMode("form");
        }
      } catch (err) {
        setMode("form");
      }
    }

    fetchProfile();
  }, [isLoaded, user]);

  /* ── Handlers ───────────────────────────────────────────── */
  function toggleMulti(list: MultiSelect, setList: (v: MultiSelect) => void, value: string, exclusive?: string) {
    if (exclusive && value === exclusive) { setList([exclusive]); return; }
    if (value !== exclusive) {
      const without = list.filter((v) => v !== exclusive);
      if (without.includes(value)) setList(without.filter((v) => v !== value));
      else setList([...without, value]);
    }
  }

  function addCustomHealthCondition() {
    if (customHealthCondition.trim() && !healthConditions.includes(customHealthCondition)) {
      setHealthConditions([...healthConditions, customHealthCondition.trim()]);
      setCustomHealthCondition("");
    }
  }

  function addCustomDietaryPref() {
    if (customDietaryPref.trim() && !dietaryPreference) {
      setDietaryPreference(customDietaryPref.trim());
      setCustomDietaryPref("");
    }
  }

  function addCustomFoodAllergy() {
    if (customFoodAllergy.trim() && !foodAllergies.includes(customFoodAllergy)) {
      setFoodAllergies([...foodAllergies, customFoodAllergy.trim()]);
      setCustomFoodAllergy("");
    }
  }

  function removeCustomHealth(item: string) {
    if (!HEALTH_CONDITIONS.includes(item)) {
      setHealthConditions(healthConditions.filter((h) => h !== item));
    }
  }

  function removeCustomAllergy(item: string) {
    if (!FOOD_ALLERGIES.includes(item)) {
      setFoodAllergies(foodAllergies.filter((a) => a !== item));
    }
  }

  function validateStep() {
    if (step === 0 && (!name.trim() || !age || !gender || !location.trim() || !weight || !height)) {
      setError("Please fill in all basic fields including weight and height."); return false;
    }
    if (step === 1 && healthConditions.length === 0) {
      setError("Please select at least one health condition (or 'None')."); return false;
    }
    if (step === 2 && (!dietaryPreference || !activityLevel || !mealCategory)) {
      setError("Please complete all preference fields."); return false;
    }
    setError(""); return true;
  }

  async function handleSubmit() {
    if (!validateStep() || !user) return;
    setLoading(true);

    const inputData = {
      id: user.id,
      name: name.trim(),
      age: parseInt(age),
      gender,
      location: location.trim(),
      weight: parseFloat(weight),
      height: parseFloat(height),
      health_conditions: healthConditions,
      dietary_preference: dietaryPreference,
      food_allergies: foodAllergies,
      activity_level: activityLevel,
      meal_category: mealCategory,
    };

    try {
      // 1. Save to Supabase (Upsert updates or creates)
      const { error: dbError } = await supabase
        .from("profiles")
        .upsert(inputData);

      if (dbError) throw dbError;

      // 2. Fetch AI Recommendations
      const recs = await getPersonalizedRecommendations({
        ...inputData,
        healthConditions,
        dietaryPreference,
        foodAllergies,
        activityLevel,
        mealCategory
      } as any, user?.id);

      setResults(recs);
      setTimeOfDayMeal(mealCategory);
      setMode("dashboard");
    } catch (err) {
      setError("Could not save your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleEditPreferences() {
    setMode("form");
    setStep(0);
  }

  /* ── Render logic ───────────────────────────────────────── */

  // 1. Loading state
  if (!isLoaded || mode === "checking") {
    return (
      <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <LoadingSpinner size={32} />
          <p style={{ color: 'var(--text-secondary)' }}>Preparing your personalized experience...</p>
        </div>
      </div>
    );
  }

  // 2. Not Logged In state
  if (mode === "unauthorized") {
    return (
      <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={styles.formCard}>
          <div style={{ ...styles.pageIcon, margin: '0 auto 20px' }}>
            <Lock size={28} color="var(--green-500)" />
          </div>
          <h1 style={styles.pageTitle}>Access Restricted</h1>
          <p style={{ ...styles.pageSub, marginBottom: '24px' }}>Please sign up or sign in to get personalized meal recommendations based on your health profile.</p>
          <SignInButton mode="modal">
            <button style={styles.nextBtn}>Sign In to Continue</button>
          </SignInButton>
        </div>
      </div>
    );
  }

  // 3. Dashboard state
  if (mode === "dashboard" && results) {
    return (
      <div style={styles.page}>
        <div className="page-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/" style={{ ...styles.backLink, marginBottom: 0 }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <button onClick={handleEditPreferences} style={{ ...styles.backLink, marginBottom: 0 }}>
              Edit Profile
            </button>
          </div>

          <div style={styles.resultsHeader}>
            <div>
              <h1 style={styles.pageTitle}>Good {timeOfDayMeal === "Breakfast" ? "Morning" : timeOfDayMeal === "Lunch" ? "Afternoon" : "Evening"}, {name.split(' ')[0]}!</h1>
              <p style={styles.pageSub}>Here are your smart <strong>{timeOfDayMeal}</strong> recommendations based on your profile.</p>
              {weight && height && (() => {
                const bmiVal = parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2);
                const bmiLabel = bmiVal < 18.5 ? "Underweight" : bmiVal < 25 ? "Normal" : bmiVal < 30 ? "Overweight" : "Obese";
                const bmiColor = bmiVal < 18.5 ? "#e67e22" : bmiVal < 25 ? "var(--green-600)" : bmiVal < 30 ? "#e67e22" : "#c0392b";
                return (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: `1.5px solid ${bmiColor}`, backgroundColor: `${bmiColor}15` }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: bmiColor }}>
                      BMI {bmiVal.toFixed(1)} · {bmiLabel}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      — recommendations tuned to your body
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
          <div style={styles.resultsGrid}>
            {results.map((dish, i) => (
              <RecommendationCard key={dish.id} dish={dish} reason={dish.recommendationReason || recommendationReasons[dish.id]} animDelay={i * 80} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. Form state
  return (
    <div style={styles.page}>
      <div className="page-wrapper" style={{ maxWidth: "720px" }}>
        <Link href="/" style={styles.backLink}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={styles.pageHeader}>
          <div style={styles.pageIcon}>
            <Brain size={28} color="var(--green-500)" strokeWidth={1.8} />
          </div>
          <div>
            <h1 style={styles.pageTitle}>Personalized Recommendations</h1>
            <p style={styles.pageSub}>Let's build your health profile for better meal matching.</p>
          </div>
        </div>

        <div style={styles.progressWrap}>
          {STEPS.map((s, i) => (
            <div key={s.label} style={styles.progressItem}>
              <div style={{ ...styles.progressDot, ...(i <= step ? styles.progressDotActive : {}), ...(i < step ? styles.progressDotDone : {}) }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ ...styles.progressLabel, color: i <= step ? "var(--charcoal)" : "var(--charcoal-200)" }}>{s.label}</span>
              {i < STEPS.length - 1 && (
                <div style={{ ...styles.progressLine, backgroundColor: i < step ? "var(--green-500)" : "var(--border)" }} />
              )}
            </div>
          ))}
        </div>

        <div style={styles.formCard} className="animate-fade-in">
          {step === 0 && (
            <div style={styles.stepBody}>
              <h2 style={styles.stepTitle}><User size={20} color="var(--green-500)" /> Basic Information</h2>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
              </div>
              <div style={styles.twoCol}>
                <div style={styles.field}>
                  <label style={styles.label}>Age</label>
                  <input type="number" style={styles.input} value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 28" />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Gender</label>
                  <div style={styles.genderRow}>
                    {["Male", "Female", "Other"].map((g) => (
                      <button key={g} onClick={() => setGender(g)} style={{ ...styles.genderBtn, ...(gender === g ? styles.genderBtnActive : {}) }}>{g}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={styles.twoCol}>
                <div style={styles.field}>
                  <label style={styles.label}>Weight (kg)</label>
                  <input
                    type="number"
                    min="20"
                    max="300"
                    step="0.1"
                    style={styles.input}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Height (cm)</label>
                  <input
                    type="number"
                    min="50"
                    max="250"
                    step="0.5"
                    style={styles.input}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                  />
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Location (Country)</label>
                <input style={styles.input} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Cameroon" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={styles.stepBody}>
              <h2 style={styles.stepTitle}><Heart size={20} color="var(--green-500)" /> Health Information</h2>
              <div style={styles.field}>
                <label style={styles.label}>Health Conditions <span style={styles.hint}>(select all that apply)</span></label>
                <div style={styles.chipGrid}>
                  {HEALTH_CONDITIONS.map((c) => (
                    <ToggleChip key={c} id={`health-${c}`} label={c} selected={healthConditions.includes(c)}
                      onToggle={() => toggleMulti(healthConditions, setHealthConditions, c, "None")} />
                  ))}
                </div>
                {healthConditions.filter(h => !HEALTH_CONDITIONS.includes(h)).map((custom) => (
                  <div key={custom} style={{ ...styles.customChip, display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: "var(--green-50)", border: "2px solid var(--green-500)", borderRadius: "var(--radius-full)", fontSize: "0.85rem", fontWeight: 600, color: "var(--green-600)" }}>
                    {custom}
                    <button onClick={() => removeCustomHealth(custom)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "1rem" }}>×</button>
                  </div>
                ))}
                <div style={styles.customInputRow}>
                  <input 
                    style={styles.customInput} 
                    placeholder="Or type your condition..." 
                    value={customHealthCondition} 
                    onChange={(e) => setCustomHealthCondition(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && addCustomHealthCondition()}
                  />
                  <button onClick={addCustomHealthCondition} style={styles.addBtn}>Add</button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={styles.stepBody}>
              <h2 style={styles.stepTitle}><Salad size={20} color="var(--green-500)" /> Your Preferences</h2>
              <div style={styles.field}>
                <label style={styles.label}>Preferred Food Type</label>
                <div style={styles.chipGrid}>
                  {DIETARY_PREFS.map((p) => (
                    <ToggleChip key={p} id={`diet-${p}`} label={p} selected={dietaryPreference === p} onToggle={() => setDietaryPreference(p)} />
                  ))}
                </div>
                {dietaryPreference && !DIETARY_PREFS.includes(dietaryPreference) && (
                  <div style={{ ...styles.customChip, display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: "var(--green-50)", border: "2px solid var(--green-500)", borderRadius: "var(--radius-full)", fontSize: "0.85rem", fontWeight: 600, color: "var(--green-600)" }}>
                    {dietaryPreference}
                    <button onClick={() => setDietaryPreference("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "1rem" }}>×</button>
                  </div>
                )}
                <div style={styles.customInputRow}>
                  <input 
                    style={styles.customInput} 
                    placeholder="Or type your preference..." 
                    value={customDietaryPref} 
                    onChange={(e) => setCustomDietaryPref(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && addCustomDietaryPref()}
                  />
                  <button onClick={addCustomDietaryPref} style={styles.addBtn}>Add</button>
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Food Allergies</label>
                <div style={styles.chipGrid}>
                  {FOOD_ALLERGIES.map((a) => (
                    <ToggleChip key={a} id={`allergy-${a}`} label={a} selected={foodAllergies.includes(a)}
                      onToggle={() => toggleMulti(foodAllergies, setFoodAllergies, a, "None")} />
                  ))}
                </div>
                {foodAllergies.filter(a => !FOOD_ALLERGIES.includes(a)).map((custom) => (
                  <div key={custom} style={{ ...styles.customChip, display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: "var(--green-50)", border: "2px solid var(--green-500)", borderRadius: "var(--radius-full)", fontSize: "0.85rem", fontWeight: 600, color: "var(--green-600)" }}>
                    {custom}
                    <button onClick={() => removeCustomAllergy(custom)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "1rem" }}>×</button>
                  </div>
                ))}
                <div style={styles.customInputRow}>
                  <input 
                    style={styles.customInput} 
                    placeholder="Or type an allergy..." 
                    value={customFoodAllergy} 
                    onChange={(e) => setCustomFoodAllergy(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && addCustomFoodAllergy()}
                  />
                  <button onClick={addCustomFoodAllergy} style={styles.addBtn}>Add</button>
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Activity Level</label>
                <div style={styles.activityGrid}>
                  {ACTIVITY_LEVELS.map((a) => (
                    <RadioCard key={a.value} id={`act-${a.label}`} value={a.value} label={a.label} desc={a.desc}
                      selected={activityLevel === a.value} onSelect={() => setActivityLevel(a.value)} />
                  ))}
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Preferred Meal Category</label>
                <div style={styles.chipGrid}>
                  {MEAL_CATEGORIES.map((m) => (
                    <ToggleChip key={m} id={`meal-${m}`} label={m} selected={mealCategory === m} onToggle={() => setMealCategory(m)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && <p style={styles.errorMsg}>{error}</p>}

          <div style={isMobile ? styles.navRowMobile : styles.navRow}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={isMobile ? styles.prevBtnMobile : styles.prevBtn}>
                <ChevronLeft size={16} /> Previous
              </button>
            )}
            {!isMobile && <div style={{ flex: 1 }} />}
            {step < STEPS.length - 1 ? (
              <button onClick={() => validateStep() && setStep(s => s + 1)} style={isMobile ? styles.nextBtnMobile : styles.nextBtn}>
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} style={{ ...(isMobile ? styles.nextBtnMobile : styles.nextBtn), opacity: loading ? 0.7 : 1 }}>
                {loading ? <LoadingSpinner size={18} /> : "Get Recommendations"} <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "40px 0 80px", backgroundColor: "var(--cream)", minHeight: "100vh" },
  backLink: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)",
    textDecoration: "none", marginBottom: "32px", border: "none",
    backgroundColor: "transparent", cursor: "pointer", fontFamily: "inherit",
  },
  pageHeader: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" },
  pageIcon: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "60px", height: "60px", borderRadius: "18px",
    backgroundColor: "var(--green-50)", border: "1px solid var(--green-100)", flexShrink: 0,
  },
  pageTitle: { fontSize: "1.8rem", fontWeight: 800, color: "var(--charcoal)", margin: 0, letterSpacing: "-0.03em" },
  pageSub: { fontSize: "0.9rem", color: "var(--text-secondary)", margin: "4px 0 0" },
  progressWrap: { display: "flex", alignItems: "center", marginBottom: "28px" },
  progressItem: { display: "flex", alignItems: "center", gap: "8px", flex: 1 },
  progressDot: {
    width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.8rem", fontWeight: 700, backgroundColor: "var(--cream-200)", color: "var(--charcoal-400)",
    border: "2px solid var(--border)", flexShrink: 0, transition: "all var(--transition)",
  },
  progressDotActive: { backgroundColor: "var(--green-500)", color: "#fff", borderColor: "var(--green-500)" },
  progressDotDone: { backgroundColor: "var(--green-200)", color: "var(--green-700)", borderColor: "var(--green-200)" },
  progressLabel: { fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap" },
  progressLine: { flex: 1, height: "2px", borderRadius: "1px", marginInline: "8px" },
  formCard: { backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "36px", boxShadow: "var(--shadow-md)" },
  stepBody: { display: "flex", flexDirection: "column", gap: "24px", marginBottom: "28px" },
  stepTitle: { display: "flex", alignItems: "center", gap: "10px", fontSize: "1.15rem", fontWeight: 700, color: "var(--charcoal)", margin: 0 },
  field: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontSize: "0.875rem", fontWeight: 600, color: "var(--charcoal)" },
  hint: { fontSize: "0.78rem", fontWeight: 400, color: "var(--text-secondary)", marginLeft: "4px" },
  input: { padding: "11px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)", backgroundColor: "var(--surface)", fontSize: "0.9rem", color: "var(--charcoal)", outline: "none", width: "100%" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  genderRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  genderBtn: { flex: 1, padding: "10px 8px", borderRadius: "var(--radius-md)", border: "2px solid var(--border)", backgroundColor: "var(--cream)", cursor: "pointer", fontSize: "0.875rem", color: "var(--text-secondary)" },
  genderBtnActive: { border: "2px solid var(--green-500)", backgroundColor: "var(--green-50)", color: "var(--green-600)", fontWeight: 600 },
  chipGrid: { display: "flex", flexWrap: "wrap", gap: "8px" },
  customInputRow: { display: "flex", gap: "8px", marginTop: "12px" },
  customInput: { flex: 1, padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)", backgroundColor: "var(--cream)", fontSize: "0.875rem", outline: "none" },
  addBtn: { padding: "10px 16px", borderRadius: "var(--radius-md)", border: "2px solid var(--green-500)", backgroundColor: "var(--green-500)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" },
  customChip: { display: "inline-flex", marginRight: "8px", marginBottom: "8px" },
  activityGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "10px" },
  navRow: { 
    display: "flex", 
    alignItems: "center", 
    paddingTop: "8px",
    gap: "12px"
  },
  navRowMobile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    paddingTop: "8px",
    gap: "12px"
  },
  prevBtn: { 
    display: "flex", 
    alignItems: "center", 
    gap: "6px", 
    padding: "10px 20px", 
    borderRadius: "var(--radius-full)", 
    border: "1.5px solid var(--border)", 
    backgroundColor: "transparent", 
    cursor: "pointer", 
    fontWeight: 600, 
    color: "var(--text-secondary)"
  },
  prevBtnMobile: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "12px 20px",
    borderRadius: "var(--radius-full)",
    border: "1.5px solid var(--border)",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontWeight: 600,
    color: "var(--text-secondary)",
    width: "100%",
    order: 1
  },
  nextBtn: { 
    display: "flex", 
    alignItems: "center", 
    gap: "6px", 
    padding: "12px 24px", 
    borderRadius: "var(--radius-full)", 
    border: "none", 
    backgroundColor: "var(--green-500)", 
    color: "#fff", 
    cursor: "pointer", 
    fontSize: "0.9rem", 
    fontWeight: 600
  },
  nextBtnMobile: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "12px 24px",
    borderRadius: "var(--radius-full)",
    border: "none",
    backgroundColor: "var(--green-500)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    width: "100%",
    order: 2
  },
  errorMsg: { color: "#c0392b", fontSize: "0.875rem", marginBottom: "12px", fontWeight: 500 },
  resultsHeader: { marginBottom: "28px" },
  resultsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" },
};
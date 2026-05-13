"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { fetchDishes, type Dish } from "../../lib/api";
import Image from "next/image";
import { 
  Trash2, Plus, X, Upload, Loader2, CheckCircle2, 
  LayoutDashboard, ClipboardList, UtensilsCrossed,
  Search, Filter
} from "lucide-react";

type Tab = "overview" | "add";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [dishesList, setDishesList] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    category: "Traditional",
    image: null as File | null,
    mealType: ["Lunch"],
    dietaryLabels: [] as string[],
    suitableFor: [] as string[],
    ingredients: "",
    preparationSteps: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    recommendationReason: ""
  });

  useEffect(() => {
    loadDishes();
  }, []);

  async function loadDishes() {
    setLoading(true);
    const data = await fetchDishes();
    setDishesList(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("dishes").delete().eq("id", id);
    if (error) {
      alert("Error deleting dish: " + error.message);
    } else {
      setDishesList(dishesList.filter((d) => d.id !== id));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleCheckboxChange = (name: "mealType" | "dietaryLabels", value: string) => {
    setFormData((prev) => {
      const current = prev[name] as string[];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setStatus(null);

    try {
      let imageUrl = "";

      // 1. Upload Image to Storage
      if (formData.image) {
        const fileExt = formData.image.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `dishes/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("dish-images")
          .upload(filePath, formData.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("dish-images")
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      // 2. Insert into Database
      const newDishId = formData.name.toLowerCase()
        .replace(/[^\w\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-");
      
      const { error: insertError } = await supabase.from("dishes").insert({
        id: newDishId,
        name: formData.name,
        short_description: formData.shortDescription,
        description: formData.description,
        image: imageUrl,
        category: formData.category,
        meal_type: formData.mealType,
        dietary_labels: formData.dietaryLabels,
        suitable_for: formData.suitableFor,
        ingredients: formData.ingredients.split(",").map(i => i.trim()),
        preparation_steps: formData.preparationSteps.split("\n").map(s => s.trim()).filter(Boolean),
        nutrition: {
          calories: Number(formData.calories),
          protein: Number(formData.protein),
          carbs: Number(formData.carbs),
          fat: Number(formData.fat),
          fiber: Number(formData.fiber)
        },
        recommendation_reason: formData.recommendationReason,
        is_available: true
      });

      if (insertError) throw insertError;

      setStatus({ type: "success", msg: `${formData.name} has been added to your menu!` });
      setFormData({
        name: "", shortDescription: "", description: "", category: "Traditional",
        image: null, mealType: ["Lunch"], dietaryLabels: [], suitableFor: [],
        ingredients: "", preparationSteps: "", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
        recommendationReason: ""
      });
      loadDishes();
      setActiveTab("overview");
    } catch (err: any) {
      console.error(err);
      setStatus({ type: "error", msg: err.message || "Failed to add dish" });
    } finally {
      setUploading(false);
    }
  };

  const filteredDishes = dishesList.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Sidebar / Navigation Area */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <UtensilsCrossed size={28} color="var(--green-600)" />
          <h1 style={styles.brandName}>SawaAdmin</h1>
        </div>
        
        <nav style={styles.nav}>
          <button 
            onClick={() => setActiveTab("overview")} 
            style={{...styles.navItem, ...(activeTab === "overview" ? styles.navItemActive : {})}}
          >
            <LayoutDashboard size={20} />
            <span>Menu Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab("add")} 
            style={{...styles.navItem, ...(activeTab === "add" ? styles.navItemActive : {})}}
          >
            <Plus size={20} />
            <span>Add New Meal</span>
          </button>
        </nav>

        <div style={styles.statsCard}>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Total Dishes</span>
            <span style={styles.statValue}>{dishesList.length}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerTitle}>
            <h2 style={styles.pageTitle}>
              {activeTab === "overview" ? "Manage Your Menu" : "Add a New Dish"}
            </h2>
            <p style={styles.pageSubtitle}>
              {activeTab === "overview" 
                ? "Update or remove meals currently available to users." 
                : "Fill out the details below to publish a new meal."}
            </p>
          </div>
        </header>

        {status && (
          <div style={{ ...styles.alert, backgroundColor: status.type === "success" ? "#ecfdf5" : "#fef2f2" }}>
            {status.type === "success" ? <CheckCircle2 size={18} color="#059669" /> : <X size={18} color="#dc2626" />}
            <span style={{ color: status.type === "success" ? "#065f46" : "#991b1b" }}>{status.msg}</span>
            <button onClick={() => setStatus(null)} style={styles.alertClose}><X size={14} /></button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {dishToDelete && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <div style={styles.modalHeader}>
                <div style={styles.modalIconBox}>
                  <Trash2 size={24} color="#dc2626" />
                </div>
                <h3 style={styles.modalTitle}>Delete Meal?</h3>
              </div>
              <p style={styles.modalText}>
                Are you sure you want to remove <strong>{dishToDelete.name}</strong>? This will permanently delete it from the menu.
              </p>
              <div style={styles.modalActions}>
                <button onClick={() => setDishToDelete(null)} style={styles.modalCancelBtn}>Keep Meal</button>
                <button onClick={() => {
                  handleDelete(dishToDelete.id);
                  setDishToDelete(null);
                }} style={styles.modalDeleteBtn}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "overview" ? (
          <section style={styles.contentSection}>
            <div style={styles.toolbar}>
              <div style={styles.searchBox}>
                <Search size={18} color="#9ca3af" />
                <input 
                  type="text" 
                  placeholder="Search dishes or categories..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
            </div>

            {loading ? (
              <div style={styles.loadingState}><Loader2 className="animate-spin" size={32} /> Loading menu...</div>
            ) : filteredDishes.length === 0 ? (
              <div style={styles.emptyState}>No dishes found. Try a different search.</div>
            ) : (
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Meal</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Calories</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDishes.map((dish) => (
                      <tr key={dish.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.mealCell}>
                            <div style={styles.mealThumb}>
                              <Image src={dish.image} alt={dish.name} fill style={{objectFit: "cover"}} />
                            </div>
                            <div>
                              <div style={styles.mealName}>{dish.name}</div>
                              <div style={styles.mealId}>ID: {dish.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}><span style={styles.categoryBadge}>{dish.category}</span></td>
                        <td style={styles.td}>{dish.nutrition.calories} kcal</td>
                        <td style={styles.td}>
                          <span style={styles.statusBadge}>Available</span>
                        </td>
                        <td style={styles.td}>
                          <button onClick={() => setDishToDelete(dish)} style={styles.iconDeleteBtn} title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : (
          <section style={styles.contentSection}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                {/* Basic Info */}
                <div style={styles.formGroupFull}>
                  <h3 style={styles.formSubTitle}>Basic Information</h3>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Dish Name</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} style={styles.input} placeholder="e.g. Achu with Yellow Soup" />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} style={styles.input}>
                    <option>Traditional</option>
                    <option>Soup</option>
                    <option>Protein</option>
                    <option>Breakfast</option>
                    <option>Light</option>
                    <option>Snack</option>
                  </select>
                </div>
                
                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Short Catchphrase</label>
                  <input required name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} style={styles.input} placeholder="One sentence highlight..." />
                </div>

                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Story / Description</label>
                  <textarea required name="description" value={formData.description} onChange={handleInputChange} style={{ ...styles.input, height: "100px" }} placeholder="Describe the origin and flavor profile..." />
                </div>

                {/* Media & Reasons */}
                <div style={styles.formGroupFull}><div style={styles.divider} /></div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Visual Representation</label>
                  <div style={styles.fileUpload}>
                    <Upload size={20} />
                    <span>{formData.image ? formData.image.name : "Select Meal Photo"}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Recommendation Reason</label>
                  <input name="recommendationReason" value={formData.recommendationReason} onChange={handleInputChange} style={styles.input} placeholder="Why should users try this?" />
                </div>

                {/* Details */}
                <div style={styles.formGroupFull}><div style={styles.divider} /></div>

                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Ingredients (separated by commas)</label>
                  <textarea name="ingredients" value={formData.ingredients} onChange={handleInputChange} style={{ ...styles.input, height: "60px" }} placeholder="Ground melon seeds, Palm oil, Spinach..." />
                </div>

                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Step-by-Step Preparation</label>
                  <textarea name="preparationSteps" value={formData.preparationSteps} onChange={handleInputChange} style={{ ...styles.input, height: "120px" }} placeholder="1. Blend spices...&#10;2. Sauté meat..." />
                </div>

                {/* Nutrition */}
                <div style={styles.formGroupFull}><div style={styles.divider} /></div>
                <div style={styles.formGroupFull}><h3 style={styles.formSubTitle}>Nutrition & Macros</h3></div>

                <div style={styles.nutritionGrid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Calories</label>
                    <input type="number" name="calories" value={formData.calories} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Protein (g)</label>
                    <input type="number" name="protein" value={formData.protein} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Carbs (g)</label>
                    <input type="number" name="carbs" value={formData.carbs} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Fat (g)</label>
                    <input type="number" name="fat" value={formData.fat} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Fiber (g)</label>
                    <input type="number" name="fiber" value={formData.fiber} onChange={handleInputChange} style={styles.input} />
                  </div>
                </div>

                {/* Classification */}
                <div style={{ gridColumn: "span 2", display: "flex", gap: "40px", marginTop: "10px" }}>
                  <div>
                    <label style={styles.label}>Meal Times</label>
                    <div style={styles.checkboxGroup}>
                      {["Breakfast", "Lunch", "Dinner"].map((t) => (
                        <label key={t} style={styles.checkboxLabel}>
                          <input type="checkbox" checked={formData.mealType.includes(t)} onChange={() => handleCheckboxChange("mealType", t)} /> {t}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={styles.label}>Dietary Tags</label>
                    <div style={styles.checkboxGroup}>
                      {["Gluten-Free", "Vegan", "High-Protein", "Low-Carb"].map((t) => (
                        <label key={t} style={styles.checkboxLabel}>
                          <input type="checkbox" checked={formData.dietaryLabels.includes(t)} onChange={() => handleCheckboxChange("dietaryLabels", t)} /> {t}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.formActions}>
                <button type="submit" disabled={uploading} style={styles.submitBtn}>
                  {uploading ? <><Loader2 className="animate-spin" size={20} /> Publishing...</> : <><Plus size={20} /> Publish to Menu</>}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily: "var(--font-outfit), sans-serif",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "white",
    borderRight: "1px solid #e5e7eb",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100vh",
    zIndex: 10,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
    padding: "0 10px",
  },
  brandName: {
    fontSize: "1.4rem",
    fontWeight: 900,
    color: "#111827",
    letterSpacing: "-0.02em",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "12px",
    color: "#6b7280",
    fontWeight: 600,
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "left",
  },
  navItemActive: {
    backgroundColor: "var(--green-50)",
    color: "var(--green-600)",
  },
  statsCard: {
    backgroundColor: "#111827",
    padding: "20px",
    borderRadius: "16px",
    color: "white",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontSize: "0.75rem",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  statValue: {
    fontSize: "1.8rem",
    fontWeight: 800,
  },
  main: {
    flex: 1,
    marginLeft: "280px",
    padding: "40px 60px",
  },
  header: {
    marginBottom: "40px",
  },
  headerTitle: {
    maxWidth: "800px",
  },
  pageTitle: {
    fontSize: "2.2rem",
    fontWeight: 800,
    color: "#111827",
    letterSpacing: "-0.03em",
  },
  pageSubtitle: {
    fontSize: "1.05rem",
    color: "#6b7280",
    marginTop: "4px",
  },
  alert: {
    padding: "16px 20px",
    borderRadius: "14px",
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "0.95rem",
    fontWeight: 600,
    position: "relative",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  alertClose: {
    position: "absolute",
    right: "15px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "inherit",
    opacity: 0.6,
  },
  contentSection: {
    backgroundColor: "white",
    borderRadius: "24px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    padding: "32px",
  },
  toolbar: {
    marginBottom: "24px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#f3f4f6",
    padding: "10px 18px",
    borderRadius: "12px",
    maxWidth: "400px",
  },
  searchInput: {
    background: "none",
    border: "none",
    outline: "none",
    fontSize: "0.95rem",
    color: "#111827",
    width: "100%",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #f3f4f6",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "0.95rem",
  },
  mealCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  mealThumb: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
    border: "1px solid #e5e7eb",
  },
  mealName: {
    fontWeight: 700,
    color: "#111827",
  },
  mealId: {
    fontSize: "0.75rem",
    color: "#9ca3af",
  },
  categoryBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    padding: "4px 10px",
    borderRadius: "6px",
  },
  statusBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    backgroundColor: "#ecfdf5",
    color: "#059669",
    padding: "4px 10px",
    borderRadius: "6px",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  iconDeleteBtn: {
    background: "none",
    border: "none",
    color: "#d1d5db",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  formGroupFull: {
    gridColumn: "span 2",
  },
  formSubTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "4px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#f3f4f6",
    width: "100%",
    margin: "10px 0",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#4b5563",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  input: {
    padding: "14px 18px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    fontSize: "1rem",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#f9fafb",
  },
  fileUpload: {
    border: "2px dashed #e5e7eb",
    borderRadius: "12px",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    color: "#6b7280",
    position: "relative",
    cursor: "pointer",
    backgroundColor: "#f9fafb",
  },
  fileInput: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    cursor: "pointer",
  },
  nutritionGrid: {
    gridColumn: "span 2",
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "16px",
  },
  checkboxGroup: {
    display: "flex",
    gap: "20px",
    marginTop: "12px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.95rem",
    color: "#374151",
    cursor: "pointer",
    fontWeight: 500,
  },
  formActions: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "flex-end",
  },
  submitBtn: {
    backgroundColor: "#111827",
    color: "white",
    border: "none",
    padding: "16px 40px",
    borderRadius: "14px",
    fontSize: "1.1rem",
    fontWeight: 800,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.2s ease",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "80px 0",
    color: "#6b7280",
    gap: "16px",
    fontWeight: 600,
  },
  emptyState: {
    padding: "60px 0",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "1rem",
    fontStyle: "italic",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modalCard: {
    backgroundColor: "white",
    width: "400px",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    animation: "modalFadeIn 0.3s ease-out",
  },
  modalHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
    textAlign: "center",
  },
  modalIconBox: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    backgroundColor: "#fef2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#111827",
    margin: 0,
  },
  modalText: {
    fontSize: "1rem",
    color: "#4b5563",
    lineHeight: 1.5,
    textAlign: "center",
    margin: "0 0 32px",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
  },
  modalCancelBtn: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    color: "#374151",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  modalDeleteBtn: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#dc2626",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(220, 38, 38, 0.2)",
  }
};

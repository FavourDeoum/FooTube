"use client";
 
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { fetchDishes, type Dish } from "../../lib/api";
import Image from "next/image";
import {
  Trash2, Plus, X, Upload, Loader2, CheckCircle2,
  LayoutDashboard, UtensilsCrossed, Search,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
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
    recommendationReason: "",
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
 
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };
 
  const handleCheckboxChange = (
    name: "mealType" | "dietaryLabels",
    value: string
  ) => {
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
 
      if (formData.image) {
        const fileExt = formData.image.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `dishes/${fileName}`;
 
        const { error: uploadError } = await supabase.storage
          .from("dish-images")
          .upload(filePath, formData.image);
 
        if (uploadError) throw uploadError;
 
        const {
          data: { publicUrl },
        } = supabase.storage.from("dish-images").getPublicUrl(filePath);
 
        imageUrl = publicUrl;
      }
 
      const newDishId = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
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
        ingredients: formData.ingredients.split(",").map((i) => i.trim()),
        preparation_steps: formData.preparationSteps
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        nutrition: {
          calories: Number(formData.calories),
          protein: Number(formData.protein),
          carbs: Number(formData.carbs),
          fat: Number(formData.fat),
          fiber: Number(formData.fiber),
        },
        recommendation_reason: formData.recommendationReason,
        is_available: true,
      });
 
      if (insertError) throw insertError;
 
      setStatus({
        type: "success",
        msg: `${formData.name} has been added to your menu!`,
      });
      setFormData({
        name: "",
        shortDescription: "",
        description: "",
        category: "Traditional",
        image: null,
        mealType: ["Lunch"],
        dietaryLabels: [],
        suitableFor: [],
        ingredients: "",
        preparationSteps: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        recommendationReason: "",
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
 
  const filteredDishes = dishesList.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  return (
    <>
      {/* ── Responsive styles injected once ── */}
      <style>{`
        .sawa-container {
          display: flex;
          min-height: 100vh;
          background-color: #f9fafb;
          font-family: var(--font-outfit), sans-serif;
          position: relative;
        }
 
        /* ── Sidebar ── */
        .sawa-sidebar {
          width: 260px;
          background-color: white;
          border-right: 1px solid #e5e7eb;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 50;
          transition: transform 0.25s ease;
        }
        @media (max-width: 768px) {
          .sawa-sidebar {
            transform: translateX(-100%);
          }
          .sawa-sidebar.open {
            transform: translateX(0);
          }
        }
 
        /* ── Sidebar overlay on mobile ── */
        .sawa-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 40;
        }
        @media (max-width: 768px) {
          .sawa-overlay.open { display: block; }
        }
 
        /* ── Mobile top bar ── */
        .sawa-topbar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 30;
        }
        @media (max-width: 768px) {
          .sawa-topbar { display: flex; }
        }
 
        /* ── Main ── */
        .sawa-main {
          flex: 1;
          margin-left: 260px;
          padding: 40px 60px;
          min-width: 0;
        }
        @media (max-width: 1024px) {
          .sawa-main { padding: 32px 32px; }
        }
        @media (max-width: 768px) {
          .sawa-main { margin-left: 0; padding: 20px 16px; }
        }
 
        /* ── Form grid ── */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; gap: 18px; }
        }
 
        .span-2 { grid-column: span 2; }
        @media (max-width: 640px) {
          .span-2 { grid-column: span 1; }
        }
 
        /* ── Nutrition grid ── */
        .nutrition-grid {
          grid-column: span 2;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .nutrition-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .nutrition-grid { grid-column: span 1; grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 380px) {
          .nutrition-grid { grid-template-columns: 1fr; }
        }
 
        /* ── Classification row ── */
        .classification-row {
          grid-column: span 2;
          display: flex;
          gap: 40px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        @media (max-width: 640px) {
          .classification-row {
            grid-column: span 1;
            gap: 24px;
            flex-direction: column;
          }
        }
 
        /* ── Checkbox group ── */
        .checkbox-group {
          display: flex;
          gap: 16px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
 
        /* ── Table responsive ── */
        .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
 
        /* ── Page title ── */
        .page-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.03em;
        }
        @media (max-width: 768px) {
          .page-title { font-size: 1.6rem; }
        }
 
        /* ── Content section ── */
        .content-section {
          background-color: white;
          border-radius: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          padding: 32px;
        }
        @media (max-width: 640px) {
          .content-section { padding: 20px 16px; border-radius: 16px; }
        }
 
        /* ── File upload ── */
        .file-upload {
          border: 2px dashed #e5e7eb;
          border-radius: 12px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #6b7280;
          position: relative;
          cursor: pointer;
          background-color: #f9fafb;
          text-align: center;
        }
 
        /* ── Nav items ── */
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #6b7280;
          font-weight: 600;
          border: none;
          background-color: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
          font-size: 0.95rem;
        }
        .nav-item.active {
          background-color: var(--green-50, #f0fdf4);
          color: var(--green-600, #16a34a);
        }
 
        /* ── Hamburger button ── */
        .hamburger {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #111827;
          border-radius: 2px;
          transition: 0.2s;
        }
      `}</style>
 
      <div className="sawa-container">
        {/* Mobile overlay */}
        <div
          className={`sawa-overlay${sidebarOpen ? " open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />
 
        {/* Mobile Top Bar */}
        <div className="sawa-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <UtensilsCrossed size={22} color="var(--green-600, #16a34a)" />
            <span style={{ fontWeight: 900, fontSize: "1.1rem", color: "#111827" }}>SawaAdmin</span>
          </div>
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
 
        {/* Sidebar */}
        <aside className={`sawa-sidebar${sidebarOpen ? " open" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px", padding: "0 10px" }}>
            <UtensilsCrossed size={28} color="var(--green-600, #16a34a)" />
            <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.02em", margin: 0 }}>SawaAdmin</h1>
          </div>
 
          <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <button
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
              className={`nav-item${activeTab === "overview" ? " active" : ""}`}
            >
              <LayoutDashboard size={20} />
              <span>Menu Overview</span>
            </button>
            <button
              onClick={() => { setActiveTab("add"); setSidebarOpen(false); }}
              className={`nav-item${activeTab === "add" ? " active" : ""}`}
            >
              <Plus size={20} />
              <span>Add New Meal</span>
            </button>
          </nav>
 
          <div style={{ backgroundColor: "#111827", padding: "20px", borderRadius: "16px", color: "white" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Dishes</span>
              <span style={{ fontSize: "1.8rem", fontWeight: 800 }}>{dishesList.length}</span>
            </div>
          </div>
        </aside>
 
        {/* Main Content */}
        <main className="sawa-main">
          <header style={{ marginBottom: "32px" }}>
            <h2 className="page-title">
              {activeTab === "overview" ? "Manage Your Menu" : "Add a New Dish"}
            </h2>
            <p style={{ fontSize: "1.05rem", color: "#6b7280", marginTop: "4px" }}>
              {activeTab === "overview"
                ? "Update or remove meals currently available to users."
                : "Fill out the details below to publish a new meal."}
            </p>
          </header>
 
          {status && (
            <div style={{
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
              backgroundColor: status.type === "success" ? "#ecfdf5" : "#fef2f2",
            }}>
              {status.type === "success"
                ? <CheckCircle2 size={18} color="#059669" />
                : <X size={18} color="#dc2626" />}
              <span style={{ color: status.type === "success" ? "#065f46" : "#991b1b" }}>{status.msg}</span>
              <button onClick={() => setStatus(null)} style={{ position: "absolute", right: "15px", background: "none", border: "none", cursor: "pointer", opacity: 0.6 }}>
                <X size={14} />
              </button>
            </div>
          )}
 
          {/* Delete Modal */}
          {dishToDelete && (
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
              <div style={{ backgroundColor: "white", width: "100%", maxWidth: "400px", padding: "32px", borderRadius: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "20px", textAlign: "center" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 size={24} color="#dc2626" />
                  </div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#111827", margin: 0 }}>Delete Meal?</h3>
                </div>
                <p style={{ fontSize: "1rem", color: "#4b5563", lineHeight: 1.5, textAlign: "center", margin: "0 0 32px" }}>
                  Are you sure you want to remove <strong>{dishToDelete.name}</strong>? This will permanently delete it from the menu.
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setDishToDelete(null)} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid #e5e7eb", backgroundColor: "white", color: "#374151", fontWeight: 700, cursor: "pointer" }}>
                    Keep Meal
                  </button>
                  <button onClick={() => { handleDelete(dishToDelete.id); setDishToDelete(null); }} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", backgroundColor: "#dc2626", color: "white", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(220,38,38,0.2)" }}>
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
 
          {/* ── Overview Tab ── */}
          {activeTab === "overview" ? (
            <section className="content-section">
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#f3f4f6", padding: "10px 18px", borderRadius: "12px", maxWidth: "400px" }}>
                  <Search size={18} color="#9ca3af" />
                  <input
                    type="text"
                    placeholder="Search dishes or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: "none", border: "none", outline: "none", fontSize: "0.95rem", color: "#111827", width: "100%" }}
                  />
                </div>
              </div>
 
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", color: "#6b7280", gap: "16px", fontWeight: 600 }}>
                  <Loader2 className="animate-spin" size={32} /> Loading menu...
                </div>
              ) : filteredDishes.length === 0 ? (
                <div style={{ padding: "60px 0", textAlign: "center", color: "#9ca3af", fontStyle: "italic" }}>
                  No dishes found. Try a different search.
                </div>
              ) : (
                <div className="table-wrap">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Meal", "Category", "Calories", "Status", "Actions"].map((h) => (
                          <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: "0.8rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f3f4f6" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDishes.map((dish) => (
                        <tr key={dish.id}>
                          <td style={{ padding: "16px", borderBottom: "1px solid #f3f4f6" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{ width: "48px", height: "48px", borderRadius: "10px", overflow: "hidden", position: "relative", flexShrink: 0, border: "1px solid #e5e7eb" }}>
                                <Image src={dish.image} alt={dish.name} fill style={{ objectFit: "cover" }} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: "#111827" }}>{dish.name}</div>
                                <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>ID: {dish.id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "16px", borderBottom: "1px solid #f3f4f6" }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "#f3f4f6", color: "#4b5563", padding: "4px 10px", borderRadius: "6px" }}>{dish.category}</span>
                          </td>
                          <td style={{ padding: "16px", borderBottom: "1px solid #f3f4f6", fontSize: "0.95rem" }}>{dish.nutrition.calories} kcal</td>
                          <td style={{ padding: "16px", borderBottom: "1px solid #f3f4f6" }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "#ecfdf5", color: "#059669", padding: "4px 10px", borderRadius: "6px" }}>Available</span>
                          </td>
                          <td style={{ padding: "16px", borderBottom: "1px solid #f3f4f6" }}>
                            <button onClick={() => setDishToDelete(dish)} style={{ background: "none", border: "none", color: "#d1d5db", cursor: "pointer", padding: "8px", borderRadius: "8px" }} title="Delete">
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
            /* ── Add New Meal Tab ── */
            <section className="content-section">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
 
                  {/* Section: Basic Info */}
                  <div className="span-2">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Basic Information</h3>
                  </div>
 
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={labelStyle}>Dish Name</label>
                    <input required name="name" value={formData.name} onChange={handleInputChange} style={inputStyle} placeholder="e.g. Achu with Yellow Soup" />
                  </div>
 
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={labelStyle}>Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} style={inputStyle}>
                      <option>Traditional</option>
                      <option>Soup</option>
                      <option>Protein</option>
                      <option>Breakfast</option>
                      <option>Light</option>
                      <option>Snack</option>
                    </select>
                  </div>
 
                  <div className="span-2" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={labelStyle}>Short Catchphrase</label>
                    <input required name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} style={inputStyle} placeholder="One sentence highlight..." />
                  </div>
 
                  <div className="span-2" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={labelStyle}>Story / Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleInputChange} style={{ ...inputStyle, height: "100px", resize: "vertical" }} placeholder="Describe the origin and flavor profile..." />
                  </div>
 
                  {/* Divider */}
                  <div className="span-2"><div style={dividerStyle} /></div>
 
                  {/* Media & Reason */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={labelStyle}>Visual Representation</label>
                    <div className="file-upload">
                      <Upload size={20} />
                      <span style={{ fontSize: "0.9rem" }}>{formData.image ? formData.image.name : "Select Meal Photo"}</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                    </div>
                  </div>
 
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={labelStyle}>Recommendation Reason</label>
                    <input name="recommendationReason" value={formData.recommendationReason} onChange={handleInputChange} style={inputStyle} placeholder="Why should users try this?" />
                  </div>
 
                  {/* Divider */}
                  <div className="span-2"><div style={dividerStyle} /></div>
 
                  {/* Ingredients & Steps */}
                  <div className="span-2" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={labelStyle}>Ingredients (separated by commas)</label>
                    <textarea name="ingredients" value={formData.ingredients} onChange={handleInputChange} style={{ ...inputStyle, height: "70px", resize: "vertical" }} placeholder="Ground melon seeds, Palm oil, Spinach..." />
                  </div>
 
                  <div className="span-2" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={labelStyle}>Step-by-Step Preparation</label>
                    <textarea name="preparationSteps" value={formData.preparationSteps} onChange={handleInputChange} style={{ ...inputStyle, height: "120px", resize: "vertical" }} placeholder={"1. Blend spices...\n2. Sauté meat..."} />
                  </div>
 
                  {/* Divider */}
                  <div className="span-2"><div style={dividerStyle} /></div>
 
                  {/* Nutrition */}
                  <div className="span-2">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Nutrition &amp; Macros</h3>
                  </div>
 
                  <div className="nutrition-grid">
                    {(["calories", "protein", "carbs", "fat", "fiber"] as const).map((field) => (
                      <div key={field} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={labelStyle}>
                          {field.charAt(0).toUpperCase() + field.slice(1)}{field !== "calories" ? " (g)" : ""}
                        </label>
                        <input type="number" name={field} value={formData[field]} onChange={handleInputChange} style={inputStyle} />
                      </div>
                    ))}
                  </div>
 
                  {/* Classification */}
                  <div className="classification-row">
                    <div>
                      <label style={labelStyle}>Meal Times</label>
                      <div className="checkbox-group">
                        {["Breakfast", "Lunch", "Dinner"].map((t) => (
                          <label key={t} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem", color: "#374151", cursor: "pointer", fontWeight: 500 }}>
                            <input type="checkbox" checked={formData.mealType.includes(t)} onChange={() => handleCheckboxChange("mealType", t)} /> {t}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Dietary Tags</label>
                      <div className="checkbox-group">
                        {["Gluten-Free", "Vegan", "High-Protein", "Low-Carb"].map((t) => (
                          <label key={t} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem", color: "#374151", cursor: "pointer", fontWeight: 500 }}>
                            <input type="checkbox" checked={formData.dietaryLabels.includes(t)} onChange={() => handleCheckboxChange("dietaryLabels", t)} /> {t}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
 
                {/* Submit */}
                <div style={{ marginTop: "40px", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="submit"
                    disabled={uploading}
                    style={{
                      backgroundColor: "#111827",
                      color: "white",
                      border: "none",
                      padding: "16px 40px",
                      borderRadius: "14px",
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      width: "auto",
                      minWidth: "200px",
                      justifyContent: "center",
                    }}
                  >
                    {uploading
                      ? <><Loader2 className="animate-spin" size={20} /> Publishing...</>
                      : <><Plus size={20} /> Publish to Menu</>}
                  </button>
                </div>
              </form>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
 
/* ── Shared style objects ── */
const labelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 700,
  color: "#4b5563",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};
 
const inputStyle: React.CSSProperties = {
  padding: "13px 16px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  fontSize: "0.95rem",
  fontFamily: "inherit",
  outline: "none",
  backgroundColor: "#f9fafb",
  width: "100%",
  boxSizing: "border-box",
};
 
const dividerStyle: React.CSSProperties = {
  height: "1px",
  backgroundColor: "#f3f4f6",
  width: "100%",
  margin: "8px 0",
};
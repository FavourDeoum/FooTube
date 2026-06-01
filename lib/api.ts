import { dishes, recommendationReasons, type Dish } from "./mockData";
export type { Dish };
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// ──────────────────────────────────────────────────────────────────
// Backend URL selection: local development or production
// ──────────────────────────────────────────────────────────────────
const DEFAULT_BACKEND_URL = "https://food-ai-backend-68mt.onrender.com";
const LOCAL_BACKEND_URL = "http://127.0.0.1:8000";

// Determine if we're in local development mode
const isLocalDev = typeof window !== "undefined" && 
  (window.location.hostname === "localhost" || 
   window.location.hostname === "127.0.0.1" ||
   window.location.hostname === "127.0.0.1:3000");

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 
  (isLocalDev ? LOCAL_BACKEND_URL : DEFAULT_BACKEND_URL);

// Flag to disable fallback to mock/Supabase when using local backend
export const USE_LOCAL_BACKEND_ONLY = isLocalDev;

// Fetch with a timeout so sleeping Render instances fail fast and we can fall back
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => {
    console.warn(`⏱️ Request timeout after ${timeoutMs}ms to ${url}`);
    controller.abort();
  }, timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

function mapDishFromDB(dbDish: any): Dish {
  return {
    id: dbDish.id,
    name: dbDish.name,
    shortDescription: dbDish.short_description,
    description: dbDish.description,
    image: dbDish.image,
    category: dbDish.category,
    mealType: dbDish.meal_type || [],
    dietaryLabels: dbDish.dietary_labels || [],
    suitableFor: dbDish.suitable_for || [],
    ingredients: dbDish.ingredients || [],
    preparationSteps: dbDish.preparation_steps || [],
    nutrition: dbDish.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    isAvailable: dbDish.is_available || false,
    recommendationReason: dbDish.recommendation_reason || "",
  };
}

// ── Fetch all dishes ─────────────────────────────────────────
export async function fetchDishes(): Promise<Dish[]> {
  const { data, error } = await supabase.from('dishes').select('*');
  if (error) {
    console.error('Error fetching dishes from Supabase:', error);
    return dishes;
  }
  if (!data) return [];
  return data.map(mapDishFromDB);
}

// ── Fetch a single dish by id ────────────────────────────────
export async function fetchDishById(id: string): Promise<Dish | null> {
  const { data, error } = await supabase.from('dishes').select('*').eq('id', id).single();
  if (error || !data) {
    console.error(`Error fetching dish ${id} from Supabase:`, error);
    return dishes.find((d) => d.id === id) ?? null;
  }
  return mapDishFromDB(data);
}

// ── Quick recommendations ────────────────────────────────────
export interface QuickRecommendationInput {
  mealType: string;
  foodCategory: string;
}

export async function getQuickRecommendations(
  input: QuickRecommendationInput
): Promise<Dish[]> {
  const allDishes = await fetchDishes();
  const filtered = allDishes.filter(
    (d) =>
      d.mealType.some((m) =>
        m.toLowerCase().includes(input.mealType.toLowerCase())
      ) ||
      d.category.toLowerCase().includes(input.foodCategory.toLowerCase())
  );
  return filtered.length > 0 ? filtered.slice(0, 4) : allDishes.slice(0, 4);
}

// ── Personalized recommendations via backend feed ─────────────

export async function getExploreFeed(userId?: string): Promise<Dish[]> {
  if (userId) {
    try {
      const res = await fetchWithTimeout(
        `${BACKEND_URL}/api/feed/${encodeURIComponent(userId)}`,
        { method: "GET" }
      );
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          return json.data.map((d: any) =>
            d.short_description !== undefined ? mapDishFromDB(d) : (d as Dish)
          );
        }
      }
    } catch (err) {
      if (USE_LOCAL_BACKEND_ONLY) {
        console.error("❌ Local backend unavailable at", BACKEND_URL, ":", err);
        throw new Error(`Cannot reach local backend at ${BACKEND_URL}. Is it running?`);
      }
      console.warn("⚠️ Backend explore feed unavailable, falling back to Supabase:", err);
    }
  }
  return fetchDishes(); // Fallback only if NOT local dev
}

export interface PersonalizedInput {
  name: string;
  age: number;
  gender: string;
  healthConditions: string[];
  dietaryPreference: string;
  foodAllergies: string[];
  activityLevel: string;
  mealCategory: string;
}

export async function getPersonalizedRecommendations(
  input: PersonalizedInput,
  userId?: string
): Promise<Dish[]> {
  // Try AI-powered backend first if userId is available
  if (userId) {
    try {
      const res = await fetchWithTimeout(
        `${BACKEND_URL}/api/feed/${encodeURIComponent(userId)}`,
        { method: "GET" }
      );
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((d: any) =>
            d.short_description !== undefined ? mapDishFromDB(d) : (d as Dish)
          );
          // Filter by meal category
          const filtered = mapped.filter((d: Dish) =>
            d.mealType.some((m) =>
              m.toLowerCase().includes(input.mealCategory.toLowerCase())
            )
          );
          return filtered.length > 0 ? filtered.slice(0, 4) : mapped.slice(0, 4);
        }
      }
    } catch (err) {
      if (USE_LOCAL_BACKEND_ONLY) {
        console.error("❌ Local backend unavailable at", BACKEND_URL, ":", err);
        throw new Error(`Cannot reach local backend at ${BACKEND_URL}. Is it running?`);
      }
      console.warn("⚠️ Backend feed unavailable, falling back to Supabase:", err);
    }
  }

  // Fallback: filter from Supabase (only if NOT local dev)
  if (USE_LOCAL_BACKEND_ONLY) {
    throw new Error(`Local backend required but unavailable at ${BACKEND_URL}`);
  }

  try {
    const allDishes = await fetchDishes();
    const filtered = allDishes.filter((d) =>
      d.mealType.some((m) =>
        m.toLowerCase().includes(input.mealCategory.toLowerCase())
      )
    );
    return filtered.length > 2 ? filtered.slice(0, 6) : allDishes.slice(0, 6);
  } catch (err) {
    console.warn("Supabase fallback also failed:", err);
    return [];
  }
}

// ── Chat message types ────────────────────────────────────────
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ── Send chat message to real AI backend ─────────────────────
export async function sendChatMessage(
  messages: ChatMessage[],
  userId: string,
  sessionId?: string | null
): Promise<{ reply: string; sessionId: string }> {
  const lastMsg = messages[messages.length - 1];
  const userMessage = lastMsg?.role === "user" ? lastMsg.content : "";

  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        session_id: sessionId || undefined,
        message: userMessage,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Backend chat error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return {
      reply: data.reply ?? "I'm here to help!",
      sessionId: data.session_id ?? sessionId ?? "",
    };
  } catch (err) {
    if (USE_LOCAL_BACKEND_ONLY) {
      console.error("❌ Local backend unavailable at", BACKEND_URL, ":", err);
      throw new Error(`Cannot reach local backend at ${BACKEND_URL}. Is it running?`);
    }
    throw err;
  }
}

// ── Identify a meal from an uploaded image ────────────────────
export async function identifyMealFromImage(
  imageFile: File,
  question?: string,
  userId?: string,
  sessionId?: string | null
): Promise<{ reply: string }> {
  const formData = new FormData();
  formData.append("image", imageFile);
  if (question) formData.append("question", question);
  if (userId) formData.append("user_id", userId);
  if (sessionId) formData.append("session_id", sessionId);

  try {
    const res = await fetch(`${BACKEND_URL}/api/identify-meal`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Identify meal error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return { reply: data.reply ?? "Could not identify the meal." };
  } catch (err) {
    if (USE_LOCAL_BACKEND_ONLY) {
      console.error("❌ Local backend unavailable at", BACKEND_URL, ":", err);
      throw new Error(`Cannot reach local backend at ${BACKEND_URL}. Is it running?`);
    }
    throw err;
  }
}

// ── Chat session management ───────────────────────────────────
export interface ChatSession {
  id: string;
  created_at: string;
  updated_at: string;
}

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/chat/sessions/${encodeURIComponent(userId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.sessions ?? [];
  } catch {
    return [];
  }
}

export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/chat/history/${encodeURIComponent(sessionId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.messages ?? []).map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content }));
  } catch {
    return [];
  }
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/chat/sessions/${encodeURIComponent(sessionId)}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error("Delete session error:", err);
  }
}

// ── Log a search query ────────────────────────────────────────
export async function logSearch(userId: string, query: string): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/search-log?user_id=${encodeURIComponent(userId)}&query=${encodeURIComponent(query)}`, {
      method: "POST",
    });
  } catch { /* best-effort */ }
}

// ── Sentiment / Reviews (Supabase direct) ────────────────────
export { recommendationReasons };

export async function fetchUserSentiment(userId: string, dishId: string) {
  const { data } = await supabase
    .from('dish_sentiments')
    .select('sentiment')
    .eq('user_id', userId)
    .eq('dish_id', dishId)
    .single();
  return data ? data.sentiment : null;
}

export async function saveDishSentiment({ userId, dishId, sentiment }: { userId: string, dishId: string, sentiment: string | null }) {
  if (sentiment === null) {
    await supabase
      .from('dish_sentiments')
      .delete()
      .eq('user_id', userId)
      .eq('dish_id', dishId);
    return;
  }
  const { error } = await supabase
    .from('dish_sentiments')
    .upsert({
      user_id: userId,
      dish_id: dishId,
      sentiment: sentiment,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,dish_id' });
  if (error) throw error;
}

// End of file

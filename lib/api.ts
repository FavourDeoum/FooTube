import { dishes, recommendationReasons, type Dish } from "./mockData";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

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
  };
}

// ── Fetch all dishes ─────────────────────────────────────────
export async function fetchDishes(): Promise<Dish[]> {
  const { data, error } = await supabase.from('dishes').select('*');
  if (error) {
    console.error('Error fetching dishes from Supabase:', error);
    return dishes; // fallback to mock data on error
  }
  if (!data) return [];
  return data.map(mapDishFromDB);
}

// ── Fetch a single dish by id ────────────────────────────────
export async function fetchDishById(id: string): Promise<Dish | null> {
  const { data, error } = await supabase.from('dishes').select('*').eq('id', id).single();
  if (error || !data) {
    console.error(`Error fetching dish ${id} from Supabase:`, error);
    return dishes.find((d) => d.id === id) ?? null; // fallback to mock
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
  // simple filter
  const filtered = allDishes.filter(
    (d) =>
      d.mealType.some((m) =>
        m.toLowerCase().includes(input.mealType.toLowerCase())
      ) ||
      d.category.toLowerCase().includes(input.foodCategory.toLowerCase())
  );
  return filtered.length > 0 ? filtered.slice(0, 4) : allDishes.slice(0, 4);
}

// ── Personalized recommendations ─────────────────────────────
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
  input: PersonalizedInput
): Promise<Dish[]> {
  const allDishes = await fetchDishes();
  // mock: filter by meal category and activity
  const filtered = allDishes.filter((d) =>
    d.mealType.some((m) =>
      m.toLowerCase().includes(input.mealCategory.toLowerCase())
    )
  );
  return filtered.length > 2 ? filtered.slice(0, 4) : allDishes.slice(0, 4);
}

// ── Chat ─────────────────────────────────────────────────────
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const chatReplies = [
  "That's a great question! Jollof rice is an excellent source of complex carbohydrates and pairs well with grilled chicken for a balanced meal.",
  "For someone with diabetes, I'd recommend pepper soup or grilled suya — both are low in carbohydrates and high in protein.",
  "Egusi soup is incredibly rich in protein and healthy fats. It's one of the most nutritious traditional soups!",
  "Moi Moi is an underrated superfood — packed with plant-based protein and fiber, it's perfect for vegetarians.",
  "I'd be happy to suggest meals based on your preferences! Could you tell me a bit about your dietary goals?",
  "Akara is a fantastic breakfast option — it's high in protein and fiber, keeping you full through the morning.",
];

export async function sendChatMessage(
  messages: ChatMessage[]
): Promise<string> {
  if (BACKEND_URL) {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.reply ?? data.message ?? "I'm here to help!";
    }
  }
  await delay(1200);
  return chatReplies[Math.floor(Math.random() * chatReplies.length)];
}

// ── Sentiment / Reviews ──────────────────────────────────────
export interface SentimentInput {
  userId: string;
  dishId: string;
  sentiment: "like" | "unlike";
}

// export async function saveDishSentiment(input: SentimentInput): Promise<void> {
//   if (BACKEND_URL) {
//     const res = await fetch(`${BACKEND_URL}/api/sentiments`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(input),
//     });
//     if (res.ok) return;
//   }
//   await delay(400);
//   // Mock: sentiment is saved locally in frontend state
// }

export { recommendationReasons };




export async function fetchUserSentiment(userId: string, dishId: string) {
  const { data, error } = await supabase
    .from('dish_sentiments')
    .select('sentiment')
    .eq('user_id', userId)
    .eq('dish_id', dishId)
    .single();
  
  return data ? data.sentiment : null;
}

export async function saveDishSentiment({ userId, dishId, sentiment }: { userId: string, dishId: string, sentiment: string | null }) {
  if (sentiment === null) {
    // If toggled off, delete the record
    await supabase
      .from('dish_sentiments')
      .delete()
      .eq('user_id', userId)
      .eq('dish_id', dishId);
    return;
  }

  // Upsert the sentiment
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

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws'; // Import the ws package
import { dishes, recommendationReasons } from './mockData';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Specific for Next.js .env.local files

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing environment variables");
  process.exit(1);
}

// Update the client initialization
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false, // Prevents the script from hanging
  },
  // realtime: {
  //   transport: ws, // This fixes the WebSocket error
  // },
});


async function uploadtest() {
  // --- ADD THIS DEBUG BLOCK ---
  console.log('Testing connection to:', supabaseUrl);
  try {
    const res = await fetch(supabaseUrl!);
    console.log('Connection test status:', res.status);
  } catch (e) {
    console.error('Connection test failed. Your computer cannot talk to Supabase:', e);
    return;
  }
  // --- END DEBUG BLOCK ---

  console.log('🔄 Mapping data for Supabase...');
  // ... rest of your code
}

async function upload() {
  console.log('🔄 Mapping data for Supabase...');

  const formattedData = dishes.map((dish) => ({
    id: dish.id,
    name: dish.name,
    short_description: dish.shortDescription,
    description: dish.description,
    image: dish.image,
    category: dish.category,
    meal_type: dish.mealType,
    dietary_labels: dish.dietaryLabels,
    suitable_for: dish.suitableFor,
    ingredients: dish.ingredients,
    preparation_steps: dish.preparationSteps,
    nutrition: dish.nutrition, // This goes into the JSONB column
    recommendation_reason: recommendationReasons[dish.id] || ''
  }));

  console.log(`🚀 Uploading ${formattedData.length} items...`);

  const { error } = await supabase
    .from('dishes')
    .upsert(formattedData, { onConflict: 'id' });

  if (error) {
    console.error('❌ Error during upload:', error.message);
  } else {
    console.log('✅ Success! Your mock data is now live in Supabase.');
  }
}

upload();
uploadtest();

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
// import WebSocket from "ws";

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket}
});

async function test() {
  console.log("Supabase URL:", supabaseUrl);
  const { data, error } = await supabase.from('dishes').select('*').limit(1);
  if (error) {
    console.error("Error fetching dishes:", error);
  } else {
    console.log("Dish Row Structure:", JSON.stringify(data[0], null, 2));
  }
}

test();

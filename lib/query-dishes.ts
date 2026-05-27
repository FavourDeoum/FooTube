import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

async function test() {
  const { data, error } = await supabase.from('dishes').select('id, name, suitable_for, recommendation_reason').limit(15);
  if (error) {
    console.error("Error fetching dishes:", error);
  } else {
    console.log("Dish Row Structures:\n", JSON.stringify(data, null, 2));
  }
}

test();

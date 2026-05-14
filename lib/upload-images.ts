import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import ws from 'ws';

// 1. Explicitly load .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug: Check if variables are loaded
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Environment variables not found in .env.local");
  console.log("Found URL:", !!supabaseUrl);
  console.log("Found Key:", !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
  // realtime: { transport: ws }
});

async function uploadImages() {
  const { data: dishes, error: fetchError } = await supabase
    .from('dishes')
    .select('id, image');

  if (fetchError) {
    console.error('Error fetching dishes:', fetchError);
    return;
  }

  console.log(`Found ${dishes?.length} dishes. Starting image sync...`);

  for (const dish of dishes || []) {
    // Skip if already a full URL
    if (dish.image.startsWith('http')) {
      console.log(`⏩ Skipping ${dish.id}, already has a URL.`);
      continue;
    }

    const fileName = dish.image.startsWith('/') ? dish.image.substring(1) : dish.image;
    const localPath = path.join(process.cwd(), 'public', fileName);

    if (!fs.existsSync(localPath)) {
      console.warn(`⚠️ File not found locally: ${localPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const extension = path.extname(fileName).toLowerCase().replace('.', '');
    const contentType = extension === 'png' ? 'image/png' : 'image/jpeg';

    console.log(`Uploading ${fileName}...`);
    const { error: uploadError } = await supabase.storage
      .from('dish-images')
      .upload(fileName, fileBuffer, {
        upsert: true,
        contentType: contentType
      });

    if (uploadError) {
      console.error(`❌ Error uploading ${fileName}:`, uploadError.message);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('dish-images')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('dishes')
      .update({ image: publicUrl })
      .eq('id', dish.id);

    if (updateError) {
      console.error(`❌ Error updating DB for ${dish.id}:`, updateError.message);
    } else {
      console.log(`✅ Success: ${dish.id} updated.`);
    }
  }

  console.log('🏁 Image migration complete!');
}

uploadImages();
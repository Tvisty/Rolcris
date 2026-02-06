
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// --- CONFIGURATION ---
const BUCKET_NAME = 'autoparc-rolcris-fba68.firebasestorage.app';
const FOLDER_PREFIX = 'car-images/'; // Matches the folder used in Admin.tsx

console.log("🔥 Starting Header Fix Script for Firebase Storage");
console.log("------------------------------------------------");

// 1. Load Service Account
let serviceAccount;
try {
  serviceAccount = require('./service-account.json');
} catch (e) {
  console.error("❌ ERROR: 'service-account.json' not found in the root directory.");
  console.error("   1. Go to Firebase Console > Project Settings > Service Accounts.");
  console.error("   2. Click 'Generate new private key'.");
  console.error("   3. Rename the file to 'service-account.json' and place it here.");
  process.exit(1);
}

// 2. Initialize Firebase Admin
try {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: BUCKET_NAME
  });
} catch (e) {
  console.error("❌ Error initializing Firebase:", e.message);
  process.exit(1);
}

const bucket = getStorage().bucket();

async function fixHeaders() {
  console.log(`🚀 Connected to bucket: ${BUCKET_NAME}`);
  console.log(`📂 Scanning folder: ${FOLDER_PREFIX}`);
  
  try {
    // Get all files in the folder
    const [files] = await bucket.getFiles({ prefix: FOLDER_PREFIX });
    console.log(`📊 Found ${files.length} files. Checking headers...`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const file of files) {
      // Skip the folder placeholder itself if it exists
      if (file.name.endsWith('/')) continue;

      try {
        // Get metadata to check if update is actually needed
        const [metadata] = await file.getMetadata();
        
        // Check if Cache-Control is already correct
        if (metadata.cacheControl === 'public, max-age=31536000, immutable') {
           skipped++;
           // Uncomment below to see skipped files
           // console.log(`⏭️  Skipped (already optimized): ${file.name}`);
           continue;
        }

        // Apply new metadata
        await file.setMetadata({
          cacheControl: 'public, max-age=31536000, immutable',
          // Optional: You can also force contentType here if some files are missing it
          // contentType: 'image/webp' 
        });

        console.log(`✅ Updated: ${file.name}`);
        updated++;

      } catch (err) {
        console.error(`❌ Failed: ${file.name} - ${err.message}`);
        errors++;
      }
    }

    console.log('\n------------------------------------------------');
    console.log(`🎉 Finished!`);
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors:  ${errors}`);
    console.log('------------------------------------------------');

  } catch (error) {
    console.error('CRITICAL ERROR:', error);
  }
}

fixHeaders();

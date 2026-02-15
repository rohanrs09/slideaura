#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Configuration Checker\n');
console.log('='.repeat(50));

// Check .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('   Create .env file from .env.example');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const hasFirebaseKey = envContent.includes('VITE_FIREBASE_API_KEY=') && 
                       !envContent.includes('VITE_FIREBASE_API_KEY=your_');

console.log('\n📋 Environment Variables:');
console.log('-------------------------');
console.log(`✓ .env file exists: ${fs.existsSync(envPath) ? 'Yes' : 'No'}`);
console.log(`${hasFirebaseKey ? '✓' : '❌'} VITE_FIREBASE_API_KEY: ${hasFirebaseKey ? 'Set' : 'Missing or placeholder'}`);

// Check FirebaseConfig.ts
const configPath = path.join(__dirname, 'config', 'FirebaseConfig.ts');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  console.log('\n🔧 Firebase Configuration:');
  console.log('-------------------------');
  
  // Extract project ID
  const projectIdMatch = configContent.match(/projectId:\s*"([^"]+)"/);
  if (projectIdMatch) {
    console.log(`✓ Project ID: ${projectIdMatch[1]}`);
  }
  
  // Check database name
  const dbNameMatch = configContent.match(/getFirestore\(app,\s*['"]([^'"]+)['"]\)/);
  if (dbNameMatch) {
    console.log(`⚠️  Database Name: "${dbNameMatch[1]}"`);
    console.log('   Note: Using named database. Make sure it exists in Firebase Console.');
    console.log('   Or change to: getFirestore(app) for default database');
  } else {
    console.log('✓ Using default Firestore database');
  }
}

console.log('\n🎯 Next Steps:');
console.log('='.repeat(50));

if (!hasFirebaseKey) {
  console.log('\n1️⃣  Set Firebase API Key:');
  console.log('   - Go to Firebase Console');
  console.log('   - Project Settings → Your apps');
  console.log('   - Copy apiKey value');
  console.log('   - Add to .env: VITE_FIREBASE_API_KEY=your_key');
}

console.log('\n2️⃣  Enable Firestore Database:');
console.log('   - Firebase Console → Firestore Database');
console.log('   - Click "Create Database"');
console.log('   - Choose "Start in test mode"');
console.log('   - Select location and enable');

console.log('\n3️⃣  Set Firestore Rules (Test Mode):');
console.log('   rules_version = \'2\';');
console.log('   service cloud.firestore {');
console.log('     match /databases/{database}/documents {');
console.log('       match /{document=**} {');
console.log('         allow read, write: if true;');
console.log('       }');
console.log('     }');
console.log('   }');

console.log('\n4️⃣  Restart Dev Server:');
console.log('   - Stop server (Ctrl+C)');
console.log('   - Clear browser cache');
console.log('   - Run: npm run dev');

console.log('\n📖 Full guide: See FIREBASE_SETUP_GUIDE.md');
console.log('='.repeat(50));
console.log('');

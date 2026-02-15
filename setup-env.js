#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 SlideAura Environment Setup');
console.log('==============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!');
  } else {
    console.log('❌ .env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Read current .env content
const envContent = fs.readFileSync(envPath, 'utf8');

// Check for required environment variables
const requiredVars = [
  'VITE_CLERK_PUBLISHABLE_KEY',
  'VITE_FIREBASE_API_KEY'
];

let needsUpdate = false;
const missingVars = [];

requiredVars.forEach(varName => {
  if (!envContent.includes(`${varName}=`) || envContent.includes(`${varName}=your_`)) {
    missingVars.push(varName);
    needsUpdate = true;
  }
});

if (needsUpdate) {
  console.log('\n⚠️  Missing Environment Variables:');
  console.log('=====================================');
  
  missingVars.forEach(varName => {
    console.log(`❌ ${varName}: Not set or using placeholder`);
  });
  
  console.log('\n📋 Setup Instructions:');
  console.log('========================');
  console.log('1. Get your Clerk Publishable Key from: https://dashboard.clerk.com');
  console.log('2. Get your Firebase API Key from: https://console.firebase.google.com');
  console.log('   - Go to Project Settings > General > Your apps');
  console.log('   - Click the web app icon to get the API key');
  console.log('3. Update the values in your .env file');
  console.log('\n📄 Your .env file is located at:', envPath);
  console.log('\n🔒 Security Note:');
  console.log('==================');
  console.log('• Only the Firebase API key is required from environment');
  console.log('• Other Firebase config uses default project settings');
  console.log('• Never commit your .env file to version control');
  console.log('• Use different keys for development and production');
  console.log('\n🔄 After updating the .env file, restart your development server.');
} else {
  console.log('✅ All required environment variables are set!');
}

console.log('\n🎉 Setup complete!');

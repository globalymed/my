#!/usr/bin/env node

// Environment Validation Script
require('dotenv').config();

const requiredVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_GEMINI_API_KEY',
  'RESEND_API_KEY'
];

console.log('🔍 Validating environment variables...');

let allValid = true;
requiredVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing`);
    allValid = false;
  }
});

if (allValid) {
  console.log('\n🎉 All required environment variables are set!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some environment variables are missing. Please check your .env file.');
  process.exit(1);
}

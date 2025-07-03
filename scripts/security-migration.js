#!/usr/bin/env node

/**
 * Environment Setup and Security Migration Script
 * This script helps migrate from hardcoded credentials to environment variables
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 MedYatra Security Migration Tool');
console.log('=====================================\n');

// Step 1: Check current .env files
console.log('1. Checking existing environment files...');

const envFiles = ['.env', '.env.local', '.env.new', 'functions/.env'];
let foundEnvFiles = [];

envFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    foundEnvFiles.push(file);
    console.log(`   ✅ Found: ${file}`);
  }
});

if (foundEnvFiles.length === 0) {
  console.log('   ⚠️  No environment files found');
}

// Step 2: Check for hardcoded credentials
console.log('\n2. Scanning for security issues...');

const securityIssues = [];

// Check for service account files
const serviceAccountPaths = [
  'serviceAccountKey.json',
  'testUpdatingMissingParaDb/serviceAccountKey.json',
  'functions/serviceAccountKey.json'
];

serviceAccountPaths.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    securityIssues.push({
      type: 'SERVICE_ACCOUNT',
      file: file,
      severity: 'HIGH',
      description: 'Firebase service account file found'
    });
  }
});

// Check for hardcoded API keys in built files
const builtFilePath = path.join(__dirname, '..', 'public', 'patient-dashboard-ai', 'assets');
if (fs.existsSync(builtFilePath)) {
  const files = fs.readdirSync(builtFilePath);
  files.forEach(file => {
    if (file.endsWith('.js')) {
      const content = fs.readFileSync(path.join(builtFilePath, file), 'utf8');
      if (content.includes('AIza')) {
        securityIssues.push({
          type: 'HARDCODED_API_KEY',
          file: `public/patient-dashboard-ai/assets/${file}`,
          severity: 'CRITICAL',
          description: 'Hardcoded API key found in built file'
        });
      }
    }
  });
}

// Report security issues
if (securityIssues.length > 0) {
  console.log('   🚨 Security issues found:');
  securityIssues.forEach(issue => {
    console.log(`      ${issue.severity === 'CRITICAL' ? '🔴' : '🟡'} ${issue.severity}: ${issue.description}`);
    console.log(`         File: ${issue.file}`);
  });
} else {
  console.log('   ✅ No obvious security issues detected');
}

// Step 3: Environment file recommendations
console.log('\n3. Environment setup recommendations...');

console.log(`
📋 NEXT STEPS:

1. 🔄 Replace your current .env with .env.new:
   mv .env.new .env

2. 🔑 Update API keys in .env with your actual values:
   - Replace placeholder values with real API keys
   - Ensure all keys are properly set

3. 🚫 Verify .gitignore excludes sensitive files:
   ✅ .env files are excluded
   ✅ serviceAccountKey.json files are excluded

4. 🗑️  Remove built files with hardcoded keys:
   rm -rf public/patient-dashboard-ai/assets/
   (Rebuild with environment variables)

5. 🔒 Set up Firebase Functions environment:
   firebase functions:config:set resend.api_key="your_resend_key"

6. 🧪 Test the setup:
   npm run test:env

📋 SECURITY CHECKLIST:
□ All API keys moved to environment variables
□ Service account files are in .gitignore
□ Built files regenerated without hardcoded keys
□ Firebase Functions config updated
□ Team members updated on new environment setup

⚠️  IMPORTANT: Never commit the new .env file to version control!
`);

// Step 4: Generate environment validation script
const validationScript = `#!/usr/bin/env node

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
    console.log(\`✅ \${varName}: Set\`);
  } else {
    console.log(\`❌ \${varName}: Missing\`);
    allValid = false;
  }
});

if (allValid) {
  console.log('\\n🎉 All required environment variables are set!');
  process.exit(0);
} else {
  console.log('\\n⚠️  Some environment variables are missing. Please check your .env file.');
  process.exit(1);
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'scripts', 'validate-env.js'), validationScript);
console.log('\n✅ Created environment validation script: scripts/validate-env.js');

console.log('\n🎯 Run "node scripts/validate-env.js" to validate your environment setup');

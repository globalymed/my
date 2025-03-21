/**
 * This script sets up the development environment by copying the 
 * patient-dashboard-ai build files to the public directory
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the paths
const distPath = path.join(__dirname, '../patient-dashboard-ai/dist');
const targetPath = path.join(__dirname, '../public/patient-dashboard-ai');

console.log('Setting up development environment for patient-dashboard-ai integration');

// Check if the patient-dashboard-ai/dist directory exists
if (!fs.existsSync(distPath)) {
  console.log('Building the patient-dashboard-ai application...');
  try {
    execSync('cd patient-dashboard-ai && npm run build', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to build patient-dashboard-ai. Please check the errors above.');
    process.exit(1);
  }
}

// Create the target directory if it doesn't exist
if (!fs.existsSync(targetPath)) {
  console.log(`Creating directory: ${targetPath}`);
  fs.mkdirSync(targetPath, { recursive: true });
}

// Copy files from dist to public/patient-dashboard-ai
console.log('Copying patient-dashboard-ai files to public directory...');
try {
  // On Windows
  if (process.platform === 'win32') {
    execSync(`xcopy /E /Y "${distPath}\\*" "${targetPath}\\"`, { stdio: 'inherit' });
  } 
  // On Unix-like systems
  else {
    execSync(`cp -R "${distPath}/"* "${targetPath}/"`, { stdio: 'inherit' });
  }
  console.log('Files copied successfully!');
} catch (error) {
  console.error('Failed to copy files:', error);
  process.exit(1);
}

console.log('Development environment setup complete!');
console.log('You can now run "npm start" to start the development server.'); 
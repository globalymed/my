// src/utils/passwordUtils.js
// Utility for generating secure passwords

/**
 * Generates a secure random password
 * @param {Number} length - Length of password (default: 10)
 * @param {Boolean} includeUppercase - Include uppercase letters
 * @param {Boolean} includeNumbers - Include numbers
 * @param {Boolean} includeSymbols - Include special symbols
 * @returns {String} - Generated password
 */
export const generateSecurePassword = (
  length = 10,
  includeUppercase = true, 
  includeNumbers = true, 
  includeSymbols = true
) => {
  // Character sets
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
  
  // Start with lowercase characters as base
  let chars = lowercaseChars;
  
  // Add other character sets based on options
  if (includeUppercase) chars += uppercaseChars;
  if (includeNumbers) chars += numberChars;
  if (includeSymbols) chars += symbolChars;
  
  // Generate the password
  let password = '';
  const randomValues = new Uint32Array(length);
  
  // Use crypto.getRandomValues if available (browser) or fallback to Math.random
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(randomValues);
  } else {
    // Fallback for non-browser environments
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * 4294967296);
    }
  }
  
  // Ensure password contains at least one character from each required set
  if (includeUppercase) {
    const pos = Math.floor(Math.random() * length);
    const char = uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    password += char;
  }
  
  if (includeNumbers) {
    const pos = Math.floor(Math.random() * length);
    const char = numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    password += char;
  }
  
  if (includeSymbols) {
    const pos = Math.floor(Math.random() * length);
    const char = symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
    password += char;
  }
  
  // Fill the rest of the password
  const remainingLength = length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = randomValues[i] % chars.length;
    password += chars.charAt(randomIndex);
  }
  
  // Shuffle the password to randomize the positions of required characters
  return shuffleString(password);
};

/**
 * Shuffle a string to randomize character positions
 * @param {String} str - String to shuffle
 * @returns {String} - Shuffled string
 */
const shuffleString = (str) => {
  const array = str.split('');
  
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  
  return array.join('');
};

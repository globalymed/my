// src/test-brevo.js
// This is a test script for the Brevo email integration

import { sendBookingConfirmationEmail, logEmailEvent } from './services/brevoService';

/**
 * Test sending an email with Brevo
 */
async function testBrevoEmailSending() {
  // Test data
  const testData = {
    email: 'your-email@example.com', // Replace with your email for testing
    firstName: 'Test',
    lastName: 'User',
    clinicName: 'Test Clinic',
    appointmentDate: '2025-03-21',
    appointmentTime: '10:00 AM',
    location: 'Test Location',
    treatmentType: 'Test Treatment',
    appointmentId: 'TEST-ID-' + Date.now()
  };

  console.log('Sending test email to', testData.email);
  
  try {
    // Send test email
    const result = await sendBookingConfirmationEmail(testData);
    
    // Log results
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Response:', result.data);
      logEmailEvent('success', { test: true, email: testData.email });
    } else {
      console.error('❌ Failed to send email:');
      console.error('Error:', result.error);
      console.error('Message:', result.message);
      logEmailEvent('failure', { test: true, email: testData.email, error: result.error });
    }
  } catch (error) {
    console.error('❌ Exception while sending email:');
    console.error(error);
    logEmailEvent('error', { test: true, email: testData.email, error: error.message });
  }
}

// Run the test
testBrevoEmailSending();

/**
 * To run this test:
 * 1. Update the test email address above
 * 2. From the project directory, run:
 *    node -r esm src/test-brevo.js
 * 
 * Note: You may need to install ESM first:
 *    npm install --save-dev esm
 */

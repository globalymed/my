const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');

// Load environment variables from .env file
require('dotenv').config();

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Initialize Resend API using environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

// Import user credential generation functions
const userCredentials = require('./generateUserCredentials');

// Export the functions
exports.generateCredentialsForUser = userCredentials.generateCredentialsForUser;
exports.generateCredentialsForAllUsers = userCredentials.generateCredentialsForAllUsers;
exports.triggerCredentialGeneration = userCredentials.triggerCredentialGeneration;

/**
 * Triggered when a new appointment is created in Firestore
 * Sends a confirmation email to the patient
 */
exports.sendBookingConfirmationEmail = functions.firestore
  .document('appointments/{appointmentId}')
  .onCreate(async (snapshot, context) => {
    console.log('=== EMAIL FUNCTION TRIGGERED ===');
    console.log('Function start time:', new Date().toISOString());
    
    try {
      const appointmentId = context.params.appointmentId;
      const appointmentData = snapshot.data();
      
      console.log('=== STEP 1: FUNCTION INITIALIZATION ===');
      console.log(`✅ Function triggered for appointment: ${appointmentId}`);
      console.log('✅ Appointment data retrieved successfully');
      console.log('📋 Full appointment data:', JSON.stringify(appointmentData, null, 2));
      
      // Check if we have the required fields
      console.log('=== STEP 2: DATA VALIDATION ===');
      console.log('👤 Patient Name:', appointmentData.patientName);
      console.log('📧 Patient Email:', appointmentData.patientEmail);
      console.log('🆔 User ID:', appointmentData.userId);
      console.log('🏥 Clinic Name:', appointmentData.clinicName);
      console.log('📅 Appointment Date:', appointmentData.appointmentDate);
      console.log('⏰ Appointment Time:', appointmentData.appointmentTime);
      
      // Get user data - try from users collection first, then fallback to appointment data
      console.log('=== STEP 3: USER DATA RETRIEVAL ===');
      let userData = null;
      let fullName = '';
      let userEmail = '';
      let hasCredentials = false;
      let userId = '';
      let userPassword = '';
      
      try {
        console.log('🔍 Attempting to fetch user from users collection...');
        console.log('🔗 User ID to query:', appointmentData.userId);
        
        // Try to get user from users collection
        const userRef = await db.collection('users').doc(appointmentData.userId).get();
        console.log('📊 User query executed, exists:', userRef.exists);
        
        if (userRef.exists) {
          userData = userRef.data();
          fullName = `${userData.firstName} ${userData.lastName}`;
          userEmail = userData.email;
          // Check for credentials - look for both 'id' and 'userId' fields, and password
          userId = userData.id || userData.userId || userData.email;
          userPassword = userData.password;
          hasCredentials = !!(userId && userPassword);
          
          console.log('✅ User found in users collection');
          console.log('👤 User full name:', fullName);
          console.log('📧 User email:', userEmail);
          console.log('🆔 User ID/Username:', userId);
          console.log('🔐 Has password:', !!userPassword);
          console.log('🔐 Has credentials:', hasCredentials);
          console.log('🗂️ Full user data:', JSON.stringify(userData, null, 2));
        } else {
          console.log('⚠️ User not found in users collection, using appointment data');
          fullName = appointmentData.patientName || 'Patient';
          userEmail = appointmentData.patientEmail;
          // For appointment-only data, we can still use default credentials if needed
          userId = appointmentData.patientEmail; // Use email as username
          userPassword = 'temp123'; // Default temporary password
          hasCredentials = !!(userId && userPassword);
          
          console.log('📋 Fallback data:');
          console.log('👤 Name from appointment:', fullName);
          console.log('📧 Email from appointment:', userEmail);
          console.log('🆔 Using email as username:', userId);
          console.log('🔐 Using temporary password');
          console.log('🔐 Has credentials:', hasCredentials);
          
          if (!userEmail) {
            console.error('❌ CRITICAL: No email address found in appointment data');
            throw new Error('No email address found in appointment data');
          }
          
          console.log('✅ Using appointment data with generated credentials');
        }
      } catch (userError) {
        console.log('⚠️ Error in user lookup, falling back to appointment data');
        console.error('🚨 User lookup error:', userError.message);
        console.error('🔍 Error stack:', userError.stack);
        
        // Fallback: use data directly from appointment document
        fullName = appointmentData.patientName || 'Patient';
        userEmail = appointmentData.patientEmail;
        // For error cases, still provide basic credentials
        userId = appointmentData.patientEmail || 'user@example.com';
        userPassword = 'temp123';
        hasCredentials = !!(userId && userPassword);
        
        console.log('📋 Final fallback data:');
        console.log('👤 Name:', fullName);
        console.log('📧 Email:', userEmail);
        console.log('🆔 Username:', userId);
        console.log('🔐 Has credentials:', hasCredentials);
        
        if (!userEmail) {
          console.error('❌ CRITICAL: No email address found in appointment or user data');
          throw new Error('No email address found in appointment or user data');
        }
      }
      
      // Final email validation
      console.log('=== STEP 4: FINAL EMAIL VALIDATION ===');
      if (!userEmail) {
        console.error('❌ CRITICAL: Final email validation failed - no email address');
        throw new Error('User does not have an email address');
      }
      console.log('✅ Email validation passed:', userEmail);
      
      // Create the HTML content using provided template
      console.log('=== STEP 5: EMAIL CONTENT CREATION ===');
      console.log('📝 Creating HTML email content...');
      console.log('🎨 Template variables:');
      console.log('  - Full Name:', fullName);
      console.log('  - Email:', userEmail);
      console.log('  - Has Credentials:', hasCredentials);
      console.log('  - User ID/Username:', userId);
      console.log('  - Password Available:', !!userPassword);
      console.log('  - Appointment ID:', appointmentId);
      
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MedYatra Appointment Confirmation</title>
</head>
<body>
  <p>Dear ${fullName},</p>

  <p>Thank you for choosing MedYatra for your healthcare needs. Your appointment has been successfully booked. Below are your appointment details:</p>

  <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p><strong>📅 Appointment Date:</strong> ${appointmentData.appointmentDate || "Not specified"}</p>
    <p><strong>⏰ Appointment Time:</strong> ${appointmentData.appointmentTime || "Not specified"}</p>
    <p><strong>🏥 Clinic Name:</strong> ${appointmentData.clinicName || "Our Clinic"}</p>
    <p><strong>📍 Location:</strong> ${appointmentData.location || "Our facility"}</p>
    <p><strong>🧑‍⚕️ Treatment Type:</strong> ${appointmentData.treatmentType || "medical consultation"}</p>
    <p><strong>🔢 Booking Reference:</strong> ${appointmentId}</p>
  </div>

  <div style="background: #e6f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #91d5ff;">
    <h3 style="margin-top: 0; color: #0050b3;">Your Account Credentials</h3>
    <p>To manage your appointment, access medical records, and receive important updates, please log in to your Med-Yatra account using the credentials below:</p>
    <p><strong>🔹 Username:</strong> ${userId}</p>
    <p><strong>🔹 Password:</strong> ${userPassword}</p>
    <p><strong>🔗 Login Here:</strong> <a href="https://patient.mediyatra.com/login" style="color: #1890ff;">https://patient.mediyatra.com/login</a></p>
    <p style="color: #f5222d; font-size: 0.9em;">For security reasons, we recommend changing your password after your first login.</p>
  </div>

  <p>Please arrive 15 minutes before your scheduled appointment time.</p>
  <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@mediyatra.com" style="color: #1890ff;">support@mediyatra.com</a> or call us at +91 8535079387.</p>
  <p>We look forward to assisting you on your healthcare journey!</p>
  <p>Best Regards,<br>The Med-Yatra Team</p>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #888; text-align: center;">
    <p>© 2023 Med-Yatra. All rights reserved.</p>
    <p>This email was sent to ${userEmail}. If you received this by mistake, please disregard this email.</p>
  </div>
</body>
</html>`;
      
      console.log('✅ HTML content created successfully');
      console.log('📏 Content length:', htmlContent.length, 'characters');
      
      // Send the email using Resend
      console.log('=== STEP 6: RESEND API CALL ===');
      console.log('🚀 Preparing to send email via Resend API...');
      console.log('📧 From: MediYatra Support <medyatraglobal@gmail.com>');
      console.log('📧 To:', [userEmail]);
      console.log('📧 Subject: Your Appointment is Confirmed – Login Details Inside');
      console.log('🔑 API Key (first 10 chars):', 're_iDE7d3YS_H...');
      console.log('⏰ Send attempt time:', new Date().toISOString());
      
      const response = await resend.emails.send({
        from: 'MediYatra Support <support@medyatra.space>',
        to: [userEmail],
        subject: 'Your Appointment is Confirmed – Login Details Inside',
        html: htmlContent,
      });
      
      console.log('=== STEP 7: RESEND API RESPONSE ===');
      console.log('✅ Resend API call completed');
      console.log('📊 Response received at:', new Date().toISOString());
      console.log('📋 Full response object:', JSON.stringify(response, null, 2));
      console.log('🆔 Response ID:', response.id);
      console.log('📧 Email sent successfully to:', userEmail);
      
      // Update the appointment record with email sent status
      console.log('=== STEP 8: FIRESTORE UPDATE ===');
      console.log('💾 Updating appointment document with email status...');
      console.log('🆔 Appointment ID:', appointmentId);
      console.log('🔗 Response ID for storage:', response.id || response.data?.id || 'unknown');
      
      const updateData = {
        emailSent: true,
        emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        emailResponseId: response.id || response.data?.id || 'unknown'
      };
      console.log('📋 Update data:', JSON.stringify(updateData, null, 2));
      
      await snapshot.ref.update(updateData);
      console.log('✅ Appointment document updated successfully');
      
      console.log('=== EMAIL FUNCTION COMPLETED SUCCESSFULLY ===');
      console.log('🎉 Total execution time:', new Date().toISOString());
      return { success: true, message: 'Confirmation email sent successfully' };
    } catch (error) {
      // Log error with full details
      console.log('=== EMAIL FUNCTION ERROR ===');
      console.error('❌ CRITICAL ERROR in email function');
      console.error('🚨 Error occurred at:', new Date().toISOString());
      console.error('📋 Error name:', error.name);
      console.error('📋 Error message:', error.message);
      console.error('📋 Error stack:', error.stack);
      console.error('📋 Error code:', error.code);
      console.error('📋 Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.body,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      // Try to update the appointment with error info
      console.log('💾 Attempting to save error details to appointment document...');
      try {
        const errorUpdateData = {
          emailSent: false,
          emailError: error.message,
          emailErrorDetails: {
            name: error.name,
            message: error.message,
            code: error.code,
            timestamp: new Date().toISOString()
          }
        };
        console.log('📋 Error update data:', JSON.stringify(errorUpdateData, null, 2));
        
        await snapshot.ref.update(errorUpdateData);
        console.log('✅ Error details saved to appointment document');
      } catch (updateError) {
        console.error('❌ Failed to update appointment with error status:', updateError);
        console.error('📋 Update error details:', updateError.message);
      }
      
      console.log('=== EMAIL FUNCTION ENDED WITH ERROR ===');
      // Return error information
      return { success: false, error: error.message };
    }
  });

/**
 * Utility function to send a test email
 * Can be called via HTTP to test email sending without creating an appointment
 */
exports.sendTestEmail = functions.https.onRequest(async (req, res) => {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }
    
    // Get parameters from request body
    const { email, firstName, lastName } = req.body;
    
    // Validate required parameters
    if (!email || !firstName || !lastName) {
      return res.status(400).send('Missing required parameters: email, firstName, lastName');
    }
    
    // Prepare the full name
    const fullName = `${firstName} ${lastName}`;
    
    // Create the HTML content using provided template
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Med-Yatra Appointment Confirmation</title>
</head>
<body>
  <p>Dear ${fullName},</p>

  <p>Thank you for choosing Med-Yatra for your healthcare needs. Your appointment has been successfully booked. Below are your appointment details:</p>

  <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p><strong>📅 Appointment Date:</strong> 2025-03-21</p>
    <p><strong>⏰ Appointment Time:</strong> 10:00 AM</p>
    <p><strong>🏥 Clinic Name:</strong> Test Clinic</p>
    <p><strong>📍 Location:</strong> Test Location</p>
    <p><strong>🧑‍⚕️ Treatment Type:</strong> Test Treatment</p>
    <p><strong>🔢 Booking Reference:</strong> TEST-APPOINTMENT-ID</p>
  </div>

  <div style="background: #e6f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #91d5ff;">
    <h3 style="margin-top: 0; color: #0050b3;">Your Account Credentials</h3>
    <p>To manage your appointment, access medical records, and receive important updates, please log in to your Med-Yatra account using the credentials below:</p>
    <p><strong>🔹 Username:</strong> ${email}</p>
    <p><strong>🔹 Password:</strong> TestPass123!</p>
    <p><strong>🔗 Login Here:</strong> <a href="https://patient.mediyatra.com/login" style="color: #1890ff;">https://patient.mediyatra.com/login</a></p>
    <p style="color: #f5222d; font-size: 0.9em;">For security reasons, we recommend changing your password after your first login.</p>
  </div>

  <p>Please arrive 15 minutes before your scheduled appointment time.</p>
  <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@mediyatra.com" style="color: #1890ff;">support@mediyatra.com</a> or call us at +91 9876543210.</p>
  <p>We look forward to assisting you on your healthcare journey!</p>
  <p>Best Regards,<br>The Med-Yatra Team</p>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #888; text-align: center;">
    <p>© 2023 Med-Yatra. All rights reserved.</p>
    <p>This email was sent to ${email}. If you received this by mistake, please disregard this email.</p>
  </div>
</body>
</html>`;
    
    // Send the email using Resend
    const response = await resend.emails.send({
      from: 'MedYatra Support <support@medyatra.space>',
      to: [email],
      subject: 'Your Appointment is Confirmed – Login Details Inside',
      html: htmlContent,
    });
    
    // Log and return success
    console.log(`Test email sent successfully to ${email}`, response);
    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      data: response
    });
  } catch (error) {
    // Log and return error
    console.error('Error sending test email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

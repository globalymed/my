const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
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
 * HTTP Cloud Function to handle password reset requests
 * Validates email and sends reset instructions
 */
exports.resetPassword = functions.https.onRequest(async (req, res) => {
  // Enable CORS for all origins
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).send();
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed', valid: false });
    return;
  }

  console.log('=== PASSWORD RESET FUNCTION TRIGGERED ===');
  console.log('Function start time:', new Date().toISOString());
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  try {
    const { email } = req.body;

    // Validate email parameter
    if (!email) {
      console.log('❌ Email parameter missing');
      res.status(400).json({ 
        error: 'Email parameter is required', 
        valid: false,
        message: 'Please provide an email address'
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      res.status(400).json({ 
        error: 'Invalid email format', 
        valid: false,
        message: 'Please provide a valid email address'
      });
      return;
    }

    console.log('=== STEP 1: EMAIL VALIDATION ===');
    console.log('✅ Email format valid:', email);

    // Check if email exists in users collection (patients)
    console.log('=== STEP 2: CHECKING USERS COLLECTION ===');
    const usersRef = db.collection('users');
    const userQuery = usersRef.where('email', '==', email);
    const userSnapshot = await userQuery.get();

    let userFound = false;
    let userType = '';
    let userData = null;
    let doctorSnapshot = null; // Declare doctorSnapshot variable

    if (!userSnapshot.empty) {
      userFound = true;
      userType = 'patient';
      userData = userSnapshot.docs[0].data();
      console.log('✅ User found in users collection (patient)');
    } else {
      console.log('⚠️ User not found in users collection, checking doctors...');
      
      // Check if email exists in doctors collection
      console.log('=== STEP 3: CHECKING DOCTORS COLLECTION ===');
      const doctorsRef = db.collection('doctors');
      const doctorQuery = doctorsRef.where('email', '==', email);
      doctorSnapshot = await doctorQuery.get();

      if (!doctorSnapshot.empty) {
        userFound = true;
        userType = 'doctor';
        userData = doctorSnapshot.docs[0].data();
        console.log('✅ User found in doctors collection (doctor)');
      } else {
        console.log('❌ User not found in either collection');
      }
    }

    if (!userFound) {
      res.status(404).json({ 
        error: 'Email not found', 
        valid: false,
        message: 'No account found with this email address'
      });
      return;
    }

    console.log('=== STEP 4: GENERATING NEW PASSWORD ===');
    
    // Generate a secure password using the same function from generateUserCredentials
    function generateSecurePassword(length = 12) {
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}';
      let password = '';
      
      // Ensure at least one uppercase, one lowercase, one digit, and one special character
      password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
      password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
      password += '0123456789'[Math.floor(Math.random() * 10)];
      password += '!@#$%^&*()-_=+[]{}'[Math.floor(Math.random() * 20)];
      
      // Fill the remaining length with random characters
      for (let i = 4; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
      }
      
      // Shuffle the password
      return password.split('').sort(() => 0.5 - Math.random()).join('');
    }

    const newPassword = generateSecurePassword(12);
    console.log('✅ New secure password generated');

    console.log('=== STEP 5: UPDATING FIRESTORE DOCUMENT ===');
    
    // Update the user's password in Firestore
    const collectionName = userType === 'patient' ? 'users' : 'doctors';
    const docId = userType === 'patient' ? 
      userSnapshot.docs[0].id : 
      doctorSnapshot.docs[0].id;
    
    await db.collection(collectionName).doc(docId).update({
      password: newPassword,
      passwordResetAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`✅ Password updated in ${collectionName} collection for document ID: ${docId}`);

    console.log('=== STEP 6: SENDING PASSWORD RESET EMAIL ===');
    
    const emailData = {
      from: 'MedYatra Support <support@medyatra.space>',
      to: [email],
      subject: 'Password Reset Successful - MedYatra',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - MedYatra</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #333; font-size: 28px; margin: 0;">MedYatra</h1>
              <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Healthcare Made Simple</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="color: #333; font-size: 24px; margin: 0 0 20px 0;">Password Reset Successful</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hello ${userData.firstName || 'User'},
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Your password has been successfully reset for your ${userType} account associated with <strong>${email}</strong>.
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Here are your new login credentials:
              </p>
              
              <div style="background-color: #e8f5e8; padding: 20px; border-radius: 6px; border-left: 4px solid #4caf50;">
                <p style="margin: 0; color: #333; font-size: 16px;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 10px 0 0 0; color: #333; font-size: 16px;"><strong>New Password:</strong> ${newPassword}</p>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                <strong>Important:</strong> For security reasons, we recommend changing this password to something more memorable after logging in.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://medyatra.space/login" style="background-color: #4caf50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Login Now</a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                If you didn't request this password reset, please contact our support team immediately.
              </p>
              <p style="color: #999; font-size: 14px; margin: 10px 0 0 0;">
                This is an automated email, please do not reply.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2025 MedYatra. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email using Resend
    const result = await resend.emails.send(emailData);
    
    console.log('✅ Password reset email sent successfully');
    console.log('Email result:', JSON.stringify(result, null, 2));
    
    res.status(200).json({ 
      valid: true,
      success: true,
      message: 'Password reset successful. Your new password has been sent to your email.',
      userType: userType,
      emailSent: true
    });

  } catch (error) {
    console.error('❌ Error in resetPassword function:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      valid: false,
      message: 'An error occurred while processing your request. Please try again later.'
    });
  }
});

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

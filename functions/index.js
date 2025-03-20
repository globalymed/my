const functions = require('firebase-functions');
const admin = require('firebase-admin');
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Initialize Brevo API
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = "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";

// Template ID for booking confirmation emails
const BREVO_TEMPLATE_ID = 3;

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
    try {
      const appointmentId = context.params.appointmentId;
      const appointmentData = snapshot.data();
      
      // Log the appointment creation
      console.log(`New appointment created: ${appointmentId}`);
      console.log('Appointment data:', JSON.stringify(appointmentData, null, 2));
      
      // Get the user data to send email
      const userRef = await db.collection('users').doc(appointmentData.userId).get();
      
      if (!userRef.exists) {
        throw new Error(`User with ID ${appointmentData.userId} not found`);
      }
      
      const userData = userRef.data();
      console.log('User data:', JSON.stringify(userData, null, 2));
      
      // Make sure we have an email to send to
      if (!userData.email) {
        throw new Error('User does not have an email address');
      }
      
      // Prepare API instance
      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      
      // Create sender and recipient objects
      const sender = { email: "medyatraglobal@gmail.com", name: "MediYatra Support" };
      const recipients = [{ email: userData.email }];
      
      // Prepare email data 
      const fullName = `${userData.firstName} ${userData.lastName}`;
      const hasCredentials = !!(userData.id && userData.password);
      
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
    <p><strong>📅 Appointment Date:</strong> ${appointmentData.appointmentDate || "Not specified"}</p>
    <p><strong>⏰ Appointment Time:</strong> ${appointmentData.appointmentTime || "Not specified"}</p>
    <p><strong>🏥 Clinic Name:</strong> ${appointmentData.clinicName || "Our Clinic"}</p>
    <p><strong>📍 Location:</strong> ${appointmentData.location || "Our facility"}</p>
    <p><strong>🧑‍⚕️ Treatment Type:</strong> ${appointmentData.treatmentType || "medical consultation"}</p>
    <p><strong>🔢 Booking Reference:</strong> ${appointmentId}</p>
  </div>

  ${hasCredentials ? `
  <div style="background: #e6f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #91d5ff;">
    <h3 style="margin-top: 0; color: #0050b3;">Your Account Credentials</h3>
    <p>To manage your appointment, access medical records, and receive important updates, please log in to your Med-Yatra account using the credentials below:</p>
    <p><strong>🔹 Username:</strong> ${userData.id}</p>
    <p><strong>🔹 Password:</strong> ${userData.password}</p>
    <p><strong>🔗 Login Here:</strong> <a href="https://patient.mediyatra.com/login" style="color: #1890ff;">https://patient.mediyatra.com/login</a></p>
    <p style="color: #f5222d; font-size: 0.9em;">For security reasons, we recommend changing your password after your first login.</p>
  </div>
  ` : ''}

  <p>Please arrive 15 minutes before your scheduled appointment time.</p>
  <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@mediyatra.com" style="color: #1890ff;">support@mediyatra.com</a> or call us at +91 9876543210.</p>
  <p>We look forward to assisting you on your healthcare journey!</p>
  <p>Best Regards,<br>The Med-Yatra Team</p>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #888; text-align: center;">
    <p>© 2023 Med-Yatra. All rights reserved.</p>
    <p>This email was sent to ${userData.email}. If you received this by mistake, please disregard this email.</p>
  </div>
</body>
</html>`;
      
      // Create email object
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.sender = sender;
      sendSmtpEmail.to = recipients;
      sendSmtpEmail.subject = "Your Appointment is Confirmed – Login Details Inside";
      sendSmtpEmail.htmlContent = htmlContent;
      
      // Log the email object before sending
      console.log('Email object to be sent:', JSON.stringify(sendSmtpEmail, null, 2));
      
      // Send the email
      console.log('Attempting to send email...');
      const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
      
      // Log success
      console.log(`Confirmation email sent successfully to ${userData.email}`, response);
      
      // Update the appointment record with email sent status
      await snapshot.ref.update({
        emailSent: true,
        emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        emailResponseId: response.messageId
      });
      
      return { success: true, message: 'Confirmation email sent successfully' };
    } catch (error) {
      // Log error with full details
      console.error('Error sending confirmation email:', error);
      console.error('Error stack:', error.stack);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.body,
        status: error.response?.status
      });
      
      // Try to update the appointment with error info
      try {
        await snapshot.ref.update({
          emailSent: false,
          emailError: error.message,
          emailErrorDetails: {
            code: error.code,
            status: error.response?.status,
            body: error.response?.body
          }
        });
      } catch (updateError) {
        console.error('Error updating appointment with email status:', updateError);
      }
      
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
    
    // Initialize API instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // Create sender and recipient objects
    const sender = { email: "medyatraglobal@gmail.com", name: "MediYatra Support" };
    const recipients = [{ email: email }];
    
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
    <p><strong>🔹 Username:</strong> testuser</p>
    <p><strong>🔹 Password:</strong> testpassword123</p>
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
    
    // Create email object
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.to = recipients;
    sendSmtpEmail.subject = "Your Appointment is Confirmed – Login Details Inside";
    sendSmtpEmail.htmlContent = htmlContent;
    
    // Send the email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
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

// functions/generateUserCredentials.js
// Firebase Cloud Function to generate credentials for existing users

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Initialize Brevo API
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = "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";

// Template ID for confirmation emails
const BREVO_TEMPLATE_ID = 3;

// Generate a secure random password
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

// Send credentials email via Brevo API
async function sendCredentialsEmail(userData) {
  try {
    console.log('Starting to send credentials email to:', userData.email);
    console.log('User data:', JSON.stringify(userData, null, 2));
    
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // Create email data
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    // Create the HTML content using provided template
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Med-Yatra Appointment Confirmation</title>
</head>
<body>
  <p>Dear ${userData.firstName} ${userData.lastName},</p>

  <p>Thank you for choosing Med-Yatra for your healthcare needs. Below are your account credentials:</p>

  <div style="background: #e6f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #91d5ff;">
    <h3 style="margin-top: 0; color: #0050b3;">Your Account Credentials</h3>
    <p>To manage your appointment, access medical records, and receive important updates, please log in to your Med-Yatra account using the credentials below:</p>
    <p><strong>🔹 Username:</strong> ${userData.id}</p>
    <p><strong>🔹 Password:</strong> ${userData.password}</p>
    <p><strong>🔗 Login Here:</strong> <a href="https://patient.mediyatra.com/login" style="color: #1890ff;">https://patient.mediyatra.com/login</a></p>
    <p style="color: #f5222d; font-size: 0.9em;">For security reasons, we recommend changing your password after your first login.</p>
  </div>

  <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@mediyatra.com" style="color: #1890ff;">support@mediyatra.com</a> or call us at +91 9876543210.</p>
  <p>We look forward to assisting you on your healthcare journey!</p>
  <p>Best Regards,<br>The Med-Yatra Team</p>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #888; text-align: center;">
    <p>© 2023 Med-Yatra. All rights reserved.</p>
    <p>This email was sent to ${userData.email}. If you received this by mistake, please disregard this email.</p>
  </div>
</body>
</html>`;
    
    // Set email properties
    sendSmtpEmail.sender = { name: 'MediYatra Support', email: 'medyatraglobal@gmail.com' };
    sendSmtpEmail.to = [{ email: userData.email, name: `${userData.firstName} ${userData.lastName}` }];
    sendSmtpEmail.subject = "Your Med-Yatra Account Credentials";
    sendSmtpEmail.htmlContent = htmlContent;
    
    // Log the email object before sending
    console.log('Email object to be sent:', JSON.stringify(sendSmtpEmail, null, 2));
    
    // Send email
    console.log('Attempting to send email...');
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    // Log error with full details
    console.error('Error sending email:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.body,
      status: error.response?.status
    });
    
    // Try sending direct email without template as a fallback
    try {
      console.log('Attempting to send fallback email...');
      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      
      // Create direct email with simpler HTML in case the main template fails
      sendSmtpEmail.sender = { name: 'MediYatra Support', email: 'medyatraglobal@gmail.com' };
      sendSmtpEmail.to = [{ email: userData.email, name: `${userData.firstName} ${userData.lastName}` }];
      sendSmtpEmail.subject = 'Your MediYatra Account Credentials';
      
      // Simplified HTML content with credentials
      sendSmtpEmail.htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #1890ff;">Your MediYatra Account Credentials</h2>
            <p>Dear ${userData.firstName} ${userData.lastName},</p>
            <p>We have created an account for you to access your medical appointments and records.</p>
            
            <div style="background: #e6f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #91d5ff;">
              <h3 style="margin-top: 0; color: #0050b3;">Your Account Details</h3>
              <p><strong>User ID:</strong> ${userData.id}</p>
              <p><strong>Password:</strong> ${userData.password}</p>
              <p style="color: #f5222d; font-size: 0.9em;">Please keep this information secure and change your password after first login.</p>
            </div>
            
            <p>You can use these credentials to login to your MediYatra account and manage your appointments.</p>
            <p>If you have any questions, please contact our support team at support@mediyatra.com.</p>
            <p>Best regards,</p>
            <p>MediYatra Team</p>
          </body>
        </html>
      `;
      
      // Log the fallback email object
      console.log('Fallback email object to be sent:', JSON.stringify(sendSmtpEmail, null, 2));
      
      // Send the direct email
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Fallback email sent successfully:', result);
      return { success: true, data: result };
    } catch (fallbackError) {
      console.error('Error sending fallback email:', fallbackError);
      console.error('Fallback error stack:', fallbackError.stack);
      console.error('Fallback error details:', {
        message: fallbackError.message,
        code: fallbackError.code,
        response: fallbackError.response?.body,
        status: fallbackError.response?.status
      });
      throw fallbackError;
    }
  }
}

// HTTP function to generate credentials for a specific user
exports.generateCredentialsForUser = functions.https.onCall(async (data, context) => {
  try {
    // Validate input data
    if (!data || !data.userId) {
      throw new Error('User ID is required');
    }
    
    const { userId } = data;
    
    // Get user data
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const userData = userDoc.data();
    
    // Check if user already has a password
    if (userData.password) {
      return {
        success: false,
        message: 'User already has credentials',
        userId: userId
      };
    }
    
    // Generate password
    const password = generateSecurePassword(12);
    
    // Update user document with password
    await admin.firestore().collection('users').doc(userId).update({
      password: password,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Send email with credentials
    const emailData = {
      id: userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: password
    };
    
    const emailResult = await sendCredentialsEmail(emailData);
    
    return {
      success: true,
      message: 'Credentials generated and sent successfully',
      userId: userId,
      emailSent: emailResult.success
    };
  } catch (error) {
    console.error('Error generating credentials:', error);
    return {
      success: false,
      message: error.message,
      error: error.toString()
    };
  }
});

// Scheduled function to generate credentials for all users without passwords
exports.generateCredentialsForAllUsers = functions.pubsub.schedule('0 0 * * *') // Run daily at midnight
  .timeZone('Asia/Kolkata') // Indian Standard Time
  .onRun(async (context) => {
    try {
      console.log('Starting scheduled credential generation job');
      
      // Get all users who don't have a password
      const usersSnapshot = await admin.firestore()
        .collection('users')
        .where('password', '==', null)
        .get();
      
      if (usersSnapshot.empty) {
        console.log('No users found without credentials');
        return null;
      }
      
      console.log(`Found ${usersSnapshot.size} users without credentials`);
      
      // Process each user
      const promises = usersSnapshot.docs.map(async (userDoc) => {
        const userId = userDoc.id;
        const userData = userDoc.data();
        
        // Generate password
        const password = generateSecurePassword(12);
        
        // Update user document
        await admin.firestore().collection('users').doc(userId).update({
          password: password,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Send email with credentials
        const emailData = {
          id: userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: password
        };
        
        try {
          const emailResult = await sendCredentialsEmail(emailData);
          return {
            userId,
            success: true,
            emailSent: emailResult.success
          };
        } catch (emailError) {
          console.error(`Failed to send email to user ${userId}:`, emailError);
          return {
            userId,
            success: true,
            emailSent: false,
            error: emailError.message
          };
        }
      });
      
      // Wait for all operations to complete
      const results = await Promise.all(promises);
      
      console.log('Credential generation job completed:', {
        processed: results.length,
        successful: results.filter(r => r.success).length,
        emailsSent: results.filter(r => r.emailSent).length
      });
      
      return results;
    } catch (error) {
      console.error('Error in scheduled credential generation:', error);
      return null;
    }
  });

// HTTP function to trigger the credential generation for all users manually
exports.triggerCredentialGeneration = functions.https.onRequest(async (req, res) => {
  try {
    console.log('Starting manual credential generation job');
    
    // Get all users who don't have a password
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('password', '==', null)
      .get();
    
    if (usersSnapshot.empty) {
      console.log('No users found without credentials');
      res.status(200).json({ success: true, message: 'No users found without credentials' });
      return;
    }
    
    console.log(`Found ${usersSnapshot.size} users without credentials`);
    
    // Process each user
    const promises = usersSnapshot.docs.map(async (userDoc) => {
      const userId = userDoc.id;
      const userData = userDoc.data();
      
      // Generate password
      const password = generateSecurePassword(12);
      
      // Update user document
      await admin.firestore().collection('users').doc(userId).update({
        password: password,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Send email with credentials
      const emailData = {
        id: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: password
      };
      
      try {
        const emailResult = await sendCredentialsEmail(emailData);
        return {
          userId,
          success: true,
          emailSent: emailResult.success
        };
      } catch (emailError) {
        console.error(`Failed to send email to user ${userId}:`, emailError);
        return {
          userId,
          success: true,
          emailSent: false,
          error: emailError.message
        };
      }
    });
    
    // Wait for all operations to complete
    const results = await Promise.all(promises);
    
    console.log('Credential generation job completed:', {
      processed: results.length,
      successful: results.filter(r => r.success).length,
      emailsSent: results.filter(r => r.emailSent).length
    });
    
    res.status(200).json({
      success: true,
      processed: results.length,
      successful: results.filter(r => r.success).length,
      emailsSent: results.filter(r => r.emailSent).length,
      results: results
    });
  } catch (error) {
    console.error('Error in manual credential generation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

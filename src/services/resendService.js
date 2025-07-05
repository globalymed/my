// src/services/resendService.js
// This service handles sending emails using Resend API
// NOTE: This is deprecated - all email sending now happens via Firebase Cloud Functions

const RESEND_API_KEY = process.env.REACT_APP_RESEND_API_KEY;

// Validate API key is available
if (!RESEND_API_KEY) {
  console.warn('REACT_APP_RESEND_API_KEY is not set. Email sending from frontend is disabled.');
}

/**
 * Send a booking confirmation email using Resend
 * @param {Object} bookingData - Data related to the booking
 * @returns {Promise<Object>} - Response from Resend API
 */
export const sendBookingConfirmationEmail = async (bookingData) => {
  try {
    // Validate required fields
    if (!bookingData.email || !bookingData.firstName || !bookingData.lastName) {
      throw new Error("Missing required fields: email, firstName, or lastName");
    }

    // Log the request for debugging
    console.log("Sending email with data:", {
      email: bookingData.email,
      name: `${bookingData.firstName} ${bookingData.lastName}`,
    });

    // Prepare data for Resend API
    const fullName = `${bookingData.firstName} ${bookingData.lastName}`;
    
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
    <p><strong>📅 Appointment Date:</strong> ${bookingData.appointmentDate || "Not specified"}</p>
    <p><strong>⏰ Appointment Time:</strong> ${bookingData.appointmentTime || "Not specified"}</p>
    <p><strong>🏥 Clinic Name:</strong> ${bookingData.clinicName || "Our Clinic"}</p>
    <p><strong>📍 Location:</strong> ${bookingData.location || "Our facility"}</p>
    <p><strong>🧑‍⚕️ Treatment Type:</strong> ${bookingData.treatmentType || "medical consultation"}</p>
    <p><strong>🔢 Booking Reference:</strong> ${bookingData.appointmentId || ""}</p>
  </div>

  ${bookingData.userId && bookingData.password ? `
  <div style="background: #e6f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #91d5ff;">
    <h3 style="margin-top: 0; color: #0050b3;">Your Account Credentials</h3>
    <p>To manage your appointment, access medical records, and receive important updates, please log in to your Med-Yatra account using the credentials below:</p>
    <p><strong>🔹 Username:</strong> ${bookingData.email}</p>
    <p><strong>🔹 Password:</strong> ${bookingData.password}</p>
    <p><strong>🔗 Login Here:</strong> <a href="https://patient.mediyatra.com/login" style="color: #1890ff;">https://patient.mediyatra.com/login</a></p>
    <p style="color: #f5222d; font-size: 0.9em;">For security reasons, we recommend changing your password after your first login.</p>
  </div>
  ` : ''}

  <p>Please arrive 15 minutes before your scheduled appointment time.</p>
  <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@mediyatra.com" style="color: #1890ff;">support@mediyatra.com</a> or call us at +91 8535079387.</p>
  <p>We look forward to assisting you on your healthcare journey!</p>
  <p>Best Regards,<br>The Med-Yatra Team</p>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #888; text-align: center;">
    <p>© 2023 Med-Yatra. All rights reserved.</p>
    <p>This email was sent to ${bookingData.email}. If you received this by mistake, please disregard this email.</p>
  </div>
</body>
</html>`;

    const payload = {
      from: "MediYatra Support <onboarding@resend.dev>",
      to: [bookingData.email],
      subject: "Your Appointment is Confirmed – Login Details Inside",
      html: htmlContent
    };

    // Log full payload for debugging
    console.log("Full payload to Resend API:", JSON.stringify(payload, null, 2));

    // Make API request to Resend
    console.log("Making API request to Resend...");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    // Log response status and headers
    console.log("Resend API Response Status:", response.status);
    console.log("Resend API Response Headers:", response.headers);

    // Get the response data
    const data = await response.json();
    
    // Log complete response for debugging
    console.log("Complete Resend API response:", data);

    // Check if it's a success or error
    if (!response.ok) {
      console.error("Resend API error:", data);
      return {
        success: false,
        data,
        error: data.message || "Unknown error from Resend API",
        message: `Failed to send email: ${data.message || "Unknown error"}`
      };
    }

    // Log success and return
    console.log("Email sent successfully:", data);
    return {
      success: true,
      data,
      message: "Confirmation email sent successfully"
    };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    console.error("Error stack:", error.stack);
    
    // Return error information
    return {
      success: false,
      error: error.message,
      message: `Failed to send email: ${error.message}`
    };
  }
};

/**
 * Alternative method to send email directly without template
 * @param {Object} bookingData - Data related to the booking
 * @returns {Promise<Object>} - Response from Resend API
 */
export const sendDirectEmail = async (bookingData) => {
  try {
    // Validate required fields
    if (!bookingData.email || !bookingData.firstName || !bookingData.lastName) {
      throw new Error("Missing required fields: email, firstName, or lastName");
    }

    // Format the appointment details for email
    const fullName = `${bookingData.firstName} ${bookingData.lastName}`;

    // Create the credentials section if userId and password are present
    let credentialsSection = '';
    if (bookingData.userId && bookingData.password) {
      credentialsSection = `
        <div style="background: #e6f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #91d5ff;">
          <h3 style="margin-top: 0; color: #0050b3;">Your Account Credentials</h3>
          <p>We have created an account for you to access your medical appointments and records:</p>
          <p><strong>User ID:</strong> ${bookingData.userId}</p>
          <p><strong>Password:</strong> ${bookingData.password}</p>
          <p style="color: #f5222d; font-size: 0.9em;">Please keep this information secure and change your password after first login.</p>
        </div>
      `;
    }

    // Prepare data for Resend API (without template)
    const payload = {
      from: "MediYatra Support <onboarding@resend.dev>",
      to: [bookingData.email],
      subject: "Your Appointment Confirmation - MediYatra",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #1890ff;">Appointment Confirmation</h2>
            <p>Dear ${fullName},</p>
            <p>Your appointment has been successfully booked. Here are the details:</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
              <p><strong>Clinic:</strong> ${bookingData.clinicName || "Our Clinic"}</p>
              <p><strong>Date:</strong> ${bookingData.appointmentDate || "Not specified"}</p>
              <p><strong>Time:</strong> ${bookingData.appointmentTime || "Not specified"}</p>
              <p><strong>Treatment:</strong> ${bookingData.treatmentType || "medical consultation"}</p>
              <p><strong>Location:</strong> ${bookingData.location || "Our facility"}</p>
              <p><strong>Booking ID:</strong> ${bookingData.appointmentId || ""}</p>
            </div>
            
            ${credentialsSection}
            
            <p>Please arrive 15 minutes before your scheduled appointment time.</p>
            <p>If you need to reschedule or cancel your appointment, please contact us at support@mediyatra.com or call our helpline: +91 9876543210.</p>
            <p>Thank you for choosing MediYatra.</p>
            <p>Best regards,</p>
            <p>MediYatra Team</p>
          </body>
        </html>
      `
    };

    // Make API request to Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    // Get the response data
    const data = await response.json();
    console.log("Complete Resend API response (direct email):", data);

    // Check if it's a success or error
    if (!response.ok) {
      console.error("Resend API error (direct email):", data);
      return {
        success: false,
        data,
        error: data.message || "Unknown error from Resend API",
        message: `Failed to send email: ${data.message || "Unknown error"}`
      };
    }

    // Log success and return
    console.log("Direct email sent successfully:", data);
    return {
      success: true,
      data,
      message: "Confirmation email sent successfully"
    };
  } catch (error) {
    console.error("Error sending direct confirmation email:", error);
    
    // Return error information
    return {
      success: false,
      error: error.message,
      message: `Failed to send email: ${error.message}`
    };
  }
};

/**
 * Logs email sending attempts for monitoring
 * @param {string} eventType - Type of email event (success, failure)
 * @param {Object} details - Additional details about the email
 */
export const logEmailEvent = (eventType, details) => {
  const timestamp = new Date().toISOString();
  console.log(`[EMAIL_EVENT][${eventType}][${timestamp}]`, details);
};

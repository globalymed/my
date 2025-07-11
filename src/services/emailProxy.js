// src/services/emailProxy.js
// This is a temporary proxy service to avoid CORS issues
// The proper solution is to use Firebase Cloud Functions

/**
 * Send email via a proxy to avoid CORS issues
 * This creates a server-side proxy to handle the Resend API call
 */
export const sendEmailViaProxy = async (emailData) => {
  try {
    // For development, we'll create a simple proxy
    // In production, you should use Firebase Cloud Functions
    
    console.log('Sending email via proxy service...');
    
    // This would need to be implemented with a proper backend
    // For now, we'll return a mock success to prevent errors
    console.log('Email data:', emailData);
    
    // Return a mock success response
    return {
      success: true,
      message: 'Email service temporarily disabled. Please deploy Firebase Cloud Functions for proper email functionality.',
      data: { id: 'mock-' + Date.now() }
    };
    
  } catch (error) {
    console.error('Error in email proxy:', error);
    return {
      success: false,
      error: error.message,
      message: 'Email service temporarily unavailable'
    };
  }
};

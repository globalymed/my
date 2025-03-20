# Brevo Email Integration for MediYatra

This document describes the integration of Brevo email service with the MediYatra application for sending booking confirmation emails.

## Overview

MediYatra uses Brevo (formerly Sendinblue) to send transactional emails to users when they book appointments. The integration has been implemented in two ways:

1. **Client-side Implementation**: An immediate email is sent from the browser when a booking is completed.
2. **Server-side Implementation**: A Firebase Cloud Function is triggered when a new appointment is created in Firestore.

## Configuration

### Brevo Account Details

- **API Key**: `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`
- **SMTP Server**: `smtp-relay.brevo.com`
- **Port**: `587`
- **Login**: `887849001@smtp-brevo.com`
- **SMTP Key**: `HDrc7sv4kn5AV6Yh`
- **Template ID**: `3`

### Email Template

The email template is configured in the Brevo dashboard and includes the following variables:

- `fullName`: Patient's full name
- `clinicName`: The name of the clinic
- `appointmentDate`: The date of the appointment
- `appointmentTime`: The time of the appointment
- `location`: The location of the clinic
- `treatmentType`: The type of treatment/consultation
- `appointmentId`: The unique ID of the appointment
- `bookingDate`: The date when the booking was made

## Implementation Details

### Client-side Implementation

The client-side implementation handles email sending immediately after a booking is created, providing immediate feedback to the user.

**Files:**
- `src/services/brevoService.js`: Main service for interacting with Brevo API
- `src/firebase.js`: Enhanced to send emails when appointments are created

**How it works:**
1. When a booking is successfully created in Firestore via `createAppointment()` function
2. The function prepares the email data and calls `sendBookingConfirmationEmail()`
3. The service makes a direct API call to Brevo using fetch
4. Success/failure is logged and the appointment record is updated with the email status

### Server-side Implementation (Cloud Functions)

The server-side implementation uses Firebase Cloud Functions to trigger email sending when a new appointment is created in Firestore, ensuring emails are sent even if the client-side fails.

**Files:**
- `functions/index.js`: Contains the Cloud Function implementation
- `functions/package.json`: Dependencies for the Cloud Function

**How it works:**
1. The `sendBookingConfirmationEmail` function is triggered when a new document is created in the `appointments` collection
2. The function fetches the user data from Firestore
3. It then uses the Brevo SDK to send the email
4. The appointment record is updated with the email sending status

## Testing

### Client-side Testing

1. **Manual Test Tool:**
   - Use `src/test-brevo.js` to test the email sending functionality
   - Update the email address in the script and run it using Node.js

2. **Real Booking Test:**
   - Complete a booking through the application UI
   - Check that a confirmation email is received
   - Verify that the appointment record in Firestore has `emailSent: true`

### Cloud Function Testing

1. **Test Function:**
   - Use the `sendTestEmail` HTTP function to test email sending
   - Make a POST request with the required parameters

2. **Monitoring:**
   - Check Firebase Function logs for successful execution
   - Verify that emails are sent correctly

## Error Handling

The integration includes robust error handling at multiple levels:

1. **Client-side:**
   - Catches and logs all API errors
   - Updates the appointment record with error information
   - Continues the booking process even if email sending fails

2. **Server-side:**
   - Logs detailed error information to Firebase Function logs
   - Updates the appointment record with error information
   - Email sending failures don't affect the appointment creation

## Maintenance and Monitoring

### Regular Checks

- Periodically check the Brevo dashboard for email sending statistics
- Monitor Firebase Function logs for any consistent errors
- Check Firestore for appointments with `emailSent: false` that may need attention

### API Key Rotation

If you need to update the Brevo API key:

1. Update the key in `src/services/brevoService.js`
2. Update the key in `functions/index.js`
3. Redeploy the Cloud Function

## Security Considerations

- The API key is hard-coded in the source code for development purposes
- For production, consider using environment variables or Firebase Config
- The client-side implementation exposes the API key to browsers, which is a potential security risk

## Future Improvements

1. Move API keys to environment variables or Firebase Config
2. Add email templates for other events (appointment reminders, updates, cancellations)
3. Implement a queue system for reliable email delivery
4. Add email tracking and analytics integration

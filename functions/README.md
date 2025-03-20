# MediYatra Cloud Functions

This directory contains the Firebase Cloud Functions for the MediYatra application.

## Functions

1. **sendBookingConfirmationEmail** - Automatically sends a confirmation email to patients when they book an appointment
2. **sendTestEmail** - HTTP trigger to test email sending functionality without creating an appointment

## Setup and Deployment

### Prerequisites

- Node.js 18 or newer
- Firebase CLI installed globally (`npm install -g firebase-tools`)
- Firebase project initialized with Firestore

### Local Setup

1. Install dependencies:
   ```bash
   cd functions
   npm install
   ```

2. Initialize Firebase (if not already done):
   ```bash
   firebase login
   firebase init
   ```

3. Test locally using Firebase emulators:
   ```bash
   npm run serve
   ```

### Deployment

1. Deploy functions to Firebase:
   ```bash
   npm run deploy
   ```
   or
   ```bash
   firebase deploy --only functions
   ```

## Testing

### Testing Email Functionality

You can test the email functionality by making a POST request to the `sendTestEmail` endpoint:

```bash
curl -X POST https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/sendTestEmail \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test","lastName":"User"}'
```

Replace `YOUR_REGION` and `YOUR_PROJECT_ID` with your Firebase project details.

## Configuration

The functions use the following environment configuration:

- **Brevo API Key**: `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`
- **Template ID**: `5e972de848b596a0400153cd`

For production, these values should be set as Firebase environment configuration variables rather than hard-coded.

## Troubleshooting

If you encounter issues with the functions:

1. Check Firebase function logs:
   ```bash
   firebase functions:log
   ```

2. Ensure Firestore triggers are properly set up
3. Verify that the Brevo API key and template ID are correct
4. Make sure the Brevo template contains all the parameters the code is trying to populate

# User Credentials System

This document explains the user credential management system implemented in the MediYatra platform.

## Overview

The system automatically generates a secure password for each new patient when they book an appointment. The user ID and password are then sent to the patient via email, allowing them to access their medical records and appointment details.

## Features

- **Automatic Password Generation**: When a new user is created, a secure password is automatically generated.
- **Password Storage**: Passwords are stored in the user document in Firestore.
- **Email Notification**: The user ID and password are sent to the patient in the booking confirmation email.
- **Retroactive Password Generation**: Cloud Functions allow generating passwords for existing users who don't have them yet.

## Implementation Details

### Password Generation

Passwords are generated using the `generateSecurePassword` utility function, which creates random passwords with:
- Mixed case letters (uppercase and lowercase)
- Numbers
- Special characters
- Configurable length (default: 12 characters)

### User Creation Flow

1. When a patient books an appointment, the system checks if a user with the given email already exists.
2. If the user exists, their information is updated.
3. If the user doesn't exist, a new user is created with a generated password.
4. The user ID and password are included in the booking confirmation email.

### Email Templates

The system supports two methods of sending emails:
1. **Template Emails**: Using Brevo's template system (preferred method)
2. **Direct Emails**: As a fallback if the template method fails

Both email methods include the user ID and password information when credentials are available.

### Cloud Functions

Several Firebase Cloud Functions are provided for credential management:

1. **generateCredentialsForUser**: Callable function to generate credentials for a specific user
   - Endpoint: `generateCredentialsForUser`
   - Input: `{ userId: string }`
   - Output: Status of credential generation and email sending

2. **generateCredentialsForAllUsers**: Scheduled function that runs daily to generate credentials for all users without passwords
   - Schedule: Daily at midnight (IST)
   - No manual input required

3. **triggerCredentialGeneration**: HTTP endpoint to manually trigger credential generation for all users
   - Endpoint: `/triggerCredentialGeneration`
   - Method: GET
   - Output: Detailed report of credential generation process

## Security Considerations

- Passwords are stored as plain text in the Firestore database. In a production environment, consider:
  - Implementing password hashing and salting
  - Adding password expiration and reset functionality
  - Creating a secure password management system

## Testing

To test the credential generation:

1. Create a new booking through the platform UI
2. Check the Firestore database to verify the password field in the user document
3. Verify that the confirmation email contains the user ID and password

For existing users, use the Firebase Functions:

```javascript
// Generate credentials for a specific user
firebase.functions().httpsCallable('generateCredentialsForUser')({ userId: 'USER_ID_HERE' })
  .then(result => console.log(result.data))
  .catch(error => console.error(error));

// Or trigger credential generation for all users via the HTTP endpoint
// GET https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/triggerCredentialGeneration
```

## Future Improvements

- Add password reset functionality
- Implement secure password storage (hashing)
- Create a user login system to access medical records
- Add account verification via email

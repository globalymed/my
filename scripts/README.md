# MedYatra Database Fix Scripts

This directory contains utility scripts for fixing and monitoring database issues in the MedYatra application.

## Fix Appointment UserIds

The script `fix-appointment-userids.js` is designed to fix the issue where appointment records in Firestore don't have the correct userId assigned.

### Background

When a new appointment is booked, a unique appointmentId is generated and stored in the appointments collection. Each appointmentId document contains a userId field, which should store a unique user ID for the patient. However, there was an issue where the userId field was being assigned the same value for all appointments, rather than being dynamically fetched or generated for each new appointment.

### What This Script Does

This script:
1. Verifies all appointments in the Firestore database to check if they have the correct userId
2. For appointments with incorrect userIds, it finds the correct user by matching the patient's email
3. Updates the appointments with the correct userId
4. Provides a detailed report of fixed appointments and any errors

### Requirements

- Node.js 14+
- Firebase Admin SDK
- Service account credentials file (`serviceAccountKey.json`) in the project root directory

### Usage

To fix all appointments in the database:

```bash
node fix-appointment-userids.js --fix-all
```

To fix a specific appointment:

```bash
node fix-appointment-userids.js [appointmentId]
```

## Monitor Appointment UserIds

The script `monitor-appointment-userids.js` helps you monitor and verify the appointment-user relationships over time to ensure the fix remains effective.

### Features

- Generate comprehensive reports on all appointment-user relationships in the database
- Monitor appointments created within a specific time range (e.g., last 7 days)
- Identify issues such as missing userIds, non-existent users, and email mismatches
- Save detailed reports to logs directory for future reference

### Usage

To generate a full report of all appointment-user relationships:

```bash
node monitor-appointment-userids.js --report
```

To monitor recent appointments (default: last 7 days):

```bash
node monitor-appointment-userids.js --monitor
```

To monitor appointments from a custom time period:

```bash
node monitor-appointment-userids.js --monitor --days=14
```

### Expected Output

The monitoring script will provide:
- Summary statistics on valid and invalid relationships
- Detailed information about specific issues
- For recent monitoring, information about when appointments were created
- JSON reports saved to the logs directory

### Integration with the Existing System

The issue has also been fixed in the core application code:

1. The `createAppointment` function in `firebase.js` has been enhanced to:
   - Properly retrieve and use the user ID from `getOrCreateUser`
   - Add additional verification steps to ensure the user ID is valid
   - Include more detailed logging for troubleshooting
   - Store patient information (name, email, phone) directly in the appointment record

2. New utility functions have been added to `firebase.js`:
   - `getUserById`: Retrieves a user by ID with logging
   - `getAppointmentById`: Retrieves an appointment by ID with logging
   - `fixAppointmentUserId`: Fixes an individual appointment's userId
   - `verifyAppointmentUserRelationship`: Validates that an appointment is linked to the correct user
   - `fixAllAppointmentUserIds`: Batch fixes all appointments with incorrect userIds

### Monitoring in Production

After running the fix script, you should:

1. Run the monitoring script regularly (e.g., daily or weekly) to ensure new appointments get the correct userId
2. Set up alerts for any errors related to user or appointment creation
3. Check the detailed reports to identify any patterns or issues that need attention

### Troubleshooting

If you encounter issues:

1. Check the Firebase console to verify the data structure
2. Enable verbose logging by modifying the script
3. Verify that the service account has proper permissions
4. For specific appointment fixes, note the appointmentId and try fixing it individually using the fix script

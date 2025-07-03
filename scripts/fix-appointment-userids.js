// scripts/fix-appointment-userids.js
// Script to fix appointment userIds that are not unique

const admin = require('firebase-admin');

// Load environment variables
require('dotenv').config();

// Initialize Firebase Admin SDK with environment variables
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '../testUpdatingMissingParaDb/serviceAccountKey.json';

const serviceAccount = process.env.FIREBASE_PRIVATE_KEY ? {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  clientId: process.env.FIREBASE_CLIENT_ID,
  authUri: process.env.FIREBASE_AUTH_URI,
  tokenUri: process.env.FIREBASE_TOKEN_URI
} : require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Helper function to get a user by ID
async function getUserById(userId) {
  try {
    console.log(`Looking up user with ID: ${userId}`);
    
    const userDocRef = db.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();
    
    if (userDocSnap.exists) {
      const userData = userDocSnap.data();
      console.log(`Found user with ID: ${userId}`);
      return {
        id: userId,
        ...userData
      };
    } else {
      console.log(`No user found with ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error getting user with ID ${userId}:`, error);
    throw error;
  }
}

// Helper function to get a user by email
async function getUserByEmail(email) {
  try {
    console.log(`Looking up user with email: ${email}`);
    
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;
      console.log(`Found user with ID: ${userId} for email: ${email}`);
      return {
        id: userId,
        ...userData
      };
    } else {
      console.log(`No user found with email: ${email}`);
      return null;
    }
  } catch (error) {
    console.error(`Error getting user with email ${email}:`, error);
    throw error;
  }
}

// Helper function to get an appointment by ID
async function getAppointmentById(appointmentId) {
  try {
    console.log(`Looking up appointment with ID: ${appointmentId}`);
    
    const appointmentDocRef = db.collection('appointments').doc(appointmentId);
    const appointmentDocSnap = await appointmentDocRef.get();
    
    if (appointmentDocSnap.exists) {
      const appointmentData = appointmentDocSnap.data();
      console.log(`Found appointment with ID: ${appointmentId}`);
      
      if (appointmentData.userId) {
        console.log(`Appointment ${appointmentId} is linked to user: ${appointmentData.userId}`);
      } else {
        console.log(`Warning: Appointment ${appointmentId} has no userId`);
      }
      
      return {
        id: appointmentId,
        ...appointmentData
      };
    } else {
      console.log(`No appointment found with ID: ${appointmentId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error getting appointment with ID ${appointmentId}:`, error);
    throw error;
  }
}

// Function to verify if an appointment has the correct userId
async function verifyAppointmentUserRelationship(appointmentId) {
  try {
    // Get the appointment
    const appointment = await getAppointmentById(appointmentId);
    if (!appointment) {
      return {
        success: false,
        error: `Appointment ${appointmentId} not found`
      };
    }
    
    // Check if userId exists
    if (!appointment.userId) {
      return {
        success: false,
        error: `Appointment ${appointmentId} has no userId`,
        appointment
      };
    }
    
    // Get the user
    const user = await getUserById(appointment.userId);
    if (!user) {
      return {
        success: false,
        error: `User with ID ${appointment.userId} not found`,
        appointment
      };
    }
    
    // Check if patientEmail exists in the appointment
    if (!appointment.patientEmail) {
      return {
        success: false,
        error: `Appointment ${appointmentId} has no patientEmail field`,
        appointment,
        user
      };
    }
    
    // Verify email match
    if (appointment.patientEmail !== user.email) {
      return {
        success: false,
        error: `Email mismatch: Appointment email (${appointment.patientEmail}) doesn't match user email (${user.email})`,
        appointment,
        user
      };
    }
    
    // All checks passed
    return {
      success: true,
      appointment,
      user
    };
  } catch (error) {
    console.error(`Error verifying appointment-user relationship for ${appointmentId}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to fix an appointment's userId
async function fixAppointmentUserId(appointmentId) {
  try {
    // Get the appointment
    const appointment = await getAppointmentById(appointmentId);
    if (!appointment) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }
    
    // Check if appointment has an email
    if (!appointment.patientEmail) {
      throw new Error(`Appointment ${appointmentId} has no patientEmail to find the correct user`);
    }
    
    // Find the correct user by email
    const user = await getUserByEmail(appointment.patientEmail);
    if (!user) {
      throw new Error(`No user found with email: ${appointment.patientEmail}`);
    }
    
    const correctUserId = user.id;
    
    // If the userId is already correct, no need to update
    if (appointment.userId === correctUserId) {
      console.log(`Appointment ${appointmentId} already has the correct userId: ${correctUserId}`);
      return {
        success: true,
        appointmentId,
        userId: correctUserId,
        unchanged: true
      };
    }
    
    // Update the appointment with the correct userId
    console.log(`Updating appointment ${appointmentId} with correct userId: ${correctUserId}`);
    await db.collection('appointments').doc(appointmentId).update({
      userId: correctUserId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Successfully updated appointment ${appointmentId} with correct userId`);
    return {
      success: true,
      appointmentId,
      oldUserId: appointment.userId,
      newUserId: correctUserId,
      unchanged: false
    };
  } catch (error) {
    console.error(`Error fixing appointment userId for ${appointmentId}:`, error);
    throw error;
  }
}

// Function to fix all appointments
async function fixAllAppointments() {
  try {
    console.log('Starting batch fix of appointment userIds...');
    
    // Get all appointments
    const appointmentsSnapshot = await db.collection('appointments').get();
    
    const results = {
      total: appointmentsSnapshot.size,
      fixed: 0,
      errors: 0,
      alreadyCorrect: 0,
      details: []
    };
    
    console.log(`Found ${results.total} appointments to process`);
    
    // Process each appointment
    for (const appointmentDoc of appointmentsSnapshot.docs) {
      const appointmentId = appointmentDoc.id;
      const appointmentData = appointmentDoc.data();
      
      try {
        console.log(`\nProcessing appointment: ${appointmentId}`);
        
        // Verify if the appointment has the correct userId
        const verification = await verifyAppointmentUserRelationship(appointmentId);
        
        if (verification.success) {
          // Appointment already has correct userId
          console.log(`Appointment ${appointmentId} already has correct userId: ${appointmentData.userId}`);
          results.alreadyCorrect++;
          results.details.push({
            appointmentId,
            status: 'already_correct',
            userId: appointmentData.userId
          });
        } else {
          // Appointment needs fixing
          console.log(`Fixing appointment ${appointmentId}: ${verification.error}`);
          
          try {
            const fixResult = await fixAppointmentUserId(appointmentId);
            
            if (fixResult.unchanged) {
              results.alreadyCorrect++;
              results.details.push({
                appointmentId,
                status: 'already_correct',
                userId: fixResult.userId
              });
            } else {
              results.fixed++;
              results.details.push({
                appointmentId,
                status: 'fixed',
                oldUserId: fixResult.oldUserId,
                newUserId: fixResult.newUserId
              });
            }
          } catch (fixError) {
            results.errors++;
            results.details.push({
              appointmentId,
              status: 'error',
              error: fixError.message
            });
          }
        }
      } catch (processingError) {
        console.error(`Error processing appointment ${appointmentId}:`, processingError);
        results.errors++;
        results.details.push({
          appointmentId,
          status: 'error',
          error: processingError.message
        });
      }
    }
    
    // Print results
    console.log('\n====== RESULTS ======');
    console.log(`Total appointments: ${results.total}`);
    console.log(`Already correct: ${results.alreadyCorrect}`);
    console.log(`Fixed: ${results.fixed}`);
    console.log(`Errors: ${results.errors}`);
    
    // Print details of fixed appointments
    if (results.fixed > 0) {
      console.log('\nFixed appointments:');
      results.details
        .filter(detail => detail.status === 'fixed')
        .forEach(detail => {
          console.log(`- Appointment ${detail.appointmentId}: Updated userId from ${detail.oldUserId} to ${detail.newUserId}`);
        });
    }
    
    // Print details of errors
    if (results.errors > 0) {
      console.log('\nErrors:');
      results.details
        .filter(detail => detail.status === 'error')
        .forEach(detail => {
          console.log(`- Appointment ${detail.appointmentId}: ${detail.error}`);
        });
    }
    
    return results;
  } catch (error) {
    console.error('Error fixing all appointment userIds:', error);
    throw error;
  }
}

// Add a utility to fix a specific appointment
async function fixSpecificAppointment(appointmentId) {
  try {
    console.log(`Fixing specific appointment: ${appointmentId}`);
    
    const result = await fixAppointmentUserId(appointmentId);
    
    if (result.unchanged) {
      console.log(`Appointment ${appointmentId} already had the correct userId: ${result.userId}`);
    } else {
      console.log(`Successfully updated appointment ${appointmentId} userId from ${result.oldUserId} to ${result.newUserId}`);
    }
    
    return result;
  } catch (error) {
    console.error(`Error fixing appointment ${appointmentId}:`, error);
    throw error;
  }
}

// Main function to execute the script
async function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length > 0 && args[0] === '--fix-all') {
      // Fix all appointments
      await fixAllAppointments();
    } else if (args.length > 0) {
      // Fix a specific appointment ID
      const appointmentId = args[0];
      await fixSpecificAppointment(appointmentId);
    } else {
      console.log('Usage:');
      console.log('  node fix-appointment-userids.js --fix-all                # Fix all appointments');
      console.log('  node fix-appointment-userids.js [appointmentId]          # Fix a specific appointment');
    }
    
    console.log('Script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

// Run the script
main();

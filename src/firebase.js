// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  addDoc, 
  updateDoc,
  serverTimestamp,
  orderBy,
  limit,
  deleteDoc
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Import the Brevo service for email notifications
import { sendBookingConfirmationEmail, sendDirectEmail, logEmailEvent } from './services/brevoService';

// Import the password generator utility
import { generateSecurePassword } from './utils/passwordUtils';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANg95WdxwaB8bw_AnQS8s2-AUCz_JmX9o",
  authDomain: "medi-yatra-clinics.firebaseapp.com",
  projectId: "medi-yatra-clinics",
  storageBucket: "medi-yatra-clinics.firebasestorage.app",
  messagingSenderId: "904574554357",
  appId: "1:904574554357:web:d43d13bbd843c00dcfb5bc",
  measurementId: "G-VKWS6QZL0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics - only in browser environments
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Helper functions for Firestore access
export const getClinics = async () => {
  try {
    const clinicsCollection = collection(db, 'clinics');
    const clinicsSnapshot = await getDocs(clinicsCollection);
    
    if (clinicsSnapshot.empty) {
      console.log('No clinics found in database.');
      return [];
    }
    
    return clinicsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return [];
  }
};

export const getClinicById = async (clinicId) => {
  try {
    const clinicRef = doc(db, 'clinics', clinicId);
    const clinicSnap = await getDoc(clinicRef);
    
    if (clinicSnap.exists()) {
      return {
        id: clinicSnap.id,
        ...clinicSnap.data()
      };
    } else {
      console.log(`Clinic with ID ${clinicId} not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching clinic by ID:', error);
    return null;
  }
};

export const getClinicsByTreatmentType = async (treatmentType, location = null) => {
  try {
    const clinicsCollection = collection(db, 'clinics');
    let q;
    
    if (location) {
      // Query by both treatment type and location
      q = query(
        clinicsCollection,
        where('treatmentType', '==', treatmentType),
        where('location', '==', location)
      );
    } else {
      // Query by treatment type only
      q = query(
        clinicsCollection,
        where('treatmentType', '==', treatmentType)
      );
    }
    
    const clinicsSnapshot = await getDocs(q);
    
    if (clinicsSnapshot.empty) {
      console.log(`No clinics found for treatment type: ${treatmentType}${location ? ` in ${location}` : ''}`);
      return [];
    }
    
    return clinicsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching clinics by treatment type:', error);
    return [];
  }
};

export const getAvailability = async (clinicId, date) => {
  try {
    const availabilityCollection = collection(db, 'availability');
    const q = query(
      availabilityCollection,
      where('clinicId', '==', clinicId),
      where('date', '==', date)
    );
    
    const availabilitySnapshot = await getDocs(q);
    
    if (availabilitySnapshot.empty) {
      console.log(`No availability found for clinic ${clinicId} on ${date}.`);
      return [];
    }
    
    return availabilitySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching availability:', error);
    return [];
  }
};

// ====== Appointment Management Functions ======

// Create a new appointment
export const createAppointment = async (appointmentData, medicalRecordFiles = []) => {
  try {
    console.log('Starting appointment creation process...');
    
    // Check if user exists, if not create a new user document
    const userRef = await getOrCreateUser(appointmentData);
    
    // Verify that we have a valid user ID
    if (!userRef || !userRef.id) {
      throw new Error('Failed to get or create user: User ID is missing');
    }
    
    console.log(`Creating appointment for user ID: ${userRef.id}`);
    
    // First try to prepare file metadata without uploading
    const fileMetadata = medicalRecordFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      uploadedAt: new Date().toISOString()
    }));
    
    let uploadedFiles = [];
    let uploadError = null;

    // Check if we're in the localhost environment (development)
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';

    // Process files - will handle differently in development vs production
    if (medicalRecordFiles.length > 0) {
      try {
        for (const file of medicalRecordFiles) {
          try {
            const fileData = await uploadMedicalRecord(file, userRef.id);
            if (fileData) uploadedFiles.push(fileData);
          } catch (fileUploadError) {
            console.error('Error uploading individual file:', fileUploadError);
            // Continue with the next file
          }
        }
      } catch (e) {
        uploadError = e;
        console.error('Failed to upload files:', e);
        // Continue with appointment creation without uploaded files
      }
    }
    
    // Create appointment record with all appointment data
    const appointmentDocData = {
      userId: userRef.id, // Ensure this is the correct user ID
      clinicId: appointmentData.clinicId,
      clinicName: appointmentData.clinicName,
      treatmentType: appointmentData.treatmentType,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      availabilityId: appointmentData.availabilityId,
      // If we have uploaded files, use those; otherwise use metadata
      medicalRecords: uploadedFiles.length > 0 ? uploadedFiles : fileMetadata,
      hasUploadedFiles: uploadedFiles.length > 0,
      isDevelopmentEnvironment: isLocalhost,
      symptoms: appointmentData.symptoms || [],
      notes: appointmentData.notes || '',
      status: 'pending',
      patientName: `${appointmentData.firstName} ${appointmentData.lastName}`,
      patientEmail: appointmentData.email,
      patientPhone: appointmentData.phone,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Add field to track email status
      emailSent: false
    };
    
    // Double check that userId is set correctly
    console.log(`Verifying userId for new appointment: ${appointmentDocData.userId}`);
    
    // Create the appointment document
    const appointmentRef = await addDoc(collection(db, 'appointments'), appointmentDocData);
    
    console.log(`Created appointment with ID: ${appointmentRef.id} for user: ${appointmentDocData.userId}`);
    
    // Update availability status - mark the slot as booked
    if (appointmentDocData.availabilityId) {
      await updateAvailabilityStatus(appointmentDocData.availabilityId, 'booked', appointmentRef.id);
    }
    
    // Send confirmation email (client-side implementation)
    try {
      // Prepare data for the email
      const emailData = {
        email: appointmentData.email,
        firstName: appointmentData.firstName,
        lastName: appointmentData.lastName,
        clinicName: appointmentData.clinicName,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
        location: appointmentData.city,
        treatmentType: appointmentData.treatmentType,
        appointmentId: appointmentRef.id,
        userId: userRef.id, // Add userId for the email
        password: userRef.password // Add password for the email (if new user)
      };
      
      // Try template email first
      logEmailEvent('attempt', { appointmentId: appointmentRef.id, email: appointmentData.email, method: 'template' });
      let emailResult = await sendBookingConfirmationEmail(emailData);
      
      // If template email fails, try direct email as fallback
      if (!emailResult.success) {
        logEmailEvent('fallback', { 
          appointmentId: appointmentRef.id, 
          email: appointmentData.email, 
          reason: emailResult.error 
        });
        
        // Try the direct email method as fallback
        emailResult = await sendDirectEmail(emailData);
      }
      
      // Log the final result
      if (emailResult.success) {
        logEmailEvent('success', { appointmentId: appointmentRef.id, email: appointmentData.email });
        
        // Update appointment with email status
        await updateDoc(appointmentRef, {
          emailSent: true,
          emailSentAt: serverTimestamp(),
          emailResponseId: emailResult.data?.messageId || null
        });
      } else {
        logEmailEvent('failure', { 
          appointmentId: appointmentRef.id, 
          email: appointmentData.email,
          error: emailResult.error 
        });
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      logEmailEvent('error', { 
        appointmentId: appointmentRef.id, 
        email: appointmentData.email,
        error: emailError.message 
      });
    }

    return {
      id: appointmentRef.id,
      success: true,
      fileUploadError: uploadError ? uploadError.message : null,
      isDevelopmentEnvironment: isLocalhost
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get user by email or create a new user
const getOrCreateUser = async (userData) => {
  try {
    // Log the start of the operation
    console.log(`Looking up user with email: ${userData.email}`);
    
    // Check if user with this email already exists
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', userData.email));
    const userSnapshot = await getDocs(q);
    
    // If user exists, return the user reference
    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      const userId = userDoc.id;
      
      console.log(`Found existing user with ID: ${userId}`);
      
      // Update user data if needed
      const userData = userDoc.data();
      const updates = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        city: userData.city,
        country: userData.country,
        updatedAt: serverTimestamp()
      };
      
      // Only update if there are changes
      if (JSON.stringify(updates) !== JSON.stringify(userData)) {
        await updateDoc(doc(db, 'users', userId), updates);
        console.log(`Updated existing user with ID: ${userId}`);
      }
      
      // Return the user data with the correct ID
      return {
        id: userId,
        ...userData
      };
    }
    
    // If user doesn't exist, create a new user with a generated password
    console.log('No existing user found. Creating new user...');
    const password = generateSecurePassword(12, true, true, true);
    
    // Create new user document with the generated password
    const newUserData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      city: userData.city,
      country: userData.country,
      password: password, // Store the generated password
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Create the new user document
    const newUserRef = await addDoc(collection(db, 'users'), newUserData);
    const newUserId = newUserRef.id;
    
    console.log(`Created new user with ID: ${newUserId}`);
    
    // Return the new user data with the correct ID
    return {
      id: newUserId,
      ...newUserData
    };
  } catch (error) {
    console.error('Error managing user data:', error);
    throw error;
  }
};

// Upload a medical record to Firebase Storage
export const uploadMedicalRecord = async (file, userId) => {
  try {
    if (!file || !userId) return null;
    
    // Create a unique file name with timestamp to avoid conflicts
    const timestamp = new Date().getTime();
    const fileName = `${userId}_${timestamp}.${file.name.split('.').pop()}`;
    const storageRef = ref(storage, `medical-records/${userId}/${fileName}`);
    
    // Check if we're in the localhost environment (development)
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
                        
    if (isLocalhost) {
      console.log('Skip actual upload in development environment to avoid CORS issues');
      // Return basic metadata without uploading
      return {
        name: file.name,
        storagePath: `medical-records/${userId}/${fileName}`,
        contentType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        url: null // No URL in development
      };
    }
    
    // Proceed with upload in production environment
    try {
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const url = await getDownloadURL(snapshot.ref);
      
      // Return file metadata
      return {
        name: file.name,
        storagePath: snapshot.ref.fullPath,
        contentType: snapshot.metadata.contentType,
        size: snapshot.metadata.size,
        uploadedAt: new Date().toISOString(),
        url
      };
    } catch (uploadError) {
      // If upload fails due to CORS or other issues
      console.error('File upload failed:', uploadError);
      // Return basic metadata without url
      return {
        name: file.name,
        storagePath: `medical-records/${userId}/${fileName}`,
        contentType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        uploadError: uploadError.message,
        url: null
      };
    }
  } catch (error) {
    console.error('Error in uploadMedicalRecord:', error);
    return null;
  }
};

// Update availability status
const updateAvailabilityStatus = async (availabilityId, status, appointmentId = null) => {
  try {
    const availabilityRef = doc(db, 'availability', availabilityId);
    await updateDoc(availabilityRef, {
      status: status,
      appointmentId: appointmentId,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating availability status:', error);
    return false;
  }
};

// Get appointments for a specific user
export const getUserAppointments = async (userId) => {
  try {
    const appointmentsCollection = collection(db, 'appointments');
    const q = query(
      appointmentsCollection,
      where('userId', '==', userId),
      orderBy('appointmentDate', 'desc')
    );
    
    const appointmentsSnapshot = await getDocs(q);
    
    if (appointmentsSnapshot.empty) {
      return [];
    }
    
    return appointmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    return [];
  }
};

// Get appointments for a specific clinic
export const getClinicAppointments = async (clinicId, startDate = null, endDate = null) => {
  try {
    const appointmentsCollection = collection(db, 'appointments');
    let q = query(
      appointmentsCollection,
      where('clinicId', '==', clinicId)
    );
    
    // Add date filters if provided
    if (startDate && endDate) {
      q = query(
        q,
        where('appointmentDate', '>=', startDate),
        where('appointmentDate', '<=', endDate)
      );
    } else if (startDate) {
      q = query(
        q,
        where('appointmentDate', '>=', startDate)
      );
    } else if (endDate) {
      q = query(
        q,
        where('appointmentDate', '<=', endDate)
      );
    }
    
    // Add ordering
    q = query(q, orderBy('appointmentDate'), orderBy('appointmentTime'));
    
    const appointmentsSnapshot = await getDocs(q);
    
    if (appointmentsSnapshot.empty) {
      return [];
    }
    
    return appointmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching clinic appointments:', error);
    return [];
  }
};

// Update appointment status
export const updateAppointmentStatus = async (appointmentId, status, notes = '') => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      status: status,
      notes: notes || '',
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return false;
  }
};

// Delete appointment
export const deleteAppointment = async (appointmentId, availabilityId = null) => {
  try {
    // Update availability status if provided
    if (availabilityId) {
      await updateAvailabilityStatus(availabilityId, 'available', null);
    }
    
    // Delete appointment
    await deleteDoc(doc(db, 'appointments', appointmentId));
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    console.log(`Looking up user with ID: ${userId}`);
    
    // Get the user document from Firestore
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    
    // Check if the user exists
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log(`Found user with ID: ${userId}`);
      
      // Return user data with ID
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
};

// Get appointment by ID
export const getAppointmentById = async (appointmentId) => {
  try {
    console.log(`Looking up appointment with ID: ${appointmentId}`);
    
    // Get the appointment document from Firestore
    const appointmentDocRef = doc(db, 'appointments', appointmentId);
    const appointmentDocSnap = await getDoc(appointmentDocRef);
    
    // Check if the appointment exists
    if (appointmentDocSnap.exists()) {
      const appointmentData = appointmentDocSnap.data();
      console.log(`Found appointment with ID: ${appointmentId}`);
      
      // Check if userId is present
      if (appointmentData.userId) {
        console.log(`Appointment ${appointmentId} is linked to user: ${appointmentData.userId}`);
      } else {
        console.log(`Warning: Appointment ${appointmentId} has no userId`);
      }
      
      // Return appointment data with ID
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
};

// Function to fix appointment userId if it's missing or incorrect
export const fixAppointmentUserId = async (appointmentId, correctUserId = null) => {
  try {
    // Get the appointment
    const appointment = await getAppointmentById(appointmentId);
    if (!appointment) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }
    
    // If we don't have a correctUserId provided, try to find the correct user
    if (!correctUserId && appointment.patientEmail) {
      console.log(`Looking up correct user ID for email: ${appointment.patientEmail}`);
      
      // Search for user by email
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', appointment.patientEmail));
      const userSnapshot = await getDocs(q);
      
      if (!userSnapshot.empty) {
        correctUserId = userSnapshot.docs[0].id;
        console.log(`Found user with ID ${correctUserId} for email: ${appointment.patientEmail}`);
      } else {
        throw new Error(`No user found with email: ${appointment.patientEmail}`);
      }
    }
    
    // Update the appointment with the correct userId
    console.log(`Updating appointment ${appointmentId} with correct userId: ${correctUserId}`);
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      userId: correctUserId,
      updatedAt: serverTimestamp()
    });
    
    console.log(`Successfully updated appointment ${appointmentId} with correct userId`);
    return {
      success: true,
      appointmentId,
      userId: correctUserId
    };
  } catch (error) {
    console.error(`Error fixing appointment userId for ${appointmentId}:`, error);
    throw error;
  }
};

// Function to verify appointment-user relationship
export const verifyAppointmentUserRelationship = async (appointmentId) => {
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
    
    // Verify email match
    if (appointment.patientEmail && user.email && appointment.patientEmail !== user.email) {
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
};

// Function to fix all appointments with missing or incorrect userIds
export const fixAllAppointmentUserIds = async () => {
  try {
    console.log('Starting batch fix of appointment userIds...');
    
    // Get all appointments
    const appointmentsCollection = collection(db, 'appointments');
    const appointmentSnapshot = await getDocs(appointmentsCollection);
    
    const results = {
      total: appointmentSnapshot.size,
      fixed: 0,
      errors: 0,
      alreadyCorrect: 0,
      details: []
    };
    
    // Process each appointment
    for (const appointmentDoc of appointmentSnapshot.docs) {
      const appointmentId = appointmentDoc.id;
      const appointmentData = appointmentDoc.data();
      
      try {
        // Check if this appointment needs fixing
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
          
          // Try to find the correct user by email
          if (appointmentData.patientEmail) {
            try {
              const fixResult = await fixAppointmentUserId(appointmentId);
              results.fixed++;
              results.details.push({
                appointmentId,
                status: 'fixed',
                oldUserId: appointmentData.userId,
                newUserId: fixResult.userId
              });
            } catch (fixError) {
              results.errors++;
              results.details.push({
                appointmentId,
                status: 'error',
                error: fixError.message
              });
            }
          } else {
            results.errors++;
            results.details.push({
              appointmentId,
              status: 'error',
              error: 'No patient email found to lookup correct user'
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
    
    console.log('Completed batch fix of appointment userIds');
    console.log(`Total appointments: ${results.total}`);
    console.log(`Already correct: ${results.alreadyCorrect}`);
    console.log(`Fixed: ${results.fixed}`);
    console.log(`Errors: ${results.errors}`);
    
    return results;
  } catch (error) {
    console.error('Error fixing all appointment userIds:', error);
    throw error;
  }
};

export default db;
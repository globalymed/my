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
  deleteDoc,
  setDoc
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import {
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider
} from 'firebase/auth';

// Import the Brevo service for email notifications
// Email handling is done automatically by Firebase Cloud Functions
// No imports needed for direct email services

// Import the password generator utility
import { generateSecurePassword } from './utils/passwordUtils';

// Validate required environment variables
const requiredEnvVars = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => `REACT_APP_FIREBASE_${key.toUpperCase()}`);

if (missingVars.length > 0) {
  console.error('❌ Missing Firebase environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n📝 Please create a .env file with your Firebase configuration.');
  console.error('📚 See .env.example for the required format.');

  // Provide a more helpful error message
  throw new Error(
    `Missing Firebase configuration. Please add the following environment variables to your .env file:\n${missingVars.join('\n')}\n\nSee .env.example for the required format.`
  );
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app); // <-- Add this line to initialize auth
const googleProvider = new GoogleAuthProvider(); // <-- Initialize Google Auth Provider


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

// Get clinic by doctor ID
export const getClinicByDoctorId = async (doctorId) => {
  try {
    const clinicsCollection = collection(db, 'clinics');
    const q = query(
      clinicsCollection,
      where('doctorId', '==', doctorId)
    );

    const clinicsSnapshot = await getDocs(q);

    if (clinicsSnapshot.empty) {
      console.log(`No clinic found for doctor ID: ${doctorId}`);
      return null;
    }

    // Return the first clinic found (assuming one clinic per doctor in this context)
    const clinicDoc = clinicsSnapshot.docs[0];
    return {
      id: clinicDoc.id,
      ...clinicDoc.data()
    };
  } catch (error) {
    console.error('Error fetching clinic by doctor ID:', error);
    return null;
  }
};

export const getClinicsByTreatmentType = async (treatmentType, location = null) => {
  try {
    const clinicsCollection = collection(db, 'clinics');
    let q;

    if (location) {
      // Ensure location is lowercase for consistent querying
      const locationLowerCase = location.toLowerCase();

      // Query by both treatment type and location
      q = query(
        clinicsCollection,
        where('treatmentType', '==', treatmentType),
        where('location', '==', locationLowerCase)
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

// get all user
export const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);

    if (usersSnapshot.empty) {
      console.log('No users found in database.');
      return [];
    }

    // console.log(`Found ${usersSnapshot.docs.length} users in the database.`);

    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

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
      doctorId: appointmentData.doctorId || null, // Add doctor ID if provided
      doctorName: appointmentData.doctorName || null, // Add doctor name if provided
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
      duration: appointmentData.duration || 30, // Default 30 minutes
      type: appointmentData.type || 'in-person', // Default to in-person
      meetingLink: appointmentData.type === 'video' ? generateMeetingLink() : null,
      doctorNotes: '',
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
    console.log('📝 Creating appointment document...');
    console.log('📋 Appointment data to save:', JSON.stringify(appointmentDocData, null, 2));
    const appointmentRef = await addDoc(collection(db, 'appointments'), appointmentDocData);

    console.log(`✅ Created appointment with ID: ${appointmentRef.id} for user: ${appointmentDocData.userId}`);
    console.log('🔄 This should trigger the Cloud Function for email sending');
    console.log('📧 Email will be sent to:', appointmentDocData.patientEmail);
    console.log('⚠️ Check Firebase Functions logs with: firebase functions:log');

    // Update availability status - mark the slot as booked
    if (appointmentDocData.availabilityId) {
      await updateAvailabilityStatus(appointmentDocData.availabilityId, 'booked', appointmentRef.id);
    }

    // Email will be sent automatically by the Firebase Cloud Function
    // when the appointment document is created (see functions/index.js)
    console.log(`Appointment created successfully. Confirmation email will be sent automatically via Cloud Function.`);

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

// Helper function to generate a video meeting link
const generateMeetingLink = () => {
  const meetingId = Math.random().toString(36).substring(2, 15);
  return `https://meet.google.com/${meetingId}`;
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
    console.log(`Fetching appointments for user ID: ${userId}`);

    // Get all appointments from the appointments collection
    const appointmentsCollection = collection(db, 'appointments');

    // Query appointments where userId field equals the provided userId
    const q = query(
      appointmentsCollection,
      where('userId', '==', userId)
    );

    console.log('Executing query for appointments');
    const appointmentsSnapshot = await getDocs(q);

    if (appointmentsSnapshot.empty) {
      console.log(`No appointments found for user ID: ${userId}`);

      // Fallback: Try to get all appointments and filter manually
      // in case the userId is stored in a different format
      console.log('Attempting fallback: fetching all appointments');
      const allAppointmentsQuery = query(appointmentsCollection);
      const allAppointmentsSnapshot = await getDocs(allAppointmentsQuery);

      if (allAppointmentsSnapshot.empty) {
        console.log('No appointments found in the database');
        return [];
      }

      // Filter manually to see if any appointment's userId matches our userId
      const filteredAppointments = allAppointmentsSnapshot.docs.filter(doc => {
        const data = doc.data();
        // Check if userId exists and if it matches (as string)
        return data.userId && (data.userId === userId ||
          data.userId.toString() === userId ||
          (data.userId.id && data.userId.id === userId));
      });

      if (filteredAppointments.length === 0) {
        console.log('No matching appointments found after manual filtering');
        return [];
      }

      console.log(`Found ${filteredAppointments.length} appointments after manual filtering`);
      return filteredAppointments.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    console.log(`Found ${appointmentsSnapshot.docs.length} appointments for user ID: ${userId}`);
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
    console.log(`Updating appointment ${appointmentId} status to ${status}`);
    const appointmentRef = doc(db, 'appointments', appointmentId);

    // First check if the appointment exists
    const appointmentSnapshot = await getDoc(appointmentRef);
    if (!appointmentSnapshot.exists()) {
      console.error(`Appointment ${appointmentId} does not exist`);
      return false;
    }

    const updateData = {
      status: status,
      updatedAt: serverTimestamp()
    };

    // Only update notes if provided
    if (notes) {
      updateData.notes = notes;
    }

    await updateDoc(appointmentRef, updateData);
    console.log(`Successfully updated appointment ${appointmentId} status to ${status}`);
    return true;
  } catch (error) {
    console.error(`Error updating appointment ${appointmentId} status:`, error);
    return false;
  }
};

// Delete appointment
export const deleteAppointment = async (appointmentId, availabilityId = null) => {
  try {
    console.log(`Attempting to delete/cancel appointment ${appointmentId}`);

    // Update availability status if provided
    if (availabilityId) {
      console.log(`Updating availability ${availabilityId} to available`);
      const success = await updateAvailabilityStatus(availabilityId, 'available', null);
      if (!success) {
        console.warn(`Failed to update availability ${availabilityId}, but continuing with appointment deletion`);
      }
    }

    // Delete appointment
    const appointmentRef = doc(db, 'appointments', appointmentId);

    // First check if the appointment exists
    const appointmentSnapshot = await getDoc(appointmentRef);
    if (!appointmentSnapshot.exists()) {
      console.error(`Appointment ${appointmentId} does not exist, cannot delete`);
      return false;
    }

    await deleteDoc(appointmentRef);
    console.log(`Successfully deleted appointment ${appointmentId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting appointment ${appointmentId}:`, error);
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

// Classify appointments into today, upcoming, and past
export const classifyAppointments = (appointments) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to the start of the current day

  const todayAppointments = [];
  const upcomingAppointments = [];
  const pastAppointments = [];
  const cancelledAppointments = [];

  appointments.forEach(appt => {
    // The appointmentDate should already be a JS Date object from getAppointments.
    // This check remains as a safeguard.
    const appointmentDate = appt.appointmentDate instanceof Date ? appt.appointmentDate : new Date(appt.appointmentDate);

    if (isNaN(appointmentDate.getTime())) {
      console.warn("Skipping appointment with invalid date:", appt.id);
      return; // Skip this appointment if the date is invalid
    }

    if (appt.status === 'cancelled') {
      cancelledAppointments.push(appt);
    }

    const apptDateNormalized = new Date(appointmentDate);
    apptDateNormalized.setHours(0, 0, 0, 0); // Normalize the appointment date for comparison

    if (apptDateNormalized.getTime() === today.getTime()) {
      todayAppointments.push(appt);
    } else if (apptDateNormalized > today) {
      upcomingAppointments.push(appt);
    } else {
      pastAppointments.push(appt);
    }
  });

  // FIX: Sort by directly comparing the Date objects.
  // The .toDate() method is not needed here as they are already JS Dates.
  upcomingAppointments.sort((a, b) => a.appointmentDate - b.appointmentDate);
  pastAppointments.sort((a, b) => b.appointmentDate - a.appointmentDate);


  return { todayAppointments, upcomingAppointments, pastAppointments, cancelledAppointments };
};

// Function to fetch all appointments from Firestore
export const getAppointments = async () => {
  try {
    const appointmentsCollection = collection(db, 'appointments');
    const appointmentsSnapshot = await getDocs(appointmentsCollection);
    if (appointmentsSnapshot.empty) {
      console.log('No appointments found in database.');
      return [];
    }
    // Convert Firestore timestamp to JS Date if necessary
    const appointmentsList = appointmentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Firestore timestamps need to be converted to JS Date objects
        appointmentDate: data.appointmentDate?.toDate ? data.appointmentDate.toDate() : new Date(data.appointmentDate)
      };
    });
    // console.log('Fetched appointments:', appointmentsList);
    return appointmentsList;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    // In a real app, you'd want to show a user-facing error.
    throw error;
  }
};

// Function to count total documents in Firebase Storage
export const getTotalDocumentsCount = async () => {
  try {
    const storageRef = ref(storage);

    // Function to recursively count files in all folders
    const countFilesRecursively = async (folderRef) => {
      try {
        const result = await listAll(folderRef);
        let count = result.items.length; // Count files in current folder

        // Recursively count files in subfolders
        for (const subfolder of result.prefixes) {
          count += await countFilesRecursively(subfolder);
        }

        return count;
      } catch (error) {
        console.error('Error counting files in folder:', folderRef.fullPath, error);
        return 0;
      }
    };

    const totalCount = await countFilesRecursively(storageRef);
    return totalCount;
  } catch (error) {
    console.error('Error fetching total documents count:', error);
    return 0;
  }
};

// fetch all appointments with a specific doctor ID
export const getAppointmentsByDoctorId = async (doctorId) => {
  try {
    const appointmentsCollection = collection(db, 'appointments');
    const q = query(
      appointmentsCollection,
      where('doctorId', '==', doctorId)
    );

    const appointmentsSnapshot = await getDocs(q);
    if (appointmentsSnapshot.empty) {
      console.log(`No appointments found for doctor ID: ${doctorId}`);
      return [];
    }

    const appointmentsList = appointmentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        appointmentDate: data.appointmentDate?.toDate
          ? data.appointmentDate.toDate()
          : new Date(data.appointmentDate)
      };
    });

    return appointmentsList;
  } catch (error) {
    console.error('Error fetching appointments by doctor ID:', error);
    return [];
  }
};

// Get appointments filtered by clinic IDs (for doctor dashboard)
export const getAppointmentsByClinicIds = async (clinicIds) => {
  try {
    if (!clinicIds || clinicIds.length === 0) {
      console.log('No clinic IDs provided');
      return [];
    }

    const appointmentsCollection = collection(db, 'appointments');
    let allAppointments = [];

    // Firestore 'in' operator supports max 10 values, so we need to chunk the clinicIds
    const chunkSize = 10;
    for (let i = 0; i < clinicIds.length; i += chunkSize) {
      const chunk = clinicIds.slice(i, i + chunkSize);
      const q = query(
        appointmentsCollection,
        where('clinicId', 'in', chunk)
      );

      const appointmentsSnapshot = await getDocs(q);
      if (!appointmentsSnapshot.empty) {
        const appointmentsList = appointmentsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            appointmentDate: data.appointmentDate?.toDate
              ? data.appointmentDate.toDate()
              : new Date(data.appointmentDate)
          };
        });
        allAppointments = allAppointments.concat(appointmentsList);
      }
    }

    console.log(`Found ${allAppointments.length} appointments for clinic IDs: ${clinicIds.join(', ')}`);
    return allAppointments;
  } catch (error) {
    console.error('Error fetching appointments by clinic IDs:', error);
    return [];
  }
};

// ====== Doctor Management Functions ======

// Get all doctors
export const getDoctors = async () => {
  try {
    const doctorsCollection = collection(db, 'doctors');
    const doctorsSnapshot = await getDocs(doctorsCollection);

    if (doctorsSnapshot.empty) {
      console.log('No doctors found in database.');
      return [];
    }

    return doctorsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};

// Get doctor by ID
export const getDoctorById = async (doctorId) => {
  try {
    const doctorRef = doc(db, 'doctors', doctorId);
    const doctorSnap = await getDoc(doctorRef);

    if (doctorSnap.exists()) {
      return {
        id: doctorSnap.id,
        ...doctorSnap.data()
      };
    } else {
      console.log(`Doctor with ID ${doctorId} not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching doctor by ID:', error);
    return null;
  }
};

// Get doctor by user ID
export const getDoctorByUserId = async (userId) => {
  try {
    const doctorsCollection = collection(db, 'doctors');
    const q = query(
      doctorsCollection,
      where('userId', '==', userId),
      limit(1)
    );

    const doctorSnapshot = await getDocs(q);

    if (doctorSnapshot.empty) {
      console.log(`No doctor found for user ID: ${userId}`);
      return null;
    }

    const doctorDoc = doctorSnapshot.docs[0];
    return {
      id: doctorDoc.id,
      ...doctorDoc.data()
    };
  } catch (error) {
    console.error('Error fetching doctor by user ID:', error);
    return null;
  }
};

// Get doctors by clinic ID
export const getDoctorsByClinicId = async (clinicId) => {
  try {
    const doctorsCollection = collection(db, 'doctors');
    const q = query(
      doctorsCollection,
      where('clinicIds', 'array-contains', clinicId)
    );

    const doctorsSnapshot = await getDocs(q);

    if (doctorsSnapshot.empty) {
      console.log(`No doctors found for clinic ID: ${clinicId}`);
      return [];
    }

    return doctorsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching doctors by clinic ID:', error);
    return [];
  }
};

// Create or update doctor profile
export const updateDoctorProfile = async (doctorId, doctorData) => {
  try {
    const doctorRef = doc(db, 'doctors', doctorId);

    await updateDoc(doctorRef, {
      ...doctorData,
      updatedAt: serverTimestamp()
    });

    return {
      id: doctorId,
      ...doctorData
    };
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    throw error;
  }
};

// ====== Doctor Availability Functions ======

// Get doctor's availability
export const getDoctorAvailability = async (doctorId, startDate = null, endDate = null) => {
  try {
    const availabilityCollection = collection(db, 'availability');
    let q;

    if (startDate && endDate) {
      // Get availability for specific date range
      q = query(
        availabilityCollection,
        where('doctorId', '==', doctorId),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );
    } else {
      // Get all availability for this doctor
      q = query(
        availabilityCollection,
        where('doctorId', '==', doctorId)
      );
    }

    const availabilitySnapshot = await getDocs(q);

    return availabilitySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    return [];
  }
};

// Get doctor's weekly recurring availability
export const getDoctorWeeklyAvailability = async (doctorId) => {
  try {
    const availabilityCollection = collection(db, 'availability');
    const q = query(
      availabilityCollection,
      where('doctorId', '==', doctorId),
      where('weeklyRecurring', '==', true)
    );

    const availabilitySnapshot = await getDocs(q);

    return availabilitySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching doctor weekly availability:', error);
    return [];
  }
};

// Create or update doctor availability
export const updateDoctorAvailability = async (availabilityId, availabilityData) => {
  try {
    const availabilityRef = doc(db, 'availability', availabilityId);

    await updateDoc(availabilityRef, {
      ...availabilityData,
      updatedAt: serverTimestamp()
    });

    return {
      id: availabilityId,
      ...availabilityData
    };
  } catch (error) {
    console.error('Error updating doctor availability:', error);
    throw error;
  }
};

// Create a new weekly recurring availability slot
export const createWeeklyAvailability = async (doctorId, clinicId, dayOfWeek, slots) => {
  try {
    const availabilityRef = await addDoc(collection(db, 'availability'), {
      doctorId,
      clinicId,
      weeklyRecurring: true,
      dayOfWeek,
      date: null,
      available: true,
      slots,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return availabilityRef.id;
  } catch (error) {
    console.error('Error creating weekly availability:', error);
    throw error;
  }
};

// Function to add a support message
export const addSupportMessage = async (userId, question, status = 'In Progress') => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('__name__', '==', userId));
    const userSnapshot = await getDocs(q);

    if (userSnapshot.empty) {
      console.error('User not found!');
      return null;
    }

    const userData = userSnapshot.docs[0].data();

    const supportData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      question,
      status,
      createdAt: serverTimestamp()
    };

    const supportCollection = collection(db, 'queries/patientdashboard/supportqueries');
    const supportRef = await addDoc(supportCollection, supportData);

    console.log(`Added support message with ID: ${supportRef.id}`);
    return supportRef.id;
  } catch (error) {
    console.error('Error adding support message:', error);
    return null;
  }
};

// export const getSupportMessagesForUser = async (userId) => {
//   try {
//     const supportRef = collection(
//       db,
//       "queries",
//       "patientdashboard",
//       "supportqueries"
//     );

//     const q = query(
//       supportRef,
//       where("userId", "==", userId),
//       orderBy("createdAt", "desc")
//     );

//     const querySnapshot = await getDocs(q);

//     return querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//   } catch (error) {
//     console.error("Error fetching support messages:", error);
//     return [];
//   }
// };


// ====== Doctor Appointment Functions ======

// Get appointments for a doctor
export const getDoctorAppointments = async (doctorId, startDate = null, endDate = null, status = null) => {
  try {
    const appointmentsCollection = collection(db, 'appointments');
    let q;

    if (startDate && endDate && status) {
      // Get appointments for specific date range and status
      q = query(
        appointmentsCollection,
        where('doctorId', '==', doctorId),
        where('appointmentDate', '>=', startDate),
        where('appointmentDate', '<=', endDate),
        where('status', '==', status)
      );
    } else if (startDate && endDate) {
      // Get appointments for specific date range
      q = query(
        appointmentsCollection,
        where('doctorId', '==', doctorId),
        where('appointmentDate', '>=', startDate),
        where('appointmentDate', '<=', endDate)
      );
    } else if (status) {
      // Get appointments for specific status
      q = query(
        appointmentsCollection,
        where('doctorId', '==', doctorId),
        where('status', '==', status)
      );
    } else {
      // Get all appointments for this doctor
      q = query(
        appointmentsCollection,
        where('doctorId', '==', doctorId)
      );
    }

    const appointmentsSnapshot = await getDocs(q);

    return appointmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    return [];
  }
};

// Update appointment with doctor notes
export const updateAppointmentWithDoctorNotes = async (appointmentId, doctorNotes) => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);

    await updateDoc(appointmentRef, {
      doctorNotes,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error updating appointment with doctor notes:', error);
    throw error;
  }
};

// ====== Medical Records Functions ======

// Get medical records for a patient
export const getPatientMedicalRecords = async (patientId) => {
  try {
    const medicalRecordsCollection = collection(db, 'medical_records');
    const q = query(
      medicalRecordsCollection,
      where('userId', '==', patientId)
    );

    const medicalRecordsSnapshot = await getDocs(q);

    return medicalRecordsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching patient medical records:', error);
    return [];
  }
};

// Get medical records for an appointment
export const getAppointmentMedicalRecords = async (appointmentId) => {
  try {
    const medicalRecordsCollection = collection(db, 'medical_records');
    const q = query(
      medicalRecordsCollection,
      where('appointmentId', '==', appointmentId)
    );

    const medicalRecordsSnapshot = await getDocs(q);

    return medicalRecordsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching appointment medical records:', error);
    return [];
  }
};

// Upload a medical record by doctor
export const uploadDoctorMedicalRecord = async (file, patientId, appointmentId, title, category, hasSummary = false, summary = '') => {
  try {
    // Upload file to storage similar to uploadMedicalRecord function
    const storageRef = ref(storage, `medical-records/${patientId}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);

    // Get doctor user ID from current authentication
    // You'll need to implement this based on your auth system
    const doctorUserId = 'current-doctor-user-id'; // Replace with actual auth logic

    // Create medical record document
    const medicalRecordRef = await addDoc(collection(db, 'medical_records'), {
      userId: patientId,
      appointmentId: appointmentId,
      title: title,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileUrl: fileUrl,
      hasSummary: hasSummary,
      summary: summary,
      category: category,
      uploadedBy: doctorUserId,
      uploadedAt: serverTimestamp(),
      accessibleTo: [
        { userId: patientId, role: 'patient' },
        { userId: doctorUserId, role: 'doctor' }
      ],
      updatedAt: serverTimestamp()
    });

    return {
      id: medicalRecordRef.id,
      name: file.name,
      type: file.type,
      size: file.size,
      url: fileUrl,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error uploading medical record by doctor:', error);
    throw error;
  }
};

// Update medical record with summary
export const updateMedicalRecordWithSummary = async (recordId, summary) => {
  try {
    const recordRef = doc(db, 'medical_records', recordId);

    await updateDoc(recordRef, {
      hasSummary: true,
      summary,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error updating medical record with summary:', error);
    throw error;
  }
};

// ====== Patient Management Functions ======

// Get all patients (for doctor dashboard)
export const getAllPatients = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(
      usersCollection,
      where('role', '==', 'patient')
    );

    const patientsSnapshot = await getDocs(q);

    return patientsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching all patients:', error);
    return [];
  }
};

// Get patients for a specific doctor (based on previous appointments)
export const getDoctorPatients = async (doctorId) => {
  try {
    // First get all appointments for this doctor
    const appointmentsCollection = collection(db, 'appointments');
    const appointmentsQuery = query(
      appointmentsCollection,
      where('doctorId', '==', doctorId)
    );

    const appointmentsSnapshot = await getDocs(appointmentsQuery);

    // Extract unique patient IDs
    const patientIds = [...new Set(
      appointmentsSnapshot.docs.map(doc => doc.data().userId)
    )];

    // Now get patient information for each ID
    const patients = [];

    for (const patientId of patientIds) {
      const userDoc = await getDoc(doc(db, 'users', patientId));

      if (userDoc.exists()) {
        patients.push({
          id: userDoc.id,
          ...userDoc.data()
        });
      }
    }

    return patients;
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    return [];
  }
};

// Get patient details including appointment history
export const getPatientDetails = async (patientId, doctorId) => {
  try {
    // Get basic patient info
    const patientDoc = await getDoc(doc(db, 'users', patientId));

    if (!patientDoc.exists()) {
      console.log(`Patient with ID ${patientId} not found.`);
      return null;
    }

    const patientData = {
      id: patientDoc.id,
      ...patientDoc.data()
    };

    // Get appointment history with this doctor
    const appointmentsCollection = collection(db, 'appointments');
    const appointmentsQuery = query(
      appointmentsCollection,
      where('userId', '==', patientId),
      where('doctorId', '==', doctorId),
      orderBy('appointmentDate', 'desc')
    );

    const appointmentsSnapshot = await getDocs(appointmentsQuery);

    patientData.appointmentHistory = appointmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get medical records
    patientData.medicalRecords = await getPatientMedicalRecords(patientId);

    return patientData;
  } catch (error) {
    console.error('Error fetching patient details:', error);
    return null;
  }
};


// ====== Admin Functions ======

export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed in:", user);

        // Check if user is an admin. Admins need an entry in the 'admins' collection.
        const isAdmin = await verifyAdminStatus(user.uid);
        if (!isAdmin) {
            // If not an admin, sign them out immediately to prevent unauthorized access.
            await firebaseSignOut(auth);
            throw new Error('Unauthorized: Admin access required.');
        }

        return user;
    } catch (error) {
        console.error("Error signing in with email:", error);
        throw error;
    }
};

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if the user's email is in the admin whitelist or if they are an existing admin.
        const existingAdmin = await getAdminData(user.uid);
        if (!existingAdmin) {
            const isWhitelisted = checkAdminWhitelist(user.email);
            if (!isWhitelisted) {
                // If not whitelisted and not an existing admin, sign them out.
                await firebaseSignOut(auth);
                throw new Error('Unauthorized: Your email is not whitelisted for admin access. Please contact support.');
            }
        }

        // Create or update the admin document in Firestore.
        await createOrUpdateAdmin(user);

        return user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
};

export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
};

const checkAdminWhitelist = (email) => {
    const adminWhitelist = process.env.NEXT_PUBLIC_ADMIN_WHITELIST_EMAILS?.split(',')
        .map(e => e.trim()) // Trim whitespace from each email
        .filter(e => e !== '') || []; // Filter out empty strings

    return adminWhitelist.includes(email);
};

export const verifyAdminStatus = async (uid) => {
    try {
        const adminDoc = await getDoc(doc(db, 'admins', uid));
        return adminDoc.exists() && adminDoc.data()?.status === 'active';
    } catch (error) {
        console.error("Error verifying admin status:", error);
        return false; // Assume not admin on error
    }
};

export const getAdminData = async (uid) => {
    try {
        const adminDoc = await getDoc(doc(db, 'admins', uid));
        return adminDoc.exists() ? adminDoc.data() : null;
    } catch (error) {
        console.error("Error getting admin data:", error);
        return null;
    }
};

const createOrUpdateAdmin = async (user) => {
    const adminRef = doc(db, 'admins', user.uid);
    const adminDoc = await getDoc(adminRef);

    if (!adminDoc.exists()) {
        // Create new admin with default role (admin), can be upgraded by super admin
        await setDoc(adminRef, {
            email: user.email,
            displayName: user.displayName || user.email,
            photoURL: user.photoURL || null,
            role: 'admin', // Default role for new admins
            status: 'active', // Default status
            permissions: {
                canManageAdmins: false, // Default: normal admins cannot manage other admins
                canVerifyDoctors: true,
                canViewAnalytics: true
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: new Date()
        });
    } else {
        // Update last login timestamp for existing admin
        await setDoc(adminRef, {
            lastLogin: new Date(),
            updatedAt: new Date()
        }, { merge: true }); // Use merge to only update specified fields
    }
};

export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const adminData = await getAdminData(user.uid);
            if (adminData && adminData.status === 'active') {
                // Combine Firebase user data with Firestore admin data
                callback({ ...user, ...adminData });
            } else {
                // If not an active admin, ensure they are signed out and return null
                await firebaseSignOut(auth); // Ensure unauthorized users are logged out
                callback(null);
            }
        } else {
            callback(null);
        }
    });
};

// adminOperations

// Fetches all administrators from the 'admins' collection, ordered by creation date.
export const getAllAdmins = async () => {
    try {
        const adminsRef = collection(db, 'admins');
        const q = query(adminsRef, orderBy('createdAt', 'desc')); // May require a Firestore index
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            lastLogin: doc.data().lastLogin?.toDate()
        }));
    } catch (error) {
        console.error('Error fetching admins:', error);
        return [];
    }
};

// Fetches only active administrators.
export const getActiveAdmins = async () => {
    try {
        const adminsRef = collection(db, 'admins');
        const q = query(
            adminsRef,
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc') // May require a Firestore index
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            lastLogin: doc.data().lastLogin?.toDate()
        }));
    } catch (error) {
        console.error('Error fetching active admins:', error);
        return [];
    }
};

// Updates an admin's status (e.g., 'active', 'inactive', 'suspended').
export const updateAdminRole = async (adminId, role) => {
    try {
        const adminRef = doc(db, 'admins', adminId);
        const permissions = role === 'super_admin'
            ? { canManageAdmins: true, canVerifyDoctors: true, canViewAnalytics: true }
            : { canManageAdmins: false, canVerifyDoctors: true, canViewAnalytics: true };

        await updateDoc(adminRef, {
            role,
            permissions,
            updatedAt: new Date()
        });

        return true;
    } catch (error) {
        console.error('Error updating admin role:', error);
        throw error;
    }
};

// Updates an admin's status (e.g., 'active', 'inactive', 'suspended').
export const updateAdminStatus = async (adminId, status) => {
    try {
        const adminRef = doc(db, 'admins', adminId);
        await updateDoc(adminRef, {
            status,
            updatedAt: new Date()
        });

        return true;
    } catch (error) {
        console.error('Error updating admin status:', error);
        throw error;
    }
};

// Deletes an admin document from Firestore.
export const deleteAdmin = async (adminId) => {
    try {
        const adminRef = doc(db, 'admins', adminId);
        await deleteDoc(adminRef);
        return true;
    } catch (error) {
        console.error('Error deleting admin:', error);
        throw error;
    }
};

// Creates a new admin entry in Firestore.
export const createAdmin = async (adminData) => {
    try {
        if (!adminData.uid) {
            throw new Error("Admin UID is required to create an admin document.");
        }
        const adminRef = doc(db, 'admins', adminData.uid);
        // Determine permissions based on the role
        const permissions = adminData.role === 'super_admin'
            ? { canManageAdmins: true, canVerifyDoctors: true, canViewAnalytics: true }
            : { canManageAdmins: false, canVerifyDoctors: true, canViewAnalytics: true };

        await setDoc(adminRef, {
            email: adminData.email,
            displayName: adminData.displayName || adminData.email,
            role: adminData.role || 'admin', // Default to 'admin' if not specified
            status: 'active', // New admins are active by default
            permissions,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: adminData.createdBy || 'system' // Who created this admin
        });

        return true;
    } catch (error) {
        console.error('Error creating admin:', error);
        throw error;
    }
};

// Fetches a single admin's data by their ID.
export const getAdminById = async (adminId) => {
    try {
        const adminRef = doc(db, 'admins', adminId);
        const snapshot = await getDoc(adminRef);

        if (snapshot.exists()) {
            return {
                id: snapshot.id,
                ...snapshot.data(),
                createdAt: snapshot.data().createdAt?.toDate(),
                updatedAt: snapshot.data().updatedAt?.toDate(),
                lastLogin: snapshot.data().lastLogin?.toDate()
            };
        }

        return null;
    } catch (error) {
        console.error('Error fetching admin by ID:', error);
        return null;
    }
};

// doctorOperations controlled by the admins

// Fetches doctors based on their verification status.
export const getDoctorsByVerificationStatus = async (isVerified) => {
    try {
        const doctorsRef = collection(db, 'doctors');
        const q = query(
            doctorsRef,
            where('isVerified', '==', isVerified),
            orderBy('createdAt', 'desc') // Again, may require a Firestore index
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            verificationDate: doc.data().verificationDate?.toDate()
        }));
    } catch (error) {
        console.error('Error fetching doctors by status:', error);
        return [];
    }
};

// Fetches doctors whose 'isVerified' field is false.
export const getPendingDoctors = async () => {
    return await getDoctorsByVerificationStatus(false);
};

// Fetches doctors whose 'isVerified' field is true.
export const getVerifiedDoctors = async () => {
    return await getDoctorsByVerificationStatus(true);
};

// Updates a doctor's verification status and logs the action.
export const updateDoctorVerification = async (
    doctorId,
    isVerified,
    adminId,
    adminName,
    reason = '',
    notes = ''
) => {
    try {
        const doctorRef = doc(db, 'doctors', doctorId);

        // Get current doctor data to log previous status
        const doctorDoc = await getDoc(doctorRef);
        const doctorData = doctorDoc.data();
        const previousStatus = doctorData?.isVerified || false; // Default to false if not exists

        // Prepare update data
        const updateData = {
            isVerified: isVerified,
            updatedAt: new Date()
        };

        if (isVerified) {
            updateData.verificationDate = new Date();
            updateData.verifiedBy = adminId;
            updateData.verifiedByName = adminName; // Store admin's name for easier logging
            if (notes) updateData.verificationNotes = notes;
            // Clear rejection reason if verifying
            updateData.rejectionReason = '';

            // Find and add clinic ID to doctor's clinicIds when verifying
            try {
                const clinic = await getClinicByDoctorId(doctorId);
                if (clinic) {
                    const currentClinicIds = doctorData?.clinicIds || [];
                    // Add clinic ID if it's not already in the array
                    if (!currentClinicIds.includes(clinic.id)) {
                        updateData.clinicIds = [...currentClinicIds, clinic.id];
                        console.log(`Adding clinic ID ${clinic.id} to doctor ${doctorId}`);
                    } else {
                        console.log(`Clinic ID ${clinic.id} already exists for doctor ${doctorId}`);
                    }
                } else {
                    console.log(`No clinic found for doctor ${doctorId} during verification`);
                }
            } catch (clinicError) {
                console.error('Error fetching clinic for doctor during verification:', clinicError);
                // Continue with verification even if clinic fetch fails
            }
        } else {
            if (reason) updateData.rejectionReason = reason;
            if (notes) updateData.verificationNotes = notes; // Notes can be for rejection too
            // Clear verification data if unverifying/rejecting
            updateData.verificationDate = null;
            updateData.verifiedBy = '';
            updateData.verifiedByName = '';
        }

        await updateDoc(doctorRef, updateData);

        // Create a log entry for the verification action
        await createVerificationLog({
            doctorId,
            doctorName: doctorData?.name || doctorData?.displayName || doctorData?.email || 'Unknown Doctor',
            doctorEmail: doctorData?.email || 'Unknown Email',
            adminId,
            adminName,
            action: isVerified ? 'verified' : 'rejected',
            previousStatus,
            newStatus: isVerified,
            reason,
            notes
        });

        return true;
    } catch (error) {
        console.error('Error updating doctor verification:', error);
        throw error;
    }
};

// Creates a log entry for doctor verification actions.
export const createVerificationLog = async (logData) => {
    try {
        const logsRef = collection(db, 'verification_logs');
        await addDoc(logsRef, {
            ...logData,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error creating verification log:', error);
    }
};

// Fetches recent verification logs.
export const getVerificationLogs = async (limitCount = 50) => {
    try {
        const logsRef = collection(db, 'verification_logs');
        const q = query(logsRef, orderBy('timestamp', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
        }));
    } catch (error) {
        console.error('Error fetching verification logs:', error);
        return [];
    }
};

// Retrieves statistics for doctors (total, verified, pending, verification rate).
export const getDoctorStats = async () => {
    try {
        const doctorsRef = collection(db, 'doctors');
        const allDoctors = await getDocs(doctorsRef);

        let totalDoctors = 0;
        let verifiedDoctors = 0;
        let pendingDoctors = 0;

        allDoctors.docs.forEach(doc => {
            const data = doc.data();
            totalDoctors++;

            if (data.isVerified === true) {
                verifiedDoctors++;
            } else {
                pendingDoctors++;
            }
        });

        return {
            total: totalDoctors,
            verified: verifiedDoctors,
            pending: pendingDoctors,
            verificationRate: totalDoctors > 0 ? (verifiedDoctors / totalDoctors * 100).toFixed(1) : 0
        };
    } catch (error) {
        console.error('Error fetching doctor stats:', error);
        return {
            total: 0,
            verified: 0,
            pending: 0,
            verificationRate: 0
        };
    }
};


/**
 * Generates 90 availability documents for a clinic when a doctor is verified
 * @param {string} clinicId - The ID of the clinic
 * @param {Object} clinic - The clinic object containing operatingHours
 * @returns {Promise<number>} - Number of documents created
 */
export const generateAvailabilityDocuments = async (clinicId, clinic) => {
    try {
        if (!clinicId || !clinic) {
            throw new Error('Clinic ID and clinic data are required');
        }

        const availabilityCollection = collection(db, 'availability');
        const currentDate = new Date();
        const documentsToCreate = [];
        let documentsGenerated = 0;
        let currentDatePointer = new Date(currentDate);

        // Generate time slots from 09:00 to 17:00 (half-hourly)
        const generateTimeSlots = () => {
            const slots = [];
            for (let hour = 9; hour <= 16; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    if (hour === 16 && minute > 30) break; // Stop at 16:30
                    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    slots.push({
                        availableSlot: true,
                        time: timeString
                    });
                }
            }
            return slots;
        };

        // Helper function to get day name from date (capitalized to match schema)
        const getDayName = (date) => {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[date.getDay()];
        };

        // Debug: Log clinic operating hours structure
        console.log('Clinic operating hours structure:', JSON.stringify(clinic.operatingHours, null, 2));
        
        // Create default operating hours if missing or invalid (using capitalized days)
        const defaultOperatingHours = {
            Monday: { open: "09:00", close: "17:00", closed: false },
            Tuesday: { open: "09:00", close: "17:00", closed: false },
            Wednesday: { open: "09:00", close: "17:00", closed: false },
            Thursday: { open: "09:00", close: "17:00", closed: false },
            Friday: { open: "09:00", close: "17:00", closed: false },
            Saturday: { open: "09:00", close: "17:00", closed: false },
            Sunday: { open: "00:00", close: "00:00", closed: true }
        };

        // Use clinic's operating hours or fall back to default
        const operatingHours = clinic.operatingHours || defaultOperatingHours;
        
        // Validate that operating hours has the expected structure
        const hasValidOperatingHours = operatingHours && 
            typeof operatingHours === 'object' &&
            Object.keys(operatingHours).length > 0;
            
        if (!hasValidOperatingHours) {
            console.warn('Invalid operating hours structure, using default operating hours');
            clinic.operatingHours = defaultOperatingHours;
        } else {
            clinic.operatingHours = operatingHours;
        }
        
        console.log('Final operating hours to be used:', JSON.stringify(clinic.operatingHours, null, 2));

        // Continue generating until we have exactly 90 documents
        while (documentsGenerated < 90) {
            const dayName = getDayName(currentDatePointer);
            const dateString = currentDatePointer.toISOString().split('T')[0]; // YYYY-MM-DD format
            
            // Check if the clinic is open on this day
            const dayOperatingHours = clinic.operatingHours && clinic.operatingHours[dayName];
            const isOpen = dayOperatingHours && !dayOperatingHours.closed;

            // Debug: Log each day's check (only first 10 days to avoid spam)
            if (documentsGenerated < 10) {
                console.log(`Checking day: ${dayName} (${dateString})`);
                console.log(`Day operating hours:`, dayOperatingHours);
                console.log(`Is open:`, isOpen);
            }

            if (isOpen) {
                // Create availability document for this day
                const availabilityDoc = {
                    availableDay: true,
                    clinicId: clinicId,
                    date: dateString,
                    location: clinic.location || '',
                    slots: generateTimeSlots()
                };

                documentsToCreate.push(availabilityDoc);
                documentsGenerated++;
                console.log(`Document ${documentsGenerated} created for ${dayName} (${dateString})`);
            }

            // Move to the next day
            currentDatePointer.setDate(currentDatePointer.getDate() + 1);

            // Safety check to prevent infinite loops (max 365 days)
            if (currentDatePointer.getTime() - currentDate.getTime() > 365 * 24 * 60 * 60 * 1000) {
                console.warn('Reached maximum date range. Generated only', documentsGenerated, 'documents.');
                console.warn('Clinic operating hours that caused this:', JSON.stringify(clinic.operatingHours, null, 2));
                break;
            }
        }

        // Batch create documents for better performance
        const batchSize = 10;
        for (let i = 0; i < documentsToCreate.length; i += batchSize) {
            const batch = documentsToCreate.slice(i, i + batchSize);
            const promises = batch.map(doc => addDoc(availabilityCollection, doc));
            await Promise.all(promises);
        }

        console.log(`Successfully generated ${documentsGenerated} availability documents for clinic ${clinicId}`);
        return documentsGenerated;

    } catch (error) {
        console.error('Error generating availability documents:', error);
        throw error;
    }
};

export default firebaseConfig;
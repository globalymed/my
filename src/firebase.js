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
// Email handling is done automatically by Firebase Cloud Functions
// No imports needed for direct email services

// Import the password generator utility
import { generateSecurePassword } from './utils/passwordUtils';

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
      ...doc.data()
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

export default firebaseConfig;
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
    // Check if user exists, if not create a new user document
    const userRef = await getOrCreateUser(appointmentData);
    
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
    
    // Create appointment record
    const appointmentRef = await addDoc(collection(db, 'appointments'), {
      userId: userRef.id,
      clinicId: appointmentData.clinicId,
      clinicName: appointmentData.clinicName,
      treatmentType: appointmentData.treatmentType,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      // If we have uploaded files, use those; otherwise use metadata
      medicalRecords: uploadedFiles.length > 0 ? uploadedFiles : fileMetadata,
      hasUploadedFiles: uploadedFiles.length > 0,
      isDevelopmentEnvironment: isLocalhost,
      symptoms: appointmentData.symptoms || [],
      notes: appointmentData.notes || '',
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update availability status - mark the slot as booked
    if (appointmentData.availabilityId) {
      await updateAvailabilityStatus(appointmentData.availabilityId, 'booked', appointmentRef.id);
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
    // Check if user with this email already exists
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', userData.email));
    const userSnapshot = await getDocs(q);
    
    // If user exists, return the user reference
    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      // Optionally update user data if needed
      await updateDoc(doc(db, 'users', userDoc.id), {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        city: userData.city,
        country: userData.country,
        updatedAt: serverTimestamp()
      });
      
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }
    
    // If user doesn't exist, create a new user
    const newUserRef = await addDoc(collection(db, 'users'), {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      city: userData.city,
      country: userData.country,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: newUserRef.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email
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

export default db;
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";

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

export default db;
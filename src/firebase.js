// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: "AIzaSyAR-u3B5FnBzQvQJU6UROCDpG6mMRt99IE",
  projectId: "clinics-data-4b8ed",
  authDomain: "clinics-data-4b8ed.firebaseapp.com",
  storageBucket: "clinics-data-4b8ed.firebasestorage.app",
  messagingSenderId: "582617621697",
  appId: "1:582617621697:web:a8198e2fcd70058490e040"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper functions for Firestore access
export const getClinics = async () => {
  const clinicsCollection = collection(db, 'clinics');
  const clinicsSnapshot = await getDocs(clinicsCollection);
  return clinicsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getClinicById = async (clinicId) => {
  const clinicRef = doc(db, 'clinics', clinicId);
  const clinicSnap = await getDoc(clinicRef);
  
  if (clinicSnap.exists()) {
    return {
      id: clinicSnap.id,
      ...clinicSnap.data()
    };
  } else {
    return null;
  }
};

export const getAvailability = async (clinicId, date) => {
  const availabilityCollection = collection(db, 'availability');
  const q = query(
    availabilityCollection,
    where('clinicId', '==', clinicId),
    where('date', '==', date)
  );
  
  const availabilitySnapshot = await getDocs(q);
  return availabilitySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export default db;
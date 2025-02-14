import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: "AIzaSyAR-u3B5FnBzQvQJU6UROCDpG6mMRt99IE",
  projectId: "clinics-data-4b8ed",
  authDomain: "clinics-data-4b8ed.firebaseapp.com",
  storageBucket: "clinics-data-4b8ed.firebasestorage.app",
  messagingSenderId: "582617621697",
  appId: "1:582617621697:web:a8198e2fcd70058490e040"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const perf = getPerformance(app); 
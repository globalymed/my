// setupAvailability.js
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc,
  query, 
  where,
  writeBatch,
  doc
} = require('firebase/firestore');

// Firebase configuration (same as in your firebase.js)
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
const db = getFirestore(app);

// Helper function to generate dates for the next 30 days
function getNextNDays(n) {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < n; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    // Format as YYYY-MM-DD
    const formattedDate = nextDate.toISOString().split('T')[0];
    dates.push(formattedDate);
  }
  
  return dates;
}

// Function to fetch all clinics
async function getClinics() {
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
}

// Function to create availability entries for all clinics
async function setupAvailability() {
  try {
    // Fetch all clinics
    const clinics = await getClinics();
    console.log(`Found ${clinics.length} clinics.`);
    
    if (clinics.length === 0) {
      console.log('No clinics to set up availability for.');
      return;
    }
    
    // Get the next 30 days
    const dates = getNextNDays(30);
    console.log(`Setting up availability for the next ${dates.length} days.`);
    
    // Create a batch for efficient writes
    const batch = writeBatch(db);
    let operationCount = 0;
    const MAX_BATCH_SIZE = 500; // Firestore limit
    
    // Track how many documents we'll create
    let totalDocuments = 0;
    
    // For each clinic and date, create availability entries
    for (const clinic of clinics) {
      console.log(`Setting up availability for clinic: ${clinic.name} (${clinic.id})`);
      
      for (const date of dates) {
        // For demo purposes, make the clinic randomly available (70% chance)
        const isAvailable = Math.random() < 0.7;
        
        // Create new document reference
        const newAvailabilityRef = doc(collection(db, 'availability'));
        
        // Set data
        batch.set(newAvailabilityRef, {
          clinicId: clinic.id,
          date: date,
          available: isAvailable,
          slots: isAvailable ? [
            { time: '09:00', available: Math.random() < 0.8 },
            { time: '10:00', available: Math.random() < 0.8 },
            { time: '11:00', available: Math.random() < 0.8 },
            { time: '12:00', available: Math.random() < 0.8 },
            { time: '14:00', available: Math.random() < 0.8 },
            { time: '15:00', available: Math.random() < 0.8 },
            { time: '16:00', available: Math.random() < 0.8 },
            { time: '17:00', available: Math.random() < 0.8 }
          ] : []
        });
        
        operationCount++;
        totalDocuments++;
        
        // If we reach the batch limit, commit and start a new batch
        if (operationCount >= MAX_BATCH_SIZE) {
          await batch.commit();
          console.log(`Committed batch of ${operationCount} operations.`);
          batch = writeBatch(db); // Create a new batch
          operationCount = 0;
        }
      }
    }
    
    // Commit any remaining operations
    if (operationCount > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${operationCount} operations.`);
    }
    
    console.log(`Setup complete! Created ${totalDocuments} availability documents.`);
    
  } catch (error) {
    console.error('Error setting up availability:', error);
  }
}

// Run the setup
setupAvailability().then(() => {
  console.log('Availability setup process complete.');
}).catch(error => {
  console.error('Fatal error during setup:', error);
});

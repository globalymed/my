import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Stack,
  Button,
  Switch,
  Chip,
  Skeleton,
  IconButton,
  Tooltip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Badge,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  Clock, 
  Plus, 
  Calendar, 
  Edit,
  Save,
  CheckCircle,
  User,
  Building2,
  RefreshCw
} from 'lucide-react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../../../firebase';

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Initialize time slots (9:00 AM to 5:30 PM)
const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
];

// Convert time format for Firestore (9:00 AM -> 09:00)
const convertTimeToFirestore = (timeSlot) => {
  const [time, period] = timeSlot.split(' ');
  const [hour, minute] = time.split(':');
  let hour24 = parseInt(hour);
  
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minute}`;
};

// Convert time format from Firestore (09:00 -> 9:00 AM)
const convertTimeFromFirestore = (time24) => {
  const [hour, minute] = time24.split(':');
  const hour24 = parseInt(hour);
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const displayHour = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
  return `${displayHour}:${minute} ${period}`;
};

function groupSlotsByDay(availabilityDocs) {
  const result = {};
  WEEK_DAYS.forEach(day => (result[day] = []));
  availabilityDocs.forEach(doc => {
    const date = new Date(doc.date);
    const dayName = WEEK_DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
    result[dayName].push(doc);
  });
  return result;
}

const AvailabilityContent = ({ loggedInDoctorId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Original states
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState('');

  // New states from second component
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [availabilityData, setAvailabilityData] = useState({});
  const [documentMap, setDocumentMap] = useState({});
  const [savingLoading, setSavingLoading] = useState(false);
  
  // Doctor and clinic selection states
  const [loggedInDoctor, setLoggedInDoctor] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState('');
  const [availableClinics, setAvailableClinics] = useState([]); // Will store clinic objects with {id, name, etc.}
  const [clinicsData, setClinicsData] = useState({}); // Map of clinicId -> clinic data
  const [loadingDoctor, setLoadingDoctor] = useState(false);
  const [loadingClinics, setLoadingClinics] = useState(false);
  const [clinicId, setClinicId] = useState('');

  // Fetch clinic details from clinicIds array
  const fetchClinicDetails = async (clinicIds) => {
    if (!clinicIds || !Array.isArray(clinicIds) || clinicIds.length === 0) {
      console.warn('⚠️ No valid clinic IDs provided:', clinicIds);
      setAvailableClinics([]);
      setClinicsData({});
      return;
    }

    setLoadingClinics(true);
    console.log('🔄 Starting clinic fetch for IDs:', clinicIds);
    
    try {
      const clinicsMap = {};
      const clinicsArray = [];
      
      // Fetch each clinic document
      for (const clinicId of clinicIds) {
        console.log(`🔄 Fetching clinic: ${clinicId}`);
        
        try {
          const clinicDocRef = doc(db, 'clinics', clinicId);
          const clinicSnap = await getDoc(clinicDocRef);
          
          if (clinicSnap.exists()) {
            const clinicData = { id: clinicId, ...clinicSnap.data() };
            clinicsMap[clinicId] = clinicData;
            clinicsArray.push(clinicData);
            console.log(`✅ Clinic fetched successfully:`, clinicData);
          } else {
            console.warn(`⚠️ Clinic document not found: ${clinicId}`);
            // Still add to array with just ID for display
            const fallbackClinic = { 
              id: clinicId, 
              name: `Clinic ${clinicId}`, 
              clinicName: `Clinic ${clinicId}`,
              notFound: true 
            };
            clinicsMap[clinicId] = fallbackClinic;
            clinicsArray.push(fallbackClinic);
          }
        } catch (clinicError) {
          console.error(`❌ Error fetching clinic ${clinicId}:`, clinicError);
          // Add fallback clinic data
          const fallbackClinic = { 
            id: clinicId, 
            name: `Clinic ${clinicId}`, 
            clinicName: `Clinic ${clinicId}`,
            error: true,
            errorMessage: clinicError.message
          };
          clinicsMap[clinicId] = fallbackClinic;
          clinicsArray.push(fallbackClinic);
        }
      }
      
      console.log('🏥 Final clinics array:', clinicsArray);
      console.log('🏥 Final clinics map:', clinicsMap);
      
      setAvailableClinics(clinicsArray);
      setClinicsData(clinicsMap);
      
      // Auto-select first clinic if only one is available
      if (clinicsArray.length === 1) {
        const firstClinic = clinicsArray[0];
        setSelectedClinic(firstClinic.id);
        setClinicId(firstClinic.id);
        console.log('✅ Auto-selected single clinic:', firstClinic);
      } else if (clinicsArray.length > 1) {
        console.log(`✅ ${clinicsArray.length} clinics loaded, user needs to select`);
      }
      
      // Clear any existing errors if clinics were loaded successfully
      if (clinicsArray.length > 0) {
        setError('');
      }
      
    } catch (error) {
      console.error('❌ Error fetching clinic details:', error);
      setError('Error loading clinic details: ' + error.message);
      setAvailableClinics([]);
      setClinicsData({});
    } finally {
      setLoadingClinics(false);
    }
  };

  // Enhanced function to fetch doctor from Firestore based on localStorage ID
  const fetchDoctorFromFirestore = async (doctorId) => {
    if (!doctorId) {
      console.warn('⚠️ No doctor ID provided');
      return null;
    }

    console.log('🔄 Fetching doctor from Firestore with ID:', doctorId);
    
    try {
      // Try direct document reference first
      const doctorDocRef = doc(db, 'doctors', doctorId);
      const doctorSnap = await getDoc(doctorDocRef);
      
      if (doctorSnap.exists()) {
        const doctorData = { id: doctorId, ...doctorSnap.data() };
        console.log('✅ Doctor found by direct reference:', doctorData);
        return doctorData;
      } else {
        console.warn(`⚠️ Doctor document not found: ${doctorId}`);
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching doctor from Firestore:', error);
      return null;
    }
  };

  // Fetch doctor from localStorage or use prop
  useEffect(() => {
    const fetchDoctorData = async () => {
      console.log('🔄 Starting doctor data fetch...');
      console.log('loggedInDoctorId prop:', loggedInDoctorId);
      
      // Try to get from prop first
      if (loggedInDoctorId) {
        console.log('Using loggedInDoctorId prop:', loggedInDoctorId);
        await fetchLoggedInDoctor(loggedInDoctorId);
        return;
      }
      
      // Fallback to localStorage
      const doctorDataString = localStorage.getItem('doctorData');
      console.log('doctorData from localStorage:', doctorDataString);
      
      if (doctorDataString) {
        try {
          const localDoctorData = JSON.parse(doctorDataString);
          console.log('Parsed doctor data from localStorage:', localDoctorData);
          
          // Check if we have the doctor ID
          const doctorId = localDoctorData.id;
          if (!doctorId) {
            console.error('❌ No doctor ID found in localStorage data');
            setError('Invalid doctor data in localStorage. Please log in again.');
            return;
          }

          // Fetch complete doctor data from Firestore
          console.log('🔄 Fetching complete doctor data from Firestore...');
          const firestoreDoctorData = await fetchDoctorFromFirestore(doctorId);
          
          if (firestoreDoctorData) {
            console.log('✅ Complete doctor data from Firestore:', firestoreDoctorData);
            
            // Merge localStorage data with Firestore data (Firestore takes precedence)
            const mergedDoctorData = {
              ...localDoctorData,
              ...firestoreDoctorData
            };
            
            setDoctor(mergedDoctorData);
            setLoggedInDoctor(mergedDoctorData);
            
            // Debug clinic IDs from Firestore
            console.log('🏥 ClinicIds from Firestore:', firestoreDoctorData.clinicIds);
            console.log('🏥 Type:', typeof firestoreDoctorData.clinicIds);
            console.log('🏥 Is array:', Array.isArray(firestoreDoctorData.clinicIds));
            
            // Fetch clinic details if present
            if (firestoreDoctorData.clinicIds && Array.isArray(firestoreDoctorData.clinicIds) && firestoreDoctorData.clinicIds.length > 0) {
              console.log('🔄 Fetching clinics from Firestore data...');
              await fetchClinicDetails(firestoreDoctorData.clinicIds);
            } else {
              console.warn('⚠️ No valid clinics in Firestore data');
              setAvailableClinics([]);
              setClinicsData({});
              setError('No clinics are assigned to your profile. Please contact the administrator.');
            }
          } else {
            console.error('❌ Could not fetch doctor data from Firestore');
            setError('Could not load doctor profile from database. Please contact support.');
          }
        } catch (parseError) {
          console.error('❌ Error parsing localStorage doctorData:', parseError);
          setError('Error parsing doctor data from localStorage');
        }
      } else {
        console.warn('⚠️ No doctor data found in localStorage');
        setError('No doctor data found. Please log in again.');
      }
    };
    
    fetchDoctorData();
  }, [loggedInDoctorId]);

  // Fetch logged-in doctor data from Firestore (enhanced version)
  const fetchLoggedInDoctor = async (doctorId) => {
    if (!doctorId) {
      console.warn('⚠️ No doctor ID provided');
      return;
    }

    setLoadingDoctor(true);
    try {
      console.log('🔄 Fetching logged-in doctor data for ID:', doctorId);
      
      const doctorData = await fetchDoctorFromFirestore(doctorId);
      
      if (!doctorData) {
        console.error('❌ Doctor not found with ID:', doctorId);
        setError('Doctor profile not found. Please contact support.');
        return;
      }

      // Log the complete doctor data for debugging
      console.log('👨‍⚕️ Complete doctor data:', JSON.stringify(doctorData, null, 2));
      
      if (doctorData.status !== 'active') {
        console.warn('⚠️ Doctor account is not active:', doctorData.status);
        setError('Your doctor account is not active. Please contact support.');
        return;
      }

      setLoggedInDoctor(doctorData);
      setDoctor(doctorData);
      
      // Debug clinic IDs
      console.log('🏥 Doctor clinicIds field:', doctorData.clinicIds);
      console.log('🏥 Type of clinicIds:', typeof doctorData.clinicIds);
      console.log('🏥 Is array:', Array.isArray(doctorData.clinicIds));
      
      // Fetch clinic details from the doctor's clinicIds
      if (doctorData.clinicIds && Array.isArray(doctorData.clinicIds) && doctorData.clinicIds.length > 0) {
        console.log('🔄 Fetching clinics for IDs:', doctorData.clinicIds);
        await fetchClinicDetails(doctorData.clinicIds);
      } else {
        console.warn('⚠️ No valid clinics assigned to this doctor');
        console.warn('clinicIds value:', doctorData.clinicIds);
        setAvailableClinics([]);
        setClinicsData({});
        setError('No clinics are assigned to your profile. Please contact the administrator.');
      }
      
    } catch (error) {
      console.error('❌ Error fetching doctor data:', error);
      setError('Error loading doctor profile: ' + error.message);
    } finally {
      setLoadingDoctor(false);
    }
  };

  // Handle clinic selection
  const handleClinicChange = (selectedClinicId) => {
    console.log('🏥 Clinic selected:', selectedClinicId);
    const selectedClinicData = clinicsData[selectedClinicId];
    console.log('🏥 Selected clinic data:', selectedClinicData);
    
    setSelectedClinic(selectedClinicId);
    setClinicId(selectedClinicId);
    setAvailabilityData({});
    setDocumentMap({});
    
    // Fetch availability data for the selected clinic
    if (selectedClinicId) {
      fetchAvailabilityForClinic(selectedClinicId);
    }
  };

  // Fetch availability for clinic (enhanced version)
  const fetchAvailabilityForClinic = async (clinicIdToFetch) => {
    setLoading(true);
    try {
      console.log(`🔄 Fetching availability for clinic: ${clinicIdToFetch}`);
      const q = query(
        collection(db, 'availability'), 
        where('clinicId', '==', clinicIdToFetch)
      );
      const snapshot = await getDocs(q);
      
      const firestoreData = {};
      const docMap = {};
      const availabilityDocs = [];
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const dayKey = data.date;
        
        // Store the actual document ID for future updates
        docMap[dayKey] = doc.id;
        
        // Convert Firestore array format to component format
        const slots = {};
        if (data.slots && Array.isArray(data.slots)) {
          data.slots.forEach(slot => {
            const displayTime = convertTimeFromFirestore(slot.time);
            slots[displayTime] = slot.availableSlot;
          });
        }
        
        firestoreData[dayKey] = {
          isOffDay: !data.availableDay,
          slots: slots,
          docId: doc.id
        };

        // Add to availability docs for stats
        availabilityDocs.push({
          id: doc.id,
          ...data
        });
      });
      
      console.log('📋 Document mapping loaded:', docMap);
      console.log('📊 Availability data loaded:', firestoreData);
      
      // Update states
      setDocumentMap(docMap);
      setAvailabilityData(prev => ({
        ...prev,
        ...firestoreData
      }));
      setAvailability(availabilityDocs);
      
    } catch (error) {
      console.error('❌ Error loading availability:', error);
      setError('Error loading availability: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize week and availability data
  useEffect(() => {
    if (!selectedClinic) {
      return;
    }

    const startDay = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDay, i);
      days.push(day);
    }

    setWeekDays(days);

    // Only initialize with default data if no existing data
    const newAvailabilityData = {};
    days.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      if (!availabilityData[dayKey]) {
        newAvailabilityData[dayKey] = {
          isOffDay: false,
          slots: timeSlots.reduce((acc, slot) => {
            // Make future days available by default
            const isFuture = day > new Date();
            acc[slot] = isFuture ? true : false;
            return acc;
          }, {})
        };
      }
    });

    // Only update if we have new data to add
    if (Object.keys(newAvailabilityData).length > 0) {
      setAvailabilityData(prev => ({
        ...prev,
        ...newAvailabilityData
      }));
    }
  }, [selectedDate, selectedClinic]);

  // Compute summary stats (enhanced)
  const weeklyHours = useMemo(() => {
    let total = 0;
    availability.forEach(doc => {
      if (doc.availableDay && Array.isArray(doc.slots)) {
        total += doc.slots.filter(slot => slot.availableSlot).length * 0.5;
      }
    });
    return total;
  }, [availability]);

  const activeDays = useMemo(() => {
    return availability.filter(doc => doc.availableDay).length;
  }, [availability]);

  const avgDailyHours = activeDays ? (weeklyHours / activeDays).toFixed(1) : 0;

  const nextAvailable = useMemo(() => {
    const today = new Date();
    const future = availability
      .filter(doc => doc.availableDay && new Date(doc.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    if (future.length > 0) {
      const d = new Date(future[0].date);
      if (d.toDateString() === today.toDateString()) return 'Today';
      return d.toLocaleDateString();
    }
    return 'N/A';
  }, [availability]);

  // Group slots by weekday for display
  const slotsByDay = useMemo(() => groupSlotsByDay(availability), [availability]);

  // Calculate active slots count
  const getActiveSlotCount = (dayKey) => {
    if (!availabilityData[dayKey]) return 0;
    if (availabilityData[dayKey].isOffDay) return 0;
    return Object.values(availabilityData[dayKey].slots || {}).filter(Boolean).length;
  };

  // Calculate total available hours for a day
  const getAvailableHours = (dayKey) => {
    const activeSlots = getActiveSlotCount(dayKey);
    return (activeSlots * 0.5).toFixed(1);
  };

  // Handler for date selection
  const handleDateChange = (newDate) => setSelectedDate(newDate);

  // Enhanced slot toggle handler
  const handleSlotToggle = async (dayKey, slot) => {
    if (!clinicId) {
      setError('Please select a clinic first');
      return;
    }

    try {
      console.log(`🔄 Toggling slot: ${slot} for date: ${dayKey} in clinic: ${clinicId}`);
      
      // Get current state
      const currentData = availabilityData[dayKey] || { isOffDay: false, slots: {} };
      const currentValue = currentData.slots[slot] || false;
      const newValue = !currentValue;
      
      console.log(`📊 Current value: ${currentValue} → New value: ${newValue}`);
      
      // Update local state first for immediate UI feedback
      const updatedAvailabilityData = {
        ...availabilityData,
        [dayKey]: {
          ...currentData,
          slots: {
            ...currentData.slots,
            [slot]: newValue,
          },
        },
      };
      
      setAvailabilityData(updatedAvailabilityData);

      // Prepare Firestore data with ALL time slots
      const updatedDayData = updatedAvailabilityData[dayKey];
      
      const firestoreSlots = timeSlots.map(timeSlot => {
        const firestoreTime = convertTimeToFirestore(timeSlot);
        const isAvailable = updatedDayData.slots[timeSlot] || false;
        
        return {
          time: firestoreTime,
          availableSlot: isAvailable
        };
      });

      // Sort slots by time for consistency
      firestoreSlots.sort((a, b) => a.time.localeCompare(b.time));

      const firestoreData = {
        clinicId: clinicId,
        date: dayKey,
        availableDay: !updatedDayData.isOffDay,
        slots: firestoreSlots
      };

      console.log('💾 Firestore data being saved:', JSON.stringify(firestoreData, null, 2));

      // Use existing document ID if available, otherwise create new document with date-based ID
      const existingDocId = documentMap[dayKey];
      let docRef;
      
      if (existingDocId) {
        console.log(`📝 Updating existing document: ${existingDocId}`);
        docRef = doc(db, 'availability', existingDocId);
      } else {
        console.log(`📄 Creating new document for date: ${dayKey}`);
        docRef = doc(db, 'availability', `${clinicId}-${dayKey}`);
        // Update document map for future reference
        setDocumentMap(prev => ({
          ...prev,
          [dayKey]: `${clinicId}-${dayKey}`
        }));
      }

      await setDoc(docRef, firestoreData, { merge: false });

      console.log(`✅ Successfully saved to Firestore for ${dayKey}`);
      
      // Refresh availability data
      fetchAvailabilityForClinic(clinicId);
      
    } catch (error) {
      console.error('❌ Error updating slot:', error);
      setError('Error updating slot: ' + error.message);
      
      // Revert local state on error
      setAvailabilityData(prev => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          slots: {
            ...prev[dayKey].slots,
            [slot]: !prev[dayKey].slots[slot],
          },
        },
      }));
    }
  };

  // Enhanced off day toggle handler
  const handleOffDayToggle = async (dayKey) => {
    if (!clinicId) {
      setError('Please select a clinic first');
      return;
    }

    try {
      console.log(`🔄 Toggling off day for date: ${dayKey} in clinic: ${clinicId}`);
      
      const currentData = availabilityData[dayKey] || { isOffDay: false, slots: {} };
      const currentOffDayValue = currentData.isOffDay;
      const newOffDayValue = !currentOffDayValue;
      
      console.log(`📊 Off day status: ${currentOffDayValue} → ${newOffDayValue}`);
      
      // Update local state first for immediate UI feedback
      const updatedAvailabilityData = {
        ...availabilityData,
        [dayKey]: {
          ...currentData,
          isOffDay: newOffDayValue,
          slots: newOffDayValue 
            ? timeSlots.reduce((acc, slot) => {
                acc[slot] = false; // Day is OFF, so no slots available
                return acc;
              }, {})
            : timeSlots.reduce((acc, slot) => {
                acc[slot] = true; // Day is ON, so make all slots available
                return acc;
              }, {})
        },
      };
      
      setAvailabilityData(updatedAvailabilityData);

      const updatedDayData = updatedAvailabilityData[dayKey];
      
      // Prepare Firestore data with ALL time slots
      const firestoreSlots = timeSlots.map(timeSlot => {
        const firestoreTime = convertTimeToFirestore(timeSlot);
        const isAvailable = newOffDayValue ? false : true;
        
        return {
          time: firestoreTime,
          availableSlot: isAvailable
        };
      });

      // Sort slots by time for consistency
      firestoreSlots.sort((a, b) => a.time.localeCompare(b.time));

      const firestoreData = {
        clinicId: clinicId,
        date: dayKey,
        availableDay: !newOffDayValue,
        slots: firestoreSlots
      };

      console.log('💾 Firestore data being saved:', JSON.stringify(firestoreData, null, 2));

      // Use existing document ID if available
      const existingDocId = documentMap[dayKey];
      let docRef;
      
      if (existingDocId) {
        console.log(`📝 Updating existing document: ${existingDocId}`);
        docRef = doc(db, 'availability', existingDocId);
      } else {
        console.log(`📄 Creating new document for date: ${dayKey}`);
        const newDocId = `${clinicId}-${dayKey}`;
        docRef = doc(db, 'availability', newDocId);
        setDocumentMap(prev => ({
          ...prev,
          [dayKey]: newDocId
        }));
      }

      await setDoc(docRef, firestoreData, { merge: false });
      
      console.log(`✅ Document ${newOffDayValue ? 'marked as off day' : 'marked as available day with all slots enabled'} for ${dayKey}`);
      
      // Refresh availability data
      fetchAvailabilityForClinic(clinicId);
      
    } catch (error) {
      console.error('❌ Error updating day status:', error);
      setError('Error updating day status: ' + error.message);
      
      // Revert local state on error
      setAvailabilityData(prev => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          isOffDay: !prev[dayKey].isOffDay
        },
      }));
    }
  };

  // Get week range text
  const getWeekRangeText = () => {
    if (weekDays.length < 1) return '';
    const start = weekDays[0];
    const end = weekDays[6];
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  // Check if today is in current week
  const isTodayInWeek = weekDays.some(day => isToday(day));
  const todayKey = isTodayInWeek ? format(new Date(), 'yyyy-MM-dd') : null;
  const availableToday = todayKey ? getAvailableHours(todayKey) : 0;

  // Get active slots for selected day
  const selectedDayKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDayData = availabilityData[selectedDayKey] || {};
  const selectedDaySlots = selectedDayData.slots || {};
  const activeSlotCount = getActiveSlotCount(selectedDayKey);

  // Batch save schedule to Firestore
  const handleSaveSchedule = async () => {
    if (!clinicId) {
      setError('Please select a clinic first');
      return;
    }

    if (weekDays.length === 0) {
      setError('No days to save');
      return;
    }

    setSavingLoading(true);
    try {
      console.log('🔄 Starting batch save...');
      
      const savePromises = weekDays.map(async (day) => {
        const dayKey = format(day, 'yyyy-MM-dd');
        const dayData = availabilityData[dayKey];
        const existingDocId = documentMap[dayKey];
        
        if (!dayData) return;

        const firestoreSlots = timeSlots.map(timeSlot => {
          const firestoreTime = convertTimeToFirestore(timeSlot);
          const isAvailable = dayData.isOffDay ? false : (dayData.slots[timeSlot] || false);
          
          return {
            time: firestoreTime,
            availableSlot: isAvailable
          };
        });

        firestoreSlots.sort((a, b) => a.time.localeCompare(b.time));

        const firestoreData = {
          clinicId: clinicId,
          date: dayKey,
          availableDay: !dayData.isOffDay,
          slots: firestoreSlots
        };

        let docRef;
        if (existingDocId) {
          docRef = doc(db, 'availability', existingDocId);
        } else {
          const newDocId = `${clinicId}-${dayKey}`;
          docRef = doc(db, 'availability', newDocId);
        }

        await setDoc(docRef, firestoreData, { merge: false });
        console.log(`✅ Document saved for ${dayKey} (${dayData.isOffDay ? 'OFF DAY' : 'AVAILABLE DAY'})`);
      });

      await Promise.all(savePromises);
      setError(''); // Clear any previous errors
      console.log('✅ Batch save completed successfully');
      
      // Refresh availability data
      if (clinicId) {
        fetchAvailabilityForClinic(clinicId);
      }
      
    } catch (error) {
      console.error('❌ Error saving availability:', error);
      setError('Error saving availability: ' + error.message);
    } finally {
      setSavingLoading(false);
    }
  };

  // Get clinic display name
  const getClinicDisplayName = (clinicId) => {
    const clinic = clinicsData[clinicId];
    if (!clinic) return clinicId;
    return clinic.name || clinic.clinicName || clinic.title || `Clinic ${clinicId}`;
  };

  // Get selected clinic data
  const selectedClinicData = selectedClinic ? clinicsData[selectedClinic] : null;

  // Show loading state while doctor data is being fetched
  if (loadingDoctor) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ 
          p: 4, 
          borderRadius: 4,
          textAlign: 'center'
        }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Loading Doctor Profile...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we fetch your profile information.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box p={{ xs: 1, md: 3 }}>
      {/* Header */}
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={2}>
        <div>
          <Typography variant="h6" fontWeight="bold">Availability Management</Typography>
          <Typography variant="body2" color="text.secondary">Manage your working hours and schedule across clinics</Typography>
        </div>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshCw size={18} />}
            onClick={() => selectedClinic && fetchAvailabilityForClinic(selectedClinic)}
            disabled={loading || !selectedClinic}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }} 
            startIcon={savingLoading ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
            onClick={handleSaveSchedule}
            disabled={savingLoading || !selectedClinic}
          >
            {savingLoading ? 'Saving...' : 'Save All'}
          </Button>
        </Stack>
      </Box>

      {/* Doctor Profile and Clinic Selection */}
      {loggedInDoctor && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <User size={20} style={{ color: '#2563eb' }} />
              Doctor Profile & Clinic Selection
            </Typography>
            
            <Grid container spacing={3}>
              {/* Doctor Display */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: 'rgba(76, 175, 80, 0.03)'
                }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                    Logged-in Doctor:
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, backgroundColor: '#22c55e' }}>
                      {loggedInDoctor.firstName?.[0]}{loggedInDoctor.lastName?.[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Dr. {loggedInDoctor.firstName} {loggedInDoctor.lastName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {loggedInDoctor.specialization} • {loggedInDoctor.experience} years exp.
                      </Typography>
                    </Box>
                    <Chip 
                      label="Active" 
                      size="small" 
                      sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#22c55e' }}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Clinic Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={loadingClinics}>
                  <InputLabel id="clinic-select-label">Select Clinic *</InputLabel>
                  <Select
                    labelId="clinic-select-label"
                    value={selectedClinic}
                    label="Select Clinic *"
                    onChange={(e) => handleClinicChange(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    {loadingClinics ? (
                      <MenuItem disabled>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={20} />
                          Loading clinics...
                        </Box>
                      </MenuItem>
                    ) : availableClinics.length === 0 ? (
                      <MenuItem disabled>
                        No clinics assigned to your profile
                      </MenuItem>
                    ) : (
                      availableClinics.map((clinic) => (
                        <MenuItem key={clinic.id} value={clinic.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Building2 size={20} style={{ color: '#2563eb' }} />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {getClinicDisplayName(clinic.id)}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                ID: {clinic.id}
                                {clinic.notFound && ' (Not Found)'}
                                {clinic.error && ' (Error Loading)'}
                              </Typography>
                            </Box>
                            {clinic.notFound && (
                              <Chip size="small" label="Not Found" color="warning" />
                            )}
                            {clinic.error && (
                              <Chip size="small" label="Error" color="error" />
                            )}
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                
                {!selectedClinic && availableClinics.length > 0 && (
                  <Typography variant="caption" sx={{ color: 'warning.main', mt: 1, display: 'block' }}>
                    Please select a clinic to proceed with scheduling
                  </Typography>
                )}
                
                {selectedClinicData && (
                  <Box sx={{ 
                    mt: 2, 
                    p: 2, 
                    backgroundColor: 'rgba(37, 99, 235, 0.05)', 
                    borderRadius: 2,
                    border: '1px solid rgba(37, 99, 235, 0.1)'
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2563eb', mb: 1 }}>
                      Selected Clinic Details:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Name:</strong> {getClinicDisplayName(selectedClinicData.id)}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>ID:</strong> {selectedClinicData.id}
                    </Typography>
                    {selectedClinicData.address && (
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Address:</strong> {selectedClinicData.address}
                      </Typography>
                    )}
                    {selectedClinicData.phone && (
                      <Typography variant="body2">
                        <strong>Phone:</strong> {selectedClinicData.phone}
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Show alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!selectedClinic && availableClinics.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please select a clinic to manage your availability schedule.
        </Alert>
      )}

      {availableClinics.length === 0 && loggedInDoctor && !loadingClinics && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No clinics are assigned to your profile. Please contact the administrator to assign clinics to your account.
        </Alert>
      )}

      {loadingClinics && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={20} />
            Loading clinic information...
          </Box>
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Typography variant="body2" color="text.secondary">Weekly Hours</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {loading ? <Skeleton width={40} /> : `${weeklyHours}h`}
                  </Typography>
                </div>
                <Clock size={32} style={{ color: '#2563eb' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Typography variant="body2" color="text.secondary">Active Days</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {loading ? <Skeleton width={20} /> : activeDays}
                  </Typography>
                </div>
                <Calendar size={32} style={{ color: '#22c55e' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Typography variant="body2" color="text.secondary">Avg. Daily Hours</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {loading ? <Skeleton width={30} /> : `${avgDailyHours}h`}
                  </Typography>
                </div>
                <Box sx={{ width: 32, height: 32, bgcolor: '#a21caf', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: 18 }}>⏰</span>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Typography variant="body2" color="text.secondary">Next Available</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {loading ? <Skeleton width={50} /> : nextAvailable}
                  </Typography>
                </div>
                <Box sx={{ width: 32, height: 32, bgcolor: '#ea580c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: 18 }}>📅</span>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Only show scheduling interface if clinic is selected */}
      {selectedClinic && (
        <>
          {/* Week Display */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            backgroundColor: 'rgba(37, 99, 235, 0.03)',
            p: 2,
            borderRadius: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calendar size={20} style={{ color: '#2563eb' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {getWeekRangeText()}
              </Typography>
              <Chip 
                label={getClinicDisplayName(selectedClinic)}
                size="small"
                sx={{ ml: 2, backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}
              />
            </Box>
            
            {isTodayInWeek && (
              <Chip 
                icon={<CheckCircle size={16} />}
                label={`Available for ${availableToday} hours today!`}
                sx={{ 
                  backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                  color: '#22c55e',
                  fontWeight: 500
                }}
              />
            )}
          </Box>
          
          <Grid container spacing={3}>
            {/* Calendar View */}
            <Grid item xs={12} md={5}>
              <Card elevation={0} sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  backgroundColor: '#2563eb', 
                  p: 2,
                  color: 'white'
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Select a date
                  </Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateCalendar 
                    value={selectedDate} 
                    onChange={handleDateChange}
                    sx={{
                      width: '100%',
                      '& .MuiPickersDay-root': {
                        borderRadius: '50%',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(37, 99, 235, 0.1)'
                        }
                      },
                      '& .Mui-selected': {
                        backgroundColor: '#2563eb !important',
                        color: '#fff !important',
                        fontWeight: 600
                      },
                      '& .MuiPickersCalendarHeader-root': {
                        mt: 1
                      }
                    }}
                  />
                </LocalizationProvider>
              </Card>
              
              {/* Selected Day Summary */}
              <Card elevation={0} sx={{ 
                mt: 3, 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  backgroundColor: 'rgba(37, 99, 235, 0.05)', 
                  p: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {format(selectedDate, 'EEEE, MMMM d')}
                    {documentMap[selectedDayKey] && (
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                        Document ID: {documentMap[selectedDayKey]}
                      </Typography>
                    )}
                  </Typography>
                </Box>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Clock size={20} style={{ color: '#2563eb' }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedDayData.isOffDay ? 'Day Off' : `${activeSlotCount} slots available`}
                      </Typography>
                    </Box>
                    
                    <Switch 
                      checked={!selectedDayData.isOffDay}
                      onChange={() => handleOffDayToggle(selectedDayKey)}
                      color="primary"
                      inputProps={{ 'aria-label': 'Toggle availability' }}
                    />
                  </Box>
                  
                  {!selectedDayData.isOffDay && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                        Toggle time slots:
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5
                      }}>
                        {timeSlots.map((slot) => {
                          const isActive = selectedDaySlots[slot];
                          return (
                            <Chip
                              key={slot}
                              label={slot}
                              onClick={() => handleSlotToggle(selectedDayKey, slot)}
                              variant={isActive ? "filled" : "outlined"}
                              sx={{
                                borderRadius: 2,
                                px: 1.5,
                                fontWeight: 500,
                                backgroundColor: isActive 
                                  ? 'rgba(34, 197, 94, 0.15)' 
                                  : 'transparent',
                                color: isActive 
                                  ? '#22c55e' 
                                  : 'text.secondary',
                                border: '1px solid',
                                borderColor: isActive 
                                  ? 'rgba(34, 197, 94, 0.3)' 
                                  : 'rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                  backgroundColor: isActive 
                                    ? 'rgba(34, 197, 94, 0.2)' 
                                    : 'rgba(0, 0, 0, 0.03)'
                                }
                              }}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Weekly Slots View */}
            <Grid item xs={12} md={7}>
              <Card elevation={0} sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  backgroundColor: 'rgba(37, 99, 235, 0.05)', 
                  p: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Weekly Availability (Click to toggle slots)
                  </Typography>
                </Box>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    overflowX: 'auto',
                    pb: 2,
                    maxHeight: '100%',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': {
                      height: 6,
                      width: 6,
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(0,0,0,0.02)',
                      borderRadius: 2,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(0,0,0,0.1)',
                      borderRadius: 2,
                    }
                  }}>
                    {weekDays.map((day) => {
                      const dayKey = format(day, 'yyyy-MM-dd');
                      const dayData = availabilityData[dayKey] || {};
                      const activeSlots = getActiveSlotCount(dayKey);
                      const isSelected = isSameDay(day, selectedDate);
                      const isDayToday = isToday(day);
                      
                      return (
                        <Card 
                          key={dayKey}
                          onClick={() => setSelectedDate(day)}
                          elevation={0}
                          sx={{
                            minWidth: 160,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: isSelected ? '#2563eb' : 'rgba(0, 0, 0, 0.08)',
                            backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.05)' : 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                            flexShrink: 0,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                            }
                          }}
                        >
                          <CardContent>
                            {/* Day Header */}
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 2
                            }}>
                              <Box>
                                <Typography variant="body2" sx={{
                                  fontWeight: 600,
                                  color: isDayToday ? '#2563eb' : 'text.primary',
                                }}>
                                  {format(day, 'EEE')}
                                </Typography>
                                <Typography variant="h6" sx={{
                                  fontWeight: 700,
                                  color: isDayToday ? '#2563eb' : 'text.primary',
                                }}>
                                  {format(day, 'd')}
                                </Typography>
                              </Box>
                              
                              {/* Status Indicator */}
                              <Box sx={{ 
                                width: 10, 
                                height: 10, 
                                borderRadius: '50%',
                                backgroundColor: dayData.isOffDay 
                                  ? '#ef4444' 
                                  : activeSlots > 0 ? '#22c55e' : '#f59e0b',
                                mt: 0.5
                              }} />
                            </Box>
                            
                            {/* Off Day Toggle */}
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              mb: 2
                            }}>
                              <Typography variant="caption" sx={{ 
                                fontWeight: 500,
                                color: dayData.isOffDay ? '#ef4444' : 'text.secondary'
                              }}>
                                {dayData.isOffDay ? 'Day Off' : 'Available'}
                              </Typography>
                              <Switch 
                                size="small"
                                checked={!dayData.isOffDay}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleOffDayToggle(dayKey);
                                }}
                                color="primary"
                              />
                            </Box>
                            
                            {/* Slot Grid */}
                            {!dayData.isOffDay && (
                              <>
                                <Box sx={{ 
                                  display: 'grid', 
                                  gridTemplateColumns: 'repeat(4, 1fr)',
                                  gap: 0.5,
                                  mb: 1.5
                                }}>
                                  {timeSlots.map((slot, index) => (
                                    <Box
                                      key={slot}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSlotToggle(dayKey, slot);
                                      }}
                                      sx={{
                                        height: 12,
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        backgroundColor: dayData.slots?.[slot] 
                                          ? 'rgba(34, 197, 94, 0.3)' 
                                          : 'rgba(0, 0, 0, 0.05)',
                                        border: '1px solid',
                                        borderColor: dayData.slots?.[slot] 
                                          ? 'rgba(34, 197, 94, 0.4)' 
                                          : 'rgba(0, 0, 0, 0.08)',
                                        '&:hover': {
                                          transform: 'scale(1.1)',
                                          borderColor: dayData.slots?.[slot] 
                                            ? '#22c55e' 
                                            : 'rgba(0, 0, 0, 0.15)'
                                        }
                                      }}
                                    />
                                  ))}
                                </Box>
                                
                                {/* Slot Count */}
                                <Typography variant="caption" sx={{
                                  display: 'block',
                                  textAlign: 'center',
                                  fontWeight: 500,
                                  color: activeSlots > 8 ? '#22c55e' : 
                                         activeSlots > 0 ? '#f59e0b' : '#ef4444'
                                }}>
                                  {activeSlots}/16 slots active
                                </Typography>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>
                  
                  {/* Legend */}
                  <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    backgroundColor: 'rgba(0, 0, 0, 0.02)', 
                    borderRadius: 3,
                    border: '1px solid rgba(0, 0, 0, 0.03)'
                  }}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                      Availability Legend
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 16, 
                            height: 16, 
                            borderRadius: '4px',
                            backgroundColor: 'rgba(34, 197, 94, 0.3)',
                            border: '1px solid rgba(34, 197, 94, 0.4)'
                          }} />
                          <Typography variant="caption">Available slot</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 16, 
                            height: 16, 
                            borderRadius: '4px',
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            border: '1px solid rgba(0, 0, 0, 0.08)'
                          }} />
                          <Typography variant="caption">Unavailable slot</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 16, 
                            height: 16, 
                            borderRadius: '4px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                          }} />
                          <Typography variant="caption">Day off</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 16, 
                            height: 16, 
                            borderRadius: '4px',
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            border: '1px solid rgba(37, 99, 235, 0.2)'
                          }} />
                          <Typography variant="caption">Today</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default AvailabilityContent;
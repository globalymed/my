import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, Card, CardContent, Rating, Chip, Button } from '@mui/material';
import useStore from '../store';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Constants
const DELHI_LOCATION = { lat: 28.6139, lng: 77.2090 };
const MAX_DISTANCE_KM = 10;
const MIN_RATING = 4.0;
const RESULTS_LIMIT = 3;

// Fallback clinics when Firebase fails
const FALLBACK_CLINICS = {
  hair: [
    { 
      id: 'hair1', 
      name: 'Advanced Hair Clinic', 
      rating: 4.8, 
      services: ['Hair Transplant', 'PRP Therapy', 'Hair Loss Treatment'],
      location: { lat: 28.6329, lng: 77.2195 }
    },
    { 
      id: 'hair2', 
      name: 'Hair Restoration Center', 
      rating: 4.7, 
      services: ['Hair Transplant', 'Scalp Treatment', 'Hair Growth Therapy'],
      location: { lat: 28.5921, lng: 77.2290 }
    },
    { 
      id: 'hair3', 
      name: 'Modern Hair Solutions', 
      rating: 4.6, 
      services: ['Hair Transplant', 'Hair Restoration', 'Scalp Massage'],
      location: { lat: 28.6100, lng: 77.2100 }
    }
  ],
  dental: [
    { 
      id: 'dental1', 
      name: 'Smile Dental Care', 
      rating: 4.9, 
      services: ['General Dentistry', 'Cosmetic Dentistry', 'Orthodontics'],
      location: { lat: 28.6429, lng: 77.2095 }
    },
    { 
      id: 'dental2', 
      name: 'Bright Dental Clinic', 
      rating: 4.7, 
      services: ['Root Canal Treatment', 'Dental Implants', 'Teeth Whitening'],
      location: { lat: 28.6350, lng: 77.2150 }
    },
    { 
      id: 'dental3', 
      name: 'Perfect Smile Dentistry', 
      rating: 4.6, 
      services: ['Pediatric Dentistry', 'Dental Crowns', 'Emergency Dental Care'],
      location: { lat: 28.6200, lng: 77.2300 }
    }
  ],
  cosmetic: [
    { 
      id: 'cosmetic1', 
      name: 'Aesthetic Beauty Center', 
      rating: 4.8, 
      services: ['Botox', 'Fillers', 'Skin Rejuvenation'],
      location: { lat: 28.6239, lng: 77.2190 }
    },
    { 
      id: 'cosmetic2', 
      name: 'Beauty & Beyond Clinic', 
      rating: 4.7, 
      services: ['Chemical Peels', 'Microdermabrasion', 'Laser Hair Removal'],
      location: { lat: 28.6300, lng: 77.2250 }
    },
    { 
      id: 'cosmetic3', 
      name: 'Glow Cosmetic Surgery', 
      rating: 4.5, 
      services: ['Facelift', 'Rhinoplasty', 'Body Contouring'],
      location: { lat: 28.6150, lng: 77.2280 }
    }
  ],
  ivf: [
    { 
      id: 'ivf1', 
      name: 'Fertility Solutions', 
      rating: 4.9, 
      services: ['IVF', 'ICSI', 'Fertility Counseling'],
      location: { lat: 28.6339, lng: 77.2290 }
    },
    { 
      id: 'ivf2', 
      name: 'New Life Fertility Center', 
      rating: 4.8, 
      services: ['IVF', 'Egg Freezing', 'Embryo Transfer'],
      location: { lat: 28.6400, lng: 77.2200 }
    },
    { 
      id: 'ivf3', 
      name: 'Family Beginnings IVF', 
      rating: 4.7, 
      services: ['IVF', 'Surrogacy', 'Genetic Testing'],
      location: { lat: 28.6250, lng: 77.2280 }
    }
  ],
  general: [
    { 
      id: 'general1', 
      name: 'City General Hospital', 
      rating: 4.5, 
      services: ['General Medicine', 'Diagnostics', 'Preventive Care'],
      location: { lat: 28.6139, lng: 77.2190 }
    },
    { 
      id: 'general2', 
      name: 'Wellness Medical Center', 
      rating: 4.4, 
      services: ['Family Medicine', 'Cardiology', 'Orthopedics'],
      location: { lat: 28.6250, lng: 77.2200 }
    },
    { 
      id: 'general3', 
      name: 'Lifeline Healthcare', 
      rating: 4.3, 
      services: ['Pediatrics', 'Gynecology', 'Internal Medicine'],
      location: { lat: 28.6180, lng: 77.2240 }
    }
  ]
};

const ClinicRecommender = ({ treatmentType, onClinicSelect }) => {
  const [filteredClinics, setFilteredClinics] = useState([]);
  const { isLoading, setLoading } = useStore(state => ({
    isLoading: state.ui.isLoading,
    setLoading: state.setLoading
  }));
  const navigate = useNavigate();
  
  // If no treatment type is provided, use the one from the store
  const storedTreatmentType = useStore(state => state.clinic.selectedTreatment?.treatmentType);
  const effectiveTreatmentType = treatmentType || storedTreatmentType || 'general';

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate clinic score
  const calculateScore = (clinic) => {
    const distance = calculateDistance(
      DELHI_LOCATION.lat,
      DELHI_LOCATION.lng,
      clinic.location.lat,
      clinic.location.lng
    );
    const distanceScore = Math.max(0, 10 - distance); // 0-10 points based on distance
    const servicesMatchScore = clinic.services.includes(effectiveTreatmentType) ? 5 : 0;
    return (clinic.rating * 2) + servicesMatchScore + distanceScore;
  };

  // Check clinic availability
  const checkAvailability = async (clinicId) => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const slots = await getDocs(
        query(
          collection(db, 'availability'),
          where('clinicId', '==', clinicId),
          where('date', '==', tomorrow.toISOString().split('T')[0]),
          where('available', '==', true)
        )
      );
      return slots.size >= 3;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchClinics = async () => {
      if (!effectiveTreatmentType) {
        console.log("No treatment type specified, using general");
        console.log("Fallback general clinics count:", FALLBACK_CLINICS.general.length);
        // Get at most 3 general clinics
        setFilteredClinics(FALLBACK_CLINICS.general.slice(0, RESULTS_LIMIT));
        return;
      }
      
      setLoading('clinics', true);
      try {
        console.log("Fetching clinics for treatment type:", effectiveTreatmentType);
        
        // First try to fetch clinics with exact service match
        const clinicsRef = collection(db, 'clinics');
        let q = query(
          clinicsRef,
          where('services', 'array-contains', effectiveTreatmentType.toLowerCase()),
          where('rating', '>=', MIN_RATING),
          orderBy('rating', 'desc'),
          limit(RESULTS_LIMIT)
        );

        let snapshot = await getDocs(q);
        let clinics = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        console.log("Exact match clinics found:", clinics.length);
        
        // If no clinics found, try without the array-contains filter
        if (clinics.length === 0) {
          console.log("No exact matches found, fetching all clinics");
          q = query(
            clinicsRef,
            where('rating', '>=', MIN_RATING),
            orderBy('rating', 'desc'),
            limit(RESULTS_LIMIT)
          );
          
          snapshot = await getDocs(q);
          clinics = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Fallback query clinics found:", clinics.length);
        }
        
        console.log("Fetched clinics:", clinics);
        
        // If still no clinics found, use fallback data
        if (clinics.length === 0) {
          console.log("No clinics found in database, using fallback data");
          const type = effectiveTreatmentType.toLowerCase();
          // Ensure we return at most 3 clinics from the fallback data
          const fallbackClinics = FALLBACK_CLINICS[type] || FALLBACK_CLINICS.general;
          console.log("Fallback clinics available:", fallbackClinics.length);
          clinics = fallbackClinics.slice(0, RESULTS_LIMIT);
        }
        
        // Ensure we only return up to 3 clinics
        console.log("Final clinics count before setting state:", clinics.length);
        setFilteredClinics(clinics.slice(0, RESULTS_LIMIT));
      } catch (error) {
        console.error('Error fetching clinics:', error);
        // Use fallback data on error
        console.log("Using fallback clinics due to error");
        const type = effectiveTreatmentType.toLowerCase();
        const fallbackClinics = FALLBACK_CLINICS[type] || FALLBACK_CLINICS.general;
        console.log("Error fallback clinics count:", fallbackClinics.length);
        setFilteredClinics(fallbackClinics.slice(0, RESULTS_LIMIT));
      } finally {
        setLoading('clinics', false);
      }
    };

    fetchClinics();
  }, [effectiveTreatmentType, setLoading]);

  // Log state value when it changes
  useEffect(() => {
    console.log("filteredClinics state updated:", filteredClinics.length, "clinics");
    console.log("Clinic details:", filteredClinics);
  }, [filteredClinics]);

  const handleBookNow = (clinic) => {
    if (onClinicSelect) {
      onClinicSelect(clinic);
    } else {
      // If used as standalone component, navigate to booking
      useStore.getState().setSelectedClinic(clinic);
      navigate('/book');
    }
  };

  if (isLoading?.clinics) {
    return <Skeleton variant="rectangular" height={200} />;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Recommended Clinics for {effectiveTreatmentType} 
        (Found: {filteredClinics.length})
      </Typography>
      {filteredClinics.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          {filteredClinics.map(clinic => (
            <Card key={clinic.id} sx={{ mb: { xs: 2, md: 0 }, flex: 1, minWidth: { md: '30%' } }}>
              <CardContent>
                <Typography variant="h6">{clinic.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={clinic.rating} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({clinic.rating})
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  {clinic.services && clinic.services.map ? 
                    clinic.services.map((service, index) => (
                      <Chip 
                        key={index} 
                        label={service} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }}
                        color={service.toLowerCase() === effectiveTreatmentType.toLowerCase() ? "primary" : "default"}
                      />
                    )) : 
                    <Chip label="General" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  }
                </Box>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => handleBookNow(clinic)}
                  fullWidth
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography>
          No suitable clinics were found for {effectiveTreatmentType}. Please try different parameters.
        </Typography>
      )}
    </Box>
  );
};

export default ClinicRecommender; 
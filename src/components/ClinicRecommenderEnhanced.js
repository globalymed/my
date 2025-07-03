import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Skeleton, 
  Card, 
  CardContent, 
  Rating, 
  Chip, 
  Button, 
  Container, 
  Paper, 
  TextField, 
  InputAdornment,
  Grid,
  Divider,
  Alert,
  useTheme
} from '@mui/material';
import useStore from '../store';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ClinicCard from './ClinicCard';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

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

const ClinicRecommenderEnhanced = ({ treatmentType, onClinicSelect }) => {
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { isLoading, setLoading } = useStore(state => ({
    isLoading: state.ui.isLoading,
    setLoading: state.setLoading
  }));
  const navigate = useNavigate();
  const theme = useTheme();
  
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
          console.log("Fallback clinics available for", type, ":", fallbackClinics.length);
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
    console.log("Enhanced component - filteredClinics state updated:", filteredClinics.length, "clinics");
    console.log("Enhanced clinic details:", filteredClinics);
  }, [filteredClinics]);

  // Log filtered results after search
  useEffect(() => {
    console.log("Search term applied:", searchTerm);
    console.log("Clinics after search filter:", filteredAndSearchedClinics.length);
  }, [searchTerm, filteredAndSearchedClinics]);

  const handleBookNow = (clinic) => {
    if (onClinicSelect) {
      onClinicSelect(clinic);
    } else {
      // If used as standalone component, navigate to booking
      navigate('/book', { state: { selectedClinic: clinic } });
    }
  };

  // Filter clinics based on search term
  const filteredAndSearchedClinics = searchTerm
    ? filteredClinics.filter(clinic => 
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (clinic.services && clinic.services.some(service => 
          service.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    : filteredClinics;

  const getTreatmentTypeTitle = () => {
    const typeMap = {
      'hair': 'Hair Treatment',
      'dental': 'Dental Care',
      'cosmetic': 'Cosmetic Procedures',
      'ivf': 'Fertility & IVF',
      'general': 'General Healthcare'
    };
    
    return typeMap[effectiveTreatmentType.toLowerCase()] || 'Medical Care';
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.main}10)`,
          border: '1px solid',
          borderColor: `${theme.palette.primary.light}30`,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, md: 0 } }}>
              <LocalHospitalIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
              <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  {getTreatmentTypeTitle()} Clinics (Found: {filteredAndSearchedClinics.length})
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Showing top-rated clinics near Delhi for {effectiveTreatmentType.toLowerCase()} treatments
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search clinics or services..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        startIcon={<FilterListIcon />} 
                        size="small" 
                        sx={{ 
                          minWidth: 'auto', 
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: theme.shadows[1]
                        }}
                      >
                        Filter
                      </Button>
                      <Button 
                        startIcon={<SortIcon />} 
                        size="small" 
                        sx={{ 
                          minWidth: 'auto', 
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: theme.shadows[1]
                        }}
                      >
                        Sort
                      </Button>
                    </Box>
                  </InputAdornment>
                ),
                sx: { 
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.1)'
                  }
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {isLoading?.clinics ? (
        <Box sx={{ mt: 3 }}>
          {[1, 2, 3].map((item) => (
            <Card key={item} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
              <CardContent sx={{ p: 0 }}>
                <Grid container>
                  <Grid item xs={12} md={3} sx={{ 
                    position: 'relative', 
                    minHeight: 180,
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }}>
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Box sx={{ p: 3 }}>
                      <Skeleton variant="text" width="60%" height={40} />
                      <Skeleton variant="text" width="40%" height={30} />
                      <Skeleton variant="text" width="30%" height={30} />
                      <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 2 }}>
                        <Skeleton variant="rounded" width={80} height={30} />
                        <Skeleton variant="rounded" width={100} height={30} />
                        <Skeleton variant="rounded" width={90} height={30} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Skeleton variant="text" width="30%" height={30} />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Skeleton variant="rounded" width={80} height={40} />
                          <Skeleton variant="rounded" width={100} height={40} />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : filteredAndSearchedClinics.length > 0 ? (
        <Box>
          {filteredAndSearchedClinics.map((clinic) => (
            <ClinicCard 
              key={clinic.id} 
              clinic={clinic} 
              onBookNow={handleBookNow} 
            />
          ))}
        </Box>
      ) : (
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 3, 
            boxShadow: theme.shadows[2],
            backgroundColor: `${theme.palette.info.light}20`,
            border: '1px solid',
            borderColor: `${theme.palette.info.light}50`,
          }}
        >
          <Typography variant="body1">
            No suitable clinics were found for "{searchTerm}". Please try different parameters or browse all available clinics.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default ClinicRecommenderEnhanced;

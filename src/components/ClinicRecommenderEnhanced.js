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
const RESULTS_LIMIT = 5;

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
    }
  ],
  dental: [
    { 
      id: 'dental1', 
      name: 'Smile Dental Care', 
      rating: 4.9, 
      services: ['General Dentistry', 'Cosmetic Dentistry', 'Orthodontics'],
      location: { lat: 28.6429, lng: 77.2095 }
    }
  ],
  cosmetic: [
    { 
      id: 'cosmetic1', 
      name: 'Aesthetic Beauty Center', 
      rating: 4.8, 
      services: ['Botox', 'Fillers', 'Skin Rejuvenation'],
      location: { lat: 28.6239, lng: 77.2190 }
    }
  ],
  ivf: [
    { 
      id: 'ivf1', 
      name: 'Fertility Solutions', 
      rating: 4.9, 
      services: ['IVF', 'ICSI', 'Fertility Counseling'],
      location: { lat: 28.6339, lng: 77.2290 }
    }
  ],
  general: [
    { 
      id: 'general1', 
      name: 'City General Hospital', 
      rating: 4.5, 
      services: ['General Medicine', 'Diagnostics', 'Preventive Care'],
      location: { lat: 28.6139, lng: 77.2190 }
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
        setFilteredClinics(FALLBACK_CLINICS.general);
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
        }
        
        console.log("Fetched clinics:", clinics);
        
        // If still no clinics found, use fallback data
        if (clinics.length === 0) {
          console.log("No clinics found in database, using fallback data");
          const type = effectiveTreatmentType.toLowerCase();
          clinics = FALLBACK_CLINICS[type] || FALLBACK_CLINICS.general;
        }
        
        setFilteredClinics(clinics);
      } catch (error) {
        console.error('Error fetching clinics:', error);
        // Use fallback data on error
        console.log("Using fallback clinics due to error");
        const type = effectiveTreatmentType.toLowerCase();
        setFilteredClinics(FALLBACK_CLINICS[type] || FALLBACK_CLINICS.general);
      } finally {
        setLoading('clinics', false);
      }
    };

    fetchClinics();
  }, [effectiveTreatmentType, setLoading]);

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
                  {getTreatmentTypeTitle()} Clinics
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
            No clinics found for "{searchTerm}". Please try a different search term or browse all available clinics.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default ClinicRecommenderEnhanced;

import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, Card, CardContent, Rating, Chip } from '@mui/material';
import useStore from '../store';
import { db } from '../store/firebase';

// Constants
const DELHI_LOCATION = { lat: 28.6139, lng: 77.2090 };
const MAX_DISTANCE_KM = 10;
const MIN_RATING = 4.0;
const RESULTS_LIMIT = 5;

const ClinicRecommender = () => {
  const currentState = useStore.getState();

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
    const servicesMatchScore = clinic.services.includes(treatmentType) ? 5 : 0;
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
      setLoading('clinics', true);
      try {
        // Your clinic fetching logic here
        const clinics = []; // Replace with actual data fetching
        setFilteredClinics(clinics);
      } catch (error) {
        console.error('Error fetching clinics:', error);
      } finally {
        setLoading('clinics', false);
      }
    };

    fetchClinics();
  }, []);

  if (isLoading?.clinics) {
    return <Skeleton variant="rectangular" height={200} />;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Recommended Clinics
      </Typography>
      {filteredClinics.map(clinic => (
        <Card key={clinic.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{clinic.name}</Typography>
            <Rating value={clinic.rating} readOnly />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ClinicRecommender; 
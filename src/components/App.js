import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getFirestore } from 'firebase/firestore';
import { getPerformance } from 'firebase/performance';
import { isPlatform } from '@ionic/react';
import { db } from '../firebase';
import { CircularProgress, Box } from '@mui/material';

const ClinicRecommender = React.lazy(() => import('./ClinicRecommender'));
const CalendarComponent = React.lazy(() => import('./CalendarComponent'));
const TimeSlotGrid = React.lazy(() => import('./TimeSlotGrid'));
const BookingConfirmationForm = React.lazy(() => import('./BookingConfirmationForm'));

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <CircularProgress />
  </Box>
);

const App = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/recommend" replace />} />
        <Route path="/recommend" element={<ClinicRecommender />} />
        <Route path="/book" element={
          <>
            <CalendarComponent />
            <TimeSlotGrid />
            <BookingConfirmationForm />
          </>
        } />
      </Routes>
    </Suspense>
  );
};

export default App; 
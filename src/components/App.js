import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { db } from '../firebase';

const AIChat = React.lazy(() => import('./AIChat'));
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
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<AIChat />} />
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
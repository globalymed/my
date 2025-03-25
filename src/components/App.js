import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { db } from '../firebase';
import Layout from './Layout';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

const AIChat = React.lazy(() => import('./AIChatFinal'));
const ClinicRecommender = React.lazy(() => import('./ClinicRecommenderEnhanced'));
const CalendarComponent = React.lazy(() => import('./CalendarComponent'));
const TimeSlotGrid = React.lazy(() => import('./TimeSlotGrid'));
const BookingConfirmationForm = React.lazy(() => import('./BookingConfirmationForm'));
const AppointmentBookingPage = React.lazy(() => import('./AppointmentBookingPage'));
const LoginPage = React.lazy(() => import('./LoginPage'));
const HomePage = React.lazy(() => import('./HomePage'));

// Create a component to render the doctor dashboard in an iframe
const DoctorDashboard = () => {
  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 150px)' }}>
      <iframe 
        src="/patient-dashboard-ai/index.html" 
        title="Doctor Dashboard"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      />
    </Box>
  );
};

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <CircularProgress />
  </Box>
);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<LoadingFallback />}>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/recommend" element={<ClinicRecommender />} />
            <Route path="/book" element={
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <CalendarComponent />
                <TimeSlotGrid />
                <BookingConfirmationForm />
              </Box>
            } />
            <Route path="/appointment-booking" element={<AppointmentBookingPage />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Layout>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
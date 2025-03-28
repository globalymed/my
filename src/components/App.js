import React, { Suspense, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
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
const DashboardPage = React.lazy(() => import('./DashboardPage'));

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

// Protected route component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('userData') !== null;
  
  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  return isAuthenticated ? children : <LoadingFallback />;
};

// Auth route component - redirects to dashboard if already logged in
const AuthRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('userData') !== null;
  
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return !isAuthenticated ? children : <LoadingFallback />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<LoadingFallback />}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/recommend" element={<ClinicRecommender />} />
            <Route path="/book" element={
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <CalendarComponent />
                <TimeSlotGrid />
                <BookingConfirmationForm />
              </Box>
            } />
            <Route path="/appointment-booking" element={
              <ProtectedRoute>
                <AppointmentBookingPage />
              </ProtectedRoute>
            } />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/login" element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
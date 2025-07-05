import React, { Suspense, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Button, Typography, useTheme, Paper } from '@mui/material';
import { db } from '../firebase';
import Layout from './Layout';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import LogoutIcon from '@mui/icons-material/Logout';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DashboardIcon from '@mui/icons-material/Dashboard';

const AIChat = React.lazy(() => import('./AIChatFinal'));
const ClinicRecommender = React.lazy(() => import('./ClinicRecommenderEnhanced'));
const CalendarComponent = React.lazy(() => import('./CalendarComponent'));
const TimeSlotGrid = React.lazy(() => import('./TimeSlotGrid'));
const BookingConfirmationForm = React.lazy(() => import('./BookingConfirmationForm'));
const AppointmentBookingPage = React.lazy(() => import('./AppointmentBookingPage'));
const LoginPage = React.lazy(() => import('./LoginPage'));
const DoctorLoginPage = React.lazy(() => import('./DoctorLoginPage'));
const HomePage = React.lazy(() => import('./HomePage'));
const DashboardPage = React.lazy(() => import('./DashboardPage'));

// Doctor Dashboard Landing Page Component
const DoctorDashboardLanding = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Function to handle doctor logout
  const handleLogout = () => {
    // Remove doctor data from localStorage
    localStorage.removeItem('doctorData');
    localStorage.removeItem('rememberedDoctorEmail');
    localStorage.removeItem('dashboardOpened'); // Clear the flag on logout
    
    // Redirect to doctor login page
    navigate('/doctor-login');
  };
  
  // Function to open doctor dashboard in new tab
  const openDoctorDashboard = () => {
    window.open('https://dd-green-kappa.vercel.app/', '_blank', 'noopener,noreferrer');
  };
  
  // Auto-open dashboard on component mount (only once per session)
  useEffect(() => {
    // Check if dashboard has already been opened in this session
    const hasOpened = localStorage.getItem('dashboardOpened');
    
    if (!hasOpened) {
      // Mark as opened and open the dashboard
      localStorage.setItem('dashboardOpened', 'true');
      openDoctorDashboard();
    }
  }, []);
  
  return (
    <Box sx={{ 
      width: '100%', 
      height: 'calc(100vh - 150px)', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      alignItems: 'center',
      p: 3
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 600, 
          width: '100%',
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            pb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Doctor Portal
          </Typography>
          <Button 
            variant="outlined" 
            color="error"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ 
              textTransform: 'none'
            }}
          >
            Logout
          </Button>
        </Box>
        
        {/* Welcome Message */}
        <Box sx={{ mb: 4 }}>
          <DashboardIcon sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Welcome to Your Doctor Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Access your complete dashboard with patient management, appointments, and medical records.
          </Typography>
        </Box>
        
        {/* Dashboard Access Button */}
        <Button 
          variant="contained" 
          size="large"
          onClick={openDoctorDashboard}
          startIcon={<OpenInNewIcon />}
          sx={{ 
            textTransform: 'none',
            py: 1.5,
            px: 4,
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          Open Doctor Dashboard
        </Button>
        
        {/* Additional Info */}
        <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.grey[50], borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            The dashboard will open in a new tab for the best experience. 
            Keep this tab open to maintain your session.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <CircularProgress />
  </Box>
);

// Protected route component for patients
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

// Protected route component for doctors
const DoctorProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isDoctorAuthenticated = localStorage.getItem('doctorData') !== null;
  
  useEffect(() => {
    // If doctor is not authenticated, redirect to doctor login
    if (!isDoctorAuthenticated) {
      navigate('/doctor-login');
    }
  }, [isDoctorAuthenticated, navigate]);
  
  return isDoctorAuthenticated ? children : <LoadingFallback />;
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

// Doctor Auth route component - redirects to doctor dashboard if already logged in
const DoctorAuthRoute = ({ children }) => {
  const navigate = useNavigate();
  const isDoctorAuthenticated = localStorage.getItem('doctorData') !== null;
  
  useEffect(() => {
    // If doctor is already authenticated, redirect to doctor dashboard
    if (isDoctorAuthenticated) {
      navigate('/doctor-dashboard');
    }
  }, [isDoctorAuthenticated, navigate]);
  
  return !isDoctorAuthenticated ? children : <LoadingFallback />;
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
            <Route path="/book-now" element={<AppointmentBookingPage />} />
            <Route path="/doctor-dashboard" element={
              <DoctorProtectedRoute>
                <DoctorDashboardLanding />
              </DoctorProtectedRoute>
            } />
            <Route path="/login" element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            } />
            <Route path="/doctor-login" element={
              <DoctorAuthRoute>
                <DoctorLoginPage />
              </DoctorAuthRoute>
            } />
            <Route path="/patient-dashboard-ai" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
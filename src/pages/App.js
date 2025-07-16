import React, { Suspense, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Button, Typography, useTheme } from '@mui/material';
import { db } from '../firebase';
import Layout from './Layout';
import { PostHogProvider } from 'posthog-js/react';
import posthog from '../utils/posthog';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatLayout from '../components/ChatLayout';
import NewLoginPage from './NewLoginPage.jsx';
import NewSignupPage from './NewSignupPage.jsx';
import DoctorLoginPage from '../components/DoctorLoginPage';

const AIChat = React.lazy(() => import('../components/AIChatFinal'));
const ClinicRecommender = React.lazy(() => import('../components/ClinicRecommenderEnhanced'));
const CalendarComponent = React.lazy(() => import('../components/CalendarComponent'));
const TimeSlotGrid = React.lazy(() => import('../components/TimeSlotGrid'));
const BookingConfirmationForm = React.lazy(() => import('../components/BookingConfirmationForm'));
const AppointmentBookingPage = React.lazy(() => import('../components/AppointmentBookingPage'));
const LoginPage = React.lazy(() => import('../components/LoginPage'));
const HomePage = React.lazy(() => import('../components/HomePage.jsx'));
const DashboardPage = React.lazy(() => import('../components/DashboardPage'));
import FreeConsultation from './FreeConsultation.jsx';
import ContactUs from './ContactUs.jsx';
import Blog from './Blog.jsx';
import BlogPostPage from './BlogPostPage.jsx';
import TermsOfService from './TermsOfService.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import CompareCost from './compareCost.jsx';

// Create a component to render the doctor dashboard in an iframe
const DoctorDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Function to handle doctor logout
  const handleLogout = () => {
    // Remove doctor data from localStorage
    localStorage.removeItem('doctorData');
    localStorage.removeItem('rememberedDoctorEmail');

    // Redirect to doctor login page
    navigate('/doctor-login');
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Dashboard iframe - now takes full height */}
      <iframe
        src="https://dd-green-kappa.vercel.app/"
        title="Doctor Dashboard"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      />
      
      {/* Logout button positioned absolutely in bottom left */}
      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
        sx={{
          position: 'absolute',
          bottom: '40px',
          left: '70px',
          textTransform: 'none',
          bgcolor: 'error.main',
          zIndex: 1000,
          '&:hover': {
            bgcolor: 'error.dark',
          }
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

// plan journey app in an iframe
const PlanJourney = () => {
  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Plan Journey iframe - takes full height */}
      <iframe
        src="https://travel-9hf1.vercel.app/"
        title="Plan Journey"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      />
    </Box>
  );
};

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#fff">
    <img src="/logoWhite.png" alt="MedYatra Logo" style={{ width: 120, height: 120, objectFit: 'contain' }} />
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

  // Directly render children (doctor dashboard) if authenticated without any intermediary redirect
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
    <PostHogProvider client={posthog}>
      <ThemeProvider theme={theme}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Chat route with ChatLayout */}
          <Route path="/chat" element={
            <ChatLayout>
              <AIChat />
            </ChatLayout>
          } />

          {/* All other routes with default Layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/free-consultation" element={<FreeConsultation />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/compare-cost" element={<CompareCost />} />
                <Route path="/treatment" element={<Blog />} />
                <Route path="/treatment/:id" element={<BlogPostPage />} />
                <Route path="/newLogin" element={<NewLoginPage />} />
                <Route path="/newSignup" element={<NewSignupPage />} />
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
                <Route path="/plan-journey" element={<PlanJourney />} />
                <Route path="/doctor-dashboard" element={
                  <DoctorProtectedRoute>
                    <DoctorDashboard />
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
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Suspense>
    </ThemeProvider>
    </PostHogProvider>
  );
};

export default App;
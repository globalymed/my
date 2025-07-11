import React, { Suspense, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Button, Typography, useTheme } from '@mui/material';
import { db } from '../firebase';
import Layout from './Layout';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatLayout from '../components/ChatLayout';
import NewLoginPage from './NewLoginPage.jsx';
import NewSignupPage from './NewSignupPage.jsx';

const AIChat = React.lazy(() => import('../components/AIChatFinal'));
const ClinicRecommender = React.lazy(() => import('../components/ClinicRecommenderEnhanced'));
const CalendarComponent = React.lazy(() => import('../components/CalendarComponent'));
const TimeSlotGrid = React.lazy(() => import('../components/TimeSlotGrid'));
const BookingConfirmationForm = React.lazy(() => import('../components/BookingConfirmationForm'));
const AppointmentBookingPage = React.lazy(() => import('../components/AppointmentBookingPage'));
const LoginPage = React.lazy(() => import('../components/LoginPage'));
const DoctorLoginPage = React.lazy(() => import('../components/DoctorLoginPage'));
const HomePage = React.lazy(() => import('../components/HomePage.jsx'));
const DashboardPage = React.lazy(() => import('../components/DashboardPage'));
import FreeConsultation from './FreeConsultation.jsx';
import ContactUs from './ContactUs.jsx';
import { Login } from '@mui/icons-material';
import Blog from './Blog.jsx';
import BlogPostPage from './BlogPostPage.jsx';

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
    <Box sx={{ width: '100%', height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Logout header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          bgcolor: theme.palette.primary.main,
          color: 'white',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Doctor Dashboard
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            textTransform: 'none',
            bgcolor: 'error.main',
            '&:hover': {
              bgcolor: 'error.dark',
            }
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Dashboard iframe */}
      <iframe
        src="https://preview--patient-dashboard-ai.lovable.app/"
        title="Doctor Dashboard"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          justifyContent: 'center',
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
      // Direct redirect to bypass SPA routing issues
      window.location.href = '/doctor-dashboard';
    }
  }, [isDoctorAuthenticated]);

  return !isDoctorAuthenticated ? children : <LoadingFallback />;
};

const App = () => {
  return (
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
                <Route path="/treatment" element={<Blog />} />
                <Route path="/treatment/:id" element={<BlogPostPage />} />
                <Route path="/newLogin" element={<NewLoginPage />} />
                <Route path="/newSignup" element={<NewSignupPage />} />
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
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
};


export default App;
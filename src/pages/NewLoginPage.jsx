import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  Link,
  styled,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person,
  LocalHospital,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: '50px auto',
  padding: '20px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '16px',
  backgroundColor: '#fff',
  minWidth: '90%',
  [theme.breakpoints.up('sm')]: {
    minWidth: 400,
  },
  [theme.breakpoints.up('md')]: {
    minWidth: 600,
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: '30px',
  '& .MuiTabs-flexContainer': {
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    padding: '4px',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    minHeight: '48px',
    fontSize: '16px',
    fontWeight: 500,
    color: '#666',
    borderRadius: '8px',
    margin: '0 2px',
    '&.Mui-selected': {
      backgroundColor: '#ffffff',
      color: '#333',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fafafa',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#bdbdbd',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666',
    fontSize: '14px',
    fontWeight: 500,
  },
  '& .MuiOutlinedInput-input': {
    padding: '14px 16px',
    fontSize: '16px',
    '&::placeholder': {
      color: '#999',
      opacity: 1,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#333',
  color: '#ffffff',
  borderRadius: '8px',
  padding: '14px 24px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  height: '52px',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#555',
    boxShadow: 'none',
  },
  '&:active': {
    backgroundColor: '#222',
  }
}));

function LoginForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Auto-focus email field on mount
  useEffect(() => {
    const emailInput = document.getElementById('login-email');
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setEmailError('');
    setPasswordError('');
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setError('');
    setEmailError('');
    setPasswordError('');

    // Validate form
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      if (activeTab === 0) {
        // Patient login
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('email', '==', email));
        const userSnapshot = await getDocs(q);

        if (userSnapshot.empty) {
          setEmailError('No account found with this email');
          setIsLoading(false);
          return;
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        // Check if password matches
        if (userData.password !== password) {
          setPasswordError('Incorrect password');
          setIsLoading(false);
          return;
        }

        // Store user data in localStorage for persistence
        localStorage.setItem('userData', JSON.stringify({
          id: userDoc.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        }));

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        // Doctor login
        const docCollection = collection(db, 'doctors');
        const q = query(docCollection, where('email', '==', email));
        const docSnapshot = await getDocs(q);

        if (docSnapshot.empty) {
          setEmailError('No account found with this email');
          setIsLoading(false);
          return;
        }

        const userDoc = docSnapshot.docs[0];
        const doctorData = userDoc.data();

        // Check if password matches
        if (doctorData.password !== password) {
          setPasswordError('Incorrect password');
          setIsLoading(false);
          return;
        }

        // Store doctor data in localStorage for persistence
        localStorage.setItem('doctorData', JSON.stringify({
          id: userDoc.id,
          email: doctorData.email,
          firstName: doctorData.firstName,
          lastName: doctorData.lastName
        }));

        // Navigate to doctor dashboard
        navigate('/doctor-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Box sx={{
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <StyledCard>
        <CardContent sx={{ padding: '0 !important' }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              textAlign: 'center',
              mb: 1,
              fontSize: '28px',
              fontWeight: 600,
              color: '#333'
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: '#666',
              fontSize: '16px'
            }}
          >
            Sign in to your account to continue
          </Typography>

          <StyledTabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab
              icon={<Person sx={{ fontSize: 18 }} />}
              label="Patient"
              iconPosition="start"
              sx={{ gap: 1 }}
            />
            <Tab
              icon={<LocalHospital sx={{ fontSize: 18 }} />}
              label="Doctor"
              iconPosition="start"
              sx={{ gap: 1 }}
            />
          </StyledTabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: '#333',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Email
            </Typography>
            <StyledTextField
              fullWidth
              variant="outlined"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
                setError('');
              }}
              type="email"
              id="login-email"
              error={!!emailError}
              helperText={emailError}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: '#333',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Password
            </Typography>
            <StyledTextField
              fullWidth
              variant="outlined"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
                setError('');
              }}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      sx={{ color: '#666' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <StyledButton
            fullWidth
            onClick={handleSignIn}
            disabled={isLoading}
            sx={{ mb: 3 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </StyledButton>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Link
              onClick={() => navigate('/confirm-email')}
              sx={{
                color: '#4A90E2',
                textDecoration: 'none',
                fontSize: '14px',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Forgot your password?
            </Link>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '14px'
              }}
            >
              Don't have an account?{' '}
              <Link
                href="/newSignup"
                sx={{
                  color: '#4A90E2',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </StyledCard>
      
    </Box>
    <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Link href="/privacy" color="primary" underline="hover">Privacy Policy</Link>
      </Box>
      <Box sx={{ textAlign: 'center', mt: 2, paddingBottom: 1 }}>
        <Link href="/terms" color="primary" underline="hover">Terms of Service</Link>
      </Box>

    </div>
  );
}

export default LoginForm;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Link,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  margin: '2rem auto',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  [theme.breakpoints.down('sm')]: {
    margin: '1rem',
    borderRadius: 12
  }
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4)
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main
    }
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: theme.palette.primary.main
    }
  }
}));

const DoctorLoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Auto-focus email field on mount
  useEffect(() => {
    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));

    // Clear errors when user types
    if (name === 'email') setEmailError('');
    if (name === 'password') setPasswordError('');
    setError('');
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setEmailError('');
    setPasswordError('');

    // Validate form
    let isValid = true;

    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!validatePassword(formData.password)) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      // Check Firestore for user credentials
      const docCollection = collection(db, 'doctors');
      const q = query(docCollection, where('email', '==', formData.email));
      const docSnapshot = await getDocs(q);

      if (docSnapshot.empty) { // Changed from userSnapshot to docSnapshot
        setEmailError('No account found with this email');
        setIsLoading(false);
        return;
      }

      const userDoc = docSnapshot.docs[0];
      const doctorData = userDoc.data();

      // Check if password matches
      if (doctorData.password !== formData.password) {
        setPasswordError('Incorrect password');
        setIsLoading(false);
        return;
      }
      
      // Handle remember me
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Store user data in localStorage for persistence
      localStorage.setItem('doctorData', JSON.stringify({
        id: userDoc.id,
        email: doctorData.email,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName
      }));

      
      // Navigate to dashboard
      navigate('/doctor-dashboard');


    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login'); // Changed this line
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #e1f5fe 0%, #b3e5fc 100%)',
        py: 4
      }}
    >
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          <LogoContainer>
            <img
              src="/logo.png"
              alt="MedYatra Logo"
              style={{
                width: isMobile ? 64 : 80,
                height: isMobile ? 64 : 80,
                marginBottom: theme.spacing(2)
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                textAlign: 'center'
              }}
            >
              Doctor Login
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: 'center', mt: 1 }}
            >
              Sign in to your MedYatra Doctor Dashboard
            </Typography>
          </LogoContainer>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              id="doctor-email"
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!emailError}
              helperText={emailError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                )
              }}
              sx={{ mb: 3 }}
            />

            <StyledTextField
              fullWidth
              id="doctor-password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    name="rememberMe"
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link
                href="#"
                variant="body2"
                sx={{ color: theme.palette.primary.main }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderRadius: 8,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0, 107, 255, 0.15)'
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
            
            {process.env.NODE_ENV === 'development' && (
              <Box mt={2} p={2} bgcolor="rgba(0,0,0,0.03)" borderRadius={1}>
                <Typography variant="caption" component="div">
                  <strong>Test Account:</strong><br />
                    try any accounts from the db
                </Typography>
              </Box>
            )}
          </form>
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Link href="/privacy" color="primary" underline="hover">Privacy Policy</Link>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link href="/terms" color="primary" underline="hover">Terms of Service</Link>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default DoctorLoginPage;
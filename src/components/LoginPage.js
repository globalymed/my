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

const LoginPage = () => {
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
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', formData.email));
      const userSnapshot = await getDocs(q);

      if (userSnapshot.empty) {
        setEmailError('No account found with this email');
        setIsLoading(false);
        return;
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      // Check if password matches
      if (userData.password !== formData.password) {
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
      localStorage.setItem('userData', JSON.stringify({
        id: userDoc.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      }));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
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
        background: 'linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%)',
        py: 4
      }}
    >
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          <LogoContainer>
            <img
              src="/logo.webp"
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
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: 'center', mt: 1 }}
            >
              Sign in to your MedYatra account
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
              id="email"
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
                    <EmailIcon color={emailError ? 'error' : 'action'} />
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />

            <StyledTextField
              fullWidth
              id="password"
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
                    <LockIcon color={passwordError ? 'error' : 'action'} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link
                href="/forgot-password"
                variant="body2"
                color="primary"
                sx={{ textDecoration: 'none' }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderRadius: 8,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Link href="/privacy" color="primary" underline="hover">Privacy Policy</Link>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link href="/terms" color="primary" underline="hover">Terms of Service</Link>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                href="/register"
                variant="body2"
                color="primary"
                sx={{ textDecoration: 'none', fontWeight: 600 }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default LoginPage; 
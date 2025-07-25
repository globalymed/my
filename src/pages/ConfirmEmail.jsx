import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  styled,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
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

function ConfirmEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'success', 'error', 'info'
  const [emailError, setEmailError] = useState('');

  // Auto-focus email field on mount
  useEffect(() => {
    const emailInput = document.getElementById('confirm-email');
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleConfirmEmail = async () => {
    setIsLoading(true);
    setMessage('');
    setEmailError('');
    setMessageType('info');

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setEmailError('Email address is required');
      setIsLoading(false);
      return;
    }

    try {
      // First try the Firebase callable function
      console.log('Trying Firebase callable function...');
      
      const functions = getFunctions();
      const resetPassword = httpsCallable(functions, 'resetPassword');
      
      const result = await resetPassword({ email });
      
      if (result.data.valid) {
        setMessage('Email address valid. Password reset instructions have been sent to your email.');
        setMessageType('success');
      } else {
        setMessage(result.data.message || 'Email address not valid or not found in our system.');
        setMessageType('error');
      }
    } catch (callableError) {
      console.error('Callable function failed:', callableError);
      console.log('Falling back to HTTPS endpoint...');
      
      // Fallback to HTTPS endpoint
      try {
        const FUNCTION_URL = 'https://us-central1-medi-yatra-clinics.cloudfunctions.net/resetPassword';
        
        const response = await fetch(FUNCTION_URL, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        const data = await response.json();
        
        if (response.ok && data.valid) {
          setMessage('Email address valid. Password reset instructions have been sent to your email.');
          setMessageType('success');
        } else {
          setMessage(data.message || 'Email address not valid or not found in our system.');
          setMessageType('error');
        }
      } catch (httpError) {
        console.error('HTTPS fallback also failed:', httpError);
        setMessage('Network error, please try again later.');
        setMessageType('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
    setMessage('');
  };

  return (
    <>
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
            Confirm your email
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
            Enter your email address to reset your password
          </Typography>

          {message && (
            <Alert 
              severity={messageType} 
              sx={{ mb: 3 }}
            >
              {message}
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
              Email Address
            </Typography>
            <StyledTextField
              id="confirm-email"
              fullWidth
              variant="outlined"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
            />
          </Box>

          <StyledButton
            fullWidth
            onClick={handleConfirmEmail}
            disabled={isLoading}
            sx={{ mb: 3 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Confirm Email'
            )}
          </StyledButton>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Link
              onClick={() => navigate('/login')}
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
              Back to Sign In
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
      </>
  );
}

export default ConfirmEmail;

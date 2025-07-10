import React, { useState } from 'react';
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
  styled
} from '@mui/material';
import {
  Person,
  LocalHospital,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: '50px auto',
  padding: '20px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '16px',
  backgroundColor: '#fff',
  minWidth: '90%', // default for xs

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
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = () => {
    console.log('Sign in clicked', { activeTab, email, password });
  };

  return (
    <Box sx={{
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
              onChange={(e) => setEmail(e.target.value)}
              type="email"
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
              onChange={(e) => setPassword(e.target.value)}
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
            sx={{ mb: 3 }}
          >
            Sign In
          </StyledButton>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Link
              href="#"
              sx={{
                color: '#4A90E2',
                textDecoration: 'none',
                fontSize: '14px',
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
                href="/signup"
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
  );
}

export default LoginForm;
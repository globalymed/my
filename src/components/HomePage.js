import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  useTheme,
  Paper,
  Divider
} from '@mui/material';
import {
  HealthAndSafety as HealthIcon,
  MedicalServices as MedicalIcon,
  AccessTime as TimeIcon,
  CalendarMonth as CalendarIcon,
  Chat as ChatIcon,
  Psychology as AIIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI-Powered Chat',
      description: 'Get instant answers to your health queries and book appointments with our smart AI assistant.',
      icon: <AIIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      action: () => navigate('/chat')
    },
    {
      title: 'Easy Appointment Booking',
      description: 'Book appointments with doctors at your preferred time slots with just a few clicks.',
      icon: <CalendarIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      action: () => navigate('/book')
    },
    {
      title: 'Medical Information',
      description: 'Access comprehensive information about various treatments and medical procedures.',
      icon: <MedicalIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      action: null
    },
    {
      title: 'Patient Dashboard',
      description: 'View and manage all your appointments and medical records in one place.',
      icon: <HealthIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      action: () => navigate('/dashboard')
    }
  ];

  return (
    <Box sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 6,
          borderRadius: 4,
          backgroundImage: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.15)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }}
        />
        <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={7}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 2, color: '#1e3a8a' }}>
              MedYatra
            </Typography>
            <Typography variant="h5" sx={{ mb: 3, color: '#334155', fontWeight: 500 }}>
              Your Healthcare Journey Made Simple
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#475569', fontSize: '1.1rem', maxWidth: '600px' }}>
              MedYatra is a comprehensive healthcare platform designed to seamlessly connect
              patients with healthcare services. Our AI-powered tools, appointment scheduling,
              and personalized dashboards make healthcare access easier than ever.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/chat')}
                startIcon={<ChatIcon />}
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 2,
                  backgroundColor: '#1e40af',
                  '&:hover': { backgroundColor: '#1e3a8a' },
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                Chat with AI Assistant
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/book')}
                startIcon={<CalendarIcon />}
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 2,
                  borderColor: '#1e40af',
                  color: '#1e40af',
                  '&:hover': { borderColor: '#1e3a8a', backgroundColor: 'rgba(30, 64, 175, 0.04)' },
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                Book Appointment
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              component="img"
              src="/logo192.png"
              alt="MedYatra"
              sx={{
                width: '80%',
                maxWidth: 350,
                mx: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15))'
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Features Section */}
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 700, color: '#1e3a8a', textAlign: 'center' }}>
        Our Healthcare Features
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                },
                cursor: feature.action ? 'pointer' : 'default'
              }}
              onClick={feature.action}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 1.5, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* About Section */}
      <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: 4, bgcolor: '#f8fafc' }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 700, color: '#1e3a8a', textAlign: 'center' }}>
          About MedYatra
        </Typography>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 2, color: '#334155' }}>
              MedYatra is built on the mission of making healthcare accessible, transparent, and efficient for everyone. Our platform is designed to simplify the healthcare journey from finding the right doctor to booking appointments and managing health records.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#334155' }}>
              With our AI-powered chat assistant, you can get instant answers to your health queries and book appointments with suitable doctors based on your symptoms and preferences.
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155' }}>
              Our dashboard provides a comprehensive view of your healthcare journey, allowing you to manage appointments, access medical records, and stay on top of your health.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e3a8a' }}>
                Why Choose MedYatra?
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { title: 'AI-Powered Health Assistance', desc: 'Get instant answers to your health queries and personalized recommendations.' },
                  { title: 'Quick Appointment Booking', desc: 'Book appointments with doctors at your preferred time slots with just a few clicks.' },
                  { title: 'Comprehensive Health Information', desc: 'Access detailed information about various treatments and medical procedures.' },
                  { title: 'Secure & Private', desc: 'Your health data is securely stored and your privacy is our top priority.' }
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      flexShrink: 0,
                      mt: 0.5
                    }}>
                      {i+1}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#334155' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Call to Action */}
      <Box sx={{ 
        p: 4, 
        textAlign: 'center',
        bgcolor: theme.palette.primary.main,
        borderRadius: 4,
        color: '#fff'
      }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Ready to Start Your Healthcare Journey?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
          Join MedYatra today and experience the future of healthcare. Book appointments, chat with our AI assistant, and manage your health records all in one place.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              bgcolor: '#fff',
              color: theme.palette.primary.main,
              '&:hover': { bgcolor: '#f8fafc' }
            }}
          >
            Login to Dashboard
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/chat')}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              borderColor: '#fff',
              color: '#fff',
              '&:hover': { borderColor: '#f8fafc', bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Chat with AI Assistant
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage; 
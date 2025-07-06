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
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  HealthAndSafety as HealthIcon,
  MedicalServices as MedicalIcon,
  AccessTime as TimeIcon,
  CalendarMonth as CalendarIcon,
  Chat as ChatIcon,
  Psychology as AIIcon,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import HeroSection from './HomePage/HeroSection.jsx';
import HowItWorksSection from './HomePage/HowItWorks.jsx';
import TestimonialsSection from './HomePage/TestinomialSection.jsx';
import MultiSpecialitySection from './HomePage/MultiSpeciality.jsx';
import SyntomsChecker from './HomePage/SyntomsSection.jsx';
import FAQSection from './HomePage/FAQSection.jsx';
import TreatmentExperience from './HomePage/TreatmentExperience.jsx';


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

      <HeroSection />

      <HowItWorksSection />

      <TestimonialsSection />

      <MultiSpecialitySection />

      <SyntomsChecker />

      <TreatmentExperience />

      <FAQSection />
    </Box>
  );
};

export default HomePage; 
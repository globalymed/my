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
import SEO from './SEO.jsx';
import { structuredDataTemplates } from '../utils/structuredData.js';


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


  const homePageStructuredData = [
    structuredDataTemplates.organization,
    structuredDataTemplates.medicalOrganization,
    structuredDataTemplates.website,
    structuredDataTemplates.service("Hair Transplant", "Advanced hair restoration procedures including FUE, FUT, and PRP therapy", "https://medyatra.space/treatment/hair"),
    structuredDataTemplates.service("IVF Treatment", "Comprehensive fertility treatments including in vitro fertilization and reproductive health consultations", "https://medyatra.space/treatment/ivf"),
    structuredDataTemplates.service("Dental Care", "Complete dental services including implants, braces, cosmetic dentistry, and routine oral care", "https://medyatra.space/treatment/dental"),
    structuredDataTemplates.service("Cosmetic Surgery", "Aesthetic treatments including rhinoplasty, liposuction, skin rejuvenation, and non-surgical enhancements", "https://medyatra.space/treatment/cosmetics")
  ];

  return (
    <>
      <SEO
        title="AI-Powered Medical Tourism in India"
        description="Find top clinics for Hair Transplant, IVF, Dental, and Cosmetic treatments in India. Get AI-powered recommendations, travel assistance, and easy appointment booking with MedYatra."
        keywords="medical tourism India, hair transplant India, IVF treatment India, dental care India, cosmetic surgery India, healthcare travel, medical tourism platform, AI healthcare recommendations"
        canonical="https://medyatra.space/"
        ogTitle="MedYatra - AI-Powered Medical Tourism in India"
        ogDescription="Connect with top medical clinics in India for Hair Transplant, IVF, Dental, and Cosmetic treatments. AI-powered recommendations and seamless booking experience."
        ogImage="https://medyatra.space/logo.webp"
        ogUrl="https://medyatra.space/"
        structuredData={homePageStructuredData}
      />
      
      <Box sx={{ py:0 }}>
        <HeroSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <MultiSpecialitySection />
        <SyntomsChecker />
        <TreatmentExperience />
        <FAQSection />
      </Box>
    </>
  );
};

export default HomePage; 
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Chip,
  Stack,
  InputAdornment,
} from '@mui/material';

import {
  Mic as MicIcon,
  Send as SendIcon,
  LocalHospital as LocalHospitalIcon,
  Favorite as FavoriteIcon,
  Face as FaceIcon,
  BabyChangingStation as BabyChangingStationIcon,
  Chat as ChatIcon,
  AccessTime as AccessTimeIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';

import { CiStethoscope } from "react-icons/ci";
import { TbClock24 } from "react-icons/tb";
import { RiRobot2Line } from "react-icons/ri";
import AIChatFinal from '../AIChatFinal';

const SuggestionChips = [
  { label: 'I have dental problems', icon: <LocalHospitalIcon /> },
  { label: 'I want cosmetic treatment', icon: <FavoriteIcon /> },
  { label: 'I’m experiencing hair loss', icon: <FaceIcon /> },
  { label: 'I need fertility consultation', icon: <BabyChangingStationIcon /> },
];

const Features = [
  {
    title: 'Smart Symptom Analysis',
    description:
      'AI detects possible conditions & suggests treatments in India or abroad.',
    icon: <RiRobot2Line sx={{ color: '#1D4C4B' }} />,
  },
  {
    title: 'Doctor Matching',
    description:
      'Verified specialists based on your symptoms, budget & travel needs.',
    icon: <CiStethoscope sx={{ color: '#1D4C4B' }} />,
  },
  {
    title: 'Available Anytime',
    description:
      '24/7 medical assistance, even in emergencies , free consultation for new users.',
    icon: <TbClock24 sx={{ color: '#1D4C4B' }} />,
  },
];

const SymptomChecker = () => {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: '#52C7BE' }}>
      <Typography
        variant="h2"
        fontWeight={700}
        color="white"
        textAlign="center"
        mb={1}
      >
        AI-Powered Symptom Checker for Fast Medical Treatment in India
      </Typography>
      <Typography variant="body1" textAlign="center" color="#e0f7f6" mb={6}>
       Our AI health checker instantly analyzes your symptoms and connects you with top Indian hospitals, doctors, and affordable treatment packages, <br />
       trusted by patients from 20+ countries.
      </Typography>

      <Grid container gap={4} justifyContent="center">
        {/* Chat Box */}
        <Grid item xs={12} md={6} sx={
          {
            backgroundColor: 'white',
            borderRadius: 2,
            overflow: 'hidden',
            maxHeight: '90vh',
            overflowY: 'hidden',
            background: 'linear-gradient(to bottom right, #ffffff, #fde2e4, #e0c3fc)',
          }
        }>
          
          <AIChatFinal />
          
        </Grid>

        {/* Feature Points */}
        <Grid item xs={12} md={3}>
          <Stack gap={3}>
            {Features.map((feature) => (
              <Paper
                key={feature.title}
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                }}
              >
                {/* Icon Box */}
                <Box
                  sx={{
                    fontSize: '2rem',         // Adjust icon size here
                    color: '#1D4C4B',
                    minWidth: 36,
                  }}
                >
                  {feature.icon}
                </Box>

                {/* Text Box */}
                <Box>
                  <Typography fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
                
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SymptomChecker;

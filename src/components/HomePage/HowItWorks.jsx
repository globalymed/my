import React from 'react';
import { Box, Typography, Grid, Stack, Avatar } from '@mui/material';
import {
    ChatBubbleOutline,
    PeopleAlt,
    EventAvailable,
} from '@mui/icons-material';

const steps = [
  {
    icon: <ChatBubbleOutline fontSize="large" sx={{ color: '#1D4645' }} />,
    title: 'Describe Symptoms',
    description:
      'Tell our AI about your health concerns in simple language. Our intelligent system understands medical terminology and common symptoms.',
  },
  {
    icon: <PeopleAlt fontSize="large" sx={{ color: '#1D4645' }} />,
    title: 'Get Matched with Best Doctor',
    description:
      'Our AI analyzes your symptoms, location, and preferences to match you with the most suitable verified doctors in your area.',
  },
  {
    icon: <EventAvailable fontSize="large" sx={{ color: '#1D4645' }} />,
    title: 'Schedule & Consult',
    description:
      'Book your appointment instantly and consult with your doctor online or in-person based on your preference.',
  },
];

const HowItWorksSection = () => {
  return (
    <Box sx={{ py: 6, backgroundColor: '#F8EEE2' }}>
      <Typography
        variant="h2"
        align="center"
        fontWeight={700}
        sx={{ mb: 1, color: '#000' }}
      >
        How It Works
      </Typography>
      <Typography
        variant="body1"
        align="center"
        color="text.secondary"
        sx={{ mb: 6 }}
      >
        Get connected with the right doctor in just three simple steps
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Avatar
                sx={{
                  bgcolor: 'white',
                  border: '1px solid #ccc',
                  width: 64,
                  height: 64,
                }}
              >
                {step.icon}
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" maxWidth={280}>
                {step.description}
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: 'black' }}
              >
                {index + 1}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorksSection;

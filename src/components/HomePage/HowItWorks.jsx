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
      'Share your health concerns in a simple language, no medical jargon needed. Our advanced AI understands medical terms and everyday symptoms to guide your care.',
  },
  {
    icon: <PeopleAlt fontSize="large" sx={{ color: '#1D4645' }} />,
    title: 'Get Matched with Best Doctor',
    description:
      'Our AI instantly analyzes your symptoms, location, and preferences to connect you with top-rated, verified doctors in your area or anywhere in India.',
  },
  {
    icon: <EventAvailable fontSize="large" sx={{ color: '#1D4645' }} />,
    title: 'Schedule & Consult',
    description:
      'Book your appointment in seconds. Choose an online video consultation or an in-person visit at your convenience.',
  },
];

const HowItWorksSection = () => {
  return (
    <Box sx={{ py: 6, backgroundColor: '#F8EEE2' }}>
      <Typography
        variant="h2"
        align="center"
        fontWeight={700}
        sx={{ mb: 1, color: '#2f2f2f' }}
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
                sx={{ fontWeight: 700, color: '#2f2f2f' }}
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

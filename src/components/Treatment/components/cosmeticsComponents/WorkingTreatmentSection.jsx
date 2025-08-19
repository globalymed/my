import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
} from '@mui/material';

import { SmartToy, CheckCircleOutline, CalendarToday, AutoAwesome, Flight } from '@mui/icons-material';


// Define keyframes for the pulse animation
const pulseKeyframe = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const stepsData = [
    {
        step: "1",
        title: "Share Your Goals",
        description: "Upload photos and describe your aesthetic goals for AI analysis",
        icon: SmartToy,
        gradient: 'linear-gradient(to right, #9333ea, #3b82f6)',
        bgGradient: 'linear-gradient(to bottom right, #f3e8ff, #e0e7ff)',
    },
    {
        step: "2",
        title: "AI Recommendations",
        description: "Get personalized procedure options and surgeon recommendations",
        icon: CheckCircleOutline,
        gradient: 'linear-gradient(to right, #3b82f6, #06b6d4)',
        bgGradient: 'linear-gradient(to bottom right, #e0f2fe, #cffafe)',
    },
    {
        step: "3",
        title: "Complete Planning",
        description: "Surgeon selection, procedure booking, travel and recovery planning",
        icon: CalendarToday,
        gradient: 'linear-gradient(to right, #22c55e, #10b981)',
        bgGradient: 'linear-gradient(to bottom right, #f0fdf4, #ecfdf5)',
    },
    {
        step: "4",
        title: "Transformation",
        description: "Receive expert care and return home with your new look",
        icon: AutoAwesome,
        gradient: 'linear-gradient(to right, #ec4899, #f43f5e)',
        bgGradient: 'linear-gradient(to bottom right, #fce7f3, #ffe4e6)',
    },
];

const WorkingTreatmentSection = () => {
    return (
        <>
            <style>{pulseKeyframe}</style>
            <Box
                component="section"
                sx={{
                    py: 12,
                    px: 4,
                    background: 'linear-gradient(to bottom right, #f5f3ff, #eff6ff, #eBF5FF)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Animated Background Blobs */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 80,
                        left: 80,
                        width: 128,
                        height: 128,
                        background:
                            'linear-gradient(to bottom right, rgba(192, 132, 252, 0.1), rgba(96, 165, 250, 0.1))',
                        borderRadius: '50%',
                        filter: 'blur(16px)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 80,
                        right: 80,
                        width: 160,
                        height: 160,
                        background:
                            'linear-gradient(to bottom right, rgba(129, 140, 248, 0.1), rgba(192, 132, 252, 0.1))',
                        borderRadius: '50%',
                        filter: 'blur(16px)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s',
                    }}
                />

                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10 }}>
                    <Box textAlign="center" mb={10}>
                        <Chip
                            icon={<SmartToy sx={{ color: '#7e22ce !important' }} />}
                            label="AI-Powered Process"
                            sx={{
                                mb: 3,
                                color: '#6b21a8',
                                borderColor: '#7e22ce',
                                borderRadius: 3,
                                px: 1,
                                fontWeight: 'medium',
                                background: 'white',
                            }}
                        />
                        <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2, fontSize: "3rem" }}>
                            How
                            <br />
                            <Typography component="span" variant="inherit" sx={{
                                background: 'linear-gradient(to right, #7e22ce, #2563eb)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Medyatra Works
                            </Typography>
                        </Typography>
                        <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 'lg', mx: 'auto' }}>
                            AI-powered planning for seamless cosmetic surgery experience
                        </Typography>
                    </Box>

                    <Grid container spacing={4} mb={8}>
                        {stepsData.map((step, index) => (
                            <Grid item xs={12} md={6} lg={3} key={index}>
                                <Card
                                    sx={{
                                        borderRadius: 1,
                                        textAlign: 'center',
                                        position: 'relative',
                                        overflow: 'visible', // allow hover effects to show
                                        border: 0,
                                        background: step.bgGradient,
                                        transition: 'all 0.5s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 20,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 4, position: 'relative' }}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 16,
                                                right: 16,
                                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                backdropFilter: 'blur(4px)',
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: 3,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 'bold', color: 'grey.700' }}
                                            >
                                                {step.step}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                background: step.gradient,
                                                width: 80,
                                                height: 80,
                                                borderRadius: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                                boxShadow: 6,
                                                transition: 'all 0.3s ease',
                                                '.MuiCard-root:hover &': {
                                                    transform: 'scale(1.1)',
                                                    boxShadow: 12,
                                                }
                                            }}
                                        >
                                            <step.icon sx={{ height: 40, width: 40, color: 'white' }} />
                                        </Box>

                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 'bold',
                                                mb: 2,
                                                transition: 'color 0.3s ease',
                                                '.MuiCard-root:hover &': {
                                                    color: '#9333ea',
                                                }
                                            }}
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography sx={{ color: 'grey.600', lineHeight: 1.6 }}>
                                            {step.description}
                                        </Typography>

                                        {index < stepsData.length - 1 && (
                                            <Box
                                                sx={{
                                                    display: { xs: 'none', lg: 'block' },
                                                    position: 'absolute',
                                                    top: '50%',
                                                    right: -16,
                                                    width: 32,
                                                    height: 2,
                                                    transform: 'translateY(-50%)',
                                                    background: 'linear-gradient(to right, #d1d5db, transparent)',
                                                }}
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box textAlign="center">
                        <Button
                            size="large"
                            startIcon={<SmartToy sx={{ height: 24, width: 24 }} />}
                            endIcon={<AutoAwesome sx={{ height: 24, width: 24 }} />}
                            sx={{
                                color: 'white',
                                px: 6,
                                py: 1.5,
                                borderRadius: 1,
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                textTransform: 'none',
                                background: 'linear-gradient(to right, #9333ea, #7c3aed, #3b82f6)',
                                boxShadow: '0 8px 25px -8px #9333ea',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 12px 30px -10px #9333ea',
                                    background: 'linear-gradient(to right, #a855f7, #8b5cf6, #60a5fa)',
                                },
                            }}
                        >
                            Try Cosmetic AI Planner
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default WorkingTreatmentSection;
import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Chip,
    Stack,
    Paper
} from '@mui/material';
import {
    AutoAwesome as SparklesIcon,
    SmartToyOutlined as BotIcon,
    Phone as PhoneIcon,
    People as UsersIcon,
    AttachMoney as DollarSignIcon,
    Star as StarIcon,
    MailOutline as MailIcon,
    AccessTime as ClockIcon
} from '@mui/icons-material';

// Define the pulse keyframe animation for use in the sx prop
const pulseAnimation = {
    '@keyframes pulse': {
        '0%, 100%': {
            opacity: 1,
        },
        '50%': {
            opacity: 0.5,
        },
    },
};

// Data for the stats cards
const stats = [
    { number: "2,847+", label: "Happy Patients", Icon: UsersIcon },
    { number: "70%", label: "Average Savings", Icon: DollarSignIcon },
    { number: "4.9★", label: "Patient Rating", Icon: StarIcon },
];


const chipData = [
    {
        icon: <PhoneIcon sx={{ color: "white" }} />,
        label: "+91-9876543210",
    },
    {
        icon: <MailIcon sx={{ color: "white" }} />,
        label: "ivf@mediyatra.com",
    },
    {
        icon: <ClockIcon sx={{ color: "white" }} />,
        label: "24/7 Support",
    },
];

const FinalCTATreatmentSecion = () => {
    return (
        <Box component="section" sx={{
            py: { xs: 8, md: 12 },
            px: 2,
            position: 'relative',
            overflow: 'hidden',
            ...pulseAnimation
        }}>
            {/* Background Layers */}
            <Box sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom right, #2563eb, #7c3aed, #4f46e5)',
            }} />
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0, 0, 0, 0.2)' }} />

            {/* Floating Animated Elements */}
            <Box sx={{ position: 'absolute', top: 80, left: 80, width: 128, height: 128, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(24px)', animation: 'pulse 4s infinite' }} />
            <Box sx={{ position: 'absolute', bottom: 80, right: 80, width: 160, height: 160, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(24px)', animation: 'pulse 5s infinite ease-in-out' }} />
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 240, height: 240, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(40px)' }} />

            <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1, color: 'white' }}>
                {/* Header Content */}
                <Box sx={{ mb: 6 }}>
                    <Chip
                        icon={<SparklesIcon sx={{ color: 'white !important' }} />}
                        label="Start Your Parenthood Journey"
                        sx={{
                            mb: 3,
                            color: 'white',
                            fontWeight: 'medium',
                            borderRadius: 3,
                            px: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                    />
                    <Typography variant="h2" component="h2" fontWeight="bold" sx={{ mb: 2, lineHeight: 1.2, fontSize: "3rem" }}>
                        Ready to Start
                        <br />
                        <Typography component="span" variant="inherit" sx={{
                            background: 'linear-gradient(to right, #fde047, #fb923c)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Your Family?
                        </Typography>
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 6, color: 'rgba(255, 255, 255, 0.9)', maxWidth: 'lg', mx: 'auto' }}>
                        Join thousands of couples who achieved their parenthood dreams through world-class IVF treatment in India
                    </Typography>
                </Box>

                {/* CTA Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mb: { xs: 8, md: 10 } }}>
                    <Button
                        size="large"
                        startIcon={<BotIcon />}
                        endIcon={<SparklesIcon />}
                        sx={{
                            bgcolor: 'white',
                            color: 'primary.main',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            px: 5,
                            py: 1.5,
                            borderRadius: 1,
                            boxShadow: 24,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: '#f3f4f6',
                                transform: 'scale(1.05)',
                                boxShadow: '0px 16px 32px rgba(0,0,0,0.2)',
                            }
                        }}
                    >
                        Get AI Fertility Assessment
                    </Button>
                    <Button
                        size="large"
                        variant="outlined"
                        startIcon={<PhoneIcon />}
                        sx={{
                            borderColor: 'white',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            px: 5,
                            py: 1.5,
                            borderRadius: 1,
                            backdropFilter: 'blur(4px)',
                            boxShadow: 24,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 1)',
                                color: 'primary.main',
                                transform: 'scale(1.05)',
                                boxShadow: '0px 16px 32px rgba(0,0,0,0.2)',
                            }
                        }}
                    >
                        Talk to Fertility Expert
                    </Button>
                </Stack>

                {/* Stats Grid */}
                {/* <Grid container spacing={4} sx={{ mb: { xs: 8, md: 10 } }}>
                    {stats.map((stat) => (
                        <Grid item xs={12} md={4} key={stat.label}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 4,
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: 1,
                                    transition: 'background-color 0.3s ease',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: '50%',
                                        transition: 'background-color 0.3s ease',
                                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                                    }}>
                                        <stat.Icon sx={{ fontSize: '2.5rem', color: 'white' }} />
                                    </Box>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, fontSize: '2rem', color: 'white' }}>{stat.number}</Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{stat.label}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid> */}

                {/* Footer Contact Info */}
                <Box sx={{ pt: 4, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 2, sm: 4 }}
                        justifyContent="center"
                        alignItems="center"
                    >
                        {chipData.map((chip, index) => (
                            <Chip
                                key={index}
                                icon={chip.icon}
                                label={chip.label}
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.1)",
                                    color: "white",
                                    backdropFilter: "blur(4px)",
                                    borderRadius: 1,
                                    px: 1,
                                    py: 1,
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default FinalCTATreatmentSecion;
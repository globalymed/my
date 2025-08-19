import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Avatar,
    Button,
} from '@mui/material';


import {
    Flight,
    Hotel,
    Translate,
    SupportAgent,
    Favorite,
} from '@mui/icons-material';

// Data for Travel & Accommodation Support
const servicesData = [
    {
        icon: Flight,
        title: "Airport Pickup",
        description: "Complimentary pickup and drop-off services from major airports",
        gradient: "linear-gradient(to right, #3b82f6, #06b6d4)",
        bgGradient: "linear-gradient(to bottom right, #e0f2fe, #cffafe)",
    },
    {
        icon: Hotel,
        title: "Accommodation",
        description: "Comfortable hotels near clinics with special medical tourism rates",
        gradient: "linear-gradient(to right, #22c55e, #10b981)",
        bgGradient: "linear-gradient(to bottom right, #f0fdf4, #ecfdf5)",
    },
    {
        icon: Translate,
        title: "Language Support",
        description: "Interpreters available for Arabic, French, Russian, and more",
        gradient: "linear-gradient(to right, #9333ea, #7c3aed)",
        bgGradient: "linear-gradient(to bottom right, #f3e8ff, #e9d5ff)",
    },
    {
        icon: SupportAgent,
        title: "Local Assistance",
        description: "24/7 support team to help with any needs during your stay",
        gradient: "linear-gradient(to right, #f97316, #ef4444)",
        bgGradient: "linear-gradient(to bottom right, #ffedd5, #fee2e2)",
    },
];

const TravelSupportTreatmentSection = () => {
    return (
        <Box component="section" sx={{ py: 12, px: 4, bgcolor: 'white' }}>
            <Container maxWidth="xl">
                {/* Section Header */}
                <Box textAlign="center" mb={10}>

                    <Chip
                        icon={<Flight sx={{ color: '#3b82f6 !important' }} />}
                        label="Complete Support"
                        sx={{
                            mb: 3,
                            color: '#4f46e5',
                            borderRadius: 3,
                            px: 1,
                            fontWeight: 'medium',
                            background: 'linear-gradient(to right, #dbeafe, #e9d5ff)'
                        }}
                    />

                    <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2, fontSize: "3rem" }}>
                        Complete Travel &
                        <br />
                        <Typography component="span" variant="inherit" sx={{
                            background: 'linear-gradient(to right, #3b82f6, #9333ea)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Accommodation Support
                        </Typography>
                    </Typography>
                    <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 'lg', mx: 'auto' }}>
                        We handle everything so you can focus on your treatment and recovery
                    </Typography>
                </Box>

                {/* Services Grid */}
                <Grid container spacing={4} mb={8}>
                    {servicesData.map((service, index) => (
                        <Grid item xs={12} md={6} lg={3} key={index}>
                            <Card
                                sx={{
                                    textAlign: 'center',
                                    p: 4,
                                    height: '100%',
                                    transition: 'all 0.5s ease',
                                    background: service.bgGradient,
                                    borderRadius: 1,
                                    border: 0,
                                    transform: 'translateZ(0)',
                                    '&:hover': {
                                        transform: 'scale(1.05) translateZ(0)',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: '0 !important' }}>
                                    <Box
                                        sx={{
                                            background: service.gradient,
                                            width: 80,
                                            height: 80,
                                            borderRadius: 1,
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
                                        <service.icon sx={{ height: 40, width: 40, color: 'white' }} />
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 2,
                                            transition: 'color 0.3s ease',
                                            '.MuiCard-root:hover &': {
                                                color: '#3b82f6',
                                            }
                                        }}
                                    >
                                        {service.title}
                                    </Typography>
                                    <Typography sx={{ color: 'grey.700', lineHeight: 1.6 }}>
                                        {service.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* CTA Banner */}
                <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 1 }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #6366f1)',
                        }}
                    />
                    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.2)' }} />
                    <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 4, md: 6 }, color: 'white', textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Complete Care Package
                        </Typography>
                        <Typography sx={{ fontSize: '1.125rem', mb: 4, opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
                            Treatment + Travel + Accommodation + Support - All in one seamless package
                        </Typography>
                        <Button
                            size="large"
                            variant="outlined"
                            startIcon={<Favorite />}
                            sx={{
                                bgcolor: 'white',
                                color: '#3b82f6',
                                px: 4,
                                py: 1.5,
                                borderRadius: 1,
                                boxShadow: 'lg',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: '#f3f4f6',
                                    transform: 'scale(1.05)',
                                    boxShadow: 'xl',
                                },
                            }}
                        >
                            Get Complete Package Quote
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default TravelSupportTreatmentSection;
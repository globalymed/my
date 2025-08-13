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
} from '@mui/material';

import {
    HealthAndSafety,
    Star,
    LocationOn,
    CheckCircle,
} from '@mui/icons-material'

// Data for the dental clinics
const clinicsData = [
    {
        name: "Nova IVI Fertility",
        location: "Delhi, Mumbai, Bangalore",
        accreditation: ["JCI", "NABH"],
        image: "https://placehold.co/400x300/f472b6/be123c?text=Nova+IVI+Fertility",
        rating: 4.9,
        gradient: "linear-gradient(to right, #ec4899, #f43f5e)",
        gradientOverlay: "linear-gradient(to bottom right, #ec4899, #f43f5e)",
    },
    {
        name: "Cloudnine Fertility",
        location: "Bangalore, Mumbai, Pune",
        accreditation: ["NABH", "ISO"],
        image: "https://placehold.co/400x300/93c5fd/155e75?text=Cloudnine+Fertility",
        rating: 4.8,
        gradient: "linear-gradient(to right, #3b82f6, #06b6d4)",
        gradientOverlay: "linear-gradient(to bottom right, #3b82f6, #06b6d4)",
    },
    {
        name: "Indira IVF",
        location: "Delhi, Udaipur, Ahmedabad",
        accreditation: ["NABH"],
        image: "https://placehold.co/400x300/c4b5fd/3730a3?text=Indira+IVF",
        rating: 4.7,
        gradient: "linear-gradient(to right, #a855f7, #6366f1)",
        gradientOverlay: "linear-gradient(to bottom right, #a855f7, #6366f1)",
    },
    {
        name: "Bloom IVF Centre",
        location: "Mumbai, Pune, Nashik",
        accreditation: ["NABH", "ISO"],
        image: "https://placehold.co/400x300/86efac/065f46?text=Bloom+IVF",
        rating: 4.8,
        gradient: "linear-gradient(to right, #22c55e, #10b981)",
        gradientOverlay: "linear-gradient(to bottom right, #22c55e, #10b981)",
    },
    {
        name: "Crysta IVF",
        location: "Delhi, Chandigarh, Agra",
        accreditation: ["NABH"],
        image: "https://placehold.co/400x300/fbbf24/be123c?text=Crysta+IVF",
        rating: 4.6,
        gradient: "linear-gradient(to right, #f97316, #ef4444)",
        gradientOverlay: "linear-gradient(to bottom right, #f97316, #ef4444)",
    },
    {
        name: "Milann Fertility",
        location: "Bangalore, Chennai",
        accreditation: ["NABH", "JCI"],
        image: "https://placehold.co/400x300/99f6e4/0e7490?text=Milann+Fertility",
        rating: 4.7,
        gradient: "linear-gradient(to right, #14b8a6, #06b6d4)",
        gradientOverlay: "linear-gradient(to bottom right, #14b8a6, #06b6d4)",
    },
];

const TopClinicsTreatmentSection = () => {
    return (
        <Box
            component="section"
            sx={{
                py: 12,
                px: 4,
                bgcolor: 'white',
            }}
        >
            <Container maxWidth="xl">
                {/* Section Header */}
                <Box textAlign="center" mb={10}>
                    <Chip
                        icon={<HealthAndSafety sx={{ color: '#7e22ce !important' }} />}
                        label="Accredited Partners"
                        sx={{
                            mb: 3,
                            color: '#6b21a8',
                            borderColor: '#7e22ce',
                            borderRadius: 3,
                            px: 1,
                            fontWeight: 'medium',
                            background: "linear-gradient(to right, #dbeafe, #e9d5ff)",
                        }}
                    />
                    <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2, fontSize: "3rem" }}>
                        Top IVF Centers
                        <br />
                        <Typography component="span" variant="inherit" sx={{
                            background: 'linear-gradient(to right, #7e22ce, #2563eb)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            We Partner With
                        </Typography>
                    </Typography>
                    <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 'lg', mx: 'auto' }}>
                        Leading fertility centers with high success rates and international standards
                    </Typography>
                </Box>

                {/* Clinics Grid */}
                <Grid container spacing={4}>
                    {clinicsData.map((clinic, index) => (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card
                                sx={{
                                    overflow: 'hidden',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 1,
                                    bgcolor: 'white',
                                    transition: 'all 0.5s ease',
                                    transform: 'translateZ(0)',
                                    '&:hover': {
                                        transform: 'scale(1.05) translateZ(0)',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    },
                                }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    {/* Gradient Overlay */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: clinic.gradientOverlay,
                                            opacity: 0.1,
                                            transition: 'opacity 0.3s ease',
                                            '.MuiCard-root:hover &': {
                                                opacity: 0.2,
                                            },
                                        }}
                                    />
                                    <CardMedia
                                        component="img"
                                        image={clinic.image}
                                        alt={clinic.name}
                                        sx={{
                                            width: '100%',
                                            height: 192,
                                            objectFit: 'cover',
                                        }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/cccccc/ffffff?text=Image+Error'; }}
                                    />
                                    {/* Rating Badge */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(4px)',
                                            borderRadius: '9999px',
                                            px: 1.5,
                                            py: 0.5,
                                            boxShadow: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Star sx={{ height: 16, width: 16, color: '#facc15', mr: 0.5 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {clinic.rating}
                                        </Typography>
                                    </Box>
                                </Box>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        sx={{
                                            mb: 1.5,
                                            fontWeight: 'bold',
                                            transition: 'color 0.3s ease',
                                            '.MuiCard-root:hover &': {
                                                color: '#3b82f6',
                                            },
                                        }}
                                    >
                                        {clinic.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'grey.600', mb: 2 }}>
                                        <LocationOn sx={{ height: 16, width: 16, mr: 1, color: '#60a5fa' }} />
                                        <Typography variant="body2">{clinic.location}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        {clinic.accreditation.map((acc, i) => (
                                            <Chip
                                                key={i}
                                                label={acc}
                                                size="small"
                                                sx={{
                                                    background: clinic.gradient,
                                                    color: 'white',
                                                    border: 0,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    height: '22px',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #f3f4f6' }}>
                                        <Typography variant="body2" sx={{ color: 'grey.500' }}>
                                            Verified Partner
                                        </Typography>
                                        <CheckCircle sx={{ height: 20, width: 20, color: '#22c55e' }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default TopClinicsTreatmentSection;

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
} from '@mui/material';

import {
    Star,
    Public,
    FormatQuote,

} from "@mui/icons-material";

// Data for the reviews and testimonials section
const platformsData = [
    {
        platform: "Google My Business",
        rating: 4.9,
        reviews: 1247,
        gradient: "linear-gradient(to right, #ef4444, #f97316)",
    },
    {
        platform: "Trustpilot",
        rating: 4.8,
        reviews: 892,
        gradient: "linear-gradient(to right, #22c55e, #10b981)",
    },
    {
        platform: "Facebook",
        rating: 4.9,
        reviews: 708,
        gradient: "linear-gradient(to right, #3b82f6, #06b6d4)",
    },
];

const testimonialsData = [
    {
        name: "Robert Johnson",
        country: "Canada",
        rating: 5,
        review: "Exceptional service from start to finish. The AI planning tool made everything so easy, and the treatment quality was outstanding.",
        initials: "RJ",
        gradient: "linear-gradient(to bottom right, #3b82f6, #06b6d4)",
    },
    {
        name: "Priya Sharma",
        country: "Singapore",
        rating: 5,
        review: "I was nervous about dental tourism, but Mediyatra made it seamless. The doctors were amazing and the facilities were top-notch.",
        initials: "PS",
        gradient: "linear-gradient(to bottom right, #22c55e, #10b981)",
    },
    {
        name: "Carlos Rodriguez",
        country: "Mexico",
        rating: 5,
        review: "Saved thousands of dollars and got better treatment than back home. The travel coordination was perfect too.",
        initials: "CR",
        gradient: "linear-gradient(to bottom right, #9333ea, #7c3aed)",
    },
    {
        name: "Anna Kowalski",
        country: "Poland",
        rating: 5,
        review: "The AI recommendations were spot-on. Found the perfect clinic and doctor for my needs. Highly recommend!",
        initials: "AK",
        gradient: "linear-gradient(to bottom right, #f97316, #ef4444)",
    },
    {
        name: "James Mitchell",
        country: "South Africa",
        rating: 5,
        review: "From consultation to aftercare, everything was professionally handled. My dental implants look and feel natural.",
        initials: "JM",
        gradient: "linear-gradient(to bottom right, #ec4899, #f43f5e)",
    },
    {
        name: "Fatima Al-Zahra",
        country: "Qatar",
        rating: 5,
        review: "The language support and cultural sensitivity made me feel comfortable throughout my treatment journey.",
        initials: "FA",
        gradient: "linear-gradient(to bottom right, #14b8a6, #3b82f6)",
    },
];


const ReviewsTreatmentSecion = () => {
    return (
        <Box
            component="section"
            sx={{
                py: 12,
                px: 4,
                background: 'linear-gradient(to bottom right, #eff6ff, #f5f3ff, #f3e8ff)',
            }}
        >
            <Container maxWidth="xl">
                {/* Section Header */}
                <Box textAlign="center" mb={10}>

                    <Chip
                        icon={<Star sx={{ color: '#f59e0b !important' }} />}
                        label="Patient Reviews"
                        sx={{
                            mb: 3,
                            color: '#1d4ed8',
                            borderColor: 'rgba(59, 130, 246, 0.2)',
                            borderRadius: 3,
                            px: 1,
                            fontWeight: 'medium',
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                        }}
                    />

                    <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2, fontSize: "3rem" }}>
                        What Our
                        <br />
                        <Typography component="span" variant="inherit" sx={{
                            background: 'linear-gradient(to right, #3b82f6, #9333ea)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Patients Say
                        </Typography>
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(4px)',
                                borderRadius: 1,
                                px: 3,
                                py: 2,
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <Box sx={{ display: 'flex' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} sx={{ fontSize: { xs: 24, md: 32 }, color: '#facc15' }} />
                                ))}
                            </Box>
                            <Typography sx={{ ml: 2, fontSize: { xs: '1.875rem', md: '2.25rem' }, fontWeight: 'bold', color: 'grey.900' }}>
                                4.9
                            </Typography>
                        </Box>
                        <Typography sx={{ color: 'grey.600', fontSize: { xs: '1rem', md: '1.125rem' } }}>
                            Based on <Box component="span" sx={{ fontWeight: 'bold', color: '#2563eb' }}>2,847+</Box> reviews
                        </Typography>
                    </Box>
                </Box>

                {/* Platforms Grid */}
                <Grid container spacing={4} mb={8}>
                    {platformsData.map((platform, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card
                                sx={{
                                    textAlign: 'center',
                                    p: 4,
                                    transition: 'all 0.5s ease',
                                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: 1,
                                    border: '1px solid rgba(255, 255, 255, 0.9)',
                                    transform: 'translateZ(0)',
                                    '&:hover': {
                                        transform: 'scale(1.05) translateZ(0)',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    },
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 'bold',
                                        mb: 2,
                                        background: platform.gradient,
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                    }}
                                >
                                    {platform.platform}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} sx={{ fontSize: 24, color: '#facc15' }} />
                                    ))}
                                    <Typography sx={{ ml: 1.5, fontWeight: 'bold', fontSize: '1.5rem' }}>
                                        {platform.rating}
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: 'grey.600' }}>
                                    <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{platform.reviews}</Box> reviews
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Testimonials Grid */}
                <Grid container spacing={3}>
                    {testimonialsData.map((review, index) => (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card
                                sx={{
                                    p: 3,
                                    transition: 'all 0.5s ease',
                                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: 1,
                                    border: '1px solid rgba(255, 255, 255, 0.9)',
                                    height: '100%',
                                    transform: 'translateZ(0)',
                                    '&:hover': {
                                        transform: 'scale(1.05) translateZ(0)',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: '0 !important' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                background: review.gradient,
                                                mr: 2,
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold',
                                                borderRadius: 1,
                                                boxShadow: 6,
                                                transition: 'all 0.3s ease',
                                                '.MuiCard-root:hover &': {
                                                    boxShadow: 12,
                                                }
                                            }}
                                        >
                                            {review.initials}
                                        </Avatar>
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    transition: 'color 0.3s ease',
                                                    '.MuiCard-root:hover &': {
                                                        color: '#2563eb',
                                                    },
                                                }}
                                            >
                                                {review.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: 'grey.600', display: 'flex', alignItems: 'center' }}
                                            >
                                                <Public sx={{ height: 16, width: 16, mr: 0.5 }} />
                                                {review.country}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', mb: 2 }}>
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} sx={{ fontSize: 20, color: '#facc15' }} />
                                        ))}
                                    </Box>

                                    <Box sx={{ position: 'relative', minHeight: 120 }}>
                                        <FormatQuote
                                            sx={{
                                                position: 'absolute',
                                                top: -8,
                                                left: -8,
                                                fontSize: '2.5rem',
                                                color: '#dbeafe',
                                                transform: 'rotate(180deg)',
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            component="blockquote"
                                            sx={{ fontStyle: 'italic', color: 'grey.700', lineHeight: 1.6, zIndex: 1, position: 'relative' }}
                                        >
                                            {review.review}
                                        </Typography>
                                        <FormatQuote
                                            sx={{
                                                position: 'absolute',
                                                bottom: -16,
                                                right: -8,
                                                fontSize: '2.5rem',
                                                color: '#dbeafe',
                                            }}
                                        />
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


export default ReviewsTreatmentSecion;
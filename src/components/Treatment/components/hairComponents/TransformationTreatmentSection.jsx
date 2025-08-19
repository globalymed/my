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
    AutoAwesome,
    People
} from '@mui/icons-material'

// Data for the transformations section
const transformationsData = [
    {
        treatment: "FUE Hair Transplant",
        patient: "Michael R., USA",
        before: "https://placehold.co/400x300/dcfce7/166534?text=Before+FUE",
        after: "https://placehold.co/400x300/a7f3d0/059669?text=After+FUE",
        gradient: "linear-gradient(to right, #22c55e, #10b981)",
    },
    {
        treatment: "DHI Hair Transplant",
        patient: "Ahmed K., UAE",
        before: "https://placehold.co/400x300/dbeafe/1e3a8a?text=Before+DHI",
        after: "https://placehold.co/400x300/a5f3fc/0e7490?text=After+DHI",
        gradient: "linear-gradient(to right, #3b82f6, #06b6d4)",
    },
    {
        treatment: "Beard Transplant",
        patient: "James T., UK",
        before: "https://placehold.co/400x300/fecdd3/881337?text=Before+Beard",
        after: "https://placehold.co/400x300/a7f3d0/065f46?text=After+Beard",
        gradient: "linear-gradient(to right, #9333ea, #6366f1)",
    },
];

const TransformationTreatmentSection = () => {
    return (
        <Box
            component="section"
            sx={{
                py: 12,
                px: 4,
                background: 'linear-gradient(to bottom, #f9fafb, white)',
            }}
        >
            <Container maxWidth="xl">
                {/* Section Header */}
                <Box textAlign="center" mb={10}>
                    <Chip
                        icon={<AutoAwesome sx={{ color: '#db2777 !important' }} />}
                        label="Amazing Results"
                        sx={{
                            mb: 3,
                            color: '#c026d3',
                            borderColor: '#7e22ce',
                            borderRadius: 3,
                            px: 1,
                            fontWeight: 'medium',
                            background: 'linear-gradient(to right, #fce7f3, #f3e8ff)',
                        }}
                    />
                    <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2, fontSize: "3rem" }}>
                        Before & After
                        <br />
                        <Typography component="span" variant="inherit" sx={{
                            background: 'linear-gradient(to right, #ec4899, #9333ea)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Hair Transformations
                        </Typography>
                    </Typography>
                    <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 'lg', mx: 'auto' }}>
                        See the incredible hair restoration results our patients have achieved
                    </Typography>
                </Box>

                {/* Transformations Grid */}
                <Grid container spacing={4}>
                    {transformationsData.map((case_, index) => (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card
                                sx={{
                                    overflow: 'hidden',
                                    borderRadius: 1,
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.5s ease',
                                    transform: 'translateZ(0)',
                                    '&:hover': {
                                        transform: 'scale(1.05) translateZ(0)',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 0 }}>
                                    <Grid container>
                                        {/* Before Image */}
                                        <Grid item xs={6} sx={{ position: 'relative', overflow: 'hidden' }}>
                                            <CardMedia
                                                component="img"
                                                image={case_.before}
                                                alt="Before treatment"
                                                sx={{
                                                    height: 192,
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.5s ease',
                                                    '.MuiCard-root:hover &': {
                                                        transform: 'scale(1.1)',
                                                    },
                                                }}
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/cccccc/ffffff?text=Image+Error'; }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    left: 12,
                                                    bgcolor: '#ef4444',
                                                    color: 'white',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    boxShadow: 3,
                                                }}
                                            >
                                                BEFORE
                                            </Box>
                                        </Grid>
                                        {/* After Image */}
                                        <Grid item xs={6} sx={{ position: 'relative', overflow: 'hidden' }}>
                                            <CardMedia
                                                component="img"
                                                image={case_.after}
                                                alt="After treatment"
                                                sx={{
                                                    height: 192,
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.5s ease',
                                                    '.MuiCard-root:hover &': {
                                                        transform: 'scale(1.1)',
                                                    },
                                                }}
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/cccccc/ffffff?text=Image+Error'; }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    right: 12,
                                                    bgcolor: '#22c55e',
                                                    color: 'white',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    boxShadow: 3,
                                                }}
                                            >
                                                AFTER
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography
                                                variant="h6"
                                                component="h3"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    transition: 'color 0.3s ease',
                                                    '.MuiCard-root:hover &': {
                                                        color: '#3b82f6',
                                                    },
                                                }}
                                            >
                                                {case_.treatment}
                                            </Typography>
                                            <Chip
                                                label="Success"
                                                size="small"
                                                sx={{
                                                    background: case_.gradient,
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.75rem',
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'grey.600', display: 'flex', alignItems: 'center' }}
                                        >
                                            <People sx={{ height: 16, width: 16, mr: 1 }} />
                                            {case_.patient}
                                        </Typography>
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


export default TransformationTreatmentSection;

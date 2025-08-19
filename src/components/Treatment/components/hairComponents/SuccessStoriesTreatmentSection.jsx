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
    Favorite,
    FormatQuote,
    Public,
    Star,
    CheckCircle,
} from '@mui/icons-material';

// Data for the success stories section
const storiesData = [
    {
        name: "Robert Johnson",
        country: "Canada",
        procedure: "FUE Hair Transplant (3000 grafts)",
        beforeCost: "$18,000 (Canada)",
        afterCost: "$2,200 (India)",
        savings: "$15,800",
        quote:
            "I was amazed by the professionalism and results. My hairline looks completely natural and I saved a fortune. The entire experience exceeded my expectations.",
        initials: "RJ",
        gradient: "linear-gradient(to right, #22c55e, #10b981)",
    },
    {
        name: "Ahmed Al-Rashid",
        country: "UAE",
        procedure: "DHI Hair Transplant + Beard",
        beforeCost: "$12,000 (UAE)",
        afterCost: "$2,800 (India)",
        savings: "$9,200",
        quote:
            "The DHI technique gave me incredible density. The surgeon was highly skilled and the clinic facilities were world-class. Highly recommend India for hair transplant.",
        initials: "AA",
        gradient: "linear-gradient(to right, #3b82f6, #06b6d4)",
    },
    {
        name: "James Mitchell",
        country: "United Kingdom",
        procedure: "FUT Hair Transplant (4000 grafts)",
        beforeCost: "$15,000 (UK)",
        afterCost: "$1,800 (India)",
        savings: "$13,200",
        quote:
            "Best decision I ever made. The results are fantastic and the cost savings allowed me to take my family on vacation too. The care was exceptional.",
        initials: "JM",
        gradient: "linear-gradient(to right, #9333ea, #7c3aed)",
    },
    {
        name: "Carlos Rodriguez",
        country: "Spain",
        procedure: "Robotic Hair Transplant",
        beforeCost: "$20,000 (Spain)",
        afterCost: "$3,500 (India)",
        savings: "$16,500",
        quote:
            "The robotic precision was incredible. No scarring, natural results, and the technology was more advanced than what's available in Europe.",
        initials: "CR",
        gradient: "linear-gradient(to right, #f97316, #ef4444)",
    },
];

const SuccessStoriesTreatmentSection = () => {
    return (
        <Box component="section" sx={{ py: 12, px: 4, bgcolor: 'white' }}>
            <Container maxWidth="xl">
                {/* Section Header */}
                <Box textAlign="center" mb={10}>
                    <Chip
                        icon={<Favorite sx={{ color: '#16a34a !important' }} />}
                        label="Success Stories"
                        sx={{
                            mb: 3,
                            color: '#15803d',
                            borderColor: '#7e22ce',
                            borderRadius: 3,
                            px: 1,
                            fontWeight: 'medium',
                            background: 'linear-gradient(to right, #dcfce7, #dbeafe)',
                        }}
                    />
                    <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2, fontSize: "3rem" }}>
                        International Patient
                        <br />
                        <Typography component="span" variant="inherit" sx={{
                            background: 'linear-gradient(to right, #16a34a, #2563eb)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Success Stories
                        </Typography>
                    </Typography>
                    <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 'lg', mx: 'auto' }}>
                        Hear from patients who chose India for their hair restoration journey
                    </Typography>
                </Box>

                {/* Stories Grid */}
                <Grid container spacing={4}>
                    {storiesData.map((story, index) => (
                        <Grid item xs={12} lg={6} key={index}>
                            <Card
                                sx={{
                                    p: 4,
                                    transition: 'all 0.5s ease',
                                    border: '1px solid #f3f4f6',
                                    borderRadius: 1,
                                    background: 'linear-gradient(to bottom right, #f9fafb, white)',
                                    transform: 'translateZ(0)',
                                    '&:hover': {
                                        transform: 'scale(1.05) translateZ(0)',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: '0 !important' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4 }}>
                                        <Avatar
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                background: story.gradient,
                                                fontSize: '1.75rem',
                                                fontWeight: 'bold',
                                                borderRadius: 1,
                                                boxShadow: 6,
                                                transition: 'all 0.3s ease',
                                                '.MuiCard-root:hover &': {
                                                    boxShadow: 12,
                                                }
                                            }}
                                        >
                                            {story.initials}
                                        </Avatar>
                                        <Box flex={1}>
                                            <Typography
                                                variant="h6"
                                                component="h3"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    mb: 0.5,
                                                    transition: 'color 0.3s ease',
                                                    '.MuiCard-root:hover &': {
                                                        color: '#2563eb',
                                                    },
                                                }}
                                            >
                                                {story.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: 'grey.600', mb: 1, display: 'flex', alignItems: 'center' }}
                                            >
                                                <Public sx={{ height: 16, width: 16, mr: 1 }} />
                                                {story.country}
                                            </Typography>
                                            <Chip
                                                label={story.procedure}
                                                size="small"
                                                sx={{
                                                    background: story.gradient,
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.75rem',
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            bgcolor: 'rgba(240, 253, 244, 0.5)',
                                            p: 3,
                                            borderRadius: 3,
                                            mb: 3,
                                            border: '1px solid #f0fdf4',
                                        }}
                                    >
                                        <Grid container spacing={2} textAlign="center">
                                            <Grid item xs={12} md={4}>
                                                <Typography variant="caption" sx={{ color: 'grey.600', mb: 0.5, display: 'block' }}>
                                                    Home Country Cost
                                                </Typography>
                                                <Typography sx={{ fontWeight: 'bold', color: '#dc2626', fontSize: '1.125rem' }}>
                                                    {story.beforeCost}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Typography variant="caption" sx={{ color: 'grey.600', mb: 0.5, display: 'block' }}>
                                                    India Cost
                                                </Typography>
                                                <Typography sx={{ fontWeight: 'bold', color: '#16a34a', fontSize: '1.125rem' }}>
                                                    {story.afterCost}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Typography variant="caption" sx={{ color: 'grey.600', mb: 0.5, display: 'block' }}>
                                                    Total Savings
                                                </Typography>
                                                <Typography sx={{ fontWeight: 'bold', color: '#2563eb', fontSize: '1.125rem' }}>
                                                    {story.savings}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Box sx={{ position: 'relative', mb: 3 }}>
                                        <FormatQuote
                                            sx={{
                                                position: 'absolute',
                                                top: -16,
                                                left: -12,
                                                fontSize: '4rem',
                                                color: '#dbeafe',
                                                transform: 'rotate(180deg)',
                                            }}
                                        />
                                        <Typography
                                            variant="body1"
                                            component="blockquote"
                                            sx={{ fontStyle: 'italic', color: 'grey.700', lineHeight: 1.7, zIndex: 1, position: 'relative', px: 2 }}
                                        >
                                            {story.quote}
                                        </Typography>
                                        <FormatQuote
                                            sx={{
                                                position: 'absolute',
                                                bottom: -24,
                                                right: -12,
                                                fontSize: '4rem',
                                                color: '#dbeafe',
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #f3f4f6' }}>
                                        <Box sx={{ display: 'flex' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} sx={{ fontSize: 20, color: '#facc15' }} />
                                            ))}
                                        </Box>
                                        <Chip
                                            label="Verified Review"
                                            variant="outlined"
                                            size="small"
                                            icon={<CheckCircle sx={{ fontSize: 16, color: '#16a34a !important' }} />}
                                            sx={{ color: '#16a34a', borderColor: '#bbf7d0' }}
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

export default SuccessStoriesTreatmentSection;
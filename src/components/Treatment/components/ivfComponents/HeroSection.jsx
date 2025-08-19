import React from 'react'
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
} from '@mui/material';

import {
    SmartToyOutlined,
    AutoAwesome,
    FavoriteBorder,
    StarRate
} from "@mui/icons-material";


const TreatmentHeroSection = () => {

    const statsData = [
        {
            label: "Successful Pregnancies",
            value: "4,847+",
        },
        {
            label: "Patient Rating",
            value: "4.9",
            icon: <StarRate sx={{ color: '#FBBF24', fontSize: '1.75rem', ml: 0.5 }} />,
        },
        {
            label: "Cost Savings",
            value: "70%",
        },
    ];


    return (
        <Box sx={{ position: 'relative', bgcolor: '#F0F4FF', py: { xs: 8, md: 12 }, px: 2 }}>
            <Container maxWidth="xl"
                sx={{
                    px: { lg: 12, xs: 0 },
                }}
            >
                <Grid container spacing={8} alignItems="center">
                    {/* left */}
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Chip
                                icon={<AutoAwesome />}
                                label="AI-Powered Fertility Planning"
                                sx={{ bgcolor: 'white', color: '#be185d', mb: 3, borderRadius: 2, px: 2, py: 1, fontSize: "1rem" }}
                            />
                            <Typography variant="h2" component="h1" fontWeight="extrabold" gutterBottom sx={{
                                color: '#111827',
                                lineHeight: 1.2,
                                fontSize: {
                                    sm: "4.25rem",
                                    xs: "2rem"
                                },
                                textAlign: {
                                    sm: 'left',
                                    xs: 'center'
                                }
                            }}>
                                <Typography
                                    component="span"
                                    variant="inherit"
                                    sx={{
                                        background: 'linear-gradient(to right, #db2777, #7c3aed)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Advanced
                                </Typography>
                                <br />
                                <Typography
                                    component="span"
                                    variant="inherit"
                                    sx={{
                                        position: 'relative',
                                        pb: 1,
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            width: '100%',
                                            height: '4px',
                                            bottom: 0,
                                            left: 0,
                                            background: 'linear-gradient(to right, #4ade80, #3b82f6)',
                                            borderRadius: '9999px',
                                        },
                                    }}
                                >
                                    IVF & Fertility
                                    <br />
                                    Treatments
                                </Typography>
                            </Typography>
                            <Typography variant="h6" color="#be185d" sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
                                <SmartToyOutlined />
                                AI-Planned Fertility Journey
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '500px', mb: 4 }}>
                                From IVF to ICSI and donor programs — get personalized fertility treatments, world-class specialists, and complete support for your parenthood dreams.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<FavoriteBorder />}
                                    sx={{
                                        background: 'linear-gradient(to right, #db2777, #e11d48)',
                                        color: 'white',
                                        borderRadius: 1,
                                        borderColor: '#be185d',
                                        px: 4, py: 1.5,
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            borderColor: '#be123c'
                                        }
                                    }}
                                >
                                    Get Free Fertility Assessment
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<SmartToyOutlined />}
                                    sx={{
                                        color: '#be185d',
                                        borderRadius: 1,
                                        borderColor: '#be185d',
                                        px: 4, py: 1.5,
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            color: '#be185d',
                                            borderColor: '#fbcfe8',
                                            background: '#fdf2f8',
                                        }
                                    }}
                                >
                                    Ask Fertility AI
                                </Button>
                            </Box>

                            {/* Trust Indicators  */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: { xs: 3, md: 4 },
                                    pt: 4,
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                }}
                            >
                                {statsData.map((stat, index) => (
                                    <Box key={index} sx={{ textAlign: 'center' }}>
                                        <Typography
                                            variant="h3"
                                            component="div"
                                            fontWeight="bold"
                                            color="text.primary"
                                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            {stat.value}
                                            {stat.icon && stat.icon}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Grid>

                    {/* right */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                position: 'relative',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '24px',
                                p: { xs: 2, md: 4 },
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: 24,
                            }}
                        >
                            <CardMedia
                                component="img"
                                src="https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=800&width=1200"
                                alt="Happy patient after dental treatment"
                                sx={{
                                    borderRadius: '16px',
                                    boxShadow: 20,
                                    width: '100%',
                                    height: 'auto',
                                }}
                            />

                            {/* Floating element: Top-Left */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: { xs: -12, md: -16 },
                                    left: { xs: -12, md: -16 },
                                    bgcolor: 'background.paper',
                                    borderRadius: '16px',
                                    p: 2,
                                    boxShadow: 20,
                                    border: '1px solid #f3f4f6',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            bgcolor: '#be185d',
                                            borderRadius: '50%',
                                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                        }}
                                    />
                                    <Typography variant="body2" fontWeight="medium" color="text.secondary">
                                        Expert Fertility Specialists
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Floating element: Bottom-Right */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: { xs: -12, md: -16 },
                                    right: { xs: -12, md: -16 },
                                    color: 'white',
                                    borderRadius: '16px',
                                    p: 2,
                                    boxShadow: 20,
                                   background: 'linear-gradient(to right, #be185d, #e11d48)',
                                }}
                            >
                                <Typography variant="body2" fontWeight="medium">
                                    Save 70%
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    vs Home Country
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default TreatmentHeroSection;
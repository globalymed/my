import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Chip,
    Paper,
    Button,
    Stack
} from '@mui/material';
import {
    Public as GlobeIcon,
    EmojiEvents as Award,
    AttachMoney as DollarSign,
    Security as Shield,
    AccessTime as Clock,
    Flight as Plane,
    SmartToyOutlined as BotIcon,
} from '@mui/icons-material';

// Data for the benefits list, now with MUI icons
const benefits = [
    {
        Icon: Award,
        title: "World-Class Hair Surgeons",
        description: "ISHRS certified surgeons with international training and expertise",
        iconGradient: "linear-gradient(to right, #22c55e, #10b981)",
        bgColor: "#f0fdf4",
    },
    {
        Icon: DollarSign,
        title: "75% Cheaper Than US/Europe",
        description: "Premium quality at fraction of international costs",
        iconGradient: "linear-gradient(to right, #3b82f6, #06b6d4)",
        bgColor: "#eff6ff",
    },
    {
        Icon: Shield,
        title: "Advanced Technology",
        description: "Latest FUE, DHI, and robotic hair transplant systems",
        iconGradient: "linear-gradient(to right, #8b5cf6, #6366f1)",
        bgColor: "#f5f3ff",
    },
    {
        Icon: Clock,
        title: "Quick Scheduling",
        description: "No waiting lists - immediate consultation and treatment",
        iconGradient: "linear-gradient(to right, #f97316, #ef4444)",
        bgColor: "#fff7ed",
    },
    {
        Icon: Plane,
        title: "Medical Tourism Packages",
        description: "Complete packages including treatment, stay, and sightseeing",
        iconGradient: "linear-gradient(to right, #ec4899, #f43f5e)",
        bgColor: "#fdf2f8",
    },
];

// Data for the cost comparison items
const costItems = [
    { procedure: "FUE Hair Transplant", india: "$800-$2,000", abroad: "$4,000-$15,000", savings: "80%" },
    { procedure: "FUT Hair Transplant", india: "$600-$1,500", abroad: "$3,000-$12,000", savings: "83%" },
    { procedure: "DHI Hair Transplant", india: "$1,200-$2,500", abroad: "$6,000-$20,000", savings: "79%" },
    { procedure: "Beard Transplant", india: "$500-$1,200", abroad: "$2,500-$8,000", savings: "78%" },
];


const GlobalTreatmentSection = () => {
    return (
        <Box component="section" sx={{ py: { xs: 8, md: 12 }, px: 2, position: 'relative', overflow: 'hidden' }}>
            {/* Background Pattern */}
            <Box sx={{
                position: 'absolute',
                inset: 0,
                opacity: 0.05,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { lg: 12, xs: 0 }, }}>
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
                    <Chip
                        icon={<GlobeIcon />}
                        label="Global Hair Restoration Hub"
                        sx={{
                            mb: 3,
                            color: '#15803d',
                            borderRadius: 3,
                            px: 1,
                            fontWeight: 'medium',
                            background: 'linear-gradient(to right, #dcfce7, #e0f2fe)',
                        }}
                    />
                    <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2, fontSize: "3rem" }}>
                        Why Choose
                        <br />
                        <Typography component="span" variant="inherit" sx={{
                            background: 'linear-gradient(to right, #16a34a, #2563eb)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            India for Hair Transplant?
                        </Typography>
                    </Typography>
                    <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 'md', mx: 'auto' }}>
                        World-renowned surgeons and cutting-edge technology at unbeatable prices
                    </Typography>
                </Box>

                <Grid container spacing={{ xs: 8, lg: 10 }} alignItems="center">
                    {/* Left Column: Benefits List */}
                    <Grid item xs={12} lg={6}>
                        <Stack spacing={5}>
                            {benefits.map((benefit, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, '&:hover .benefit-title': { color: 'primary.main' } }}>
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: benefit.bgColor,
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            boxShadow: 6,
                                        }
                                    }}>
                                        <benefit.Icon sx={{
                                            fontSize: '2.5rem',
                                            display: 'block',
                                            background: benefit.iconGradient,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" className="benefit-title" sx={{ mb: 1, transition: 'color 0.3s ease' }}>
                                            {benefit.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {benefit.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Right Column: Cost Comparison Card */}
                    <Grid item xs={12} lg={6}>
                        <Box sx={{ position: 'relative' }}>
                            <Box sx={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to bottom right, rgba(96, 165, 250, 0.2), rgba(168, 85, 247, 0.2))',
                                borderRadius: 1,
                                filter: 'blur(40px)',
                                transform: 'rotate(-6deg)',
                            }} />
                            <Paper elevation={8} sx={{ position: 'relative', borderRadius: 2, p: { xs: 2, md: 4 }, border: '1px solid #e5e7eb' }}>
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Typography variant="h4" component="h3" fontWeight="bold">
                                        <Typography component="span" variant="inherit" sx={{
                                            background: 'linear-gradient(to right, #2563eb, #8b5cf6)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}>
                                            Cost Comparison
                                        </Typography>
                                    </Typography>
                                    <Typography color="text.secondary">See how much you can save</Typography>
                                </Box>
                                <Stack spacing={2}>
                                    {costItems.map((item, index) => (
                                        <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(to right, #f9fafb, #eff6ff)' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                <Typography fontWeight="bold">{item.procedure}</Typography>
                                                <Chip label={`Save ${item.savings}`} sx={{ color: 'white', background: 'linear-gradient(to right, #22c55e, #10b981)' }} />
                                            </Box>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">India:</Typography>
                                                    <Typography fontWeight="bold" color="success.main" variant="h6">{item.india}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">US/UK:</Typography>
                                                    <Typography fontWeight="bold" color="error.main" variant="h6">{item.abroad}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    ))}
                                </Stack>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<BotIcon />}
                                    sx={{
                                        mt: 3,
                                        py: 1.5,
                                        borderRadius: 1,
                                        fontSize: '1rem',
                                        background: 'linear-gradient(to right, #2563eb, #8b5cf6)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.03)',
                                            boxShadow: 4,
                                        }
                                    }}
                                >
                                    Get AI Hair Analysis
                                </Button>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default GlobalTreatmentSection;
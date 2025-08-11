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
    MenuBook,
    AccessTime,
    TrendingUp,
} from '@mui/icons-material';

// Data for the blog section
const blogData = [
    {
        title: "Complete Guide to Dental Implants in India 2025",
        excerpt: "Everything you need to know about dental implant procedures, costs, and recovery in India's top clinics.",
        date: "January 15, 2025",
        readTime: "8 min read",
        image: "https://placehold.co/300x200/dbeafe/1e40af?text=Implants+Guide",
        category: "Dental Implants",
        gradient: "linear-gradient(to right, #3b82f6, #06b6d4)",
    },
    {
        title: "Smile Design: Transform Your Smile in One Trip",
        excerpt: "Discover how modern smile design techniques can give you the perfect smile during a single visit to India.",
        date: "January 12, 2025",
        readTime: "6 min read",
        image: "https://placehold.co/300x200/fce7f3/9d174d?text=Smile+Design",
        category: "Cosmetic Dentistry",
        gradient: "linear-gradient(to right, #ec4899, #f43f5e)",
    },
    {
        title: "Root Canal vs Dental Implant: Which is Right for You?",
        excerpt: "Expert comparison of treatment options for damaged teeth, including costs and long-term outcomes.",
        date: "January 10, 2025",
        readTime: "5 min read",
        image: "https://placehold.co/300x200/dcfce7/15803d?text=Comparison",
        category: "Treatment Options",
        gradient: "linear-gradient(to right, #22c55e, #10b981)",
    },
    {
        title: "Orthodontics for Adults: It's Never Too Late",
        excerpt: "Modern orthodontic solutions for adults, including Invisalign and ceramic braces available in India.",
        date: "January 8, 2025",
        readTime: "7 min read",
        image: "https://placehold.co/300x200/e9d5ff/5b21b6?text=Adult+Ortho",
        category: "Orthodontics",
        gradient: "linear-gradient(to right, #9333ea, #7c3aed)",
    },
    {
        title: "Dental Tourism Safety: What to Look For",
        excerpt: "Essential safety guidelines and accreditation standards when choosing dental treatment abroad.",
        date: "January 5, 2025",
        readTime: "9 min read",
        image: "https://placehold.co/300x200/ffedd5/c2410c?text=Safety+Guide",
        category: "Medical Tourism",
        gradient: "linear-gradient(to right, #f97316, #ef4444)",
    },
    {
        title: "Post-Treatment Care: Maintaining Your New Smile",
        excerpt: "Comprehensive aftercare guide for dental procedures and maintaining long-term oral health.",
        date: "January 3, 2025",
        readTime: "6 min read",
        image: "https://placehold.co/300x200/ccfbf1/0d9488?text=Aftercare",
        category: "Aftercare",
        gradient: "linear-gradient(to right, #14b8a6, #3b82f6)",
    },
];

const LatestBlogTreatmentSection = () => {
    return (
        <Box component="section" sx={{ py: 12, px: 4, background: 'linear-gradient(to bottom, #f9fafb, white)' }}>
            <Container maxWidth="xl">
                {/* Section Header */}
                <Box textAlign="center" mb={10}>

                    <Chip
                        icon={<MenuBook sx={{ color: '#16a34a !important' }} />}
                        label="Expert Insights"
                        sx={{
                            mb: 3,
                            color: '#15803d',
                            borderRadius: 3,
                            px: 1,
                            fontWeight: 'medium',
                            background: 'linear-gradient(to right, #dcfce7, #dbeafe)',
                        }}
                    />

                    <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2, fontSize: "3rem" }}>
                        Latest Dental
                        <br />
                        <Typography component="span" variant="inherit" sx={{
                            background: 'linear-gradient(to right, #16a34a, #2563eb)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Health Insights
                        </Typography>
                    </Typography>
                    <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 'lg', mx: 'auto' }}>
                        Stay informed with expert advice and the latest treatment updates
                    </Typography>
                </Box>

                {/* Blog Grid */}
                <Grid container spacing={4}>
                    {blogData.map((article, index) => (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card
                                sx={{
                                    overflow: 'hidden',
                                    borderRadius: 1,
                                    border: '1px solid #e5e7eb',
                                    bgcolor: 'white',
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'all 0.5s ease',
                                    transform: 'translateZ(0)',
                                    '&:hover': {
                                        transform: 'scale(1.05) translateZ(0)',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    },
                                }}
                            >
                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: article.gradient,
                                            opacity: 0.1,
                                            transition: 'opacity 0.3s ease',
                                            '.MuiCard-root:hover &': {
                                                opacity: 0.2,
                                            },
                                        }}
                                    />
                                    <CardMedia
                                        component="img"
                                        image={article.image}
                                        alt={article.title}
                                        sx={{
                                            height: 192,
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease',
                                            '.MuiCard-root:hover &': {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/cccccc/ffffff?text=Image+Error'; }}
                                    />
                                    <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                                        <Chip
                                            label={article.category}
                                            size="small"
                                            sx={{
                                                background: article.gradient,
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: '0.75rem',
                                                boxShadow: 3,
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <Typography
                                        component="h3"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 1.5,
                                            lineHeight: 1.3,
                                            fontSize: '1.125rem',
                                            transition: 'color 0.3s ease',
                                            '.MuiCard-root:hover &': {
                                                color: '#2563eb',
                                            },
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            minHeight: '48px', // Approx 2 lines
                                        }}
                                    >
                                        {article.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'grey.600',
                                            mb: 2,
                                            lineHeight: 1.6,
                                            flexGrow: 1,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {article.excerpt}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'grey.500', fontSize: '0.75rem', mt: 'auto', pt: 2, borderTop: '1px solid #f3f4f6' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AccessTime sx={{ height: 14, width: 14, mr: 0.5 }} />
                                            <span>{article.date}</span>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <TrendingUp sx={{ height: 14, width: 14, mr: 0.5 }} />
                                            <span>{article.readTime}</span>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box textAlign="center" mt={8}>
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<MenuBook />}
                        sx={{
                            borderColor: '#bfdbfe',
                            color: '#1d4ed8',
                            bgcolor: 'white',
                            px: 4,
                            py: 1.5,
                            borderRadius: 1,
                            boxShadow: 'lg',
                            borderWidth: 2,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: '#eff6ff',
                                borderColor: '#93c5fd',
                                borderWidth: 2,
                                transform: 'scale(1.05)',
                                boxShadow: 'xl',
                            },
                        }}
                    >
                        View All Articles
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default LatestBlogTreatmentSection;
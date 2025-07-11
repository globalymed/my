import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Stack,
    Chip,
    Divider,
    IconButton
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { keyframes } from '@emotion/react';

const stats = [
    { value: '10,000+', label: 'Patients Served' },
    { value: '4.9/5', label: 'Satisfaction Rating' },
    { value: '30+', label: 'Cities Covered' },
    { value: '500+', label: 'Verified Doctors' },
];

const reviewImages = [
    '/reviews_post/1.png',
    '/reviews_post/2.png',
    '/reviews_post/3.png',
    '/reviews_post/4.png',
    '/reviews_post/5.png',
];

const testimonials = [
    {
        name: 'Priya Sharma',
        initial: 'M',
        color: '#D32F2F',
        text: `"MedYatra's AI matched me with the perfect cardiologist. The booking process was seamless and I got an appointment the same day!"`,
    },
    {
        name: 'Rajesh Kumar',
        initial: 'S',
        color: '#512DA8',
        text: `"Amazing platform! The AI understood my symptoms perfectly and recommended exactly the right specialist. Highly recommended."`,
    },
    {
        name: 'Dr. Meera Patel',
        initial: 'R',
        color: '#F57C00',
        text: `"As a doctor, I'm impressed by how accurately MedYatra's AI matches patients with the right specialists. It's revolutionizing healthcare access."`,
    },
];

const partners = ['Apollo', 'Fortis', 'Max', 'Manipal', 'Narayana', 'AIIMS'];

const IMAGES_PER_VIEW = {
    xs: 1,
    sm: 2,
    md: 3,
};

const IMAGE_HEIGHTS = { xs: 400, sm: 500, md: 600 };

function useResponsiveImagesPerView() {
    const [imagesPerView, setImagesPerView] = useState(3);
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 600) setImagesPerView(IMAGES_PER_VIEW.xs);
            else if (window.innerWidth < 900) setImagesPerView(IMAGES_PER_VIEW.sm);
            else setImagesPerView(IMAGES_PER_VIEW.md);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return imagesPerView;
}

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const TestimonialsSection = () => {
    const [animatedStats, setAnimatedStats] = useState(false);
    const imagesPerView = useResponsiveImagesPerView();
    useEffect(() => {
        const timer = setTimeout(() => setAnimatedStats(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // Duplicate images for seamless looping
    const allImages = [...reviewImages, ...reviewImages];
    // Responsive height
    const getCarouselHeight = () => {
        if (window.innerWidth < 600) return IMAGE_HEIGHTS.xs;
        if (window.innerWidth < 900) return IMAGE_HEIGHTS.sm;
        return IMAGE_HEIGHTS.md;
    };
    const [carouselHeight, setCarouselHeight] = useState(getCarouselHeight());
    useEffect(() => {
        function handleResize() {
            setCarouselHeight(getCarouselHeight());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Box sx={{ 
            backgroundColor: { xs: '#2b938c', md: '#52C7BE' }, // CHANGED: Mobile background color
            color: 'white', 
            py: 10,
            backgroundImage: { 
                xs: 'none', // CHANGED: Remove image on mobile
                md: "url('/testimonial background.png')" 
            },
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
        }}>
            <Box maxWidth="lg" mx="auto" px={2}>
                {/* Stats with Animation */}
                <Grid container spacing={4} justifyContent="center" mb={6}>
                    {stats.map((item, i) => (
                        <Grid item xs={6} sm={3} key={i} textAlign="center">
                            <Typography 
                                variant="h2" 
                                fontWeight={900}
                                sx={{
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    opacity: animatedStats ? 1 : 0,
                                    transform: animatedStats ? 'translateY(0)' : 'translateY(20px)',
                                    transition: `all 0.6s ease ${i * 0.2}s`,
                                    color: 'white',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                }}
                            >
                                {item.value}
                            </Typography>
                            <Typography 
                                variant="h6" 
                                sx={{
                                    opacity: animatedStats ? 1 : 0,
                                    transform: animatedStats ? 'translateY(0)' : 'translateY(20px)',
                                    transition: `all 0.6s ease ${i * 0.2 + 0.3}s`,
                                    fontWeight: 600,
                                    color: 'white',
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                {/* Main Headline */}
                <Typography
                    variant="h1"
                    align="center"
                    fontWeight={900}
                    sx={{ 
                        mb: 2,
                        fontSize: { xs: '2.5rem', md: '4rem' },
                        textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                        lineHeight: 1.2,
                    }}
                >
                    Globally Trusted by Thousands of Patients
                </Typography>
                
                {/* Google Review Banner */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Box
                        component="img"
                        src="/google review.png"
                        alt="Google Review"
                        sx={{
                            height: { 
                                xs: '500px',
                                md: '200px'
                            },
                            width: 'auto',
                            maxWidth: '100%',
                            objectFit: 'contain',
                        }}
                    />
                    <Typography variant="body1" sx={{ opacity: 0.9, mt: 2 }}>
                        
                    </Typography>
                </Box>

                {/* Review Carousel */}
                <Box sx={{ position: 'relative', maxWidth: '100%', mx: 'auto', mb: 8 }}>
                    <Box
                        sx={{
                            position: 'relative',
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: 6,
                            width: '100%',
                            height: `${carouselHeight}px`,
                            maxHeight: '80vh',
                        }}
                    >
                        {/* Marquee Row */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                height: '100%',
                                animation: `${marquee} 15s linear infinite`,
                            }}
                        >
                            {allImages.map((image, idx) => (
                                <Box
                                    key={idx}
                                    component="img"
                                    src={image}
                                    alt={`Review ${idx + 1}`}
                                    sx={{
                                        height: '100%',
                                        width: 'auto',
                                        maxWidth: '100%',
                                        borderRadius: 2,
                                        // REMOVED: boxShadow and background properties
                                    }}
                                />
                            ))}
                        </Box>
                        {/* Edge Fade Overlays */}
                        <Box
                            sx={{
                                pointerEvents: 'none',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                        
                        </Box>
                    </Box>
                </Box>

                {/* REMOVED: Trusted Healthcare Partners section */}
            </Box>
        </Box>
    );
};

export default TestimonialsSection;
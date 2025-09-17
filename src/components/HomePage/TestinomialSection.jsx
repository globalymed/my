import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
} from '@mui/material';
import { keyframes } from '@emotion/react';

const stats = [
    { value: '10,000+', label: 'Patients Served' },
    { value: '4.9/5', label: 'Satisfaction Rating' },
    { value: '30+', label: 'Cities Covered' },
    { value: '500+', label: 'Verified Doctors' },
];

const reviewImages = [

    '/reviews_post/1.webp',
    '/reviews_post/2.webp',
    '/reviews_post/3.webp',
    '/reviews_post/4.webp',
    '/reviews_post/5.webp',
];

const IMAGES_PER_VIEW = { xs: 1, sm: 2, md: 3 };
const IMAGE_HEIGHTS = { xs: 200, sm: 250, md: 300 }; // Reduced

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
        const timer = setTimeout(() => setAnimatedStats(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const allImages = [...reviewImages, ...reviewImages];

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
            backgroundColor: { xs: '#2b938c', md: '#52C7BE' },
            color: 'white',
            py: 5, // reduced
            backgroundImage: {
                xs: 'none',
                md: "url('/testimonial background.webp')"
            },
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
        }}>
            <Box maxWidth="lg" mx="auto" px={2}>

                {/* Stats */}
                <Grid container spacing={2} justifyContent="center" mb={4}>
                    {stats.map((item, i) => (
                        <Grid item xs={6} sm={3} key={i} textAlign="center">
                            <Typography
                                variant="h4"
                                fontWeight={900}
                                sx={{
                                    fontSize: { xs: '1.8rem', md: '2.5rem' },
                                    opacity: animatedStats ? 1 : 0,
                                    transform: animatedStats ? 'translateY(0)' : 'translateY(20px)',
                                    transition: `all 0.6s ease ${i * 0.2}s`,
                                    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                                }}
                            >
                                {item.value}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    opacity: animatedStats ? 1 : 0,
                                    transform: animatedStats ? 'translateY(0)' : 'translateY(20px)',
                                    transition: `all 0.6s ease ${i * 0.2 + 0.3}s`,
                                    fontWeight: 600,
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                {/* Headline */}
                <Typography
                    variant="h3"
                    align="center"
                    fontWeight={900}
                    sx={{
                        mb: 2,
                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        lineHeight: 1.2,
                    }}
                >
                    Globally Trusted by Thousands of Patients
                </Typography>

                {/* Google Review Banner */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box
                        component="img"
                        srcSet="/google review-300w.webp 300w, /google review-600w.webp 600w, /google review-900w.webp 900w"
                        sizes="(max-width: 600px) 267px, (max-width: 960px) 400px, 534px"
                        src="/google review-300w.webp"
                        alt="Google Review"
                        loading="lazy"
                        decoding="async"
                        width={534}
                        height={300}
                        sx={{
                            height: { xs: '150px', md: '120px' },
                            width: 'auto',
                            maxWidth: '100%',
                            objectFit: 'contain',
                        }}
                    />
                </Box>

                {/* Carousel */}
                <Box sx={{ position: 'relative', maxWidth: '100%', mx: 'auto', mb: 4 }}>
                    <Box
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 4,
                            height: `${carouselHeight}px`,
                            maxHeight: '300px',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                height: '100%',
                                animation: `${marquee} 15s linear infinite`,
                                '&:hover': { animationPlayState: 'paused' }, // pause on hover
                            }}
                        >
                            {allImages.map((image, idx) => (
                                <Box
                                    key={idx}
                                    component="img"
                                    src={image}
                                    loading="lazy"
                                    decoding="async"
                                    width={300}
                                    height={375}
                                    alt={`Review ${idx + 1}`}
                                    sx={{
                                        height: '100%',
                                        width: 'auto',
                                        borderRadius: 1,
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Box>
    );
};

export default TestimonialsSection;

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

const reviewImages = [
    '/treatmentExperience/1.png',
    '/treatmentExperience/2.png',
    '/treatmentExperience/3.png',
    '/treatmentExperience/4.png',
];

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

const TreatmentExperience = () => {
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
            backgroundColor: { xs: '#2b938c', md: '#111' },
            backgroundImage: { xs: 'none', md: 'url(/treatmentExperience/background.png)' },
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            color: 'white',
            py: 4,
        }}>
            {/* Main Headline */}
            <Typography 
                maxWidth="md"
                variant="h1"
                align="center"
                fontWeight={900}
                mx="auto"
                sx={{
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                    lineHeight: 1.2,
                }}
            >
                Ensuring Best Treatment Experience
            </Typography>

            <Box maxWidth="lg" mx="auto" px={2}>
                {/* Review Carousel */}
                <Box sx={{ position: 'relative', maxWidth: '100%', mx: 'auto' }}>
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
            </Box>
        </Box>
    );
};

export default TreatmentExperience;
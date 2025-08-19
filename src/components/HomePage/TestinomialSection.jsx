import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Grid,
    IconButton
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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

const IMAGE_HEIGHTS = { xs: 400, sm: 500, md: 600 };

const TestimonialsSection = () => {
    const [animatedStats, setAnimatedStats] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState(1); // 1 = right-to-left, -1 = left-to-right
    const [carouselHeight, setCarouselHeight] = useState(IMAGE_HEIGHTS.md);
    const positionRef = useRef(0);
    const carouselRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef(null);
    const lastTimeRef = useRef(0);
    const speedRef = useRef(50); // SLOW speed for smoothness

    // Triple images for seamless infinite loop
    const allImages = [...reviewImages, ...reviewImages, ...reviewImages];

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedStats(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // Responsive height
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 600) setCarouselHeight(IMAGE_HEIGHTS.xs);
            else if (window.innerWidth < 900) setCarouselHeight(IMAGE_HEIGHTS.sm);
            else setCarouselHeight(IMAGE_HEIGHTS.md);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Animation loop with requestAnimationFrame
    useEffect(() => {
        let running = true;
        function animate(time) {
            if (!lastTimeRef.current) lastTimeRef.current = time;
            const deltaTime = time - lastTimeRef.current;
            lastTimeRef.current = time;

            if (!isPaused && carouselRef.current && containerRef.current && running) {
                const carouselWidth = carouselRef.current.scrollWidth;
                const singleSetWidth = carouselWidth / 3; // Since we tripled the images

                positionRef.current += direction * speedRef.current * deltaTime / 1000;

                // Loop logic for both directions
                if (positionRef.current <= -singleSetWidth) {
                    positionRef.current += singleSetWidth;
                } else if (positionRef.current >= 0) {
                    positionRef.current -= singleSetWidth;
                }

                // Apply transform directly for smoothness
                carouselRef.current.style.transform = `translateX(${positionRef.current}px)`;
            }
            animationRef.current = requestAnimationFrame(animate);
        }
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            running = false;
            cancelAnimationFrame(animationRef.current);
            lastTimeRef.current = 0;
        };
    }, [direction, isPaused]);

    // Direction control handlers
    const handleLeftClick = () => setDirection(-1);
    const handleRightClick = () => setDirection(1);

    return (
        <Box sx={{
            backgroundColor: { xs: '#2b938c', md: '#52C7BE' },
            color: 'white',
            py: 10,
            backgroundImage: {
                xs: 'none',
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
                </Box>

                {/* Review Carousel with Controls */}
                <Box sx={{ position: 'relative', maxWidth: '100%', mx: 'auto', mb: 8 }}>
                    <Box
                        ref={containerRef}
                        sx={{
                            position: 'relative',
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: 6,
                            width: '100%',
                            height: `${carouselHeight}px`,
                            maxHeight: '80vh',
                        }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* JS-controlled Carousel */}
                        <Box
                            ref={carouselRef}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                height: '100%',
                                width: 'max-content',
                                willChange: 'transform',
                            }}
                        >
                            {allImages.map((image, idx) => (
                                <Box
                                    key={idx}
                                    component="img"
                                    src={image}
                                    alt={`Review ${(idx % reviewImages.length) + 1}`}
                                    sx={{
                                        height: '90%',
                                        width: 'auto',
                                        minWidth: '300px',
                                        borderRadius: 2,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        }
                                    }}
                                />
                            ))}
                        </Box>

                        {/* Left Control Button */}
                        <IconButton
                            onClick={handleLeftClick}
                            sx={{
                                position: 'absolute',
                                left: 15,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                color: '#52C7BE',
                                zIndex: 3,
                                width: 56,
                                height: 56,
                                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                                border: direction === -1 ? '3px solid #52C7BE' : '2px solid rgba(82, 199, 190, 0.3)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                    transform: 'translateY(-50%) scale(1.1)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <ChevronLeftIcon sx={{ fontSize: 32 }} />
                        </IconButton>

                        {/* Right Control Button */}
                        <IconButton
                            onClick={handleRightClick}
                            sx={{
                                position: 'absolute',
                                right: 15,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                color: '#52C7BE',
                                zIndex: 3,
                                width: 56,
                                height: 56,
                                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                                border: direction === 1 ? '3px solid #52C7BE' : '2px solid rgba(82, 199, 190, 0.3)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                    transform: 'translateY(-50%) scale(1.1)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <ChevronRightIcon sx={{ fontSize: 32 }} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TestimonialsSection;
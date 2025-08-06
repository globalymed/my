import React from 'react';
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
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/splide/dist/css/splide.min.css";

// Define the style for the images in the carousel
const imageStyle = {
    width: '447px',
    height: '664px',
    borderRadius: '20px',
    border: '1px solid #FFFFFF33',
};

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

const TestimonialsSection = () => {
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
                {/* Stats */}
                <Grid container spacing={4} justifyContent="center" mb={6}>
                    {stats.map((item, i) => (
                        <Grid item xs={6} sm={3} key={i} textAlign="center">
                            <Typography 
                                variant="h2" 
                                fontWeight={900}
                                sx={{
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    color: 'white',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                }}
                            >
                                {item.value}
                            </Typography>
                            <Typography 
                                variant="h6" 
                                sx={{
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

                {/* Review Carousel using Splide */}
                <Box sx={{ position: 'relative', maxWidth: '100%', mx: 'auto', mb: 8 }}>
                    <Box
                        sx={{
                            position: 'relative',
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: 6,
                            width: '100%',
                            maxHeight: '80vh',
                        }}
                    >
                        <Splide
                            options={{
                                type: "loop",
                                autoScroll: {
                                    pauseOnHover: false,
                                    pauseOnFocus: false,
                                    rewind: true,
                                    speed: 1
                                },
                                arrows: false,
                                pagination: false,
                                fixedWidth: '445px',
                                gap: '12px',
                            }}
                            extensions={{ AutoScroll }}
                        >
                            <SplideSlide>
                                <img src={reviewImages[0]} alt="Review 1" style={imageStyle} />
                            </SplideSlide>
                            <SplideSlide>
                                <img src={reviewImages[1]} alt="Review 2" style={imageStyle} />
                            </SplideSlide>
                            <SplideSlide>
                                <img src={reviewImages[2]} alt="Review 3" style={imageStyle} />
                            </SplideSlide>
                            <SplideSlide>
                                <img src={reviewImages[3]} alt="Review 4" style={imageStyle} />
                            </SplideSlide>
                            <SplideSlide>
                                <img src={reviewImages[4]} alt="Review 5" style={imageStyle} />
                            </SplideSlide>
                        </Splide>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TestimonialsSection;
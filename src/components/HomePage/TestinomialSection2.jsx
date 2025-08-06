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

const reviewImages = [
    '/reviews_post/1.png',
    '/reviews_post/2.png',
    '/reviews_post/3.png',
    '/reviews_post/4.png',
    '/reviews_post/5.png',
];

function TestimonialsSection() {
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
                {/* Review Carousel using Splide */}
                <Box sx={{ position: 'relative', maxWidth: '100%', mx: 'auto' }}>
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
}

export default TestimonialsSection;
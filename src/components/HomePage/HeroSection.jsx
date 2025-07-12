import { Box, Button, Typography, Stack, Grid, Chip, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {
    PeopleAlt,
    Star,
    Verified,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ConsultationForm from './ConsultationForm.jsx';

const HeroSection = () => {
    const navigate = useNavigate();

    const chipData = [
        { label: '10000+ patients served', icon: <PeopleAlt fontSize="small" /> },
        { label: '4.9 ⭐ average rating', icon: <Star fontSize="small" /> },
        { label: 'Trusted by Hospitals', icon: <Verified fontSize="small" /> }
    ];

    return (
        <Box sx={{
            px: { xs: 2, md: 8 },
            py: 4,
            background: 'linear-gradient(to bottom right, #ffffff, #fde2e4, #e0c3fc)',
        }}>
            <Box maxWidth="lg" alignContent={"center"} mx="auto"
                sx={{
                    // px: { xs: 2, md: 8 },
                    pb: 6,
                    // backgroundColor: '#fff',
                    borderRadius: 2,
                }}
            >
                <Grid container spacing={4} alignItems="center">
                    {/* LEFT SIDE */}
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h3"
                            component="h1"
                            color='#000000'
                            sx={{
                                fontWeight: 700, fontSize: { xs: '2rem', md: '3rem' }, textAlign: {
                                    xs: 'center', md: 'left'
                                }
                            }}
                        >
                            World-Class Medical
                        </Typography>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '3rem' }, color: "#333333", textAlign: {
                                    xs: 'center', md: 'left'
                                }
                            }}
                        >
                            Care Made Simple
                            & Affordable.
                        </Typography>

                        <Typography sx={{
                            mb: 3, color: 'text.secondary', maxWidth: 450, textAlign: {
                                xs: 'center', md: 'left'
                            },
                            mx: {
                                xs: 'auto', md: 0
                            },
                        }}>
                            From diagnosis to travel – our AI assistant ensures effortless treatment planning in India's top hospitals.
                        </Typography>

                        {/* CTA Buttons */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            mb={3}
                            sx={{
                                alignItems: 'center',
                                justifyContent: { xs: 'center', sm: 'flex-start' },
                                mx: { xs: 'auto', md: 0 }, // center Stack on mobile
                                width: { xs: '100%', sm: 'auto' }, // full width on mobile
                            }}
                        >
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate('/chat')}
                                sx={{
                                    backgroundColor: '#1D4645',
                                    color: 'white',
                                    textTransform: 'none',
                                    borderColor: '#E0E0E0',
                                    '&:hover': {
                                        backgroundColor: '#333',
                                        borderColor: '#E0E0E0',
                                    },
                                    maxWidth: { xs: '300px', sm: 'none' },
                                }}
                            >
                                Chat With AI Agent
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    backgroundColor: '#FFFFFF',
                                    color: '#1D4645',
                                    textTransform: 'none',
                                    borderColor: '#1D4645',
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                        borderColor: '#1D4645',
                                    },
                                    maxWidth: { xs: '300px', sm: 'none' },
                                }}
                            >
                                Compare Treatment Cost
                            </Button>
                        </Stack>


                        {/* Trust badges */}
                        <Stack
                            direction="row"
                            gap={2}
                            flexWrap="wrap"
                            mb={3}
                            sx={{
                                alignContent: 'center',
                                justifyContent: { xs: 'center', md: 'flex-start' }, // center on mobile
                            }}
                        >
                            {chipData.map((item) => (
                                <Chip
                                    key={item.label}
                                    icon={item.icon}
                                    label={item.label}
                                    variant="outlined"
                                    sx={{
                                        backgroundColor: '#F5F5F5',
                                        color: '#333333',
                                        borderColor: '#28938C'
                                    }}
                                />
                            ))}
                        </Stack>

                        {/* Partner logos */}
                        <Typography color="#666666"
                            sx={{ mb: 1 }}
                            textAlign={{ xs: 'center', md: 'left' }}
                        
                        >
                            Trusted by leading healthcare partners:
                        </Typography>

                        <Stack direction="row" spacing={2} flexWrap="wrap"
                            sx={{
                                alignContent: 'center',
                                justifyContent: { xs: 'center', md: 'flex-start' }, // center on mobile
                            }}
                        >
                            {['Apollo', 'Fortis', 'Max', 'AIIMS'].map((name) => (
                                <Chip
                                    key={name}
                                    label={name}
                                    variant="outlined"
                                    sx={{
                                        backgroundColor: '#EEFAF9',
                                        color: '#333333',
                                        borderColor: "#28938C"
                                    }}
                                />
                            ))}
                        </Stack>
                    </Grid>

                    {/* RIGHT SIDE */}
                    <Grid item xs={12} md={6}>
                        <ConsultationForm />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default HeroSection;

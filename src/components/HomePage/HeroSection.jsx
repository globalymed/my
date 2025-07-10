import { Box, Button, Typography, Stack, Grid, Chip, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {
    PeopleAlt,
    Star,
    Verified,
} from '@mui/icons-material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { countries } from './Countrylist.js';

const HeroSection = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        country: '',
        treatment: '',
        problem: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form here
        const newErrors = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (!value) newErrors[key] = 'This field is required';
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Clear any previous errors
        setErrors({});

        const url = 'https://script.google.com/macros/s/AKfycbyWxsVGQNmXgJWRvfcDxec_OpLpmGeEkM5EDTVb9Bz88A4srryMScn6F7TUi22oe0HzKA/exec';

        // Create form data
        const formBody = new URLSearchParams(formData).toString();

        try {
            // Use no-cors mode for Google Apps Script
            await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody,
            });

            // With no-cors mode, we can't read the response
            // So we assume success if no error is thrown
            alert('Form submitted successfully! We will contact you soon.');
            setFormData({
                name: '',
                country: '',
                treatment: '',
                problem: '',
                phone: ''
            });

        } catch (err) {
            console.error('Error submitting form:', err);
            alert('Submission failed. Please check your internet connection and try again.');
        }
    };
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
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                width: '100%',
                                maxWidth: 520,
                                mx: 'auto',
                                p: 4,
                                backgroundColor: 'white',
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                border: '1px solid rgba(29, 70, 69, 0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'linear-gradient(90deg, #1D4645 0%, #28938C 100%)',
                                }
                            }}
                        >
                            {/* Header Section */}
                            <Box sx={{ textAlign: 'center', mb: 1 }}>
                                <Typography
                                    variant="h4"
                                    component="h2"
                                    sx={{
                                        color: '#1D4645',
                                        fontWeight: 700,
                                        fontSize: { xs: '1.5rem', md: '2rem' },
                                        mb: 1,
                                        lineHeight: 1.2
                                    }}
                                >
                                    Get Free Consultation
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        mt: 1,
                                        fontSize: '0.9rem',
                                        maxWidth: 400,
                                        mx: 'auto'
                                    }}
                                >
                                    Fill out the form below and our medical experts will contact you within 24 hours
                                </Typography>
                            </Box>

                            {/* Form Section */}
                            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Patient Name */}
                                <TextField
                                    fullWidth
                                    label="Patient Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            boxShadow: 'none', // remove any box-shadow
                                            outline: 'none',   // remove outline
                                            '&:hover fieldset': {
                                                borderColor: '#28938C',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1D4645',
                                                borderWidth: 2,
                                            },
                                        },
                                        '& .MuiInputBase-root': {
                                            boxShadow: 'none !important',
                                            outline: 'none !important',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            boxShadow: 'none',
                                            outline: 'none',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1D4645',
                                        },
                                    }}
                                />


                                {/* Home Country */}
                                <FormControl
                                    fullWidth
                                    error={!!errors.country}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: '#28938C',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1D4645',
                                                borderWidth: 2,
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1D4645',
                                        },
                                    }}
                                >
                                    <InputLabel>Home Country</InputLabel>
                                    <Select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        label="Home Country"
                                    >
                                        {countries.map((country, idx) => (
                                            <MenuItem key={idx} value={country.label}>
                                                {country.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.country && (
                                        <p style={{ color: 'red', fontSize: '0.75rem', marginLeft: '14px' }}>
                                            {errors.country}
                                        </p>
                                    )}
                                </FormControl>

                                {/* Treatment Needed */}
                                <FormControl
                                    fullWidth
                                    error={!!errors.treatment}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#28938C',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#1D4645',
                                                borderWidth: 2,
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1D4645',
                                        },
                                    }}
                                >
                                    <InputLabel>Treatment Needed</InputLabel>
                                    <Select
                                        name="treatment"
                                        value={formData.treatment}
                                        onChange={handleChange}
                                        label="Treatment Needed"
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    borderRadius: 2,
                                                    mt: 1,
                                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value="IVF" sx={{ '&:hover': { backgroundColor: '#EEFAF9' } }}>
                                            IVF Treatment
                                        </MenuItem>
                                        <MenuItem value="Hair" sx={{ '&:hover': { backgroundColor: '#EEFAF9' } }}>
                                            Hair Transplant
                                        </MenuItem>
                                        <MenuItem value="Cosmetic" sx={{ '&:hover': { backgroundColor: '#EEFAF9' } }}>
                                            Cosmetic Surgery
                                        </MenuItem>
                                        <MenuItem value="Dental" sx={{ '&:hover': { backgroundColor: '#EEFAF9' } }}>
                                            Dental Treatment
                                        </MenuItem>
                                        <MenuItem value="Other" sx={{ '&:hover': { backgroundColor: '#EEFAF9' } }}>
                                            Other
                                        </MenuItem>
                                    </Select>
                                    {errors.treatment && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                            {errors.treatment}
                                        </Typography>
                                    )}
                                </FormControl>

                                {/* Medical Problem */}
                                <TextField
                                    fullWidth
                                    label="Describe Current Medical Problem"
                                    name="problem"
                                    value={formData.problem}
                                    onChange={handleChange}
                                    error={!!errors.problem}
                                    helperText={errors.problem}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    placeholder="Please provide details about your medical condition, symptoms, or treatment requirements..."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            boxShadow: 'none',
                                            outline: 'none',
                                            '& fieldset': {
                                                borderColor: '#28938C',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1D4645', // remove on hover
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1D4645',
                                                borderWidth: 2,
                                            },
                                        },
                                        '& .MuiInputBase-root': {
                                            boxShadow: 'none !important',
                                            outline: 'none !important',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            boxShadow: 'none',
                                            outline: 'none',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1D4645',
                                        },
                                    }}
                                />


                                {/* Phone Number */}
                                <TextField
                                    fullWidth
                                    label="Phone Number (with country code)"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    error={!!errors.phone}
                                    helperText={errors.phone || "Example: +1 234 567 8900"}
                                    placeholder="+1 234 567 8900"
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            boxShadow: 'none', // remove any box-shadow
                                            outline: 'none',   // remove outline
                                            '&:hover fieldset': {
                                                borderColor: '#28938C',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1D4645',
                                                borderWidth: 2,
                                            },
                                        },
                                        '& .MuiInputBase-root': {
                                            boxShadow: 'none !important',
                                            outline: 'none !important',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            boxShadow: 'none',
                                            outline: 'none',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1D4645',
                                        },
                                    }}
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        backgroundColor: '#1D4645',
                                        color: 'white',
                                        textTransform: 'none',
                                        py: 1.8,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 16px rgba(29, 70, 69, 0.3)',
                                        background: 'linear-gradient(135deg, #1D4645 0%, #28938C 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #1f6f6a 0%, #2ba59d 100%)',
                                            boxShadow: '0 6px 20px rgba(29, 70, 69, 0.4)',
                                            transform: 'translateY(-1px)',
                                        },
                                        '&:active': {
                                            transform: 'translateY(0)',
                                        },
                                        transition: 'all 0.2s ease-in-out',
                                    }}
                                >
                                    Submit Request
                                </Button>
                            </Box>

                            {/* Footer Section */}
                            <Box sx={{ textAlign: 'center', mt: 1 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Box
                                        component="span"
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: '#28938C',
                                            display: 'inline-block'
                                        }}
                                    />
                                    100% Confidential • No Spam • Quick Response
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default HeroSection;

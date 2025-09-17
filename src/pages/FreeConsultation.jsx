"use client"

import React, { useState, useEffect } from "react"
import {
    AppBar,
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Toolbar,
    Typography,
    Card,
    CardContent,
    CardHeader,
    InputLabel,
    Select,
    FormControl,
} from "@mui/material"
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    Favorite as FavoriteIcon,
    AccessTime,
    CalendarToday,
    Security,
    LocalPhone,
    Stethoscope,
    Person,
    HealthAndSafety,
} from "@mui/icons-material"

import ConsultationForm from "../components/HomePage/ConsultationForm.jsx";
import SEO from "../components/SEO.jsx";
import { structuredDataTemplates } from "../utils/structuredData.js";

import { FaStethoscope, FaHeartbeat, FaUser, FaTooth } from "react-icons/fa";
import { GrShieldSecurity } from "react-icons/gr";

export default function ConsultationPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null)

    const consultationStructuredData = [
        structuredDataTemplates.service(
            "Free Medical Consultation", 
            "Get a complimentary 30-minute consultation with our medical experts to discuss your health concerns and treatment options for Hair Transplant, IVF, Dental, and Cosmetic procedures.",
            "https://medyatra.space/free-consultation"
        ),
        structuredDataTemplates.organization
    ];

    const treatments = [
        {
            icon: (
                <Box sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: "#f44336" }}>
                    <FaHeartbeat />
                </Box>
            ),
            title: "IVF",
            description:
                "Advanced fertility treatments including in vitro fertilization (IVF), ICSI, and reproductive health consultations.",
        },
        {
            icon: (
                <Box sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: "#2196f3" }}>
                    <FaUser />
                </Box>
            ),
            title: "Hair Transplant",
            description:
                "State-of-the-art hair restoration procedures including FUE, FUT, and PRP therapy for natural-looking results.",
        },
        {
            icon: (
                <Box sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: "#4caf50" }}>
                    <FaTooth />
                </Box>
            ),
            title: "Dental Care",
            description:
                "Comprehensive dental services including implants, braces, cosmetic dentistry, and routine oral care.",
        },
        {
            icon: (
                <Box sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: "#9c27b0" }}>
                    <FaStethoscope />
                </Box>
            ),
            title: "Cosmetic Procedure",
            description:
                "Aesthetic treatments such as rhinoplasty, liposuction, skin rejuvenation, and non-surgical enhancements.",
        },
    ];

    return (
        <>
            <SEO
                title="Free Medical Consultation - Expert Health Advice"
                description="Get a complimentary 30-minute consultation with our medical experts. Discuss your health concerns and treatment options for Hair Transplant, IVF, Dental, and Cosmetic procedures."
                keywords="free medical consultation, health consultation, medical advice, treatment consultation, healthcare consultation, medical tourism consultation"
                canonical="https://medyatra.space/free-consultation"
                ogTitle="Free Medical Consultation - Expert Health Advice"
                ogDescription="Get expert medical advice with our free consultation service. Discuss treatment options for Hair Transplant, IVF, Dental, and Cosmetic procedures."
                ogImage="https://medyatra.space/logo.webp"
                ogUrl="https://medyatra.space/free-consultation"
                structuredData={consultationStructuredData}
            />
            
            <Box sx={{
                px: { xs: 2, md: 8 },
                py: 4,
                background: 'linear-gradient(to bottom right, #ffffff, #fde2e4, #e0c3fc)',
            }}>

            <Box sx={{ py: 10,color: "#2f2f2f", textAlign: "center" }}>
                <Container>
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        Free Consultation
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4 }}>
                        Take the first step towards better health with our complimentary consultation
                    </Typography>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <CalendarToday sx={{ mr: 1 }} />
                                <Typography>Flexible Scheduling</Typography>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <AccessTime sx={{ mr: 1 }} />
                                <Typography>30-Minute Sessions</Typography>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Security sx={{ mr: 1 }} />
                                <Typography>Confidential & Secure</Typography>
                            </Box>
                        </Grid>

                    </Grid>
                </Container>
            </Box>

            <Container sx={{ py: 10 }}>
                <Grid container spacing={8}>
                    <Grid item xs={12} md={6}>
                        <ConsultationForm />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Our Treatment Areas
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            We offer comprehensive healthcare services across multiple specialties. During your free consultation, we'll discuss which treatments are right for you.
                        </Typography>

                        <Grid container spacing={2}>
                            {treatments.map((treatment, index) => (
                                <Grid item xs={12} key={index}>
                                    <Card>
                                        <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            {treatment.icon}
                                            <Box>
                                                <Typography variant="h6">{treatment.title}</Typography>
                                                <Typography variant="body2">{treatment.description}</Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Card sx={{ mt: 4, backgroundColor: '#f5f5f5' }}>
                            <CardHeader title="What to Expect" />
                            <CardContent>
                                {["Comprehensive health assessment", "Personalized treatment recommendations", "Questions about your health concerns", "No obligation or pressure"].map((item, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }}></Box>
                                        <Typography variant="body2">{item}</Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            <Box sx={{ py: 10}}>
                <Container>
                    <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
                        Get In Touch
                    </Typography>
                    <Typography variant="body1" textAlign="center" sx={{ mb: 6 }}>
                        Have questions? We're here to help.
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4} textAlign="center">
                            <LocalPhone fontSize="large" color="primary" />
                            <Typography variant="h6">Call Us</Typography>
                            <Typography variant="body2">(555) 123-4567</Typography>
                        </Grid>
                        <Grid item xs={12} md={4} textAlign="center">
                            <CalendarToday fontSize="large" color="primary" />
                            <Typography variant="h6">Office Hours</Typography>
                            <Typography variant="body2">Mon-Fri: 9AM-6PM<br />Sat: 9AM-2PM</Typography>
                        </Grid>
                        <Grid item xs={12} md={4} textAlign="center">
                            <Security fontSize="large" color="primary" />
                            <Typography variant="h6">Emergency</Typography>
                            <Typography variant="body2">24/7 Emergency Line<br />(555) 911-HELP</Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
        </>
    )
}

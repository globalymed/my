"use client"

import React, { useState } from "react"
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

import { FaStethoscope, FaHeartbeat, FaUser } from "react-icons/fa";
import { GrShieldSecurity } from "react-icons/gr";

export default function ConsultationPage() {
    const [menuAnchorEl, setMenuAnchorEl] = useState(null)


    const treatments = [
        {
            icon: (
                <Box sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: "#f44336" }}>
                    <FaHeartbeat />
                </Box>
            ),
            title: "Cardiology",
            description:
                "Comprehensive heart care including diagnostics, treatment, and preventive care for cardiovascular conditions.",
        },
        {
            icon: (
                <Box sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: "#2196f3" }}>
                    <FaStethoscope />
                </Box>
            ),
            title: "General Medicine",
            description:
                "Primary care services for routine check-ups, illness treatment, and health maintenance.",
        },
        {
            icon: (
                <Box sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: "#4caf50" }}>
                    <FaUser />
                </Box>
            ),
            title: "Dermatology",
            description:
                "Skin care treatments including acne treatment, skin cancer screening, and cosmetic procedures.",
        },
        {
            icon: (
                <Box sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: "#9c27b0" }}>
                    <GrShieldSecurity />
                </Box>
            ),
            title: "Preventive Care",
            description:
                "Wellness programs, health screenings, and preventive treatments to maintain optimal health.",
        },
    ];

    return (
        <Box>

            <Box sx={{ py: 10, background: "linear-gradient(to right, #2563EB, #1E40AF)", color: "white", textAlign: "center" }}>
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

                        <Card sx={{ mt: 4, backgroundColor: '#E3F2FD' }}>
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

            <Box sx={{ py: 10, bgcolor: "#f5f5f5" }}>
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
    )
}

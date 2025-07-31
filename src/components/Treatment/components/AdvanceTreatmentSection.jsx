import React from 'react'

import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    ButtonBase
} from '@mui/material';

import {
    Public as GlobeIcon,
    ElectricBolt
} from '@mui/icons-material';

const AdvanceTreatmentSection = () => {

    const treatments = [
        {
            title: "Root Canal Treatment",
            description:
                "Advanced endodontic procedures to save infected teeth with minimal pain and maximum success rates.",
            price: "$50 - $150",
            image: "/placeholder.svg?height=200&width=300&text=Root+Canal",
            gradient: "linear-gradient(to right, #f87171, #ec4899)",
            icon: "🦷",
            href: "/treatments/dental/root-canal",
        },
        {
            title: "Dental Implants",
            description:
                "Permanent tooth replacement solutions using titanium implants and ceramic crowns.",
            price: "$500 - $900",
            image: "/placeholder.svg?height=200&width=300&text=Dental+Implants",
            gradient: "linear-gradient(to right, #60a5fa, #06b6d4)",
            icon: "🔧",
            href: "/treatments/dental/dental-implants",
        },
        {
            title: "Teeth Whitening",
            description:
                "Professional whitening treatments for a brighter, more confident smile.",
            price: "$100 - $300",
            image: "/placeholder.svg?height=200&width=300&text=Teeth+Whitening",
            gradient: "linear-gradient(to right, #facc15, #f97316)",
            icon: "✨",
            href: "#",
        },
        {
            title: "Dental Crowns & Bridges",
            description: "Custom-made crowns and bridges to restore damaged or missing teeth.",
            price: "$200 - $500",
            image: "/placeholder.svg?height=200&width=300&text=Crowns+Bridges",
            gradient: "linear-gradient(to right, #a78bfa, #6366f1)",
            icon: "👑",
            href: "#",
        },
        {
            title: "Orthodontics",
            description: "Braces, Invisalign, and other alignment treatments for perfect smiles.",
            price: "$400 - $800",
            image: "/placeholder.svg?height=200&width=300&text=Orthodontics",
            gradient: "linear-gradient(to right, #4ade80, #10b981)", 
            icon: "🦷",
            href: "#",
        },
        {
            title: "Gum Surgery",
            description: "Periodontal treatments to restore gum health and prevent tooth loss.",
            price: "$300 - $600",
            image: "/placeholder.svg?height=200&width=300&text=Gum+Surgery",
            gradient: "linear-gradient(to right, #14b8a6, #3b82f6)", 
            icon: "🩺",
            href: "#",
        },
        {
            title: "Smile Design",
            description: "Complete smile makeovers combining multiple cosmetic procedures.",
            price: "$1,500 - $3,000",
            image: "/placeholder.svg?height=200&width=300&text=Smile+Design",
            gradient: "linear-gradient(to right, #f472b6, #f43f5e)", 
            icon: "😊",
            href: "#",
        },
        {
            title: "Full Mouth Reconstruction",
            description: "Comprehensive restoration of all teeth for optimal function and aesthetics.",
            price: "$3,000 - $6,000",
            image: "/placeholder.svg?height=200&width=300&text=Full+Mouth",
            gradient: "linear-gradient(to right, #6366f1, #a855f7)",
            icon: "🔄",
            href: "#",
        },
    ];

    return (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F9FAFB' }}>
            <Container maxWidth="xl"
                sx={{
                    px: { lg: 12, xs: 0 },
                }}
            >
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
                    <Chip
                        icon={<ElectricBolt sx={{ color: '#7e22ce !important' }} />}
                        label="Advanced Treatments"
                        sx={{
                            mb: 3,
                            color: '#6b21a8',
                            borderRadius: 3,
                            px: 1,
                            fontWeight: 'medium',
                            background: 'linear-gradient(to right, #dcfce7, #e0f2fe)', 
                        }}
                    />
                    <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2, fontSize: "3rem" }}>
                        Common Dental Treatments
                        <br />
                        <Typography component="span" variant="inherit" sx={{
                            background: 'linear-gradient(to right, #7e22ce, #2563eb)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            We Help With
                        </Typography>
                    </Typography>
                    <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 'md', mx: 'auto' }}>
                        Comprehensive dental care with world-class facilities and expert surgeons
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {treatments.map((treatment) => (
                        <Grid item xs={12} sm={6} md={3} key={treatment.title}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 3,
                                    transition: "all 0.3s",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                {/* Icon + Gradient Box */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        ml: 2,
                                        mt: 2,
                                        borderRadius: '50%',
                                        p: 2,
                                        background: 'white',
                                        color: "black",
                                        fontSize: "1.25rem",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    {treatment.icon}
                                </Box>

                                {/* Image */}
                                <CardMedia
                                    component="img"
                                    // src={treatment.image}
                                    src="https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg"
                                    alt={`Image for ${treatment.title}`}
                                    sx={{
                                        // borderRadius: "16px",
                                        // boxShadow: 20,
                                        width: "100%",
                                        height: "auto",
                                        objectFit: "cover",
                                    }}
                                />

                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    gutterBottom
                                    sx={{
                                        px: 4,
                                        py: 1,
                                        color: "text.primary",
                                        textDecoration: "none",
                                        "&:hover": {
                                            textDecoration: "underline",
                                        },
                                    }}
                                >
                                    {treatment.title}
                                </Typography>

                                {/* Description */}
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ maxWidth: "500px", mb: 2, px: 2, pt: 2 }}
                                >
                                    {treatment.description}
                                </Typography>

                                <CardContent>
                                    <Chip
                                        label={treatment.price}
                                        sx={{
                                            backgroundImage: treatment.gradient,
                                            color: "white",
                                            fontWeight: "bold",
                                        }}
                                    />

                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}

export default AdvanceTreatmentSection;
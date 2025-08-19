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
            title: "FUE Hair Transplant",
            description: "Follicular Unit Extraction - minimally invasive technique with no linear scarring.",
            price: "$800 - $2,000",
            image: "/placeholder.svg?height=200&width=300&text=FUE+Hair+Transplant",
            gradient: "linear-gradient(to right, #4ade80, #10b981)",
            icon: "💇‍♂️",
            href: "#",
        },
        {
            title: "FUT Hair Transplant",
            description: "Follicular Unit Transplantation - traditional strip method for maximum grafts.",
            price: "$600 - $1,500",
            image: "/placeholder.svg?height=200&width=300&text=FUT+Hair+Transplant",
            gradient: "linear-gradient(to right, #60a5fa, #06b6d4)",
            icon: "🔬",
            href: "#",
        },
        {
            title: "DHI Hair Transplant",
            description: "Direct Hair Implantation using Choi Implanter Pen for precise placement.",
            price: "$1,200 - $2,500",
            image: "/placeholder.svg?height=200&width=300&text=DHI+Hair+Transplant",
            gradient: "linear-gradient(to right, #a78bfa, #6366f1)",
            icon: "✏️",
            href: "#",
        },
        {
            title: "Beard Transplant",
            description: "Facial hair restoration for fuller, natural-looking beard growth.",
            price: "$500 - $1,200",
            image: "/placeholder.svg?height=200&width=300&text=Beard+Transplant",
            gradient: "linear-gradient(to right, #fb923c, #ef4444)",
            icon: "🧔",
            href: "#",
        },
        {
            title: "Eyebrow Transplant",
            description: "Precise eyebrow restoration for natural arch and density.",
            price: "$400 - $800",
            image: "/placeholder.svg?height=200&width=300&text=Eyebrow+Transplant",
            gradient: "linear-gradient(to right, #f472b6, #f43f5e)",
            icon: "👁️",
            href: "#",
        },
        {
            title: "Female Hair Transplant",
            description: "Specialized techniques for women's hair loss patterns and needs.",
            price: "$800 - $2,200",
            image: "/placeholder.svg?height=200&width=300&text=Female+Hair+Transplant",
            gradient: "linear-gradient(to right, #2dd4bf, #06b6d4)",
            icon: "👩",
            href: "#",
        },
        {
            title: "Body Hair Transplant",
            description: "Using body hair as donor for extensive hair restoration cases.",
            price: "$1,000 - $2,800",
            image: "/placeholder.svg?height=200&width=300&text=Body+Hair+Transplant",
            gradient: "linear-gradient(to right, #818cf8, #a78bfa)",
            icon: "🔄",
            href: "#",
        },
        {
            title: "Robotic Hair Transplant",
            description: "ARTAS robotic system for precision follicle extraction and implantation.",
            price: "$2,000 - $4,000",
            image: "/placeholder.svg?height=200&width=300&text=Robotic+Hair+Transplant",
            gradient: "linear-gradient(to right, #9ca3af, #64748b)",
            icon: "🤖",
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
                        label="Advanced Techniques"
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
                        Hair Restoration Procedures
                        <br />
                        <Typography component="span" variant="inherit" sx={{
                            background: 'linear-gradient(to right, #7e22ce, #2563eb)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            We Specialize In
                        </Typography>
                    </Typography>
                    <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 'md', mx: 'auto' }}>
                        Advanced hair transplant techniques with natural-looking results and minimal downtime
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {treatments.map((treatment) => (
                        <Grid item xs={12} sm={6} md={3} key={treatment.title}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 1,
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
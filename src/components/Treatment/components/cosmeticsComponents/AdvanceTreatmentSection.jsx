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
            title: "Rhinoplasty",
            description: "Nose reshaping surgery for improved facial harmony and breathing function.",
            price: "$1,500 - $3,000",
            image: "/placeholder.svg?height=200&width=300&text=Rhinoplasty",
            gradient: "linear-gradient(to right, #a78bfa, #6366f1)",
            icon: "👃",
            href: "#",
        },
        {
            title: "Breast Augmentation",
            description: "Breast enhancement using implants or fat transfer for natural results.",
            price: "$2,000 - $4,000",
            image: "/placeholder.svg?height=200&width=300&text=Breast+Augmentation",
            gradient: "linear-gradient(to right, #f472b6, #f43f5e)",
            icon: "💗",
            href: "#",
        },
        {
            title: "Liposuction",
            description: "Body contouring through targeted fat removal and sculpting techniques.",
            price: "$1,200 - $2,500",
            image: "/placeholder.svg?height=200&width=300&text=Liposuction",
            gradient: "linear-gradient(to right, #60a5fa, #06b6d4)",
            icon: "🎯",
            href: "#",
        },
        {
            title: "Facelift",
            description: "Facial rejuvenation to reduce signs of aging and restore youthful appearance.",
            price: "$2,500 - $5,000",
            image: "/placeholder.svg?height=200&width=300&text=Facelift",
            gradient: "linear-gradient(to right, #4ade80, #10b981)",
            icon: "✨",
            href: "#",
        },
        {
            title: "Tummy Tuck",
            description: "Abdominoplasty to remove excess skin and tighten abdominal muscles.",
            price: "$2,000 - $3,500",
            image: "/placeholder.svg?height=200&width=300&text=Tummy+Tuck",
            gradient: "linear-gradient(to right, #f97316, #ef4444)",
            icon: "🔥",
            href: "#",
        },
        {
            title: "Brazilian Butt Lift",
            description: "Buttock enhancement using your own fat for natural augmentation.",
            price: "$2,500 - $4,500",
            image: "/placeholder.svg?height=200&width=300&text=Brazilian+Butt+Lift",
            gradient: "linear-gradient(to right, #14b8a6, #06b6d4)",
            icon: "🍑",
            href: "#",
        },
        {
            title: "Mommy Makeover",
            description: "Combined procedures to restore pre-pregnancy body contours.",
            price: "$4,000 - $8,000",
            image: "/placeholder.svg?height=200&width=300&text=Mommy+Makeover",
            gradient: "linear-gradient(to right, #6366f1, #a855f7)",
            icon: "👩‍👧‍👦",
            href: "#",
        },
        {
            title: "Hair Transplant",
            description: "Advanced FUE and DHI techniques for natural hair restoration.",
            price: "$800 - $2,000",
            image: "/placeholder.svg?height=200&width=300&text=Hair+Transplant",
            gradient: "linear-gradient(to right, #9ca3af, #64748b)",
            icon: "💇‍♂️",
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
                        label="Advanced Procedures"
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
                        Cosmetic Surgery Procedures
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
                        Comprehensive aesthetic procedures with natural-looking results and expert care
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
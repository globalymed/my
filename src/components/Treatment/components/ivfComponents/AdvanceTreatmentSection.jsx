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
            title: "IVF Treatment",
            description:
                "In Vitro Fertilization with advanced embryo selection and transfer techniques.",
            price: "$2,500 - $4,000",
            image: "/placeholder.svg?height=200&width=300&text=IVF+Treatment",
            gradient: "linear-gradient(to right, #f472b6, #f43f5e)",
            icon: "🧬",
            href: "#",
        },
        {
            title: "ICSI Treatment",
            description:
                "Intracytoplasmic Sperm Injection for male factor infertility cases.",
            price: "$3,000 - $4,500",
            image: "/placeholder.svg?height=200&width=300&text=ICSI+Treatment",
            gradient: "linear-gradient(to right, #60a5fa, #06b6d4)",
            icon: "🔬",
            href: "#",
        },
        {
            title: "Egg Donation",
            description:
                "Donor egg programs with extensive screening and matching process.",
            price: "$3,500 - $5,000",
            image: "/placeholder.svg?height=200&width=300&text=Egg+Donation",
            gradient: "linear-gradient(to right, #a78bfa, #6366f1)",
            icon: "🥚",
            href: "#",
        },
        {
            title: "Sperm Donation",
            description:
                "Comprehensive sperm donor programs with genetic screening.",
            price: "$2,000 - $3,500",
            image: "/placeholder.svg?height=200&width=300&text=Sperm+Donation",
            gradient: "linear-gradient(to right, #4ade80, #10b981)",
            icon: "🧪",
            href: "#",
        },
        {
            title: "Embryo Donation",
            description:
                "Embryo donation programs for couples with multiple fertility factors.",
            price: "$2,800 - $4,200",
            image: "/placeholder.svg?height=200&width=300&text=Embryo+Donation",
            gradient: "linear-gradient(to right, #fb923c, #ef4444)",
            icon: "👶",
            href: "#",
        },
        {
            title: "Surrogacy",
            description:
                "Gestational surrogacy programs with legal and medical support.",
            price: "$8,000 - $12,000",
            image: "/placeholder.svg?height=200&width=300&text=Surrogacy",
            gradient: "linear-gradient(to right, #14b8a6, #06b6d4)",
            icon: "🤱",
            href: "#",
        },
        {
            title: "Fertility Preservation",
            description:
                "Egg and sperm freezing for future fertility planning.",
            price: "$1,500 - $2,500",
            image: "/placeholder.svg?height=200&width=300&text=Fertility+Preservation",
            gradient: "linear-gradient(to right, #6366f1, #a855f7)",
            icon: "❄️",
            href: "#",
        },
        {
            title: "PGT Testing",
            description:
                "Preimplantation Genetic Testing for healthy embryo selection.",
            price: "$2,000 - $3,000",
            image: "/placeholder.svg?height=200&width=300&text=PGT+Testing",
            gradient: "linear-gradient(to right, #9ca3af, #64748b)",
            icon: "🧬",
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
                        icon={<ElectricBolt sx={{ color: '#be185d !important' }} />}
                        label="Advanced Fertility Treatments"
                        sx={{
                            mb: 3,
                            color: '#be185d', // pink-700
                            borderRadius: 3,
                            px: 1,
                            fontWeight: 'medium',
                            background: 'linear-gradient(to right, #fdf2f8, #fbcfe8)',
                        }}
                    />
                    <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2, fontSize: "3rem" }}>
                        Fertility Treatments
                        <br />
                        <Typography component="span" variant="inherit" sx={{
                            background: 'linear-gradient(to right, #be185d, #db2777)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            We Specialize In
                        </Typography>
                    </Typography>
                    <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 'md', mx: 'auto' }}>
                        Comprehensive fertility treatments with high success rates and personalized care
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
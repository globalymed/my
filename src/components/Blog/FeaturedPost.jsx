import React, { useState } from "react"
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip
} from "@mui/material"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { Link } from "react-router-dom"

const featuredPosts = [
    {
        id: 1,
        slug: "revolutionary-heart-surgery",
        title: "Revolutionary Heart Surgery Technique Shows 95% Success Rate",
        snippet: "New minimally invasive procedure is changing cardiac surgery outcomes worldwide.",
        image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=400&width=600",
        treatmentType: "Cardiology",
        featured: true,
    },
    {
        id: 2,
        slug: "breakthrough-cancer-treatment",
        title: "Breakthrough Cancer Treatment Offers New Hope",
        snippet: "Immunotherapy advances show remarkable results in clinical trials.",
        image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=400&width=600",
        treatmentType: "Oncology",
        featured: true,
    },
    {
        id: 3,
        slug: "ai-medical-diagnosis",
        title: "AI-Powered Medical Diagnosis Reaches 99% Accuracy",
        snippet: "Machine learning technology is revolutionizing early disease detection.",
        image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=400&width=600",
        treatmentType: "Technology",
        featured: true,
    },
]

const FeaturedPosts = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % featuredPosts.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length)
    }

    return (
        <Box component="section" sx={{ py: 6 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                    Featured Stories
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="outlined" size="small" onClick={prevSlide}>
                        <ChevronLeftIcon fontSize="small" />
                    </Button>
                    <Button variant="outlined" size="small" onClick={nextSlide}>
                        <ChevronRightIcon fontSize="small" />
                    </Button>
                </Box>
            </Box>

            {/* Slider */}
            <Box
                sx={{
                    overflow: "hidden",
                    borderRadius: 3,
                    position: "relative"
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        transition: "transform 0.5s ease-in-out",
                        transform: `translateX(-${currentIndex * 100}%)`
                    }}
                >
                    {featuredPosts.map((post) => (
                        <Box key={post.id} sx={{ flexShrink: 0, width: "100%" }}>
                            <Card elevation={6} sx={{ border: 0 }}>
                                <Grid container spacing={0}>
                                    <Grid item xs={12} md={6} sx={{ position: "relative", height: { xs: 250, md: "100%" } }}>
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderTopLeftRadius: "12px",
                                                borderBottomLeftRadius: "12px"
                                            }}
                                        />
                                        <Chip
                                            label="Featured"
                                            sx={{
                                                position: "absolute",
                                                top: 16,
                                                left: 16,
                                                bgcolor: "#2563eb",
                                                color: "white",
                                                fontWeight: 600
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <CardContent sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                            <Chip
                                                label={post.treatmentType}
                                                variant="outlined"
                                                sx={{ mb: 2, width: "fit-content" }}
                                            />
                                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                                {post.title}
                                            </Typography>
                                            <Typography color="text.secondary" sx={{ mb: 3 }} fontSize="1.125rem">
                                                {post.snippet}
                                            </Typography>
                                            <Button
                                                component={Link}
                                                to={`/treatment/${post.slug}`}
                                                variant="contained"
                                                endIcon={<ArrowRightIcon />}
                                                sx={{ width: "fit-content" }}
                                            >
                                                Read Full Story
                                            </Button>
                                        </CardContent>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Indicators */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 1 }}>
                {featuredPosts.map((_, index) => (
                    <Box
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: index === currentIndex ? "#2563eb" : "#d1d5db",
                            cursor: "pointer",
                            transition: "background-color 0.3s"
                        }}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default FeaturedPosts

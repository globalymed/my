import React, { useState } from "react"
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    Button
} from "@mui/material"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import PersonIcon from "@mui/icons-material/Person"
import { Link } from "react-router-dom"

const blogPosts = [
    {
        id: 1,
        slug: "understanding-cardiac-health",
        title: "Understanding Cardiac Health: A Comprehensive Guide",
        snippet: "Learn about the latest advances in cardiac care and prevention strategies.",
        image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=300&width=400",
        treatmentType: "Cardiology",
        contentType: "Guide",
        date: "2024-01-15",
        author: "Dr. Sarah Johnson",
        readTime: "8 min read",
    },
    {
        id: 2,
        slug: "patient-story-knee-replacement",
        title: "My Journey: From Chronic Pain to Full Recovery",
        snippet: "A patient shares their experience with knee replacement surgery.",
        image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=300&width=400",
        treatmentType: "Orthopedics",
        contentType: "Patient Story",
        date: "2024-01-12",
        author: "Maria Rodriguez",
        readTime: "5 min read",
    },
    {
        id: 3,
        slug: "ivf-success-rates-2024",
        title: "IVF Success Rates: What the Latest Research Shows",
        snippet: "New data reveals promising trends in fertility treatment outcomes.",
        image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=300&width=400",
        treatmentType: "IVF",
        contentType: "Research",
        date: "2024-01-10",
        author: "Dr. Michael Chen",
        readTime: "12 min read",
    },
    {
        id: 4,
        slug: "skin-cancer-prevention",
        title: "Skin Cancer Prevention: Essential Tips for Every Age",
        snippet: "Dermatologists share crucial advice for protecting your skin.",
        image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=300&width=400",
        treatmentType: "Dermatology",
        contentType: "Guide",
        date: "2024-01-08",
        author: "Dr. Emily Watson",
        readTime: "6 min read",
    },
    {
        id: 5,
        slug: "neurological-breakthrough",
        title: "Breakthrough in Neurological Treatment Shows Promise",
        snippet: "New research offers hope for patients with neurological conditions.",
        image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=300&width=400",
        treatmentType: "Neurology",
        contentType: "Research",
        date: "2024-01-05",
        author: "Dr. Robert Kim",
        readTime: "10 min read",
    },
    {
        id: 6,
        slug: "mental-health-awareness",
        title: "Breaking the Stigma: Mental Health in Healthcare",
        snippet: "Addressing mental health challenges in medical settings.",
        image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=300&width=400",
        treatmentType: "Mental Health",
        contentType: "Guide",
        date: "2024-01-03",
        author: "Dr. Lisa Thompson",
        readTime: "7 min read",
    },
]

const treatmentColors = {
    Cardiology: { bg: "#fee2e2", color: "#991b1b" },
    Orthopedics: { bg: "#dbeafe", color: "#1e3a8a" },
    IVF: { bg: "#fce7f3", color: "#9d174d" },
    Dermatology: { bg: "#ffedd5", color: "#c2410c" },
    Neurology: { bg: "#ede9fe", color: "#6b21a8" },
    "Mental Health": { bg: "#d1fae5", color: "#065f46" },
}

const BlogGrid = () => {
    const [visiblePosts, setVisiblePosts] = useState(6)
    const [isLoading, setIsLoading] = useState(false)

    const loadMore = async () => {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setVisiblePosts((prev) => prev + 3)
        setIsLoading(false)
    }

    return (
        <Box component="section" id="blog-grid" sx={{ py: 6 }}>
            <Grid container spacing={3}>
                {blogPosts.slice(0, visiblePosts).map((post) => {
                    const badgeStyle = treatmentColors[post.treatmentType] || {
                        bg: "#f3f4f6",
                        color: "#1f2937"
                    }

                    return (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <Card
                                sx={{
                                    transition: "all 0.3s",
                                    "&:hover": {
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <Box sx={{ position: "relative", overflow: "hidden" }}>
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        width={400}
                                        height={300}
                                        style={{
                                            width: "100%",
                                            height: "12rem",
                                            objectFit: "cover",
                                            transition: "transform 0.3s ease"
                                        }}
                                    />
                                    <Chip
                                        label={post.treatmentType}
                                        sx={{
                                            position: "absolute",
                                            top: 12,
                                            left: 12,
                                            bgcolor: badgeStyle.bg,
                                            color: badgeStyle.color,
                                            fontWeight: 500
                                        }}
                                    />
                                </Box>

                                <CardContent sx={{ p: 3 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 1,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            transition: "color 0.3s",
                                            "&:hover": {
                                                color: "#2563eb"
                                            }
                                        }}
                                    >
                                        {post.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mb: 2,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden"
                                        }}
                                    >
                                        {post.snippet}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            fontSize: "0.875rem",
                                            color: "#6b7280",
                                            mb: 2
                                        }}
                                    >
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <PersonIcon sx={{ fontSize: 14 }} />
                                                {post.author}
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <AccessTimeIcon sx={{ fontSize: 14 }} />
                                                {post.readTime}
                                            </Box>
                                        </Box>
                                        <Box>{new Date(post.date).toLocaleDateString()}</Box>
                                    </Box>

                                    <Link to={`/treatment/${post.slug}`} style={{ textDecoration: "none" }}>
                                        <Button
                                            variant="text"
                                            fullWidth
                                            sx={{
                                                justifyContent: "space-between",
                                                "&:hover .arrow": {
                                                    transform: "translateX(4px)"
                                                }
                                            }}
                                            endIcon={
                                                <ArrowRightIcon
                                                    className="arrow"
                                                    sx={{ fontSize: 20, transition: "transform 0.3s" }}
                                                />
                                            }
                                        >
                                            Read More
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>

            {visiblePosts < blogPosts.length && (
                <Box sx={{ textAlign: "center", mt: 6 }}>
                    <Button onClick={loadMore} disabled={isLoading} size="large" sx={{ px: 4 }}>
                        {isLoading ? "Loading..." : "Load More Articles"}
                    </Button>
                </Box>
            )}
        </Box>
    )
}

export default BlogGrid

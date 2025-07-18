import React, { useEffect, useState } from "react";
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CircularProgress,
    Container,
    Box,
    Chip,
    Button
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import PersonIcon from "@mui/icons-material/Person"
import { Link } from "react-router-dom"

const BlogGrid = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleCardClick = (slug) => {
        navigate(`/treatment/${blog.slug.current}`);
        // console.log(window.location.pathname); // Debugging line to check the current path
    };

    const fetchBlogs = async () => {
        try {
            const query = `*[_type == "post"]{
        _id,
        title,
        slug,
        publishedAt,
        image,
        body
      }`;

            const url = `https://${process.env.REACT_APP_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/production?query=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const result = await response.json();

            setPosts(result.result || []);
        } catch (err) {
            console.error("Error fetching blog posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const getSanityImageUrl = (imageRef) => {
        if (!imageRef) return "";

        const ref = imageRef.asset?._ref || "";
        const [_, id, dimension, format] = ref.split("-"); // skip 'image'
        return `https://cdn.sanity.io/images/${process.env.REACT_APP_SANITY_PROJECT_ID}/production/${id}-${dimension}.${format}`;
    };

    function formatPublishedDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ py: 6 }}>
            <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, textAlign: "center", mb: 4 }}
            >
                Latest Blog Posts
            </Typography>
            <Grid container spacing={4}>
                {posts.map((post) => {

                    // console.log("Post data:", post); // Debugging line to check post data
                    const badgeStyle = {
                        bg: "#f3f4f6",
                        color: "#1f2937"
                    }

                    return (
                        <Grid item xs={12} sm={6} md={4} key={post._id}>
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
                                        src={getSanityImageUrl(post.image)}
                                        alt={post.title}
                                        width={400}
                                        height={300}
                                        style={{
                                            width: "100%",
                                            height: "12rem",
                                            objectFit: "cover",
                                            transition: "transform 0.3s ease",
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
                                                {post.author || "Unknown"}
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <AccessTimeIcon sx={{ fontSize: 14 }} />
                                                {formatPublishedDate(post.publishedAt)}
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Link to={`/treatment/${post.slug.current}`} style={{ textDecoration: "none" }}>
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
        </Container>
    );
};

export default BlogGrid;

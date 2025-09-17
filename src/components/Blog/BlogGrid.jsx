import React, { useEffect, useMemo, useState } from "react";
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
import { useSearchParams, Link as RouterLink } from 'react-router-dom';

import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import PersonIcon from "@mui/icons-material/Person"
import { Link } from "react-router-dom"

const BlogGrid = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageSize = 9;
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    const handleCardClick = (slug) => {
        navigate(`/treatment/${slug}`);
    };

    const fetchBlogs = async () => {
        try {
            const query = `*[_type == "post"]{
        _id,
        title,
        slug,
        publishedAt,
        author->{
          name,
          image,
          bio
        },
        image,
        body
      }`;

            const url = `https://${process.env.REACT_APP_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/production?query=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const result = await response.json();
            // console.log("Fetched blog posts:", result); // Debugging line to check fetched data

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

    const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const paginatedPosts = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return posts.slice(start, start + pageSize);
    }, [posts, currentPage]);

    const handlePageChange = (nextPage) => {
        const p = Math.min(Math.max(1, nextPage), totalPages);
        setSearchParams(p === 1 ? {} : { page: String(p) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    // Structured data: ItemList for current page
    const itemListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: paginatedPosts.map((post, idx) => ({
            '@type': 'ListItem',
            position: (currentPage - 1) * pageSize + idx + 1,
            url: `${window.location.origin}/treatment/${post.slug?.current}`,
            name: post.title || ''
        }))
    };

    return (
        <Container sx={{ py: 6 }} component="section" aria-label="Latest Blog Posts">
            <Box component="script" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
            <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, textAlign: "center", mb: 4 }}
            >
                Latest Blog Posts
            </Typography>
            <Grid container spacing={4}>
                {paginatedPosts.map((post) => {

                    // console.log("Post data:", post); // Debugging line to check post data
                    const badgeStyle = {
                        bg: "#f3f4f6",
                        color: "#1f2937"
                    }

                    return (
                        <Grid item xs={12} sm={6} md={4} key={post._id} component="article" itemScope itemType="https://schema.org/BlogPosting">
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
                                        loading="lazy"
                                        decoding="async"
                                        itemProp="image"
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
                                        component="h3"
                                        itemProp="headline"
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
                                        <RouterLink to={`/treatment/${post.slug?.current}`} style={{ textDecoration: 'none', color: 'inherit' }} rel="bookmark">
                                            {post.title}
                                        </RouterLink>
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
                                        <span itemProp="description">{post.snippet}</span>
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
                                                {post.author?.name ? post.author.name : "Unknown"}
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <AccessTimeIcon sx={{ fontSize: 14 }} />
                                                {formatPublishedDate(post.publishedAt)}
                                            </Box>
                                        </Box>
                                    </Box>

                                    <RouterLink to={`/treatment/${post.slug?.current}`} style={{ textDecoration: "none" }}>
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
                                    </RouterLink>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
                <Button variant="outlined" disabled={currentPage <= 1} onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous page">Previous</Button>
                <Typography component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    Page {currentPage} of {totalPages}
                </Typography>
                <Button variant="outlined" disabled={currentPage >= totalPages} onClick={() => handlePageChange(currentPage + 1)} aria-label="Next page">Next</Button>
            </Box>
        </Container>
    );
};

export default BlogGrid;

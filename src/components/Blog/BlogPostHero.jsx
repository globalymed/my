import React, { useEffect, useState } from "react"
import { Box, Container, Typography, Chip, Stack, Paper, Avatar } from "@mui/material"
import { CalendarToday, AccessTime, Person } from "@mui/icons-material"

// Props
const BlogPostHero = ({ slug }) => {

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchBlogData = async () => {
    try {
      const query = `*[_type == "post" && slug.current == "${slug}"]{
          _id,
          title,
          slug,
          publishedAt,
          image,
          body
        }`;
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `https://${process.env.REACT_APP_SANITY_PROJECT_ID}.api.sanity.io/v2025-07-16/data/query/production?query=${encodedQuery}&perspective=drafts`
      );
      const data = await response.json();
      setPost(data.result[0]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Failed to fetch blog data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ position: "relative" }}>
      {/* Hero Background Image */}
      <Box
        sx={{
          height: "60vh",
          backgroundImage: `url(${getSanityImageUrl(post.image)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
          },
        }}
      />

      {/* Floating Card Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 10,
          mt: -16,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: "#fff",
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          {/* Treatment + Tags */}
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
            <Chip label={post.treatmentType} sx={{ bgcolor: "#fee2e2", color: "#991b1b" }} />
            {post.tag && post.tags.map((tag) => (
              <Chip key={tag} label={tag} variant="outlined" />
            ))}
          </Stack>

          {/* Title */}
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ lineHeight: 1.3 }}
          >
            {post.title}
          </Typography>

          {/* Meta Info */}
          <Stack direction="row" spacing={4} flexWrap="wrap" color="text.secondary">
            <Stack direction="row" spacing={1} alignItems="center">
              <Person fontSize="small" />
              <Typography variant="body2">{post.author}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarToday fontSize="small" />
              <Typography variant="body2">
                {formatPublishedDate(post.publishedAt)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTime fontSize="small" />
              <Typography variant="body2">{post.readTime}</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default BlogPostHero

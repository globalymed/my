import React from "react"
import { Box, Container, Typography, Chip, Stack, Paper, Avatar } from "@mui/material"
import { CalendarToday, AccessTime, Person } from "@mui/icons-material"

// Props
const BlogPostHero = ({ slug }) => {
  // Mock data - in real app, fetch based on slug
  const post = {
    title: "Understanding Cardiac Health: A Comprehensive Guide to Heart Disease Prevention",
    image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=400&width=1200",
    treatmentType: "Cardiology",
    date: "2024-01-15",
    author: "Dr. Sarah Johnson",
    readTime: "8 min read",
    tags: ["Heart Health", "Prevention", "Cardiology"],
  }

  return (
    <Box sx={{ position: "relative" }}>
      {/* Hero Background Image */}
      <Box
        sx={{
          height: "50vh",
          backgroundImage: `url(${post.image})`,
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
            {post.tags.map((tag) => (
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
                {new Date(post.date).toLocaleDateString()}
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

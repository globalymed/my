// RelatedContent.tsx (React + Material UI version)

import React from "react"
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  Stack,
} from "@mui/material"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import PersonIcon from "@mui/icons-material/Person"
import { Link as RouterLink } from "react-router-dom"

const relatedPosts = [
  {
    id: 1,
    slug: "heart-healthy-recipes",
    title: "Heart-Healthy Recipes for Every Meal",
    snippet: "Delicious recipes that support cardiovascular health",
    image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=200&width=300",
    category: "You Might Also Like",
    type: "Guide",
    readTime: "6 min read",
    author: "Chef Maria Santos",
  },
  {
    id: 2,
    slug: "cardiac-rehabilitation",
    title: "Complete Guide to Cardiac Rehabilitation",
    snippet: "Everything you need to know about heart recovery programs",
    image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=200&width=300",
    category: "Explore This Treatment",
    type: "Treatment Guide",
    readTime: "12 min read",
    author: "Dr. James Wilson",
  },
  {
    id: 3,
    slug: "patient-story-heart-attack",
    title: "From Heart Attack to Marathon: John's Journey",
    snippet: "A patient's inspiring recovery story and lessons learned",
    image: "https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=200&width=300",
    category: "Patient Story",
    type: "Personal Story",
    readTime: "8 min read",
    author: "John Martinez",
  },
]

export function RelatedContent() {
  const getBadgeColor = (category) => {
    switch (category) {
      case "Patient Story":
        return "success"
      case "Explore This Treatment":
        return "primary"
      default:
        return "secondary"
    }
  }

  return (
    <Box component="section" my={12}>
      <Typography variant="h5" fontWeight="bold" mb={4}>
        Continue Your Health Journey
      </Typography>

      <Grid container spacing={3}>
        {relatedPosts.map((post) => (
          <Grid item xs={12} md={4} key={post.id}>
            <Card
              sx={{
                transition: "box-shadow 0.3s",
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt={post.title}
                  sx={{
                    transition: "transform 0.3s",
                    '&:hover': {
                      transform: "scale(1.05)",
                    },
                  }}
                />
                <Chip
                  label={post.category}
                  color={getBadgeColor(post.category)}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    color: "white",
                  }}
                />
              </Box>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  mb={1}
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={2}
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {post.snippet}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PersonIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.author}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.readTime}
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  fullWidth
                  variant="text"
                  component={RouterLink}
                  to={`/blog/${post.slug}`}
                  endIcon={<ArrowRightIcon />}
                  sx={{ justifyContent: "space-between", textTransform: "none" }}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default RelatedContent;
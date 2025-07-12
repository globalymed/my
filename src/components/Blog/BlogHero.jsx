"use client"

import React from "react"
import { Box, Typography, Button, Stack } from "@mui/material"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import SearchIcon from "@mui/icons-material/Search"

export function BlogHero() {
  const scrollToFilters = () => {
    document.getElementById("blog-filters")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToLatest = () => {
    document.getElementById("blog-grid")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        height: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <img
          src="https://preview-blog-landing-page-kzmp1mycf5zc3dxvr145.vusercontent.net/placeholder.svg?height=800&width=1200"
          alt="Healthcare storytelling background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(30, 58, 138, 0.8), rgba(13, 148, 136, 0.6))",
          }}
        />
      </Box>

      {/* Text & Buttons */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          color: "white",
          maxWidth: "64rem",
          mx: "auto",
          px: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2.5rem", md: "4.5rem" },
            fontWeight: "bold",
            mb: 3,
            lineHeight: 1.2,
          }}
        >
          Our Insights & Stories
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "1.25rem", md: "1.5rem" },
            mb: 4,
            color: "rgba(191, 219, 254, 1)", // Tailwind's text-blue-100
            maxWidth: "32rem",
            mx: "auto",
          }}
        >
          Expert advice, patient journeys, treatment deep dives
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            size="large"
            onClick={scrollToFilters}
            sx={{
              bgcolor: "#2563EB", // Tailwind's blue-600
              color: "white",
              px: 4,
              py: 1.5,
              "&:hover": {
                bgcolor: "#1D4ED8", // Tailwind's blue-700
              },
            }}
            endIcon={<ArrowDownwardIcon sx={{ fontSize: 20 }} />}
          >
            Browse Treatments
          </Button>

          <Button
            size="large"
            variant="outlined"
            onClick={scrollToLatest}
            sx={{
              borderColor: "white",
              color: "white",
              backgroundColor: "transparent",
              px: 4,
              py: 1.5,
              "&:hover": {
                bgcolor: "white",
                color: "#1E3A8A", // Tailwind's blue-900
              },
            }}
            endIcon={<SearchIcon sx={{ fontSize: 20 }} />}
          >
            Read Latest
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

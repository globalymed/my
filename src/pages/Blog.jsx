import React from "react"
import { Container, Box } from "@mui/material"

// Assuming you’ll create/import these yourself
import { BlogHero } from "../components/Blog/BlogHero.jsx"
import { BlogFilters } from "../components/Blog/BlogFilters.jsx"
import BlogGrid from "../components/Blog/BlogGrid.jsx"
import FeaturedPosts from "../components/Blog/FeaturedPost.jsx"
import { NewsletterSignup } from "../components/Blog/NewsLetterSignup.jsx"
import FooterCTA from "../components/Blog/FooterCTA.jsx"

export default function BlogLandingPage() {
    return (
        <Box minHeight="100vh" bgcolor="background.default">
            <BlogHero />
            <BlogFilters />
            <Container maxWidth="lg" sx={{ px: 2, py: 4 }}>
                <FeaturedPosts />
                <BlogGrid />
                <NewsletterSignup />
            </Container>
            <FooterCTA />
        </Box>
    )
}

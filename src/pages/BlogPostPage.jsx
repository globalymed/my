import React from "react"
import { useParams } from "react-router-dom"
import { Container, Grid, Box } from "@mui/material"

// Import your MUI-compatible components
import BlogPostHero from "../components/Blog/BlogPostHero.jsx"
import TableOfContents from "../components/Blog/TableOfContents.jsx"
import BlogPostContent from "../components/Blog/BlogPostContent.jsx"
import TreatmentModule from "../components/Blog/TreatmentModule.jsx"
import RelatedContent from "../components/Blog/RelatedContent.jsx"
import SocialShare from "../components/Blog/SocialShare.jsx"
import BlogPostFooter from "../components/Blog/BlogPostFooter.jsx"

const BlogPostPage = () => {
  const { id } = useParams() // /treatment/:id route

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <BlogPostHero slug={id} />

      {/* Main Content Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid item xs={12} lg={3}>
            <TableOfContents />
          </Grid>

          {/* Main Post Content */}
          <Grid item xs={12} lg={9}>
            <BlogPostContent slug={id} />
            <Box mt={4}>
              <TreatmentModule />
              <Box mt={4}>
                <RelatedContent />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Social & Footer */}
      <SocialShare />
      <BlogPostFooter />
    </Box>
  )
}

export default BlogPostPage

import React from "react"
import { Container, Box } from "@mui/material"

// Assuming you'll create/import these yourself
import BlogGrid from "../components/Blog/BlogGrid.jsx"
import FeaturedPosts from "../components/Blog/FeaturedPost.jsx"
import { NewsletterSignup } from "../components/Blog/NewsLetterSignup.jsx"
import FooterCTA from "../components/Blog/FooterCTA.jsx"
import SEO from "../components/SEO.jsx"
import { structuredDataTemplates } from "../utils/structuredData.js"

export default function BlogLandingPage() {
    const blogStructuredData = [
        structuredDataTemplates.website,
        structuredDataTemplates.organization
    ];

    return (
        <>
            <SEO
                title="Medical Tourism Blog - Latest News & Insights"
                description="Stay updated with the latest medical tourism news, treatment insights, and healthcare trends in India. Expert articles on Hair Transplant, IVF, Dental, and Cosmetic treatments."
                keywords="medical tourism blog, healthcare news India, medical treatment insights, hair transplant blog, IVF blog, dental care blog, cosmetic surgery blog"
                canonical="https://medyatra.space/treatment/blog"
                ogTitle="Medical Tourism Blog - Latest News & Insights"
                ogDescription="Expert insights and latest news on medical tourism, treatments, and healthcare trends in India. Stay informed about Hair Transplant, IVF, Dental, and Cosmetic procedures."
                ogImage="https://medyatra.space/logo.webp"
                ogUrl="https://medyatra.space/treatment/blog"
                structuredData={blogStructuredData}
            />
            
            <Box minHeight="100vh" bgcolor="background.default">
                <Container maxWidth="lg" sx={{ px: 2, py: 4 }}>
                    <FeaturedPosts />
                    <BlogGrid />
                    <NewsletterSignup />
                </Container>
                <FooterCTA />
            </Box>
        </>
    )
}

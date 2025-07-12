import { Box, Container, Divider, Typography, Button, Breadcrumbs, Link as MuiLink, Stack } from "@mui/material"
import HomeIcon from "@mui/icons-material/Home"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import { Link } from "react-router-dom"

export default function BlogPostFooter() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: "grey.200", bgcolor: "grey.50", py: 6 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          {/* Breadcrumb */}
          <Breadcrumbs separator="/" sx={{ color: "grey.600", fontSize: "0.875rem" }}>
            <MuiLink component={Link} to="/" underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }}>
              <HomeIcon sx={{ fontSize: 16, mr: 0.5 }} />
            </MuiLink>
            <MuiLink component={Link} to="/treatment" underline="hover" color="inherit">
              Treatment
            </MuiLink>
            <MuiLink component={Link} to="/treatment/cardiology" underline="hover" color="inherit">
              Cardiology
            </MuiLink>
            <Typography color="textPrimary">Understanding Cardiac Health</Typography>
          </Breadcrumbs>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              to="/treatment"
              variant="outlined"
              startIcon={<ChevronLeftIcon />}
            >
              Back to Blog
            </Button>
            <Button
              component={Link}
              to="/contact"
              variant="contained"
            >
              Contact Our Team
            </Button>
          </Stack>
        </Stack>

        {/* Disclaimer */}
        <Divider sx={{ mt: 6, mb: 2 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ fontSize: "0.875rem", maxWidth: "700px", mx: "auto", pt: 2 }}
        >
          Medical information provided is for educational purposes only. Always consult with your healthcare provider
          for personalized medical advice.
        </Typography>
      </Container>
    </Box>
  )
}

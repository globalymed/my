import React from "react"
import {
  Box,
  Typography,
  Button,
  Divider,
  Link as MuiLink,
  Stack
} from "@mui/material"
import { Link } from "react-router-dom"
import MessageIcon from "@mui/icons-material/Message"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import InstagramIcon from "@mui/icons-material/Instagram"
import LinkedInIcon from "@mui/icons-material/LinkedIn"

const FooterCTA = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "#111827", color: "#ffffff", py: 6 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        {/* CTA Section */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Can't find what you need?
          </Typography>
          <Typography color="#2f2f2f" mb={3}>
            Our medical advisors are here to help you navigate your healthcare journey.
          </Typography>
          <Button
            component={Link}
            to="/contact"
            variant="contained"
            size="large"
            startIcon={<MessageIcon />}
            sx={{
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1e40af" }
            }}
          >
            Ask Our Advisors
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default FooterCTA

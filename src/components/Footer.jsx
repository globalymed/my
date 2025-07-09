import React from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Divider,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Email,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

const socialLinks = [
  {
    icon: <Facebook />,
    label: 'Facebook',
    href: 'https://www.facebook.com/MedYatra',
  },
  {
    icon: <Twitter />,
    label: 'Twitter',
    href: 'https://twitter.com/MedYatra',
  },
  {
    icon: <Instagram />,
    label: 'Instagram',
    href: 'https://www.instagram.com/MedYatra',
  },
  {
    icon: <LinkedIn />,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/MedYatra',
  },
];

const footerLinks = [
  {
    title: "For Patients",
    links: ["Find Doctors", "Book Appointment", "How It Works", "Emergency Care"],
  },
  {
    title: "For Doctors",
    links: ["Join MedYatra", "Doctor Portal", "Verification Process", "Medical Resources"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press & Media", "Partnerships"],
  },
  {
    title: "Resources",
    links: ["Health Blog", "FAQ", "Help Center", "Contact Support"],
  },
];



const Footer = () => {
  const isMobile = window.innerWidth < 600; // Simple check for mobile devices
  return (
    <Box component="footer" sx={{ backgroundColor: 'black', color: 'white', pt: 2 }}>
      <Box maxWidth="lg" mx="auto" sx={{ px: { xs: 2, md: 4 } }}>

        {/* Main Footer Content */}
        <Box sx={{ px: { xs: 2, md: 8 }, py: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" mb={2}>
                {/* M Logo */}
                <Box
                  sx={{
                    backgroundColor: 'white',
                    color: 'black',
                    fontWeight: 'bold',
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    fontSize: '2rem',
                    lineHeight: 1,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  M
                </Box>

                {/* Text Block */}
                <Box>
                  <Typography variant="h3" fontWeight="bold" lineHeight={1.2}>
                    MedYatra
                  </Typography>
                  <Typography variant="body2">
                    Your Health Journey Simplified
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="grey.400">
                India's leading AI-powered healthcare platform connecting patients with verified doctors. Making quality healthcare accessible, affordable, and convenient for everyone.
              </Typography>

              {/* Contact Info */}
              <Box mt={2}>
                <Box display="flex" alignItems="center" mb={1}>
                  <IconButton
                    size="small"
                    sx={{
                      color: 'black',
                      backgroundColor: 'white',
                      borderRadius: 1,
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.2)',
                        backgroundColor: 'white',
                        color: 'black',
                      },
                      mr: 1,
                    }}
                  >
                    <Phone fontSize="medium" />
                  </IconButton>
                  <Typography variant="body2">
                    +91 1800-123-4567 <br /> (24/7 Patient Support)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <IconButton
                    size="small"
                    sx={{
                      color: 'black',
                      backgroundColor: 'white',
                      borderRadius: 1,
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.2)',
                        backgroundColor: 'white',
                        color: 'black',
                      },
                      mr: 1,
                    }}
                  >
                    <Email fontSize="medium" />
                  </IconButton>
                  <Typography variant="body1">
                    support@medyatra.com <br /> (General Inquiries)
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {footerLinks.map((section, index) => (
              <Grid item xs={12} sm={6} md={2} key={index}>
                {isMobile ? (
                  <Accordion
                    disableGutters
                    elevation={0}
                    sx={{ backgroundColor: "transparent", boxShadow: "none", color: 'white' }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{
                        color: 'white'
                      }
                      } />}
                      sx={{
                        px: 0,
                        minHeight: "unset",
                        "& .MuiAccordionSummary-content": { marginY: 0 },
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {section.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0, pt: 0.5 }}>
                      <Stack spacing={0.8}>
                        {section.links.map((link, i) => (
                          <Typography key={i} variant="body2">
                            {link}
                          </Typography>
                        ))}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ) : (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                      {section.title}
                    </Typography>
                    <Stack spacing={0.8}>
                      {section.links.map((link, i) => (
                        <Typography key={i} variant="body2">
                          {link}
                        </Typography>
                      ))}
                    </Stack>
                  </>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Bottom Section */}
        <Divider sx={{ borderColor: 'grey.800', mb: 2 }} />
        <Box px={4} pb={2}>
          <Box display="flex" justifyContent="space-between" mt={4} flexDirection={{ xs: 'column', md: 'row' }}>
            <Typography variant="body2" color="grey.500">
              © 2025 MedYatra Technologies Pvt. Ltd. All rights reserved.
            </Typography>
            <Box mt={{ xs: 2, md: 0 }} sx={{ color: 'white' }}>
              <Typography variant="caption" display="inline" mr={1}>
                Follow us:
              </Typography>
              {socialLinks.map((item, index) => (
                <IconButton
                  size="small"
                  key={index}
                  sx={{
                    color: 'white',
                    // backgroundColor: 'white',
                    borderRadius: 1,
                    mx: 0.5,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.25)',
                      color: 'black',
                      backgroundColor: 'white',
                    },
                  }}
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.icon}
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
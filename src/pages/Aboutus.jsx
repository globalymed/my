import {React, useEffect} from 'react';
import { Box, Container, Typography, Divider, Grid, Card, CardContent, IconButton } from '@mui/material';
import {
  Email,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';

import { Mail, Search, Calendar, Plane, MessageCircle, BarChart3, Globe, Hospital, Shield, Rocket, Users } from "lucide-react";

const socialLinks = [
  {
    icon: <Facebook />,
    label: 'Facebook',
    href: 'https://www.facebook.com',
  },
  {
    icon: <Twitter />,
    label: 'Twitter',
    href: 'https://twitter.com',
  },
  {
    icon: <Instagram />,
    label: 'Instagram',
    href: 'https://www.instagram.com/med.yatra/',
  },
  {
    icon: <LinkedIn />,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/medyatra-official/',
  },
];

const whatWeDoItems = [
  {
    icon: Search,
    title: "Specialist Discovery",
    description: "Compare and connect with highly-rated doctors and clinics across major specialties.",
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description: "Secure your consultation—whether virtual or in-person—with just a few clicks.",
  },
  {
    icon: Plane,
    title: "Custom Travel Packages",
    description:
      "Book end-to-end medical travel, including flights, hotel stays, and local transportation—all optimized for comfort, cost, and care.",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Communication",
    description: "Use our integrated AI-powered assistant and secure chat to stay informed at every step.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "From treatment history to travel itineraries—track everything in one dashboard.",
  },
];

const whyMedYatraFeatures = [
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "Designed for patients around the world seeking high-quality, affordable treatment in India.",
  },
  {
    icon: Hospital,
    title: "Verified Clinics & Specialists",
    description:
      "We partner only with accredited, top-reviewed clinics across key specialties—orthopedics, dental, fertility, and cosmetic surgery.",
  },
  {
    icon: Shield,
    title: "Privacy-First Approach",
    description:
      "Built with end-to-end encryption, HIPAA/GDPR compliance, and a strong commitment to patient confidentiality.",
  },
  {
    icon: Rocket,
    title: "Tech-Driven Experience",
    description:
      "Built using the latest in React, Firebase, AI, and automation—our platform is fast, intuitive, and scalable.",
  },
  {
    icon: Users,
    title: "Patient-First Philosophy",
    description:
      "Healthcare isn't just about hospitals—it's about people. Our platform is designed to put patients first, always.",
  },
];

export default function AboutPage() {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, p: { xs: 2, sm: 4 }, overflowY: 'auto' }}>
        {/* Title */}
        <Typography variant="h3" fontWeight="bold" gutterBottom align="center">
          About Us
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {/* Mission */}
        <Typography variant="body1" sx={{ mb: 4 }}>
          At MedYatra, we are building the future of cross-border healthcare. Our mission is simple yet ambitious:
          to make world-class medical care accessible, affordable, and seamless for every global citizen—no matter where they are.
        </Typography>

        {/* What We Do */}
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
          What We Do
        </Typography>
        <Grid container spacing={2}>
          {whatWeDoItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant="outlined" sx={{ height: '100%', p: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    <item.icon size={32} color="#1976d2" />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Why MedYatra */}
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 6, mb: 2 }}>
          Why MedYatra
        </Typography>
        <Grid container spacing={3}>
          {whyMedYatraFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Box>
                  <feature.icon size={28} color="#1976d2" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Our Story */}
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 6, mb: 2 }}>
          Our Story
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          What began as a college startup between a group of engineers and visionaries is now a growing platform
          solving real-world healthcare challenges. From our first pitch deck to our first international user,
          every milestone reaffirms our belief: access to healthcare should not be defined by geography.
        </Typography>
        <Typography variant="body1" fontWeight="medium" sx={{ color: '#1976d2', mb: 4 }}>
          We are based in India, but we build for the world.
        </Typography>

        {/* Contact */}
        <Divider sx={{ mt: 6, mb: 3 }} />
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Join Us
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          We're just getting started. Whether you're a doctor, developer, designer, investor—or someone who believes
          in our mission—come build the future of global healthcare with us.
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          <Mail size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          <a href="mailto:contact@medyatra.space" style={{ color: '#1976d2', textDecoration: 'none' }}>
            contact@medyatra.space
          </a>
        </Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          {socialLinks.map((item, index) => (
                <IconButton
                  size="small"
                  key={index}
                  sx={{
                    color: black,
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
    </Container>
  );
}

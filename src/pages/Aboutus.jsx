import { React, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  IconButton,
  Button,
  Card,
  CardContent
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from "@mui/icons-material";
import {
  Search,
  Calendar,
  Plane,
  MessageCircle,
  BarChart3,
  Globe,
  Hospital,
  Shield,
  Rocket,
  Users,
} from "lucide-react";

const socialLinks = [
  { icon: <Facebook />, label: "Facebook", href: "https://www.facebook.com" },
  { icon: <Twitter />, label: "Twitter", href: "https://twitter.com" },
  {
    icon: <Instagram />,
    label: "Instagram",
    href: "https://www.instagram.com/med.yatra/",
  },
  {
    icon: <LinkedIn />,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/medyatra-official/",
  },
];

const whatWeDoItems = [
  {
    icon: Search,
    title: "Specialist Discovery",
    description:
      "Compare and connect with highly-rated doctors and clinics across major specialties.",
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description:
      "Secure your consultation—whether virtual or in-person—with just a few clicks.",
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
    description:
      "Use our integrated AI-powered assistant and secure chat to stay informed at every step.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "From treatment history to travel itineraries—track everything in one dashboard.",
  },
];

const whyMedYatraFeatures = [
  {
    icon: Globe,
    title: "Global Accessibility",
    description:
      "Designed for patients around the world seeking high-quality, affordable treatment in India.",
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
    <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh", py: 8 }}>
      {/* Title */}
      <Typography align="center" sx={{
        fontSize: {
          xs: '2.25rem', // text-4xl
          sm: '3rem',    // text-5xl
          lg: '3.75rem'  // text-6xl
        },
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #111827, #1e3a8a, #312e81)', // gray-900 → blue-800 → indigo-900
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        align: "center",
      }}>
        About Us
      </Typography>
      <Typography variant="h6"
  sx={{
    fontSize: { xs: '1.25rem', sm: '1.5rem' }, // text-xl sm:text-2xl
    fontWeight: 300,
    background: 'linear-gradient(to right, #4b5563, #1f2937)', // gray-600 → gray-800
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    textAlign: 'center', // <-- centers text
    maxWidth: '800px',
    mx: 'auto', // center horizontally in container
    mb: 2
  }}
        >Transforming Global Healthcare, One Journey at a Time</Typography>
              <Divider sx={{ mb: 4, maxWidth: 800, mx: "auto" }} />

      {/* Intro */}
      <Typography
        sx={{
          mb: 4,
          maxWidth: 800,
          mx: "auto",
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        We’re two college students who turned frustration into innovation.
        MedYatra was born when we saw firsthand the emotional and logistical
        nightmare a loved one went through while trying to get medical
        treatment abroad. Confusing platforms, scammy agents, unclear pricing,
        and no one to guide the journey.
      </Typography>
      <Typography
        sx={{
          mb: 4,
          maxWidth: 800,
          mx: "auto",
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        That pain opened our eyes to a global problem faced by millions. We knew
        the system wasn’t just outdated—it was broken. So we built MedYatra to
        fix it.
      </Typography>

      {/* Why We Exist */}
      <Typography
  variant="h5"
  fontWeight="bold"
  sx={{
    mt: 6,
    mb: 2,
    textAlign: "center",
    fontSize: { xs: "1.125rem", sm: "1.75rem"  }, // text-3xl sm:text-4xl
    backgroundImage: "linear-gradient(to right, #111827, #1e3a8a)", // from-gray-900 to-blue-800
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  Why We Exist
</Typography>

<Typography
  sx={{
    mb: 4,
    maxWidth: 800,
    mx: "auto",
    textAlign: "center",
    fontSize: {xs: "1.125rem", sm: "1.25rem"  }, // text-lg sm:text-xl
    lineHeight: 1.75,
    fontWeight: 300,
    backgroundImage: "linear-gradient(to right, #4b5563, #1f2937)", // from-gray-600 to-gray-800
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  Patients seeking cross-border care are often met with a maze of
  misinformation: hidden costs, unverified clinics, language barriers,
  and zero support. Most don’t know which hospital to trust, what the
  real success rate is, or how to manage travel and accommodation while sick.
</Typography>

<Typography
  sx={{
    mb: 6,
    maxWidth: 800,
    mx: "auto",
    textAlign: "center",
    fontSize: { xs: "1.125rem", sm: "1.25rem" }, // text-lg sm:text-xl
    lineHeight: 1.75,
    fontWeight: 300,
    backgroundImage: "linear-gradient(to right, #4b5563, #1f2937)", // from-gray-600 to-gray-800
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  MedYatra simplifies everything. Our AI matches patients with verified
  hospitals based on medical condition and outcomes—not ads. We handle
  every step: treatment bookings, flights, hotels, transport, 24/7 AI
  assistants, and dedicated human case managers. Even after treatment,
  we provide post-care guidance and recovery support.
</Typography>


      {/* What We Do */}
      <Box
  component="section"
  sx={{
    py: 8,
    px: { xs: 2, sm: 3, lg: 4 },
    position: "relative",
  }}
>
  {/* Background Gradient */}
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      zIndex: 0,
    }}
  />

  {/* Content */}
  <Box sx={{ position: "relative", maxWidth: "1280px", mx: "auto" }}>
    {/* Section Title */}
    <Typography
      variant="h4"
      sx={{
        fontSize: { xs: "1.875rem", sm: "2.25rem" }, // text-3xl sm:text-4xl
        fontWeight: "bold",
        background: "linear-gradient(to right, #111827, #1e3a8a)", // gray-900 → blue-800
        WebkitBackgroundClip: "text",
        color: "transparent",
        textAlign: "center",
        mb: 6,
      }}
    >
      What We Do
    </Typography>

    {/* Cards Grid */}
    <Grid container spacing={3} justifyContent="center">
      {whatWeDoItems.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
          <Card
            sx={{
              background: "linear-gradient(to bottom right, #ffffff, rgba(219, 234, 254, 0.3))",
              borderRadius: 3,
              boxShadow: 3,
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(6px)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              {/* Icon Circle */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  mx: "auto",
                  mb: 2,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(to bottom right, #dbeafe, #e0e7ff)", // blue-100 → indigo-200
                  transition: "all 0.3s ease",
                  ".MuiCard-root:hover &": {
                    background: "linear-gradient(to bottom right, #bfdbfe, #c7d2fe)", // blue-200 → indigo-300
                  },
                }}
              >
                <item.icon size={24} color="#2563eb" /> {/* text-blue-600 */}
              </Box>

              {/* Title */}
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "600",
                  background: "linear-gradient(to right, #111827, #1e3a8a)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 1.5,
                }}
              >
                {item.title}
              </Typography>

              {/* Description */}
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
</Box>


      {/* Why MedYatra */}
      <Box
  sx={{
    py: 8,
    px: { xs: 2, sm: 3, lg: 4 },
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to right, white, rgba(239, 246, 255, 0.2), rgba(238, 242, 255, 0.3))',
      zIndex: 0,
    },
  }}
>
  <Box sx={{ position: 'relative', maxWidth: '72rem', mx: 'auto', zIndex: 1 }}>
    <Typography
      sx={{
        fontSize: { xs: '1.875rem', sm: '2.25rem' }, // text-3xl sm:text-4xl
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #111827, #1e3a8a)', // gray-900 → blue-800
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        textAlign: 'center',
        mb: 6,
      }}
    >
      Why MedYatra
    </Typography>

    <Grid container spacing={4}>
      {whyMedYatraFeatures.map((feature, index) => (
        <Grid item xs={12} lg={6} key={index}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              '&:hover .iconWrapper': {
                background: 'linear-gradient(to bottom right, #bfdbfe, #c7d2fe)', // from-blue-200 to-indigo-300
              },
              '&:hover .contentBox': {
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          >
            <Box
              className="iconWrapper"
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)', // from-blue-100 to-indigo-200
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.3s ease',
              }}
            >
              <feature.icon size={24} color="#2563eb" />
            </Box>

            <Box
              className="contentBox"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(4px)',
                borderRadius: '0.75rem',
                p: 2,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                flex: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  background: 'linear-gradient(to right, #111827, #1e3a8a)', // gray-900 → blue-800
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 1,
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                sx={{
                  color: '#4b5563', // gray-600
                  lineHeight: 1.625,
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
</Box>


      {/* Our Story */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mt: 8, mb: 2, textAlign: "center" }}
      >
        Our Story
      </Typography>
      <Typography
  sx={{
    mb: 2,
    maxWidth: 800,
    mx: "auto",
    textAlign: "center",
    fontSize: { xs: "1.125rem", sm: "1.25rem" }, // text-lg sm:text-xl
    lineHeight: 1.75,
    fontWeight: 300,
    backgroundImage: "linear-gradient(to right, #4b5563, #1f2937)", // from-gray-600 to-gray-800
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  What began as a college startup is now shaping the future of medical
  travel. We’re driven by the belief that accessing world-class healthcare
  should be as easy as booking a flight. We are based in India, but we
  build for the world.
</Typography>


      {/* Join Us */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: 8,
          px: { xs: 2, sm: 6, lg: 8 },
          mt: 8,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom right, #2563eb, #4f46e5, #7e22ce)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent)",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: "relative",
            maxWidth: "768px",
            mx: "auto",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "white",
              mb: 3,
              fontSize: { xs: "1.875rem", sm: "2.25rem" },
            }}
          >
            Join Us
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              color: "#bfdbfe",
              lineHeight: 1.75,
              mb: 6,
              maxWidth: "768px",
              mx: "auto",
            }}
          >
            We're just getting started. Whether you're a doctor, developer, designer, investor—or someone who believes in our mission—come build the future of global healthcare with us.
          </Typography>
          <Button
            size="large"
            sx={{
              background: "linear-gradient(to right, white, #eff6ff)",
              color: "#1d4ed8",
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              fontWeight: "600",
              boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(to right, #eff6ff, white)",
                transform: "scale(1.05)",
                boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            Contact Us
          </Button>
        </Box>
      </Box>

      {/* Social Links */}
      <Box display="flex" justifyContent="center" gap={2} mt={4}>
        {socialLinks.map((item, index) => (
          <IconButton
            size="small"
            key={index}
            sx={{
              borderRadius: 1,
              mx: 0.5,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.25)",
                color: "black",
                backgroundColor: "white",
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
  );
}

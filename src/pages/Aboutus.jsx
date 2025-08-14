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
  Bold,
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
      "Find the best hospitals and doctors based on your condition.",
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description:
      "Schedule appointments and treatment.",
  },
  {
    icon: Plane,
    title: "Custom Travel Packages",
    description:
      "Book flights, hotels, and on-ground transport.",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Communication",
    description:
      "Get 24/7 help from an AI + human support team.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      " Receive post-treatment care and follow-up.",
  },
];

const OurValues = [
  {
    icon: Shield, // Trust
    title: "Trust",
    description:
      "No paid listings. No hidden agendas. Verified care only.",
  },
  {
    icon: Globe, // Transparency
    title: "Transparency",
    description:
      "Clear pricing. Real reviews. Honest timelines.",
  },
  {
    icon: Rocket, // Execution
    title: "Execution",
    description:
      " We don’t stop at suggestions — we get things done",
  },
  {
    icon: Users, // Patient-first
    title: "Patient-first",
    description:
      "Your comfort, safety, and dignity come first, always.",
  }
];

const whyMedYatraFeatures = [
  {
    icon: Globe, // Only Verified, Never Sponsored
    title: "Only Verified, Never Sponsored",
    description:
      "Our hospital recommendations aren’t paid for. We rely on data, not dollars, to connect you with high-success clinics you can actually trust.",
  },
  {
    icon: Hospital, // Complete Journey Management
    title: "Complete Journey Management",
    description:
      "From treatment bookings and visa assistance to hotels and airport pickups, we handle it all. You just focus on getting better.",
  },
  {
    icon: MessageCircle, // Real Support, Round the Clock
    title: "Real Support, Round the Clock",
    description:
      "Whether it’s a sudden doubt, travel delay, or medical concern at 3 AM, we’re always here — with live human help backed by smart AI.",
  },
  {
    icon: BarChart3, // Clarity in Every Cost
    title: "Clarity in Every Cost",
    description:
      "No inflated bills. No hidden charges. You’ll know exactly what you're paying for — every step of the way.",
  },
  {
    icon: Users, // Tech That Feels Human
    title: "Tech That Feels Human",
    description:
      "Our AI is built to serve, not confuse. Every tool is designed to give you fast answers, peace of mind, and zero stress.",
  },
];

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh", py: 8 }}>
      {/* Title */}
      <Typography  sx={{
        fontSize: {
          xs: '2.25rem', // text-4xl
          sm: '3rem',    // text-5xl
          lg: '3.75rem'  // text-6xl
        },
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #111827, #1e3a8a, #312e81)', // gray-900 → blue-800 → indigo-900
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        textAlign: "center",
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
          fontSize: {xs: "1.125rem", sm: "1.25rem"  }, // text-lg sm:text-xl
          lineHeight: 1.75,
          fontWeight: 300,
          backgroundImage: "linear-gradient(to right, #4b5563, #1f2937)", // from-gray-600 to-gray-800
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        We’re two college students who turned frustration into innovation. <br />
        MedYatra was born when we saw firsthand the emotional and logistical
        nightmare a loved one went through while trying to get medical
        treatment abroad. Confusing platforms, scammy agents, unclear pricing,
        and no one to guide the journey.
      </Typography>
      <Typography
        sx={{
          mb: 8,
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
        That pain opened our eyes to a global problem faced by millions. We knew
        the system wasn’t just outdated—it was broken. So we built MedYatra to
        fix it.
      </Typography>

      {/* Why We Exist */}
      <Typography
  variant="h6"
  fontWeight="bold"
  sx={{
    fontSize: {
          xs: '1.75rem', // text-4xl
          sm: '2.25rem',    // text-5xl
          lg: '3rem'  // text-6xl
        },
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #111827, #1e3a8a, #312e81)', // gray-900 → blue-800 → indigo-900
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        textAlign: "center",
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
  Patients seeking cross-border care are often met with a maze of misinformation like hidden costs, unverified clinics, language barriers, and zero support. 
  Most don’t know which hospital to trust, what the real success rate is, or how to manage travel and accommodation while sick.

</Typography>

<Typography
  sx={{
    mb: 4,
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
<Typography
  sx={{
    mb: 4,
    maxWidth: 800,
    mx: "auto",
    textAlign: "center",
    fontSize: {xs: "1.125rem", sm: "1.25rem"  }, // text-lg sm:text-xl
    lineHeight: 1.75,
    fontWeight: "bold",
    backgroundImage: "linear-gradient(to right, #4b5563, #1f2937)", // from-gray-600 to-gray-800
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
> No more stress or guesswork. Just smarter care, from anywhere!</Typography>


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
        mb: 3,
        fontSize: {
          xs: '1.75rem', // text-4xl
          sm: '2.25rem',    // text-5xl
          lg: '3rem'  // text-6xl
        },
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #111827, #1e3a8a, #312e81)', // gray-900 → blue-800 → indigo-900
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        textAlign: "center",
      }}
    >
      What We Do
    </Typography>


<Typography
  sx={{
    mb: 4,
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
  MedYatra is India’s first AI-powered medical travel platform. We make cross-border healthcare seamless, safe, and fully supported. 
  From life-saving surgeries to smile makeovers, we help international patients access trusted care, plan their journey, and recover with confidence.
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
          fontSize: {
            xs: '1.75rem', // text-4xl
            sm: '2.25rem',    // text-5xl
            lg: '3rem'  // text-6xl
          },
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #111827, #1e3a8a, #312e81)', // gray-900 → blue-800 → indigo-900
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textAlign: "center"
        }}
      >
        Why MedYatra
      </Typography>


      <Typography
        sx={{
          mb: 4,
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
        Because when it comes to your health, shortcuts and chaos aren’t an option.
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
          fontSize: {
            xs: '1.75rem', // text-4xl
            sm: '2.25rem',    // text-5xl
            lg: '3rem'  // text-6xl
          },
          fontWeight: 'bold',
          mb: 5,
          background: 'linear-gradient(to right, #111827, #1e3a8a, #312e81)', // gray-900 → blue-800 → indigo-900
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textAlign: "center"
        }}
      >
        Our Values
      </Typography>



      <Grid container spacing={4}>
        {OurValues.map((feature, index) => (
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



      {/* Our Mission */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ fontSize: {
          xs: '1.75rem', // text-4xl
          sm: '2.25rem',    // text-5xl
          lg: '3rem' // text-6xl
        },
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #111827, #1e3a8a, #312e81)', // gray-900 → blue-800 → indigo-900
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        textAlign: "center" }}
      >
        Our Mission
      </Typography>
      <Typography
  sx={{
    mb: 4,
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
  From an Idea to Impact <br/>
  Born out of frustration. Built to fix the system.
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
  MedYatra began as a promise that no patient should ever feel lost, exploited, or unsupported while seeking care abroad. What started as a personal experience quickly grew into a global mission. Millions face the same barriers, and we knew we had to do something.
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
So we got to work, using AI, automation, and human-centered design to build an ecosystem where patients feel empowered, not overwhelmed. Today, MedYatra is a growing platform making medical travel easier, safer, and smarter for people everywhere.</Typography>


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
            Join the Movement
          </Typography>


<Typography
  sx={{
    mb: 4,
    maxWidth: 800,
    mx: "auto",
    textAlign: "center",
    fontSize: { xs: "1.125rem", sm: "1.25rem" }, // text-lg sm:text-xl
    lineHeight: 1.75,
    fontWeight: "bold",
    color: "white",
  }}
>
  Let’s Make Healthcare Borderless.
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
            Whether you're a patient, provider, or partner. Join us in building a future where access to quality care isn’t limited by geography, privilege, or luck.
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

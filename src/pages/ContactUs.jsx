"use client"

import React, { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Link
} from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { Mail, MapPin, Phone } from "@mui/icons-material"
import { FaLocationDot } from "react-icons/fa6";

// Custom theme to match the original design
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // blue-600
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      300: '#d1d5db',
      600: '#4b5563',
      700: '#374151',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e5e7eb',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#d1d5db',
            },
            '&:hover fieldset': {
              borderColor: '#d1d5db',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2563eb',
              borderWidth: '2px',
            },
          },
        },
      },
    },
  },
})

export default function ContactPage() {
  const [formData, setFormData] = useState({
    inquiryType: "patient",
    name: "",
    email: "",
    subject: "",
    message: "",
    consent: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleConsentChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      consent: e.target.checked,
    }))
  }

  const handleInquiryTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      inquiryType: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #ffffff, #fde2e4, #e0c3fc)',
        py: 6,
        px: { xs: 2, sm: 3, lg: 4 }
      }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'grey.900', mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="h6" sx={{ color: 'grey.600', maxWidth: '600px', mx: 'auto' }}>
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Contact Information */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card>
                  <CardHeader
                    title={
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                        Get in Touch
                      </Typography>
                    }
                    subheader={
                      <Typography variant="body2" color="grey.600">
                        Reach out to us through any of these channels
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Mail sx={{ fontSize: 20, color: 'primary.main' }} />
                        <Typography variant="body1" color="grey.700">
                          contact@medyatra.space
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Phone sx={{ fontSize: 20, color: 'primary.main' }} />
                        <Typography variant="body1" color="grey.700">
                          +1 (555) 123-4567
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <FaLocationDot sx={{ fontSize: 20, color: 'primary.main' }} />
                        <Typography variant="body1" color="grey.700">
                          New Delhi, India
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader
                    title={
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                        Office Hours
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="grey.600">Monday - Friday</Typography>
                        <Typography variant="body2" color="grey.600">9:00 AM - 6:00 PM</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="grey.600">Saturday</Typography>
                        <Typography variant="body2" color="grey.600">10:00 AM - 4:00 PM</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="grey.600">Sunday</Typography>
                        <Typography variant="body2" color="grey.600">Closed</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} lg={8}>
              <Card>
                <CardHeader
                  title={
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                      Send us a Message
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="grey.600">
                      Fill out the form below and we'll get back to you within 24 hours
                    </Typography>
                  }
                />
                <CardContent>
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <FormControl component="fieldset" sx={{ width: '100%' }}>
                        <FormLabel component="legend" sx={{ fontWeight: 500, color: 'grey.900', mb: 1.5 }}>
                          Type of Inquiry *
                        </FormLabel>
                        <RadioGroup
                          row
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleInquiryTypeChange}
                          sx={{ gap: 3 }}
                        >
                          <FormControlLabel 
                            value="patient" 
                            control={<Radio sx={{ color: 'primary.main' }} />} 
                            label={
                              <Typography variant="body2" sx={{ fontWeight: 400 }}>
                                Patient Inquiry
                              </Typography>
                            }
                          />
                          <FormControlLabel 
                            value="business" 
                            control={<Radio sx={{ color: 'primary.main' }} />} 
                            label={
                              <Typography variant="body2" sx={{ fontWeight: 400 }}>
                                Business Inquiry
                              </Typography>
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          id="name"
                          name="name"
                          label="Name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                          InputLabelProps={{
                            style: { fontWeight: 500, color: '#2f2f2f' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          id="email"
                          name="email"
                          label="Email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                          InputLabelProps={{
                            style: { fontWeight: 500, color: '#2f2f2f' }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      fullWidth
                      id="subject"
                      name="subject"
                      label="Subject"
                      placeholder={
                        formData.inquiryType === "patient"
                          ? "e.g., Appointment request, Medical question, Insurance inquiry"
                          : "e.g., Partnership opportunity, Service inquiry, General business"
                      }
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      InputLabelProps={{
                        style: { fontWeight: 500, color: '#2f2f2f' }
                      }}
                    />

                    <TextField
                      fullWidth
                      id="message"
                      name="message"
                      label="Message"
                      multiline
                      rows={5}
                      placeholder={
                        formData.inquiryType === "patient"
                          ? "Please describe your medical inquiry, symptoms, or appointment needs..."
                          : "Tell us more about your business inquiry or partnership opportunity..."
                      }
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      InputLabelProps={{
                        style: { fontWeight: 500, color: '#2f2f2f' }
                      }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.consent}
                          onChange={handleConsentChange}
                          required
                          sx={{ color: 'primary.main', alignSelf: 'flex-start', mt: 0.5 }}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ lineHeight: 1.25, color: 'grey.700' }}>
                          I agree to the{" "}
                          <Link href="/terms" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href='/privacy' sx={{ color: 'primary.main', textDecoration: 'underline' }}>
                            Privacy Policy
                          </Link>
                          . I consent to being contacted about my inquiry. *
                        </Typography>
                      }
                      sx={{ alignItems: 'flex-start' }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', md: 'flex-start' } }}>
                      <Button
                        type="submit"
                        size="large"
                        disabled={!formData.consent}
                        sx={{ 
                          width: { xs: '100%', md: 'auto' },
                          px: 3,
                          py: 1,
                          color: 'white',
                          textTransform: 'none',
                          fontWeight: 500,
                          backgroundColor: '#111',
                          '&:hover': {
                            backgroundColor: '#333',
                          },
                          '&:disabled': {
                            backgroundColor: 'grey.300',
                            color: 'grey.600',
                          }
                        }}
                      >
                        Send Message
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
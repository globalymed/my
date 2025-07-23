"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  styled
} from "@mui/material"
import {
  Person,
  Shield,
  Language,
  PersonAdd,
  Edit,
  CameraAlt,
  Description,
  CheckCircle,
  Warning
} from "@mui/icons-material"

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-flexContainer': {
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    padding: '4px',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    minHeight: '48px',
    fontSize: '16px',
    fontWeight: 500,
    color: '#666',
    borderRadius: '8px',
    margin: '0 2px',
    '&.Mui-selected': {
      backgroundColor: '#ffffff',
      color: '#333',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  }
}));

export function ProfileSection() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ py: 3, px: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your personal information and preferences
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <StyledTabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            width: 'fit-content',
          }}
        >
          <Tab label="Personal Info" />
          <Tab label="Medical Info" />
          <Tab label="Travel Documents" />
          <Tab label="Preferences" />
          <Tab label="Privacy & Access" />
        </StyledTabs>
      </Box>

      {/* Personal Info Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person />
                    <Typography variant="h6">Personal Information</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        defaultValue="Sarah"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        defaultValue="Johnson"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    defaultValue="sarah.johnson@email.com"
                    variant="outlined"
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        defaultValue="+1 (555) 123-4567"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        defaultValue="1985-03-15"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="Address"
                    defaultValue="123 Main Street, New York, NY 10001"
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    defaultValue="John Johnson (Husband) - +1 (555) 987-6543"
                    variant="outlined"
                  />

                  <Button
                    fullWidth
                    sx={{ backgroundColor: 'black', px: 5, py: 1, color: 'white', '&:hover': { backgroundColor: '#333' } }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card>
                <CardHeader title="Profile Photo" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 96, height: 96, fontSize: '2rem' }}>
                      SJ
                    </Avatar>
                    <Button
                      fullWidth
                      startIcon={<CameraAlt />}
                      variant="outlined"
                      sx={{
                        backgroundColor: '#FFFFFF',
                        color: 'black',
                        textTransform: 'none',
                        borderColor: '#1D4645',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                          borderColor: '#1D4645',
                        },
                      }}>
                      Change Photo
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Account Status" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Email Verified</Typography>
                      <Chip label="Verified" sx={{ backgroundColor: 'black', color: 'white' }} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Phone Verified</Typography>
                      <Chip label="Verified" sx={{ backgroundColor: 'black', color: 'white' }} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Identity Verified</Typography>
                      <Chip label="Verified" sx={{ backgroundColor: 'black', color: 'white' }} size="small" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Medical Info Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Medical Information" />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Blood Type"
                    defaultValue="O+"
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Allergies"
                    defaultValue="Penicillin, Shellfish"
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Medical Conditions"
                    defaultValue="Hypertension, Diabetes Type 2"
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Current Medications"
                    defaultValue="Metformin 500mg, Lisinopril 10mg"
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Insurance Provider"
                    defaultValue="Blue Cross Blue Shield"
                    variant="outlined"
                  />

                  <Button
                    fullWidth
                    sx={{ backgroundColor: 'black', px: 5, py: 1, color: 'white', '&:hover': { backgroundColor: '#333' } }}
                  >
                    Update Medical Info
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Emergency Medical Information" />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Paper sx={{ p: 2, bgcolor: 'error.50', border: 1, borderColor: 'error.200' }}>
                    <Typography variant="h6" sx={{ color: 'error.800', mb: 1, fontWeight: 'semibold' }}>
                      Critical Allergies
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label="Penicillin - Severe" color="error" size="small" />
                      <Chip label="Shellfish - Moderate" color="error" size="small" />
                    </Box>
                  </Paper>

                  <TextField
                    fullWidth
                    label="Medical Emergency Contact"
                    defaultValue="Dr. Smith - +1 (555) 246-8135"
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label="Preferred Hospital"
                    defaultValue="Mount Sinai Hospital, NYC"
                    variant="outlined"
                  />

                  <Button
                    fullWidth
                    startIcon={<Description />}
                    variant="outlined"
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: 'black',
                      textTransform: 'none',
                      borderColor: '#1D4645',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                        borderColor: '#1D4645',
                      },
                    }}>
                    Download Medical Summary
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Travel Documents Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description />
                    <Typography variant="h6">Travel Documents</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>Passport</Typography>
                      <Chip label="Verified" sx={{ backgroundColor: 'black', color: 'white' }} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Passport Number:</Typography>
                        <Typography variant="body2">123456789</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Expiry Date:</Typography>
                        <Typography variant="body2">March 15, 2028</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Country:</Typography>
                        <Typography variant="body2">United States</Typography>
                      </Box>
                    </Box>
                    <Button
                      fullWidth
                      startIcon={<Edit />}
                      variant="outlined"
                      sx={{
                        backgroundColor: '#FFFFFF',
                        color: 'black',
                        textTransform: 'none',
                        borderColor: '#1D4645',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                          borderColor: '#1D4645',
                        },
                      }}>
                      Update Passport
                    </Button>
                  </Paper>

                  <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>Visa Status</Typography>
                      <Chip label="Not Required" variant="outlined" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      US citizens do not require visa for medical tourism to India (up to 180 days)
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Document Verification" />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { name: "Passport Copy", status: "Verified" },
                    { name: "Photo ID", status: "Verified" },
                    { name: "Address Proof", status: "Verified" },
                    { name: "Medical Records", status: "Verified" }
                  ].map((doc, index) => (
                    <Paper key={index} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Description sx={{ fontSize: 20 }} />
                          <Typography variant="body2">{doc.name}</Typography>
                        </Box>
                        <Chip label={doc.status} sx={{ backgroundColor: 'black', color: 'white' }} size="small" />
                      </Box>
                    </Paper>
                  ))}

                  <Button
                    fullWidth
                    startIcon={<Description />}
                    variant="outlined"
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: 'black',
                      textTransform: 'none',
                      borderColor: '#1D4645',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                        borderColor: '#1D4645',
                      },
                    }}>
                    Upload Additional Document
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Preferences Tab */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Language />
                    <Typography variant="h6">Language & Display</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Preferred Language</InputLabel>
                    <Select defaultValue="english" label="Preferred Language">
                      <MenuItem value="english">English (US)</MenuItem>
                      <MenuItem value="spanish">Spanish</MenuItem>
                      <MenuItem value="french">French</MenuItem>
                      <MenuItem value="hindi">Hindi</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select defaultValue="et" label="Timezone">
                      <MenuItem value="et">Eastern Time (ET)</MenuItem>
                      <MenuItem value="ct">Central Time (CT)</MenuItem>
                      <MenuItem value="pt">Pacific Time (PT)</MenuItem>
                      <MenuItem value="ist">India Standard Time (IST)</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#000000',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#000000',
                          },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">Dark Mode</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Use dark theme for better viewing
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={<Switch
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#000000',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#000000',
                        },
                      }}
                    />}
                    label={
                      <Box>
                        <Typography variant="body2">High Contrast</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Increase contrast for accessibility
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Notification Preferences" />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[
                    { label: "Email Notifications", description: "Receive updates via email", defaultChecked: true },
                    { label: "SMS Notifications", description: "Receive text messages", defaultChecked: true },
                    { label: "Push Notifications", description: "Browser notifications", defaultChecked: true },
                    { label: "Appointment Reminders", description: "24h and 1h before appointments", defaultChecked: true },
                    { label: "Medication Reminders", description: "Daily medication alerts", defaultChecked: true }
                  ].map((pref, index) => (
                    <FormControlLabel
                      key={index}
                      control={<Switch sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#000000',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#000000',
                        },
                      }} defaultChecked={pref.defaultChecked} />}
                      label={
                        <Box>
                          <Typography variant="body2">{pref.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {pref.description}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Privacy & Access Tab */}
      {tabValue === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonAdd />
                    <Typography variant="h6">Caregiver Access</Typography>
                  </Box>
                }
                subheader="Manage who can access your medical information"
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', color: 'black' }}>JJ</Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>John Johnson</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Husband - Primary Contact
                          </Typography>
                        </Box>
                      </Box>
                      <Chip label="Full Access" sx={{ backgroundColor: 'black', color: 'white' }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Can view appointments, medical records, and communicate with doctors
                    </Typography>
                  </Paper>

                  <Button
                    fullWidth
                    startIcon={<PersonAdd />}
                    variant="outlined"
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: 'black',
                      textTransform: 'none',
                      borderColor: '#1D4645',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                        borderColor: '#1D4645',
                      },
                    }}>
                    Invite Caregiver
                  </Button>

                  <Paper sx={{ p: 3, bgcolor: 'primary.50', border: 1, borderColor: 'primary.200' }}>
                    <Typography variant="h6" sx={{ color: 'blue', mb: 2, fontWeight: 'semibold' }}>
                      Access Levels
                    </Typography>
                    <Box sx={{ color: 'blue' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • <strong>Full Access:</strong> All medical and travel information
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • <strong>Medical Only:</strong> Health records and appointments
                      </Typography>
                      <Typography variant="body2">
                        • <strong>Emergency Only:</strong> Contact during emergencies
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Shield />
                    <Typography variant="h6">Data Privacy</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={<Switch sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#000000',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#000000',
                        },
                      }} defaultChecked />}
                      label={
                        <Box>
                          <Typography variant="body2">Share with Hospital System</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Allow hospital to access relevant records
                          </Typography>
                        </Box>
                      }
                    />

                    <FormControlLabel
                      control={<Switch sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#000000',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#000000',
                        },
                      }} />}
                      label={
                        <Box>
                          <Typography variant="body2">Research Participation</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Anonymized data for medical research
                          </Typography>
                        </Box>
                      }
                    />

                    <FormControlLabel
                      control={<Switch sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#000000',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#000000',
                        },
                      }} />}
                      label={
                        <Box>
                          <Typography variant="body2">Marketing Communications</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Receive health and travel offers
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>
                      Data Sharing
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Medical Records:</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Hospital & Doctors Only
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Travel Information:</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Travel Partners Only
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Personal Data:</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Encrypted & Secure
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    startIcon={<Description />}
                    variant="outlined"
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: 'black',
                      textTransform: 'none',
                      borderColor: '#1D4645',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                        borderColor: '#1D4645',
                      },
                    }}>
                    View Privacy Policy
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
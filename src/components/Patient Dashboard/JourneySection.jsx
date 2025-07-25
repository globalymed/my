import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Badge,
  Tabs,
  Tab,
  Grid,
  Divider,
  Chip,
  Stack,
  Avatar,
  LinearProgress,
  useTheme,
  styled
} from '@mui/material';
import {
  Flight,
  Hotel,
  DirectionsCar,
  AttachMoney,
  Download,
  Edit,
  Add,
  Accessibility,
  Translate,
  Security,
  AccessTime,
  LocationOn,
  CheckCircle,
  Schedule,
  TrendingUp,
} from '@mui/icons-material';

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

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`journey-tabpanel-${index}`}
      aria-labelledby={`journey-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const JourneySection = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const timelineData = [
    { date: "Dec 15", event: "Arrival in Delhi", time: "12:30 PM", status: "upcoming" },
    { date: "Dec 16", event: "Initial Consultation", time: "2:00 PM", status: "upcoming" },
    { date: "Dec 18", event: "Surgery Day", time: "7:00 AM", status: "upcoming" },
    { date: "Dec 20", event: "Post-Op Check", time: "10:00 AM", status: "upcoming" },
    { date: "Jan 4", event: "Final Check & Clearance", time: "9:00 AM", status: "upcoming" },
    { date: "Jan 5", event: "Departure", time: "11:00 AM", status: "upcoming" },
  ];

  const costBreakdown = [
    { item: "Surgery Fee", amount: "$10,000" },
    { item: "Consultation Fees", amount: "$2,500" },
    { item: "Round-trip Flights", amount: "$1,800" },
    { item: "Hotel (20 nights)", amount: "$1,200" },
    { item: "Transportation", amount: "$200" },
  ];

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" gutterBottom>
            Plan My Journey
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage all your travel and accommodation details
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<Download />}
            sx={{ backgroundColor: 'black', px: 5, py: 1, color: 'white', '&:hover': { backgroundColor: '#333' } }}
          >
            Download Itinerary
          </Button>
          <Button
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
            Modify Plans
          </Button>
        </Stack>

        {/* Tabs */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <StyledTabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                width: 'fit-content',
              }}
            >
              <Tab label="Overview" />
              <Tab label="Flights" />
              <Tab label="Hotels" />
              <Tab label="Transport" />
              <Tab label="Budget" />
            </StyledTabs>
          </Box>

          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3}>
              {/* Overview Cards */}
              <Grid container spacing={3}>
                {/* Flight Overview */}
                <Grid item xs={12} md={4}>
                  <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
                    <CardHeader
                      title={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Flight color="black" />
                          <Typography color='black' variant="h6">Flight Details</Typography>
                        </Stack>
                      }
                    />
                    <CardContent>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Outbound Flight
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            AI 131 - Dec 15, 8:30 AM
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            NYC → Delhi (DEL)
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Return Flight
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            AI 132 - Jan 5, 2:15 PM
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Delhi (DEL) → NYC
                          </Typography>
                        </Box>
                        <Chip label="Confirmed" sx={{
                          bgcolor: 'black',
                          color: 'white'
                        }} size="small" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Hotel Overview */}
                <Grid item xs={12} md={4}>
                  <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
                    <CardHeader
                      title={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Hotel color="black" />
                          <Typography variant="h6">Accommodation</Typography>
                        </Stack>
                      }
                    />
                    <CardContent>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Taj Palace Hotel
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            5-star luxury hotel
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Near Apollo Hospital
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Check-in: Dec 15, 3:00 PM
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Check-out: Jan 4, 11:00 AM
                          </Typography>
                        </Box>
                        <Chip label="20 nights" variant="outlined" sx={{
                          backgroundColor: '#E4E7EC',
                        }} size="small" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Transport Overview */}
                <Grid item xs={12} md={4}>
                  <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
                    <CardHeader
                      title={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <DirectionsCar color="black" />
                          <Typography variant="h6">Transportation</Typography>
                        </Stack>
                      }
                    />
                    <CardContent>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Airport Pickup
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Dec 15, 12:00 PM
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Premium sedan
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Hospital Transfers
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Daily as needed
                          </Typography>
                        </Box>
                        <Chip label="Arranged" variant="outlined" size="small" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Timeline */}
              <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
                <CardHeader title={
                  <Typography variant="h4">Journey Timeline</Typography>
                } />
                <CardContent>
                  <Stack spacing={2}>
                    {timelineData.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Box sx={{ minWidth: 90 }}>
                          <Typography variant="h5" fontWeight="bold">
                            {item.date}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" fontWeight="bold">
                            {item.event}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.time}
                          </Typography>
                        </Box>
                        <Chip label="Upcoming" variant="outlined" sx={{
                          color: 'black',
                          fontWeight: 'bold',
                        }} size="small" />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </TabPanel>

          {/* Flights Tab */}
          <TabPanel value={tabValue} index={1}>
            <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
              <CardHeader
                title={
                  <Typography variant="h4">Flight Booking</Typography>
                }
                subheader="Manage your flight reservations"
              />
              <CardContent>
                <Stack spacing={3}>
                  {/* Outbound Flight */}
                  <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">Outbound Flight</Typography>
                      <Chip label="Confirmed" sx={{
                        color: 'white',
                        backgroundColor: 'black',
                        fontWeight: 'bold',
                      }} />
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Flight:</Typography>
                        <Typography variant="body2">Air India AI 131</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Date:</Typography>
                        <Typography variant="body2">Dec 15, 2024</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Route:</Typography>
                        <Typography variant="body2">JFK (8:30 AM) → DEL (12:30 PM+1)</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Seat:</Typography>
                        <Typography variant="body2">12A (Economy)</Typography>
                      </Grid>
                    </Grid>
                    <Stack direction="row" spacing={2} mt={2}>
                      <Button
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
                        Edit
                      </Button>
                      <Button
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
                        Check-in
                      </Button>
                    </Stack>
                  </Box>

                  {/* Return Flight */}
                  <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">Return Flight</Typography>
                      <Chip label="Scheduled" variant="outlined" sx={{
                        color: 'black',
                        fontWeight: 'bold',
                        bgcolor: '#E4E7EC',
                      }} />
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Flight:</Typography>
                        <Typography variant="body2">Air India AI 132</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Date:</Typography>
                        <Typography variant="body2">Jan 5, 2025</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Route:</Typography>
                        <Typography variant="body2">DEL (2:15 PM) → JFK (7:45 PM)</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Seat:</Typography>
                        <Typography variant="body2">12A (Economy)</Typography>
                      </Grid>
                    </Grid>
                    <Stack direction="row" spacing={2} mt={2}>
                      <Button
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
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        disabled
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
                        Check-in Unavailable
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Hotels Tab */}
          <TabPanel value={tabValue} index={2}>
            <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
              <CardHeader
                title={
                  <Typography variant="h4">Hotel Booking</Typography>
                }
                subheader="Manage your accommodation details"
              />
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  Hotel booking details will be displayed here.
                </Typography>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Transport Tab */}
          <TabPanel value={tabValue} index={3}>
            <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
              <CardHeader
                title={
                  <Typography variant="h4">Transportation</Typography>
                }
                subheader="Manage your transportation arrangements"
              />
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  Transportation details will be displayed here.
                </Typography>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Budget Tab */}
          <TabPanel value={tabValue} index={4}>
            <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AttachMoney color="primary" />
                    <Typography variant="h4">Budget Summary</Typography>
                  </Stack>
                }
              />
              <CardContent>
                <Stack spacing={3}>
                  {/* Summary Cards */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
                        <Typography variant="h6" color="primary.dark" fontWeight="bold">
                          Medical Costs
                        </Typography>
                        <Typography variant="h4" color="primary.dark" fontWeight="bold">
                          $12,500
                        </Typography>
                        <Typography variant="body2" color="primary.dark">
                          Surgery + consultations
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 3, bgcolor: 'success.50', borderRadius: 2 }}>
                        <Typography variant="h6" color="success.dark" fontWeight="bold">
                          Travel Costs
                        </Typography>
                        <Typography variant="h4" color="success.dark" fontWeight="bold">
                          $3,200
                        </Typography>
                        <Typography variant="body2" color="success.dark">
                          Flights + hotel + transport
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider />

                  {/* Cost Breakdown */}
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Cost Breakdown
                    </Typography>
                    <Stack spacing={1}>
                      {costBreakdown.map((cost, index) => (
                        <Stack key={index} direction="row" justifyContent="space-between">
                          <Typography variant="body2">{cost.item}</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {cost.amount}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Total */}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6" fontWeight="bold">
                      Total Estimated Cost
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      $15,700
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>
        </Box>

        {/* Additional Services */}
        <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
          <CardHeader
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Add color="black" />
                <Typography variant="h4">Additional Services</Typography>
              </Stack>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Accessibility color="black" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Wheelchair Assistance
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Airport and hospital mobility support
                  </Typography>
                  <Button
                    fullWidth
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
                    Add Service
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Translate color="black" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Translator
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Professional medical translation
                  </Typography>
                  <Button
                    fullWidth
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
                    Add Service
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Security color="black" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Travel Insurance
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Comprehensive medical coverage
                  </Typography>
                  <Chip label="Already Added" sx={{
                    color: 'white',
                    backgroundColor: 'black',
                  }} size="small" fullWidth />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Container >
  );
}

export default JourneySection;
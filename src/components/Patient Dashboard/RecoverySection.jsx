"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Checkbox,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  TextField,
  Slider,
  Grid,
  FormControlLabel,
  Divider,
  Paper,
  useTheme,
  styled
} from '@mui/material';
import {
  CheckCircleOutline,
  Schedule,
  Medication,
  CameraAlt,
  Videocam,
  TrendingUp,
  Event,
  TrackChanges,
} from '@mui/icons-material';

// Data for the checklist
const checklistItems = [
  { id: "fasting", text: "Fasting from midnight before surgery", urgent: true },
  { id: "shower", text: "Take antiseptic shower in morning", urgent: false },
  { id: "remove-jewelry", text: "Remove all jewelry and accessories", urgent: false },
  { id: "comfortable-clothes", text: "Wear loose, comfortable clothing", urgent: false },
  { id: "arrange-pickup", text: "Arrange pickup after surgery", urgent: true },
];


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


export const RecoverySection = () => {
  const theme = useTheme();
  const [checkedItems, setCheckedItems] = useState({});
  const [painLevel, setPainLevel] = useState(3);
  const [activeTab, setActiveTab] = useState('today');

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressValue = (completedCount / checklistItems.length) * 100;

  return (
    <Box sx={{ p: 3 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold">Follow-Up & Recovery</Typography>
        <Typography variant="body1" color="text.secondary">
          Track your post-treatment recovery and follow care instructions
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Doctor Instructions */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
            <CardHeader
              avatar={<CheckCircleOutline />}
              titleTypographyProps={{
                sx: {
                  fontSize: '1.5rem', // Bigger title
                  fontWeight: 'bold',
                },
              }}
              subheaderTypographyProps={{
                sx: {
                  fontSize: '1.1rem', // Slightly bigger subheader
                  color: 'text.secondary',
                },
              }}
              title="Doctor Instructions"
              subheader="Complete your pre-surgery checklist"
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {checklistItems.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            color: 'black',
                            '&.Mui-checked': {
                              color: 'black',
                            },
                          }}
                          checked={!!checkedItems[item.id]}
                          onChange={() => toggleCheck(item.id)}
                          name={item.id}
                        />
                      }
                      label={
                        <Typography sx={{ textDecoration: checkedItems[item.id] ? 'line-through' : 'none', color: checkedItems[item.id] ? 'text.disabled' : 'text.primary' }}>
                          {item.text}
                        </Typography>
                      }
                    />
                    {item.urgent && <Chip label="Urgent" color="error" size="small" />}
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Progress</Typography>
                  <Typography variant="body1">{completedCount}/{checklistItems.length} completed</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'black',
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Medication Tracker */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
            <CardHeader
              avatar={<Medication />}
              title="Medication Tracker"
              titleTypographyProps={{
                sx: {
                  fontSize: '1.5rem', // Bigger title
                  fontWeight: 'bold',
                },
              }}
            />
            <CardContent>
              <StyledTabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Today" value="today" />
                <Tab label="Schedule" value="schedule" />
              </StyledTabs>
              <Box mt={3}>
                {activeTab === 'today' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography fontWeight="medium">Ibuprofen 400mg</Typography>
                        <Typography variant="body2" color="text.secondary">8:00 AM</Typography>
                      </Box>
                      <Chip label="Taken" color="success" size="small" variant="outlined" />
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography fontWeight="medium">Antibiotic</Typography>
                        <Typography variant="body2" color="text.secondary">2:00 PM</Typography>
                      </Box>
                      <Button variant="contained" sx={{ textTransform: 'none', borderRadius: 2, bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}>
                        Mark Taken
                      </Button>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'action.hover' }}>
                      <Box>
                        <Typography fontWeight="medium">Ibuprofen 400mg</Typography>
                        <Typography variant="body2" color="text.secondary">8:00 PM</Typography>
                      </Box>
                      <Chip label="Upcoming" size="small" />
                    </Paper>
                  </Box>
                )}
                {activeTab === 'schedule' && (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Schedule sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography color="text.secondary">Full medication schedule</Typography>
                    <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                      View Full Schedule
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Symptom Check */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
            <CardHeader
              avatar={<TrackChanges />}
              title="Daily Symptom Check"
              titleTypographyProps={{
                sx: {
                  fontSize: '1.5rem', // Bigger title
                  fontWeight: 'bold',
                },
              }}
            />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography gutterBottom>Pain Level (0-10)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={painLevel}
                    onChange={(e, newValue) => setPainLevel(newValue)}
                    aria-labelledby="pain-level-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={10}
                  />
                  <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>{painLevel}</Typography>
                </Box>
              </Box>
              <TextField
                label="Additional Notes"
                multiline
                rows={4}
                fullWidth
                placeholder="Describe any symptoms or concerns..."
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto' }}>
                <Button variant="contained" startIcon={<CameraAlt />} fullWidth sx={{ textTransform: 'none', borderRadius: 2, bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}>
                  Upload Photo
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#1D4645',
                    textTransform: 'none',
                    borderColor: '#1D4645',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                      borderColor: '#1D4645',
                    },
                    maxWidth: { xs: '300px', sm: 'none' },
                  }}
                >
                  Submit Daily Record
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Follow-up Calls */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
            <CardHeader
              avatar={<Videocam />}
              title="Follow-up Calls"
              titleTypographyProps={{
                sx: {
                  fontSize: '1.5rem', // Bigger title
                  fontWeight: 'bold',
                },
              }}
            />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography fontWeight="medium">Post-Op Check</Typography>
                  <Typography variant="body2" color="text.secondary">Dec 20, 2:00 PM</Typography>
                </Box>
                <Button variant="contained" startIcon={<Videocam />} sx={{ textTransform: 'none', borderRadius: 2, bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}>
                  Join
                </Button>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'action.hover' }}>
                <Box>
                  <Typography fontWeight="medium">1-Week Follow-up</Typography>
                  <Typography variant="body2" color="text.secondary">Dec 25, 10:00 AM</Typography>
                </Box>
                <Chip label="Scheduled" size="small" />
              </Paper>
              <Button
                startIcon={<Event />}
                variant="outlined"
                sx={{
                  backgroundColor: '#FFFFFF',
                  color: '#1D4645',
                  textTransform: 'none',
                  borderColor: '#1D4645',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                    borderColor: '#1D4645',
                  },
                  maxWidth: { xs: '300px', sm: 'none' },
                }}
              >
                Schedule New Call
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recovery Progress */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
            <CardHeader
              avatar={<TrendingUp />}
              title="Recovery Progress"
              titleTypographyProps={{
                sx: {
                  fontSize: '1.5rem', // Bigger title
                  fontWeight: 'bold',
                },
              }}
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Overall Recovery</Typography>
                  <Typography variant="body1">Day 2 of 28</Typography>
                </Box>
                <LinearProgress variant="determinate" value={7} sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'black',
                    borderRadius: 5,
                  },
                }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutline color="success" fontSize="small" />
                  <Typography variant="body2">Surgery completed successfully</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutline color="success" fontSize="small" />
                  <Typography variant="body2">Initial recovery phase started</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule color="warning" fontSize="small" />
                  <Typography variant="body2">Physical therapy begins in 5 days</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule color="disabled" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">Full recovery expected in 4 weeks</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RecoverySection;
"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  TextField,
  Slider,
  Grid,
  Paper,
  Divider,
  Stack
} from "@mui/material"
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ClockIcon,
  Medication as PillIcon,
  CameraAlt as CameraIcon,
  Videocam as VideoIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  TrackChanges as TargetIcon
} from "@mui/icons-material"

export function RecoverySection() {
  const [checkedItems, setCheckedItems] = useState({})
  const [painLevel, setPainLevel] = useState(3)
  const [tabValue, setTabValue] = useState(0)

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Follow-Up & Recovery
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your post-treatment recovery and follow care instructions
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Doctor Instructions */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon />
                  <Typography variant="h6">Doctor Instructions</Typography>
                </Box>
              }
              subheader="Complete your pre-surgery checklist"
            />
            <CardContent>
              <Stack spacing={2}>
                {[
                  { id: "fasting", text: "Fasting from midnight before surgery", urgent: true },
                  { id: "shower", text: "Take antiseptic shower in morning", urgent: false },
                  { id: "remove-jewelry", text: "Remove all jewelry and accessories", urgent: false },
                  { id: "comfortable-clothes", text: "Wear loose, comfortable clothing", urgent: false },
                  { id: "arrange-pickup", text: "Arrange pickup after surgery", urgent: true },
                ].map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedItems[item.id] || false}
                          onChange={() => toggleCheck(item.id)}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: checkedItems[item.id] ? 'line-through' : 'none',
                            color: checkedItems[item.id] ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {item.text}
                        </Typography>
                      }
                    />
                    {item.urgent && <Chip label="Urgent" color="error" size="small" />}
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Progress</Typography>
                  <Typography variant="body2">
                    {Object.values(checkedItems).filter(Boolean).length}/5 completed
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(Object.values(checkedItems).filter(Boolean).length / 5) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Medication Tracker */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PillIcon />
                  <Typography variant="h6">Medication Tracker</Typography>
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Today" />
                  <Tab label="Schedule" />
                </Tabs>
              </Box>

              {tabValue === 0 && (
                <Stack spacing={2}>
                  <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Ibuprofen 400mg
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          8:00 AM
                        </Typography>
                      </Box>
                      <Chip label="Taken" variant="outlined" />
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Antibiotic
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          2:00 PM
                        </Typography>
                      </Box>
                      <Button variant="contained" size="small">
                        Mark Taken
                      </Button>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2, border: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Ibuprofen 400mg
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          8:00 PM
                        </Typography>
                      </Box>
                      <Chip label="Upcoming" variant="outlined" />
                    </Box>
                  </Paper>
                </Stack>
              )}

              {tabValue === 1 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ClockIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Full medication schedule
                  </Typography>
                  <Button variant="outlined" size="small">
                    View Full Schedule
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Symptom Check */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TargetIcon />
                  <Typography variant="h6">Daily Symptom Check</Typography>
                </Box>
              }
            />
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Pain Level (0-10)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Slider
                      value={painLevel}
                      onChange={(e, newValue) => setPainLevel(newValue)}
                      min={0}
                      max={10}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ flex: 1 }}
                    />
                    <Typography variant="body1" fontWeight="medium" sx={{ minWidth: 30 }}>
                      {painLevel}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Additional Notes
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    placeholder="Describe any symptoms or concerns..."
                    fullWidth
                    variant="outlined"
                  />
                </Box>

                <Stack spacing={1}>
                  <Button variant="contained" fullWidth startIcon={<CameraIcon />}>
                    Upload Photo
                  </Button>
                  <Button variant="outlined" fullWidth>
                    Submit Daily Report
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Follow-up Calls */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VideoIcon />
                  <Typography variant="h6">Follow-Up Calls</Typography>
                </Box>
              }
            />
            <CardContent>
              <Stack spacing={2}>
                <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Post-Op Check
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Dec 20, 2:00 PM
                      </Typography>
                    </Box>
                    <Button variant="contained" size="small" startIcon={<VideoIcon />}>
                      Join
                    </Button>
                  </Box>
                </Paper>

                <Paper sx={{ p: 2, border: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        1-Week Follow-up
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Dec 25, 10:00 AM
                      </Typography>
                    </Box>
                    <Chip label="Scheduled" variant="outlined" />
                  </Box>
                </Paper>

                <Button variant="outlined" fullWidth startIcon={<CalendarIcon />}>
                  Schedule New Call
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recovery Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon />
                  <Typography variant="h6">Recovery Progress</Typography>
                </Box>
              }
            />
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Overall Recovery</Typography>
                    <Typography variant="body2">Day 2 of 28</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={7}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2">Surgery completed successfully</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2">Initial recovery phase started</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ClockIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                    <Typography variant="body2">Physical therapy begins in 5 days</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ClockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">Full recovery expected in 4 weeks</Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
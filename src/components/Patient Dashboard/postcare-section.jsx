"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Avatar,
  Divider
} from "@mui/material"
import {
  Videocam,
  Description,
  TrendingUp,
  Restaurant,
  FitnessCenter,
  Favorite,
  CheckCircle,
  RadioButtonUnchecked,
  TrackChanges
} from "@mui/icons-material"

export function PostCareSection() {
  const [goalProgress, setGoalProgress] = useState(65)
  const [tabValue, setTabValue] = useState(0)
  const daysSinceSurgery = 2

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ py: 3, px: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Post-Care Plan
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your personalized recovery and rehabilitation program
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Goal Tracker */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrackChanges />
                  <Typography variant="h6">Recovery Goals</Typography>
                </Box>
              }
              subheader="Track your progress toward full recovery"
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Day {daysSinceSurgery}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      since surgery
                    </Typography>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Recovery Progress
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={goalProgress} 
                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                      />
                      <Typography variant="body2">
                        {goalProgress}% complete
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>
                      Key Milestones
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                        <Typography variant="body2">Surgery completed successfully</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                        <Typography variant="body2">Initial recovery phase</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RadioButtonUnchecked sx={{ color: 'warning.main', fontSize: 16 }} />
                        <Typography variant="body2">Physical therapy (starts day 5)</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RadioButtonUnchecked sx={{ color: 'grey.400', fontSize: 16 }} />
                        <Typography variant="body2">Return to normal activities (week 4)</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="post-care tabs">
              <Tab label="Daily Reminders" />
              <Tab label="Rehab Sessions" />
              <Tab label="Doctor Notes" />
              <Tab label="Goal Tracking" />
            </Tabs>
          </Box>

          {/* Daily Reminders Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {/* Exercise Reminders */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FitnessCenter />
                        <Typography variant="h6">Exercise</Typography>
                      </Box>
                    }
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                      {[
                        { task: "Ankle pumps", time: "Every hour", done: true },
                        { task: "Deep breathing", time: "3x daily", done: true },
                        { task: "Gentle stretching", time: "Morning", done: false },
                      ].map((item, index) => (
                        <FormControlLabel
                          key={index}
                          control={<Checkbox checked={item.done} />}
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {item.task}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.time}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </Box>
                    <Button variant="contained" fullWidth size="small">
                      Mark Exercise Complete
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Diet Reminders */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Restaurant />
                        <Typography variant="h6">Diet Plan</Typography>
                      </Box>
                    }
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                      {[
                        { task: "Protein shake", time: "9:00 AM", done: true },
                        { task: "Healthy lunch", time: "1:00 PM", done: false },
                        { task: "Light dinner", time: "7:00 PM", done: false },
                      ].map((item, index) => (
                        <FormControlLabel
                          key={index}
                          control={<Checkbox checked={item.done} />}
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {item.task}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.time}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </Box>
                    <Button variant="outlined" fullWidth size="small">
                      View Meal Plan
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Health Monitoring */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Favorite />
                        <Typography variant="h6">Health Check</Typography>
                      </Box>
                    }
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                      {[
                        { task: "Temperature check", time: "8:00 AM", done: true },
                        { task: "Wound inspection", time: "12:00 PM", done: false },
                        { task: "Pain assessment", time: "6:00 PM", done: false },
                      ].map((item, index) => (
                        <FormControlLabel
                          key={index}
                          control={<Checkbox checked={item.done} />}
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {item.task}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.time}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </Box>
                    <Button variant="outlined" fullWidth size="small">
                      Log Health Data
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Rehab Sessions Tab */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Videocam />
                        <Typography variant="h6">Today's Rehab Session</Typography>
                      </Box>
                    }
                  />
                  <CardContent>
                    <Box 
                      sx={{ 
                        aspectRatio: '16/9',
                        bgcolor: 'grey.100',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Videocam sx={{ fontSize: 40, color: 'grey.500', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Gentle Range of Motion Exercises
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Duration:</Typography>
                      <Typography variant="body2">15 minutes</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2">Difficulty:</Typography>
                      <Chip label="Beginner" size="small" />
                    </Box>
                    <Button variant="contained" fullWidth>
                      Start Session
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Upcoming Sessions" />
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[
                        { name: "Strength Building", day: "Day 5", difficulty: "Intermediate" },
                        { name: "Flexibility Training", day: "Day 10", difficulty: "Beginner" },
                        { name: "Balance Exercises", day: "Day 14", difficulty: "Intermediate" },
                      ].map((session, index) => (
                        <Paper key={index} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {session.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {session.day}
                              </Typography>
                            </Box>
                            <Chip label={session.difficulty} variant="outlined" size="small" />
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Doctor Notes Tab */}
          {tabValue === 2 && (
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description />
                    <Typography variant="h6">Personalized Instructions from Dr. Kumar</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Paper sx={{ p: 3, bgcolor: 'primary.50' }}>
                    <Typography variant="h6" sx={{ color: 'primary.900', mb: 2, fontWeight: 'semibold' }}>
                      Post-Surgery Recovery Notes
                    </Typography>
                    <Box sx={{ color: 'primary.800' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>• Excellent progress in the initial 48 hours post-surgery</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>• Continue current pain management protocol</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>• Begin gentle mobilization exercises starting day 3</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>• Follow-up appointment scheduled for day 7</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'primary.600', mt: 2, display: 'block' }}>
                      Added 2 hours ago
                    </Typography>
                  </Paper>

                  <Paper sx={{ p: 3, bgcolor: 'success.50' }}>
                    <Typography variant="h6" sx={{ color: 'success.900', mb: 2, fontWeight: 'semibold' }}>
                      Diet Recommendations
                    </Typography>
                    <Box sx={{ color: 'success.800' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>• Increase protein intake to support healing</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>• Stay well hydrated (8-10 glasses of water daily)</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>• Include anti-inflammatory foods in diet</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>• Avoid heavy meals for the first week</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'success.600', mt: 2, display: 'block' }}>
                      Added yesterday
                    </Typography>
                  </Paper>

                  <Paper sx={{ p: 3, bgcolor: 'warning.50' }}>
                    <Typography variant="h6" sx={{ color: 'warning.900', mb: 2, fontWeight: 'semibold' }}>
                      Activity Guidelines
                    </Typography>
                    <Box sx={{ color: 'warning.800' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>• No weight bearing on affected leg for first 5 days</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>• Use crutches or walker as provided</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>• Sleep with leg elevated for better circulation</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>• Physical therapy will begin on day 5</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'warning.600', mt: 2, display: 'block' }}>
                      Added 3 days ago
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Goal Tracking Tab */}
          {tabValue === 3 && (
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp />
                    <Typography variant="h6">Recovery Goals & Milestones</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>
                          Short-term Goals (Week 1)
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <FormControlLabel control={<Checkbox checked />} label="Manage pain effectively" />
                          <FormControlLabel control={<Checkbox checked />} label="Begin basic exercises" />
                          <FormControlLabel control={<Checkbox />} label="Achieve 45° knee flexion" />
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>
                          Medium-term Goals (Month 1)
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <FormControlLabel control={<Checkbox />} label="Walk without assistance" />
                          <FormControlLabel control={<Checkbox />} label="Climb stairs safely" />
                          <FormControlLabel control={<Checkbox />} label="Return to light activities" />
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper 
                    sx={{ 
                      p: 3, 
                      background: 'linear-gradient(90deg, #f3e5f5 0%, #e8eaf6 100%)',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'semibold' }}>
                      Overall Recovery Timeline
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                          <CheckCircle />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            Surgery Completed
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Day 0 - Dec 18
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                            2
                          </Typography>
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            Current Phase: Initial Recovery
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Days 1-7
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                            5
                          </Typography>
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            Physical Therapy Begins
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Day 5 onwards
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}
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
  FormControlLabel,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MdCheckCircle,
  MdSchedule,
  MdMedication,
  MdCamera,
  MdVideocam,
  MdTrendingUp,
  MdCalendarToday,
  MdGpsFixed
} from 'react-icons/md';

const StyledCard = styled(Card)(({ theme }) => ({
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  paddingBottom: '8px',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  paddingTop: '8px',
}));

const UrgentChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  fontSize: '12px',
  height: '20px',
}));

const SecondaryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#f3f4f6',
  color: '#6b7280',
  fontSize: '12px',
  height: '20px',
}));

const OutlineChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: '#6b7280',
  border: '1px solid #d1d5db',
  fontSize: '12px',
  height: '20px',
}));

const MutedBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  opacity: 0.8,
}));

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export const RecoverySection = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [painLevel, setPainLevel] = useState(3);
  const [tabValue, setTabValue] = useState(0);

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Follow-Up & Recovery
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your post-treatment recovery and follow care instructions
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Doctor Instructions */}
        <Grid item xs={12}>
          <StyledCard>
            <StyledCardHeader>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MdCheckCircle size={20} />
                Doctor Instructions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete your pre-surgery checklist
              </Typography>
            </StyledCardHeader>
            <StyledCardContent>
              <Box sx={{ mb: 3 }}>
                {[
                  { id: "fasting", text: "Fasting from midnight before surgery", urgent: true },
                  { id: "shower", text: "Take antiseptic shower in morning", urgent: false },
                  { id: "remove-jewelry", text: "Remove all jewelry and accessories", urgent: false },
                  { id: "comfortable-clothes", text: "Wear loose, comfortable clothing", urgent: false },
                  { id: "arrange-pickup", text: "Arrange pickup after surgery", urgent: true },
                ].map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Checkbox
                      checked={checkedItems[item.id] || false}
                      onChange={() => toggleCheck(item.id)}
                      size="small"
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: checkedItems[item.id] ? 'line-through' : 'none',
                        color: checkedItems[item.id] ? 'text.secondary' : 'text.primary',
                        flex: 1
                      }}
                    >
                      {item.text}
                    </Typography>
                    {item.urgent && <UrgentChip label="Urgent" size="small" />}
                  </Box>
                ))}
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Progress</Typography>
                  <Typography variant="body2">{checkedCount}/5 completed</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(checkedCount / 5) * 100} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        {/* Medication Tracker */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <StyledCardHeader>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MdMedication size={20} />
                Medication Tracker
              </Typography>
            </StyledCardHeader>
            <StyledCardContent>
              <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                <Tab label="Today" />
                <Tab label="Schedule" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">Ibuprofen 400mg</Typography>
                        <Typography variant="body2" color="text.secondary">8:00 AM</Typography>
                      </Box>
                      <SecondaryChip label="Taken" />
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">Antibiotic</Typography>
                        <Typography variant="body2" color="text.secondary">2:00 PM</Typography>
                      </Box>
                      <Button variant="contained" size="small">Mark Taken</Button>
                    </Box>
                  </Paper>

                  <MutedBox component={Paper} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">Ibuprofen 400mg</Typography>
                        <Typography variant="body2" color="text.secondary">8:00 PM</Typography>
                      </Box>
                      <OutlineChip label="Upcoming" />
                    </Box>
                  </MutedBox>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <MdSchedule size={32} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Full medication schedule
                  </Typography>
                  <Button variant="outlined" size="small">
                    View Full Schedule
                  </Button>
                </Box>
              </TabPanel>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        {/* Symptom Check */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <StyledCardHeader>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MdGpsFixed size={20} />
                Daily Symptom Check
              </Typography>
            </StyledCardHeader>
            <StyledCardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Pain Level (0-10)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={painLevel}
                    onChange={(e, value) => setPainLevel(value)}
                    min={0}
                    max={10}
                    step={1}
                    sx={{ flex: 1 }}
                  />
                  <Typography variant="body2" fontWeight="medium" sx={{ minWidth: '16px' }}>
                    {painLevel}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Additional Notes
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  placeholder="Describe any symptoms or concerns..."
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="contained" startIcon={<MdCamera />} fullWidth>
                  Upload Photo
                </Button>
                <Button variant="outlined" fullWidth>
                  Submit Daily Report
                </Button>
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        {/* Follow-up Calls */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <StyledCardHeader>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MdVideocam size={20} />
                Follow-Up Calls
              </Typography>
            </StyledCardHeader>
            <StyledCardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">Post-Op Check</Typography>
                      <Typography variant="body2" color="text.secondary">Dec 20, 2:00 PM</Typography>
                    </Box>
                    <Button variant="contained" size="small" startIcon={<MdVideocam />}>
                      Join
                    </Button>
                  </Box>
                </Paper>

                <MutedBox component={Paper} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">1-Week Follow-up</Typography>
                      <Typography variant="body2" color="text.secondary">Dec 25, 10:00 AM</Typography>
                    </Box>
                    <OutlineChip label="Scheduled" />
                  </Box>
                </MutedBox>

                <Button variant="outlined" startIcon={<MdCalendarToday />} fullWidth>
                  Schedule New Call
                </Button>
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        {/* Recovery Progress */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <StyledCardHeader>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MdTrendingUp size={20} />
                Recovery Progress
              </Typography>
            </StyledCardHeader>
            <StyledCardContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Overall Recovery</Typography>
                  <Typography variant="body2">Day 2 of 28</Typography>
                </Box>
                <LinearProgress variant="determinate" value={7} sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MdCheckCircle size={16} color="#10b981" />
                  <Typography variant="body2">Surgery completed successfully</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MdCheckCircle size={16} color="#10b981" />
                  <Typography variant="body2">Initial recovery phase started</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MdSchedule size={16} color="#f59e0b" />
                  <Typography variant="body2">Physical therapy begins in 5 days</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MdSchedule size={16} color="#9ca3af" />
                  <Typography variant="body2">Full recovery expected in 4 weeks</Typography>
                </Box>
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RecoverySection;
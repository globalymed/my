import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Container,
  Paper,
  Grid,
  Button,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Stack,
  Chip,
  Badge,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Alert,
  AlertTitle,
  ListItemAvatar,
  CardHeader,
  CardMedia,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home,
  CalendarMonth,
  Sync,
  Description,
  Flight,
  MedicalServices,
  Chat,
  Person,
  Notifications,
  Help,
  Settings,
  Videocam,
  Map,
  AccessTime,
  Add,
  CloudUpload,
  FilterList,
  Phone,
  CameraAlt,
  Warning,
  CheckCircle,
  Favorite,
  LocalHospital,
  ExpandMore,
  ExpandLess,
  MoreVert,
  Star,
  StarBorder,
  Email,
  Message,
  VideoCall,
  LocationOn,
  Event,
  Assignment,
  Timeline,
  TrendingUp,
  HealthAndSafety,
  Psychology,
  FitnessCenter,
  Spa,
  Medication,
  Bloodtype,
  MonitorHeart,
  Emergency,
  Support,
  Info,
} from '@mui/icons-material';

import { RecoverySection } from './RecoverySection.jsx';
import { JourneySection } from './journey-section';
import { PostCareSection } from './postcare-section';
import { ProfileSection } from './profile-section';
import { NotificationsSection } from './notifications-section';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const drawerWidth = 280;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

const navigationItems = [
  { title: 'Home / Overview', icon: <Home />, id: 'home', badge: null },
  { title: 'Appointments', icon: <CalendarMonth />, id: 'appointments', badge: 2 },
  { title: 'Follow-Up & Recovery', icon: <Sync />, id: 'recovery', badge: null },
  { title: 'Documents', icon: <Description />, id: 'documents', badge: 1 },
  { title: 'Plan My Journey', icon: <Flight />, id: 'journey', badge: null },
  { title: 'Post-Care Plan', icon: <MedicalServices />, id: 'postcare', badge: null },
  { title: 'Messages & Support', icon: <Chat />, id: 'messages', badge: 3 },
  { title: 'My Profile', icon: <Person />, id: 'profile', badge: null },
  { title: 'Notifications', icon: <Notifications />, id: 'notifications', badge: 5 },
];

function AppSidebar({ open, handleDrawerClose, activeSection, setActiveSection }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={open}
      onClose={isMobile ? handleDrawerClose : undefined}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Mediyatra
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ px: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light + '20',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light + '30',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: activeSection === item.id ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title} 
                primaryTypographyProps={{
                  fontWeight: activeSection === item.id ? 600 : 400,
                }}
              />
              {item.badge && (
                <Badge badgeContent={item.badge} color="error" sx={{ ml: 1 }} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List sx={{ px: 1 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton sx={{ borderRadius: 2 }}>
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton sx={{ borderRadius: 2 }}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

function HomeOverview() {
  const theme = useTheme();

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* Welcome Section */}
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome back, Sarah! 👋
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's your treatment overview and next steps
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <CalendarMonth />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">2</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upcoming Appointments
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">3</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Sessions
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <Message />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">5</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unread Messages
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <Description />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">8</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Documents Ready
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Upcoming Appointment */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarMonth color="primary" />
                    <Typography variant="h6">Upcoming Appointment</Typography>
                  </Stack>
                }
                action={
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                }
              />
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Pre-Surgery Consultation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Dr. Rajesh Kumar - Orthopedic Surgeon
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                      <Chip
                        icon={<AccessTime />}
                        label="Tomorrow, 2:00 PM IST"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        icon={<LocationOn />}
                        label="Apollo Hospital, Delhi"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        icon={<Videocam />}
                        label="Video Call"
                        color="primary"
                        size="small"
                      />
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <Button
                      variant="contained"
                      startIcon={<Videocam />}
                      size="large"
                    >
                      Join Call
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Event />}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Message />}
                    >
                      Message Doctor
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Treatment Progress */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocalHospital color="primary" />
                    <Typography variant="h6">Treatment Progress</Typography>
                  </Stack>
                }
              />
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Knee Replacement Surgery
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Apollo Hospital, Delhi
                    </Typography>
                    <Chip
                      label="Pre-Surgery Phase"
                      color="warning"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Box>
                  
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Overall Progress</Typography>
                      <Typography variant="body2" fontWeight="bold">25%</Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={25} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                        }
                      }} 
                    />
                  </Box>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Completed Steps:
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CheckCircle color="success" fontSize="small" />
                        <Typography variant="body2">Initial Consultation</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CheckCircle color="success" fontSize="small" />
                        <Typography variant="body2">Medical Records Review</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessTime color="warning" fontSize="small" />
                        <Typography variant="body2">Pre-Surgery Tests (In Progress)</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Timeline color="primary" />
                    <Typography variant="h6">Recent Activities</Typography>
                  </Stack>
                }
              />
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                      <CheckCircle fontSize="small" />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight="bold">
                        Medical Records Uploaded
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        2 hours ago
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <Message fontSize="small" />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight="bold">
                        Doctor sent a message
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        1 day ago
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                      <Event fontSize="small" />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight="bold">
                        Appointment scheduled
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        2 days ago
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Add color="primary" />
                    <Typography variant="h6">Quick Actions</Typography>
                  </Stack>
                }
              />
              <CardContent>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Message />}
                    fullWidth
                    size="large"
                  >
                    Contact Support
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Description />}
                    fullWidth
                    size="large"
                  >
                    Download Documents
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CalendarMonth />}
                    fullWidth
                    size="large"
                  >
                    Schedule Follow-up
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<HealthAndSafety />}
                    fullWidth
                    size="large"
                  >
                    View Treatment Plan
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}

function MessagesSection() {
  const theme = useTheme();

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" gutterBottom>
            Messages & Support
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Communicate with your healthcare team and get support
          </Typography>
        </Box>

        {/* Messages Overview */}
        <Grid container spacing={3}>
          {/* Unread Messages */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Badge badgeContent={3} color="error">
                      <Message color="primary" />
                    </Badge>
                    <Typography variant="h6">Unread Messages</Typography>
                  </Stack>
                }
              />
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight="bold">
                        Dr. Rajesh Kumar
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Pre-surgery instructions sent
                      </Typography>
                    </Box>
                    <Chip label="2h ago" size="small" variant="outlined" />
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <Support />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight="bold">
                        Support Team
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Your appointment confirmation
                      </Typography>
                    </Box>
                    <Chip label="1d ago" size="small" variant="outlined" />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Add color="primary" />
                    <Typography variant="h6">Quick Actions</Typography>
                  </Stack>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      startIcon={<Message />}
                      fullWidth
                      size="large"
                    >
                      New Message
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<VideoCall />}
                      fullWidth
                      size="large"
                    >
                      Video Call
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<Phone />}
                      fullWidth
                      size="large"
                    >
                      Call Support
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<Help />}
                      fullWidth
                      size="large"
                    >
                      Get Help
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Conversations */}
        <Card>
          <CardHeader
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chat color="primary" />
                <Typography variant="h6">Recent Conversations</Typography>
              </Stack>
            }
          />
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body1" fontWeight="bold">
                    Dr. Rajesh Kumar - Orthopedic Surgeon
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last message: "Please complete your pre-surgery tests by tomorrow..."
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip label="2 unread" color="error" size="small" />
                  <Button variant="outlined" size="small">
                    Reply
                  </Button>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Support />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body1" fontWeight="bold">
                    Mediyatra Support Team
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last message: "Your appointment has been confirmed for tomorrow..."
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip label="1 unread" color="error" size="small" />
                  <Button variant="outlined" size="small">
                    Reply
                  </Button>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <MedicalServices />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body1" fontWeight="bold">
                    Apollo Hospital - Nursing Team
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last message: "Your room has been prepared for your stay..."
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" size="small">
                    Reply
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Support Resources */}
        <Card>
          <CardHeader
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Info color="primary" />
                <Typography variant="h6">Support Resources</Typography>
              </Stack>
            }
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  fullWidth
                  sx={{ height: 80, flexDirection: 'column' }}
                >
                  <Typography variant="body2">FAQs</Typography>
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<VideoCall />}
                  fullWidth
                  sx={{ height: 80, flexDirection: 'column' }}
                >
                  <Typography variant="body2">Video Tutorials</Typography>
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<Phone />}
                  fullWidth
                  sx={{ height: 80, flexDirection: 'column' }}
                >
                  <Typography variant="body2">24/7 Helpline</Typography>
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<Email />}
                  fullWidth
                  sx={{ height: 80, flexDirection: 'column' }}
                >
                  <Typography variant="body2">Email Support</Typography>
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

function MainContent({ activeSection }) {
  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomeOverview />;
      case 'appointments':
        return (
          <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom>
              Appointments
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Appointments Section</AlertTitle>
              This section will contain appointment management features.
            </Alert>
          </Container>
        );
      case 'recovery':
        return <RecoverySection />;
      case 'documents':
        return (
          <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom>
              Documents
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Documents Section</AlertTitle>
              This section will contain document management features.
            </Alert>
          </Container>
        );
      case 'journey':
        return <JourneySection />;
      case 'postcare':
        return <PostCareSection />;
      case 'messages':
        return <MessagesSection />;
      case 'profile':
        return <ProfileSection />;
      case 'notifications':
        return <NotificationsSection />;
      default:
        return <HomeOverview />;
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Toolbar />
      {renderContent()}
    </Box>
  );
}

export { MessagesSection };

export function MediyatraDashboard() {
  const [open, setOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const speedDialActions = [
    { icon: <Message />, name: 'Message Support', action: () => setActiveSection('messages') },
    { icon: <CalendarMonth />, name: 'Book Appointment', action: () => setActiveSection('appointments') },
    { icon: <Phone />, name: 'Call Support', action: () => console.log('Call Support') },
    { icon: <Help />, name: 'Help', action: () => console.log('Help') },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar 
          position="fixed" 
          open={open}
          sx={{
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Mediyatra Patient Dashboard
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="inherit">
                <Badge badgeContent={5} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <Person />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
        <AppSidebar 
          open={open} 
          handleDrawerClose={handleDrawerClose} 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        <MainContent activeSection={activeSection} />
        
        {/* Speed Dial for Mobile */}
        {isMobile && (
          <SpeedDial
            ariaLabel="Quick Actions"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            {speedDialActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.action}
              />
            ))}
          </SpeedDial>
        )}
      </Box>
    </ThemeProvider>
  );
}

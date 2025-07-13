"use client"

import * as React from "react"
import {
  Home,
  CalendarToday,
  Refresh,
  Article,
  Flight,
  LocalPharmacy,
  Message,
  Person,
  Notifications,
  LocationOn,
  AccessTime,
  Phone,
  Upload,
  Download,
  Search,
  FilterList,
  Videocam,
  Error,
  CheckCircle,
  Favorite,
  MedicalServices,
  CameraAlt,
  Settings,
  Help,
  Menu as MenuIcon,
  Logout,
} from "@mui/icons-material"
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { RecoverySection } from "./recovery-section"
import { JourneySection } from "./journey-section"
import { ProfileSection } from "./profile-section"
import { PostCareSection } from "./postcare-section"
import { NotificationsSection } from "./notifications-section"
import { MessagesSection } from "./messages-section"

// Define a basic theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

// Navigation items with Material-UI icons
const navigationItems = [
  { title: "Home / Overview", icon: <Home />, id: "home" },
  { title: "Appointments", icon: <CalendarToday />, id: "appointments" },
  { title: "Follow-Up & Recovery", icon: <Refresh />, id: "recovery" },
  { title: "Documents", icon: <Article />, id: "documents" },
  { title: "Plan My Journey", icon: <Flight />, id: "journey" },
  { title: "Post-Care Plan", icon: <LocalPharmacy />, id: "postcare" },
  { title: "Messages & Support", icon: <Message />, id: "messages" },
  { title: "My Profile", icon: <Person />, id: "profile" },
  { title: "Notifications", icon: <Notifications />, id: "notifications" },
]

function AppSidebar({ activeSection, setActiveSection, open, onClose, variant = "temporary", sx }) {
  const drawerContent = (
    <Box>
      <Toolbar>
        <Favorite sx={{ mr: 2, color: "primary.main" }} />
        <Box>
          <Typography variant="h6" noWrap>
            MEDIYATRA
          </Typography>
          <Typography variant="caption" noWrap>
            Patient Dashboard
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map(item => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        ...sx
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

function HomeOverview({ user, appointments }) {
  const upcomingAppointment = appointments?.find(apt => 
    new Date(apt.appointmentDate) > new Date()
  );

  return (
    <Box sx={{ "& .MuiCard-root": { mb: 3 } }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName || user?.name || 'User'}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Here's your treatment overview and next steps
      </Typography>
      <Grid container spacing={3}>
        {/* Upcoming Appointment */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              avatar={<CalendarToday />}
              title="Upcoming Appointment"
            />
            <CardContent>
              {upcomingAppointment ? (
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6">{upcomingAppointment.treatmentType || "Appointment"}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {upcomingAppointment.doctorName || "Doctor"}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {new Date(upcomingAppointment.appointmentDate).toLocaleDateString()} - {upcomingAppointment.appointmentTime || "TBD"}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={1}>
                      <LocationOn sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {upcomingAppointment.hospitalName || "Hospital"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      startIcon={<Videocam />}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Join Call
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Reschedule
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body1" textAlign="center" color="text.secondary">
                  No upcoming appointments
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Treatment Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader avatar={<MedicalServices />} title="Treatment Progress" />
            <CardContent>
              <Typography variant="h6">Knee Replacement Surgery</Typography>
              <Typography variant="body2" color="text.secondary">
                Apollo Hospital, Delhi
              </Typography>
              <Box mt={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Progress</Typography>
                  <Typography variant="body2">Pre-Surgery</Typography>
                </Box>
                <LinearProgress variant="determinate" value={25} />
              </Box>
              <Box mt={2}>
                <Box display="flex" alignItems="center">
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Initial Consultation</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Medical Records Review
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <AccessTime color="warning" sx={{ mr: 1 }} />
                  <Typography variant="body2">Pre-Surgery Tests</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Other Cards would follow a similar pattern */}
      </Grid>
    </Box>
  )
}

function AppointmentsSection({ appointments }) {
  const [tabIndex, setTabIndex] = React.useState(0)

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  const upcomingAppointments = appointments?.filter(apt => 
    new Date(apt.appointmentDate) > new Date()
  ) || [];

  const pastAppointments = appointments?.filter(apt => 
    new Date(apt.appointmentDate) <= new Date()
  ) || [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Manage your medical consultations
      </Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="appointments tabs">
        <Tab label="Upcoming" />
        <Tab label="Past" />
        <Tab label="Calendar View" />
      </Tabs>
      <Box mt={3}>
        {tabIndex === 0 && (
          <Box>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardHeader
                    title={appointment.treatmentType || "Appointment"}
                    subheader={appointment.doctorName || "Doctor"}
                    action={<Chip label="Upcoming" color="primary" />}
                  />
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <Box display="flex" alignItems="center" mt={1}>
                          <AccessTime sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {new Date(appointment.appointmentDate).toLocaleDateString()} - {appointment.appointmentTime || "TBD"}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mt={1}>
                          <LocationOn sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {appointment.hospitalName || "Hospital"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Button
                          variant="contained"
                          startIcon={<Videocam />}
                          fullWidth
                          sx={{ mb: 1 }}
                        >
                          Join Call
                        </Button>
                        <Button variant="outlined" fullWidth>
                          Reschedule
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="body1" textAlign="center" color="text.secondary">
                    No upcoming appointments
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
        {tabIndex === 1 && (
          <Box>
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardHeader
                    title={appointment.treatmentType || "Appointment"}
                    subheader={appointment.doctorName || "Doctor"}
                    action={<Chip label="Completed" color="success" />}
                  />
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <Box display="flex" alignItems="center" mt={1}>
                          <AccessTime sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {new Date(appointment.appointmentDate).toLocaleDateString()} - {appointment.appointmentTime || "TBD"}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mt={1}>
                          <LocationOn sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {appointment.hospitalName || "Hospital"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Button variant="outlined" fullWidth>
                          View Details
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="body1" textAlign="center" color="text.secondary">
                    No past appointments
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

function DocumentsSection() {
  const [tabIndex, setTabIndex] = React.useState(0)

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Documents Vault
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Secure storage for all your medical and travel documents
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Upload />}>
          Upload New
        </Button>
      </Box>
      <Box display="flex" gap={2} mb={3}>
        <TextField fullWidth label="Search documents..." variant="outlined" />
        <Button variant="outlined" startIcon={<FilterList />}>
          Filter
        </Button>
      </Box>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="documents tabs">
        <Tab label="All Documents" />
        <Tab label="Medical" />
        <Tab label="Travel" />
        <Tab label="Insurance" />
      </Tabs>
      <Box mt={3}>
        {tabIndex === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardHeader
                  title="Blood Test Report"
                  subheader="Lab Results - Dec 10, 2024"
                  action={<Chip label="New" color="primary" />}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Uploaded by: Dr. Kumar
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: 2.4 MB
                  </Typography>
                  <Box display="flex" gap={2} mt={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Search />}
                      fullWidth
                    >
                      View
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      fullWidth
                    >
                      Download
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Add more document cards here */}
          </Grid>
        )}
      </Box>
    </Box>
  )
}

function MainContent({ activeSection, user, appointments }) {
  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <HomeOverview user={user} appointments={appointments} />
      case "appointments":
        return <AppointmentsSection appointments={appointments} />
      case "recovery":
        return <RecoverySection />
      case "documents":
        return <DocumentsSection />
      case "journey":
        return <JourneySection />
      case "postcare":
        return <PostCareSection />
      case "messages":
        return <MessagesSection />
      case "profile":
        return <ProfileSection />
      case "notifications":
        return <NotificationsSection />
      default:
        return <HomeOverview user={user} appointments={appointments} />
    }
  }

  return (
    <Box 
      component="main" 
      sx={{ 
        flexGrow: 1, 
        p: 3,
        width: { sm: `calc(100% - 240px)` },
        ml: { sm: '240px' }
      }}
    >
      <Toolbar /> {/* Spacer for the AppBar */}
      {renderContent()}
    </Box>
  )
}

export function MediyatraDashboard({ user, appointments, onLogout, error, loading }) {
  const [activeSection, setActiveSection] = React.useState("home")
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawerWidth = 240

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {error && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              bgcolor: 'error.main',
              color: 'error.contrastText',
              p: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}
        <AppBar 
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` }
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {navigationItems.find(item => item.id === activeSection)?.title}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={onLogout} sx={{ ml: 1 }}>
              <Logout />
            </IconButton>
            <Avatar sx={{ ml: 2, bgcolor: "secondary.main" }}>
              {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
            </Avatar>
          </Toolbar>
        </AppBar>
        {/* Mobile drawer */}
        <AppSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          variant="temporary"
        />
        {/* Desktop drawer */}
        <AppSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          open={true}
          onClose={() => {}}
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        />
        {loading ? (
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` }
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <MainContent activeSection={activeSection} user={user} appointments={appointments} />
        )}
      </Box>
    </ThemeProvider>
  )
}
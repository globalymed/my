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
  ChevronLeft, // Added for collapse button
  ChevronRight, // Added for collapse button
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
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import RecoverySection from "./RecoverySection.jsx"
import JourneySection from "./JourneySection.jsx"
import { ProfileSection } from "./ProfileSection.jsx"
import PostCareSection from "./PostCareSection.jsx"
import { NotificationsSection } from "./NotificationSection.jsx"
import MessagesSection from "./MessageSection.jsx"
import HomeOverview from "./HomeOverview.jsx"
import AppointmentsSection from "./AppointmentSection.jsx"
import DocumentsSection from "./DocumentSection.jsx"

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
  // { title: "Notifications", icon: <Notifications />, id: "notifications" },
]

function AppSidebar({
  activeSection,
  setActiveSection,
  sidebarOpen,
  onSidebarToggle,
  isMobile,
  drawerWidth,
  collapsedDrawerWidth,
}) {
  const theme = useTheme()

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={sidebarOpen}
      onClose={onSidebarToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: isMobile ? drawerWidth : (sidebarOpen ? drawerWidth : collapsedDrawerWidth),
        flexShrink: isMobile ? 0 : 1,
        "& .MuiDrawer-paper": {
          width: isMobile ? drawerWidth : (sidebarOpen ? drawerWidth : collapsedDrawerWidth),
          boxSizing: "border-box",
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Toolbar sx={{ backgroundColor: 'transparent', justifyContent: 'space-evenly' }}>
          {sidebarOpen && (
            <a href="https://medyatra.space" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src="/logo.png"
                  alt="MedYatra Logo"
                  sx={{ width: 40, height: 40, mr: 1 }}
                  imgProps={{
                    style: {
                      objectFit: 'contain',
                      objectPosition: 'center',
                      transform: 'scale(1.5)',
                    },
                  }}
                />
                <Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'black', lineHeight: 1.2 }}>
                    MedYatra
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ fontWeight: 400, color: 'black', fontSize: '0.7rem' }}
                  >
                    Patient Dashboard
                  </Typography>
                </Box>
              </Box>
            </a>

          )}
          <IconButton onClick={onSidebarToggle}>
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Toolbar>

        <Divider />

        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <List>
            {navigationItems.map(item => (
              <ListItem key={item.id} disablePadding dense>
                <ListItemButton
                  selected={activeSection === item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (isMobile) {
                      onSidebarToggle();
                    }
                  }}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    minHeight: 36,
                    justifyContent: sidebarOpen ? 'initial' : 'center',
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: 32,
                    color: 'inherit',
                    mr: sidebarOpen ? 1 : 'auto',
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{ fontSize: '0.8rem' }}
                    sx={{ opacity: sidebarOpen ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />

        <Box>
          <List>
            <ListItem disablePadding dense>
              <ListItemButton
                sx={{
                  px: 1.5,
                  py: 0.5,
                  minHeight: 36,
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                }}>
                <ListItemIcon sx={{
                  minWidth: 32,
                  mr: sidebarOpen ? 1 : 'auto',
                }}>
                  <Help />
                </ListItemIcon>
                <ListItemText
                  primary="Help & Support"
                  primaryTypographyProps={{ fontSize: '0.8rem' }}
                  sx={{ opacity: sidebarOpen ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding dense>
              <ListItemButton
                sx={{
                  px: 1.5,
                  py: 0.5,
                  minHeight: 36,
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                }}>
                <ListItemIcon sx={{
                  minWidth: 32,
                  mr: sidebarOpen ? 1 : 'auto',
                }}>
                  <Settings />
                </ListItemIcon>
                <ListItemText
                  primary="Settings"
                  primaryTypographyProps={{ fontSize: '0.8rem' }}
                  sx={{ opacity: sidebarOpen ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  )
}

function MainContent({ activeSection, user, appointments, isSidebarOpen, isMobile, drawerWidth, collapsedDrawerWidth }) {
  const theme = useTheme()

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <HomeOverview user={user} appointments={appointments} />
      case "appointments":
        return <AppointmentsSection appointments={appointments} />
      case "recovery":
        return <RecoverySection />
      case "documents":
        return <DocumentsSection user={user} />
      case "journey":
        return <JourneySection />
      case "postcare":
        return <PostCareSection />
      case "messages":
        return <MessagesSection />
      case "profile":
        return <ProfileSection user={user} />
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
        ml: isMobile ? 0 : (isSidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`),
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar />
      {renderContent()}
    </Box>
  )
}

export function PatientDashboard({ user, appointments, onLogout, error, loading }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeSection, setActiveSection] = React.useState("home")
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  const drawerWidth = 240
  const collapsedDrawerWidth = 60

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  }

  const handleNotificationClick = () => {
    setActiveSection('notifications');
  };

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
          elevation={0}
          sx={{
            backgroundColor: '#fff',
            color: '#000',
            borderBottom: '1px solid #e0e0e0',
            width: `calc(100% - ${isMobile ? 0 : (sidebarOpen ? drawerWidth : collapsedDrawerWidth)}px)`,
            ml: isMobile ? 0 : (sidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`),
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                edge="start"
                onClick={handleSidebarToggle}
                color="inherit"
                aria-label="menu"
                sx={{
                  display: isMobile || !sidebarOpen ? 'block' : 'none',
                }}
              >
                <MenuIcon />
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search..."
                  InputLabelProps={{ shrink: false }}
                  sx={{
                    width: 400,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                      backgroundColor: '#F0F2F5',
                      paddingLeft: 1,
                      '& fieldset': {
                        borderRadius: '50px',
                        borderColor: '#F0F2F5',
                      },
                      '&:hover fieldset': {
                        borderColor: '#ccc',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1976d2',
                        borderWidth: '2px',
                      },
                      '& input': {
                        boxShadow: 'none',
                        outline: 'none',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <IconButton>
                        <Search />
                      </IconButton>
                    ),
                  }}
                />
              </Box>

            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={onLogout}
                sx={{
                  textTransform: 'none',
                  bgcolor: 'error.main',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'error.dark',
                  }
                }}
              >
                Logout
              </Button>

              <IconButton
                color="inherit"
                onClick={handleNotificationClick} // Use the handler from props
                sx={{
                  backgroundColor: '#F0F2F5', // Or a theme color like 'grey.100'
                  color: '#333' // Set icon color explicitly if needed
                }}
              >
                <Badge badgeContent={4} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        <AppSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={handleSidebarToggle}
          isMobile={isMobile}
          drawerWidth={drawerWidth}
          collapsedDrawerWidth={collapsedDrawerWidth}
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
              width: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <MainContent
            activeSection={activeSection}
            user={user}
            appointments={appointments}
            isSidebarOpen={sidebarOpen}
            isMobile={isMobile}
            drawerWidth={drawerWidth}
            collapsedDrawerWidth={collapsedDrawerWidth}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}

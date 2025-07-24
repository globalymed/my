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
import RecoverySection from "./RecoverySection.jsx"
import JourneySection from "./JourneySection.jsx"
import { ProfileSection } from "./profile-section"
import PostCareSection from "./PostCareSection.jsx"
import { NotificationsSection } from "./notifications-section"
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


// Plan Journey Component - iframe for travel planning
const PlanJourney = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 120px)', 
        width: '100%'
      }}
    >      
      {/* Plan Flight or Hotel iframe - takes remaining height */}
      <Box sx={{ 
        flex: 1, 
        borderRadius: 2, 
        overflow: 'hidden', 
        boxShadow: 0,
        minHeight: '500px'
      }}>
        <iframe
          src="https://travel-9hf1.vercel.app/"
          title="Plan Flight or Hotel"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px',
          }}
          onError={(e) => {
            console.error('Iframe failed to load:', e);
          }}
        />
      </Box>
    </Box>
  );
};

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Toolbar sx={{ backgroundColor: 'transparent' }}>
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
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 700, color: 'black', lineHeight: 1.2 }}
            >
              MedYatra
            </Typography>
            <Typography
              variant="caption"
              component="div"
              sx={{
                fontWeight: 400,
                color: 'black',
                fontSize: '0.7rem',
                mt: '-2px',
              }}
            >
              Patient Dashboard
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Divider />

      {/* Main Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List>
          {navigationItems.map(item => (
            <ListItem key={item.id} disablePadding dense>
              <ListItemButton
                selected={activeSection === item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (variant === "temporary" && onClose) {
                    onClose(); // ✅ closes temporary drawer on item click
                  }
                }}
                sx={{ px: 1.5, py: 0.5, minHeight: 36 }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{ fontSize: '0.8rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>


      <Divider />

      {/* Bottom Support & Settings */}
      <Box>
        <List>
          <ListItem disablePadding dense>
            <ListItemButton sx={{ px: 1.5, py: 0.5, minHeight: 36 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Help />
              </ListItemIcon>
              <ListItemText
                primary="Help & Support"
                primaryTypographyProps={{ fontSize: '0.8rem' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding dense>
            <ListItemButton sx={{ px: 1.5, py: 0.5, minHeight: 36 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Settings />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{ fontSize: '0.8rem' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

    </Box>
  );


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

function MainContent({ activeSection, setActiveSection, user, appointments }) {
  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <HomeOverview user={user} appointments={appointments} setActiveSection={setActiveSection} />
      case "appointments":
        return <AppointmentsSection appointments={appointments} />
      case "recovery":
        return <RecoverySection />
      case "documents":
        return <DocumentsSection />
      case "plan-journey":
        return <PlanJourney />
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
        return <HomeOverview user={user} appointments={appointments} setActiveSection={setActiveSection} />
    }
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
      }}
    >
      <Toolbar /> {/* Spacer for the AppBar */}
      {renderContent()}
    </Box>
  )
}

export function MedyatraDashboard({ user, appointments, onLogout, error, loading }) {
  const [activeSection, setActiveSection] = React.useState("home")
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawerWidth = 240

  // console.log("User Data:", user);

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

        {/* Appbar */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: '#fff',
            color: '#000',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Left side: Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                edge="start"
                onClick={handleDrawerToggle}
                color="inherit"
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>

              {/* Search Box */}
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

            {/* Right side: Notifications, Logout, Avatar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit" sx={{
                backgroundColor: '#F0F2F5'
              }}>
                <Badge badgeContent={4} color="error">
                  <Notifications color="#F0F2F5" />
                </Badge>
              </IconButton>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>


        {/* Sidebar */}
        <AppSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          variant="temporary"
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
            setActiveSection={setActiveSection}
            user={user} 
            appointments={appointments} 
          />
        )}
      </Box>
    </ThemeProvider>
  )
}
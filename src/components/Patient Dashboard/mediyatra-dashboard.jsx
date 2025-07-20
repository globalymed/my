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

// function DocumentsSection() {
//   const [tabIndex, setTabIndex] = React.useState(0)

//   const handleTabChange = (event, newValue) => {
//     setTabIndex(newValue)
//   }

//   return (
//     <Box>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Box>
//           <Typography variant="h4" gutterBottom>
//             Documents Vault
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary">
//             Secure storage for all your medical and travel documents
//           </Typography>
//         </Box>
//         <Button variant="contained" startIcon={<Upload />}>
//           Upload New
//         </Button>
//       </Box>
//       <Box display="flex" gap={2} mb={3}>
//         <TextField fullWidth label="Search documents..." variant="outlined" />
//         <Button variant="outlined" startIcon={<FilterList />}>
//           Filter
//         </Button>
//       </Box>
//       <Tabs value={tabIndex} onChange={handleTabChange} aria-label="documents tabs">
//         <Tab label="All Documents" />
//         <Tab label="Medical" />
//         <Tab label="Travel" />
//         <Tab label="Insurance" />
//       </Tabs>
//       <Box mt={3}>
//         {tabIndex === 0 && (
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6} lg={4}>
//               <Card>
//                 <CardHeader
//                   title="Blood Test Report"
//                   subheader="Lab Results - Dec 10, 2024"
//                   action={<Chip label="New" color="primary" />}
//                 />
//                 <CardContent>
//                   <Typography variant="body2" color="text.secondary">
//                     Uploaded by: Dr. Kumar
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Size: 2.4 MB
//                   </Typography>
//                   <Box display="flex" gap={2} mt={2}>
//                     <Button
//                       variant="outlined"
//                       startIcon={<Search />}
//                       fullWidth
//                     >
//                       View
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       startIcon={<Download />}
//                       fullWidth
//                     >
//                       Download
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//             {/* Add more document cards here */}
//           </Grid>
//         )}
//       </Box>
//     </Box>
//   )
// }

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
          <MainContent activeSection={activeSection} user={user} appointments={appointments} />
        )}
      </Box>
    </ThemeProvider>
  )
}
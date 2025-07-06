import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Avatar,
  Tooltip,
  Badge
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TreatmentsInfo from '../components/TreatmentsInfo';
import Footer from '../components/Footer';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTreatmentsInfo, setShowTreatmentsInfo] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Modified navItems - Doctor Dashboard removed from main navigation
  const mainNavItems = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Free Consultation', path: '/consultation', icon: <ChatIcon /> },
    { name: 'Compare Cost', path: '/compare', icon: <InfoOutlinedIcon /> },
    { name: 'Plan Journey', path: '/plan', icon: <CalendarMonthIcon /> },
    { name: 'Treatment', path: '/treatment', icon: <DashboardIcon /> },
    { name: 'Contacts', path: '/contacts' },
    { name: 'Doctor? Here!', path: '/doctors' }
  ];

  // Items for the hamburger menu
  const drawerItems = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'AI Chat', path: '/chat', icon: <ChatIcon /> },
    { name: 'Know Your Treatment', path: null, icon: <InfoOutlinedIcon />, action: () => setShowTreatmentsInfo(true) },
    { name: 'Book Appointment', path: '/book', icon: <CalendarMonthIcon /> },
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Doctor Dashboard', path: '/doctor-login', icon: <LocalHospitalIcon /> }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path, action) => {
    if (path) {
      navigate(path);
    } else if (action) {
      action();
    }

    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 280, height: '100%', background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid rgba(0,0,0,0.08)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src="/logo192.png"
            alt="MedYatra Logo"
            sx={{ width: 40, height: 40 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            MedYatra
          </Typography>
        </Box>
        <IconButton onClick={toggleDrawer} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 2 }}>
        {drawerItems.map((item) => (
          <ListItem
            button
            key={item.name}
            onClick={() => handleNavigation(item.path, item.action)}
            sx={{
              mb: 1,
              mx: 1,
              borderRadius: 2,
              backgroundColor: isActive(item.path) ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.05)',
              }
            }}
          >
            <ListItemIcon sx={{
              color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.secondary,
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 600 : 500,
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          {new Date().getFullYear()} MedYatra
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          backgroundColor: '#52C7BE',
          backdropFilter: 'blur(20px)',
          borderRadius: 0  // Ensures no rounded corners
        }}
      >
        <Toolbar>

          {isMobile ? (
            <>
              {/* Hamburger menu for both mobile and desktop */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                <Avatar
                  src="/logo192.png"
                  alt="MedYatra Logo"
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                  MedYatra
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Notifications">
                  <IconButton color="inherit">
                    <Badge badgeContent={2} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/login')}
                  startIcon={<AccountCircleIcon />}
                  sx={{
                    ml: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    }
                  }}
                >
                  Login
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                {/* Left: Logo + Title */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src="/logo192.png" alt="MedYatra Logo" sx={{ width: 40, height: 40, mr: 1 }} />
                  <Box>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}
                    >
                      MedYatra
                    </Typography>
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{ fontWeight: 400, color: 'white', fontSize: '0.7rem', mt: '-2px' }}
                    >
                      Making Medical Travel Effortless
                    </Typography>
                  </Box>
                </Box>

                {/* Center: Navigation Items */}
                <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {mainNavItems.map((item) => (
                    <Typography
                      key={item.name}
                      onClick={() => handleNavigation(item.path, item.action)}
                      sx={{
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: isActive(item.path) ? 900 : 500,
                        fontSize: '0.875rem',
                        textDecoration: isActive(item.path) ? 'underline' : 'none',
                        textUnderlineOffset: '4px'
                      }}
                    >
                      {item.name}
                    </Typography>
                  ))}
                </Box>

                {/* Right: Login & Sign Up */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small" sx={{
                    color: '#000',
                    borderColor: '#fff',
                    backgroundColor: '#fff',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    border: 0,
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                      border: 0,
                    },
                  }}>
                    Login
                  </Button>
                  <Button variant="outlined" size="small" sx={{
                    backgroundColor: '#000',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    border: 0,
                    '&:hover': {
                      backgroundColor: '#444',
                      border: 0,
                    },
                  }}>
                    Sign Up
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>

      <Box maxWidth="100%" component="main" sx={{
        flexGrow: 1,
        background: 'linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: 'calc(100vh - 64px)',
        px: 0,
      }}>
        <Container
          maxWidth={false}
          disableGutters 
          sx={{ py: 3, px: 0 }}
        >
          {children}
        </Container>
      </Box>

      {/* footer */}

      <Footer />

      {/* Render TreatmentsInfo dialog when showTreatmentsInfo is true */}
      <TreatmentsInfo
        open={showTreatmentsInfo}
        onClose={() => setShowTreatmentsInfo(false)}
      />
    </Box>
  );
};

export default Layout;

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
import TreatmentsInfo from './TreatmentsInfo';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTreatmentsInfo, setShowTreatmentsInfo] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'AI Chat', path: '/chat', icon: <ChatIcon /> },
    { name: 'Know Your Treatment', path: null, icon: <InfoOutlinedIcon />, action: () => setShowTreatmentsInfo(true) },
    { name: 'Book Appointment', path: '/book', icon: <CalendarMonthIcon /> }
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
        {navItems.map((item) => (
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
      <AppBar position="sticky" color="default" elevation={0} sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)'
      }}>
        <Toolbar>
          {isMobile ? (
            <>
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
              <IconButton color="inherit">
                <Badge badgeContent={2} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                <Avatar 
                  src="/logo192.png" 
                  alt="MedYatra Logo" 
                  sx={{ width: 36, height: 36, mr: 1 }}
                />
                <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                  MedYatra
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    onClick={() => handleNavigation(item.path, item.action)}
                    sx={{
                      my: 2, 
                      px: 2,
                      color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
                      fontWeight: isActive(item.path) ? 600 : 500,
                      position: 'relative',
                      '&::after': isActive(item.path) ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '20%',
                        width: '60%',
                        height: '3px',
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '3px 3px 0 0'
                      } : {}
                    }}
                    startIcon={item.icon}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Notifications">
                  <IconButton color="inherit">
                    <Badge badgeContent={2} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Profile">
                  <IconButton color="inherit">
                    <AccountCircleIcon />
                  </IconButton>
                </Tooltip>
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
      
      <Box component="main" sx={{ 
        flexGrow: 1, 
        background: 'linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: 'calc(100vh - 64px)'
      }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>
      
      <Box component="footer" sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderTop: '1px solid rgba(0,0,0,0.08)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 0
          }}>
            <Typography variant="body2" color="text.secondary">
              {new Date().getFullYear()} MedYatra. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" color="text.secondary" component={Link} to="/privacy" sx={{ textDecoration: 'none' }}>
                Privacy Policy
              </Typography>
              <Typography variant="body2" color="text.secondary" component={Link} to="/terms" sx={{ textDecoration: 'none' }}>
                Terms of Service
              </Typography>
              <Typography variant="body2" color="text.secondary" component={Link} to="/contact" sx={{ textDecoration: 'none' }}>
                Contact Us
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Render TreatmentsInfo dialog when showTreatmentsInfo is true */}
      <TreatmentsInfo 
        open={showTreatmentsInfo} 
        onClose={() => setShowTreatmentsInfo(false)} 
      />
    </Box>
  );
};

export default Layout;

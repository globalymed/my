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
    Badge,
    ListItemButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Phone,
    Add,
    LocalHospital,
    SupportAgent,
    AttachMoney,
    Dashboard,
    Logout
} from '@mui/icons-material';
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

const Sidebar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showTreatmentsInfo, setShowTreatmentsInfo] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Modified navItems - Doctor Dashboard removed from main navigation
    const mainNavItems = [
        { name: 'Home', path: '/', icon: <HomeIcon /> },
        { name: 'Free Consultation', path: '/free-consultation', icon: <ChatIcon /> },
        { name: 'Ai chat',  path: '/chat', icon: <InfoOutlinedIcon /> },
        { name: 'Compare Cost', path: '/compare', icon: <AttachMoney /> },
        { name: 'Treatment', path: '/treatment', icon: <DashboardIcon /> },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Doctor Dashboard', path: '/doctors' }
    ];

    // Items for the hamburger menu
    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        {
            text: 'Treatments', icon: <LocalHospital />, path: '/treatment', action: () => {
                console.log("clicked");
                setShowTreatmentsInfo(true);
            }
        },
        { text: 'Free Consultation', icon: <SupportAgent />, path: '/free-consultation' },
        { text: 'AI Chat', icon: <ChatIcon />, path: '/chat' },
        { text: 'Compare Cost', icon: <AttachMoney />, path: '/compare' },
        { text: 'Contact Us', icon: <Phone />, path: '/contact' },
        { text: 'Dashboard', icon: <Dashboard />, path: '/login' },
        { text: 'Logout', icon: <Logout />, path: '/logout' },
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

    const drawerContent = (
        <Box sx={{ width: 280, height: '100%', bgcolor: '#1D4645', color: 'white' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid rgba(0,0,0,0.08)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                        src="/logo.png"
                        alt="MedYatra Logo"
                        sx={{ width: 40, height: 40, mr: 1 }}
                        imgProps={{
                            style: {
                                objectFit: 'contain',
                                objectPosition: 'center',
                                transform: 'scale(1.5)', // zoom the image a bit
                            },
                        }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                        MedYatra
                    </Typography>
                </Box>
                <IconButton onClick={toggleDrawer} edge="end" sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List sx={{ px: 2, py: 1 }}>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                        {item.isButton ? (
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={item.action}
                                startIcon={item.icon}
                                sx={{
                                    bgcolor: 'transparent',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        borderColor: '#FFF',
                                    },
                                    borderColor: '#FFF',
                                    borderRadius: 2,
                                    py: 1,
                                    justifyContent: 'flex-start',
                                    textTransform: 'none'
                                }}
                            >
                                {drawerOpen && item.text}
                            </Button>
                        ) : (
                            <ListItemButton
                                onClick={() => {
                                    if (item.path) {
                                        handleNavigation(item.path);
                                    } else if (item.action) {
                                        item.action();
                                    }
                                }}
                                sx={{
                                    borderRadius: 2,
                                    color: 'white',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                                    ...(location.pathname === item.path && { bgcolor: 'rgba(255,255,255,0.2)' }),
                                }}
                            >
                                <Box sx={{ mr: drawerOpen ? 2 : 0 }}>{item.icon}</Box>
                                {drawerOpen && (
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: '0.95rem',
                                            fontWeight: location.pathname === item.path ? 600 : 400
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        )}
                    </ListItem>
                ))}
            </List>
            <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
                <Typography variant="body2" color="white" align="center">
                    {new Date().getFullYear()} MedYatra
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
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
                                    src="/logo.png"
                                    alt="MedYatra Logo"
                                    sx={{ width: 40, height: 40, mr: 1 }}
                                    imgProps={{
                                        style: {
                                            objectFit: 'contain',
                                            objectPosition: 'center',
                                            transform: 'scale(1.5)', // zoom the image a bit
                                        },
                                    }}
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
                                    sx={{
                                        textTransform: 'none',
                                        borderColor: '#2f2f2f',
                                        color: '#fff',
                                        backgroundColor: '#2f2f2f',
                                        borderRadius: 3,
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        px: 2,
                                        mx: 1,
                                        py: 1.2,
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: '#111',
                                            borderColor: '#111',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                        },
                                    }}
                                    onClick={() => navigate('/newLogin')}
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
                                    <Avatar
                                        src="/logo.png"
                                        alt="MedYatra Logo"
                                        sx={{ width: 40, height: 40, mr: 1 }}
                                        imgProps={{
                                            style: {
                                                objectFit: 'contain',
                                                objectPosition: 'center',
                                                transform: 'scale(1.5)', // zoom the image a bit
                                            },
                                        }}
                                    />
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
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            color: '#2f2f2f',
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
                                        }}
                                        onClick={() => navigate('/newLogin')}
                                    >
                                        Login
                                    </Button>
                                    <Button variant="outlined" size="small" sx={{
                                        backgroundColor: '#2f2f2f',
                                        color: '#fff',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        border: 0,
                                        '&:hover': {
                                            backgroundColor: '#444',
                                            border: 0,
                                        },
                                    }}
                                        onClick={() => navigate('/newSignup')}
                                    >
                                        Sign Up
                                    </Button>
                                </Box>
                            </Box>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                open={drawerOpen}
                onClose={toggleDrawer}
                sx={{
                    // width: sidebarOpen ? drawerWidth : 80,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    '& .MuiDrawer-paper': {
                        // width: sidebarOpen ? drawerWidth : 80,
                        overflowX: 'hidden',
                        transition: 'width 0.3s',
                        bgcolor: '#1D4645',
                        color: 'white',
                        borderRadius: '0px 8px 8px 0px',
                        boxSizing: 'border-box',
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    )
}

export default Sidebar
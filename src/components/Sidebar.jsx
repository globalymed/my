import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
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
    ListItemButton,
    Menu,
    MenuItem,
    Collapse
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Phone,
    LocalHospital,
    SupportAgent,
    AttachMoney,
    Dashboard,
    Logout,
    ArrowDropDown,
    ExpandLess,
    ExpandMore,
    Article,
    MedicalServices,
    ColorLens
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { TbDental } from 'react-icons/tb';
import { GiHairStrands } from 'react-icons/gi';

const Sidebar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const [subMenuOpen, setSubMenuOpen] = useState(false);

    const treatmentSubMenu = [
        { name: 'Blog', path: '/treatment/blog', icon: <Article /> },
        { name: 'Dental', path: '/treatment/dental', icon: <TbDental size={24} /> },
        { name: 'IVF', path: '/treatment/ivf', icon: <MedicalServices /> },
        { name: 'Hair', path: '/treatment/hair', icon: <GiHairStrands /> },
        { name: 'Cosmetics', path: '/treatment/cosmetics', icon: <ColorLens /> }
    ];

    const mainNavItems = [
        { name: 'Home', path: '/' },
        { name: 'Free Consultation', path: '/free-consultation' },
        { name: 'Compare Cost', path: '/compare-cost' },
        { name: 'Plan Journey', path: '/plan-journey' },
        { name: 'Treatment', path: '/treatment', submenu: treatmentSubMenu },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Doctor? Here!', path: '/doctor-login' }
    ];

    // Items for the hamburger menu
    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Treatments', icon: <LocalHospital />, submenu: treatmentSubMenu },
        { text: 'Free Consultation', icon: <SupportAgent />, path: '/free-consultation' },
        { text: 'AI Chat', icon: <ChatIcon />, path: '/chat' },
        { text: 'Compare Cost', icon: <AttachMoney />, path: '/compare-cost' },
        { text: 'Contact Us', icon: <Phone />, path: '/contact' },
        { text: 'Dashboard', icon: <Dashboard />, path: '/login' },
        { text: 'Logout', icon: <Logout />, path: '/logout' },
    ];

    const treatmentPaths = ['/treatment', '/treatment/blog', '/treatment/dental', '/treatment/ivf', '/treatment/hair', '/treatment/cosmetics'];

    const isActive = (path) => {
        if (path === '/treatment') {
            return treatmentPaths.some(p => location.pathname.startsWith(p));
        }
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const toggleSubMenu = () => setSubMenuOpen(!subMenuOpen);

    const handleNavigation = (path) => {
        if (path) navigate(path);
        handleMenuClose();
        if (isMobile) setDrawerOpen(false);
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
                {menuItems.map((item) => (
                    item.submenu ? (
                        <React.Fragment key={item.text}>
                            <ListItemButton onClick={toggleSubMenu} sx={{ borderRadius: 2, mb: 0.5 }}>
                                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                                {subMenuOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={subMenuOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.submenu.map(subItem => (
                                        <ListItemButton key={subItem.name} sx={{ pl: 4, borderRadius: 2, my: 0.5 }} onClick={() => handleNavigation(subItem.path)}>
                                            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{subItem.icon}</ListItemIcon>
                                            <ListItemText primary={subItem.name} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    ) : (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton onClick={() => handleNavigation(item.path)} sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    )
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
                                {/* <Tooltip title="Notifications"> */}
                                <IconButton color="inherit">
                                    <Badge badgeContent={2} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                {/* </Tooltip> */}
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
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>

                            </Box>
                        </>
                    ) : (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                {/* Left: Logo + Title */}
                                <a href="https://medyatra.space" style={{ textDecoration: 'none' }}>
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
                                </a>

                                {/* Center: Navigation Items */}
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    {mainNavItems.map((item) => (
                                        item.submenu ? (
                                            <Box key={item.name} onMouseLeave={handleMenuClose}>
                                                <Typography
                                                    aria-owns={anchorEl ? 'treatment-menu' : undefined}
                                                    aria-haspopup="true"
                                                    onMouseEnter={handleMenuOpen}
                                                    sx={{
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        fontWeight: isActive(item.path) ? 900 : 500,
                                                        fontSize: '0.875rem',
                                                        textDecoration: isActive(item.path) ? 'underline' : 'none',
                                                        textUnderlineOffset: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    {item.name}
                                                    <ArrowDropDown sx={{ ml: 0.5 }} />
                                                </Typography>
                                                <Menu
                                                    id="treatment-menu"
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleMenuClose}
                                                    MenuListProps={{ 'aria-labelledby': 'treatment-button', onMouseLeave: handleMenuClose }}
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                                                >
                                                    {item.submenu.map(subItem => (
                                                        <MenuItem key={subItem.name} onClick={() => handleNavigation(subItem.path)}>
                                                            {subItem.name}
                                                        </MenuItem>
                                                    ))}
                                                </Menu>
                                            </Box>
                                        ) : (
                                            <Typography key={item.name} onClick={() => handleNavigation(item.path)} sx={{ color: 'white', cursor: 'pointer', fontWeight: isActive(item.path) ? 900 : 500, textDecoration: isActive(item.path) ? 'underline' : 'none', textUnderlineOffset: '4px' }}>
                                                {item.name}
                                            </Typography>
                                        )
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
                                        onClick={() => navigate('/login')}
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
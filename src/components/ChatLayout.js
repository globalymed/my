import React from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Button,
    IconButton,
    Avatar,
    useTheme,
    useMediaQuery,
    Toolbar,
    Divider,
} from '@mui/material';
import {
    Home as HomeIcon,
    LocalHospital as HospitalIcon,
    Chat as ChatIcon,
    Phone as PhoneIcon,
    AttachMoney,
    Dashboard,
    Add as AddIcon,
    SupportAgent,
    Menu as MenuIcon,
    ChevronLeft,
    ChevronRight
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import AIChatFinal from './AIChatFinal';

const drawerWidth = 240;

const ChatLayout = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [chatKey, setChatKey] = React.useState(0);

    const menuItems = [
        { text: 'New Thread', icon: <AddIcon />, action: () => setChatKey(prev => prev + 1), isButton: true },
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Treatments', icon: <HospitalIcon />, path: '/treatment' },
        { text: 'Free Consultation', icon: <SupportAgent />, path: '/consultation' },
        { text: 'AI Chat', icon: <ChatIcon />, path: '/chat' },
        { text: 'Compare cost', icon: <AttachMoney />, path: '/compare' },
        { text: 'Contact', icon: <PhoneIcon />, path: '/contact' },
        { text: 'Dashboard', icon: <Dashboard />, path: '/login' },
    ];

    const handleNavigation = (path) => {
        if (path) navigate(path);
    };

    const drawerContent = (
        <Box sx={{ height: '100%', bgcolor: '#1D4645', color: 'white' }}>
            <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
                {sidebarOpen && !isMobile && (
                    <Typography variant="h6" noWrap>
                        MedYatra
                    </Typography>
                )}
                <IconButton
                    onClick={() => {
                        if (isMobile) setMobileOpen(false);
                        else setSidebarOpen(!sidebarOpen);
                    }}
                    sx={{ color: 'white' }}
                >
                    <ChevronLeft />
                </IconButton>
            </Toolbar>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

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
                                {sidebarOpen && item.text}
                            </Button>
                        ) : (
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    color: 'white',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                                    ...(location.pathname === item.path && { bgcolor: 'rgba(255,255,255,0.2)' }),
                                }}
                            >
                                <Box sx={{ mr: sidebarOpen ? 2 : 0 }}>{item.icon}</Box>
                                {sidebarOpen && (
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
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{
                        keepMounted: true,
                        BackdropProps: {
                            sx: { backgroundColor: 'rgba(29,70,69,0.6)', backdropFilter: 'blur(4px)' },
                        },
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            bgcolor: '#1D4645',
                            color: 'white',
                            borderRadius: '0px 8px 8px 0px',
                        }
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    open={sidebarOpen}
                    sx={{
                        width: sidebarOpen ? drawerWidth : 80,
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                        '& .MuiDrawer-paper': {
                            width: sidebarOpen ? drawerWidth : 80,
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
            )}

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    transition: 'margin 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflow: 'hidden',
                    bgcolor: '#F2F1EB'
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: {
                            xs: 'space-between',
                            md: 'flex-end'
                        },
                        alignItems: 'center',
                        p: 2,
                        bgcolor: '#F2F1EB',
                        minHeight: 64,
                    }}
                >
                    {/* Hamburger for mobile */}
                    {isMobile && (
                        <IconButton
                            edge="start"
                            onClick={() => setMobileOpen(true)}
                        >
                            <MenuIcon fontSize="large" />
                        </IconButton>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Button variant="outlined" sx={{ textTransform: 'none', borderColor: '#ddd', color: '#666', borderRadius: 5 }}>
                            Login
                        </Button>
                        <Button
                            variant="contained"
                            color="inherit"
                            sx={{
                                textTransform: 'none',
                                bgcolor: '#1D4645',
                                '&:hover': { bgcolor: '#111' },
                                borderRadius: 5,
                                color: 'white',
                            }}
                        >
                            Sign up
                        </Button>
                        <Avatar sx={{ bgcolor: '#1D4645', width: 40, height: 40 }}>
                            <Typography sx={{ fontSize: '1rem' }}>U</Typography>
                        </Avatar>
                    </Box>
                </Box>

                {/* Chat Content */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '800px',
                        mx: 'auto',
                        width: '100%',
                        p: 3,
                        overflow: 'hidden',
                        overflowY: 'auto',
                        backgroundColor: '#F2F1EB',
                    }}
                >
                    <AIChatFinal key={chatKey} />
                </Box>
            </Box>
        </Box>
    );
};

export default ChatLayout;

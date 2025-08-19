import React from 'react';
import { Dialog, Slide, Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Button } from '@mui/material';
import {
    HomeOutlined,
    PeopleOutline,
    GroupOutlined,
    SettingsOutlined,
    Close,
    Logout,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom'; // From react-router-dom
import { useAuth } from './auth/context.js'; // Corrected relative import for useAuth


// Define navigation items for the sidebar
const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeOutlined }, // Updated href for admin dashboard
    { name: 'Doctors', href: '/admin/dashboard/doctors', icon: PeopleOutline },
    // 'Admins' link is only visible if the user has 'canManageAdmins' permission
    // { name: 'Admins', href: '/admin/dashboard/admins', icon: GroupOutlined, permission: 'canManageAdmins' },
    { name: 'Settings', href: '/admin/dashboard/settings', icon: SettingsOutlined },
];

/**
 * Sidebar component for dashboard navigation.
 * Includes both mobile and desktop versions.
 * @param {Object} props - Component props.
 * @param {boolean} props.sidebarOpen - State to control mobile sidebar visibility.
 * @param {function} props.setSidebarOpen - Function to update mobile sidebar visibility.
 */
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { pathname } = useLocation(); // Get current path for active link styling
    const { user, signOut } = useAuth(); // Get authenticated user and signOut function

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="right" ref={ref} {...props} />;
    });

    const handleSignOut = async () => {
        await signOut();
        // The AuthGuard will handle redirection to login page after sign out
    };

    return (
        <>
            {/* Mobile sidebar (hidden by default on large screens) */}
            <Dialog
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                TransitionComponent={Transition}
                PaperProps={{
                    sx: {
                        width: '100%',
                        maxWidth: 280, // Max width for mobile sidebar
                        height: '100%',
                        m: 0, // No margin
                        borderRadius: 0, // No border radius
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        outline: 'none',
                    }
                }}
                sx={{ display: { xs: 'block', lg: 'none' } }} // Show only on mobile
            >
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: -48, // Offset to place close button outside
                    pt: 2
                }}>
                    <IconButton
                        sx={{
                            ml: 1,
                            bgcolor: 'rgba(0,0,0,0.5)', // Dark background for contrast
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                        }}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <Close sx={{ color: 'white' }} />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, pt: 5, pb: 4 }}>
                    <Box sx={{ display: 'flex', flexShrink: 0, alignItems: 'center', px: 2 }}>
                        {/* Placeholder for your logo */}
                        {/* <img
                            className="h-8 w-auto"
                            src="/admin-logo.png" // Path to your logo in the public folder
                            alt="Admin Dashboard Logo"
                        /> */}
                        <Typography variant="h6" sx={{ ml: 1.5, fontWeight: 'bold', color: 'text.primary' }}>Admin Panel</Typography>
                    </Box>
                    <List component="nav" sx={{ mt: 3, flexGrow: 1, px: 1 }}>
                        {navigation.map((item) => (
                            // Render navigation item only if user has required permission or no permission is specified
                            (!item.permission || (user && user.permissions && user.permissions[item.permission])) && (
                                <ListItem key={item.name} disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        to={item.href}
                                        selected={pathname === item.href}
                                        onClick={() => setSidebarOpen(false)} // Close sidebar on link click
                                        sx={{
                                            borderRadius: '8px',
                                            my: 0.5,
                                            '&.Mui-selected': {
                                                bgcolor: 'grey.100', // Active link background
                                                color: 'text.primary',
                                                '& .MuiListItemIcon-root': {
                                                    color: 'grey.500', // Active icon color
                                                },
                                            },
                                            '&:hover': {
                                                bgcolor: 'grey.50', // Hover background
                                                color: 'text.primary',
                                                '& .MuiListItemIcon-root': {
                                                    color: 'grey.500', // Hover icon color
                                                },
                                            },
                                            color: 'grey.600', // Inactive text color
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40, color: 'grey.400' }}>
                                            <item.icon />
                                        </ListItemIcon>
                                        <ListItemText primary={item.name} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        ))}
                    </List>
                </Box>
                {/* Mobile sidebar Sign Out button */}
                <Box sx={{ flexShrink: 0, borderTop: 1, borderColor: 'grey.200', p: 2 }}>
                    <Button
                        onClick={handleSignOut}
                        startIcon={<Logout />}
                        sx={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            py: 1,
                            borderRadius: '8px',
                            color: 'grey.600',
                            '&:hover': {
                                bgcolor: 'grey.50',
                                color: 'grey.900',
                                '& .MuiSvgIcon-root': { color: 'grey.500' }
                            },
                            '& .MuiSvgIcon-root': { mr: 1, color: 'grey.400' }
                        }}
                    >
                        Sign Out
                    </Button>
                </Box>
            </Dialog>

            {/* Desktop sidebar (always visible on large screens) */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexShrink: 0 }}>
                <Box sx={{ width: 256, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'auto', borderRight: 1, borderColor: 'grey.200', bgcolor: 'background.paper', pt: 5, pb: 4 }}>
                        <Box sx={{ display: 'flex', flexShrink: 0, alignItems: 'center', px: 2 }}>
                            {/* Placeholder for your logo */}
                            {/* <img
                                className="h-8 w-auto"
                                src="/admin-logo.png" // Path to your logo in the public folder
                                alt="Admin Dashboard Logo"
                            /> */}
                            <Typography variant="h6" sx={{ ml: 1.5, fontWeight: 'bold', color: 'text.primary' }}>Admin Panel</Typography>
                        </Box>
                        <List component="nav" sx={{ mt: 3, flexGrow: 1, px: 1 }}>
                            {navigation.map((item) => (
                                // Render navigation item only if user has required permission or no permission is specified
                                (!item.permission || (user && user.permissions && user.permissions[item.permission])) && (
                                    <ListItem key={item.name} disablePadding>
                                        <ListItemButton
                                            component={Link}
                                            to={item.href}
                                            selected={pathname === item.href}
                                            sx={{
                                                borderRadius: '8px',
                                                my: 0.5,
                                                '&.Mui-selected': {
                                                    bgcolor: 'grey.100',
                                                    color: 'text.primary',
                                                    '& .MuiListItemIcon-root': {
                                                        color: 'grey.500',
                                                    },
                                                },
                                                '&:hover': {
                                                    bgcolor: 'grey.50',
                                                    color: 'text.primary',
                                                    '& .MuiListItemIcon-root': {
                                                        color: 'grey.500',
                                                    },
                                                },
                                                color: 'grey.600',
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40, color: 'grey.400' }}>
                                                <item.icon />
                                            </ListItemIcon>
                                            <ListItemText primary={item.name} />
                                        </ListItemButton>
                                    </ListItem>
                                )
                            ))}
                        </List>
                    </Box>
                    {/* Desktop sidebar Sign Out button */}
                    <Box sx={{ flexShrink: 0, borderTop: 1, borderColor: 'grey.200', p: 2 }}>
                        <Button
                            onClick={handleSignOut}
                            startIcon={<Logout />}
                            sx={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                py: 1,
                                borderRadius: '8px',
                                color: 'grey.600',
                                '&:hover': {
                                    bgcolor: 'grey.50',
                                    color: 'grey.900',
                                    '& .MuiSvgIcon-root': { color: 'grey.500' }
                                },
                                '& .MuiSvgIcon-root': { mr: 1, color: 'grey.400' }
                            }}
                        >
                            Sign Out
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Sidebar;
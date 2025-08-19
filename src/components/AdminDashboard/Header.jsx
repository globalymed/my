import React, { Fragment, useState } from 'react';
import { IconButton, Box, Typography, Avatar, Menu, MenuItem, Tooltip, Button } from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications,
    ArrowDropDown,
} from '@mui/icons-material'; // Importing icons directly from MUI
import { Link } from 'react-router-dom'; // For profile/settings links
import { useAuth } from './auth/context.js'; // Corrected relative import for useAuth

const Header = ({ setSidebarOpen }) => {
    const { user, signOut } = useAuth(); // Get authenticated user and signOut function
    const [anchorEl, setAnchorEl] = useState(null); // State for controlling the profile dropdown menu

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        await signOut();
        handleMenuClose();
        // The AuthGuard will handle redirection to login page after sign out
    };

    return (
        <Box sx={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            height: 64,
            flexShrink: 0,
            borderBottom: 1,
            borderColor: 'grey.200',
            bgcolor: 'background.paper',
            boxShadow: { lg: 'none', xs: '0px 1px 2px rgba(0,0,0,0.05)' } // Shadow only on mobile
        }}>
            {/* Mobile sidebar toggle button */}
            <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={() => setSidebarOpen(true)}
                sx={{
                    mr: 2,
                    display: { lg: 'none' }, // Only visible on mobile
                    borderRight: 1,
                    borderColor: 'grey.200',
                    borderRadius: 0,
                    p: '0 16px', // Match original padding
                    color: 'grey.600',
                    '&:hover': {
                        bgcolor: 'transparent' // No hover background
                    }
                }}
            >
                <MenuIcon />
            </IconButton>

            {/* Main content area of the header */}
            <Box sx={{
                display: 'flex',
                flexGrow: 1,
                justifyContent: 'space-between',
                px: { xs: 2, sm: 3, lg: 4 }, // Responsive padding
                maxWidth: { lg: 'lg' }, // Max width for content on large screens
                mx: { lg: 'auto' }
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Typography variant="h6" component="h1" sx={{ fontWeight: 'semibold', color: 'text.primary' }}>
                        Dashboard
                    </Typography>
                </Box>
                <Box sx={{ ml: { xs: 2, lg: 3 }, display: 'flex', alignItems: 'center' }}>
                    {/* Notifications button */}
                    <Tooltip title="View notifications">
                        <IconButton
                            sx={{
                                p: 1,
                                color: 'grey.400',
                                '&:hover': { color: 'grey.500' }
                            }}
                        >
                            <Notifications />
                        </IconButton>
                    </Tooltip>

                    {/* Profile dropdown menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            elevation: 8,
                            sx: {
                                mt: 1.5,
                                width: 180,
                                borderRadius: '8px',
                                overflow: 'visible',
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem component={Link} to="#" onClick={handleMenuClose}>Your Profile</MenuItem>
                        <MenuItem component={Link} to="#" onClick={handleMenuClose}>Settings</MenuItem>
                        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                    </Menu>
                    <Button
                        onClick={handleMenuOpen}
                        sx={{
                            ml: 1.5,
                            borderRadius: '9999px', // Full rounded for button
                            p: { xs: '6px', lg: '8px 16px' }, // Responsive padding
                            color: 'text.primary',
                            bgcolor: 'background.paper',
                            '&:hover': {
                                bgcolor: 'grey.50'
                            },
                            textTransform: 'none', // Prevent uppercase
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar
                            alt="User Avatar"
                            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=random&color=fff&size=128`}
                            sx={{ width: 32, height: 32 }}
                        />
                        <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', lg: 'block' }, fontWeight: 'medium' }}>
                            {user?.displayName || user?.email}
                        </Typography>
                        <ArrowDropDown sx={{ ml: 0.5, display: { xs: 'none', lg: 'block' }, color: 'grey.400' }} />
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Header;
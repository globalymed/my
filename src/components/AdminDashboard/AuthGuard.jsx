import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // From react-router-dom
import { Box, CircularProgress, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // For access denied icon
import { useAuth } from './auth/context.js'; // Corrected relative import for useAuth

/**
 * A component that guards its children based on authentication status and user permissions.
 * Redirects to login if not authenticated. Displays access denied message if permissions/roles are insufficient.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered if authenticated and authorized.
 * @param {string} [props.requiredPermission] - The specific permission required (e.g., 'canManageAdmins').
 * @param {'admin'|'super_admin'} [props.requiredRole] - The specific role required (e.g., 'super_admin').
 */
export const AuthGuard = ({
    children,
    requiredPermission,
    requiredRole
}) => {
    const { user, loading } = useAuth(); // Get user and loading state from auth context
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        // If not loading and no user is authenticated, redirect to admin login
        if (!loading && !user) {
            navigate('/admin/login'); // Redirect to admin login
        }
    }, [user, loading, navigate]); // Re-run effect if user, loading, or navigate changes

    // Display a loading spinner while authentication state is being determined
    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.50',
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} color="primary" sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">Loading authentication...</Typography>
                </Box>
            </Box>
        );
    }

    // If user is null after loading, it means they are not authenticated (or not an active admin).
    // The redirect in useEffect should handle this, so we return null here to prevent content flicker.
    if (!user) {
        return null;
    }

    // Check role requirement:
    // If a specific role is required AND the user's role does not match AND the user is NOT a super_admin.
    // Super admin always bypasses specific role checks for other roles.
    if (requiredRole && user.role !== requiredRole && user.role !== 'super_admin') {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.50',
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <WarningAmberIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>Access Denied</Typography>
                    <Typography variant="body1" color="text.secondary">You do not have the required role to access this page.</Typography>
                </Box>
            </Box>
        );
    }

    // Check permission requirement:
    // If a specific permission is required AND the user's permissions do not include it.
    if (requiredPermission && (!user.permissions || !user.permissions[requiredPermission])) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.50',
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <WarningAmberIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>Permission Denied</Typography>
                    <Typography variant="body1" color="text.secondary">You do not have permission to perform this action or view this content.</Typography>
                </Box>
            </Box>
        );
    }

    // If all checks pass, render the children (the protected content)
    return <>{children}</>;
};

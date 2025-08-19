import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/AdminDashboard/Sidebar.jsx'; // Relative import for Sidebar
import Header from '../components/AdminDashboard/Header.jsx';   // Relative import for Header

const DashboardLayout = ({ children }) => {
    // State to control the visibility of the mobile sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'grey.100' }}>
            {/* Sidebar component, responsible for navigation */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1, // Allows content to take remaining width
                overflow: 'hidden', // Ensures content doesn't overflow
            }}>
                {/* Header component, contains user profile and mobile menu toggle */}
                <Header setSidebarOpen={setSidebarOpen} />

                {/* Main content area for the dashboard pages */}
                <Box component="main" sx={{
                    flexGrow: 1,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    bgcolor: 'grey.100',
                    p: { xs: 2, sm: 3, lg: 4 } // Responsive padding
                }}>
                    {/* Container for page-specific content with consistent padding */}
                    <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
                        {children} {/* Render the content of the current dashboard page */}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
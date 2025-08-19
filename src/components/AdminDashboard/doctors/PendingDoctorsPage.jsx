import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Replaces ArrowLeftIcon
import { Link } from 'react-router-dom'; // For navigation

// Assuming this component exists and is adapted to Material-UI
import PendingDoctors from './PendingDoctors.jsx'; // Relative import for PendingDoctors

/**
 * Page to display all doctors currently pending verification.
 * Renders the PendingDoctors component.
 */
export default function PendingDoctorsPage() {
    return (
        <Box sx={{ '& > :not(style)': { mb: 4 } }}> {/* Adds bottom margin to direct children */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}> {/* Uses flexbox for alignment */}
                <Button
                    component={Link} // Use Link for navigation
                    to="/admin/dashboard/doctors" // Navigate back to all doctors page
                    variant="outlined" // Outlined button style
                    sx={{ color: 'grey.700', borderColor: 'grey.300', '&:hover': { bgcolor: 'grey.100' } }} // Styling
                    startIcon={<ArrowBackIcon />} // Material-UI icon
                >
                    Back to All Doctors
                </Button>
            </Box>
            {/* PendingDoctors component to fetch and list pending doctors */}
            <PendingDoctors />
        </Box>
    );
}

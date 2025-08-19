import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom'; // To get URL parameters

// Assuming this component exists and is adapted to Material-UI
import DoctorDetails from './DoctorDetails.jsx'; // Relative import for DoctorDetails

/**
 * Dynamic page to display detailed information for a single doctor.
 * The doctor's ID is extracted from the URL parameters.
 * @param {Object} props - Component props (not directly used here as useParams is used).
 * @param {Object} props.params - Object containing route parameters (replaced by useParams).
 * @param {string} props.params.id - The ID of the doctor from the URL.
 */
export default function SingleDoctorPage() {
    // Use useParams hook to extract the 'id' parameter from the URL
    const { id: doctorId } = useParams();

    // If doctorId is not available (e.g., URL malformed), display a message
    if (!doctorId) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 16rem)', // Adjust height
                p: 3
            }}>
                <Typography variant="body1" color="text.secondary">Doctor ID not provided.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ '& > :not(style)': { mb: 4 } }}> {/* Adds bottom margin to direct children */}
            {/* DoctorDetails component fetches and displays the doctor's information */}
            {/* Pass the extracted doctorId to the DoctorDetails component */}
            <DoctorDetails doctorId={doctorId} />
        </Box>
    );
}

// ---

// src/app/dashboard/doctors/PendingDoctorsPage.jsx

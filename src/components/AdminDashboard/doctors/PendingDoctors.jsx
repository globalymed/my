import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh'; // Replaces ArrowPathIcon

// Assuming this component exists and is adapted to Material-UI
import DoctorsList from './DoctorsList.jsx'; // Relative import for DoctorsList
import { getPendingDoctors } from '../../../firebase.js'; // Assuming getPendingDoctors is exported from firebase.js or a dedicated doctorOperations file.

/**
 * Component to display a list of doctors pending verification.
 * Fetches data specifically for unverified doctors.
 */
const PendingDoctors = () => {
    // State to store the list of pending doctors
    const [doctors, setDoctors] = useState([]);
    // State to manage loading status
    const [loading, setLoading] = useState(true);
    // State to manage error messages
    const [error, setError] = useState(null);

    /**
     * Fetches pending doctor data from Firebase.
     */
    const fetchPendingDoctors = async () => {
        setLoading(true); // Set loading to true before fetching data
        setError(null); // Clear any previous errors

        try {
            // Call the function to get pending doctors
            const pendingDocs = await getPendingDoctors();
            setDoctors(pendingDocs); // Update state with fetched pending doctors
        } catch (err) {
            console.error('Error fetching pending doctors:', err);
            setError('Failed to load pending doctors. Please try again.'); // Set error message
        } finally {
            setLoading(false); // Set loading to false after data fetching completes
        }
    };

    // useEffect hook to fetch pending doctors data when the component mounts
    useEffect(() => {
        fetchPendingDoctors();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Render loading state
    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 16rem)', // Adjust height to fit content area
                p: 3 // Padding
            }}>
                <CircularProgress size={60} color="primary" sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">Loading pending doctors...</Typography>
            </Box>
        );
    }

    // Render error state
    if (error) {
        return (
            <Alert severity="error" sx={{ borderRadius: '8px', mb: 2, p: 2 }}>
                <Typography variant="h6" component="strong">Error</Typography>
                <Typography>{error}</Typography>
            </Alert>
        );
    }

    return (
        <Box sx={{ '& > :not(style)': { mb: 4 } }}> {/* Adds bottom margin to direct children */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Pending Doctors
                </Typography>
                <Button
                    onClick={fetchPendingDoctors}
                    disabled={loading} // Disable button during loading
                    variant="contained"
                    sx={{
                        bgcolor: 'success.main',
                        '&:hover': { bgcolor: 'success.dark' },
                        color: 'white',
                        // Conditional styling for spin animation
                        '& .MuiSvgIcon-root': loading ? { animation: 'spin 1s linear infinite' } : {}
                    }}
                    startIcon={<RefreshIcon />} // Material-UI icon
                >
                    Refresh
                </Button>
            </Box>
            {/* DoctorsList component to display the fetched pending doctors */}
            <DoctorsList doctors={doctors} onRefresh={fetchPendingDoctors} />
        </Box>
    );
};

export default PendingDoctors;

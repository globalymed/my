import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh'; // Replaces ArrowPathIcon
import AddIcon from '@mui/icons-material/Add'; // Replaces PlusIcon
import { Link } from 'react-router-dom'; // For navigation between routes

// Assuming these are correctly imported or adapted to Material-UI in their own files
import DoctorsList from './DoctorsList.jsx'; // Relative import for DoctorsList
import { getDoctors } from '../../../firebase.js'; // Assuming getDoctors is exported from firebase.js or a dedicated doctorOperations file.


/**
 * Main Doctors page in the admin dashboard.
 * Displays a list of all registered doctors and provides options to filter or add new ones (if applicable).
 */
export default function DoctorsPage() {
    // State to store the list of doctors
    const [doctors, setDoctors] = useState([]);
    // State to manage loading status
    const [loading, setLoading] = useState(true);
    // State to manage error messages
    const [error, setError] = useState(null);

    /**
     * Fetches all doctor data from Firebase.
     */
    const fetchDoctors = async () => {
        setLoading(true); // Set loading to true before fetching data
        setError(null); // Clear any previous errors

        try {
            // Call the function to get all doctors
            const allDocs = await getDoctors();
            setDoctors(allDocs); // Update state with fetched doctors
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError('Failed to load doctors. Please try again.'); // Set error message
        } finally {
            setLoading(false); // Set loading to false after data fetching completes (success or failure)
        }
    };

    // useEffect hook to fetch doctors data when the component mounts
    useEffect(() => {
        fetchDoctors();
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
                <Typography variant="body1" color="text.secondary">Loading doctors...</Typography>
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
                    All Doctors
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}> {/* Space between buttons */}
                    <Button
                        component={Link} // Use Link for navigation
                        to="/admin/dashboard/doctors/pending" // Navigate to pending doctors page
                        variant="contained"
                        sx={{ bgcolor: 'warning.main', '&:hover': { bgcolor: 'warning.dark' }, color: 'white' }}
                    >
                        View Pending
                    </Button>
                    <Button
                        onClick={fetchDoctors}
                        disabled={loading} // Disable button during loading
                        variant="contained"
                        sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' }, color: 'white' }} // Example color
                        startIcon={<RefreshIcon />} // Material-UI icon
                    >
                        Refresh List
                    </Button>
                    {/* Add Doctor button - functionality for adding new doctors would go here later */}
                    {/*
                    <Button
                        variant="contained"
                        color="primary" // Primary color from your theme
                        startIcon={<AddIcon />}
                    >
                        Add Doctor
                    </Button>
                    */}
                </Box>
            </Box>
            {/* DoctorsList component to display the fetched doctors */}
            <DoctorsList doctors={doctors} onRefresh={fetchDoctors} />
        </Box>
    );
}

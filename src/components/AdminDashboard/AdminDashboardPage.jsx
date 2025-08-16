import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell, Chip, CircularProgress, Alert } from '@mui/material';
import {
    PeopleOutline as UsersIcon,
    CheckCircleOutline as CheckCircleIcon,
    AccessTime as ClockIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

// Assuming these Firebase operations are correctly imported from your firebase.js or a doctorOperations.js
import { getDoctorStats, getVerificationLogs } from '../../firebase.js'; // Adjust path if getDoctorStats/getVerificationLogs are in a separate file like ../lib/firebase/doctorOperations.js


/**
 * A simple Material-UI Card component for displaying statistics.
 * This replaces your custom StatsCard.
 */
const StatsCard = ({ title, value, icon: IconComponent, color }) => {
    return (
        <Paper elevation={3} sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderRadius: '12px',
            bgcolor: 'background.paper',
            minHeight: '120px'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{
                    p: 1.5,
                    borderRadius: '50%',
                    bgcolor: color, // Dynamically set background color
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                }}>
                    <IconComponent sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', color: 'text.primary', ml: 'auto' }}>
                {value}
            </Typography>
        </Paper>
    );
};

const DashboardPage = () => { // Export as named export to avoid conflicts if needed
    const [doctorStats, setDoctorStats] = useState({ total: 0, verified: 0, pending: 0, verificationRate: 0 });
    const [recentLogs, setRecentLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch doctor statistics
                const stats = await getDoctorStats();
                setDoctorStats(stats);

                // Fetch recent verification logs
                const logs = await getVerificationLogs(5); // Get latest 5 logs
                setRecentLogs(logs);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 16rem)', // Adjust min-h to fit content area
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} color="primary" sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">Loading dashboard data...</Typography>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ borderRadius: '8px', mb: 2 }}>
                <Typography variant="h6" component="strong">Error</Typography>
                <Typography>{error}</Typography>
            </Alert>
        );
    }

    return (
        <Box sx={{ '& > :not(style)': { mb: 4 } }}> {/* Adds bottom margin to direct children */}
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Dashboard Overview
            </Typography>

            {/* Statistics Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                <StatsCard
                    title="Total Doctors"
                    value={doctorStats.total}
                    icon={UsersIcon}
                    color="#4F46E5" // Indigo-500 equivalent
                />
                <StatsCard
                    title="Verified Doctors"
                    value={doctorStats.verified}
                    icon={CheckCircleIcon}
                    color="#22C55E" // Green-500 equivalent
                />
                <StatsCard
                    title="Pending Verification"
                    value={doctorStats.pending}
                    icon={ClockIcon}
                    color="#F59E0B" // Yellow-500 equivalent
                />
                <StatsCard
                    title="Verification Rate"
                    value={`${doctorStats.verificationRate}%`}
                    icon={CheckCircleIcon} // Can be any relevant icon
                    color="#A855F7" // Purple-500 equivalent
                />
            </Box>

            {/* Recent Activity Log */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'semibold', color: 'text.primary', mb: 2 }}>Recent Verification Activity</Typography>
                {recentLogs.length > 0 ? (
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Doctor</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Admin</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recentLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.doctorName}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={log.action === 'verified' ? 'Verified' : 'Rejected'}
                                            color={log.action === 'verified' ? 'success' : 'error'}
                                            size="small"
                                            sx={{ borderRadius: '4px' }}
                                        />
                                    </TableCell>
                                    <TableCell>{log.adminName}</TableCell>
                                    <TableCell>
                                        {log.timestamp ? format(new Date(log.timestamp), 'MMM d, yyyy h:mm a') : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography variant="body1" color="text.secondary">No recent verification activity found.</Typography>
                )}
            </Paper>
        </Box>
    );
};


export default DashboardPage; // Export the component as default
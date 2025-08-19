import React from 'react';
import {
    Box,
    Typography,
    Paper, // Replaces Card
    Chip, // Replaces Badge
    Button,
    Avatar,
    CircularProgress // Added for loading states if needed
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleOutlineIcon, // Replaces CheckCircleIcon
    ErrorOutline as ErrorOutlineIcon, // Replaces ExclamationCircleIcon
    Visibility as VisibilityIcon, // Replaces EyeIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom'; // For navigation
import { format } from 'date-fns';

/**
 * DoctorCard component for displaying a summary of a doctor's information.
 * Useful for grid layouts or smaller previews.
 * @param {Object} props - Component props.
 * @param {Object} props.doctor - The doctor object.
 * @param {Function} props.onVerify - Callback function to verify the doctor.
 * @param {Function} props.onUnverify - Callback function to unverify the doctor.
 */
const DoctorCard = ({ doctor, onVerify, onUnverify }) => {
    if (!doctor) return null;

    return (
        <Paper elevation={3} sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2, // Space between elements
            borderRadius: '12px',
            boxShadow: 3 // Standard MUI shadow
        }}>
            <Avatar
                src={doctor.photoURL || `https://ui-avatars.com/api/?name=${doctor.displayName || doctor.name || doctor.email}&background=random&color=fff&size=128`}
                alt={doctor.displayName || doctor.name || doctor.email}
                sx={{ width: 96, height: 96, mb: 1, boxShadow: 2 }} // Larger avatar with shadow
            />
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', color: 'text.primary' }}>
                {doctor.displayName || doctor.name || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {doctor.email}
            </Typography>
            {doctor.phone && (
                <Typography variant="body2" color="text.secondary">
                    {doctor.phone}
                </Typography>
            )}

            {doctor.isVerified ? (
                <Chip
                    label="Verified"
                    color="success"
                    size="small"
                    icon={<CheckCircleOutlineIcon />}
                    sx={{ mt: 1, borderRadius: '4px' }}
                />
            ) : (
                <Chip
                    label="Pending Verification"
                    color="warning"
                    size="small"
                    icon={<ErrorOutlineIcon />}
                    sx={{ mt: 1, borderRadius: '4px' }}
                />
            )}

            <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
                Registered: {doctor.createdAt ? format(new Date(doctor.createdAt), 'MMM d, yyyy') : 'N/A'}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, mt: 2 }}>
                <Button
                    component={Link}
                    to={`/admin/dashboard/doctors/${doctor.id}`} // Ensure this path is correct for your routes
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    sx={{
                        borderColor: 'grey.500',
                        color: 'grey.700',
                        '&:hover': { bgcolor: 'grey.100', borderColor: 'grey.600' },
                        textTransform: 'none'
                    }}
                >
                    View Details
                </Button>
                {doctor.isVerified ? (
                    <Button
                        onClick={() => onUnverify(doctor)}
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ textTransform: 'none' }}
                    >
                        Unverify
                    </Button>
                ) : (
                    <Button
                        onClick={() => onVerify(doctor)}
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ textTransform: 'none' }}
                    >
                        Verify
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default DoctorCard;
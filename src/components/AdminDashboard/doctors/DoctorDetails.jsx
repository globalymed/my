import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // From react-router-dom
import {
    Box,
    Typography,
    Paper,
    Button,
    Chip, // Replaces Badge
    CircularProgress,
    Alert,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    ErrorOutline as ErrorOutlineIcon,
    ArrowBack as ArrowBackIcon,
    PersonOutline as UserCircleIcon, // General user icon
    PhoneOutlined as PhoneIcon,
    EmailOutlined as EnvelopeIcon,
    CalendarTodayOutlined as CalendarIcon,
    AccessTimeOutlined as ClockSolidIcon, // For last updated
    SchoolOutlined as AcademicCapIcon, // For education
    LocalHospitalOutlined as BuildingOfficeIcon, // For clinic/hospital
    LocationOnOutlined as MapPinIcon, // For address
    PublicOutlined as GlobeAltIcon, // For languages
    PeopleOutlined as UsersIcon // For patients treated
} from '@mui/icons-material';

import { useAuth } from '../auth/context.js'; // Corrected relative import for useAuth
import { getDoctorById, updateDoctorVerification } from '../../../firebase.js'; // Assuming these are from firebase.js or doctorOperations.js


/**
 * DoctorDetails component to display a single doctor's profile and manage verification.
 * @param {Object} props - Component props.
 * @param {string} props.doctorId - The ID of the doctor to display.
 */
const DoctorDetails = ({ doctorId }) => {
    const navigate = useNavigate(); // Use useNavigate for navigation
    const { user } = useAuth(); // Current logged-in admin
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalReason, setModalReason] = useState('');
    const [modalNotes, setModalNotes] = useState('');
    const [actionType, setActionType] = useState(''); // 'verify' or 'unverify'
    const [loadingAction, setLoadingAction] = useState(false);
    const [actionError, setActionError] = useState(null);

    /**
     * Fetches doctor details from the API.
     */
    const fetchDoctorDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedDoctor = await getDoctorById(doctorId);
            if (fetchedDoctor) {
                setDoctor(fetchedDoctor);
            } else {
                setError('Doctor not found.');
            }
        } catch (err) {
            console.error('Error fetching doctor details:', err);
            setError('Failed to load doctor details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch doctor details when component mounts or doctorId changes
    useEffect(() => {
        if (doctorId) {
            fetchDoctorDetails();
        }
    }, [doctorId]);

    /**
     * Opens the confirmation modal for a verification action.
     * @param {string} type - 'verify' or 'unverify'.
     */
    const openActionModal = (type) => {
        setActionType(type);
        setModalReason('');
        setModalNotes('');
        setActionError(null);
        setIsModalOpen(true);
    };

    /**
     * Handles the verification/unverification action.
     */
    const handleVerificationAction = async () => {
        if (!doctor || !user) return;

        setLoadingAction(true);
        setActionError(null);
        try {
            const newIsVerifiedStatus = actionType === 'verify';
            await updateDoctorVerification(
                doctor.id,
                newIsVerifiedStatus,
                user.uid,
                user.displayName || user.email,
                modalReason,
                modalNotes
            );
            // Refresh doctor details after action
            await fetchDoctorDetails();
            setIsModalOpen(false);
        } catch (error) {
            console.error(`Error ${actionType} doctor:`, error);
            setActionError(`Failed to ${actionType} doctor: ${error.message}`);
        } finally {
            setLoadingAction(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 16rem)',
                p: 3
            }}>
                <CircularProgress size={60} color="primary" sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">Loading doctor details...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ borderRadius: '8px', mb: 2, p: 2 }}>
                <Typography variant="h6" component="strong">Error</Typography>
                <Typography>{error}</Typography>
                <Button onClick={() => navigate(-1)} variant="contained" sx={{ mt: 2, bgcolor: 'grey.700', '&:hover': { bgcolor: 'grey.800' } }}>
                    <ArrowBackIcon sx={{ mr: 1 }} /> Back to Doctors
                </Button>
            </Alert>
        );
    }

    if (!doctor) {
        return (
            <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="body1" color="text.secondary">Doctor details could not be loaded.</Typography>
                <Button onClick={() => navigate(-1)} variant="contained" sx={{ mt: 2, bgcolor: 'grey.700', '&:hover': { bgcolor: 'grey.800' } }}>
                    <ArrowBackIcon sx={{ mr: 1 }} /> Back to Doctors
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ '& > :not(style)': { mb: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Button onClick={() => navigate(-1)} variant="contained" sx={{ bgcolor: 'grey.700', '&:hover': { bgcolor: 'grey.800' } }}>
                    <ArrowBackIcon sx={{ mr: 1 }} /> Back to Doctors
                </Button>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', flexGrow: 1, textAlign: 'center' }}>
                    Doctor Profile: {doctor.displayName || doctor.firstName + " " + doctor.lastName || doctor.name || 'N/A'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    {doctor.isVerified ? (
                        <Button
                            onClick={() => openActionModal('unverify')}
                            variant="contained"
                            color="error"
                            startIcon={<ErrorOutlineIcon />}
                        >
                            Unverify Doctor
                        </Button>
                    ) : (
                        <Button
                            onClick={() => openActionModal('verify')}
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircleOutlineIcon />}
                        >
                            Verify Doctor
                        </Button>
                    )}
                </Box>
            </Box>

            {actionError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                    <Typography variant="body1" component="strong">Error:</Typography>
                    <Typography variant="body2">{actionError}</Typography>
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, borderRadius: '12px' }}>
                {/* Profile Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        src={doctor.photoURL || `https://ui-avatars.com/api/?name=${doctor.displayName || doctor.name || doctor.email}&background=random&color=fff&size=128`}
                        alt={doctor.displayName || doctor.name || doctor.email}
                        sx={{ width: 120, height: 120, mb: 2, boxShadow: 3 }}
                    />
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'semibold', color: 'text.primary', mb: 1 }}>
                        {doctor.displayName || doctor.name || 'N/A'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        {doctor.specialty || 'General Practitioner'}
                    </Typography>
                    <Chip
                        label={doctor.isVerified ? 'Verified' : 'Pending Verification'}
                        color={doctor.isVerified ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontSize: '0.8rem', fontWeight: 'medium' }}
                    />

                    <Box sx={{ mt: 4, width: '100%', maxWidth: 300 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'text.primary', mb: 2 }}>Contact Information</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EnvelopeIcon sx={{ mr: 1, color: 'grey.500' }} />
                            <Typography variant="body1" color="text.primary">{doctor.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhoneIcon sx={{ mr: 1, color: 'grey.500' }} />
                            <Typography variant="body1" color="text.primary">{doctor.phone || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <MapPinIcon sx={{ mr: 1, color: 'grey.500' }} />
                            <Typography variant="body1" color="text.primary">
                                {doctor.address || 'N/A'}, {doctor.city || 'N/A'}, {doctor.country || 'N/A'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Details Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'text.primary', mt: { xs: 4, md: 0 }, mb: 2 }}>Professional Details</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <AcademicCapIcon sx={{ mr: 1.5, color: 'grey.500', flexShrink: 0 }} />
                        <Typography variant="body1" color="text.primary">Education: {doctor.education || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <BuildingOfficeIcon sx={{ mr: 1.5, color: 'grey.500', flexShrink: 0 }} />
                        <Typography variant="body1" color="text.primary">Clinic/Hospital: {doctor.clinicName || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <UserCircleIcon sx={{ mr: 1.5, color: 'grey.500', flexShrink: 0 }} />
                        <Typography variant="body1" color="text.primary">Experience: {doctor.yearsOfExperience ? `${doctor.yearsOfExperience} years` : 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <GlobeAltIcon sx={{ mr: 1.5, color: 'grey.500', flexShrink: 0 }} />
                        <Typography variant="body1" color="text.primary">Languages: {doctor.languages?.join(', ') || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <UsersIcon sx={{ mr: 1.5, color: 'grey.500', flexShrink: 0 }} />
                        <Typography variant="body1" color="text.primary">Patients Treated: {doctor.patientsTreated || 'N/A'}</Typography>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'text.primary', mt: 4, mb: 2 }}>System Information</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon sx={{ mr: 1.5, color: 'grey.500' }} />
                        <Typography variant="body1" color="text.primary">Registered On:{' '}
                            {doctor.createdAt ? doctor.createdAt.toDate().toLocaleDateString() : 'N/A'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ClockSolidIcon sx={{ mr: 1.5, color: 'grey.500' }} />
                        <Typography variant="body1" color="text.primary">Last Updated:{' '}
                            {doctor.createdAt ? doctor.createdAt.toDate().toLocaleDateString() : 'N/A'}

                        </Typography>
                    </Box>
                    {doctor.isVerified && (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CheckCircleOutlineIcon sx={{ mr: 1.5, color: 'grey.500' }} />
                                <Typography variant="body1" color="text.primary">Verified On:{' '}
                                    {doctor.createdAt ? doctor.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <UserCircleIcon sx={{ mr: 1.5, color: 'grey.500' }} />
                                <Typography variant="body1" color="text.primary">Verified By:{' '}
                                    {doctor.verifiedByName || doctor.verifiedBy || 'N/A'}
                                </Typography>
                            </Box>
                        </>
                    )}
                    {doctor.rejectionReason && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <ErrorOutlineIcon sx={{ mr: 1.5, color: 'error.main', flexShrink: 0 }} />
                            <Typography variant="body1" color="error.main">Rejection Reason: {doctor.rejectionReason}</Typography>
                        </Box>
                    )}
                    {doctor.verificationNotes && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'semibold', mr: 1 }}>Notes:</Typography>
                            <Typography variant="body1" color="text.primary">{doctor.verificationNotes}</Typography>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Verification/Unverification Confirmation Modal */}
            <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="action-modal-title"
            >
                <DialogTitle id="action-modal-title">
                    {actionType === 'verify' ? 'Verify Doctor' : 'Unverify Doctor'}
                </DialogTitle>
                <DialogContent dividers>
                    {doctor && (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Are you sure you want to {actionType}{' '}
                                <Typography component="span" fontWeight="bold">
                                    {doctor.displayName || doctor.name || doctor.email}
                                </Typography>
                                ?
                            </Typography>
                            {actionType === 'unverify' && (
                                <TextField
                                    label="Reason for Unverification (Required)"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={modalReason}
                                    onChange={(e) => setModalReason(e.target.value)}
                                    placeholder="e.g., Incomplete documents, Failed background check"
                                    sx={{ mb: 2 }}
                                    error={actionType === 'unverify' && !modalReason}
                                    helperText={actionType === 'unverify' && !modalReason ? 'Reason is required to unverify.' : ''}
                                />
                            )}
                            <TextField
                                label="Additional Notes (Optional)"
                                fullWidth
                                multiline
                                rows={2}
                                value={modalNotes}
                                onChange={(e) => setModalNotes(e.target.value)}
                                placeholder="Any additional details..."
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsModalOpen(false)} disabled={loadingAction} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleVerificationAction}
                        disabled={loadingAction || (actionType === 'unverify' && !modalReason)}
                        variant="contained"
                        color={actionType === 'verify' ? 'success' : 'error'}
                        startIcon={loadingAction ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loadingAction ? 'Processing...' : (actionType === 'verify' ? 'Confirm Verification' : 'Confirm Unverification')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DoctorDetails;

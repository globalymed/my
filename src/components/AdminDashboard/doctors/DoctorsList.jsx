import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // From react-router-dom
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Chip, // Replaces Badge
    Button,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    ErrorOutline as ErrorOutlineIcon, // Replaces ExclamationCircleIcon for pending
    CheckCircleOutline as CheckCircleOutlineIcon, // Replaces CheckCircleIcon for verified
    DeleteOutline as DeleteOutlineIcon, // Replaces TrashIcon
    Visibility as VisibilityIcon, // Replaces EyeIcon
} from '@mui/icons-material';
// import { format } from 'date-fns';
import { useAuth } from '../auth/context.js'; // Corrected relative import for useAuth
import { updateDoctorVerification } from '../../../firebase.js'; // Assuming updateDoctorVerification is from firebase.js or doctorOperations.js


/**
 * DoctorsList component to display a table of doctors.
 * Allows viewing details, verifying, and un-verifying doctors.
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.doctors - Array of doctor objects to display.
 * @param {Function} props.onRefresh - Callback to refresh the doctor list after an action.
 * @param {boolean} [props.showActions=true] - Whether to show action buttons (view, verify/unverify).
 * @param {boolean} [props.showVerificationStatus=true] - Whether to show the verification status column.
 */
const DoctorsList = ({ doctors, onRefresh, showActions = true, showVerificationStatus = true }) => {
    const navigate = useNavigate(); // Use useNavigate for navigation
    const { user } = useAuth(); // Get current admin user for audit logs
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [modalReason, setModalReason] = useState('');
    const [modalNotes, setModalNotes] = useState('');
    const [actionType, setActionType] = useState(''); // 'verify' or 'unverify'
    const [loadingAction, setLoadingAction] = useState(false);
    const [actionError, setActionError] = useState(null);

    /**
     * Opens the confirmation modal for a verification action.
     * @param {Object} doctor - The doctor object.
     * @param {string} type - 'verify' or 'unverify'.
     */
    const openActionModal = (doctor, type) => {
        setSelectedDoctor(doctor);
        setActionType(type);
        setModalReason(''); // Clear previous reason
        setModalNotes(''); // Clear previous notes
        setActionError(null);
        setIsModalOpen(true);
    };

    /**
     * Handles the verification/unverification action.
     */
    const handleVerificationAction = async () => {
        if (!selectedDoctor || !user) return;

        setLoadingAction(true);
        setActionError(null);
        try {
            const newIsVerifiedStatus = actionType === 'verify';
            await updateDoctorVerification(
                selectedDoctor.id,
                newIsVerifiedStatus,
                user.uid,
                user.displayName || user.email,
                modalReason,
                modalNotes
            );
            onRefresh(); // Refresh parent component's data
            setIsModalOpen(false);
        } catch (error) {
            console.error(`Error ${actionType} doctor:`, error);
            setActionError(`Failed to ${actionType} doctor: ${error.message}`);
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
            {actionError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                    <Typography variant="body1" component="strong">Error:</Typography>
                    <Typography variant="body2">{actionError}</Typography>
                </Alert>
            )}
            {doctors.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                    No doctors found.
                </Typography>
            ) : (
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                            {showVerificationStatus && <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>}
                            <TableCell sx={{ fontWeight: 'bold' }}>Registered On</TableCell>
                            {showActions && <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {doctors.map((doctor) => {
                            console.log('Rendering doctor:', doctor); // Debugging log
                            return (
                                <TableRow key={doctor.id}>
                                    <TableCell sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                src={doctor.photoURL || `https://ui-avatars.com/api/?name=${doctor.displayName || doctor.name || doctor.email}&background=random&color=fff&size=128`}
                                                alt={doctor.name || doctor.displayName || doctor.email}
                                                sx={{ width: 32, height: 32, mr: 1 }}
                                            />
                                            <Typography>{doctor.displayName || doctor.name || (doctor.firstName + " " + doctor.lastName) || 'N/A'}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{doctor.email}</TableCell>
                                    <TableCell>{doctor.phone || 'N/A'}</TableCell>
                                    {showVerificationStatus && (
                                        <TableCell>
                                            <Chip
                                                label={doctor.isVerified ? 'Verified' : 'Pending'}
                                                color={doctor.isVerified ? 'success' : 'warning'}
                                                size="small"
                                                icon={doctor.isVerified ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
                                                sx={{ borderRadius: '4px' }}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        {doctor.createdAt ? doctor.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                    </TableCell>
                                    {showActions && (
                                        <TableCell sx={{ textAlign: 'right' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                <Button
                                                    component={Link}
                                                    to={`/admin/dashboard/doctors/${doctor.id}`}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        p: 1, // Adjusted padding
                                                        minWidth: 'auto', // Allow button to shrink
                                                        borderColor: 'grey.500', // Grey border
                                                        color: 'grey.700', // Grey text
                                                        '&:hover': { bgcolor: 'grey.100', borderColor: 'grey.600' }
                                                    }}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                    <Typography sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>View</Typography>
                                                </Button>
                                                {doctor.isVerified ? (
                                                    <Button
                                                        onClick={() => openActionModal(doctor, 'unverify')}
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        sx={{ p: 1, minWidth: 'auto' }}
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                        <Typography sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>Unverify</Typography>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => openActionModal(doctor, 'verify')}
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        sx={{ p: 1, minWidth: 'auto' }}
                                                    >
                                                        <CheckCircleOutlineIcon fontSize="small" />
                                                        <Typography sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>Verify</Typography>
                                                    </Button>
                                                )}
                                            </Box>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}

            {/* Verification/Unverification Confirmation Modal */}
            <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <DialogTitle id="modal-title">
                    {actionType === 'verify' ? 'Verify Doctor' : 'Unverify Doctor'}
                </DialogTitle>
                <DialogContent dividers>
                    {selectedDoctor && (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Are you sure you want to {actionType}{' '}
                                <Typography component="span" fontWeight="bold">
                                    {selectedDoctor.displayName || selectedDoctor.name || selectedDoctor.email}
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
        </Paper>
    );
};

export default DoctorsList;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    ErrorOutline as ErrorOutlineIcon,
    ArrowBack as ArrowBackIcon,
    PersonOutline as UserCircleIcon,
    PhoneOutlined as PhoneIcon,
    EmailOutlined as EnvelopeIcon,
    CalendarTodayOutlined as CalendarIcon,
    AccessTimeOutlined as ClockSolidIcon,
    SchoolOutlined as AcademicCapIcon,
    LocalHospitalOutlined as BuildingOfficeIcon,
    LocationOnOutlined as MapPinIcon,
    PublicOutlined as GlobeAltIcon,
    PeopleOutlined as UsersIcon,
    AttachMoney,
    DescriptionOutlined as DescriptionOutlinedIcon
} from '@mui/icons-material';

import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase.js';

import { useAuth } from '../auth/context.js';
import { getDoctorById, updateDoctorVerification, getClinicByDoctorId } from '../../../firebase.js';
import { format } from 'date-fns';

/**
 * DoctorDetails component to display a single doctor's profile and manage verification.
 * @param {Object} props - Component props.
 * @param {string} props.doctorId - The ID of the doctor to display.
 */
const DoctorDetails = ({ doctorId }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States for document fetching
    const [doctorDocuments, setDoctorDocuments] = useState({}); // Changed to an object to store categories
    const [documentsLoading, setDocumentsLoading] = useState(true);
    const [documentsError, setDocumentsError] = useState(null);

    // States for verification modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalReason, setModalReason] = useState('');
    const [modalNotes, setModalNotes] = useState('');
    const [actionType, setActionType] = useState('');
    const [loadingAction, setLoadingAction] = useState(false);
    const [actionError, setActionError] = useState(null);

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

    /**
     * Fetches doctor's registration documents from Firebase Storage, including nested folders.
     */
    const fetchDoctorDocuments = async () => {
        setDocumentsLoading(true);
        setDocumentsError(null);
        try {
            const storageRef = ref(storage, `registration-documents/${doctorId}`);
            const result = await listAll(storageRef);

            const documentsByCategory = {};

            // Iterate through folders (prefixes)
            for (const folderRef of result.prefixes) {
                const folderName = folderRef.name;
                const folderResult = await listAll(folderRef);

                const files = [];
                for (const itemRef of folderResult.items) {
                    const url = await getDownloadURL(itemRef);
                    files.push({
                        name: itemRef.name,
                        url: url,
                    });
                }
                documentsByCategory[folderName] = files;
            }

            // Also check for any root-level documents
            const rootFiles = [];
            for (const itemRef of result.items) {
                const url = await getDownloadURL(itemRef);
                rootFiles.push({
                    name: itemRef.name,
                    url: url,
                });
            }
            if (rootFiles.length > 0) {
                documentsByCategory['General Documents'] = rootFiles;
            }

            setDoctorDocuments(documentsByCategory);
        } catch (err) {
            console.error('Error fetching doctor documents:', err);
            setDocumentsError('Failed to load documents.');
        } finally {
            setDocumentsLoading(false);
        }
    };

    // Fetch doctor details and documents when component mounts or doctorId changes
    useEffect(() => {
        if (doctorId) {
            fetchDoctorDetails();
            fetchDoctorDocuments();
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

    const hasDocuments = Object.keys(doctorDocuments).length > 0;

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
                        src={doctor.photoURL || `https://ui-avatars.com/api/?name=${doctor.displayName || doctor.name || doctor.firstName + " " + doctor.lastName || doctor.email}&background=random&color=fff&size=128`}
                        alt={doctor.displayName || doctor.name || doctor.firstName + " " + doctor.lastName || doctor.email}
                        sx={{ width: 120, height: 120, mb: 2, boxShadow: 3 }}
                    />
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'semibold', color: 'text.primary', mb: 1 }}>
                        {doctor.displayName || doctor.name || doctor.firstName + " " + doctor.lastName || 'N/A'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        {doctor.specialization || 'General Practitioner'}
                    </Typography>
                    <Chip
                        label={doctor.isVerified ? 'Verified' : 'Pending Verification'}
                        color={doctor.isVerified ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontSize: '0.8rem', fontWeight: 'medium' }}
                    />

                    <Box sx={{ mt: 4, width: '100%', maxWidth: 300 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'text.primary', mb: 2 }}>Contact Information</Typography>
                        {
                            doctor.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <EnvelopeIcon sx={{ mr: 1, color: 'grey.500' }} />
                                    <Typography variant="body1" color="text.primary">{doctor.email}</Typography>
                                </Box>
                            )
                        }
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhoneIcon sx={{ mr: 1, color: 'grey.500' }} />
                            <Typography variant="body1" color="text.primary">{doctor.phone || 'N/A'}</Typography>
                        </Box>
                        {
                            doctor.address || doctor.city || doctor.country && (
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                    <MapPinIcon sx={{ mr: 1, color: 'grey.500' }} />
                                    <Typography variant="body1" color="text.primary">
                                        {doctor.address || 'N/A'}, {doctor.city || 'N/A'}, {doctor.country || 'N/A'}
                                    </Typography>
                                </Box>
                            )
                        }
                        {
                            doctor.consultationFee != null && (
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                    <AttachMoney sx={{ mr: 1, color: 'grey.500' }} />
                                    <Typography variant="body1" color="text.primary">
                                        Consultation Fee: ₹{doctor.consultationFee.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || 'N/A'}
                                    </Typography>
                                </Box>
                            )
                        }
                    </Box>

                    <Box sx={{ mt: 4, width: '100%', maxWidth: 300 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'text.primary', mb: 2 }}>About</Typography>
                        <Typography variant="body1" color="text.primary">
                            {doctor.about || doctor.bio || 'No additional information provided.'}
                        </Typography>
                    </Box>
                </Box>

                {/* Details Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'text.primary', mt: { xs: 4, md: 0 }, mb: 1 }}>Professional Details</Typography>
                    {
                        doctor.qualifications && doctor.qualifications.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <AcademicCapIcon sx={{ mr: 1.5, color: 'grey.500', flexShrink: 0 }} />
                                <Typography variant="body1" color="text.primary">Qualifications:
                                    <List dense disablePadding>
                                        {doctor.qualifications.map((qual, index) => (
                                            <ListItem key={index} disablePadding sx={{ py: 0.2 }}>
                                                <ListItemText primary={qual} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Typography>
                            </Box>
                        )
                    }

                    {/* clinics */}
                    {
                        doctor.clinicIds && doctor.clinicIds.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <BuildingOfficeIcon sx={{ mr: 1.5, color: 'grey.500', flexShrink: 0 }} />
                                <Typography variant="body1" color="text.primary">Clinic/Hospital:
                                    <List dense disablePadding>
                                        {doctor.clinicIds.map((clinic, index) => (
                                            <ListItem key={index} disablePadding sx={{ py: 0.2 }}>
                                                <ListItemText primary={`${clinic.name || clinic || 'Unnamed Clinic'} ${clinic.address ? `(${clinic.address})` : ''}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Typography>
                            </Box>
                        )
                    }

                    {/* experience */}

                    {
                        (doctor.experience || doctor.yearsOfExperience) && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <UserCircleIcon sx={{ mr: 1.5, color: 'grey.500', flexShrink: 0 }} />
                                <Typography variant="body1" color="text.primary">Experience: {doctor.yearsOfExperience || doctor.experience ? `${doctor.yearsOfExperience || doctor.experience} years` : 'N/A'}</Typography>
                            </Box>
                        )
                    }

                    {/* language */}

                    {
                        doctor.languages && doctor.languages.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <GlobeAltIcon sx={{ mr: 1.5, color: 'grey.500', flexShrink: 0 }} />
                                <Typography variant="body1" color="text.primary">Languages: {doctor.languages?.join(', ') || 'N/A'}</Typography>
                            </Box>
                        )
                    }

                    {/* patient treated */}

                    {
                        doctor.patientsTreated != null && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <UsersIcon sx={{ mr: 1.5, color: 'grey.500', flexShrink: 0 }} />
                                <Typography variant="body1" color="text.primary">Patients Treated: {doctor.patientsTreated}</Typography>
                            </Box>
                        )
                    }

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
                            {doctor.updatedAt ? doctor.updatedAt.toDate().toLocaleDateString() : 'N/A'}

                        </Typography>
                    </Box>
                    {doctor.isVerified && (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CheckCircleOutlineIcon sx={{ mr: 1.5, color: 'grey.500' }} />
                                <Typography variant="body1" color="text.primary">Verified On:{' '}
                                    {doctor.verificationDate ? doctor.verificationDate.toDate().toLocaleDateString() : 'N/A'}
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

                    <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'text.primary', mt: 4, mb: 2 }}>Doctor Documents</Typography>
                    {documentsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={30} color="primary" />
                        </Box>
                    ) : documentsError ? (
                        <Alert severity="error" sx={{ borderRadius: '8px' }}>
                            {documentsError}
                        </Alert>
                    ) : !hasDocuments ? (
                        <Typography variant="body2" color="text.secondary">No documents found for this doctor.</Typography>
                    ) : (
                        Object.keys(doctorDocuments).map((category, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1, textDecoration: 'underline' }}>{category.replace(/-/g, ' ')}</Typography>
                                <List dense disablePadding>
                                    {doctorDocuments[category].map((doc, docIndex) => (
                                        <ListItem key={docIndex} disablePadding>
                                            <ListItemButton onClick={() => window.open(doc.url, '_blank')} sx={{ borderRadius: '4px', '&:hover': { bgcolor: 'grey.50' } }}>
                                                <ListItemIcon>
                                                    <DescriptionOutlinedIcon color="primary" />
                                                </ListItemIcon>
                                                <ListItemText primary={doc.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        ))
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
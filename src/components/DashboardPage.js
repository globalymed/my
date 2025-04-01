import React, { useState, useEffect } from 'react';
import {
  Box,
  Toolbar,
  Link,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  EventNote as EventNoteIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  getUserAppointments, 
  deleteAppointment, 
  getUserById, 
  updateAppointmentStatus,
  getAppointmentById,
  db 
} from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Dialog states
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const isLoggedIn = localStorage.getItem('userData') !== null;
  
  // Refresh counter
  const [refreshCount, setRefreshCount] = useState(0);

  // Check if user is logged in and fetch user data
  useEffect(() => {
    const checkUserAuth = async () => {
      setLoading(true);
      setError('');
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          
          // Fetch full user details from database
          if (parsedUser.id) {
            try {
              // Fetch user directly from Firestore
              const userDocRef = doc(db, 'users', parsedUser.id);
              const userDocSnap = await getDoc(userDocRef);
              
              if (userDocSnap.exists()) {
                const userDetails = {
                  id: parsedUser.id,
                  ...userDocSnap.data()
                };
                
                console.log('Fetched user details:', userDetails);
                
                setUser({
                  ...parsedUser,
                  ...userDetails
                });
                
                // Fetch user's appointments
                fetchUserAppointments(parsedUser.id);
              } else {
                console.warn(`No user found with ID: ${parsedUser.id}, using localStorage data`);
                // Use localStorage data if we can't find the user in the database
                setUser(parsedUser);
              }
            } catch (err) {
              console.error('Error fetching user from Firestore directly:', err);
              // Still set the user from localStorage as fallback
              setUser(parsedUser);
            }
          }
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        setError('Authentication error. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, [refreshKey]);

  // Fetch user's appointments
  const fetchUserAppointments = async (userId) => {
    setAppointmentLoading(true);
    try {
      console.log('Attempting to fetch appointments for user:', userId);
      const userAppointments = await getUserAppointments(userId);
      console.log('Received appointments data:', userAppointments);
      
      // Check if we got any appointments
      if (userAppointments.length === 0) {
        console.log('No appointments found for this user');
        setAppointments([]);
        setAppointmentLoading(false);
        return;
      }
      
      // Process the appointments data
      const processedAppointments = userAppointments.map(appointment => {
        // Handle nested userId if it's a document reference
        if (appointment.userId && typeof appointment.userId === 'object' && appointment.userId.id) {
          appointment.userId = appointment.userId.id;
        }
        
        // Format date if needed
        if (appointment.appointmentDate && typeof appointment.appointmentDate === 'object' && appointment.appointmentDate.toDate) {
          // Handle Firestore Timestamp
          appointment.appointmentDate = appointment.appointmentDate.toDate().toISOString();
        }
        
        return appointment;
      });
      
      // Sort appointments by date (most recent first)
      const sortedAppointments = [...processedAppointments].sort((a, b) => {
        const dateA = a.appointmentDate ? new Date(a.appointmentDate) : new Date(0);
        const dateB = b.appointmentDate ? new Date(b.appointmentDate) : new Date(0);
        return dateB - dateA;
      });
      
      console.log('Processed and sorted appointments:', sortedAppointments);
      setAppointments(sortedAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load your appointments. Please try again.');
    } finally {
      setAppointmentLoading(false);
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
    setRefreshKey(prev => prev + 1);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUser(null);
    setAppointments([]);
    navigate('/');
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Handle booking new appointment
  const handleBookAppointment = () => {
    navigate('/chat');
  };

  // Handle edit appointment
  const handleEditAppointment = (appointmentId) => {
    navigate(`/appointment-booking?edit=${appointmentId}`);
  };

  // Handle view appointment details
  const handleViewAppointmentDetails = (appointmentId) => {
    navigate(`/appointment-details/${appointmentId}`);
  };

  // Handle appointment status change dialog
  const handleStatusDialogOpen = (appointment, status) => {
    setSelectedAppointment(appointment);
    setSelectedStatus(status);
    setStatusDialogOpen(true);
  };

  // Handle status change confirm
  const handleChangeStatus = async () => {
    if (!selectedAppointment || !selectedStatus) return;
    
    try {
      await updateAppointmentStatus(selectedAppointment.id, selectedStatus);
      setStatusDialogOpen(false);
      
      // Refresh appointments
      if (user && user.id) {
        fetchUserAppointments(user.id);
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Failed to update appointment status. Please try again.');
    }
  };

  // Handle cancel dialog open
  const handleCancelDialogOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  // Handle cancel appointment with reason
  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      // First update the status to cancelled
      await updateAppointmentStatus(
        selectedAppointment.id, 
        'cancelled', 
        cancellationReason ? `Cancelled: ${cancellationReason}` : 'Cancelled by user'
      );
      
      // Then handle the availability if needed
      if (selectedAppointment.availabilityId) {
        await deleteAppointment(selectedAppointment.id, selectedAppointment.availabilityId);
      }
      
      // Reset state
      setCancelDialogOpen(false);
      setCancellationReason('');
      setSelectedAppointment(null);
      
      // Refresh appointments
      if (user && user.id) {
        fetchUserAppointments(user.id);
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError('Failed to cancel appointment. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Unauthenticated view
  if (!user) {
    return (
      <Box 
        sx={{ 
          py: 6,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh'
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            width: '100%',
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            p: 2
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <CalendarIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Patient Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please log in to view your appointment details and manage your healthcare journey.
            </Typography>
            <Box sx={{ 
              p: 2, 
              mb: 3, 
              backgroundColor: 'rgba(0, 127, 255, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(0, 127, 255, 0.2)'
            }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                New to MedYatra? Book an appointment to receive your login credentials via email.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/chat')}
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                Chat with AI to Book Appointment
              </Button>
            </Box>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={handleLoginRedirect}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              Log In
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Authenticated view
  return (
    <Container 
      maxWidth="lg" 
      sx={{
        py: 4,
        px: { xs: 2, sm: 3 },
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}
    >
      <Box sx={{ py: 4 }}>
        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}


{isLoggedIn && (
           <Toolbar
             component="nav"
             variant="dense"
             sx={{
               justifyContent: 'center',
               minHeight: 48,
               marginBlockEnd:2,
               display: { xs: 'none', md: 'flex' }
             }}
           >

             <Button
              onClick={() => navigate('/appointment-booking')}
              color="inherit"
              sx={{ 
                mx: 1.5, 
                textTransform: 'none',
                fontWeight: location.pathname === '/chat' ? 700 : 400
              }}
            >
              Book Appointment
            </Button>

            <Button
              onClick={() => navigate('/chat')}
              color="inherit"
              sx={{ 
                mx: 1.5, 
                textTransform: 'none',
                fontWeight: location.pathname === '/chat' ? 700 : 400
              }}
            >
              Health Assistant
            </Button>
           </Toolbar>
         )}

         {/* DOES THIS GO HERE */}
        
        {/* Header Section */}
        <Box 
          sx={{ 
            mb: 4, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
            borderRadius: '16px',
            p: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Patient Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome back, {user.firstName || 'User'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Log Out
            </Button>
          </Box>
        </Box>

        {/* User Info */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid rgba(0, 127, 255, 0.1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
            }
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {(user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '')}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    {user.firstName || ''} {user.lastName || ''}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{user.email || 'No email available'}</Typography>
                  </Box>
                  {user.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">{user.phone}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                justifyContent: 'center',
                alignItems: { xs: 'flex-start', md: 'flex-end' }, 
                gap: 1,
                mt: { xs: 2, md: 0 }
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  gap: 2, 
                  width: '100%',
                  justifyContent: { xs: 'flex-start', md: 'flex-end' }
                }}>
                    </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    px: 2,
                    py: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: 2
                  }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: { xs: 'flex-start', md: 'flex-end' }, 
                  gap: 2,
                  width: '100%'
                }}>
                  {user.city && user.country && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      px: 2,
                      py: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: 2
                    }}>
                      <LocationIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.city}, {user.country}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'row', // Changed to row to place buttons side by side
                    gap: 2,
                    alignItems: 'center'
                  }}>
                    <Button
                      variant="contained"
                      //onClick={}                       //backend code added here to add "add document" functionality 
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1e3a8a, #2563eb)'
                        }
                      }}
                    >
                      Add Documents
                    </Button>

                    <Button
                      variant="contained"
                      //onClick={} //do something here. Display the view similar to "Know Your Treatments"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1e3a8a, #2563eb)'
                        }
                      }}
                    >
                      Check Documents
                    </Button>
                  </Box>
                </Box>
                  </Box>
                </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Appointments Section Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Your Appointments
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={`Last refreshed: ${new Date().toLocaleTimeString()}`} 
                size="small"
                color="default"
                variant="outlined" 
                sx={{
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }}
              />

              <EventNoteIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Total Appointments: {appointments.length}
              </Typography>
              
              <Button
                variant="contained"
                onClick={handleBookAppointment}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1e3a8a, #2563eb)'
                  }
                }}
              >
                Book Appointment
              </Button>
            </Box>
          </Box>


        {/* Appointments Loading */}
        {appointmentLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={30} />
          </Box>
        )}

        {/* Appointments Grid */}
        {!appointmentLoading && appointments.length > 0 && (
          <Grid container spacing={3}>
            {appointments.map((appointment) => {
              // Extract clinic and doctor information safely
              const clinicName = appointment.clinicName || 
                                 (appointment.clinic && appointment.clinic.name) || 
                                 'Unknown Clinic';
              
              const doctorName = appointment.doctorName || 
                                 (appointment.doctor && appointment.doctor.name) ||
                                 `Dr. at ${clinicName}`;
              
              const treatmentType = appointment.treatmentType || 
                                   appointment.specialization || 
                                   (appointment.treatment && appointment.treatment.type) ||
                                   'General Consultation';
              
              // Format date properly with fallback
              const appointmentDate = appointment.appointmentDate ? 
                formatDate(appointment.appointmentDate) : 
                'Date not specified';
              
              // Get time slot with fallback
              const timeSlot = appointment.timeSlot || 
                               appointment.appointmentTime || 
                               'Time not specified';
              
              // Get appointment status
              const status = appointment.status || 'Scheduled';
              
              return (
                <Grid item xs={12} md={6} key={appointment.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      borderRadius: 2,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      '&:hover': {
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 56, 
                              height: 56,
                              backgroundColor: theme.palette.primary.light,
                              color: theme.palette.primary.main
                            }}
                          >
                            <HospitalIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {doctorName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {treatmentType}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={status}
                          color={getStatusColor(status)}
                          size="small"
                          sx={{ 
                            borderRadius: '6px',
                            fontWeight: 600,
                            px: 1,
                            '& .MuiChip-label': {
                              px: 1
                            },
                            background: status.toLowerCase() === 'confirmed' 
                              ? 'linear-gradient(45deg, #059669, #34d399)'
                              : status.toLowerCase() === 'pending'
                              ? 'linear-gradient(45deg, #d97706, #fbbf24)'
                              : status.toLowerCase() === 'cancelled'
                              ? 'linear-gradient(45deg, #dc2626, #f87171)'
                              : 'linear-gradient(45deg, #2563eb, #60a5fa)',
                            color: '#ffffff'
                          }}
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CalendarIcon color="action" fontSize="small" />
                            <Typography variant="body2">
                              {appointmentDate}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <TimeIcon color="action" fontSize="small" />
                            <Typography variant="body2">{timeSlot}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationIcon color="action" fontSize="small" />
                            <Typography variant="body2">{clinicName}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <PersonIcon color="action" fontSize="small" />
                            <Typography variant="body2">{`${user.firstName || ''} ${user.lastName || ''}`}</Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {appointment.notes && (
                        <Box sx={{ mt: 2, mb: 2, p: 1.5, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            <strong>Notes:</strong> {appointment.notes}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Box>
                          {status.toLowerCase() !== 'cancelled' &&
                           status.toLowerCase() !== 'completed' && (
                            <Tooltip title="Mark as Completed">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleStatusDialogOpen(appointment, 'completed')}
                              >
                                <CheckIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {status.toLowerCase() !== 'cancelled' && (
                            <>
                              <Tooltip title="Edit Appointment">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleEditAppointment(appointment.id)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel Appointment">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleCancelDialogOpen(appointment)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Empty State */}
        {!appointmentLoading && appointments.length === 0 && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}
          >
            <CalendarIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No appointments scheduled
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Book your first appointment to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleBookAppointment}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3
              }}
            >
              Book Appointment
            </Button>
          </Box>
        )}
        
        {/* Cancel Appointment Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }
          }}
        >
          <DialogTitle>Cancel Appointment</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to cancel this appointment?
            </Typography>
            {selectedAppointment && (
              <Box sx={{ my: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Doctor:</strong> {selectedAppointment.doctorName || 'Dr. ' + (selectedAppointment.clinicName || 'Unknown')}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Date:</strong> {formatDate(selectedAppointment.appointmentDate)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Time:</strong> {selectedAppointment.timeSlot || 'Not specified'}
                </Typography>
              </Box>
            )}
            <TextField
              autoFocus
              margin="dense"
              id="cancellationReason"
              label="Reason for cancellation (optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setCancelDialogOpen(false)} 
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Keep Appointment
            </Button>
            <Button 
              onClick={handleCancelAppointment} 
              variant="contained" 
              color="error"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Cancel Appointment
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Change Status Dialog */}
        <Dialog
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedStatus === 'completed' ? 'Mark Appointment as Completed' : 'Change Appointment Status'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              {selectedStatus === 'completed' 
                ? 'Are you sure you want to mark this appointment as completed?' 
                : 'Are you sure you want to change the status of this appointment?'}
            </Typography>
            {selectedAppointment && (
              <Box sx={{ my: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Doctor:</strong> {selectedAppointment.doctorName || 'Dr. ' + (selectedAppointment.clinicName || 'Unknown')}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Date:</strong> {formatDate(selectedAppointment.appointmentDate)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Time:</strong> {selectedAppointment.timeSlot || 'Not specified'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Current Status:</strong>{' '}
                  <Chip
                    label={selectedAppointment.status || 'Scheduled'}
                    color={getStatusColor(selectedAppointment.status || 'confirmed')}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                </Typography>
                <Typography variant="body2" gutterBottom sx={{ mt: 1 }}>
                  <strong>New Status:</strong>{' '}
                  <Chip
                    label={selectedStatus}
                    color={getStatusColor(selectedStatus)}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setStatusDialogOpen(false)} 
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleChangeStatus} 
              variant="contained" 
              color="primary"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default DashboardPage;
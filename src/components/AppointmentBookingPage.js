import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, Button, Stepper, 
  Step, StepLabel, Paper, TextField, Grid, 
  MenuItem, FormControl, FormHelperText, 
  InputLabel, Select, CircularProgress,
  Card, CardContent, Divider, Fade, Alert,
  IconButton, Chip, TextareaAutosize, CardMedia
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { createAppointment, getAvailability } from '../firebase';

// List of countries for the dropdown
const countries = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 
  'Singapore', 'UAE', 'Saudi Arabia', 'Thailand', 'Malaysia'
];

// Styled component for file upload
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Styled TextArea component
const StyledTextArea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  minHeight: '100px',
  padding: '10px',
  fontFamily: theme.typography.fontFamily,
  fontSize: '1rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  '&:focus': {
    outline: 'none',
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

// Steps for the booking process
const steps = ['Personal Details', 'Review & Confirm'];

const AppointmentBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [uploadInfo, setUploadInfo] = useState({
    hasFileUploads: false,
    fileUploadError: null,
    isDevelopmentEnvironment: false
  });
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: 'India', // Default to India
    symptoms: '',
    notes: ''
  });
  
  // Clinic and appointment details from navigation state
  const [clinicData, setClinicData] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [availabilityId, setAvailabilityId] = useState('');
  
  // File upload state
  const [files, setFiles] = useState([]);
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Load clinic data from navigation state
  useEffect(() => {
    if (location.state) {
      const { clinic, date, time, availabilityId } = location.state;
      if (clinic) setClinicData(clinic);
      if (date) setAppointmentDate(date);
      if (time) setAppointmentTime(time);
      if (availabilityId) setAvailabilityId(availabilityId);
    }
  }, [location]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle file uploads
  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = newFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          files: 'Invalid file type. Please upload images, PDFs, or documents.' 
        }));
        return false;
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({ 
          ...prev, 
          files: 'File too large. Maximum size is 5MB.' 
        }));
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      setErrors(prev => ({ ...prev, files: '' }));
    }
  };
  
  // Handle removing a file
  const handleRemoveFile = (index) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
    // Clear any file-related errors
    setErrors(prev => ({ ...prev, files: '', submit: '' }));
  };

  // Handle removing all files
  const handleRemoveAllFiles = () => {
    setFiles([]);
    // Clear any file-related errors
    setErrors(prev => ({ ...prev, files: '', submit: '' }));
  };
  
  // Clear all form fields
  const handleClearForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      country: 'India',
      symptoms: '',
      notes: ''
    });
    setFiles([]);
    setErrors({});
  };
  
  // Reset the form
  const handleReset = () => {
    // Reset all form data and state
    handleClearForm();
    setActiveStep(0);
    setBookingComplete(false);
  };
  
  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = 'Please enter a valid international phone number';
    }
    
    // Validate city
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    // Validate country
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    // Validate symptoms
    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Please describe your symptoms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next step
  const handleNext = () => {
    if (activeStep === 0) {
      const isValid = validateForm();
      if (isValid) {
        setActiveStep(1);
      }
    } else {
      handleSubmit();
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  // Submit the form
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, submit: '', files: '' }));
    
    try {
      // Parse symptoms into an array
      const symptomsList = formData.symptoms.split(/[,;.]/).filter(s => s.trim()).map(s => s.trim());
      
      // Prepare appointment data
      const appointmentData = {
        ...formData,
        symptoms: symptomsList,
        clinicId: clinicData?.id || '',
        clinicName: clinicData?.name || '',
        treatmentType: clinicData?.treatmentType || '',
        appointmentDate,
        appointmentTime,
        availabilityId: availabilityId || null
      };
      
      // Create appointment in Firestore
      const result = await createAppointment(appointmentData, files);
      
      if (result.success) {
        // Show success state
        setAppointmentId(result.id);
        setBookingComplete(true);
        
        // Store info about file uploads for success message
        setUploadInfo({
          hasFileUploads: files.length > 0,
          fileUploadError: result.fileUploadError,
          isDevelopmentEnvironment: result.isDevelopmentEnvironment
        });
        
        // If there was a file upload error but the appointment was still created
        if (result.fileUploadError) {
          console.warn('Appointment created but file upload had issues:', result.fileUploadError);
        }
      } else {
        throw new Error(result.error || 'Failed to create appointment');
      }
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      // Show a more specific error message based on the error
      let errorMessage = 'An error occurred while booking your appointment. Please try again.';
      
      // Check if it's a CORS error related to file upload
      if (error.message && (error.message.includes('CORS') || error.message.includes('storage'))) {
        errorMessage = 'Unable to upload files due to browser security restrictions. Your appointment can still be created without attaching files. Please remove the files and try again.';
      }
      
      setErrors(prev => ({ 
        ...prev, 
        submit: errorMessage
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Navigate back to home
  const handleReturnHome = () => {
    // Reset the form and return to the first step
    handleReset();
    navigate('/');
  };
  
  // Render personal details form
  const renderPersonalDetailsForm = () => (
    <Box component={Paper} elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Personal Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="firstName"
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            placeholder="Enter your first name"
            inputProps={{ 'aria-label': 'First Name' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            placeholder="Enter your last name"
            inputProps={{ 'aria-label': 'Last Name' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            placeholder="example@email.com"
            inputProps={{ 'aria-label': 'Email Address' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="phone"
            name="phone"
            label="Phone Number (WhatsApp)"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone || "Include country code (e.g., +91 for India)"}
            placeholder="+91 9876543210"
            inputProps={{ 'aria-label': 'Phone Number' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="city"
            name="city"
            label="City"
            value={formData.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            placeholder="Enter your city"
            inputProps={{ 'aria-label': 'City' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.country}>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              label="Country"
              inputProps={{ 'aria-label': 'Country' }}
            >
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
            {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Symptoms/Medical Concerns
          </Typography>
          <TextField
            required
            fullWidth
            id="symptoms"
            name="symptoms"
            label="Describe your symptoms or medical concerns"
            multiline
            rows={4}
            value={formData.symptoms}
            onChange={handleChange}
            error={!!errors.symptoms}
            helperText={errors.symptoms || "Please describe your symptoms in detail"}
            placeholder="E.g., I have been experiencing persistent headaches for the past week..."
            inputProps={{ 'aria-label': 'Symptoms' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Additional Notes (Optional)
          </Typography>
          <TextField
            fullWidth
            id="notes"
            name="notes"
            label="Any additional information you'd like to share"
            multiline
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="E.g., Allergies, current medications, etc."
            inputProps={{ 'aria-label': 'Additional Notes' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Medical Records (Optional)
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Upload Files
            <VisuallyHiddenInput 
              type="file" 
              multiple 
              onChange={handleFileUpload}
              accept=".webp,.jpeg,.webp,.gif,.pdf,.doc,.docx"
            />
          </Button>
          {window.location.hostname.includes('localhost') && (
            <Typography variant="caption" color="warning.main" sx={{ display: 'block', mb: 1 }}>
              Note: File uploads may not work in the development environment due to CORS restrictions.
            </Typography>
          )}
          {errors.files && (
            <FormHelperText error>{errors.files}</FormHelperText>
          )}
          {files.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Uploaded Files:
              </Typography>
              <Grid container spacing={1}>
                {files.map((file, index) => (
                  <Grid item xs={12} key={index}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleRemoveFile(index)}
                        aria-label={`Remove file ${file.name}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
  
  // Render review and confirmation
  const renderReviewConfirmation = () => (
    <Box component={Paper} elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Review Your Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Clinic Details
              </Typography>
              <Typography variant="body1">
                <strong>Clinic:</strong> {clinicData?.name || 'Not specified'}
              </Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {clinicData?.location || 'Not specified'}
              </Typography>
              <Typography variant="body1">
                <strong>Treatment:</strong> {clinicData?.treatmentType || 'Not specified'}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {appointmentDate || 'Not specified'}
              </Typography>
              <Typography variant="body1">
                <strong>Time:</strong> {appointmentTime || 'Not specified'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" gutterBottom>
            Personal Information
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {formData.firstName} {formData.lastName}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {formData.email}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {formData.phone}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" gutterBottom>
            Address Information
          </Typography>
          <Typography variant="body1">
            <strong>City:</strong> {formData.city}
          </Typography>
          <Typography variant="body1">
            <strong>Country:</strong> {formData.country}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Medical Information
          </Typography>
          <Typography variant="body1">
            <strong>Symptoms:</strong> {formData.symptoms}
          </Typography>
          {formData.notes && (
            <Typography variant="body1">
              <strong>Additional Notes:</strong> {formData.notes}
            </Typography>
          )}
        </Grid>
        
        {files.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Medical Records
                </Typography>
                {errors.submit && errors.submit.includes('files') && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small" 
                    onClick={handleRemoveAllFiles}
                  >
                    Remove All Files
                  </Button>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {files.map((file, index) => (
                  <Chip 
                    key={index}
                    label={file.name}
                    size="small"
                    onDelete={errors.submit && errors.submit.includes('files') ? () => handleRemoveFile(index) : undefined}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        )}
        
        {errors.submit && (
          <Grid item xs={12}>
            <Alert severity="error">{errors.submit}</Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
  
  // Render success message
  const renderSuccessMessage = () => (
    <Fade in={bookingComplete}>
      <Box 
        component={Paper} 
        elevation={3} 
        sx={{ 
          p: 6, 
          borderRadius: 2, 
          textAlign: 'center',
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 3 }} />
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Appointment Confirmed!
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" paragraph>
            Your appointment has been successfully booked at <strong>{clinicData?.name}</strong> on <strong>{appointmentDate}</strong> at <strong>{appointmentTime}</strong>.
          </Typography>
          <Typography variant="body1" paragraph>
            A confirmation email has been sent to <strong>{formData.email}</strong>. Please check your inbox (and spam folder) for all the details.
          </Typography>
        </Box>
        
        {/* Show different messages based on file upload status */}
        {uploadInfo.hasFileUploads && !uploadInfo.fileUploadError && !uploadInfo.isDevelopmentEnvironment && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Your medical records have been successfully uploaded and attached to your appointment.
          </Alert>
        )}
        
        {uploadInfo.hasFileUploads && (uploadInfo.fileUploadError || uploadInfo.isDevelopmentEnvironment) && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Your appointment has been created, but there may have been issues with file uploads. 
            The clinic staff will contact you if additional documents are needed.
          </Alert>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Appointment ID: {appointmentId}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          flexWrap: 'wrap',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReturnHome}
            sx={{ minWidth: 200 }}
          >
            Book Another Appointment
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Log in using the credentials sent to your email
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ minWidth: 200 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Book Your Appointment
        </Typography>
        {clinicData && (
          <Typography variant="subtitle1" gutterBottom>
            {clinicData.name} - {appointmentDate} {appointmentTime && `at ${appointmentTime}`}
          </Typography>
        )}
      </Box>
      
      {!bookingComplete ? (
        <>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === 0 ? renderPersonalDetailsForm() : renderReviewConfirmation()}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            {activeStep === 0 ? (
              <Button
                variant="outlined"
                onClick={handleClearForm}
              >
                Clear Fields
              </Button>
            ) : (
              <Button
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} />
              ) : activeStep === steps.length - 1 ? (
                'Confirm Appointment'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </>
      ) : (
        renderSuccessMessage()
      )}
    </Container>
  );
};

export default AppointmentBookingPage;

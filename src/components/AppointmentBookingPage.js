import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { isValidPhoneNumber } from 'libphonenumber-js';

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

// Steps for the booking process
const steps = ['Personal Details', 'Review & Confirm'];

const AppointmentBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: 'India', // Default to India
  });
  
  // Clinic and appointment details from navigation state
  const [clinicData, setClinicData] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  
  // File upload state
  const [files, setFiles] = useState([]);
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Load clinic data from navigation state
  useEffect(() => {
    if (location.state) {
      const { clinic, date, time } = location.state;
      if (clinic) setClinicData(clinic);
      if (date) setAppointmentDate(date);
      if (time) setAppointmentTime(time);
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
  
  // Remove a file from the list
  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
    });
    setFiles([]);
    setErrors({});
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
    
    try {
      // Prepare file names for storage (in a real app, you'd upload these to storage)
      const fileNames = files.map(file => file.name);
      
      // Add document to Firestore
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        clinicId: clinicData?.id || '',
        clinicName: clinicData?.name || '',
        treatmentType: clinicData?.treatmentType || '',
        appointmentDate,
        appointmentTime,
        medicalRecords: fileNames,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      
      // Show success state
      setBookingComplete(true);
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: 'An error occurred while booking your appointment. Please try again.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Navigate back to home
  const handleReturnHome = () => {
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
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
            />
          </Button>
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
        
        {files.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Medical Records
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {files.map((file, index) => (
                <Chip 
                  key={index}
                  label={file.name}
                  size="small"
                />
              ))}
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
          p: 4, 
          borderRadius: 2,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
        <Typography variant="h5" gutterBottom>
          Appointment Booked Successfully!
        </Typography>
        <Typography variant="body1" paragraph>
          Your appointment has been confirmed for {appointmentDate} at {appointmentTime}.
        </Typography>
        <Typography variant="body1" paragraph>
          You will receive a confirmation email at {formData.email} with all the details.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleReturnHome}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
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
                'Confirm Booking'
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

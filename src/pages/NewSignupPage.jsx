// First, install Material-UI in your project:
// npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Alert,
    InputAdornment,
    IconButton,
    Chip,
    CircularProgress,
    Link,
    Card,
    CardContent,
} from '@mui/material';
import {
    Person,
    LocalHospital,
    Visibility,
    VisibilityOff,
    Upload,
} from '@mui/icons-material';

function SignupForm() {
    const [activeTab, setActiveTab] = useState('patient');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Form states
    const [patientForm, setPatientForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        gender: '',
        age: '',
        password: '',
        confirmPassword: ''
    });

    const [doctorForm, setDoctorForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        registrationNumber: '',
        hospitalName: '',
        specialization: '',
        password: '',
        confirmPassword: ''
    });

    const specializations = [
        'Cardiology',
        'Dermatology',
        'Emergency Medicine',
        'Family Medicine',
        'Gastroenterology',
        'General Surgery',
        'Internal Medicine',
        'Neurology',
        'Obstetrics & Gynecology',
        'Oncology',
        'Ophthalmology',
        'Orthopedics',
        'Pediatrics',
        'Psychiatry',
        'Radiology',
        'Urology'
    ];

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setError('');
    };

    const handlePatientFormChange = (field, value) => {
        setPatientForm(prev => ({ ...prev, [field]: value }));
    };

    const handleDoctorFormChange = (field, value) => {
        setDoctorForm(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');

        const currentForm = activeTab === 'patient' ? patientForm : doctorForm;

        if (currentForm.password !== currentForm.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (!agreedToTerms) {
            setError('Please agree to the <Link href="/terms" color="primary">Terms of Service</Link> and <Link href="/privacy" color="primary">Privacy Policy</Link>');
            setIsLoading(false);
            return;
        }

        if (activeTab === 'doctor' && !selectedFile) {
            setError('Please upload your medical certification');
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Form submitted:', { type: activeTab, data: currentForm });
            alert(`${activeTab === 'patient' ? 'Patient' : 'Doctor'} account created successfully!`);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ bgcolor: 'grey.50', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <Paper elevation={3} sx={{ width: '100%', maxWidth: 1000, borderRadius: 3, overflow: 'hidden' }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', p: 4, pb: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                        Create Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Sign up to get started with our healthcare platform
                    </Typography>
                </Box>

                {/* Tab Navigation */}
                <Box sx={{ px: 4, mb: 3 }}>
                    <Paper elevation={0} sx={{ bgcolor: 'grey.100', borderRadius: 2, p: 0.5 }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    minHeight: 48,
                                    borderRadius: 1.5,
                                    mx: 0.5,
                                    color: '#2f2f2f', // black color for text and icon
                                    '&.Mui-selected': {
                                        bgcolor: 'white',
                                        boxShadow: 1,
                                        color: '#2f2f2f', // still black when selected
                                    },
                                },
                                '& .MuiTabs-indicator': {
                                    display: 'none'
                                }
                            }}
                        >
                            <Tab
                                value="patient"
                                label="Patient Registration"
                                icon={<Person />}
                                iconPosition="start"
                            />
                            <Tab
                                value="doctor"
                                label="Doctor Registration"
                                icon={<LocalHospital />}
                                iconPosition="start"
                            />
                        </Tabs>

                    </Paper>
                </Box>

                {/* Form Content */}
                <Box sx={{ p: 4 }}>
                    {activeTab === 'patient' ? (
                        /* Patient Form */
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={patientForm.fullName}
                                    onChange={(e) => handlePatientFormChange('fullName', e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                    variant="outlined"
                                    sx={{ bgcolor: 'grey.50' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={patientForm.email}
                                    onChange={(e) => handlePatientFormChange('email', e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    variant="outlined"
                                    sx={{ bgcolor: 'grey.50' }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    type="tel"
                                    value={patientForm.phone}
                                    onChange={(e) => handlePatientFormChange('phone', e.target.value)}
                                    placeholder="Enter your phone number"
                                    required
                                    variant="outlined"
                                    sx={{ bgcolor: 'grey.50' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                                    <InputLabel>Gender (Optional)</InputLabel>
                                    <Select
                                        value={patientForm.gender}
                                        onChange={(e) => handlePatientFormChange('gender', e.target.value)}
                                        label="Gender (Optional)"
                                    >
                                        <MenuItem value="">Select gender</MenuItem>
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                        <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Age (Optional)"
                                    type="number"
                                    value={patientForm.age}
                                    onChange={(e) => handlePatientFormChange('age', e.target.value)}
                                    placeholder="Enter your age"
                                    inputProps={{ min: 1, max: 120 }}
                                    variant="outlined"
                                    sx={{ bgcolor: 'grey.50' }}
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        /* Doctor Form */
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={doctorForm.fullName}
                                    onChange={(e) => handleDoctorFormChange('fullName', e.target.value)}
                                    placeholder="Dr. John Smith"
                                    required
                                    variant="outlined"
                                    sx={{ bgcolor: 'grey.50' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={doctorForm.email}
                                    onChange={(e) => handleDoctorFormChange('email', e.target.value)}
                                    placeholder="doctor@hospital.com"
                                    required
                                    variant="outlined"
                                    sx={{ bgcolor: 'grey.50' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    type="tel"
                                    value={doctorForm.phone}
                                    onChange={(e) => handleDoctorFormChange('phone', e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                    required
                                    variant="outlined"
                                    sx={{ bgcolor: 'grey.50' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Medical Registration Number"
                                    value={doctorForm.registrationNumber}
                                    onChange={(e) => handleDoctorFormChange('registrationNumber', e.target.value)}
                                    placeholder="MD123456789"
                                    required
                                    variant="outlined"
                                    sx={{ bgcolor: 'grey.50' }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Hospital/Clinic Name"
                                    value={doctorForm.hospitalName}
                                    onChange={(e) => handleDoctorFormChange('hospitalName', e.target.value)}
                                    placeholder="General Hospital"
                                    required
                                    variant="outlined"
                                    sx={{ bgcolor: 'grey.50' }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" required sx={{ bgcolor: 'grey.50' }}>
                                    <InputLabel>Specialization</InputLabel>
                                    <Select
                                        value={doctorForm.specialization}
                                        onChange={(e) => handleDoctorFormChange('specialization', e.target.value)}
                                        label="Specialization"
                                    >
                                        <MenuItem value="">Select your specialization</MenuItem>
                                        {specializations.map((spec) => (
                                            <MenuItem key={spec} value={spec.toLowerCase().replace(/\s+/g, '-')}>
                                                {spec}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Medical Certification
                                    </Typography>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload">
                                        <Button
                                            component="span"
                                            variant="outlined"
                                            startIcon={<Upload />}
                                            fullWidth
                                            sx={{
                                                py: 1.5,
                                                borderStyle: 'dashed',
                                                borderWidth: 2,
                                                bgcolor: 'grey.50',
                                                '&:hover': { bgcolor: 'grey.100' }
                                            }}
                                        >
                                            {selectedFile ? selectedFile.name : 'Upload Certificate'}
                                        </Button>
                                    </label>
                                    {selectedFile && (
                                        <Box sx={{ mt: 1 }}>
                                            <Chip
                                                label={selectedFile.name}
                                                onDelete={() => setSelectedFile(null)}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </Box>
                                    )}
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                        Upload your medical license or certification (PDF, JPG, PNG)
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    {/* Password Fields */}
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={activeTab === 'patient' ? patientForm.password : doctorForm.password}
                                onChange={(e) =>
                                    activeTab === 'patient'
                                        ? handlePatientFormChange('password', e.target.value)
                                        : handleDoctorFormChange('password', e.target.value)
                                }
                                placeholder="Create a password"
                                required
                                variant="outlined"
                                sx={{ bgcolor: 'grey.50' }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={activeTab === 'patient' ? patientForm.confirmPassword : doctorForm.confirmPassword}
                                onChange={(e) =>
                                    activeTab === 'patient'
                                        ? handlePatientFormChange('confirmPassword', e.target.value)
                                        : handleDoctorFormChange('confirmPassword', e.target.value)
                                }
                                placeholder="Confirm your password"
                                required
                                variant="outlined"
                                sx={{ bgcolor: 'grey.50' }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* Terms and Conditions */}
                    <Box sx={{ mt: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body2" color="text.secondary">
                                    I agree to the{' '}
                                    <Link href="/terms" color="primary">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" color="primary">
                                        Privacy Policy
                                    </Link>
                                </Typography>
                            }
                        />
                    </Box>

                    {/* Doctor Notice */}
                    {activeTab === 'doctor' && (
                        <Card
                            sx={{
                                mt: 3,
                                bgcolor: '#eff6ff', // Tailwind bg-blue-50
                                border: '1px solid #bfdbfe', // Tailwind border-blue-200
                                borderRadius: '12px',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#1e40af', // Tailwind text-blue-800
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    Your account will be reviewed by our admin team before activation.
                                    You'll receive an email once your account is approved.
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    {/* Error Message */}
                    {error && (
                        <Alert severity="error" sx={{ mt: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                        fullWidth
                        size="large"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        sx={{
                            mt: 3,
                            color: 'white',
                            py: 1.5,
                            bgcolor: 'grey.900',
                            '&:hover': { bgcolor: 'grey.800' },
                            fontSize: '16px',
                            fontWeight: 600,
                            textTransform: 'none'
                        }}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isLoading
                            ? 'Creating Account...'
                            : `Create ${activeTab === 'patient' ? 'Patient' : 'Doctor'} Account`
                        }
                    </Button>

                    {/* Footer Links */}
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Link href="/newLogin" color="primary">
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}

export default SignupForm;
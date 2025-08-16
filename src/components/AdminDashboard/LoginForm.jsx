import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

// Ensure this import path is correct relative to AdminLoginForm.jsx
// For example, if AdminLoginForm.jsx is in src/components/AdminDashboard,
// and firebase.js is in src/, then the path would be '../../firebase'.
import { signInWithEmail, signInWithGoogle } from '../../firebase'; // Added signInWithGoogle


/**
 * AdminLoginForm component for admin email/password and Google sign-in.
 * Handles form submission, displays errors, and redirects on successful login.
 */
const AdminLoginForm = () => {
    // Hook to programmatically navigate between routes
    const navigate = useNavigate();

    // State for managing login error messages
    const [error, setError] = useState(null);
    // State for indicating loading status during API calls
    const [loading, setLoading] = useState(false);
    // State for controlling the visibility of the success Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Initialize react-hook-form for form validation and submission handling
    const {
        register, // Function to register input fields
        handleSubmit, // Function to handle form submission
        formState: { errors } // Object containing form validation errors
    } = useForm();

    /**
     * Handles the email/password login submission.
     * This function is called when the form is valid and submitted.
     * @param {Object} data - Form data containing email and password.
     */
    const onSubmit = async (data) => {
        setLoading(true); // Set loading to true while the request is in progress
        setError(null); // Clear any previous error messages

        try {
            // Attempt to sign in with email and password using the Firebase utility
            await signInWithEmail(data.email, data.password);

            setSnackbarOpen(true); // Show a success message
            // Redirect to the admin dashboard after a short delay to allow the user to see the success message
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 1500);
        } catch (err) {
            console.error('Login error:', err);
            // Set a user-friendly error message based on the Firebase error or a generic one
            setError(err.message || 'Login failed. Please check your credentials and try again.');
            setSnackbarOpen(false); // Ensure success snackbar is closed on error
        } finally {
            setLoading(false); // Reset loading state regardless of success or failure
        }
    };

    /**
     * Handles the Google Sign-In button click.
     */
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            await signInWithGoogle();
            setSnackbarOpen(true); // Show success message
            setTimeout(() => {
                navigate('/admin/dashboard'); // Redirect to dashboard on success
            }, 1500);
        } catch (err) {
            console.error('Google Sign-In error:', err);
            // Display user-friendly error messages
            setError(err.message || 'Google Sign-In failed. Please try again or use email/password.');
            setSnackbarOpen(false); // Ensure snackbar is closed on error
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles closing the Snackbar message.
     * @param {Event} event - The event that triggered the close.
     * @param {string} reason - The reason the Snackbar was closed (e.g., 'timeout', 'clickaway').
     */
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return; // Do not close on clickaway
        }
        setSnackbarOpen(false); // Close the Snackbar
    };

    return (
        <Box
            sx={{
                maxWidth: '450px', // Constrain maximum width for better readability
                width: '100%',
                my: 'auto', // Center vertically
                mx: 'auto', // Center horizontally
                display: 'flex',
                justifyContent: 'center',
                p: 2, // Add some padding around the form
            }}
        >
            <Paper elevation={6} sx={{
                p: 4, // Padding inside the card
                width: '100%',
                borderRadius: '12px', // Rounded corners for the card
                display: 'flex',
                flexDirection: 'column',
                gap: '16px' // Space between elements inside the card
            }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Admin Login
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sign in to your admin account
                    </Typography>
                </Box>

                {/* Display error message if any */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                        {error}
                    </Alert>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <TextField
                        id="email"
                        label="Email address"
                        type="email"
                        fullWidth
                        autoComplete="email"
                        variant="outlined"
                        // Register email input with react-hook-form for validation
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: 'Invalid email format'
                            }
                        })}
                        // Apply error state and helper text based on validation errors
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={{ borderRadius: '8px' }}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        autoComplete="current-password"
                        variant="outlined"
                        // Register password input with react-hook-form for validation
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })}
                        // Apply error state and helper text based on validation errors
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={{ borderRadius: '8px' }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary" // Uses the primary color from your Material-UI theme
                        fullWidth
                        disabled={loading} // Disable button when loading
                        sx={{
                            py: 1.5,
                            mt: 2, // Margin top for spacing
                            borderRadius: '8px', // Rounded corners for the button
                            textTransform: 'none', // Prevent uppercase text
                            fontSize: '1rem',
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                    </Button>
                </form>

                {/* "Or continue with" divider */}
                <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1, borderBottom: 1, borderColor: 'divider' }} />
                    <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
                        Or continue with
                    </Typography>
                    <Box sx={{ flexGrow: 1, borderBottom: 1, borderColor: 'divider' }} />
                </Box>

                {/* Google Sign-In Button */}
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
                    sx={{
                        py: 1.5,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontSize: '1rem',
                        borderColor: 'grey.400', // Border color for outlined button
                        color: 'text.primary', // Text color
                    }}
                    onClick={handleGoogleSignIn}
                    disabled={loading} // Disable button while loading Google Sign-In
                >
                    {loading ? 'Signing In...' : 'Sign in with Google'}
                </Button>
            </Paper>

            {/* Snackbar for successful login message */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000} // Snackbar disappears after 6 seconds
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position at bottom center
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%', borderRadius: '8px' }}>
                    Login successful! Redirecting...
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminLoginForm;

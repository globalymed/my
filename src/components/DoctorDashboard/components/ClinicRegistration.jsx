import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Select,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const StepBadge = ({ active, label }) => (
  <Stack alignItems="center" spacing={1} sx={{ opacity: active ? 1 : 0.6 }}>
    <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>✓</Box>
    <Typography variant="caption" sx={{ fontWeight: 700 }}>{label}</Typography>
  </Stack>
);

const Req = ({ children }) => (
  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
    <span>{children}</span>
    <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
  </Box>
);

const UploadDropzone = ({
  label,
  required = false,
  file = null,
  files = [],
  multiple = false,
  accept = 'image/*',
  hint = 'JPG/PNG, max 5MB',
  onChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((pickedFiles) => {
    if (!pickedFiles) return;
    const list = Array.from(pickedFiles);
    // Filter by size 5MB
    const valid = list.filter((f) => f.size <= 5 * 1024 * 1024);
    
    if (multiple) {
      // For multiple files, append to existing files instead of replacing
      const existingFiles = files || [];
      const newFiles = [...existingFiles, ...valid];
      onChange(newFiles);
    } else {
      // For single file, replace as before
      onChange(valid[0] || null);
    }
  }, [multiple, onChange, files]); // Add 'files' to dependency array

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onBrowse = (e) => {
    handleFiles(e.target.files);
    // Clear the input value so the same file can be selected again
    e.target.value = '';
  };

  const removeSingle = () => onChange(multiple ? [] : null);
  const removeAt = (idx) => {
    const next = [...files];
    next.splice(idx, 1);
    onChange(next);
  };

  const hasFile = multiple ? files && files.length > 0 : !!file;

  return (
    <Box>
      <Typography variant="body2" fontWeight={700} mb={1}>
        {required ? <Req>{label}</Req> : label}
      </Typography>
      <Box
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        sx={{
          border: hasFile ? '2px dashed #16a34a' : '2px dashed #cbd5e1',
          bgcolor: hasFile ? 'rgba(16,185,129,0.08)' : 'transparent',
          borderRadius: 2,
          p: 2,
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.2s ease',
          outline: isDragging ? '3px solid #93c5fd' : 'none',
          cursor: 'pointer'
        }}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onBrowse}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
          aria-label={label}
        />
        {!hasFile && (
          <Stack spacing={1} alignItems="center" sx={{ color: '#475569', textAlign: 'center' }}>
            <Box sx={{ width: 42, height: 42, borderRadius: '50%', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 800 }}>↑</Box>
            <Typography variant="body2">Drag and drop your file here, or <u>browse</u></Typography>
            <Typography variant="caption" color="text.secondary">{hint}</Typography>
          </Stack>
        )}

        {hasFile && !multiple && (
          <Box sx={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={file ? URL.createObjectURL(file) : ''}
              alt="preview"
              style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 8 }}
            />
            <Button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeSingle(); }}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                minWidth: 0,
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: '#ef4444',
                color: 'white',
                '&:hover': { bgcolor: '#dc2626' }
              }}
            >
              ×
            </Button>
          </Box>
        )}

        {hasFile && multiple && (
          <Grid container spacing={1}>
            {files.map((f, idx) => (
              <Grid item key={`${f.name}-${idx}-${f.lastModified}`}>
                <Box sx={{ position: 'relative', p: 1, bgcolor: 'rgba(16,185,129,0.05)', border: '1px dashed #16a34a', borderRadius: 2 }}>
                  <img src={URL.createObjectURL(f)} alt={f.name} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }} />
                  <Button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeAt(idx); }}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      minWidth: 0,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: '#ef4444',
                      color: 'white',
                      '&:hover': { bgcolor: '#dc2626' }
                    }}
                  >
                    ×
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

const ClinicRegistration = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [activeStep, setActiveStep] = useState(0); // 0..3
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submissionAcknowledgment, setSubmissionAcknowledgment] = useState(false);
  const [draftId, setDraftId] = useState(localStorage.getItem('clinicRegistrationDraftId') || '');

  // Step state
  const [basic, setBasic] = useState({
    name: '',
    contactNumber: '',
    specialties: {
      ivf: false,
      hair: false,
      cosmetic: false,
      dental: false
    },
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    website: ''
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});

  const [regulatory, setRegulatory] = useState({
    clinicRegistrationNumber: '',
    issuingAuthority: '',
    ownerName: '',
    panOrGst: '',
    ownerIdProofFile: [], // Changed to array for multiple files
    registrationCertFile: [], // Changed to array for multiple files
    addressProofFile: [] // Changed to array for multiple files
  });

  const [facilities, setFacilities] = useState({
    numConsultRooms: 0,
    numOperationTheatres: 0,
    amenities: {
      wifi: false,
      parking: false,
      wheelchair: false,
      acWaiting: false,
      pharmacy: false,
      other: false
    },
    languages: {
      english: false,
      hindi: false,
      bengali: false,
      tamil: false,
      punjabi: false,
      telugu: false,
      other: false
    },
    emergency: false,
    hours: DAYS.reduce((acc, day) => {
      acc[day] = { open: '09:00', close: '18:00', closed: false };
      return acc;
    }, {})
  });

  const [media, setMedia] = useState({
    exteriorPhoto: [], // Changed to array for multiple files
    interiorPhoto: [], // Changed to array for multiple files
    logo: [], // Changed to array for multiple files
    staffPhotos: [] // array of Files
  });

  useEffect(() => {
    const doctorDataString = localStorage.getItem('doctorData');
    console.log('Raw doctor data from localStorage:', doctorDataString);
    
    if (!doctorDataString) {
      console.log('No doctor data found in localStorage, redirecting to login');
      navigate('/doctor-login');
      return;
    }
    try {
      const parsed = JSON.parse(doctorDataString);
      console.log('Parsed doctor data:', parsed);
      console.log('Doctor ID:', parsed?.id);
      
      setDoctor(parsed);
      
      // Verify latest clinicIds from Firestore and redirect if already has clinic
      if (parsed?.id) {
        (async () => {
          try {
            const dSnap = await getDoc(doc(db, 'doctors', parsed.id));
            const data = dSnap.exists() ? dSnap.data() : null;
            const clinicIds = Array.isArray(data?.clinicIds) ? data.clinicIds : [];
            console.log('Clinic IDs from Firestore:', clinicIds);
            
            if (clinicIds.length > 0) {
              console.log('Doctor already has clinics, redirecting to dashboard');
              navigate('/doctor-dashboard');
            }
          } catch (e) {
            console.error('Error fetching doctor data from Firestore:', e);
            // If fetch fails, allow access; dashboard check still controls button visibility
          }
        })();
      } else {
        console.error('Doctor ID is missing from parsed data');
      }
    } catch (e) {
      console.error('Error parsing doctor data from localStorage:', e);
      navigate('/doctor-login');
    }
  }, [navigate]);

  const progress = useMemo(() => (activeStep + 1) * 25, [activeStep]);

  // Input validation functions
  const validateAlphabetsOnly = (value) => {
    return /^[A-Za-z\s]+$/.test(value);
  };

  const validateNumbersOnly = (value) => {
    return /^\d+$/.test(value);
  };

  const validateContactNumber = (value) => {
    return /^\d{7,15}$/.test(value);
  };

  const validatePincode = (value) => {
    return /^\d{6}$/.test(value);
  };

  // Handle input changes with validation
  const handleBasicChange = (field, value) => {
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'name':
      case 'city':
      case 'state':
        if (!validateAlphabetsOnly(value)) {
          isValid = false;
          errorMessage = 'Only alphabets and spaces are allowed';
        }
        break;
      case 'contactNumber':
        if (!validateContactNumber(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid contact number (7-15 digits)';
        }
        break;
      case 'pincode':
        if (!validatePincode(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid 6-digit pincode';
        }
        break;
      case 'clinicRegistrationNumber':
        if (!validateNumbersOnly(value)) {
          isValid = false;
          errorMessage = 'Only numbers are allowed';
        }
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [field]: isValid ? null : errorMessage
    }));

    setBasic(prev => ({ ...prev, [field]: value }));
  };

  const handleRegulatoryChange = (field, value) => {
    let isValid = true;
    let errorMessage = '';

    if (field === 'clinicRegistrationNumber' && !validateNumbersOnly(value)) {
      isValid = false;
      errorMessage = 'Only numbers are allowed';
    }

    setValidationErrors(prev => ({
      ...prev,
      [field]: isValid ? null : errorMessage
    }));

    setRegulatory(prev => ({ ...prev, [field]: value }));
  };

  const isBasicValid = useMemo(() => {
    return (
      basic.name.trim().length > 2 &&
      !validationErrors.name &&
      basic.contactNumber.trim().length >= 7 &&
      !validationErrors.contactNumber &&
      basic.address.trim().length > 5 &&
      basic.city.trim().length > 1 &&
      !validationErrors.city &&
      basic.state.trim().length > 1 &&
      !validationErrors.state &&
      basic.pincode.trim().length === 6 &&
      !validationErrors.pincode
    );
  }, [basic, validationErrors]);

  const isRegulatoryValid = useMemo(() => {
    return (
      regulatory.clinicRegistrationNumber.trim().length >= 3 &&
      !validationErrors.clinicRegistrationNumber &&
      regulatory.issuingAuthority.trim().length >= 2 &&
      regulatory.ownerName.trim().length >= 3 &&
      regulatory.ownerIdProofFile.length >= 1 &&
      regulatory.registrationCertFile.length >= 1 &&
      regulatory.addressProofFile.length >= 1
    );
  }, [regulatory, validationErrors]);

  const isFacilitiesValid = useMemo(() => {
    return facilities.numConsultRooms >= 0 && facilities.numOperationTheatres >= 0;
  }, [facilities]);

  const isMediaValid = useMemo(() => {
    return media.exteriorPhoto.length >= 3 && media.interiorPhoto.length >= 3 && media.logo.length >= 1 && media.staffPhotos.length >= 3;
  }, [media]);

  // Get validation messages for media
  const getMediaValidationMessage = () => {
    const missing = [];
    if (media.exteriorPhoto.length < 3) missing.push('Clinic Exterior Photo (minimum 3 required)');
    if (media.interiorPhoto.length < 3) missing.push('Reception/Interior Photo (minimum 3 required)');
    if (media.logo.length < 1) missing.push('Clinic Logo (minimum 1 required)');
    if (media.staffPhotos.length < 3) missing.push('Doctor/Staff Photos (minimum 3 required)');
    
    if (missing.length > 0) {
      return `Required: ${missing.join(', ')}`;
    }
    return null;
  };

  const toggleSpecialty = (key) => setBasic((p) => ({ ...p, specialties: { ...p.specialties, [key]: !p.specialties[key] } }));
  const toggleAmenity = (key) => setFacilities((p) => ({ ...p, amenities: { ...p.amenities, [key]: !p.amenities[key] } }));
  const toggleLanguage = (key) => setFacilities((p) => ({ ...p, languages: { ...p.languages, [key]: !p.languages[key] } }));
  const toggleClosed = (day) => setFacilities((p) => ({ ...p, hours: { ...p.hours, [day]: { ...p.hours[day], closed: !p.hours[day].closed } } }));
  const setHour = (day, field, value) => setFacilities((p) => ({ ...p, hours: { ...p.hours, [day]: { ...p.hours[day], [field]: value } } }));

  const uploadToStorage = async (file, documentType) => {
    if (!file) return null;
    
    // Check if doctor.id exists
    if (!doctor || !doctor.id) {
      console.error('Doctor ID is missing:', doctor);
      throw new Error('Doctor ID is required for file upload');
    }
    
    try {
      // Create path: registration-documents/doctorId/documentType/filename
      const fileRef = ref(storage, `registration-documents/${doctor.id}/${documentType}/${Date.now()}_${file.name}`);
      console.log('Uploading file to path:', fileRef.fullPath);
      
      const snap = await uploadBytes(fileRef, file);
      console.log('File uploaded successfully:', snap.ref.fullPath);
      
      const downloadURL = await getDownloadURL(snap.ref);
      console.log('Download URL generated:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', file.name, error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }
  };

  const persist = async (finalize) => {
    if (!doctor) {
      setError('Doctor information not found. Please log in again.');
      return;
    }
    
    if (!doctor.id) {
      setError('Doctor ID is missing. Please log in again.');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      console.log('Starting clinic registration process for doctor:', doctor.id);
      
      // Get selected specialties
      const selectedSpecialties = Object.keys(basic.specialties).filter(key => basic.specialties[key]);
      
      if (selectedSpecialties.length === 0) {
        setError('Please select at least one specialty');
        setSubmitting(false);
        return;
      }

      // Upload all documents to Firebase storage with organized folder structure
      // New folder structure: registration-documents/doctorId/documentType/filename
      // This makes it easier for admins to locate specific document types
      console.log('Uploading documents with organized folder structure');
      
      // Upload regulatory documents (max 3 each)
      const ownerIdUrls = await Promise.all(
        regulatory.ownerIdProofFile.slice(0, 3).map((f) => uploadToStorage(f, 'owners-id-proof'))
      );
      
      const certUrls = await Promise.all(
        regulatory.registrationCertFile.slice(0, 3).map((f) => uploadToStorage(f, 'clinic-registration-certificate'))
      );
      
      const addrUrls = await Promise.all(
        regulatory.addressProofFile.slice(0, 3).map((f) => uploadToStorage(f, 'clinic-address-proof'))
      );

      // Upload media files (min 3 for photos, min 1 for logo)
      const exteriorUrls = await Promise.all(
        media.exteriorPhoto.slice(0, 10).map((f) => uploadToStorage(f, 'clinic-exterior-photos'))
      );
      
      const interiorUrls = await Promise.all(
        media.interiorPhoto.slice(0, 10).map((f) => uploadToStorage(f, 'clinic-interior-photos'))
      );
      
      const logoUrls = await Promise.all(
        media.logo.slice(0, 3).map((f) => uploadToStorage(f, 'clinic-logo'))
      );

      let staffUrls = [];
      if (media.staffPhotos && media.staffPhotos.length > 0) {
        // Limit to maximum 10 staff photos
        const limitedStaffPhotos = media.staffPhotos.slice(0, 10);
        staffUrls = await Promise.all(
          limitedStaffPhotos.map((f) => uploadToStorage(f, 'clinic-staff-photos'))
        );
      }

      // Create clinic document
      const clinicData = {
        doctorId: doctor.id,
        name: basic.name,
        contactNumber: basic.contactNumber,
        treatmentType: selectedSpecialties, // Array of selected specialties
        location: basic.city, // Use city as location
        address: basic.address,
        city: basic.city,
        state: basic.state,
        pincode: basic.pincode,
        country: basic.country,
        website: basic.website || '',
        status: 'unverified', // Default status as requested
        isDraft: !finalize,
        progress,
        
        // Regulatory information
        clinicRegistrationNumber: regulatory.clinicRegistrationNumber,
        issuingAuthority: regulatory.issuingAuthority,
        ownerName: regulatory.ownerName,
        panOrGst: regulatory.panOrGst || '',
        
        // Facilities
        numConsultRooms: facilities.numConsultRooms,
        numOperationTheatres: facilities.numOperationTheatres,
        amenities: facilities.amenities,
        languages: facilities.languages,
        emergency: facilities.emergency,
        operatingHours: facilities.hours,
        
        // Media URLs
        documents: {
          ownerIdProofUrls: ownerIdUrls.filter(Boolean),
          registrationCertUrls: certUrls.filter(Boolean),
          addressProofUrls: addrUrls.filter(Boolean),
          exteriorPhotoUrls: exteriorUrls.filter(Boolean),
          interiorPhotoUrls: interiorUrls.filter(Boolean),
          logoUrls: logoUrls.filter(Boolean),
          staffPhotoUrls: staffUrls.filter(Boolean)
        },
        
        // Document folder structure for admin dashboard
        // This mapping helps admins understand the folder organization
        // and makes it easier to fetch specific document types
        documentFolders: {
          ownersIdProof: 'owners-id-proof',
          clinicRegistrationCertificate: 'clinic-registration-certificate',
          clinicAddressProof: 'clinic-address-proof',
          clinicExteriorPhotos: 'clinic-exterior-photos',
          clinicInteriorPhotos: 'clinic-interior-photos',
          clinicLogo: 'clinic-logo',
          clinicStaffPhotos: 'clinic-staff-photos'
        },
        
        // Document limits for admin reference
        documentLimits: {
          ownersIdProof: { min: 1, max: 3 },
          clinicRegistrationCertificate: { min: 1, max: 3 },
          clinicAddressProof: { min: 1, max: 3 },
          clinicExteriorPhotos: { min: 3, max: 10 },
          clinicInteriorPhotos: { min: 3, max: 10 },
          clinicLogo: { min: 1, max: 3 },
          clinicStaffPhotos: { min: 3, max: 10 }
        },
        
        createdAt: serverTimestamp ? serverTimestamp() : new Date(),
        updatedAt: serverTimestamp ? serverTimestamp() : new Date()
      };

      if (draftId) {
        await updateDoc(doc(db, 'clinics', draftId), clinicData);
        console.log('Clinic draft updated', { draftId, clinicData });
      } else {
        const res = await addDoc(collection(db, 'clinics'), clinicData);
        setDraftId(res.id);
        localStorage.setItem('clinicRegistrationDraftId', res.id);
        console.log('Clinic draft created', { docId: res.id, clinicData });
      }

      setSuccess(finalize ? 'Registration submitted successfully for review.' : 'Draft saved successfully.');
      if (finalize) {
        setConfirmOpen(false);
        setSubmissionAcknowledgment(true);
      }
    } catch (e) {
      console.error('Clinic save failed', e);
      
      // Provide more specific error messages
      if (e.message.includes('Doctor ID is required')) {
        setError('Authentication error: Please log in again.');
      } else if (e.message.includes('Failed to upload')) {
        setError(`File upload failed: ${e.message}. Please check your internet connection and try again.`);
      } else if (e.message.includes('storage/unauthorized')) {
        setError('Permission denied. Please contact support or try logging in again.');
      } else {
        setError(`Failed to save: ${e.message}. Please try again.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => setActiveStep((s) => Math.min(3, s + 1));
  const prev = () => setActiveStep((s) => Math.max(0, s - 1));

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', bgcolor: '#f8fafc', p: { xs: 1, md: 3 } }}>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, width: '100%', borderRadius: 3 }}>
        <Stack spacing={2}>
          <Stack spacing={0.5} alignItems="center">
            <Typography variant="h6" fontWeight={800}>Join Our Healthcare Network</Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Register your clinic with MedYatra and connect with patients across the region. Quick approval and secure access to our platform.
            </Typography>
            <Stack direction="row" spacing={2} mt={1}>
              <Chip size="small" label="Secure & Verified" />
              <Chip size="small" label="Quick Approval" />
              <Chip size="small" label="10,000+ Patients" />
            </Stack>
          </Stack>

          <Box sx={{ bgcolor: '#0ea5b7', color: 'white', borderRadius: 2, p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={800}>Clinic Registration</Typography>
              <Typography variant="caption" fontWeight={700}>Progress {progress}%</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={progress} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
            <Stack direction="row" justifyContent="space-around" mt={2}>
              <StepBadge active={activeStep >= 0} label={'Basic Information'} />
              <StepBadge active={activeStep >= 1} label={'Regulatory Details'} />
              <StepBadge active={activeStep >= 2} label={'Facilities & Operations'} />
              <StepBadge active={activeStep >= 3} label={'Media & Branding'} />
            </Stack>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          {/* STEP CONTENTS */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={800} mb={2}>Basic Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField 
                    label={<Req>Clinic/Hospital Name</Req>} 
                    fullWidth 
                    value={basic.name} 
                    onChange={(e) => handleBasicChange('name', e.target.value)}
                    error={!!validationErrors.name}
                    helperText={validationErrors.name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    label={<Req>Contact Number</Req>} 
                    fullWidth 
                    value={basic.contactNumber} 
                    onChange={(e) => handleBasicChange('contactNumber', e.target.value)}
                    error={!!validationErrors.contactNumber}
                    helperText={validationErrors.contactNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" fontWeight={700}><Req>Clinic Type / Specialty</Req></Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1} rowGap={1} mt={1}>
                    {Object.keys(basic.specialties).map((key) => (
                      <FormControlLabel key={key} control={<Checkbox checked={basic.specialties[key]} onChange={() => toggleSpecialty(key)} />} label={key.charAt(0).toUpperCase() + key.slice(1)} />
                    ))}
                  </Stack>
                  {Object.values(basic.specialties).every(specialty => !specialty) && (
                    <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
                      Please select at least one specialty
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    label={<Req>Full Address</Req>} 
                    fullWidth 
                    multiline 
                    minRows={2} 
                    value={basic.address} 
                    onChange={(e) => handleBasicChange('address', e.target.value)} 
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField 
                    label={<Req>City</Req>} 
                    fullWidth 
                    value={basic.city} 
                    onChange={(e) => handleBasicChange('city', e.target.value)}
                    error={!!validationErrors.city}
                    helperText={validationErrors.city}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField 
                    label={<Req>State</Req>} 
                    fullWidth 
                    value={basic.state} 
                    onChange={(e) => handleBasicChange('state', e.target.value)}
                    error={!!validationErrors.state}
                    helperText={validationErrors.state}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField 
                    label={<Req>Pincode</Req>} 
                    fullWidth 
                    value={basic.pincode} 
                    onChange={(e) => handleBasicChange('pincode', e.target.value)}
                    error={!!validationErrors.pincode}
                    helperText={validationErrors.pincode}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField 
                    label="Country" 
                    fullWidth 
                    value={basic.country} 
                    onChange={(e) => handleBasicChange('country', e.target.value)} 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    label="Website URL (Optional)" 
                    fullWidth 
                    value={basic.website} 
                    onChange={(e) => handleBasicChange('website', e.target.value)} 
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={800} mb={2}>Regulatory Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField 
                    label={<Req>Clinic Registration Number</Req>} 
                    fullWidth 
                    value={regulatory.clinicRegistrationNumber} 
                    onChange={(e) => handleRegulatoryChange('clinicRegistrationNumber', e.target.value)}
                    error={!!validationErrors.clinicRegistrationNumber}
                    helperText={validationErrors.clinicRegistrationNumber}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label={<Req>Issuing Authority</Req>} fullWidth value={regulatory.issuingAuthority} onChange={(e) => setRegulatory({ ...regulatory, issuingAuthority: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label={<Req>Owner's Name</Req>} fullWidth value={regulatory.ownerName} onChange={(e) => setRegulatory({ ...regulatory, ownerName: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="PAN or GST Number (Optional)" fullWidth value={regulatory.panOrGst} onChange={(e) => setRegulatory({ ...regulatory, panOrGst: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <UploadDropzone
                    label="Owner's ID Proof"
                    required
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    files={regulatory.ownerIdProofFile}
                    onChange={(f) => {
                      const files = Array.isArray(f) ? f : [];
                      const limitedFiles = files.slice(0, 3);
                      setRegulatory({ ...regulatory, ownerIdProofFile: limitedFiles });
                    }}
                    hint="PDF/JPG/PNG, max 5MB each, maximum 3 documents"
                  />
                  {regulatory.ownerIdProofFile.length >= 3 && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      Maximum 3 documents allowed
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <UploadDropzone
                    label="Clinic Registration Certificate"
                    required
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    files={regulatory.registrationCertFile}
                    onChange={(f) => {
                      const files = Array.isArray(f) ? f : [];
                      const limitedFiles = files.slice(0, 3);
                      setRegulatory({ ...regulatory, registrationCertFile: limitedFiles });
                    }}
                    hint="PDF/JPG/PNG, max 5MB each, maximum 3 documents"
                  />
                  {regulatory.registrationCertFile.length >= 3 && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      Maximum 3 documents allowed
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <UploadDropzone
                    label="Address Proof of Clinic"
                    required
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    files={regulatory.addressProofFile}
                    onChange={(f) => {
                      const files = Array.isArray(f) ? f : [];
                      const limitedFiles = files.slice(0, 3);
                      setRegulatory({ ...regulatory, addressProofFile: limitedFiles });
                    }}
                    hint="Electricity bill/Lease agreement/Property tax receipt (PDF/JPG/PNG, max 5MB each, maximum 3 documents)"
                  />
                  {regulatory.addressProofFile.length >= 3 && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      Maximum 3 documents allowed
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={800} mb={2}>Facilities & Operations</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField type="number" label={<Req>Number of Consultation Rooms</Req>} fullWidth value={facilities.numConsultRooms} onChange={(e) => setFacilities({ ...facilities, numConsultRooms: Number(e.target.value) })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField type="number" label={<Req>Number of Operation Theatres</Req>} fullWidth value={facilities.numOperationTheatres} onChange={(e) => setFacilities({ ...facilities, numOperationTheatres: Number(e.target.value) })} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" fontWeight={700}>Available Facilities</Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1} rowGap={1} mt={1}>
                    {Object.keys(facilities.amenities).map((key) => (
                      <FormControlLabel key={key} control={<Checkbox checked={facilities.amenities[key]} onChange={() => toggleAmenity(key)} />} label={key === 'acWaiting' ? 'AC Waiting Area' : key.charAt(0).toUpperCase() + key.slice(1)} />
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" fontWeight={700}>Languages Spoken</Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1} rowGap={1} mt={1}>
                    {Object.keys(facilities.languages).map((key) => (
                      <FormControlLabel key={key} control={<Checkbox checked={facilities.languages[key]} onChange={() => toggleLanguage(key)} />} label={key.charAt(0).toUpperCase() + key.slice(1)} />
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Checkbox checked={facilities.emergency} onChange={() => setFacilities({ ...facilities, emergency: !facilities.emergency })} />} label="Emergency Availability" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" fontWeight={700} mb={1}>Operating Hours</Typography>
                  <Grid container spacing={1}>
                    {DAYS.map((day) => (
                      <Grid item xs={12} md={6} key={day}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ width: 92, fontWeight: 600 }}>{day}</Box>
                          <Select size="small" value={facilities.hours[day].open} onChange={(e) => setHour(day, 'open', e.target.value)} disabled={facilities.hours[day].closed}>
                            {['06:00','07:00','08:00','09:00','10:00','11:00'].map((t) => (<MenuItem key={t} value={t}>{t}</MenuItem>))}
                          </Select>
                          <Typography variant="body2">to</Typography>
                          <Select size="small" value={facilities.hours[day].close} onChange={(e) => setHour(day, 'close', e.target.value)} disabled={facilities.hours[day].closed}>
                            {['16:00','17:00','18:00','19:00','20:00','21:00'].map((t) => (<MenuItem key={t} value={t}>{t}</MenuItem>))}
                          </Select>
                          <FormControlLabel sx={{ ml: 1 }} control={<Checkbox checked={!!facilities.hours[day].closed} onChange={() => toggleClosed(day)} />} label="Closed" />
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={800} mb={2}>Media & Branding</Typography>
              {!isMediaValid && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {getMediaValidationMessage()}
                </Alert>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <UploadDropzone
                    label="Clinic Exterior Photo"
                    required
                    multiple
                    accept="image/*"
                    files={media.exteriorPhoto}
                    onChange={(f) => {
                      const files = Array.isArray(f) ? f : [];
                      const limitedFiles = files.slice(0, 10);
                      setMedia({ ...media, exteriorPhoto: limitedFiles });
                    }}
                    hint="JPG/PNG, max 5MB each, minimum 3 required, maximum 10 photos"
                  />
                  {media.exteriorPhoto.length < 3 && (
                    <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
                      Minimum 3 photos required
                    </Typography>
                  )}
                  {media.exteriorPhoto.length >= 10 && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      Maximum 10 photos allowed
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <UploadDropzone
                    label="Reception/Interior Photo"
                    required
                    multiple
                    accept="image/*"
                    files={media.interiorPhoto}
                    onChange={(f) => {
                      const files = Array.isArray(f) ? f : [];
                      const limitedFiles = files.slice(0, 10);
                      setMedia({ ...media, interiorPhoto: limitedFiles });
                    }}
                    hint="JPG/PNG, max 5MB each, minimum 3 required, maximum 10 photos"
                  />
                  {media.interiorPhoto.length < 3 && (
                    <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
                      Minimum 3 photos required
                    </Typography>
                  )}
                  {media.interiorPhoto.length >= 10 && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      Maximum 10 photos allowed
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <UploadDropzone
                    label="Clinic Logo"
                    required
                    multiple
                    accept="image/*"
                    files={media.logo}
                    onChange={(f) => {
                      const files = Array.isArray(f) ? f : [];
                      const limitedFiles = files.slice(0, 3);
                      setMedia({ ...media, logo: limitedFiles });
                    }}
                    hint="PNG recommended, max 5MB each, minimum 1 required, maximum 3 logos"
                  />
                  {media.logo.length < 1 && (
                    <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
                      Minimum 1 logo required
                    </Typography>
                  )}
                  {media.logo.length >= 3 && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      Maximum 3 logos allowed
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <UploadDropzone
                    label="Doctor/Staff Photos"
                    required
                    multiple
                    accept="image/*"
                    files={media.staffPhotos}
                    onChange={(arr) => {
                      const files = Array.isArray(arr) ? arr : [];
                      // Limit to maximum 10 files
                      const limitedFiles = files.slice(0, 10);
                      setMedia({ ...media, staffPhotos: limitedFiles });
                    }}
                    hint="JPG/PNG, max 5MB each, minimum 3 required, maximum 10 photos"
                  />
                  {media.staffPhotos.length < 3 && (
                    <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
                      Minimum 3 photos required
                    </Typography>
                  )}
                  {media.staffPhotos.length >= 10 && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      Maximum 10 photos allowed
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}

          <Divider />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button variant="outlined" onClick={prev} disabled={activeStep === 0}>Previous</Button>
              <Button variant="text" onClick={() => persist(false)} disabled={submitting}>Save as Draft</Button>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              {activeStep < 3 ? (
                <Button
                  variant="contained"
                  onClick={next}
                  disabled={(activeStep === 0 && !isBasicValid) || (activeStep === 1 && !isRegulatoryValid) || (activeStep === 2 && !isFacilitiesValid)}
                >
                  Continue
                </Button>
              ) : (
                <Button variant="contained" color="warning" onClick={() => setConfirmOpen(true)} disabled={!isMediaValid || submitting}>
                  Submit Registration
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to submit your clinic registration? Once submitted, you won't be able to make changes until the review is complete.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => persist(true)} disabled={submitting}>Yes, Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Submission Acknowledgment Dialog */}
      <Dialog 
        open={submissionAcknowledgment} 
        onClose={() => setSubmissionAcknowledgment(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            bgcolor: '#16a34a', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mx: 'auto', 
            mb: 3 
          }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>✓</Typography>
          </Box>
          
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Registration Submitted Successfully!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your clinic registration has been submitted and is now under review.
          </Typography>
          <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => {
              setSubmissionAcknowledgment(false);
              navigate('/doctor-dashboard');
            }}
            sx={{ 
              bgcolor: '#0ea5b7', 
              '&:hover': { bgcolor: '#0891b2' },
              px: 4,
              py: 1.5
            }}
          >
            Go to Dashboard
          </Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ClinicRegistration;
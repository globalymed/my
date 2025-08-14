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
    onChange(multiple ? valid : valid[0] || null);
  }, [multiple, onChange]);

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onBrowse = (e) => {
    handleFiles(e.target.files);
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
              <Grid item key={`${f.name}-${idx}`}>
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
    ownerIdProofFile: null,
    registrationCertFile: null,
    addressProofFile: null
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
    exteriorPhoto: null,
    interiorPhoto: null,
    logo: null,
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
      regulatory.ownerIdProofFile &&
      regulatory.registrationCertFile &&
      regulatory.addressProofFile
    );
  }, [regulatory, validationErrors]);

  const isFacilitiesValid = useMemo(() => {
    return facilities.numConsultRooms >= 0 && facilities.numOperationTheatres >= 0;
  }, [facilities]);

  const isMediaValid = useMemo(() => {
    return !!media.exteriorPhoto && !!media.interiorPhoto && !!media.logo; // staff optional
  }, [media]);

  // Get validation messages for media
  const getMediaValidationMessage = () => {
    const missing = [];
    if (!media.exteriorPhoto) missing.push('Clinic Exterior Photo');
    if (!media.interiorPhoto) missing.push('Reception/Interior Photo');
    if (!media.logo) missing.push('Clinic Logo');
    
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

  const uploadToStorage = async (file, path) => {
    if (!file) return null;
    
    // Check if doctor.id exists
    if (!doctor || !doctor.id) {
      console.error('Doctor ID is missing:', doctor);
      throw new Error('Doctor ID is required for file upload');
    }
    
    try {
      // Create path: registration-documents/doctorId/documents/filename
      const fileRef = ref(storage, `registration-documents/${doctor.id}/documents/${Date.now()}_${file.name}`);
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

      // Upload all documents to Firebase storage
      const basePath = `registration-documents/${doctor.id}/documents`;
      console.log('Uploading documents to base path:', basePath);
      
      const [ownerIdUrl, certUrl, addrUrl, exteriorUrl, interiorUrl, logoUrl] = await Promise.all([
        uploadToStorage(regulatory.ownerIdProofFile, basePath),
        uploadToStorage(regulatory.registrationCertFile, basePath),
        uploadToStorage(regulatory.addressProofFile, basePath),
        uploadToStorage(media.exteriorPhoto, basePath),
        uploadToStorage(media.interiorPhoto, basePath),
        uploadToStorage(media.logo, basePath)
      ]);

      let staffUrls = [];
      if (media.staffPhotos && media.staffPhotos.length > 0) {
        // Limit to maximum 3 staff photos
        const limitedStaffPhotos = media.staffPhotos.slice(0, 3);
        staffUrls = await Promise.all(
          limitedStaffPhotos.map((f) => uploadToStorage(f, basePath))
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
          ownerIdProofUrl: ownerIdUrl,
          registrationCertUrl: certUrl,
          addressProofUrl: addrUrl,
          exteriorPhotoUrl: exteriorUrl,
          interiorPhotoUrl: interiorUrl,
          logoUrl: logoUrl,
          staffPhotoUrls: staffUrls.filter(Boolean)
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
        // Redirect to dashboard after successful submission
        setTimeout(() => {
          navigate('/doctor-dashboard');
        }, 2000);
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
                    accept=".pdf,.jpg,.jpeg,.png"
                    file={regulatory.ownerIdProofFile}
                    onChange={(f) => setRegulatory({ ...regulatory, ownerIdProofFile: f })}
                    hint="PDF/JPG/PNG, max 5MB"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <UploadDropzone
                    label="Clinic Registration Certificate"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    file={regulatory.registrationCertFile}
                    onChange={(f) => setRegulatory({ ...regulatory, registrationCertFile: f })}
                    hint="PDF/JPG/PNG, max 5MB"
                  />
                </Grid>
                <Grid item xs={12}>
                  <UploadDropzone
                    label="Address Proof of Clinic"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    file={regulatory.addressProofFile}
                    onChange={(f) => setRegulatory({ ...regulatory, addressProofFile: f })}
                    hint="Electricity bill/Lease agreement/Property tax receipt (PDF/JPG/PNG, max 5MB)"
                  />
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
                    accept="image/*"
                    file={media.exteriorPhoto}
                    onChange={(f) => setMedia({ ...media, exteriorPhoto: f })}
                    hint="JPG/PNG, max 5MB"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <UploadDropzone
                    label="Reception/Interior Photo"
                    required
                    accept="image/*"
                    file={media.interiorPhoto}
                    onChange={(f) => setMedia({ ...media, interiorPhoto: f })}
                    hint="JPG/PNG, max 5MB"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <UploadDropzone
                    label="Clinic Logo"
                    required
                    accept="image/*"
                    file={media.logo}
                    onChange={(f) => setMedia({ ...media, logo: f })}
                    hint="PNG recommended, max 5MB"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <UploadDropzone
                    label="Doctor/Staff Photos (Optional)"
                    multiple
                    accept="image/*"
                    files={media.staffPhotos}
                    onChange={(arr) => {
                      const files = Array.isArray(arr) ? arr : [];
                      // Limit to maximum 3 files
                      const limitedFiles = files.slice(0, 3);
                      setMedia({ ...media, staffPhotos: limitedFiles });
                    }}
                    hint="JPG/PNG, max 5MB each, maximum 3 photos"
                  />
                  {media.staffPhotos.length >= 3 && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      Maximum 3 photos allowed
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
            Are you sure you want to submit your clinic registration? Once submitted, you won’t be able to make changes until the review is complete.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => persist(true)} disabled={submitting}>Yes, Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClinicRegistration;

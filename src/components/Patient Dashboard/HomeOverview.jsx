import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Button,
    Grid,
    LinearProgress,
    Chip,
    useTheme
} from '@mui/material';

// --- Using icons exclusively from @mui/icons-material for consistency ---
import {
    AccessTime,
    Article,
    CalendarToday,
    CameraAlt,
    CheckCircle,
    CreditCard,
    Flight,
    Hotel,
    ListAlt,
    LocationOn,
    Medication,
    MedicalServices,
    Phone,
    Schedule,
    Upload,
    Videocam
} from '@mui/icons-material';

// Import Firebase storage functions
import { storage } from "../../firebase.js";
import { ref, listAll, getDownloadURL, getMetadata, uploadBytes } from 'firebase/storage';

const HomeOverview = ({ user, appointments, setActiveSection }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [recentDocuments, setRecentDocuments] = useState([]);
    const [loadingDocuments, setLoadingDocuments] = useState(true);
    const [uploading, setUploading] = useState(false);

    console.log("HomeOverview user:", user);

    // Helper function to get file type from content type or filename
    const getFileType = (contentType, filename) => {
        if (contentType) {
            if (contentType.startsWith('image/')) return 'Image';
            if (contentType.includes('pdf')) return 'PDF';
            if (contentType.includes('document') || contentType.includes('word')) return 'Document';
            if (contentType.includes('spreadsheet') || contentType.includes('excel')) return 'Spreadsheet';
        }
        
        // Fallback to file extension
        const extension = filename.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
                return 'Image';
            case 'pdf':
                return 'PDF';
            case 'doc':
            case 'docx':
                return 'Document';
            case 'xls':
            case 'xlsx':
                return 'Spreadsheet';
            case 'txt':
                return 'Text';
            default:
                return 'File';
        }
    };

    // Helper function to get chip color based on file type
    const getFileTypeChipColor = (fileType) => {
        switch (fileType) {
            case 'Image':
                return 'primary';
            case 'PDF':
                return 'error';
            case 'Document':
                return 'info';
            case 'Spreadsheet':
                return 'success';
            default:
                return 'default';
        }
    };

    // Helper function to clean filename
    const cleanFileName = (filename, userId) => {
        if (!filename) return 'Untitled Document';
        
        console.log("Cleaning filename:", filename, "for user:", userId);
        
        // Remove user ID prefix if present
        let cleanName = filename.replace(`${userId}_`, '');
        
        // Remove timestamp patterns at the beginning (like 1751803937590)
        cleanName = cleanName.replace(/^\d{10,13}/, ''); // Remove 10-13 digit timestamps
        
        // Remove any remaining underscores at the start
        cleanName = cleanName.replace(/^_+/, '');
        
        // If we cleaned too much, fall back to original
        if (!cleanName || cleanName.trim() === '') {
            cleanName = filename;
        }
        
        console.log("Cleaned filename result:", cleanName);
        return cleanName;
    };

    // Handle file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const userId = user?.uid || user?.id;
        if (!file || !userId) return;

        setUploading(true);
        try {
            // Use the same naming convention as DocumentsSection
            const fileName = `${userId}_${file.name}`;
            const fileRef = ref(storage, `medical-records/${userId}/${fileName}`);
            
            await uploadBytes(fileRef, file);
            
            // Refresh the documents list
            fetchRecentDocuments();
            
            console.log('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
            // Reset the input
            event.target.value = '';
        }
    };

    // Find the next upcoming appointment
    const upcomingAppointment = appointments?.find(apt =>
        new Date(apt.appointmentDate) > new Date()
    );

    // Placeholder for meeting link if it doesn't exist
    if (upcomingAppointment && !upcomingAppointment.meetingLink) {
        upcomingAppointment.meetingLink = "https://example.com/meeting-link";
    }

    // Handler for navigating to plan journey route
    const handlePlanJourney = () => {
        navigate('/plan-journey');
    };

    // Fetch recent documents from Firebase storage
    const fetchRecentDocuments = async () => {
        // Check for both uid and id properties to match DocumentsSection logic
        const userId = user?.uid || user?.id;
        if (!userId) {
            console.log("No user ID found", user);
            setLoadingDocuments(false);
            return;
        }
        
        try {
            setLoadingDocuments(true);
            console.log("Fetching documents for user:", userId);
            console.log("User object:", user);
            
            // Use the same path structure as DocumentsSection
            const userDocsRef = ref(storage, `medical-records/${userId}`);
            const result = await listAll(userDocsRef);
            
            console.log("Found files:", result.items.length);
            console.log("Files found:", result.items.map(item => item.name));
            
            const documents = await Promise.all(
                result.items.slice(0, 5).map(async (itemRef) => {
                    try {
                        const url = await getDownloadURL(itemRef);
                        const metadata = await getMetadata(itemRef);
                        
                        console.log("Processing file:", itemRef.name);
                        console.log("Metadata:", metadata);
                        
                        const fileType = getFileType(metadata.contentType, itemRef.name);
                        const cleanTitle = cleanFileName(metadata.name || itemRef.name, userId);
                        
                        return {
                            id: itemRef.name,
                            title: cleanTitle,
                            url: url,
                            timestamp: metadata.timeCreated,
                            size: metadata.size,
                            contentType: metadata.contentType,
                            fileType: fileType
                        };
                    } catch (error) {
                        console.error('Error fetching document metadata for:', itemRef.name, error);
                        return null;
                    }
                })
            );
            
            const validDocuments = documents.filter(doc => doc !== null);
            // Sort by timestamp, newest first
            validDocuments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            console.log("Valid documents processed:", validDocuments);
            setRecentDocuments(validDocuments);
        } catch (error) {
            console.error('Error fetching recent documents:', error);
            console.error('Storage path attempted:', `medical-records/${userId}`);
        } finally {
            setLoadingDocuments(false);
        }
    };

    useEffect(() => {
        fetchRecentDocuments();
    }, [user?.uid, user?.id]); // Watch both uid and id properties

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* Welcome Message */}
            <Box>
                <Typography variant="h4" fontWeight="bold" fontSize="2.125rem">
                    Welcome back, {user?.firstName || user?.name || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    It's a sunny day today, we hope you're taking good care of your health 😊
                </Typography>
            </Box>

            {/* Main Grid Layout */}
            <Grid container spacing={3}>
                {/* Row 1: Upcoming Appointment & Calendar (interchanged positions) */}
                <Grid item xs={12} md={7}>
                    <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
                        <CardHeader
                            title={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CalendarToday />
                                    <Typography variant="h6">Upcoming Appointment</Typography>
                                </Box>
                            }
                        />
                        <CardContent>
                            {upcomingAppointment ? (
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={8}>
                                        <Typography variant="h6">{upcomingAppointment.treatmentType || "Appointment"}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {upcomingAppointment.doctorName || "Doctor Name"}
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={1} gap={1}>
                                            <AccessTime fontSize="small" />
                                            <Typography variant="body2">
                                                {new Date(upcomingAppointment.appointmentDate).toLocaleDateString()} - {upcomingAppointment.appointmentTime || "TBD"}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" mt={1} gap={1}>
                                            <LocationOn fontSize="small" />
                                            <Typography variant="body2">
                                                {upcomingAppointment.hospitalName || "Hospital Name"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4} display="flex" flexDirection="column" gap={1}>
                                        <Button variant="contained" startIcon={<Videocam />} fullWidth sx={{ textTransform: 'none', borderRadius: 2, bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}>
                                            Join Call
                                        </Button>
                                        <Button variant="outlined" fullWidth sx={{ textTransform: 'none', borderRadius: 2 }}>
                                            Reschedule
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ pt: 4 }}>
                                    No upcoming appointments found.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Calendar moved to this position */}
                <Grid item xs={12} md={5}>
                    <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
                        <CalendarCard appointments={appointments} />
                    </Card>
                </Grid>

                {/* Travel Snapshot and Documents/Action Items Section */}
                <Grid item xs={12} md={7} container spacing={3}>
                    {/* Travel Snapshot */}
                    <Grid item xs={12}>
                        <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC" }}>
                            <Typography variant="h6" mb={2}>Travel Snapshot</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <BookingCard
                                        icon={<CreditCard sx={{ fontSize: 28, color: "#1A237E" }} />}
                                        title="Get Your Visa Instantly"
                                        price="XXX"
                                        unit="per person"
                                        tags={[{ label: "Normal" }, { label: "Tourist Visa" }]}
                                        buttonText="Get Visa"
                                        color="#E8EAF6"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <BookingCard
                                        icon={<Flight sx={{ fontSize: 28, color: "#0277BD" }} />}
                                        title="Book Flight Easily"
                                        price="$200"
                                        unit="per person"
                                        tags={[{ label: "Business" }, { label: "Economy" }]}
                                        buttonText="Book Ticket"
                                        color="#E1F5FE"
                                        onCardClick={handlePlanJourney}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <BookingCard
                                        icon={<Hotel sx={{ fontSize: 28, color: "#303F9F" }} />}
                                        title="Hotel Rooms Booking"
                                        price="$150"
                                        unit="per night"
                                        tags={[{ label: "Normal" }, { label: "Luxury" }]}
                                        buttonText="Book Room"
                                        color="#C5CAE9"
                                        onCardClick={handlePlanJourney}
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    {/* Recent Documents & Action Items */}
                    <Grid item xs={12} sm={7}>
                        <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
                            <CardHeader title={<Box display="flex" alignItems="center" gap={1}><Article /><Typography variant="h6">Recent Documents</Typography></Box>} />
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {loadingDocuments ? (
                                    <Typography variant="body2" color="text.secondary">Loading documents...</Typography>
                                ) : recentDocuments.length > 0 ? (
                                    recentDocuments.map((doc) => (
                                        <Box key={doc.id} display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    overflow: 'hidden', 
                                                    textOverflow: 'ellipsis', 
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '60%',
                                                    cursor: 'pointer',
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                                onClick={() => window.open(doc.url, '_blank')}
                                                title={doc.title}
                                            >
                                                {doc.title}
                                            </Typography>
                                            <Box display="flex" gap={1} alignItems="center">
                                                <Chip 
                                                    label={doc.fileType} 
                                                    size="small" 
                                                    color={getFileTypeChipColor(doc.fileType)}
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.65rem', height: '20px' }}
                                                />
                                                <Chip 
                                                    label={new Date(doc.timestamp).toLocaleDateString()} 
                                                    size="small" 
                                                    variant="outlined" 
                                                    sx={{ fontSize: '0.65rem', height: '20px' }}
                                                />
                                            </Box>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No documents found</Typography>
                                )}
                                
                                {/* File Upload */}
                                <Box sx={{ mt: 2 }}>
                                    <input
                                        type="file"
                                        id="file-upload"
                                        style={{ display: 'none' }}
                                        onChange={handleFileUpload}
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xls,.xlsx"
                                    />
                                    <label htmlFor="file-upload">
                                        <Button 
                                            variant="outlined" 
                                            size="small" 
                                            startIcon={<Upload />} 
                                            component="span"
                                            disabled={uploading}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            {uploading ? 'Uploading...' : 'Upload New'}
                                        </Button>
                                    </label>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
                            <CardHeader title={<Box display="flex" alignItems="center" gap={1}><ListAlt /><Typography variant="h6">Action Items</Typography></Box>} />
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Medication fontSize="small" color="primary" />
                                    <Typography variant="body2">Take morning medication</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CameraAlt fontSize="small" color="success" />
                                    <Typography variant="body2">Upload pre-surgery photos</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Phone fontSize="small" color="warning" />
                                    <Typography variant="body2">Confirm transport pickup</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Treatment Progress moved to this position */}
                <Grid item xs={12} md={5}>
                    <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
                        <CardHeader
                            title={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <MedicalServices />
                                    <Typography variant="h6">Treatment Progress</Typography>
                                </Box>
                            }
                        />
                        <CardContent>
                            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={2}>
                                <Box flex={1}>
                                    <Typography fontWeight={600}>Knee Replacement</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Apollo Hospital, Delhi
                                    </Typography>
                                </Box>
                                <Box flex={1} width="100%">
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2">Progress</Typography>
                                        <Typography variant="body2" fontWeight={600}>Pre-Surgery</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={25}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: '#e0e0e0',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: 'black',
                                                borderRadius: 5,
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box mt={2} display="flex" flexDirection="column" gap={0.5}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CheckCircle fontSize="small" color="success" />
                                    <Typography variant="body2">Initial Consultation</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CheckCircle fontSize="small" color="success" />
                                    <Typography variant="body2">Medical Records Review</Typography>
                                </Box>

                                <Box display="flex" alignItems="center" gap={1}>
                                    <Schedule fontSize="small" color="warning" />
                                    <Typography variant="body2">Pre-Surgery Tests</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

const BookingCard = ({ icon, title, price, unit, tags, buttonText, color, onCardClick }) => {
    const handleButtonClick = () => {
        if (onCardClick && typeof onCardClick === 'function') {
            onCardClick();
        }
    };

    return (
        <Box sx={{
            borderRadius: 3, border: "1px solid #E4E7EC", p: 2, textAlign: "left",
            display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper'
        }}>
            <Box sx={{ width: 56, height: 56, borderRadius: 2, backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                {icon}
            </Box>
            <Typography fontWeight="600" fontSize={17} mb={1}>{title}</Typography>
            <Box>
                <Typography variant="h5" fontWeight="bold" component="span">{price}</Typography>
                <Typography variant="body2" component="span" sx={{ color: "text.secondary", ml: 0.5 }}>{unit}</Typography>
            </Box>
            <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                {tags.map((tag, idx) => (
                    <Chip key={idx} label={tag.label} sx={{ bgcolor: color, fontWeight: 500 }} size="small" />
                ))}
            </Box>
            <Box sx={{ flexGrow: 1 }} /> {/* Pushes button to the bottom */}
            <Button 
                fullWidth 
                variant="outlined" 
                sx={{ textTransform: "none", fontWeight: 600, mt: 2 }} 
                onClick={handleButtonClick}
            >
                {buttonText}
            </Button>
        </Box>
    );
};

// --- Helper Functions for Calendar ---
const getFormattedMonthYear = (date) => date.toLocaleString('default', { month: 'long', year: 'numeric' });
const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

const CalendarCard = ({ appointments }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const theme = useTheme();

    const getAppointmentStatus = (dateStr) => {
        const date = new Date(dateStr);
        if (isSameDay(date, today)) return 'today';
        return date > today ? 'upcoming' : 'past';
    };

    const appointmentMap = (appointments || []).reduce((acc, apt) => {
        const dateKey = new Date(apt.appointmentDate).getDate();
        acc[dateKey] = getAppointmentStatus(apt.appointmentDate);
        return acc;
    }, {});

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun, 1=Mon...

    const gridDays = Array.from({ length: firstDayOfWeek + daysInMonth }, (_, i) => {
        const dayNum = i - firstDayOfWeek + 1;
        return dayNum > 0 ? dayNum : null;
    });

    const getDayStyle = (day) => {
        const status = appointmentMap[day];
        if (!status) return {};
        const colors = {
            today: { bgcolor: 'transparent', color: 'black', border: '2px solid blue' },
            upcoming: { bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText },
            past: { bgcolor: theme.palette.success.main, color: theme.palette.success.contrastText },
        };
        return colors[status];
    };

    return (
        <>
            <CardHeader title={<Typography variant="h6">{getFormattedMonthYear(today)}</Typography>} />
            <CardContent>
                <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" textAlign="center" gap={1}>
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                        <Typography key={i} variant="body2" fontWeight={600} color="text.secondary">{day}</Typography>
                    ))}
                    {gridDays.map((day, index) => (
                        <Box key={index} display="flex" justifyContent="center" alignItems="center"
                            sx={{ width: 32, height: 32, borderRadius: '50%', mx: "auto", ...getDayStyle(day) }}
                        >
                            {day}
                        </Box>
                    ))}
                </Box>
                <Box mt={4} display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box width={12} height={12} borderRadius="50%" bgcolor={theme.palette.success.main} />
                        <Typography variant="body2">Completed</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box width={12} height={12} borderRadius="50%" bgcolor={theme.palette.primary.main} />
                        <Typography variant="body2">Upcoming</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box width={12} height={12} borderRadius="50%" bgcolor="transparent" border="2px solid blue" />
                        <Typography variant="body2">Today</Typography>
                    </Box>
                </Box>
            </CardContent>
        </>
    );
};

export default HomeOverview;
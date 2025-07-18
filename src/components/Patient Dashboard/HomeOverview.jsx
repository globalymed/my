import React from 'react';
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

// --- Key Change: Using icons exclusively from @mui/icons-material for consistency ---
import {
    AccessTime,
    Article,
    CalendarToday,
    CameraAlt,
    CheckCircle,
    CreditCard, // Replaces FaCcVisa
    Flight,     // Replaces FaPlane
    Hotel,      // Replaces FaHotel
    ListAlt,    // Replaces FaBell/AlertCircle for "Action Items"
    LocationOn,
    Medication, // Replaces FaPills
    MedicalServices, // Replaces FaStethoscope
    Phone,
    Schedule,   // Replaces FaClock
    Upload,
    Videocam
} from '@mui/icons-material';


const HomeOverview = ({ user, appointments }) => {
    const theme = useTheme();

    // Find the next upcoming appointment
    const upcomingAppointment = appointments?.find(apt =>
        new Date(apt.appointmentDate) > new Date()
    );

    // Placeholder for meeting link if it doesn't exist
    if (upcomingAppointment && !upcomingAppointment.meetingLink) {
        upcomingAppointment.meetingLink = "https://example.com/meeting-link";
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* Welcome Message */}
            <Box>
                <Typography variant="h4" fontWeight="bold">
                    Welcome back, {user?.firstName || user?.name || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    It’s a sunny day today, we hope you’re taking good care of your health 😊
                </Typography>
            </Box>

            {/* Main Grid Layout */}
            <Grid container spacing={3}>
                {/* Row 1: Upcoming Appointment & Treatment Progress */}
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
                                    <LinearProgress variant="determinate" value={25} sx={{ height: 8, borderRadius: 5, mt: 0.5 }} />
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


                {/* --- Key Change: Fixed the layout by making this Grid item a container for its children --- */}
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
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2">Blood Test Report</Typography>
                                    <Chip label="New" size="small" color="primary" />
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2">X-Ray Results</Typography>
                                    <Chip label="Reviewed" size="small" variant="outlined" />
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2">Insurance Form</Typography>
                                    <Chip label="Pending" size="small" color="warning" variant="outlined" />
                                </Box>
                                <Button variant="outlined" size="small" startIcon={<Upload />} sx={{ mt: 2, textTransform: 'none' }}>
                                    Upload New
                                </Button>
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

                {/* Calendar */}
                <Grid item xs={12} md={5}>
                    <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%' }}>
                        {/* --- Key Change: CalendarCard no longer renders its own Card shell --- */}
                        <CalendarCard appointments={appointments} />
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

const BookingCard = ({ icon, title, price, unit, tags, buttonText, color }) => {
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
            <Button fullWidth variant="outlined" sx={{ textTransform: "none", fontWeight: 600, mt: 2 }}>
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
            today: { bgcolor: theme.palette.info.main, color: theme.palette.info.contrastText },
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
                        <Box width={12} height={12} borderRadius="50%" bgcolor={theme.palette.info.main} />
                        <Typography variant="body2">Today</Typography>
                    </Box>
                </Box>
            </CardContent>
        </>
    );
};

export default HomeOverview;
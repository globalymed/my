import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Button,
    Avatar,
    Grid,
    LinearProgress,
    Chip,
    Divider,
    useTheme
} from '@mui/material';

import {
    FaCalendarAlt as Calendar,
    FaClock as Clock,
    FaMapMarkerAlt as MapPin,
    FaVideo as Video,
    FaStethoscope as Stethoscope,
    FaCheckCircle as CheckCircle,
    FaPlane as Plane,
    FaFileAlt as FileText,
    FaUpload as Upload,
    FaBell as AlertCircle,
    FaPills as Pill,
    FaCamera as Camera,
    FaPhone as Phone,
    FaPen,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaWhatsapp,
    FaUpload,
    FaPlane, FaHotel, FaCcVisa
} from 'react-icons/fa';
import { AccessTime, CalendarMonth, CalendarToday, Done, LocationOn, Videocam } from '@mui/icons-material';

const HomeOverview = ({ user, appointments }) => {

    // console.log("User data in HomeOverview:", user);
    // console.log("Appointments data in HomeOverview:", appointments);

    const upcomingAppointment = appointments?.find(apt =>
        new Date(apt.appointmentDate) > new Date()
    );

    // console.log("Upcoming appointment:", upcomingAppointment);
    if (upcomingAppointment && !upcomingAppointment.meetingLink) {
        upcomingAppointment.meetingLink = "https://example.com/meeting-link"; // Placeholder if no link exists
    }


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* Welcome Message */}
            <Box>
                <Typography variant="h4" fontWeight="bold">
                    Welcome back,  {user?.firstName || user?.name || 'User'}
                </Typography>
                <Typography variant="body2" color="#475367">
                    It’s a sunny day today, we hope you’re taking good care of your health 😊
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Upcoming Appointment */}
                <Grid item xs={12} md={7}>
                    <Card elevation={0}
                        sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            position: "relative",
                            p: 2,
                            border: "2px solid #E4E7EC",
                        }}
                    >
                        <CardHeader
                            title={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Calendar size={18} />
                                    <Typography variant="h6">Upcoming Appointment</Typography>
                                </Box>
                            }
                        />
                        <CardContent>
                            {upcomingAppointment ? (
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={8}>
                                        <Typography variant="h6">{upcomingAppointment.treatmentType || "Appointment"}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {upcomingAppointment.doctorName || "Doctor"}
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={1}>
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                {new Date(upcomingAppointment.appointmentDate).toLocaleDateString()} - {upcomingAppointment.appointmentTime || "TBD"}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" mt={1}>
                                            <LocationOn sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                {upcomingAppointment.hospitalName || "Hospital"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Videocam />}
                                            fullWidth
                                            sx={{
                                                mb: 1,
                                                backgroundColor: 'black',
                                                color: 'white',
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                borderColor: '#D1D5DB',
                                                '&:hover': {
                                                    borderColor: '#9CA3AF',
                                                    backgroundColor: '#333',
                                                    color: 'white',
                                                },
                                            }}
                                        >
                                            Join Call
                                        </Button>
                                        <Button variant="outlined" fullWidth
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                borderColor: '#D1D5DB',
                                                color: '#374151',
                                                borderRadius: 2,
                                                fontSize: 15,
                                                '&:hover': {
                                                    borderColor: '#9CA3AF',
                                                    backgroundColor: '#f0f0f0',
                                                },
                                            }}
                                        >
                                            Reschedule
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Typography variant="body1" textAlign="center" color="text.secondary">
                                    No upcoming appointments
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Treatment Summary */}
                <Grid item xs={12} md={5}>
                    <Card elevation={0}
                        sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            position: "relative",
                            p: 2,
                            border: "2px solid #E4E7EC",
                        }}
                    >
                        <CardHeader
                            title={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Stethoscope size={18} />
                                    <Typography variant="h6">Treatment Progress</Typography>
                                </Box>
                            }
                        />
                        <CardContent>
                            <Typography fontWeight={600}>Knee Replacement Surgery</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Apollo Hospital, Delhi
                            </Typography>

                            <Box mt={2}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2">Progress</Typography>
                                    <Typography variant="body2">Pre-Surgery</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={25} sx={{ height: 6, borderRadius: 5 }} />
                            </Box>

                            <Box mt={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CheckCircle size={14} color="green" />
                                    <Typography variant="caption">Initial Consultation</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CheckCircle size={14} color="green" />
                                    <Typography variant="caption">Medical Records Review</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Clock size={14} color="orange" />
                                    <Typography variant="caption">Pre-Surgery Tests</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Travel Snapshot */}
                <Grid item
                    xs={12}
                    md={7}
                >
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            position: "relative",
                            justifyContent: "space-between",
                            p: 2,
                            display: "flex",
                            gap: 2,
                            border: "2px solid #E4E7EC",
                        }}
                    >
                        <Box>
                            <BookingCard
                                icon={<FaCcVisa size={28} color="#1A237E" />}
                                title="Get Your Visa Instantly"
                                price="XXX"
                                unit="per person"
                                tags={[
                                    { label: "Normal", bg: "#CCF4F1" },
                                    { label: "Tourist Visa", bg: "#CCF4F1" },
                                ]}
                                buttonText="Get Visa"
                                color="#CCF4F1"
                            />
                        </Box>

                        <Box>
                            <BookingCard
                                icon={<FaPlane size={28} color="#039BE5" />}
                                title="Book Flight Easily"
                                price="200$"
                                unit="per person"
                                tags={[
                                    { label: "Business", bg: "#F9E9EC" },
                                    { label: "Economy", bg: "#F9E9EC" },
                                ]}
                                buttonText="Book Ticket"
                                color="#F9E9EC"
                            />
                        </Box>

                        <Box>
                            <BookingCard
                                icon={<FaHotel size={28} color="#3F51B5" />}
                                title="Hotel Rooms Booking"
                                price="150$"
                                unit="per night"
                                tags={[
                                    { label: "Normal", bg: "#DFEAFD" },
                                    { label: "Luxuary", bg: "#DFEAFD" },
                                ]}
                                buttonText="Book Room"
                                color="#DFEAFD"
                            />
                        </Box>
                    </Card>
                </Grid>

                {/* Calendar */}
                <Grid item xs={12} md={5}>
                    <Card elevation={0}
                        sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            position: "relative",
                            p: 2,
                            border: "2px solid #E4E7EC",
                        }}>
                        <CardHeader
                            title={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CalendarMonth size={18} />
                                    <Typography variant="h6">Calendar</Typography>
                                </Box>
                            }
                        />
                        <CardContent>
                            <CalendarCard appointments={appointments} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Documents */}
                <Grid item xs={12} md={4}>
                    <Card elevation={0}
                        sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            position: "relative",
                            p: 2,
                            border: "2px solid #E4E7EC",
                        }}>
                        <CardHeader
                            title={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <FileText size={18} />
                                    <Typography variant="h6">Recent Documents</Typography>
                                </Box>
                            }
                        />
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">Blood Test Report</Typography>
                                <Chip label="New" size="small" color="secondary" />
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">X-Ray Results</Typography>
                                <Chip label="Reviewed" size="small" variant="outlined" />
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">Insurance Form</Typography>
                                <Chip label="Pending" size="small" variant="outlined" />
                            </Box>
                            <Button
                                variant="outlined"
                                fullWidth
                                size="small"
                                startIcon={<Upload size={14} />}
                                sx={{ mt: 2 }}
                            >
                                Upload New
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Post-Care Alerts */}
                <Grid item xs={12} md={3}>
                    <Card elevation={0}
                        sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            position: "relative",
                            p: 2,
                            border: "2px solid #E4E7EC",
                        }}>
                        <CardHeader
                            title={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <AlertCircle size={18} />
                                    <Typography variant="h6">Action Items</Typography>
                                </Box>
                            }
                        />
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Pill size={14} color="blue" />
                                <Typography variant="body2">Take morning medication</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Camera size={14} color="green" />
                                <Typography variant="body2">Upload pre-surgery photos</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Phone size={14} color="orange" />
                                <Typography variant="body2">Confirm transport pickup</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

const BookingCard = ({ icon, title, price, unit, tags, buttonText, color }) => {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: "1px solid #E4E7EC",
                width: 250,
                px: 3,
                textAlign: "left",
            }}
        >
            <CardContent sx={{ p: 0, mb: 0, pt: 3, }}>
                {/* Icon */}
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        backgroundColor: color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                    }}
                >
                    {icon}
                </Box>

                {/* Title */}
                <Typography fontWeight="600" fontSize={17} mb={1}>
                    {title}
                </Typography>

                {/* Price */}
                <Typography variant="h5" fontWeight="bold" sx={{ display: "inline" }}>
                    {price}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ display: "inline", color: "#6B7280", ml: 1 }}
                >
                    {unit}
                </Typography>

                {/* Tags */}
                <Box display="flex" gap={1} mt={2} mb={3} flexWrap="wrap">
                    {tags.map((tag, idx) => (
                        <Chip
                            key={idx}
                            label={tag.label}
                            sx={{
                                backgroundColor: tag.bg,
                                color: "black",
                                fontWeight: 500,
                            }}
                        />
                    ))}
                </Box>

                {/* Button */}
                <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#D1D5DB",
                        color: "#374151",
                        borderRadius: 6,
                        fontSize: 15,
                        "&:hover": {
                            borderColor: "#9CA3AF",
                            backgroundColor: "#F9FAFB",
                        },
                    }}
                >
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    );
};

const getFormattedMonthYear = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const isSameDay = (d1, d2) => {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};

const CalendarCard = ({ appointments }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const getAppointmentStatus = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        if (isSameDay(date, now)) return 'today';
        return date > now ? 'upcoming' : 'past';
    };

    const appointmentMap = {};
    (appointments || []).forEach((apt) => {
        const dateKey = new Date(apt.appointmentDate).getDate();
        appointmentMap[dateKey] = getAppointmentStatus(apt.appointmentDate);
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const totalSlots = firstDayOfMonth + daysInMonth;
    const weeks = Math.ceil(totalSlots / 7);
    const gridDays = Array(weeks * 7).fill(null).map((_, i) => {
        const dayNum = i - firstDayOfMonth + 1;
        return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
    });

    const getBgColor = (status) => {
        if (status === 'today') return '#0288d1';
        if (status === 'upcoming') return '#1976d2';
        if (status === 'past') return '#2e7d32';
        return 'transparent';
    };

    return (
        <Card elevation={0}
            sx={{
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                p: 2,
                border: "2px solid #E4E7EC",
            }}>
            <CardHeader title={<Typography variant="h6">{getFormattedMonthYear(today)}</Typography>} />
            <CardContent>
                <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" textAlign="center" gap={1}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <Typography key={day} fontWeight={600}>{day}</Typography>
                    ))}
                    {gridDays.map((day, index) => {
                        const status = appointmentMap[day];
                        const bgColor = getBgColor(status);
                        const textColor = bgColor !== 'transparent' ? 'white' : 'inherit';
                        return (
                            <Box
                                key={index}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                width={32}
                                height={32}
                                borderRadius="50%"
                                bgcolor={bgColor}
                                color={textColor}
                                mx="auto"
                            >
                                {day || ''}
                            </Box>
                        );
                    })}
                </Box>

                <Box mt={4} display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box width={12} height={12} borderRadius="50%" bgcolor="#2e7d32" />
                        <Typography variant="body2">Completed Appointments</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box width={12} height={12} borderRadius="50%" bgcolor="#1976d2" />
                        <Typography variant="body2">Upcoming Appointments</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box width={12} height={12} borderRadius="50%" bgcolor="#0288d1" />
                        <Typography variant="body2">Today</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};


export default HomeOverview;

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
import { AccessTime, CalendarMonth, Done, LocationOn } from '@mui/icons-material';

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
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            position: "relative",
                            p: 2,
                            border: "2px solid #E4E7EC",
                        }}
                    >

                        {/* Header */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight="600">
                                Upcoming Appointment
                            </Typography>
                            <Typography variant="body2" color="error" sx={{ cursor: "pointer" }}>
                                View All
                            </Typography>
                        </Box>

                        {/* Main Content */}
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            p={2}
                            borderRadius={3}
                            gap={2}
                            sx={{ backgroundColor: "#35A49C", color: "white", position: "relative" }}
                        >
                            {/* Left: Doctor Info */}
                            <Box flex='1' display="flex" flexDirection='column' alignItems="center" gap={2}>
                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                    <Avatar
                                        src="https://randomuser.me/api/portraits/women/44.jpg"
                                        sx={{ width: 120, height: 120 }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            bgcolor: '#00f',
                                            color: 'white',
                                            borderRadius: '50%',
                                            p: '2px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Done
                                            fontSize="small"
                                            sx={{
                                                color: '#fff',
                                                fontSize: 14,
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Dr. Alison Ogaga
                                    </Typography>
                                    <Typography variant="body2">General Practitioner</Typography>
                                </Box>
                            </Box>

                            {/* Right: Date, Time, Location, Buttons */}
                            <Box
                                flex={2}
                            >
                                <Box sx={{
                                    backgroundColor: "#EDFAF1",
                                    borderRadius: 2,
                                    p: 2,
                                    color: "#35A49C",
                                    minWidth: 260,
                                }} >
                                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <CalendarMonth fontSize="small" color='667185' />
                                            <Typography variant="body2">October 28th, 2023</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <AccessTime fontSize="small" color='667185' />
                                            <Typography variant="body2">11:30 - 12:00 (30min)</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LocationOn fontSize="small" color='667185' />
                                        <Typography variant="body2">
                                            Medicare Hospital, 18 Iwaya Rd, Lagos
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* line */}

                                <Divider sx={{ my: 2, backgroundColor: "#ccc" }} />

                                {/* Action Buttons */}
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    gap={2}
                                    mt={3}
                                    alignItems="center"
                                    flexWrap="wrap"
                                >
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            backgroundColor: '#FFFFFF',
                                            color: '#344054',
                                            textTransform: 'none',
                                            borderRadius: 6,
                                            px: 3,
                                            borderColor: '#D0D5DD',
                                            '&:hover': {
                                                backgroundColor: '#f0f0f0',
                                                borderColor: '#1D4645',
                                            },
                                        }}
                                    >
                                        Reschedule
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            borderRadius: 6,
                                            px: 3,
                                            backgroundColor: "#FFFFFF",
                                            textTransform: "none",
                                            color: "black",
                                            fontWeight: 600,
                                            '&:hover': {
                                                backgroundColor: '#f0f0f0',
                                                borderColor: '#1D4645',
                                            },
                                        }}
                                        startIcon={
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                                width={20}
                                                alt="whatsapp"
                                            />
                                        }
                                    >
                                        Confirm appointment
                                    </Button>
                                </Box>
                            </Box>

                            {/* Bell Icon */}
                            <Box sx={{ position: "absolute", top: -10, right: -10 }}>
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
                                    alt="bell"
                                    width={40}
                                    style={{ transform: "rotate(10deg)" }}
                                />
                            </Box>
                        </Box>



                        {/* Pagination Dots */}
                        <Box display="flex" justifyContent="center" mt={2} gap={1}>
                            <Box
                                sx={{
                                    width: 20,
                                    height: 10,
                                    borderRadius: 2,
                                    backgroundColor: '#47B462',
                                }}
                            />
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: '#BBB9B9',
                                }}
                            />
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: '#BBB9B9',
                                }}
                            />
                        </Box>
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
                            backgroundColor: "#FFFFFF",
                            border: "2px solid #E4E7EC",
                        }}>
                        <CardContent>
                            {/* Top section */}
                            <Box display="flex" alignItems="center" justifyContent='space-between' gap={2}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar
                                        src="https://randomuser.me/api/portraits/men/75.jpg"
                                        sx={{ width: 64, height: 64 }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            My Profile
                                        </Typography>
                                        <Typography color="text.secondary">Jack Smith</Typography>
                                    </Box>
                                </Box>

                                {/* Uplaod your document button */}
                                <Button
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 6,
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none',
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: '#344054',
                                        borderColor: '#D0D5DD',
                                        backgroundColor: '#1D4645',
                                        color: '#FFFFFF',
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0',
                                            borderColor: '#1D4645',
                                        },
                                    }}
                                    startIcon={<FaUpload size={12} />}
                                >
                                    Upload your document
                                </Button>

                            </Box>

                            {/* Status and Edit */}
                            <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#D0FBFF',
                                        color: 'black',
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: 13,
                                        boxShadow: 'none',
                                        '&:hover': { backgroundColor: '#b6e7e3' },
                                    }}
                                >
                                    IN PROGRESS
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: 13,
                                        fontWeight: 500,
                                        backgroundColor: '#CDD2DA',
                                        color: 'black',

                                    }}
                                    startIcon={<FaPen size={12} color='#667185' />}
                                >
                                    Edit
                                </Button>
                            </Box>

                            {/* Info Section */}
                            <Box
                                mt={3}
                                p={2}
                                borderRadius={2}
                                sx={{ backgroundColor: '#EEFAF9' }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography fontWeight={600} color="#FD6E5E" fontSize={14}>
                                            Appointment Date
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1} mt={1} color='#22472B'>
                                            <FaCalendarAlt size={14} color='#667185' />
                                            <Typography fontSize={14}>October 28th, 2023</Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography fontWeight={600} color="#FD6E5E" fontSize={14}>
                                            ANC Day
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1} mt={1} color='#22472B'>
                                            <FaCalendarAlt size={14} color='#667185' />
                                            <Typography fontSize={14}>Tuesday</Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center" gap={1} mt={1} color='#22472B'>
                                            <FaMapMarkerAlt size={14} color='#667185' />
                                            <Typography fontSize={14}>
                                                Medicare Hospital, 18 Iwaya Rd, Lagos
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Divider */}
                            <Divider sx={{ my: 3 }} />

                            {/* Reminder Button */}
                            <Button
                                variant="contained"
                                sx={{
                                    borderRadius: 6,
                                    px: 3,
                                    backgroundColor: "#FFFFFF",
                                    textTransform: "none",
                                    color: "black",
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                        borderColor: '#1D4645',
                                    },
                                }}
                                startIcon={
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                        width={20}
                                        alt="whatsapp"
                                    />
                                }
                            >
                                Send Reminder
                            </Button>
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
                            p: 2,
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

                {/* Recent Documents */}
                <Grid item xs={12} md={4}>
                    <Card>
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
                <Grid item xs={12} md={4}>
                    <Card>
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
                p: 3,
                textAlign: "left",
            }}
        >
            <CardContent sx={{ p: 0 }}>
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
                        height: 40,
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


export default HomeOverview;

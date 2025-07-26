import React, { useState } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Card,
    CardHeader,
    CardContent,
    Chip,
    Grid,
    Button,
    Divider,
    styled
} from '@mui/material';
import {
    FaClock as Clock,
    FaMapMarkerAlt as MapPin,
    FaVideo as Video,
    FaBell as AlertCircle,
    FaCheckCircle as CheckCircle2,
    FaDownload as Download,
} from 'react-icons/fa';
import {
    AccessTime, LocationOn, Videocam, Person,
    LocalHospital,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-flexContainer': {
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        padding: '4px',
    },
    '& .MuiTab-root': {
        textTransform: 'none',
        minHeight: '48px',
        fontSize: '16px',
        fontWeight: 500,
        color: '#666',
        borderRadius: '8px',
        margin: '0 2px',
        '&.Mui-selected': {
            backgroundColor: '#ffffff',
            color: '#333',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }
    },
    '& .MuiTabs-indicator': {
        display: 'none'
    }
}));


function AppointmentsSection({ appointments }) {
    const [tab, setTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const upcomingAppointments = (appointments?.filter(apt =>
        new Date(apt.appointmentDate) > new Date()
    )?.sort((a, b) =>
        new Date(a.appointmentDate) - new Date(b.appointmentDate)
    )) || [];


    const pastAppointments = (appointments?.filter(apt =>
        new Date(apt.appointmentDate) <= new Date()
    )?.sort((a, b) =>
        new Date(b.appointmentDate) - new Date(a.appointmentDate)
    )) || [];


    console.log('Upcoming Appointments:', upcomingAppointments);
    console.log('Past Appointments:', pastAppointments);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
                <Typography variant="h4" fontWeight="bold">
                    Appointments
                </Typography>
                <Typography color="text.secondary">Manage your medical consultations</Typography>
            </Box>

            <StyledTabs
                value={tab}
                onChange={handleTabChange}
                sx={{
                    width: 'fit-content',
                }}
            >
                <Tab
                    label="Upcoming"
                    iconPosition="start"
                    sx={{ gap: 1 }}
                />
                <Tab
                    label="Past"
                    iconPosition="start"
                    sx={{ gap: 1 }}
                />
                <Tab
                    label="Calendar View"
                    iconPosition="start"
                    sx={{ gap: 1 }}
                />
            </StyledTabs>


            {tab === 0 && (
                <Box>
                    {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((appointment, index) => (
                            <Card elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    overflow: "hidden",
                                    position: "relative",
                                    p: 2,
                                    border: "2px solid #E4E7EC",
                                    mb: 2,
                                }} key={index}>
                                <CardHeader
                                    sx={{ fontWeight: 600 }}
                                    title={appointment.treatmentType || "Appointment"}
                                    subheader={appointment.doctorName || "Doctor"}
                                    action={<Chip label="Upcoming" sx={{ backgroundColor: 'black', color: 'white' }} />}
                                    titleTypographyProps={{
                                        fontSize: "2rem",  // adjust size as needed (e.g. 24px = 1.5rem)
                                        fontWeight: 700      // bold
                                    }}
                                />

                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={8}>
                                            <Box display="flex" alignItems="center" mt={1}>
                                                <AccessTime sx={{ mr: 1 }} />
                                                <Typography variant="body2">
                                                    {new Date(appointment.appointmentDate).toLocaleDateString()} - {appointment.appointmentTime || "TBD"}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" mt={1}>
                                                <LocationOn sx={{ mr: 1 }} />
                                                <Typography variant="body2">
                                                    {appointment.hospitalName || "Hospital"}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'row', gap: 1, mt: { xs: 2, md: 0 },
                                            alignItems: 'center', justifyContent: { xs: 'space-between', md: 'flex-end' }
                                        }} item xs={12} md={4}>
                                            <Button
                                                startIcon={<Videocam />}
                                                sx={{ backgroundColor: 'black', px: 5, py: 1, color: 'white', '&:hover': { backgroundColor: '#333' } }}
                                            >
                                                Join Call
                                            </Button>
                                            <Button variant="outlined" sx={{ px: 5, py: 1, color: 'black', backgroundColor: 'white' }}>
                                                Reschedule
                                            </Button>
                                        </Box>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card elevation={0}
                            sx={{
                                borderRadius: 4,
                                overflow: "hidden",
                                position: "relative",
                                p: 2,
                                border: "2px solid #E4E7EC",
                            }}>
                            <CardContent>
                                <Typography variant="body1" textAlign="center" color="text.secondary">
                                    No upcoming appointments
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Box>
            )}

            {/* Past Appointments */}
            {tab === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {
                        pastAppointments.length > 0 ? (
                            pastAppointments.map((appointment, index) => (
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
                                            <Box display="flex" justifyContent="space-between">
                                                <Box>
                                                    <Typography sx={{
                                                        textTransform: 'capitalize',
                                                    }} fontWeight={600}>
                                                        {appointment.treatmentType || "Appointment"} - {appointment.type || "General Checkup"}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {
                                                            appointment.doctorName || "Doctor name not available"
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Chip sx={{
                                                    color: 'black',
                                                    backgroundColor: '#e0f7fa',
                                                    borderColor: '#006064',
                                                    borderWidth: 1,
                                                    fontWeight: 600,
                                                    borderStyle: 'solid',
                                                    '&:hover': {
                                                        backgroundColor: '#b2ebf2',
                                                        borderColor: '#004d40'
                                                    }
                                                }} label={
                                                    appointment.status
                                                } variant="outlined" />
                                            </Box>
                                        }
                                    />
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Box display="flex" flexDirection="column" gap={1}>
                                                    <Box display="flex" gap={1} alignItems="center">
                                                        <Clock size={16} />
                                                        <Typography variant="body2">
                                                            {new Date(appointment.appointmentDate).toLocaleDateString()} - {appointment.appointmentTime || "TBD"}
                                                        </Typography>
                                                    </Box>
                                                    <Box display="flex" gap={1} alignItems="center">
                                                        <CheckCircle2 size={16} color="green" />
                                                        <Typography variant="body2">Surgery approved and scheduled</Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={6} display="flex" gap={2}>
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        color: 'black',
                                                        borderColor: '#333',
                                                        '&:hover': {
                                                            backgroundColor: '#f0f0f0',
                                                            borderColor: '#555'
                                                        }
                                                    }}
                                                    fullWidth>View Summary</Button>
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        color: 'black',
                                                        borderColor: '#333',
                                                        '&:hover': {
                                                            backgroundColor: '#f0f0f0',
                                                            borderColor: '#555'
                                                        }
                                                    }}
                                                    fullWidth startIcon={<Download size={16} />}>Prescription</Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))
                        ) :
                            (
                                <Card elevation={0}
                                    sx={{
                                        borderRadius: 4,
                                        overflow: "hidden",
                                        position: "relative",
                                        p: 2,
                                        border: "2px solid #E4E7EC",
                                    }}>
                                    <CardContent>
                                        <Typography variant="body1" textAlign="center" color="text.secondary">
                                            No past appointments
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )
                    }
                </Box>
            )}

            {tab === 2 && (
                <CalendarSection
                    upcomingAppointments={upcomingAppointments}
                    pastAppointments={pastAppointments}
                />
            )}

        </Box>
    );
}

// Utility to get total days in month
const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

export const CalendarSection = ({ upcomingAppointments = [], pastAppointments = [] }) => {
    const today = new Date(); // e.g., July 26, 2025
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed (e.g., 6 for July)

    // --- KEY CHANGES START HERE ---

    // 1. Calculate the first day of the week for the current month (0=Sun, 1=Mon, ...)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);

    // Function to format a day into "YYYY-MM-DD"
    const formatDate = (day) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    // 2. Simplified status function
    const getStatusForDay = (day) => {
        const dateStr = formatDate(day);
        const isUpcoming = upcomingAppointments.some((apt) => apt.appointmentDate === dateStr);
        if (isUpcoming) return 'upcoming';

        const isPast = pastAppointments.some((apt) => apt.appointmentDate === dateStr);
        if (isPast) return 'past';

        return null; // No appointment on this day
    };

    // 3. Simplified color styling
    const getColorStyles = (status) => {
        switch (status) {
            case 'past':
                return { bg: '#6ee7b7', color: '#022c22' }; // Much darker green
            case 'upcoming':
                return { bg: '#93c5fd', color: '#172554' }; // Much darker blue
            default:
                return { bg: 'transparent', color: 'inherit' };
        }
    };

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: '1px solid #E4E7EC' }}>
            <CardHeader
                title={
                    <Typography variant="h6" fontWeight={600}>
                        {today.toLocaleString('default', { month: 'long' })} {year}
                    </Typography>
                }
            />
            <CardContent>
                <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" textAlign="center" gap={1}>
                    {/* Render weekday headers */}
                    {weekdays.map((day) => (
                        <Typography key={day} fontWeight={500} color="text.secondary">
                            {day}
                        </Typography>
                    ))}

                    {/* 4. Render empty boxes for alignment */}
                    {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                        <Box key={`empty-${index}`} />
                    ))}

                    {/* Render actual days of the month */}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const status = getStatusForDay(day);
                        const { bg, color } = getColorStyles(status);
                        const isToday = day === today.getDate();

                        return (
                            <Box
                                key={day}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                width={36}
                                height={36}
                                borderRadius="50%"
                                bgcolor={status ? bg : 'transparent'}
                                color={status ? color : 'inherit'}
                                fontWeight={status || isToday ? 'bold' : 'normal'}
                                // Add a border for today's date
                                border={isToday ? '2px solid #3b82f6' : 'none'}
                                mx="auto"
                            >
                                {day}
                            </Box>
                        );
                    })}
                </Box>

                {/* Legend */}
                <Box mt={4} display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box width={12} height={12} borderRadius="50%" sx={{ backgroundColor: '#93c5fd' }} />
                        <Typography variant="body2">Upcoming Appointment</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box width={12} height={12} borderRadius="50%" sx={{ backgroundColor: '#6ee7b7' }} />
                        <Typography variant="body2">Past Appointment</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box
                            width={12}
                            height={12}
                            borderRadius="50%"
                            sx={{
                                backgroundColor: 'transparent',
                                border: '2px solid #3b82f6', 
                            }}
                        />
                        <Typography variant="body2">Today</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};


export default AppointmentsSection;

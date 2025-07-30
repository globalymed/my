import React, { useState, useMemo } from 'react';
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

export const AppointmentCard = ({ appointment }) => {
    // This correctly determines if the appointment is in the future or past
    const isUpcoming = new Date(appointment.appointmentDate) >= new Date();

    return (
        <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", mb: 2 }}>
            <CardHeader
                title={appointment.treatmentType || "Appointment"}
                subheader={appointment.doctorName || "Doctor TBD"}
                action={
                    <Chip
                        label={isUpcoming ? "Upcoming" : "Completed"}
                        sx={{
                            backgroundColor: isUpcoming ? 'black' : '#6ee7b7',
                            color: isUpcoming ? 'white' : '#022c22'
                        }}
                    />
                }
                titleTypographyProps={{ fontSize: "1.5rem", fontWeight: 700 }}
            />
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <Box display="flex" alignItems="center" mt={1}>
                            <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                                {new Date(appointment.appointmentDate).toDateString()} at {appointment.appointmentTime || "Time TBD"}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mt={1}>
                            <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                                {appointment.clinicName || "Clinic TBD"}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* --- THIS IS THE UPDATED SECTION --- */}
                    <Grid item xs={12} md={5}>
                        {isUpcoming ? (
                            // Buttons for UPCOMING appointments
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, mt: { xs: 2, md: 0 }, justifyContent: 'flex-end' }}>
                                <Button startIcon={<Videocam />} sx={{ backgroundColor: 'black', px: 3, py: 1, color: 'white', '&:hover': { backgroundColor: '#333' } }}>
                                    Join Call
                                </Button>
                                <Button variant="outlined" sx={{ px: 3, py: 1, color: 'black', borderColor: 'grey.400' }}>
                                    Reschedule
                                </Button>
                            </Box>
                        ) : (
                            // Buttons for PAST appointments
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, mt: { xs: 2, md: 0 }, justifyContent: 'flex-end' }}>
                                <Button variant="outlined" sx={{ px: 3, py: 1, color: 'black', borderColor: 'grey.400' }}>
                                    View Summary
                                </Button>
                                <Button variant="outlined" startIcon={<Download />} sx={{ px: 3, py: 1, color: 'black', borderColor: 'grey.400' }}>
                                    Prescription
                                </Button>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pl: 0 }}>
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
                            <AppointmentCard key={appointment.id} appointment={appointment} />
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
                                <AppointmentCard key={appointment.id} appointment={appointment} />
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

    const [selectedDate, setSelectedDate] = useState(null);

    // 1. Calculate the first day of the week for the current month (0=Sun, 1=Mon, ...)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);

    const appointmentsForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        const allAppointments = [...upcomingAppointments, ...pastAppointments];
        return allAppointments.filter(apt => apt.appointmentDate === selectedDate);
    }, [selectedDate, upcomingAppointments, pastAppointments]);

    const handleDateClick = (day) => {
        const status = getStatusForDay(day);
        if (status) { // Only set date if there's an appointment
            setSelectedDate(formatDate(day));
        }
    };

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
        <>
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
                                    onClick={() => handleDateClick(day)}
                                    sx={{
                                        // Display and alignment
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',

                                        // Sizing and shape
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        mx: 'auto',

                                        // Conditional styling
                                        bgcolor: status ? bg : 'transparent',
                                        color: status ? color : 'inherit',
                                        fontWeight: status || isToday ? 'bold' : 'normal',
                                        border: isToday ? '2px solid #3b82f6' : 'none',

                                        // Interactivity styles
                                        cursor: status ? 'pointer' : 'default',
                                        transition: 'transform 0.1s ease-in-out',
                                        '&:hover': {
                                            transform: status ? 'scale(1.1)' : 'none',
                                        },
                                    }}
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
            </Card >

            <Box mt={4}>
                {appointmentsForSelectedDate.length > 0 && (
                    <Box>
                        <Typography variant="h5" fontWeight={600} mb={2}>
                            Appointments for {new Date(selectedDate).toDateString()}
                        </Typography>
                        {appointmentsForSelectedDate.map((apt) => (
                            <AppointmentCard key={apt.id} appointment={apt} />
                        ))}
                    </Box>
                )}
            </Box>
        </>
    );
};


export default AppointmentsSection;

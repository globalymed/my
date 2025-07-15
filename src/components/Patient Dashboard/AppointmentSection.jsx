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


            {tab === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                                        <Typography fontWeight={600}>Initial Consultation</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Dr. Rajesh Kumar - Orthopedic Surgeon
                                        </Typography>
                                    </Box>
                                    <Chip  sx={{
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
                                    }} label="Completed" variant="outlined" />
                                </Box>
                            }
                        />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Box display="flex" flexDirection="column" gap={1}>
                                        <Box display="flex" gap={1} alignItems="center">
                                            <Clock size={16} />
                                            <Typography variant="body2">Dec 1, 2024 - 3:00 PM IST</Typography>
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
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed (0 = Jan, 6 = July)

    const daysInMonth = getDaysInMonth(year, month);

    // Get ISO date string like "2025-07-14"
    const formatDate = (day) =>
        `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const getStatusForDay = (day) => {
        console.log('Checking status for day:', day);
        const dateStr = formatDate(day);

        const isSurgeryDay = upcomingAppointments.some(
            (apt) =>
                apt.appointmentDate === dateStr &&
                apt.title?.toLowerCase().includes('surgery')
        );

        if (isSurgeryDay) return 'surgery';

        const isUpcoming = upcomingAppointments.some((apt) => apt.appointmentDate === dateStr);
        if (isUpcoming) return 'upcoming';

        const isPast = pastAppointments.some((apt) => apt.appointmentDate === dateStr);
        if (isPast) return 'past';

        return null;
    };

    const getColorStyles = (status) => {
        switch (status) {
            case 'past':
                return { bg: 'green.100', color: 'green.800' };
            case 'upcoming':
                return { bg: 'blue.100', color: 'blue.800' };
            case 'surgery':
                return { bg: 'red.100', color: 'red.800' };
            default:
                return { bg: 'transparent', color: 'inherit' };
        }
    };

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <Card elevation={0}
            sx={{
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                p: 2,
                border: "2px solid #E4E7EC",
            }}>
            <CardHeader title={<Typography variant="h6">
                {today.toLocaleString('default', { month: 'long' })} {year}
            </Typography>} />
            <CardContent>
                <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" textAlign="center" gap={1}>
                    {weekdays.map((day) => (
                        <Typography key={day} fontWeight={600}>
                            {day}
                        </Typography>
                    ))}

                    {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const status = getStatusForDay(day);
                        const { bg, color } = getColorStyles(status);

                        return (
                            <Box
                                key={i}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                width={32}
                                height={32}
                                borderRadius="50%"
                                bgcolor={bg}
                                color={color}
                                mx="auto"
                            >
                                {day}
                            </Box>
                        );
                    })}
                </Box>

                <Box mt={4} display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box width={12} height={12} borderRadius="50%" bgcolor="green" />
                        <Typography variant="body2">Completed Appointments</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box width={12} height={12} borderRadius="50%" bgcolor="blue" />
                        <Typography variant="body2">Upcoming Appointments</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box width={12} height={12} borderRadius="50%" bgcolor="red" />
                        <Typography variant="body2">Surgery Day</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};


export default AppointmentsSection;


// function AppointmentsSection({ appointments }) {
//   const [tabIndex, setTabIndex] = React.useState(0)

//   const handleTabChange = (event, newValue) => {
//     setTabIndex(newValue)
//   }

//   const upcomingAppointments = appointments?.filter(apt =>
//     new Date(apt.appointmentDate) > new Date()
//   ) || [];

//   const pastAppointments = appointments?.filter(apt =>
//     new Date(apt.appointmentDate) <= new Date()
//   ) || [];

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Appointments
//       </Typography>
//       <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//         Manage your medical consultations
//       </Typography>
//       <Tabs value={tabIndex} onChange={handleTabChange} aria-label="appointments tabs">
//         <Tab label="Upcoming" />
//         <Tab label="Past" />
//         <Tab label="Calendar View" />
//       </Tabs>
//       <Box mt={3}>
//         {tabIndex === 0 && (
//           <Box>
//             {upcomingAppointments.length > 0 ? (
//               upcomingAppointments.map((appointment, index) => (
//                 <Card key={index} sx={{ mb: 2 }}>
//                   <CardHeader
//                     title={appointment.treatmentType || "Appointment"}
//                     subheader={appointment.doctorName || "Doctor"}
//                     action={<Chip label="Upcoming" color="primary" />}
//                   />
//                   <CardContent>
//                     <Grid container spacing={2} alignItems="center">
//                       <Grid item xs={12} md={8}>
//                         <Box display="flex" alignItems="center" mt={1}>
//                           <AccessTime sx={{ mr: 1 }} />
//                           <Typography variant="body2">
//                             {new Date(appointment.appointmentDate).toLocaleDateString()} - {appointment.appointmentTime || "TBD"}
//                           </Typography>
//                         </Box>
//                         <Box display="flex" alignItems="center" mt={1}>
//                           <LocationOn sx={{ mr: 1 }} />
//                           <Typography variant="body2">
//                             {appointment.hospitalName || "Hospital"}
//                           </Typography>
//                         </Box>
//                       </Grid>
//                       <Grid item xs={12} md={4}>
//                         <Button
//                           variant="contained"
//                           startIcon={<Videocam />}
//                           fullWidth
//                           sx={{ mb: 1 }}
//                         >
//                           Join Call
//                         </Button>
//                         <Button variant="outlined" fullWidth>
//                           Reschedule
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               <Card>
//                 <CardContent>
//                   <Typography variant="body1" textAlign="center" color="text.secondary">
//                     No upcoming appointments
//                   </Typography>
//                 </CardContent>
//               </Card>
//             )}
//           </Box>
//         )}
//         {tabIndex === 1 && (
//           <Box>
//             {pastAppointments.length > 0 ? (
//               pastAppointments.map((appointment, index) => (
//                 <Card key={index} sx={{ mb: 2 }}>
//                   <CardHeader
//                     title={appointment.treatmentType || "Appointment"}
//                     subheader={appointment.doctorName || "Doctor"}
//                     action={<Chip label="Completed" color="success" />}
//                   />
//                   <CardContent>
//                     <Grid container spacing={2} alignItems="center">
//                       <Grid item xs={12} md={8}>
//                         <Box display="flex" alignItems="center" mt={1}>
//                           <AccessTime sx={{ mr: 1 }} />
//                           <Typography variant="body2">
//                             {new Date(appointment.appointmentDate).toLocaleDateString()} - {appointment.appointmentTime || "TBD"}
//                           </Typography>
//                         </Box>
//                         <Box display="flex" alignItems="center" mt={1}>
//                           <LocationOn sx={{ mr: 1 }} />
//                           <Typography variant="body2">
//                             {appointment.hospitalName || "Hospital"}
//                           </Typography>
//                         </Box>
//                       </Grid>
//                       <Grid item xs={12} md={4}>
//                         <Button variant="outlined" fullWidth>
//                           View Details
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               <Card>
//                 <CardContent>
//                   <Typography variant="body1" textAlign="center" color="text.secondary">
//                     No past appointments
//                   </Typography>
//                 </CardContent>
//               </Card>
//             )}
//           </Box>
//         )}
//       </Box>
//     </Box>
//   )
// }
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled
} from '@mui/material';
import {
  Add as Plus,
  Search as SearchIcon,
  FilterList as Filter,
  MoreHoriz as MoreHorizontal,
  Phone as PhoneIcon,
  Videocam as VideoIcon,
  Message as MessageSquare,
  CalendarToday as Calendar,
  AccessTime as Clock,
  CheckCircleOutline as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

import { db, getAppointments, classifyAppointments, getAppointmentsByDoctorId } from '../../../firebase.js';
import { collection, getDocs } from "firebase/firestore";

// Custom hook for managing dropdown menus
const useMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return { anchorEl, open, handleClick, handleClose };
};

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


// A single Appointment Card Component
const AppointmentCard = ({ appointment }) => {
  const appointmentMenu = useMenu();

  const getStatusChipProps = (status) => {
    switch (status) {
      case "confirmed":
        return { label: "Confirmed", sx: { backgroundColor: '#D1FAE5', color: '#065F46' } };
      case "pending":
        return { label: "Pending", sx: { backgroundColor: '#FEF3C7', color: '#92400E' } };
      case "urgent":
        return { label: "Urgent", sx: { backgroundColor: '#FEE2E2', color: '#991B1B' } };
      case "completed":
        return { label: "Completed", sx: { backgroundColor: '#E0E7FF', color: '#3730A3' } };
      default:
        return { label: status || "Unknown", sx: { backgroundColor: '#F3F4F6', color: '#374151' } };
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, '&:hover': { bgcolor: '#F9FAFB' } }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        p={2}
        spacing={2}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1}>
          <Avatar
            alt={appointment.patientName}
            sx={{ width: 56, height: 56 }}
          >
            {appointment.patientName?.split(" ").map((n) => n[0]).join("")}
          </Avatar>
          <Box>
            <Typography fontWeight="medium">{appointment.patientName}</Typography>
            <Typography variant="body2" color="text.secondary">{appointment.reason || 'No reason provided'}</Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Chip label={appointment.type || 'Consultation'} size="small" variant="outlined" />
              <Chip {...getStatusChipProps(appointment.status)} size="small" />
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={{ xs: 2, md: 3 }}>
          <Box textAlign={{ xs: 'left', md: 'right' }}>
            <Typography fontWeight="medium">{appointment.appointmentTime}</Typography>
            <Typography variant="body2" color="text.secondary">
              {appointment.appointmentDate instanceof Date ? appointment.appointmentDate.toLocaleDateString() : 'Invalid Date'}
            </Typography>
            <Typography variant="caption" color="text.secondary">{appointment.duration} min</Typography>
          </Box>
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small"><PhoneIcon fontSize="small" /></IconButton>
            <IconButton size="small"><VideoIcon fontSize="small" /></IconButton>
            <IconButton size="small"><MessageSquare fontSize="small" /></IconButton>
            <IconButton size="small" onClick={appointmentMenu.handleClick}><MoreHorizontal fontSize="small" /></IconButton>
            <Menu
              anchorEl={appointmentMenu.anchorEl}
              open={appointmentMenu.open}
              onClose={appointmentMenu.handleClose}
            >
              <MenuItem onClick={appointmentMenu.handleClose}>Edit</MenuItem>
              <MenuItem onClick={appointmentMenu.handleClose}>Reschedule</MenuItem>
              <MenuItem onClick={appointmentMenu.handleClose} sx={{ color: 'error.main' }}>Cancel</MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};



// Main App Component
const DoctorAppointmentSection = ({doctor}) => {
  console.log("DoctorAppointmentSection rendered with doctor:", doctor);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [allAppointments, setAllAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchAndClassifyAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAppointmentsByDoctorId(doctor.id);
        // console.log(data);
        setAllAppointments(data); // Keep the full list

        // Use the new function to categorize
        const {
          todayAppointments,
          upcomingAppointments,
          pastAppointments
        } = classifyAppointments(data);
        // console.log("Upcoming Appointments:", upcomingAppointments);

        // Set the state for each category
        setTodayAppointments(todayAppointments);
        setUpcomingAppointments(upcomingAppointments);
        setPastAppointments(pastAppointments);

      } catch (err) {
        setError("Failed to load appointments.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndClassifyAppointments();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusChipProps = (status) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Confirmed",
          sx: { backgroundColor: '#D1FAE5', color: '#065F46' }
        };
      case "pending":
        return {
          label: "Pending",
          sx: { backgroundColor: '#FEF3C7', color: '#92400E' }
        };
      case "urgent":
        return {
          label: "Urgent",
          sx: { backgroundColor: '#FEE2E2', color: '#991B1B' }
        };
      default:
        return {
          label: "Unknown",
          sx: { backgroundColor: '#F3F4F6', color: '#374151' }
        };
    }
  };

  // TabPanel component for modularity
  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ pt: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  const statsCards = [
    { title: "Today's Appointments", value: "8", Icon: Calendar, color: '#2563EB' },
    { title: "Pending", value: "3", Icon: Clock, color: '#D97706' },
    { title: "Completed", value: "12", Icon: CheckCircleIcon, color: '#059669' },
    { title: "Cancelled", value: "2", Icon: CancelIcon, color: '#DC2626' },
  ];

  const renderAppointmentList = (appointments, title) => (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>{title}</Typography>
        {appointments.length > 0 ? (
          <Stack spacing={2}>
            {appointments.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)}
          </Stack>
        ) : (
          <Typography color="text.secondary">No appointments to display in this category.</Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#F9FAFB', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Appointments
          </Typography>
          <Typography color="text.secondary">
            Manage your patient appointments
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus />}
          sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}
        >
          New Appointment
        </Button>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={2} mb={4}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{
                      fontWeight: 'semibold',
                      fontSize: '1.2rem',
                    }} color="text.secondary">{card.title}</Typography>
                    <Typography variant="h3" fontWeight="bold">{card.value}</Typography>
                  </Box>
                  <card.Icon sx={{ fontSize: 40, color: card.color }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search and Filter */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search appointments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: 2 }
          }}
        />
        <Button
          variant="outlined"
          startIcon={<Filter />}
          sx={{ borderColor: '#D1D5DB', color: 'text.primary', textTransform: 'none', borderRadius: 2 }}
        >
          Filter
        </Button>
      </Stack>

      {/* Appointments Tabs */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              width: 'fit-content',
            }}
            aria-label='appointments tabs'
          >
            <Tab label="All" />
            <Tab label="Today" />
            <Tab label="Upcoming" />
            <Tab label="Completed" />
          </StyledTabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          {/* The "All" tab uses the original, complete list */}
          {renderAppointmentList(allAppointments, "All Appointments")}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/* The "Today" tab uses the todayAppointments state */}
          {renderAppointmentList(todayAppointments, "Today's Appointments")}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {/* The "Upcoming" tab uses the upcomingAppointments state */}
          {renderAppointmentList(upcomingAppointments, "Upcoming Appointments")}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          {/* The "Completed" tab uses the pastAppointments state */}
          {renderAppointmentList(pastAppointments, "Completed Appointments")}
        </TabPanel>
      </Box>
    </Box>
  );
}


export default DoctorAppointmentSection;
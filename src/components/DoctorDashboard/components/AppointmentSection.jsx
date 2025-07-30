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
  styled,
  ListItemIcon,
  ListItemText
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
  Lens as StatusIndicatorIcon,
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
const DoctorAppointmentSection = ({ doctor }) => {
  // console.log("DoctorAppointmentSection rendered with doctor:", doctor);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [allAppointments, setAllAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const filterMenu = useMenu();


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // adjust as needed

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchAndClassifyAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAppointmentsByDoctorId(doctor.id);
        console.log(data);
        setAllAppointments(data); // Keep the full list

        // Use the new function to categorize
        const {
          todayAppointments,
          upcomingAppointments,
          pastAppointments,
          cancelledAppointments
        } = classifyAppointments(data);
        // console.log("Upcoming Appointments:", upcomingAppointments);

        // Set the state for each category
        setTodayAppointments(todayAppointments);
        setUpcomingAppointments(upcomingAppointments);
        setPastAppointments(pastAppointments);
        setCancelledAppointments(cancelledAppointments);

      } catch (err) {
        setError("Failed to load appointments.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndClassifyAppointments();
  }, []);

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

  const filteredAppointments = useMemo(() => {
    const lowercasedQuery = debouncedQuery.toLowerCase();

    const filterLogic = (appointment) => {
      // Search filter logic
      const searchMatch = !lowercasedQuery ||
        appointment.patientName?.toLowerCase().includes(lowercasedQuery) ||
        appointment.reason?.toLowerCase().includes(lowercasedQuery);

      // Status filter logic
      const statusMatch = statusFilter === 'all' || appointment.status === statusFilter;

      return searchMatch && statusMatch;
    };

    return {
      all: allAppointments.filter(filterLogic),
      today: todayAppointments.filter(filterLogic),
      upcoming: upcomingAppointments.filter(filterLogic),
      past: pastAppointments.filter(filterLogic),
    };
  }, [debouncedQuery, statusFilter, allAppointments, todayAppointments, upcomingAppointments, pastAppointments]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    filterMenu.handleClose();
  };

  const statsCards = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      Icon: Calendar,
      color: '#2563EB'
    },
    {
      title: "Pending",
      value: upcomingAppointments.length,
      Icon: Clock,
      color: '#D97706'
    },
    {
      title: "Completed",
      value: pastAppointments.length,
      Icon: CheckCircleIcon,
      color: '#059669'
    },
    {
      title: "Cancelled",
      value: cancelledAppointments.length,
      Icon: CancelIcon,
      color: '#DC2626'
    },
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

  const filterOptions = [
    { value: 'all', label: 'All', color: 'action' },
    { value: 'confirmed', label: 'Confirmed', color: '#065F46' },
    { value: 'pending', label: 'Pending', color: '#92400E' },
    { value: 'urgent', label: 'Urgent', color: '#991B1B' }
  ];

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
                      fontWeight: 'medium',
                      fontSize: '1rem',
                    }} color="text.secondary">{card.title}</Typography>
                    <Typography variant="h4" fontWeight="bold">{card.value}</Typography>
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
          label="Search Appointments"
          name="search"
          variant="outlined"
          placeholder="Search by patient name or reason..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: '12px', bgcolor: 'white' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              boxShadow: 'none', // remove any box-shadow
              outline: 'none',   // remove outline
              '&:hover fieldset': {
                borderColor: '#28938C',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1D4645',
                borderWidth: 2,
              },
            },
            '& .MuiInputBase-root': {
              boxShadow: 'none !important',
              outline: 'none !important',
            },
            '& .MuiOutlinedInput-input': {
              boxShadow: 'none',
              outline: 'none',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1D4645',
            },
          }}
        />

        <Button
          variant={statusFilter !== 'all' ? 'contained' : 'outlined'}
          startIcon={<Filter />}
          onClick={filterMenu.handleClick}
          sx={{
            borderColor: '#D1D5DB',
            color: statusFilter !== 'all' ? 'white' : 'text.primary',
            bgcolor: statusFilter !== 'all' ? '#2563EB' : 'white',
            '&:hover': {
              bgcolor: statusFilter !== 'all' ? '#1D4ED8' : 'action.hover'
            },
            textTransform: 'none',
            borderRadius: '12px',
            flexShrink: 0
          }}
        >
          Filter {statusFilter !== 'all' && `(${statusFilter})`}
        </Button>
        <Menu
          anchorEl={filterMenu.anchorEl}
          open={filterMenu.open}
          onClose={filterMenu.handleClose}
        >
          {filterOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === statusFilter}
              onClick={() => handleFilterChange(option.value)}
            >
              <ListItemIcon>
                <StatusIndicatorIcon fontSize="small" sx={{ color: option.color }} />
              </ListItemIcon>
              <ListItemText sx={{ textTransform: 'capitalize' }}>{option.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      {/* Appointments Tabs */}
      <Box sx={{ width: '100%' }}>
        <Box>
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label='appointments tabs'
          >
            <Tab label={`All (${filteredAppointments.all.length})`} />
            <Tab label={`Today (${filteredAppointments.today.length})`} />
            <Tab label={`Upcoming (${filteredAppointments.upcoming.length})`} />
            <Tab label={`Completed (${filteredAppointments.past.length})`} />
          </StyledTabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          {renderAppointmentList(filteredAppointments.all, "All Appointments")}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderAppointmentList(filteredAppointments.today, "Today's Appointments")}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderAppointmentList(filteredAppointments.upcoming, "Upcoming Appointments")}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          {renderAppointmentList(filteredAppointments.past, "Completed Appointments")}
        </TabPanel>
      </Box>
    </Box>

  );
}


export default DoctorAppointmentSection;
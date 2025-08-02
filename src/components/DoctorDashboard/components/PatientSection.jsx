import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  Group,
  Add,
  Search,
  FilterList,
  MoreHoriz,
  Phone,
  Mail,
  LocationOn,
  CalendarToday,
  Check,
  PriorityHigh,
  Lens as StatusIndicatorIcon,
  FilterList as Filter,
} from "@mui/icons-material";
import { blue, green, grey, purple, red } from "@mui/material/colors";

import { getAllPatients, getAllUsers, getAppointmentsByDoctorId, getAppointmentsByClinicIds } from "../../../firebase";

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

const PatientActions = () => {
  // Ensure useState is called correctly and explicitly typed.
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label="more actions" size="small" onClick={handleClick}>
        <MoreHoriz />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
      >
        <MenuItem onClick={handleClose}>View Details</MenuItem>
        <MenuItem onClick={handleClose}>Edit Patient</MenuItem>
        <MenuItem onClick={handleClose}>Medical History</MenuItem>
        <MenuItem onClick={handleClose} sx={{ color: "error.main" }}>
          Archive
        </MenuItem>
      </Menu>
    </>
  );
};

const getStatusChipProps = (status) => {
  switch (status) {
    case "active":
      return {
        sx: { backgroundColor: green[100], color: green[800] },
      };
    case "inactive":
      return {
        sx: { backgroundColor: grey[200], color: grey[800] },
      };
    default:
      return {
        sx: { backgroundColor: grey[200], color: grey[800] },
      };
  }
};


const DoctorPatientSection = ({ doctor }) => {
  // console.log("DoctorPatientSection rendered with doctor:", doctor);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Menu hook for filter dropdown
  const filterMenu = useMenu();

  // Fetch users from Firebase
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  
  // Stats state variables
  const [statsData, setStatsData] = useState({
    totalPatients: 0,
    activePatients: 0,
    newThisMonth: 0,
    criticalCases: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!doctor || !doctor.id) {
        setError("Doctor not specified.");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        let appointmentsData = [];
        
        // Fetch appointments based on doctor's clinic IDs
        if (doctor.clinicIds && doctor.clinicIds.length > 0) {
          console.log('Fetching appointments for clinic IDs:', doctor.clinicIds);
          appointmentsData = await getAppointmentsByClinicIds(doctor.clinicIds);
        } else {
          console.log('No clinic IDs found, using doctorId fallback');
          appointmentsData = await getAppointmentsByDoctorId(doctor.id);
        }
        
        // Fetch users data
        const usersData = await getAllUsers();
        
        console.log("Fetched appointments:", appointmentsData);
        console.log("Fetched users:", usersData);
        
        setAllAppointments(appointmentsData);
        setUsers(usersData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    if (doctor && doctor.id) {
      fetchData();
    }
  }, [doctor]);

  useEffect(() => {
    const buildPatientsList = () => {
      const patientMap = new Map();
      const now = new Date();

      // Prioritize users who have appointments
      allAppointments.forEach((appointment) => {
        const { patientEmail } = appointment;
        if (!patientEmail || patientMap.has(patientEmail)) return;

        const patientUser = users.find((user) => user.email === patientEmail);
        if (!patientUser) return; // Only add patients who are also users

        const patientAppointments = allAppointments.filter(appt => appt.patientEmail === patientEmail);
        const lastAppointment = patientAppointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))[0];

        const lastVisit = patientAppointments.filter(appt => new Date(appt.appointmentDate) < now && appt.status === 'completed')
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))[0];

        const patientData = {
          id: patientUser.id,
          name: `${patientUser.firstName || ""} ${patientUser.lastName || ""}`.trim(),
          age: patientUser.age || "",
          gender: patientUser.gender || "",
          phone: patientUser.phone || "",
          email: patientUser.email,
          address: [patientUser.city, patientUser.country].filter(Boolean).join(", "),
          lastVisit: lastVisit?.appointmentDate || null,
          condition: lastVisit?.reason || "General Checkup",
          // Determine status based on last appointment
          status: lastAppointment?.status === 'cancelled' || lastAppointment?.status === 'completed' ? 'inactive' : 'active'
        };
        patientMap.set(patientEmail, patientData);
      });

      const uniquePatients = Array.from(patientMap.values());
      setPatients(uniquePatients);

      // Calculate stats
      const totalPatients = uniquePatients.length;
      const activePatients = totalPatients; // As requested, same as total
      const newThisMonth = totalPatients; // As requested, same as total
      const criticalCases = 0; // As requested, set to zero

      setStatsData({
        totalPatients,
        activePatients,
        newThisMonth,
        criticalCases
      });

      console.log('Patient stats calculated:', {
        totalPatients,
        activePatients,
        newThisMonth,
        criticalCases
      });
    };

    buildPatientsList();
  }, [users, allAppointments]);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const searchLower = searchQuery.toLowerCase();

      // Search logic (name, email, phone)
      const searchMatch = !searchQuery ||
        patient.name?.toLowerCase().includes(searchLower) ||
        patient.email?.toLowerCase().includes(searchLower) ||
        patient.phone?.includes(searchQuery);

      // Filter logic (status)
      const filterMatch = statusFilter === 'all' || patient.status === statusFilter;

      return searchMatch && filterMatch;
    });
  }, [patients, searchQuery, statusFilter]);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    filterMenu.handleClose();
  };

  const filterOptions = [
    { value: 'all', label: 'All', color: 'action' },
    { value: 'active', label: 'Active', color: '#065F46' },
    { value: 'inactive', label: 'Inactive', color: '#92400E' },
  ];


  const statsCards = [
    {
      title: "Total Patients",
      value: isLoading ? "..." : error ? "0" : statsData.totalPatients,
      Icon: Group,
      color: '#3182CE',
    },
    {
      title: "Active Patients",
      value: isLoading ? "..." : error ? "0" : statsData.activePatients,
      Icon: Check,
      color: '#38A169',
    },
    {
      title: "New This Month",
      value: isLoading ? "..." : error ? "0" : statsData.newThisMonth,
      Icon: Add,
      color: '#9F7AEA',
    },
    {
      title: "Critical Cases",
      value: isLoading ? "..." : error ? "0" : statsData.criticalCases,
      Icon: PriorityHigh,
      color: '#E53E3E',
    }
  ];

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" component="h2" fontWeight="bold">
            Patients
          </Typography>
          <Typography color="text.secondary">
            Manage your patient records
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: blue[600], "&:hover": { bgcolor: blue[700] } }}
        >
          Add Patient
        </Button>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary">Total Patients</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {isLoading ? "..." : error ? "0" : statsData.totalPatients}
                  </Typography>
                </Box>
                <Group sx={{ fontSize: 40, color: blue[600] }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary">Active Patients</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {isLoading ? "..." : error ? "0" : statsData.activePatients}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: green[600], width: 40, height: 40 }}>
                  <Check />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary">New This Month</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {isLoading ? "..." : error ? "0" : statsData.newThisMonth}
                  </Typography>
                </Box>
                <Add sx={{ fontSize: 40, color: purple[600] }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary">Critical Cases</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {isLoading ? "..." : error ? "0" : statsData.criticalCases}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: red[600], width: 40, height: 40 }}>
                  <PriorityHigh fontSize="small" />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          fullWidth
          placeholder="Search by name, email, or phone..."
          label="Search Patients"
          name="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }}
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

      {/* Patients List */}
      <Card sx={{ borderRadius: 2 }}>
        <CardHeader title={`Patient Records (${filteredPatients.length})`} />
        <CardContent>
          <Stack spacing={2}>
            {isLoading ? (<Typography>Loading patients...</Typography>) :
              error ? (<Typography color="error">{error}</Typography>) :
                filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <PatientCard key={patient.email} patient={patient} />
                  ))
                ) : (
                  <Typography color="text.secondary" textAlign="center" p={3}>
                    No patients match your criteria.
                  </Typography>
                )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

const PatientCard = ({ patient }) => {
  const initials = patient.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background-color 0.3s",
        "&:hover": {
          bgcolor: grey[50],
        },
      }}
    >
      {/* Left Info */}
      <Stack direction="row" alignItems="center" spacing={2} flex={1} minWidth={0}>
        <Avatar src={patient.avatar || "/placeholder.svg"} sx={{ width: 48, height: 48 }}>
          {initials}
        </Avatar>
        <Box minWidth={0}>
          <Typography fontWeight="medium">{patient.name && `${patient.name}`}</Typography>
          <Typography variant="body2" color="text.secondary">
            {patient.age && `${patient.age} years`}
            {patient.age && patient.gender && " • "}
            {patient.gender && patient.gender}
          </Typography>
          <Stack direction="row" spacing={2} mt={0.5} color="text.secondary" flexWrap="wrap">
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Phone sx={{ fontSize: 14 }} />
              <Typography variant="caption">{patient.phone}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Mail sx={{ fontSize: 14 }} />
              <Typography variant="caption">{patient.email}</Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      {/* Center Condition */}
      <Box textAlign="center" mx={2} display={{ xs: "none", md: "block" }}>
        <Typography variant="body2" fontWeight="medium">
          {patient.condition}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Primary Condition
        </Typography>
        <Chip
          size="small"
          {...getStatusChipProps(patient.status)}
          sx={{ mt: 0.5 }}
        />
      </Box>

      {/* Right Last Visit & Location */}
      <Box textAlign="right" mx={2} display={{ xs: "none", lg: "block" }}>
        {patient.lastVisit && new Date(patient.lastVisit).toString() !== "Invalid Date" && (
          <>
            <Typography variant="body2" fontWeight="medium">Last Visit</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(patient.lastVisit).toLocaleDateString()}
            </Typography>
          </>
        )}

        <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5} color="text.secondary" justifyContent="flex-end">
          <LocationOn sx={{ fontSize: 14 }} />
          <Typography variant="caption" noWrap sx={{ maxWidth: 130 }}>
            {patient.address}
          </Typography>
        </Stack>
      </Box>

      {/* Actions */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {patient.phone && (
          <a href={`tel:${patient.phone}`} style={{ textDecoration: "none" }}>
            <IconButton size="small">
              <Phone />
            </IconButton>
          </a>
        )}

        {patient.email && (
          <a href={`mailto:${patient.email}`} style={{ textDecoration: "none" }}>
            <IconButton size="small">
              <Mail />
            </IconButton>
          </a>
        )}
        <IconButton size="small"><CalendarToday /></IconButton>
        <PatientActions />
      </Stack>
    </Paper>
  );
};

export default DoctorPatientSection;
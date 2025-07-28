import React, { use, useEffect, useState } from "react";
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
} from "@mui/icons-material";
import { blue, green, grey, purple, red } from "@mui/material/colors";

import { getAllPatients, getAllUsers, getAppointmentsByDoctorId } from "../../../firebase";

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



  // Fetch users from Firebase
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        console.log("Fetched users:", fetchedUsers);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAppointmentsByDoctorId(doctor.id);
        console.log("Fetched appointments:", data);
        setAllAppointments(data); // Keep the full list
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to fetch appointments");
      }
      setIsLoading(false);
    }

    fetchUsers();
    fetchAppointments();
  }, []);

  useEffect(() => {
    const buildPatientsList = () => {
      if (!users || !allAppointments || users.length === 0 || allAppointments.length === 0) return;

      const now = new Date();
      const patientMap = new Map();

      allAppointments.forEach((appointment) => {
        const {
          patientName,
          patientEmail,
          appointmentDate,
          treatmentType,
          status,
        } = appointment;

        if (!patientEmail || patientMap.has(patientEmail)) return;

        const patient = users.find((user) => user.email === patientEmail);
        if (!patient) return;


        const pastAppointments = allAppointments
          .filter(
            (appt) =>
              appt.patientEmail === patientEmail &&
              new Date(appt.appointmentDate) < now &&
              appt.status === "completed"
          )
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

        const lastVisit = pastAppointments.length > 0 ? pastAppointments[0] : null;

        const patientData = {
          id: patient.id,
          name: `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || patientName,
          age: patient.age || "",
          gender: patient.gender || "",
          phone: patient.phone || "",
          email: patient.email || patientEmail,
          address: `${patient.city || ""}, ${patient.country || ""}`.replace(/^,|,$/g, ""),
          lastVisit: lastVisit?.appointmentDate || null,
          condition: lastVisit?.treatmentType || "",
          status: status || "",
        };

        patientMap.set(patientEmail, patientData);
      });

      const uniquePatients = Array.from(patientMap.values());
      console.log("Unique patients built:", uniquePatients);
      setPatients(uniquePatients);
    };

    buildPatientsList();
  }, [users, allAppointments]);

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
                  <Typography variant="h5" fontWeight="bold">156</Typography>
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
                  <Typography variant="h5" fontWeight="bold">142</Typography>
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
                  <Typography variant="h5" fontWeight="bold">23</Typography>
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
                  <Typography variant="h5" fontWeight="bold">5</Typography>
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
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="outlined" startIcon={<FilterList />}>
          Filter
        </Button>
      </Stack>

      {/* Patients List */}
      <Card>
        <CardHeader title="Patient Records" />
        <CardContent>
          <Stack spacing={2}>
            {patients.map((patient) => (
              <PatientCard key={patient.email} patient={patient} />
            ))}
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
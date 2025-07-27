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

import { getAllPatients, getAllUsers } from "../../../firebase";

const patients = [
  {
    id: 1,
    name: "John Smith",
    age: 45,
    gender: "Male",
    phone: "+1 234 567 8900",
    email: "john.smith@email.com",
    address: "123 Main St, City",
    lastVisit: "2024-01-15",
    condition: "Hypertension",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    age: 32,
    gender: "Female",
    phone: "+1 234 567 8901",
    email: "sarah.j@email.com",
    address: "456 Oak Ave, City",
    lastVisit: "2024-01-10",
    condition: "Diabetes",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Mike Wilson",
    age: 58,
    gender: "Male",
    phone: "+1 234 567 8902",
    email: "mike.w@email.com",
    address: "789 Pine St, City",
    lastVisit: "2023-12-20",
    condition: "Arthritis",
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Emily Davis",
    age: 28,
    gender: "Female",
    phone: "+1 234 567 8903",
    email: "emily.d@email.com",
    address: "321 Elm St, City",
    lastVisit: "2024-01-18",
    condition: "Asthma",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

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


const DoctorPatientSection = ({doctor}) => {
  // console.log("DoctorPatientSection rendered with doctor:", doctor);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Fetch users from Firebase
  const [users, setUsers] = useState([]);

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

    fetchUsers();

    // console.log("Users fetched:", users);
  }, []);

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
              <Paper
                key={patient.id}
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
                <Stack direction="row" alignItems="center" spacing={2} flex={1} minWidth={0}>
                  <Avatar
                    src={patient.avatar || "/placeholder.svg"}
                    sx={{ width: 48, height: 48 }}
                  >
                    {patient.name.split(" ").map((n) => n[0]).join("")}
                  </Avatar>
                  <Box minWidth={0}>
                    <Typography fontWeight="medium">{patient.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {patient.age} years • {patient.gender}
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

                <Box textAlign="center" mx={2} display={{ xs: "none", md: "block" }}>
                  <Typography variant="body2" fontWeight="medium">{patient.condition}</Typography>
                  <Typography variant="caption" color="text.secondary">Primary Condition</Typography>
                  <Chip
                    label={patient.status}
                    size="small"
                    {...getStatusChipProps(patient.status)}
                    sx={{ ...getStatusChipProps(patient.status).sx, mt: 0.5, textTransform: 'capitalize' }}
                  />
                </Box>

                <Box textAlign="right" mx={2} display={{ xs: "none", lg: "block" }}>
                  <Typography variant="body2" fontWeight="medium">Last Visit</Typography>
                  <Typography variant="caption" color="text.secondary">{patient.lastVisit}</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5} color="text.secondary" justifyContent="flex-end">
                    <LocationOn sx={{ fontSize: 14 }} />
                    <Typography variant="caption" noWrap sx={{ maxWidth: 130 }}>{patient.address}</Typography>
                  </Stack>
                </Box>

                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <IconButton size="small"><Phone /></IconButton>
                  <IconButton size="small"><Mail /></IconButton>
                  <IconButton size="small"><CalendarToday /></IconButton>
                  <PatientActions />
                </Stack>
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default DoctorPatientSection;
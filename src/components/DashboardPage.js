import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MedyatraDashboard } from "./Patient Dashboard/mediyatra-dashboard";
import {
  getUserAppointments,
  deleteAppointment,
  getUserById,
  updateAppointmentStatus,
  getAppointmentById,
  db,
} from "../firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { TrackChanges as TargetIcon } from '@mui/icons-material';
import { Person } from '@mui/icons-material';
import { Box } from "@mui/material";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const checkUserAuth = async () => {
      setLoading(true);
      setError("");
      try {
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedUser = JSON.parse(userData);

          if (parsedUser.id) {
            try {
              const userDocRef = doc(db, "users", parsedUser.id);
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                const userDetails = {
                  id: parsedUser.id,
                  ...userDocSnap.data(),
                };
                setUser({
                  ...parsedUser,
                  ...userDetails,
                });
                fetchUserAppointments(parsedUser.id);
              } else {
                setUser(parsedUser);
              }
            } catch (err) {
              console.error("Error fetching user from Firestore:", err);
              setUser(parsedUser);
            }
          }
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        setError("Authentication error. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, [refreshKey]);

  const fetchUserAppointments = async (userId) => {
    try {
      const userAppointments = await getUserAppointments(userId);
      const processedAppointments = userAppointments.map((appointment) => {
        if (
          appointment.userId &&
          typeof appointment.userId === "object" &&
          appointment.userId.id
        ) {
          appointment.userId = appointment.userId.id;
        }
        if (
          appointment.appointmentDate &&
          typeof appointment.appointmentDate === "object" &&
          appointment.appointmentDate.toDate
        ) {
          appointment.appointmentDate =
            appointment.appointmentDate.toDate().toISOString();
        }
        return appointment;
      });

      const sortedAppointments = [...processedAppointments].sort((a, b) => {
        const dateA = a.appointmentDate ? new Date(a.appointmentDate) : new Date(0);
        const dateB = b.appointmentDate ? new Date(b.appointmentDate) : new Date(0);
        return dateB - dateA;
      });
      setAppointments(sortedAppointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load your appointments. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUser(null);
    setAppointments([]);
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <MedyatraDashboard
        user={user}
        appointments={appointments}
        onLogout={handleLogout}
        error={error}
        loading={loading}
      />
    </Box>
  );
};

export default DashboardPage;

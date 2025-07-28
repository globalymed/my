import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Stack,
  Button,
  Switch,
  Chip,
  Skeleton,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import { Clock, Plus, Calendar, Edit } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function groupSlotsByDay(availabilityDocs) {
  const result = {};
  WEEK_DAYS.forEach(day => (result[day] = []));
  availabilityDocs.forEach(doc => {
    const date = new Date(doc.date);
    const dayName = WEEK_DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
    result[dayName].push(doc);
  });
  return result;
}

const getSlotRanges = (slots = []) => {
  // Group slots into ranges (e.g., 09:00-12:00, 14:00-17:00)
  if (!slots.length) return [];
  // Sort by time
  const sorted = [...slots].sort((a, b) => a.time.localeCompare(b.time));
  // Group consecutive slots
  const ranges = [];
  let start = null, end = null;
  for (let i = 0; i < sorted.length; i++) {
    if (!start) start = sorted[i].time;
    if (i === sorted.length - 1 || parseInt(sorted[i + 1]?.time.replace(':', '')) - parseInt(sorted[i].time.replace(':', '')) > 100) {
      end = sorted[i].time;
      ranges.push({ start, end });
      start = null;
      end = null;
    }
  }
  return ranges;
};

const AvailabilityContent = () => {
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState('');

  // Fetch doctor from localStorage
  useEffect(() => {
    const doctorDataString = localStorage.getItem('doctorData');
    if (doctorDataString) {
      setDoctor(JSON.parse(doctorDataString));
    }
  }, []);

  // Fetch clinic for doctor
  useEffect(() => {
    if (!doctor?.id) return;
    const fetchClinic = async () => {
      setLoading(true);
      try {
        const clinicsRef = collection(db, 'clinics');
        const q = query(clinicsRef, where('doctorId', '==', doctor.id));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setClinic({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          setError('No clinic assigned to this doctor.');
        }
      } catch (err) {
        setError('Failed to fetch clinic.');
      } finally {
        setLoading(false);
      }
    };
    fetchClinic();
  }, [doctor]);

  // Fetch availability for clinic
  useEffect(() => {
    if (!clinic?.id) return;
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const availRef = collection(db, 'availability');
        const q = query(availRef, where('clinicId', '==', clinic.id));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAvailability(docs);
      } catch (err) {
        setError('Failed to fetch availability.');
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [clinic]);

  // Compute summary stats
  const weeklyHours = React.useMemo(() => {
    let total = 0;
    availability.forEach(doc => {
      if (doc.availableDay && Array.isArray(doc.slots)) {
        total += doc.slots.length;
      }
    });
    return total;
  }, [availability]);

  const activeDays = React.useMemo(() => {
    return availability.filter(doc => doc.availableDay).length;
  }, [availability]);

  const avgDailyHours = activeDays ? (weeklyHours / activeDays).toFixed(1) : 0;

  const nextAvailable = React.useMemo(() => {
    const today = new Date();
    const future = availability
      .filter(doc => doc.availableDay && new Date(doc.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    if (future.length > 0) {
      const d = new Date(future[0].date);
      if (
        d.toDateString() === today.toDateString()
      )
        return 'Today';
      return d.toLocaleDateString();
    }
    return 'N/A';
  }, [availability]);

  // Group slots by weekday for display
  const slotsByDay = React.useMemo(() => groupSlotsByDay(availability), [availability]);

  return (
    <Box p={{ xs: 1, md: 3 }}>
      {/* Header */}
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={2}>
        <div>
          <Typography variant="h6" fontWeight="bold">Availability</Typography>
          <Typography variant="body2" color="text.secondary">Manage your working hours and schedule</Typography>
        </div>
        <Button variant="contained" sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }} startIcon={<Plus size={18} />}>
          Add Time Slot
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Typography variant="body2" color="text.secondary">Weekly Hours</Typography>
                  <Typography variant="h4" fontWeight="bold">{loading ? <Skeleton width={40} /> : `${weeklyHours}h`}</Typography>
                </div>
                <Clock size={32} style={{ color: '#2563eb' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Typography variant="body2" color="text.secondary">Active Days</Typography>
                  <Typography variant="h4" fontWeight="bold">{loading ? <Skeleton width={20} /> : activeDays}</Typography>
                </div>
                <Calendar size={32} style={{ color: '#22c55e' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Typography variant="body2" color="text.secondary">Avg. Daily Hours</Typography>
                  <Typography variant="h4" fontWeight="bold">{loading ? <Skeleton width={30} /> : `${avgDailyHours}h`}</Typography>
                </div>
                <Box sx={{ width: 32, height: 32, bgcolor: '#a21caf', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: 18 }}>⏰</span>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Typography variant="body2" color="text.secondary">Next Available</Typography>
                  <Typography variant="h4" fontWeight="bold">{loading ? <Skeleton width={50} /> : nextAvailable}</Typography>
                </div>
                <Box sx={{ width: 32, height: 32, bgcolor: '#ea580c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: 18 }}>📅</span>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Weekly Schedule */}
      <Card sx={{ mb: 2 }}>
        <CardHeader title={<Typography variant="subtitle1" fontWeight="bold">Weekly Schedule</Typography>} />
        <CardContent>
          <Stack spacing={2}>
            {WEEK_DAYS.map((day) => {
              const daySlots = slotsByDay[day] || [];
              const isAvailable = daySlots.some(doc => doc.availableDay);
              // Collect all slots for the day
              const allSlots = daySlots
                .filter(doc => doc.availableDay)
                .flatMap(doc => (doc.slots || []).filter(slot => slot.availableSlot));
              // Group slots into ranges (e.g., 09:00-12:00, 14:00-17:00)
              // For now, just show as chips
              return (
                <Box key={day} display="flex" alignItems="center" justifyContent="space-between" p={2} border={1} borderColor="#e5e7eb" borderRadius={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Switch checked={isAvailable} disabled />
                    <Box>
                      <Typography fontWeight={isAvailable ? 'bold' : 'normal'}>{day}</Typography>
                      {isAvailable && allSlots.length > 0 ? (
                        <Box display="flex" gap={1} mt={0.5}>
                          {allSlots.map((slot, idx) => (
                            <Chip
                              key={slot.time + idx}
                              label={slot.time}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography color="text.secondary" fontSize={14}>
                          {isAvailable ? 'No time slots' : 'Unavailable'}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    {isAvailable && (
                      <>
                        <Button size="small" variant="outlined" sx={{ minWidth: 0, px: 1 }}>
                          <Edit size={16} />
                        </Button>
                        <Button size="small" variant="outlined" sx={{ minWidth: 0, px: 1 }}>
                          <Plus size={16} />
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
      {error && (
        <Typography color="error" mt={2}>{error}</Typography>
      )}
    </Box>
  );
};

export default AvailabilityContent;

import React, { useState, useEffect } from 'react';
import { addDays, format, isBefore, isAfter, startOfWeek, differenceInDays, startOfMonth, endOfMonth, getDaysInMonth, subMonths, addMonths, startOfDay } from 'date-fns';
import {
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Chip,
  Grid,
  styled,
  useTheme,
  TextField,
  FormControlLabel,
  Checkbox,
  Tooltip
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  KeyboardArrowDown,
  CheckCircle,
  Cancel,
  RadioButtonUnchecked,
  FiberManualRecord
} from '@mui/icons-material';
import { getClinicsByTreatmentType, getAvailability } from '../firebase';

// Styled components
const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 400,
  margin: '0 auto',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8],
  position: 'relative'
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3)
}));

const DropdownBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1)
}));

const YearButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  borderColor: '#ccc',
  color: 'black',
  '&:hover': {
    backgroundColor: '#f0f0f0',
    borderColor: '#aaa',
  },
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600
}));

const MonthButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  borderColor: '#ccc',
  color: 'black',
  '&:hover': {
    backgroundColor: '#f0f0f0',
    borderColor: '#aaa',
  },
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600
}));

const DayHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  paddingX: theme.spacing(1)
}));

const DayLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  width: 40,
  textAlign: 'center'
}));

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5)
}));

const WeekRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(0.5)
}));

const DayButton = styled(Button)(({ theme, status }) => {
  const getButtonStyles = () => {
    switch (status) {
      case 'selected':
        return {
          backgroundColor: theme.palette.info.main,
          color: theme.palette.info.contrastText,
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: theme.palette.info.dark
          }
        };
      case 'today':
        return {
          color: 'black',
          border: `2px solid ${theme.palette.primary.main}`,
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: 'white'
          }
        };
      case 'available':
        return {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.contrastText,
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: theme.palette.success.main
          }
        };
      case 'unavailable':
        return {
          color: theme.palette.error.contrastText,
          backgroundColor: theme.palette.error.light,
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: theme.palette.error.light
          }
        };
      default:
        return {};
    }
  };

  return {
    minWidth: 40,
    height: 40,
    padding: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: 'transparent',
      transform: 'scale(1.05)'
    },
    ...getButtonStyles()
  };
});

const LegendBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  flexWrap: 'wrap'
}));

const LegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5)
}));

const ChatCalendarComponent = ({ onSelectDate, treatmentType = null, location = null }) => {
  const theme = useTheme();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [yearAnchorEl, setYearAnchorEl] = useState(null);
  const [monthAnchorEl, setMonthAnchorEl] = useState(null);

  // Log the props for debugging
  useEffect(() => {
    console.log("Calendar component received props:", { 
      treatmentType, 
      location, 
      treatmentTypeLower: treatmentType ? treatmentType.toLowerCase() : null 
    });
  }, [treatmentType, location]);

  // Normalize treatmentType to lowercase for consistent database queries
  const normalizedTreatmentType = treatmentType ? treatmentType.toLowerCase() : null;

  // Date utility functions
  const formatDate = (date, formatStr) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    if (formatStr === 'yyyy-MM-dd') return `${year}-${month}-${day}`;
    if (formatStr === 'd') return String(d.getDate());
    if (formatStr === 'EEE, MMM d, yyyy') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${year}`;
    }
    return d.toDateString();
  };

  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const getFirstDayOfMonth = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1).getDay();
  };

  // Helper function to get availability for a specific date, treatment, and location
  const getAvailabilityForDate = async (treatmentType, location, date) => {
    try {
      // Normalize treatment type to lowercase for database consistency
      const normalizedType = treatmentType ? treatmentType.toLowerCase() : treatmentType;
      
      console.log(`Checking availability for ${normalizedType} in ${location} on ${date}`);
      
      // Step 1: Get clinics matching the treatment type and location
      const clinics = await getClinicsByTreatmentType(normalizedType, location);
      
      if (!clinics || clinics.length === 0) {
        console.log(`No clinics found for ${normalizedType} in ${location}`);
        return [];
      }
      
      // Step 2: Check each clinic's availability for the specified date
      const availableClinics = [];
      
      for (const clinic of clinics) {
        // Get availability data for this clinic on this date
        const availabilityData = await getAvailability(clinic.id, date);
        
        // Check if the clinic is available on this date
        if (availabilityData && 
            availabilityData.length > 0 && 
            availabilityData[0].availableDay) {
          // Add clinic to available clinics list with its details
          availableClinics.push({
            ...clinic,
            availabilitySlots: availabilityData[0].slots || []
          });
        }
      }
      
      return availableClinics;
    } catch (error) {
      console.error(`Error checking availability for ${treatmentType} in ${location} on ${date}:`, error);
      return []; // Return empty array on error
    }
  };

  // Fetch availability data for this month's calendar
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);

      try {
        console.log("Fetching clinic availability for:", normalizedTreatmentType, location);

        // Default to general availability if no treatment type or location specified
        const treatment = normalizedTreatmentType || 'general';
        const locationFilter = location || 'all';

        // Get all dates in the current month
        const firstDay = startOfMonth(currentMonth);
        const lastDay = endOfMonth(currentMonth);

        // Create a map to store availability for all dates in the month
        const newAvailableDates = {};

        // Loop through all dates in the month
        let currentDate = firstDay;
        while (currentDate <= lastDay) {
          const dateStr = format(currentDate, 'yyyy-MM-dd');

          // Get clinics available on this date for the specified treatment and location
          const clinicsAvailable = await getAvailabilityForDate(
            treatment, 
            locationFilter, 
            dateStr
          );

          // Mark date as available if there are clinics
          newAvailableDates[dateStr] = {
            available: clinicsAvailable.length > 0,
            clinics: clinicsAvailable,
            count: clinicsAvailable.length
          };

          // Move to next day
          currentDate = addDays(currentDate, 1);
        }

        setAvailableDates(newAvailableDates);
        console.log("Availability data loaded:", newAvailableDates);
      } catch (error) {
        console.error("Error fetching availability:", error);
        // Set all dates as available in case of error to prevent blocking
        const newAvailableDates = {};
        const daysInMonth = getDaysInMonth(currentMonth);

        for (let i = 1; i <= daysInMonth; i++) {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
          const dateStr = format(date, 'yyyy-MM-dd');
          newAvailableDates[dateStr] = {
            available: true,
            clinics: [],
            count: 0
          };
        }

        setAvailableDates(newAvailableDates);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [currentMonth, normalizedTreatmentType, location]);

  const years = Array.from({ length: 12 }, (_, i) => 2021 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDateClick = (date) => {
    if (isDateDisabled(date)) return;

    const formattedDate = formatDate(date, 'yyyy-MM-dd');
    const dateInfo = availableDates[formattedDate];
    
    if (dateInfo && dateInfo.available) {
      console.log("Selected available date:", formattedDate);
      setSelectedDate(date);
      onSelectDate && onSelectDate(formattedDate);
    } else {
      console.log("Selected unavailable date:", formattedDate);
    }
  };

  const isDateDisabled = (date) => {
    const todayStart = startOfDay(new Date());
    const formattedDate = formatDate(date, 'yyyy-MM-dd');
    const dateInfo = availableDates[formattedDate];

    if (isBefore(startOfDay(date), todayStart)) {
      return true;
    }

    if (dateInfo && !dateInfo.available) {
      return true;
    }

    return false;
  };

  const getDateStatus = (date) => {
    const formattedDate = formatDate(date, 'yyyy-MM-dd');
    const dateInfo = availableDates[formattedDate];

    if (selectedDate && isSameDay(date, selectedDate)) return 'selected';
    if (isToday(date)) return 'today';
    if (dateInfo?.available) return 'available';
    if (dateInfo && !dateInfo.available) return 'unavailable';
    return 'default';
  };

  const handleYearChange = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setYearAnchorEl(null);
  };

  const handleMonthChange = (monthIndex) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setMonthAnchorEl(null);
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const rows = [];

    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

    for (let week = 0; week < totalCells / 7; week++) {
      const days = [];

      for (let day = 0; day < 7; day++) {
        const cellIndex = week * 7 + day;
        const dayNumber = cellIndex - firstDay + 1;

        if (dayNumber > 0 && dayNumber <= daysInMonth) {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber);
          const status = getDateStatus(date);
          const disabled = isDateDisabled(date);
          const formattedDate = formatDate(date, 'yyyy-MM-dd');
          const dateInfo = availableDates[formattedDate];

          // Create tooltip message
          let tooltipText = "Loading availability...";
          if (dateInfo) {
            if (dateInfo.available) {
              const clinicCount = dateInfo.count || 0;
              tooltipText = `${clinicCount} clinic${clinicCount !== 1 ? 's' : ''} available for ${normalizedTreatmentType || 'treatment'} in ${location || 'this area'}`;
            } else {
              tooltipText = `No clinics available for ${normalizedTreatmentType || 'treatment'} in ${location || 'this area'} on this date`;
            }
          }

          days.push(
            <Tooltip key={cellIndex} title={tooltipText}>
              <span>
                <DayButton
                  status={status}
                  onClick={() => !disabled && handleDateClick(date)}
                  disabled={disabled}
                >
                  {dayNumber}
                </DayButton>
              </span>
            </Tooltip>
          );
        } else {
          days.push(<Box key={cellIndex} sx={{ width: 40, height: 40 }} />);
        }
      }

      rows.push(
        <WeekRow key={week}>
          {days}
        </WeekRow>
      );
    }

    return rows;
  };

  return (
    <CalendarContainer elevation={8}>
      {/* Header */}
      <HeaderBox>
        <DropdownBox>
          {/* Month Dropdown */}
          <MonthButton
            variant='outlined'
            endIcon={<KeyboardArrowDown />}
            onClick={(e) => setMonthAnchorEl(e.currentTarget)}
          >
            {months[currentMonth.getMonth()]}
          </MonthButton>

          <Menu
            anchorEl={monthAnchorEl}
            open={Boolean(monthAnchorEl)}
            onClose={() => setMonthAnchorEl(null)}
            PaperProps={{
              style: {
                maxHeight: 200,
                width: 140
              }
            }}
          >
            {months.map((month, index) => (
              <MenuItem
                key={month}
                onClick={() => handleMonthChange(index)}
                selected={index === currentMonth.getMonth()}
              >
                {month}
              </MenuItem>
            ))}
          </Menu>

          {/* Year Dropdown */}
          <YearButton
            variant="outlined"
            endIcon={<KeyboardArrowDown />}
            onClick={(e) => setYearAnchorEl(e.currentTarget)}
          >
            {currentMonth.getFullYear()}
          </YearButton>

          <Menu
            anchorEl={yearAnchorEl}
            open={Boolean(yearAnchorEl)}
            onClose={() => setYearAnchorEl(null)}
            PaperProps={{
              style: {
                maxHeight: 200,
                width: 120
              }
            }}
          >
            {years.map(year => (
              <MenuItem
                key={year}
                onClick={() => handleYearChange(year)}
                selected={year === currentMonth.getFullYear()}
              >
                {year}
              </MenuItem>
            ))}
          </Menu>
        </DropdownBox>

        {/* Navigation */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            size="small"
            disabled={isBefore(subMonths(currentMonth, 1), today)}
          >
            <ArrowBackIos />
          </IconButton>
          <IconButton
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            size="small"
            disabled={differenceInDays(addMonths(currentMonth, 1), today) > 30}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </HeaderBox>

      {/* Days of week header */}
      <DayHeader>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <DayLabel key={day}>{day}</DayLabel>
        ))}
      </DayHeader>

      {/* Calendar Grid */}
      <CalendarGrid>
        {renderCalendarGrid()}
      </CalendarGrid>

      {/* Legend */}
      <LegendBox>
        <LegendItem>
          <FiberManualRecord sx={{ color: 'success.main', fontSize: 16 }} />
          <Typography variant="caption">Available</Typography>
        </LegendItem>
        <LegendItem>
          <FiberManualRecord sx={{ color: 'error.main', fontSize: 16 }} />
          <Typography variant="caption">Unavailable</Typography>
        </LegendItem>
        <LegendItem>
          <RadioButtonUnchecked sx={{ color: 'primary.main', fontSize: 16 }} />
          <Typography variant="caption">Today</Typography>
        </LegendItem>
        <LegendItem>
          <FiberManualRecord sx={{ color: 'info.main', fontSize: 16 }} />
          <Typography variant="caption">Selected</Typography>
        </LegendItem>
      </LegendBox>

      {/* Selected date display */}
      {selectedDate && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Chip
            label={`Selected: ${formatDate(selectedDate, 'EEE, MMM d, yyyy')}`}
            color="primary"
            variant="outlined"
            icon={<CheckCircle />}
          />
        </Box>
      )}

      {/* Loading indicator */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={24} />
            <Typography variant="body2">Loading clinic availability...</Typography>
          </Box>
        </Box>
      )}
    </CalendarContainer>
  );
};

const BookingConfirmationForm = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    reason: '',
    insurance: false,
    insuranceDetails: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({ ...prevData, [name]: fieldValue }));
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate required fields for step 1
      if (!formData.fullName || !formData.phone) {
        // Display error message or handle validation failure
        return;
      }
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {step === 1 && (
        <>
          <TextField
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <TextField
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Button onClick={handleNext}>Next</Button>
        </>
      )}
      {step === 2 && (
        <>
          <TextField
            name="reason"
            label="Reason for Visit"
            value={formData.reason}
            onChange={handleChange}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                name="insurance"
                checked={formData.insurance}
                onChange={handleChange}
              />
            }
            label="I have insurance"
          />
          {formData.insurance && (
            <TextField
              name="insuranceDetails"
              label="Insurance Details"
              value={formData.insuranceDetails}
              onChange={handleChange}
            />
          )}
          <Button type="submit">Confirm Booking</Button>
        </>
      )}
    </form>
  );
};

export default ChatCalendarComponent;
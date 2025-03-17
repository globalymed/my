import React, { useState, useEffect } from 'react';
import { addDays, format, isBefore, isAfter, startOfWeek, differenceInDays, startOfMonth, endOfMonth, getDaysInMonth, subMonths, addMonths, startOfDay } from 'date-fns';
import { Button, Paper, Grid, Typography, Box, Chip, Tooltip, CircularProgress, TextField, FormControlLabel, Checkbox } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { styled } from '@mui/material/styles';
import { getClinicsByTreatmentType, getAvailability } from '../firebase';

// Utility function for combining class names
const classNames = (classObj) => {
  return Object.entries(classObj)
    .filter(([_, value]) => value)
    .map(([className, _]) => className)
    .join(' ');
};

// Styled components for the calendar
const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  maxWidth: '100%',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
  background: '#f8f9fa'
}));

const DayButton = styled(Button)(({ theme, isselected, istoday, isdisabled, isavailable, isunavailable }) => ({
  minWidth: '40px',
  height: '40px',
  margin: '4px',
  borderRadius: '50%',
  padding: 0,
  fontSize: '0.85rem',
  transition: 'all 0.2s',
  backgroundColor: isselected === 'true' ? theme.palette.primary.main : 
                   isavailable === 'true' ? theme.palette.success.light :
                   isunavailable === 'true' ? theme.palette.error.light :
                   istoday === 'true' ? theme.palette.background.paper : 
                   'transparent',
  color: isselected === 'true' ? theme.palette.primary.contrastText : 
         isdisabled === 'true' ? theme.palette.text.disabled : 
         isavailable === 'true' ? theme.palette.success.contrastText :
         isunavailable === 'true' ? theme.palette.error.contrastText :
         theme.palette.text.primary,
  border: istoday === 'true' && isselected !== 'true' ? `1px solid ${theme.palette.primary.main}` : 'none',
  cursor: isdisabled === 'true' ? 'not-allowed' : 'pointer',
  '&:hover': {
    backgroundColor: isdisabled === 'true' ? 'transparent' : 
                    isselected === 'true' ? theme.palette.primary.dark : 
                    isavailable === 'true' ? theme.palette.success.main :
                    isunavailable === 'true' ? theme.palette.error.main :
                    theme.palette.primary.light,
    color: isdisabled === 'true' ? theme.palette.text.disabled : 
           isselected === 'true' ? theme.palette.primary.contrastText : 
           theme.palette.primary.contrastText
  },
  '&.Mui-disabled': {
    color: theme.palette.text.disabled,
    backgroundColor: isunavailable === 'true' ? theme.palette.error.light : 'transparent'
  }
}));

const MonthNavigator = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1)
}));

const WeekRow = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(1)
}));

const DayLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '40px',
  margin: '0 4px'
}));

const Legend = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  gap: theme.spacing(2),
  flexWrap: 'wrap'
}));

const LegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary
}));

const ChatCalendarComponent = ({ onSelectDate, treatmentType = null, location = null }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState({});
  const [loading, setLoading] = useState(true);

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

  // Format the currently displayed month
  const formatMonth = format(currentMonth, 'MMMM yyyy');

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
            availabilityData[0].available) {
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

  // Handle date click
  const handleDateClick = (date) => {
    // Format the date as YYYY-MM-DD
    const formattedDate = format(date, 'yyyy-MM-dd');

    // Check if the date is available
    const dateInfo = availableDates[formattedDate];
    if (dateInfo && dateInfo.available) {
      console.log("Selected available date:", formattedDate);
      setSelectedDate(date);
      onSelectDate(formattedDate);
    } else {
      console.log("Selected unavailable date:", formattedDate);
      // Optionally provide feedback about unavailable date
      // For example, show a tooltip or alert
    }
  };

  // Generate custom day content with availability styling
  const renderDayContents = (day, date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dateInfo = availableDates[formattedDate];

    // Create a tooltip message
    let tooltipText = "Loading availability...";
    let isAvailable = false;

    if (dateInfo) {
      isAvailable = dateInfo.available;
      if (isAvailable) {
        const clinicCount = dateInfo.count || 0;
        tooltipText = `${clinicCount} clinic${clinicCount !== 1 ? 's' : ''} available for ${normalizedTreatmentType || 'treatment'} in ${location || 'this area'}`;
      } else {
        tooltipText = `No clinics available for ${normalizedTreatmentType || 'treatment'} in ${location || 'this area'} on this date`;
      }
    }

    // Define classes based on availability
    const dayClasses = classNames({
      'calendar-day': true,
      'available-day': dateInfo && dateInfo.available,
      'unavailable-day': dateInfo && !dateInfo.available,
      'loading-day': !dateInfo
    });

    return (
      <div 
        className={dayClasses}
        title={tooltipText} // Native HTML tooltip
      >
        {day}
        {dateInfo && dateInfo.available && (
          <div className="availability-indicator">
            <CheckCircleIcon style={{ fontSize: 12, color: '#4caf50' }} />
          </div>
        )}
      </div>
    );
  };

  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Check if a date should be clickable
  // Disable past dates and unavailable dates
  const isDateDisabled = (date) => {
    const today = startOfDay(new Date());
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dateInfo = availableDates[formattedDate];

    // Disable dates in the past
    if (isBefore(startOfDay(date), today)) {
      return true;
    }

    // Disable dates that are explicitly marked as unavailable
    if (dateInfo && !dateInfo.available) {
      return true;
    }

    return false;
  };

  return (
    <CalendarContainer elevation={3}>
      <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
        <EventAvailableIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle1" fontWeight="bold">Select Appointment Date</Typography>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={24} />
          <Typography variant="body2" ml={1}>Loading clinic availability...</Typography>
        </Box>
      )}

      <MonthNavigator>
        <Button 
          startIcon={<ArrowBackIosIcon />} 
          size="small" 
          onClick={goToPreviousMonth}
          disabled={isBefore(subMonths(currentMonth, 1), today)}
        >
          Prev
        </Button>
        <Typography variant="subtitle2">{formatMonth}</Typography>
        <Button 
          endIcon={<ArrowForwardIosIcon />} 
          size="small" 
          onClick={goToNextMonth}
          disabled={differenceInDays(addMonths(currentMonth, 1), today) > 30}
        >
          Next
        </Button>
      </MonthNavigator>

      {/* Days of week headers */}
      <WeekRow container>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <DayLabel key={index}>{day}</DayLabel>
        ))}
      </WeekRow>

      {/* Calendar grid */}
      {Array.from({ length: 4 }, (_, weekIndex) => (
        <WeekRow container key={weekIndex}>
          {Array.from({ length: 7 }, (_, dayIndex) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), weekIndex * 7 + dayIndex + 1);
            const day = format(date, 'd');
            const isDisabled = isDateDisabled(date);
            const isAvailable = availableDates[format(date, 'yyyy-MM-dd')] && availableDates[format(date, 'yyyy-MM-dd')].available;
            const isUnavailable = availableDates[format(date, 'yyyy-MM-dd')] && !availableDates[format(date, 'yyyy-MM-dd')].available;

            return (
              <Tooltip 
                key={`${weekIndex}-${dayIndex}`}
                title={
                  isDisabled ? "Not available for booking" :
                  isUnavailable ? "No clinics available on this date" :
                  isAvailable ? "Clinics available for booking" : "Availability unknown"
                }
              >
                <span> {/* Wrapper for disabled buttons */}
                  <DayButton
                    isselected={selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') ? 'true' : 'false'}
                    istoday={format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') ? 'true' : 'false'}
                    isdisabled={isDisabled ? 'true' : 'false'}
                    isavailable={isAvailable ? 'true' : 'false'}
                    isunavailable={isUnavailable ? 'true' : 'false'}
                    onClick={() => handleDateClick(date)}
                    disabled={isDisabled || isUnavailable}
                  >
                    {renderDayContents(day, date)}
                  </DayButton>
                </span>
              </Tooltip>
            );
          })}
        </WeekRow>
      ))}

      {/* Calendar Legend */}
      <Legend>
        <LegendItem>
          <Box 
            sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%',
              backgroundColor: 'success.light',
              mr: 1
            }} 
          />
          <Typography variant="caption">Available</Typography>
        </LegendItem>
        <LegendItem>
          <Box 
            sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%',
              backgroundColor: 'error.light',
              mr: 1
            }} 
          />
          <Typography variant="caption">Unavailable</Typography>
        </LegendItem>
        <LegendItem>
          <Box 
            sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%',
              border: '1px solid',
              borderColor: 'primary.main',
              mr: 1
            }} 
          />
          <Typography variant="caption">Today</Typography>
        </LegendItem>
        <LegendItem>
          <Box 
            sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              mr: 1
            }} 
          />
          <Typography variant="caption">Selected</Typography>
        </LegendItem>
      </Legend>

      {/* Show selected date */}
      {selectedDate && (
        <Box mt={2} textAlign="center">
          <Chip 
            label={`Selected: ${format(selectedDate, 'EEE, MMM d, yyyy')}`} 
            color="primary" 
            variant="outlined"
            icon={<CheckCircleIcon />}
          />
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
      if (!formData.fullName || !formData.phone || !isValidPhoneNumber(formData.phone, 'IN')) {
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

const reserveSlot = async (slotId, userId) => {
  try {
    await runTransaction(db, async (transaction) => {
      const slotRef = doc(db, 'slots', slotId);
      const slotDoc = await transaction.get(slotRef);
      
      if (!slotDoc.exists()) {
        throw new Error('Slot document does not exist');
      }

      if (slotDoc.data().status !== 'available') {
        throw new Error('Slot is already booked');
      }

      transaction.update(slotRef, { 
        status: 'booked',
        bookedBy: userId,
        bookedAt: new Date(),
      });
    });
    console.log('Slot reserved successfully');
  } catch (error) {
    console.error('Error reserving slot:', error);
    throw error;
  }
};

export default ChatCalendarComponent;
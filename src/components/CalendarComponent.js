import React, { useState } from 'react';
import { addDays, format, isBefore, isAfter, startOfWeek, differenceInDays } from 'date-fns';
import { Button, Paper, Grid, Typography, Box, Chip } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { styled } from '@mui/material/styles';

// Styled components for the calendar
const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  maxWidth: '100%',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
  background: '#f8f9fa'
}));

const DayButton = styled(Button)(({ theme, isselected, istoday, isdisabled }) => ({
  minWidth: '40px',
  height: '40px',
  margin: '4px',
  borderRadius: '50%',
  padding: 0,
  fontSize: '0.85rem',
  transition: 'all 0.2s',
  backgroundColor: isselected === 'true' ? theme.palette.primary.main : 
                   istoday === 'true' ? theme.palette.background.paper : 
                   'transparent',
  color: isselected === 'true' ? theme.palette.primary.contrastText : 
         isdisabled === 'true' ? theme.palette.text.disabled : 
         theme.palette.text.primary,
  border: istoday === 'true' && isselected !== 'true' ? `1px solid ${theme.palette.primary.main}` : 'none',
  cursor: isdisabled === 'true' ? 'not-allowed' : 'pointer',
  '&:hover': {
    backgroundColor: isdisabled === 'true' ? 'transparent' : 
                    isselected === 'true' ? theme.palette.primary.dark : 
                    theme.palette.primary.light,
    color: isdisabled === 'true' ? theme.palette.text.disabled : 
           isselected === 'true' ? theme.palette.primary.contrastText : 
           theme.palette.primary.contrastText
  },
  '&.Mui-disabled': {
    color: theme.palette.text.disabled,
    backgroundColor: 'transparent'
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

const ChatCalendarComponent = ({ onSelectDate }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewingMonth, setViewingMonth] = useState(today.getMonth());
  const [viewingYear, setViewingYear] = useState(today.getFullYear());

  // Days of the week
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Calculate the start of the current week
  const startOfCurrentWeek = startOfWeek(new Date(viewingYear, viewingMonth, 1));

  // Is date valid for selection (between today and 30 days from now)
  const isDateValid = (date) => {
    const maxDate = addDays(today, 30);
    return !isBefore(date, today) && !isAfter(date, maxDate);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (!isDateValid(date)) return;
    
    setSelectedDate(date);
    // Format date as YYYY-MM-DD for consistent API usage
    const formattedDate = format(date, 'yyyy-MM-dd');
    onSelectDate(formattedDate);
  };

  // Navigate to next/previous week
  const navigateWeek = (direction) => {
    const newDate = addDays(currentDate, direction * 7);
    setCurrentDate(newDate);
    setViewingMonth(newDate.getMonth());
    setViewingYear(newDate.getFullYear());
  };

  // Generate calendar weeks (4 weeks from today)
  const generateCalendarDays = () => {
    const weeks = [];
    let currentWeekStart = startOfCurrentWeek;

    // Generate 4 weeks
    for (let weekIndex = 0; weekIndex < 4; weekIndex++) {
      const days = [];
      
      // Generate 7 days for each week
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const day = addDays(currentWeekStart, weekIndex * 7 + dayIndex);
        days.push(day);
      }
      
      weeks.push(days);
    }

    return weeks;
  };

  const calendarWeeks = generateCalendarDays();
  const currentMonthName = format(new Date(viewingYear, viewingMonth), 'MMMM yyyy');

  // Check if a date is today
  const isToday = (date) => {
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  };

  // Check if a date is selected
  const isSelected = (date) => {
    return selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  };

  return (
    <CalendarContainer elevation={3}>
      <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
        <EventAvailableIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle1" fontWeight="bold">Select Appointment Date</Typography>
      </Box>
      
      <MonthNavigator>
        <Button 
          startIcon={<ArrowBackIosIcon />} 
          size="small" 
          onClick={() => navigateWeek(-1)}
          disabled={isBefore(addDays(currentDate, -7), today)}
        >
          Prev
        </Button>
        <Typography variant="subtitle2">{currentMonthName}</Typography>
        <Button 
          endIcon={<ArrowForwardIosIcon />} 
          size="small" 
          onClick={() => navigateWeek(1)}
          disabled={differenceInDays(addDays(currentDate, 7), today) > 30}
        >
          Next
        </Button>
      </MonthNavigator>

      {/* Days of week headers */}
      <WeekRow container>
        {daysOfWeek.map((day, index) => (
          <DayLabel key={index}>{day}</DayLabel>
        ))}
      </WeekRow>

      {/* Calendar grid */}
      {calendarWeeks.map((week, weekIndex) => (
        <WeekRow container key={weekIndex}>
          {week.map((day, dayIndex) => {
            const disabled = !isDateValid(day);
            return (
              <DayButton
                key={`${weekIndex}-${dayIndex}`}
                isselected={isSelected(day) ? 'true' : 'false'}
                istoday={isToday(day) ? 'true' : 'false'}
                isdisabled={disabled ? 'true' : 'false'}
                onClick={() => handleDateSelect(day)}
                disabled={disabled}
              >
                {format(day, 'd')}
              </DayButton>
            );
          })}
        </WeekRow>
      ))}

      {/* Show selected date */}
      {selectedDate && (
        <Box mt={2} textAlign="center">
          <Chip 
            label={`Selected: ${format(selectedDate, 'EEE, MMM d, yyyy')}`} 
            color="primary" 
            variant="outlined"
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
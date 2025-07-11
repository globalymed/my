import React, { useState, useEffect } from 'react';
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
  useTheme
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
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  },
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600
}));

const MonthButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.grey[200]
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
          color: '#2f2f2f',
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
    color: '#2f2f2f',
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

  // Date utility functions
  const formatDate = (date, format) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    if (format === 'yyyy-MM-dd') return `${year}-${month}-${day}`;
    if (format === 'd') return String(d.getDate());
    if (format === 'EEE, MMM d, yyyy') {
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

  const isBefore = (date1, date2) => {
    return new Date(date1) < new Date(date2);
  };

  const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getDaysInMonth = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1).getDay();
  };

  // Mock availability data - replace with your actual API calls
  const mockAvailability = {
    '2025-07-15': { available: true, count: 3 },
    '2025-07-16': { available: false, count: 0 },
    '2025-07-17': { available: true, count: 2 },
    '2025-07-20': { available: true, count: 4 },
    '2025-07-22': { available: false, count: 0 },
    '2025-07-25': { available: true, count: 1 },
  };

  // Simulate loading availability
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAvailableDates(mockAvailability);
      setLoading(false);
    }, 500);
  }, [currentMonth, treatmentType, location]);

  const years = Array.from({ length: 12 }, (_, i) => 2021 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDateClick = (date) => {
    if (isDateDisabled(date)) return;

    const formattedDate = formatDate(date, 'yyyy-MM-dd');
    setSelectedDate(date);
    onSelectDate && onSelectDate(formattedDate);
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

          days.push(
            <DayButton
              key={cellIndex}
              status={status}
              onClick={() => !disabled && handleDateClick(date)}
              disabled={disabled}
            >
              {dayNumber}
            </DayButton>
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
            sx={{
              backgroundColor: 'white',
              borderColor: '#ccc', // optional: make border subtle
              color: '#2f2f2f',       // text color contrast
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: '#aaa',
              },
            }}
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
            sx={{
              backgroundColor: 'white',
              borderColor: '#ccc', // optional: make border subtle
              color: '#2f2f2f',       // text color contrast
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: '#aaa',
              },
            }}
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
          >
            <ArrowBackIos />
          </IconButton>
          <IconButton
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            size="small"
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </HeaderBox>

      {/* Days of week header - Fixed to start with Sunday */}
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
            <Typography variant="body2">Loading availability...</Typography>
          </Box>
        </Box>
      )}
    </CalendarContainer>
  );
};

export default ChatCalendarComponent;
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Badge,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Divider,
  Stack,
  Grid,
  Container,
  Paper,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MedicalServices,
  Flight,
  Description,
  Message,
  CalendarToday,
  CheckCircle,
  Close,
  Circle,
  Warning,
  Info,
  Schedule,
  LocalHospital,
  Support,
  Assignment,
  Email,
  Phone,
  LocationOn,
  AccessTime,
  MoreVert,
  FilterList,
  MarkEmailRead,
  DeleteOutline,
  Archive,
} from '@mui/icons-material';

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

export function NotificationsSection() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "treatment",
      icon: <MedicalServices />,
      title: "Surgery Reminder",
      message: "Your knee replacement surgery is scheduled for tomorrow at 7:00 AM",
      time: "2 hours ago",
      urgent: true,
      read: false,
      color: 'error',
    },
    {
      id: 2,
      type: "travel",
      icon: <Flight />,
      title: "Flight Check-in Available",
      message: "Check-in is now open for your Air India flight AI 131 to Delhi",
      time: "4 hours ago",
      urgent: false,
      read: false,
      color: 'info',
    },
    {
      id: 3,
      type: "documents",
      icon: <Description />,
      title: "Lab Results Ready",
      message: "Your pre-surgery blood test results have been reviewed and approved",
      time: "6 hours ago",
      urgent: false,
      read: true,
      color: 'success',
    },
    {
      id: 4,
      type: "chat",
      icon: <Message />,
      title: "New Message from Dr. Kumar",
      message: "Recovery is on track. Please continue following the prescribed medication schedule",
      time: "8 hours ago",
      urgent: false,
      read: false,
      color: 'secondary',
    },
    {
      id: 5,
      type: "treatment",
      icon: <CalendarToday />,
      title: "Appointment Confirmed",
      message: "Your post-op follow-up appointment has been confirmed for Dec 20 at 2:00 PM",
      time: "1 day ago",
      urgent: false,
      read: true,
      color: 'primary',
    },
    {
      id: 6,
      type: "travel",
      icon: <Flight />,
      title: "Hotel Booking Confirmed",
      message: "Your stay at Taj Palace Hotel has been confirmed for 20 nights",
      time: "2 days ago",
      urgent: false,
      read: true,
      color: 'info',
    },
    {
      id: 7,
      type: "documents",
      icon: <Description />,
      title: "Insurance Claim Processed",
      message: "Your travel insurance claim has been approved and processed",
      time: "3 days ago",
      urgent: false,
      read: true,
      color: 'success',
    },
    {
      id: 8,
      type: "chat",
      icon: <Message />,
      title: "Support Ticket Resolved",
      message: "Your question about airport assistance has been resolved",
      time: "4 days ago",
      urgent: false,
      read: true,
      color: 'secondary',
    },
  ]);

  const tabLabels = ['All', 'Unread', 'Medical', 'Travel', 'Documents', 'Messages'];
  const tabTypes = ['all', 'unread', 'treatment', 'travel', 'documents', 'chat'];

  const getTypeLabel = (type) => {
    switch (type) {
      case "treatment":
        return "Medical";
      case "travel":
        return "Travel";
      case "documents":
        return "Documents";
      case "chat":
        return "Messages";
      default:
        return "General";
    }
  };

  const getFilteredNotifications = () => {
    const currentType = tabTypes[tabValue];
    if (currentType === 'all') return notifications;
    if (currentType === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === currentType);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getStats = () => {
    const unread = notifications.filter(n => !n.read).length;
    const medical = notifications.filter(n => n.type === 'treatment').length;
    const travel = notifications.filter(n => n.type === 'travel').length;
    const messages = notifications.filter(n => n.type === 'chat').length;
    return { unread, medical, travel, messages };
  };

  const stats = getStats();

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Notifications
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Stay updated with all your medical and travel alerts
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<MarkEmailRead />}
            onClick={markAllAsRead}
          >
            Mark All as Read
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'error.main' }}>
                    <Circle />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.unread}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unread
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'error.main' }}>
                    <MedicalServices />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.medical}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Medical
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <Flight />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.travel}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Travel
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <Message />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.messages}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Messages
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ width: '100%' }}>
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              width: 'fit-content',
            }}
          >
            {tabLabels.map((label, index) => (
              <Tab key={label} label={label} />
            ))}
          </StyledTabs>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            <Card>
              <CardHeader
                title={`${tabLabels[tabValue]} Notifications`}
                subheader={`${getFilteredNotifications().length} notifications found`}
                action={
                  <IconButton>
                    <FilterList />
                  </IconButton>
                }
              />
              <CardContent sx={{ p: 0 }}>
                <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                  {getFilteredNotifications().map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem
                        sx={{
                          backgroundColor: !notification.read
                            ? alpha(theme.palette.primary.main, 0.04)
                            : 'transparent',
                          borderLeft: !notification.read
                            ? `4px solid ${theme.palette.primary.main}`
                            : 'none',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.action.hover, 0.04),
                          },
                        }}
                      >
                        <ListItemIcon>
                          <Avatar
                            sx={{
                              bgcolor: alpha(theme.palette[notification.color].main, 0.1),
                              color: theme.palette[notification.color].main,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {notification.icon}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {notification.title}
                              </Typography>
                              {notification.urgent && (
                                <Chip
                                  label="Urgent"
                                  color="error"
                                  size="small"
                                  sx={{ height: 20 }}
                                />
                              )}
                              {!notification.read && (
                                <Circle sx={{ fontSize: 12, color: 'primary.main' }} />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {notification.message}
                              </Typography>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Chip
                                  label={getTypeLabel(notification.type)}
                                  variant="outlined"
                                  size="small"
                                  sx={{ height: 20 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {notification.time}
                                </Typography>
                              </Stack>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Stack direction="row" spacing={0.5}>
                            {!notification.read && (
                              <IconButton
                                size="small"
                                onClick={() => markAsRead(notification.id)}
                                sx={{ color: 'success.main' }}
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              size="small"
                              onClick={() => deleteNotification(notification.id)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </Stack>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < getFilteredNotifications().length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
}
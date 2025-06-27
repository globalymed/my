import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  Card,
  CardContent,
  Chip,
  Rating,
  Divider,
  IconButton,
  CircularProgress,
  Tooltip,
  useTheme,
  Container
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
  LocalHospital as DentalIcon,
  Face as CosmeticIcon,
  Favorite as FertilityIcon,
  Psychology as HairIcon
} from '@mui/icons-material';

const FALLBACK_RESPONSE = "I'd like to help you find the right specialist. Could you tell me more about your symptoms or what type of medical treatment you're looking for?";

const MedYatraAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [treatmentDetails, setTreatmentDetails] = useState(null);
  const [bestClinic, setBestClinic] = useState(null);
  const [showExpandedClinicDetails, setShowExpandedClinicDetails] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState({
    medicalIssue: null,
    location: null,
    appointmentDate: null,
    treatmentType: null
  });
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [allParametersCollected, setAllParametersCollected] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const theme = useTheme();

  // Mock function to simulate AI response
  const mockAIResponse = (input, treatmentType = null) => {
    const responses = {
      dental: "I understand you're having dental problems. Can you describe your specific symptoms? Are you experiencing pain, sensitivity, or need a routine checkup? Also, which city would you prefer for treatment?",
      hair: "I see you're experiencing hair loss. Can you tell me more about your hair concerns? How long have you been experiencing this issue? Also, which city would you prefer for treatment?",
      cosmetic: "I understand you're interested in cosmetic treatment. What specific procedure or area are you looking to improve? Also, which city would you prefer for treatment?",
      fertility: "I understand you need fertility consultation. Can you share more details about your situation? Are you looking for general consultation or specific treatments? Also, which city would you prefer for treatment?"
    };

    if (treatmentType && responses[treatmentType]) {
      return responses[treatmentType];
    }

    // Simple keyword detection for demonstration
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('hair') || lowerInput.includes('bald')) {
      return responses.hair;
    } else if (lowerInput.includes('dental') || lowerInput.includes('tooth') || lowerInput.includes('teeth')) {
      return responses.dental;
    } else if (lowerInput.includes('cosmetic') || lowerInput.includes('beauty') || lowerInput.includes('skin')) {
      return responses.cosmetic;
    } else if (lowerInput.includes('fertility') || lowerInput.includes('pregnant') || lowerInput.includes('ivf')) {
      return responses.fertility;
    }

    return FALLBACK_RESPONSE;
  };

  // Mock calendar component
  const MockCalendar = ({ onSelectDate }) => {
    const dates = ['2025-07-01', '2025-07-02', '2025-07-03', '2025-07-05', '2025-07-08'];

    return (
      <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Available Dates:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {dates.map(date => (
            <Button
              key={date}
              size="small"
              variant="outlined"
              onClick={() => onSelectDate(date)}
              sx={{ minWidth: 'auto' }}
            >
              {new Date(date).getDate()}
            </Button>
          ))}
        </Box>
      </Box>
    );
  };

  const quickActions = [
    {
      icon: <DentalIcon />,
      text: "I have dental problems",
      type: "dental",
      color: "#2196F3"
    },
    {
      icon: <HairIcon />,
      text: "I'm experiencing hair loss",
      type: "hair",
      color: "#FF9800"
    },
    {
      icon: <CosmeticIcon />,
      text: "I want cosmetic treatment",
      type: "cosmetic",
      color: "#E91E63"
    },
    {
      icon: <FertilityIcon />,
      text: "I need fertility consultation",
      type: "fertility",
      color: "#4CAF50"
    }
  ];

  const handleQuickAction = (action) => {
    setShowChat(true);
    setMessages([
      { text: "Hello! I'm your MedYatra AI assistant. How can I help you today?", sender: 'ai' },
      { text: action.text, sender: 'user' }
    ]);
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = mockAIResponse(action.text, action.type);
      setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
      setExtractedInfo(prev => ({ ...prev, treatmentType: action.type, medicalIssue: action.text }));
      setLoading(false);
    }, 1500);
  };

  const handleDateSelect = (date) => {
    setMessages(prev => [...prev, {
      text: `I'd like to schedule my appointment on ${date}.`,
      sender: 'user'
    }]);

    setExtractedInfo(prev => ({ ...prev, appointmentDate: date }));
    setShowCalendar(false);

    // Mock clinic recommendation
    setTimeout(() => {
      const clinics = [
        {
          id: 1,
          name: "City Medical Center",
          rating: 4.8,
          location: "Downtown",
          image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop",
          services: ["Consultation", "Treatment", "Follow-up"],
          availability: "Available"
        }
      ];

      setBestClinic(clinics);
      setShowRecommendations(true);
      setMessages(prev => [...prev, {
        text: `Great! I found an excellent clinic available on ${date}. City Medical Center has a 4.8-star rating and specializes in ${extractedInfo.treatmentType} treatments. Would you like to book an appointment?`,
        sender: 'ai'
      }]);
    }, 1000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputValue.trim()) return;

    if (!showChat) {
      setShowChat(true);
      setMessages([{ text: "Hello! I'm your MedYatra AI assistant. How can I help you today?", sender: 'ai' }]);
    }

    setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
    setLoading(true);

    const userInput = inputValue.trim();
    setInputValue('');

    // Simulate AI processing
    setTimeout(() => {
      let response = mockAIResponse(userInput);

      // Check if user provided location
      if (userInput.toLowerCase().includes('delhi') || userInput.toLowerCase().includes('mumbai') ||
        userInput.toLowerCase().includes('bangalore') || userInput.toLowerCase().includes('chennai')) {
        setExtractedInfo(prev => ({ ...prev, location: userInput }));
        response = "Perfect! I have your location. Now, when would you like to schedule your appointment? Please select a date from the calendar below:";
        setShowCalendar(true);
      }

      setMessages(prev => [...prev, {
        text: response,
        sender: 'ai',
        showCalendar: showCalendar || response.includes('calendar')
      }]);
      setLoading(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([]);
    setShowChat(false);
    setSelectedClinic(null);
    setTreatmentDetails(null);
    setBestClinic(null);
    setShowExpandedClinicDetails(false);
    setShowRecommendations(false);
    setExtractedInfo({
      medicalIssue: null,
      location: null,
      appointmentDate: null,
      treatmentType: null
    });
    setAllParametersCollected(false);
    setShowCalendar(false);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  if (!showChat) {
    return (
      <Container maxWidth="md" sx={{ py: 8, minHeight: '100vh' , display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 2
            }}
          >
            How can I help you today?
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            maxWidth: 600,
            mx: 'auto'
          }}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => handleQuickAction(action)}
                sx={{
                  px: 2,
                  borderRadius: 8,
                  border: '2px solid',
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: action.color,
                    bgcolor: `${action.color}08`,
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                <Box sx={{ color: action.color, display: 'flex' }}>
                  {action.icon}
                </Box>
                {action.text}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 8,
              border: '2px solid',
              borderColor: 'rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              bgcolor: 'background.paper'
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                gap: 1
              }}
            >
              <IconButton sx={{ color: 'text.secondary' }}>
                <AttachFileIcon />
              </IconButton>

              <TextField
                fullWidth
                variant="standard"
                placeholder="Describe your symptoms or medical needs..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '1.1rem',
                    px: 1
                  }
                }}
              />

              <IconButton sx={{ color: 'text.secondary' }}>
                <MicIcon />
              </IconButton>

              <IconButton
                type="submit"
                disabled={!inputValue.trim()}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)',
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '80vh',
      overflowY: 'auto',
      maxWidth: 800,
      mx: 'auto',
      p: 2,
      gap: 2
    }}>
      <Paper
        elevation={0}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          bgcolor: 'background.paper',
          overflow: 'hidden'
        }}
      >
        <Box
          ref={chatRef}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                display: 'flex',
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: 1.5
              }}
            >
              <Avatar
                sx={{
                  bgcolor: message.sender === 'user' ? theme.palette.secondary.main : theme.palette.primary.main,
                  width: 36,
                  height: 36
                }}
              >
                {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
              </Avatar>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: message.sender === 'user'
                    ? theme.palette.secondary.light
                    : theme.palette.background.default,
                  color: 'text.primary',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                  position: 'relative'
                }}
              >
                <Typography variant="body1">
                  {message.text}
                </Typography>
                {message.sender === 'ai' && message.showCalendar && (
                  <MockCalendar onSelectDate={handleDateSelect} />
                )}
              </Paper>
            </Box>
          ))}

          {loading && (
            <Box
              sx={{
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 36,
                  height: 36
                }}
              >
                <SmartToyIcon />
              </Avatar>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: theme.palette.background.default,
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} thickness={5} />
                  <Typography variant="body2" color="text.secondary">
                    Thinking...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>

        <Divider />

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            display: 'flex',
            gap: 1,
            bgcolor: 'rgba(0, 0, 0, 0.02)'
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Describe your symptoms or health concerns..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            InputProps={{
              sx: {
                borderRadius: 3,
                bgcolor: 'background.paper'
              }
            }}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!inputValue.trim() || loading}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
              }
            }}
          >
            <SendIcon />
          </IconButton>
          <IconButton
            color="primary"
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.08)',
            }}
          >
            <MicIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Clinic recommendations section */}
      {/* {showRecommendations && bestClinic && (
        <Box sx={{ mt: 3, p: 3, bgcolor: 'background.paper', borderRadius: 3, boxShadow: theme.shadows[1] }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <InfoOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Based on your symptoms and availability, here are the best clinics for your needs
            </Typography>
          </Box>

          {bestClinic.map((clinic, index) => (
            <Card key={clinic.id || index} sx={{ mb: 3, overflow: 'hidden', borderRadius: 2, boxShadow: theme.shadows[2] }}>
              <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                <Box
                  component="img"
                  src={clinic.image}
                  alt={clinic.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                    color: 'white',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">{clinic.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating value={clinic.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2">{clinic.rating || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Box>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Location: {clinic.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Availability: {clinic.availability || 'Contact for availability'}
                  </Typography>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Services:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {(clinic.services || []).map((service, serviceIndex) => (
                    <Chip
                      key={serviceIndex}
                      label={service}
                      size="small"
                      sx={{
                        bgcolor: `${theme.palette.primary.main}15`,
                        color: theme.palette.primary.main,
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    color="primary"
                    startIcon={<InfoOutlinedIcon />}
                    onClick={() => setShowExpandedClinicDetails(!showExpandedClinicDetails)}
                  >
                    {showExpandedClinicDetails ? 'Less' : 'More'}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                  >
                    Book Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )} */}
    </Box>
  );
};

export default MedYatraAIChat;
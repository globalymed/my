import React, { useState, useEffect, useRef } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  IconButton, 
  CircularProgress, 
  Avatar, 
  Chip,
  Tooltip,
  Divider,
  useTheme,
  Card,
  CardContent,
  Rating
} from '@mui/material';
import './AIChat.css';
import ClinicRecommender from './ClinicRecommenderEnhanced';
import TreatmentsInfo from './TreatmentsInfo';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { createChatSession, sendMessage, extractMedicalInfo, determineTreatmentType } from '../services/geminiService';

const FALLBACK_RESPONSE = "I'd like to help you find the right specialist. Could you tell me more about your symptoms or what type of medical treatment you're looking for?";

const AIChatFinal = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your MedYatra AI assistant. We currently offer specialized treatments in four areas: Hair Restoration, Dental Care, Cosmetic Procedures, and IVF/Fertility. Please describe your symptoms or medical needs, and I'll help you find the right clinic.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [treatmentDetails, setTreatmentDetails] = useState(null);
  const [bestClinic, setBestClinic] = useState(null);
  const [showExpandedClinicDetails, setShowExpandedClinicDetails] = useState(false);
  const [showTreatmentsInfo, setShowTreatmentsInfo] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [extractedInfo, setExtractedInfo] = useState({
    medicalIssue: null,
    location: null,
    appointmentDate: null,
    treatmentType: null
  });
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const theme = useTheme();

  // Initialize Gemini chat session
  useEffect(() => {
    const initializeChat = async () => {
      try {
        console.log("Initializing Gemini chat session...");
        const session = await createChatSession();
        console.log("Chat session initialized:", !!session);
        setChatSession(session);
      } catch (error) {
        console.error("Failed to initialize chat session:", error);
      }
    };
    
    initializeChat();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input field after sending a message
  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [loading, messages]);

  // Process the conversation to extract information
  useEffect(() => {
    const processConversation = async () => {
      if (messages.length < 3) return; // Need at least one user message and one AI response
      
      // Create a string representation of the conversation
      const conversationText = messages
        .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
        .join('\n');
      
      try {
        const info = await extractMedicalInfo(conversationText);
        setExtractedInfo(info);
        
        // If we have enough information, show clinic recommendations
        if (info.treatmentType && info.medicalIssue) {
          // Set treatment details based on extracted information
          setTreatmentDetails({
            treatmentType: info.treatmentType,
            symptoms: info.medicalIssue,
            duration: info.appointmentDate || "As soon as possible",
            location: info.location || "Any location"
          });
          
          // Select the best clinic based on the treatment type
          const clinic = await selectBestClinic(info.treatmentType);
          if (clinic) {
            setBestClinic(clinic);
            setShowRecommendations(true);
          }
        }
      } catch (error) {
        console.error("Error processing conversation:", error);
      }
    };
    
    processConversation();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const sanitizedInput = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { text: sanitizedInput, sender: 'user' }]);
    
    setLoading(true);
    
    try {
      let aiResponse;
      
      if (chatSession) {
        // Use Gemini API for response
        console.log("Using Gemini API for response");
        aiResponse = await sendMessage(chatSession, sanitizedInput);
        
        // If we got a fallback response, try to determine if this is a symptom and provide a more specific response
        if (aiResponse === FALLBACK_RESPONSE) {
          const symptomType = determineTreatmentType(sanitizedInput);
          if (symptomType) {
            console.log("Detected symptom type:", symptomType);
            aiResponse = `I see you're mentioning symptoms related to ${symptomType} treatment. Could you tell me more about your specific concerns? This will help me find the best clinic for you.`;
          }
        }
      } else {
        // Fallback if chat session isn't available
        console.log("No chat session available, using fallback response");
        
        // Try to determine if this is a symptom and provide a more specific response
        const symptomType = determineTreatmentType(sanitizedInput);
        if (symptomType) {
          console.log("Detected symptom type:", symptomType);
          aiResponse = `I see you're mentioning symptoms related to ${symptomType} treatment. Could you tell me more about your specific concerns? This will help me find the best clinic for you.`;
        } else {
          aiResponse = FALLBACK_RESPONSE;
        }
      }
      
      // Check if the response is a fallback or error message
      if (aiResponse.includes("having trouble") || aiResponse.includes("error")) {
        // Try to provide a more helpful response based on detected symptoms
        const detectedType = determineTreatmentType(sanitizedInput);
        
        if (detectedType) {
          let specializedResponse = "";
          
          switch (detectedType) {
            case 'cosmetic':
              specializedResponse = `I see you're mentioning symptoms related to skin or cosmetic concerns. Would you like me to recommend a cosmetic clinic for your condition?`;
              break;
            case 'hair':
              specializedResponse = `I see you're mentioning hair-related concerns. Our hair restoration clinics offer treatments for hair loss, thinning hair, and various scalp conditions. Would you like me to recommend a hair treatment specialist for you?`;
              break;
            case 'dental':
              specializedResponse = `I see you're mentioning symptoms related to dental issues. Would you like me to recommend a dental clinic for your condition?`;
              break;
            case 'ivf':
              specializedResponse = `I see you're mentioning fertility-related concerns. Would you like me to recommend an IVF clinic for your needs?`;
              break;
            default:
              specializedResponse = "";
          }
          
          if (specializedResponse) {
            aiResponse = specializedResponse;
            
            // Update medical info
            setExtractedInfo(prevInfo => ({
              ...prevInfo,
              medicalIssue: sanitizedInput,
              treatmentType: detectedType
            }));
          }
        } else if (sanitizedInput.toLowerCase().includes("rash") || sanitizedInput.toLowerCase().includes("rashes")) {
          // Special handling for rashes since they're common
          aiResponse = "I see you're mentioning rashes, which are typically treated by our cosmetic specialists. Would you like me to recommend a cosmetic clinic for your skin condition?";
          
          // Update medical info
          setExtractedInfo(prevInfo => ({
            ...prevInfo,
            medicalIssue: "rashes",
            treatmentType: "cosmetic"
          }));
        } else if (sanitizedInput.toLowerCase().includes("hair") || 
                  sanitizedInput.toLowerCase().includes("bald") || 
                  sanitizedInput.toLowerCase().includes("scalp")) {
          // Special handling for hair issues
          aiResponse = "I understand you're having hair-related concerns. Our hair restoration clinics offer treatments for hair loss, thinning hair, and various scalp conditions. Would you like me to recommend a hair treatment specialist for you?";
          
          // Update medical info
          setExtractedInfo(prevInfo => ({
            ...prevInfo,
            medicalIssue: sanitizedInput,
            treatmentType: "hair"
          }));
        }
      }
      
      // Add AI response to chat
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Add error message
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting to my brain right now. Please try again in a moment.", 
        sender: 'ai' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    // Reset all states
    setMessages([
      { text: "Hello! I'm your MedYatra AI assistant. We currently offer specialized treatments in four areas: Hair Restoration, Dental Care, Cosmetic Procedures, and IVF/Fertility. Please describe your symptoms or medical needs, and I'll help you find the right clinic.", sender: 'ai' }
    ]);
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
    
    // Reinitialize chat session
    const initializeChat = async () => {
      try {
        console.log("Reinitializing Gemini chat session...");
        const session = await createChatSession();
        console.log("Chat session reinitialized:", !!session);
        setChatSession(session);
      } catch (error) {
        console.error("Failed to initialize chat session:", error);
      }
    };
    
    initializeChat();
  };

  const selectBestClinic = async (treatmentType) => {
    // Sample clinics data (in a real app, this would come from a database or API)
    const clinics = {
      ivf: {
        name: "Fertility Plus",
        rating: 4.8,
        location: "Mumbai",
        distance: "3.2 km away",
        availability: "Next available: Tomorrow, 10:00 AM",
        services: ["IVF Treatment", "Fertility Consultation", "Embryo Freezing", "Surrogacy"],
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      cosmetic: {
        name: "Beauty & Beyond Clinic",
        rating: 4.7,
        location: "Delhi",
        distance: "2.5 km away",
        availability: "Next available: Today, 4:30 PM",
        services: ["Botox", "Dermal Fillers", "Rhinoplasty", "Liposuction"],
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      hair: {
        name: "Hair Restoration Center",
        rating: 4.6,
        location: "Bangalore",
        distance: "4.1 km away",
        availability: "Next available: Friday, 11:00 AM",
        services: ["Hair Transplant", "PRP Therapy", "Scalp Micropigmentation", "Hair Loss Treatment"],
        image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      dental: {
        name: "Smile Dental Care",
        rating: 4.9,
        location: "Chennai",
        distance: "1.8 km away",
        availability: "Next available: Tomorrow, 2:00 PM",
        services: ["Root Canal", "Dental Implants", "Teeth Whitening", "Orthodontics"],
        image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      }
    };
    
    return clinics[treatmentType] || null;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      maxWidth: 800,
      mx: 'auto',
      p: 2,
      gap: 2
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.primary.main,
              width: 48,
              height: 48
            }}
          >
            <SmartToyIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 0.5 }}>
              MedYatra AI Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Describe your symptoms and I'll help find the right specialist for you
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Clear conversation">
          <span>
            <IconButton 
              onClick={clearChat}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Paper>
      
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
                    ? `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`
                    : theme.palette.background.default,
                  color: message.sender === 'user' ? 'black' : 'text.primary',
                  border: '1px solid',
                  borderColor: message.sender === 'user' 
                    ? theme.palette.secondary.dark 
                    : 'rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                  '&::after': message.sender === 'user' ? {
                    content: '""',
                    position: 'absolute',
                    top: 12,
                    right: -8,
                    width: 0,
                    height: 0,
                    border: '8px solid transparent',
                    borderLeftColor: theme.palette.secondary.dark,
                    borderRight: 0,
                    marginRight: -8,
                  } : {
                    content: '""',
                    position: 'absolute',
                    top: 12,
                    left: -8,
                    width: 0,
                    height: 0,
                    border: '8px solid transparent',
                    borderRightColor: theme.palette.background.default,
                    borderLeft: 0,
                    marginLeft: -8,
                  }
                }}
              >
                <Typography variant="body1">
                  {message.text}
                </Typography>
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            inputRef={inputRef}
            InputProps={{
              sx: { 
                borderRadius: 3,
                bgcolor: 'background.paper',
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
                }
              }
            }}
          />
          <Tooltip title="Send message">
            <span> {/* Span wrapper to fix MUI Tooltip issue with disabled buttons */}
              <IconButton 
                type="submit" 
                color="primary" 
                disabled={!input.trim() || loading}
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
            </span>
          </Tooltip>
          <Tooltip title="Voice input (coming soon)">
            <span> {/* Span wrapper to fix MUI Tooltip issue */}
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
            </span>
          </Tooltip>
        </Box>
      </Paper>

      {showRecommendations && treatmentDetails && bestClinic && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.08)',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
              Best Clinic For You
            </Typography>
            <Chip 
              label={treatmentDetails.treatmentType.charAt(0).toUpperCase() + treatmentDetails.treatmentType.slice(1)} 
              color="primary" 
              sx={{ fontWeight: 600 }}
            />
          </Box>
          
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <InfoOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Based on your symptoms and availability, this clinic is the best match for your needs
            </Typography>
          </Box>
          
          <Card sx={{ mb: 3, overflow: 'hidden', borderRadius: 2, boxShadow: theme.shadows[2] }}>
            <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
              <Box 
                component="img"
                src={bestClinic.image}
                alt={bestClinic.name}
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
                <Typography variant="h6" fontWeight="bold">{bestClinic.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={bestClinic.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2">{bestClinic.rating}</Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Location: {bestClinic.location} ({bestClinic.distance})
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Availability: {bestClinic.availability}
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Services:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {bestClinic.services.map((service, index) => (
                  <Chip 
                    key={index}
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
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    mt: 1, 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    flex: 1
                  }}
                >
                  Book Appointment
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setShowExpandedClinicDetails(prev => !prev)}
                  sx={{ 
                    mt: 1, 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  {showExpandedClinicDetails ? 'Less' : 'More'}
                </Button>
              </Box>
            </CardContent>
            
            {showExpandedClinicDetails && (
              <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                <Typography variant="h6" gutterBottom>Detailed Information</Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>About the Clinic</Typography>
                  <Typography variant="body2" paragraph>
                    {bestClinic.name} is a premier healthcare facility specializing in {treatmentDetails.treatmentType} treatments. 
                    With state-of-the-art equipment and experienced specialists, they provide personalized care 
                    tailored to each patient's unique needs.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Doctors</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 50, height: 50 }}>{bestClinic.name[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle2">Dr. Rajesh Sharma</Typography>
                        <Typography variant="body2" color="text.secondary">Senior Specialist, 15+ years experience</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 50, height: 50 }}>A</Avatar>
                      <Box>
                        <Typography variant="subtitle2">Dr. Anjali Patel</Typography>
                        <Typography variant="body2" color="text.secondary">Consultant, 10+ years experience</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Facilities</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['Modern Equipment', 'Comfortable Waiting Area', 'Parking Available', 'Wheelchair Accessible', 'Digital Records'].map((facility, index) => (
                      <Chip 
                        key={index}
                        label={facility}
                        size="small"
                        sx={{ 
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'rgba(0, 0, 0, 0.12)'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Patient Reviews</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2">Rahul M.</Typography>
                        <Rating value={5} readOnly size="small" />
                      </Box>
                      <Typography variant="body2">
                        "Excellent care and very professional staff. The doctor took time to explain everything clearly."
                      </Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2">Priya S.</Typography>
                        <Rating value={4} readOnly size="small" />
                      </Box>
                      <Typography variant="body2">
                        "Very satisfied with my treatment results. The facility is clean and modern. Would recommend."
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Insurance & Payment</Typography>
                  <Typography variant="body2" paragraph>
                    This clinic accepts all major insurance providers and offers flexible payment plans. 
                    They also provide cashless treatment options for select insurance partners.
                  </Typography>
                </Box>
              </Box>
            )}
          </Card>
        </Paper>
      )}
      
      {/* Render TreatmentsInfo dialog when showTreatmentsInfo is true */}
      <TreatmentsInfo 
        open={showTreatmentsInfo} 
        onClose={() => setShowTreatmentsInfo(false)} 
      />
    </Box>
  );
};

export default AIChatFinal;

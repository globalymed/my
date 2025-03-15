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
import { getClinicsByTreatmentType } from '../firebase';

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
  const [allParametersCollected, setAllParametersCollected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  // Process the conversation to extract information but DON'T add AI responses directly
  useEffect(() => {
    // Skip processing if we're already in the middle of handling a response
    // or if the last message is from the AI (not the user)
    const lastMessage = messages[messages.length - 1];
    if (isProcessing || (lastMessage && lastMessage.sender === 'ai')) {
      return;
    }
    
    const processConversation = async () => {
      try {
        // Set processing flag to prevent infinite loops
        setIsProcessing(true);
        
        // Only process if we have at least 2 messages (AI greeting + user response)
        // AND if the last message is from the user (not the AI)
        if (messages.length < 2 || lastMessage.sender !== 'user') {
          setIsProcessing(false);
          return;
        }
        
        // Extract medical information from the conversation
        const info = await extractMedicalInfo(messages);
        console.log("Extracted medical info:", info);
        
        // Update the extracted info state
        setExtractedInfo(info);
        
        // Check if we have enough information to recommend a clinic
        const hasAllParameters = !!info.treatmentType && !!info.medicalIssue && !!info.location;
        setAllParametersCollected(hasAllParameters);
        
        if (hasAllParameters) {
          console.log("All parameters collected, ready to recommend clinic");
          // Set treatment details based on extracted information
          setTreatmentDetails({
            treatmentType: info.treatmentType,
            symptoms: info.medicalIssue,
            duration: info.appointmentDate || 'As soon as possible',
            location: info.location
          });
          
          // Select the best clinic based on the treatment type and location
          const clinic = await selectBestClinic(info.treatmentType, info.location);
          if (clinic) {
            console.log("Found best clinic:", clinic);
            setBestClinic(clinic);
            setShowRecommendations(true);
            
            // DO NOT add a message here - let the Gemini API handle responses
            // The clinic recommendations will be shown in the UI separately
          } else {
            console.log("No clinic found for the given parameters");
            // DO NOT add a message here - let the Gemini API handle responses
          }
        } else {
          console.log("Not all parameters collected yet, continuing conversation");
          // Reset recommendations if parameters are incomplete
          if (showRecommendations) {
            setShowRecommendations(false);
            setBestClinic(null);
          }
          
          // DO NOT add hardcoded AI messages here - the Gemini API will handle responses
          // Just log the missing info for debugging
          if (!info.medicalIssue) {
            console.log("Missing medical issue, Gemini should ask the user");
          } else if (!info.location) {
            console.log("Missing location, Gemini should ask the user");
          } else if (!info.treatmentType) {
            console.log("Missing treatment type, determining from medical issue");
            // Try to determine treatment type from medical issue
            const inferredType = determineTreatmentType(info.medicalIssue);
            if (inferredType) {
              console.log("Inferred treatment type:", inferredType);
              setExtractedInfo(prev => ({ ...prev, treatmentType: inferredType }));
              
              // Now process with the inferred treatment type
              const clinic = await selectBestClinic(inferredType, info.location);
              if (clinic) {
                console.log("Found clinic with inferred treatment type:", clinic);
                setTreatmentDetails({
                  treatmentType: inferredType,
                  symptoms: info.medicalIssue,
                  duration: info.appointmentDate || 'As soon as possible',
                  location: info.location
                });
                setBestClinic(clinic);
                setShowRecommendations(true);
                
                // DO NOT add a message here - let the Gemini API handle responses
              }
            }
          }
        }
      } catch (error) {
        console.error("Error processing conversation:", error);
      } finally {
        // Always reset the processing flag when done
        setIsProcessing(false);
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

      // Check if we found a clinic first
      const info = extractedInfo;
      const clinicInfo = bestClinic ? {
        name: bestClinic.name,
        location: bestClinic.location,
        treatment: bestClinic.treatmentType || (info && info.treatmentType),
        issue: info && info.medicalIssue
      } : null;
      
      if (chatSession) {
        // Use Gemini API for response
        console.log("Using Gemini API for response");
        console.log("Current extracted info:", info);
        console.log("Clinic info:", clinicInfo);
        
        // Send conversation context to Gemini including clinic details if available
        let context = "";
        if (clinicInfo) {
          context = `You've helped the user find a clinic called ${clinicInfo.name} in ${clinicInfo.location} for their ${clinicInfo.treatment} treatment. Remember to keep your response brief and focused on their medical issue: ${clinicInfo.issue}.`;
        } else if (info) {
          // We have some extracted info but not a full clinic match yet
          if (info.medicalIssue && !info.location) {
            context = `The user has mentioned they have an issue with: ${info.medicalIssue}. Ask them which city they prefer for treatment. Keep your response brief and friendly.`;
          } else if (info.medicalIssue && info.location && !info.treatmentType) {
            context = `The user has mentioned they have an issue with: ${info.medicalIssue} and they want treatment in ${info.location}. Ask any follow-up questions needed to recommend a clinic. Keep your response brief.`;
          }
        }
        
        // Send the context along with the user's message
        aiResponse = await sendMessage(chatSession, sanitizedInput, context);
        
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
      
      // Add AI response to chat
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
      
    } catch (error) {
      console.error("Error in AI response:", error);
      setMessages(prev => [...prev, { 
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.", 
        sender: 'ai' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    // Reset chat to initial state
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
    setAllParametersCollected(false);
    
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

  const selectBestClinic = async (treatmentType, location) => {
    try {
      console.log(`Searching for clinics with treatment type: ${treatmentType}, location: ${location}`);
      
      // Query Firestore database for clinics matching treatment type and location
      const clinics = await getClinicsByTreatmentType(treatmentType, location);
      
      if (clinics && clinics.length > 0) {
        console.log(`Found ${clinics.length} clinics matching criteria`);
        
        // Sort by rating (highest first)
        const sortedClinics = clinics.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        // Get the top clinic
        const topClinic = sortedClinics[0];
        
        // Add any missing properties needed for UI rendering
        const enhancedClinic = {
          ...topClinic,
          services: topClinic.services || ['Consultation', 'Treatment', 'Follow-up'],
          availability: topClinic.availability || 'Contact for availability',
          distance: topClinic.distance || 'Nearby',
          rating: topClinic.rating || 4.5,
          treatmentType: topClinic.treatmentType || treatmentType
        };
        
        // Log the clinic name to the console as requested
        console.log(`MATCHED CLINIC: ${enhancedClinic.name} (${enhancedClinic.location}) - Specializes in ${treatmentType}`);
        console.log('Clinic details:', enhancedClinic);
        
        return enhancedClinic;
      }
      
      // If no clinics found with the specific location, try just by treatment type
      if ((!clinics || clinics.length === 0) && location) {
        console.log(`No clinics found for ${treatmentType} in ${location}, searching without location filter`);
        const allClinics = await getClinicsByTreatmentType(treatmentType);
        
        if (allClinics && allClinics.length > 0) {
          console.log(`Found ${allClinics.length} clinics for ${treatmentType} without location filter`);
          
          // Sort by rating (highest first)
          const sortedClinics = allClinics.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          
          // Get the top clinic
          const topClinic = sortedClinics[0];
          
          // Add any missing properties needed for UI rendering
          const enhancedClinic = {
            ...topClinic,
            services: topClinic.services || ['Consultation', 'Treatment', 'Follow-up'],
            availability: topClinic.availability || 'Contact for availability',
            distance: topClinic.distance || 'Nearby',
            rating: topClinic.rating || 4.5,
            treatmentType: topClinic.treatmentType || treatmentType
          };
          
          // Log the clinic name to the console, noting it's not an exact location match
          console.log(`FALLBACK CLINIC MATCH: ${enhancedClinic.name} (${enhancedClinic.location}) - Specializes in ${treatmentType}`);
          console.log('Note: This clinic matches the treatment type but not the exact location');
          console.log('Clinic details:', enhancedClinic);
          
          return enhancedClinic;
        }
      }
      
      console.log(`No clinics found for treatment type: ${treatmentType}`);
      return null;
    } catch (error) {
      console.error("Error selecting best clinic:", error);
      return null;
    }
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
                  <Typography variant="body2">{bestClinic.rating || 'N/A'}</Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Location: {bestClinic.location} {bestClinic.distance ? `(${bestClinic.distance})` : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Availability: {bestClinic.availability || 'Contact for availability'}
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Services:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {(bestClinic.services || []).map((service, index) => (
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
                    {bestClinic.name} is a premier healthcare facility specializing in {treatmentDetails?.treatmentType || 'specialized'} treatments. 
                    With state-of-the-art equipment and experienced specialists, they provide personalized care 
                    tailored to each patient's unique needs.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Doctors</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 50, height: 50 }}>{bestClinic.name ? bestClinic.name[0] : 'D'}</Avatar>
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

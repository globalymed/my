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
  CardMedia,
  Chip,
  Rating,
  Divider,
  IconButton,
  CircularProgress,
  Fade,
  Alert,
  Collapse,
  Tooltip,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './AIChat.css';
import ClinicRecommender from './ClinicRecommenderEnhanced';
import TreatmentsInfo from './TreatmentsInfo';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { createChatSession, sendMessage, extractMedicalInfo, determineTreatmentType, generateCalendarResponse } from '../services/geminiService';
import { getClinicsByTreatmentType, getAvailability } from '../firebase';
import ChatCalendarComponent from './CalendarComponent';
import { format } from 'date-fns';

const FALLBACK_RESPONSE = "I'd like to help you find the right specialist. Could you tell me more about your symptoms or what type of medical treatment you're looking for?";

const AIChatFinal = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your MedYatra AI assistant. We currently offer specialized treatments in four areas: Hair, Dental Care, Cosmetic Procedures, and IVF/Fertility. Please describe your symptoms or medical needs, and I'll help you find the right clinic.", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
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
  const [showCalendar, setShowCalendar] = useState(false);
  
  const theme = useTheme();
  const navigate = useNavigate();

  // Initialize chat session
  useEffect(() => {
    const initializeChatSession = async () => {
      try {
        console.log("Initializing chat session");
        const session = await createChatSession();
        
        if (session) {
          console.log("Chat session initialized successfully");
          setChatSession(session);
        } else {
          console.error("Failed to initialize chat session - null session returned");
          
          // Even though we don't have a chat session, we can still show the UI
          // We'll fall back to local processing when the user sends messages
        }
      } catch (error) {
        console.error("Error initializing chat session:", error);
        
        // Even on error, we'll show the UI and use local fallbacks
      }
    };
    
    initializeChatSession();
  }, []);

  // Special function for hair loss detection which was causing errors
  const detectHairIssue = (inputText) => {
    if (!inputText) return false;
    
    const lowerText = inputText.toLowerCase();
    return lowerText.includes('hair loss') || 
           lowerText.includes('hair fall') || 
           lowerText.includes('bald') || 
           lowerText.includes('hair thinning') ||
           lowerText.includes('receding') ||
           lowerText.includes('hair problem');
  };

  // Add AI message with enhanced fallback handling
  const addAIResponseWithCalendar = (response) => {
    // If we're dealing with hair issues but got a generic fallback,
    // override with a more specific hair loss response
    if (response === FALLBACK_RESPONSE && 
        (extractedInfo.medicalIssue?.toLowerCase().includes('hair') || 
         detectHairIssue(inputValue))) {
      console.log("Detected hair issue, providing specialized response");
      
      // Update extractedInfo
      setExtractedInfo(prev => ({
        ...prev,
        medicalIssue: 'hair loss',
        treatmentType: 'hair'
      }));
      
      // Provide a specific response for hair issues
      response = "I understand you're experiencing hair loss. Our Hair specialists can help. Could you tell me which city you'd prefer for treatment?";
    }
    
    // If we have medical issue and location but no date, show calendar with any message about dates
    if (extractedInfo.medicalIssue && extractedInfo.location && !extractedInfo.appointmentDate) {
      console.log("Location provided but no appointment date - showing calendar directly");
      setShowCalendar(true);
      
      // First check if the response is asking about dates
      const isDateRequest = response.toLowerCase().includes("date") || 
                           response.toLowerCase().includes("appointment") || 
                           response.toLowerCase().includes("schedule") ||
                           response.toLowerCase().includes("when") ||
                           response.toLowerCase().includes("calendar");
      
      if (isDateRequest) {
        // If it's a date request, use the original response but add the calendar
        setMessages(prev => [...prev, { 
          text: response,
          sender: 'ai', 
          showCalendar: true 
        }]);
      } else {
        // If it's not asking about dates, override with a date request that includes the calendar
        const treatmentDesc = extractedInfo.treatmentType || determineTreatmentType(extractedInfo.medicalIssue) || "treatment";
        const calendarMessage = `Please select your preferred appointment date for ${treatmentDesc} in ${extractedInfo.location}. The calendar below shows real-time availability:
• Green dates indicate days when clinics are available
• Red dates indicate days when no clinics are available
• You can only select available (green) dates`;
        
        setMessages(prev => [...prev, { 
          text: calendarMessage,
          sender: 'ai', 
          showCalendar: true 
        }]);
      }
      
      // Make sure to set this flag to show the calendar
      setShowCalendar(true);
    } else {
      // Regular message without calendar
      setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
    }
    setLoading(false);
  };

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
        
        // Check if we need to show calendar after the user provided location
        if (info.medicalIssue && info.location && !info.appointmentDate) {
          console.log("Location provided but no appointment date - showing calendar directly");
          setShowCalendar(true);
          
          // Add an AI message with the calendar component
          setMessages(prev => [...prev, { 
            text: "When would you like to schedule your appointment? Please select a date from the calendar below:", 
            sender: 'ai', 
            showCalendar: true 
          }]);
          
          setIsProcessing(false);
          return;
        }
        
        // Check if we have enough information to recommend a clinic
        const hasAllParameters = !!info.treatmentType && !!info.medicalIssue && !!info.location && !!info.appointmentDate;
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
          
          // Select the best clinic based on the treatment type, location, and date
          const clinics = await selectBestClinic(info.treatmentType, info.location, info.appointmentDate);
          if (clinics && clinics.length > 0) {
            console.log("Found clinics:", clinics);
            setBestClinic(clinics);
            setShowRecommendations(true);
            
            // DO NOT add a message here - let the Gemini API handle responses
            // The clinic recommendations will be shown in the UI separately
          } else {
            console.log("No clinic found for the given parameters");
            // Add message that no clinics are available for the selected date
            setMessages(prev => [...prev, { 
              text: `I'm sorry, but there are no clinics available in ${info.location} for ${info.treatmentType} treatment on ${info.appointmentDate}. Would you like to try another date or location?`, 
              sender: 'ai' 
            }]);
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
          } else if (!info.appointmentDate) {
            console.log("Missing appointment date, should show calendar");
          } else if (!info.treatmentType) {
            console.log("Missing treatment type, determining from medical issue");
            // Try to determine treatment type from medical issue
            const inferredType = determineTreatmentType(info.medicalIssue);
            if (inferredType) {
              console.log("Inferred treatment type:", inferredType);
              setExtractedInfo(prev => ({ ...prev, treatmentType: inferredType }));
              
              // Now process with the inferred treatment type
              const clinic = await selectBestClinic(
                inferredType,
                info.location,
                info.appointmentDate
              );
              if (clinic) {
                console.log("Found clinic with inferred treatment type:", clinic);
                setTreatmentDetails({
                  treatmentType: inferredType,
                  symptoms: info.medicalIssue,
                  duration: info.appointmentDate,
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

  // Handle date selection from the calendar
  const handleDateSelect = async (date) => {
    console.log("Selected available date:", date);
    
    // Update the extracted info with the selected date
    const updatedInfo = { 
      ...extractedInfo, 
      appointmentDate: date 
    };
    setExtractedInfo(updatedInfo);
    
    // Add a user message showing the selected date
    setMessages(prev => [...prev, { 
      text: `I'd like to schedule my appointment on ${date}.`, 
      sender: 'user' 
    }]);
    
    // Set loading to show a response is coming
    setLoading(true);
    
    // Now check for clinic availability immediately rather than waiting for the next message cycle
    try {
      if (updatedInfo.treatmentType || determineTreatmentType(updatedInfo.medicalIssue)) {
        const treatmentType = updatedInfo.treatmentType || determineTreatmentType(updatedInfo.medicalIssue);
        console.log("All parameters collected, searching for clinic now...");
        
        // Set treatment details based on extracted information
        setTreatmentDetails({
          treatmentType: treatmentType,
          symptoms: updatedInfo.medicalIssue,
          duration: date,
          location: updatedInfo.location
        });
        
        // Select the best clinics based on all parameters (now returns an array)
        const clinics = await selectBestClinic(
          treatmentType, 
          updatedInfo.location, 
          date
        );
        
        // Also check for alternative dates (next 7 days) if no clinic is available on the selected date
        let alternativeDates = [];
        
        if (!clinics || clinics.length === 0) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          // Check next 7 days for availability
          for (let i = 1; i <= 7; i++) {
            const nextDate = new Date(tomorrow);
            nextDate.setDate(tomorrow.getDate() + i);
            const formattedNextDate = format(nextDate, 'yyyy-MM-dd');
            
            const alternativeClinic = await selectBestClinic(
              treatmentType,
              updatedInfo.location,
              formattedNextDate
            );
            
            if (alternativeClinic && alternativeClinic.length > 0) {
              alternativeDates.push({
                date: formattedNextDate,
                formattedDate: format(nextDate, 'EEE, MMM d, yyyy')
              });
              
              // Limit to 3 alternative dates
              if (alternativeDates.length >= 3) break;
            }
          }
        }
        
        // Add a short delay to ensure messages appear in proper sequence
        setTimeout(() => {
          if (clinics && clinics.length > 0) {
            console.log("Found available clinic:", clinics[0]);
            setBestClinic(clinics); // Now storing an array of clinics
            setShowRecommendations(true);
            setAllParametersCollected(true);
            
            // Add clinic recommendation message
            const clinicCount = clinics.length;
            const clinicNames = clinics.map(c => c.name).join(", ");
            
            setMessages(prev => [...prev, { 
              text: `Great news! I've found ${clinicCount} ${clinicCount === 1 ? 'clinic' : 'clinics'} that match your requirements in ${updatedInfo.location} for your ${treatmentType} needs. ${clinicCount === 1 ? 'This clinic is' : 'These clinics are'} available on ${date}: ${clinicNames}. Would you like more information about ${clinicCount === 1 ? 'this clinic' : 'these clinics'}?`, 
              sender: 'ai' 
            }]);
          } else {
            console.log("No available clinics found for the selected date and location");
            
            if (alternativeDates.length > 0) {
              // Suggest alternative dates
              const alternativesText = alternativeDates
                .map(alt => alt.formattedDate)
                .join(", ");
                
              setMessages(prev => [...prev, { 
                text: `I'm sorry, but there are no clinics available in ${updatedInfo.location} for ${treatmentType} treatment on ${date}. However, I found availability on the following dates: ${alternativesText}. Would you like to select one of these dates instead?`, 
                sender: 'ai',
                alternativeDates: alternativeDates // Store alternative dates in the message
              }]);
            } else {
              // No alternatives found
              setMessages(prev => [...prev, { 
                text: `I'm sorry, but there are no clinics available in ${updatedInfo.location} for ${treatmentType} treatment on ${date} or the next 7 days. Would you like to try a different location or treatment type?`, 
                sender: 'ai' 
              }]);
            }
          }
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error processing date selection:", error);
      setLoading(false);
      setMessages(prev => [...prev, { 
        text: "I'm sorry, but there was an error processing your request. Please try again or select a different date.", 
        sender: 'ai' 
      }]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!inputValue.trim()) return;
    
    setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
    setLoading(true);
    
    const sanitizedInput = inputValue.trim();
    setInputValue('');
    
    try {
      let response = ''; // Initialize the response variable
      
      // If we have a chat session, use it to send the message to the AI
      if (chatSession) {
        console.log("Using chat session to send message");
        
        // Create context from all extracted information
        let context = "";
        if (extractedInfo.medicalIssue) {
          context += `The user has mentioned they have: ${extractedInfo.medicalIssue}. `;
        }
        if (extractedInfo.location) {
          context += `They are looking for treatment in: ${extractedInfo.location}. `;
        }
        if (extractedInfo.appointmentDate) {
          context += `They want an appointment on: ${extractedInfo.appointmentDate}. `;
        }
        if (extractedInfo.treatmentType) {
          context += `The treatment they need is: ${extractedInfo.treatmentType}. `;
        }
        
        if (context) {
          console.log("Added context to request:", context);
        }
        
        // Send the context along with the user's message
        const message = sanitizedInput;
        const contextForGemini = context;
        
        if (contextForGemini.toLowerCase().includes("calendar")) {
          response = await generateCalendarResponse(chatSession, message, contextForGemini);
        } else {
          response = await sendMessage(chatSession, message, contextForGemini);
        }
        
        // If the AI is asking for date selection, show the calendar component
        // Removed this block of code
        
        // If we got a fallback response, try to determine if this is a symptom and provide a more specific response
        if (response === FALLBACK_RESPONSE) {
          const symptomType = determineTreatmentType(sanitizedInput);
          if (symptomType) {
            console.log("Detected symptom type:", symptomType);
            response = `I see you're mentioning symptoms related to ${symptomType} treatment. Could you tell me more about your specific concerns? This will help me find the best clinic for you.`;
          }
        }
      } else {
        // Fall back to simple detection if no Gemini is available
        console.log("No chat session available, falling back to local detection");
        const symptomType = determineTreatmentType(sanitizedInput);
        if (symptomType) {
          console.log("Detected symptom type:", symptomType);
          response = `I see you're mentioning symptoms related to ${symptomType} treatment. Could you tell me more about your specific concerns? This will help me find the best clinic for you.`;
        } else {
          response = FALLBACK_RESPONSE;
        }
      }
      
      addAIResponseWithCalendar(response);
      
    } catch (error) {
      console.error("Error in AI response:", error);
      addAIResponseWithCalendar(FALLBACK_RESPONSE);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    // Reset chat to initial state
    setMessages([
      { text: "Hello! I'm your MedYatra AI assistant. We currently offer specialized treatments in four areas: Hair, Dental Care, Cosmetic Procedures, and IVF/Fertility. Please describe your symptoms or medical needs, and I'll help you find the right clinic.", sender: 'ai' }
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

  const selectBestClinic = async (treatmentType, location, appointmentDate) => {
    try {
      console.log(`Selecting best clinic for: ${treatmentType} in ${location} on ${appointmentDate}`);
      
      // Normalize treatment type to lowercase for database consistency
      const normalizedType = treatmentType ? treatmentType.toLowerCase() : null;
      
      console.log(`Using normalized treatment type: ${normalizedType}`);
      
      // Guard clause: If missing any parameter, return null
      if (!normalizedType || !location || !appointmentDate) {
        console.log("Missing required parameters for clinic selection");
        return null;
      }
      
      // Step 1: Get all clinics matching treatment type and location
      const clinics = await getClinicsByTreatmentType(normalizedType, location);
      
      if (!clinics || clinics.length === 0) {
        console.log(`No clinics found for ${normalizedType} in ${location}`);
        return null;
      }
      
      console.log(`Found ${clinics.length} clinics matching ${normalizedType} in ${location}`);
      
      // Step 2: Filter for clinics available on the requested date
      const availableClinics = [];
      
      for (const clinic of clinics) {
        const availability = await getAvailability(clinic.id, appointmentDate);
        
        if (availability && 
            availability.length > 0 && 
            availability[0].available) {
          availableClinics.push({
            ...clinic,
            slots: availability[0].slots || []
          });
        }
      }
      
      if (availableClinics.length === 0) {
        console.log(`No clinics available on ${appointmentDate}`);
        return null;
      }
      
      console.log(`Found ${availableClinics.length} clinics available on ${appointmentDate}`);
      
      // Step 3: Sort by rating and return up to three clinics (instead of just the best one)
      availableClinics.sort((a, b) => b.rating - a.rating);
      
      // Return up to 3 clinics
      const topClinics = availableClinics.slice(0, 3);
      console.log(`Returning top ${topClinics.length} clinics sorted by rating`);
      
      // For backward compatibility, if we need to return a single clinic, return the array
      // This change will allow us to modify other parts of the code to handle multiple clinics
      return topClinics;
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
                {message.sender === 'ai' && message.showCalendar && (
                  <Box mt={2} mb={1}>
                    <ChatCalendarComponent 
                      onSelectDate={handleDateSelect} 
                      treatmentType={extractedInfo.treatmentType || determineTreatmentType(extractedInfo.medicalIssue)}
                      location={extractedInfo.location}
                    />
                  </Box>
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

      {/* Clinic recommendations section */}
      {showRecommendations && bestClinic && (
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
                    Location: {clinic.location} {clinic.distance ? `(${clinic.distance})` : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Availability: {clinic.availability || 'Contact for availability'}
                  </Typography>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  Services:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {(clinic.services || []).map((service, index) => (
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
                    onClick={() => navigate('/book-now', { 
                      state: { 
                        clinic: clinic, 
                        date: extractedInfo.appointmentDate || '',
                        time: '10:00 AM' // Default time, can be changed later
                      } 
                    })}
                  >
                    Book Now
                  </Button>
                </Box>
              </CardContent>
              
              {showExpandedClinicDetails && (
                <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                  <Typography variant="h6" gutterBottom>Detailed Information</Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>About the Clinic</Typography>
                    <Typography variant="body2" paragraph>
                      {clinic.name} is a premier healthcare facility specializing in {treatmentDetails?.treatmentType || 'specialized'} treatments. 
                      With state-of-the-art equipment and experienced specialists, they provide personalized care 
                      tailored to each patient's unique needs.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Doctors</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 50, height: 50 }}>{clinic.name ? clinic.name[0] : 'D'}</Avatar>
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
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Facilities</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label="Modern Equipment" size="small" />
                      <Chip label="Comfortable Waiting Area" size="small" />
                      <Chip label="Digital Records" size="small" />
                      <Chip label="Lab Services" size="small" />
                      <Chip label="Pharmacy" size="small" />
                    </Box>
                  </Box>
                </Box>
              )}
            </Card>
          ))}
          
          <Button 
            variant="contained" 
            fullWidth
            color="primary" 
            onClick={() => setShowTreatmentsInfo(true)}
            sx={{ mt: 2 }}
          >
            View Treatment Information
          </Button>
        </Box>
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

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
import { createChatSession, sendMessage, extractMedicalInfo, determineTreatmentType, generateCalendarResponse } from '../services/geminiService';
import { getClinicsByTreatmentType, getAvailability } from '../firebase';
import ChatCalendarComponent from './CalendarComponent';
import { format } from 'date-fns';
import {
  LocalHospital as DentalIcon,
  Face as HairIcon,
  AutoAwesome as CosmeticIcon,
  FamilyRestroom as FertilityIcon,
  Send,
  Mic,
  SmartToy,
  Person,
  InfoOutlined
} from '@mui/icons-material';

const FALLBACK_RESPONSE = "I'd like to help you find the right specialist. Could you tell me more about your symptoms or what type of medical treatment you're looking for?";

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { LocationOnOutlined } from '@mui/icons-material';

const AIChatFinal = () => {
  const [messages, setMessages] = useState([]);
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
  const [availableLocations, setAvailableLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // Fetch unique locations from clinics collection
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingLocations(true);
        const clinicsRef = collection(db, 'clinics');
        const clinicsSnapshot = await getDocs(clinicsRef);
        const locations = new Set();
        
        clinicsSnapshot.forEach((doc) => {
          const clinic = doc.data();
          if (clinic.location) {
            locations.add(clinic.location);
          }
        });
        
        setAvailableLocations(Array.from(locations));
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationSelect = (location) => {
    setExtractedInfo(prev => ({
      ...prev,
      location
    }));
    
    // Add message to chat about selected location
    setMessages(prev => [...prev, {
      text: `I'm in ${location}`,
      sender: 'user'
    }]);
    
    // Clear input field if location was selected from suggestions
    setInputValue('');
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

  const theme = useTheme();
  const navigate = useNavigate();

  // Initialize chat session
  useEffect(() => {
    const initializeChatSession = async () => {
      try {
        // console.log("Initializing chat session");
        const session = await createChatSession();

        if (session) {
          // console.log("Chat session initialized successfully");
          setChatSession(session);
        } else {
          // console.error("Failed to initialize chat session - null session returned");

          // Even though we don't have a chat session, we can still show the UI
          // We'll fall back to local processing when the user sends messages
        }
      } catch (error) {
      // console.error("Error initializing chat session:", error);

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
      // console.log("Location provided but no appointment date - showing calendar directly");
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
    if (inputRef.current && !loading && messages.length > 0) {
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
        //console.log("Extracted medical info:", info);
        
        // Update the extracted info state
        setExtractedInfo(info);
        
        // Check if we need to show calendar after the user provided location
        if (info.medicalIssue && info.location && !info.appointmentDate) {
        // console.log("Location provided but no appointment date - showing calendar directly");
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
         // console.log("All parameters collected, ready to recommend clinic");
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
           // console.log("Found clinics:", clinics);
            setBestClinic(clinics);
            setShowRecommendations(true);
            
            // DO NOT add a message here - let the Gemini API handle responses
            // The clinic recommendations will be shown in the UI separately
          } else {
           // console.log("No clinic found for the given parameters");
            // Add message that no clinics are available for the selected date
            setMessages(prev => [...prev, { 
              text: `I'm sorry, but there are no clinics available in ${info.location} for ${info.treatmentType} treatment on ${info.appointmentDate}. Would you like to try another date or location?`, 
              sender: 'ai' 
            }]);
          }
        } else {
          //console.log("Not all parameters collected yet, continuing conversation");
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
             //console.log("Inferred treatment type:", inferredType);
              setExtractedInfo(prev => ({ ...prev, treatmentType: inferredType }));
              
              // Now process with the inferred treatment type
              const clinic = await selectBestClinic(
                inferredType,
                info.location,
                info.appointmentDate
              );
              if (clinic) {
                // console.log("Found clinic with inferred treatment type:", clinic);
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
        //console.error("Error processing conversation:", error);
      } finally {
        // Always reset the processing flag when done
        setIsProcessing(false);
      }
    };

    processConversation();
  }, [messages]);

  // Handle date selection from the calendar
  const handleDateSelect = async (date) => {
    // console.log("Selected available date:", date);

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
        // console.log("All parameters collected, searching for clinic now...");

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
            // console.log("Found available clinic:", clinics[0]);
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
            //console.log("No available clinics found for the selected date and location");

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
     //  console.error("Error processing date selection:", error);
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
      // Check if the input might be a location if we're expecting one
      const lastAiMessage = messages.find(m => m.sender === 'ai');
      if (lastAiMessage && 
          !extractedInfo.location && 
          (lastAiMessage.text.toLowerCase().includes('location') ||
           lastAiMessage.text.toLowerCase().includes('city') ||
           lastAiMessage.text.toLowerCase().includes('where'))) {
        // Update location in extracted info
        setExtractedInfo(prev => ({
          ...prev,
          location: sanitizedInput
        }));
      }

      let response = ''; // Initialize the response variable

      // If we have a chat session, use it to send the message to the AI
      if (chatSession) {
        // console.log("Using chat session to send message");

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
          //    console.log("Added context to request:", context);
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
            //  console.log("Detected symptom type:", symptomType);
            response = `I see you're mentioning symptoms related to ${symptomType} treatment. Could you tell me more about your specific concerns? This will help me find the best clinic for you.`;
          }
        }
      } else {
        // Fall back to simple detection if no Gemini is available
        // console.log("No chat session available, falling back to local detection");
        const symptomType = determineTreatmentType(sanitizedInput);
        if (symptomType) {
        // console.log("Detected symptom type:", symptomType);
          response = `I see you're mentioning symptoms related to ${symptomType} treatment. Could you tell me more about your specific concerns? This will help me find the best clinic for you.`;
        } else {
          response = FALLBACK_RESPONSE;
        }
      }

      addAIResponseWithCalendar(response);

    } catch (error) {
     // console.error("Error in AI response:", error);
      addAIResponseWithCalendar(FALLBACK_RESPONSE);
    } finally {
      setLoading(false);
    }
  };

  const selectBestClinic = async (treatmentType, location, appointmentDate) => {
    try {
      //  console.log(`Selecting best clinic for: ${treatmentType} in ${location} on ${appointmentDate}`);

      // Normalize treatment type to lowercase for database consistency
      const normalizedType = treatmentType ? treatmentType.toLowerCase() : null;

      // console.log(`Using normalized treatment type: ${normalizedType}`);

      // Guard clause: If missing any parameter, return null
      if (!normalizedType || !location || !appointmentDate) {
        // console.log("Missing required parameters for clinic selection");
        return null;
      }

      // Step 1: Get all clinics matching treatment type and location
      const clinics = await getClinicsByTreatmentType(normalizedType, location);

      if (!clinics || clinics.length === 0) {
// console.log(`No clinics found for ${normalizedType} in ${location}`);
        return null;
      }

      // console.log(`Found ${clinics.length} clinics matching ${normalizedType} in ${location}`);

      // Step 2: Filter for clinics available on the requested date
      const availableClinics = [];

      for (const clinic of clinics) {
        const availability = await getAvailability(clinic.id, appointmentDate);

        if (availability &&
          availability.length > 0 &&
            availability[0].availableDay) {
          availableClinics.push({
            ...clinic,
            slots: availability[0].slots || []
          });
        }
      }

      if (availableClinics.length === 0) {
     //   console.log(`No clinics available on ${appointmentDate}`);
        return null;
      }

    //  console.log(`Found ${availableClinics.length} clinics available on ${appointmentDate}`);

      // Step 3: Sort by rating and return up to three clinics (instead of just the best one)
      availableClinics.sort((a, b) => b.rating - a.rating);

      // Return up to 3 clinics
      const topClinics = availableClinics.slice(0, 3);
      // console.log(`Returning top ${topClinics.length} clinics sorted by rating`);

      // For backward compatibility, if we need to return a single clinic, return the array
      // This change will allow us to modify other parts of the code to handle multiple clinics
      return topClinics;
    } catch (error) {
    //  console.error("Error selecting best clinic:", error);
      return null;
    }
  };
  const handleQuickAction = (action) => {
    setInputValue(action.text);
    inputRef.current?.focus();
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      minHeight: '85vh',
      maxHeight: '100vh',
      maxWidth: 800,
      mx: 'auto',
      p: 1,
      gap: 2,
    }}>

      {!isMobile && messages.length < 1 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 4,
          }}
        >
          {/* Logo Circle with logoWhite.webp */}
          <Avatar
            sx={{
              bgcolor: '#ccc',
              width: 96,
              height: 96,
              fontSize: 40,
              fontWeight: 'bold',
              mb: 1,
              color: '#000',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0,
            }}
            src={'/logoDark.webp'}
            alt="MedYatra Logo"
            imgProps={{
              style: {
                width: '150%',
                height: '150%',
                objectFit: 'contain',
                objectPosition: 'center',
              }
            }}
          />
          {/* Title */}
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Welcome to MedYatra ✨
          </Typography>

          {/* Subtitle */}
          <Typography variant="subtitle1" color="#000">
            Empowering Your Health Journey With AI
          </Typography>
        </Box>
      )}

      {/* Quick Action Code */}
      {messages.length < 1 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{
            mb: 2,
            color: '#1D4645',
            fontWeight: 600,
            textAlign: 'center',
            fontSize: {
              xs: '1rem',
              md: '1.5rem'
            }
          }}>
            How can I help you today?
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: { xs: 1, sm: 2 },
          }}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => handleQuickAction(action)}
                sx={{
                  px: {
                    xs: 1,
                    sm: 2,
                  },
                  fontSize: {
                    xs: '0.75rem',
                    md: '1rem',
                  },
                  borderRadius: 1,
                  border: '2px solid',
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  textTransform: 'none',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: action.color,
                    bgcolor: `${action.color}08`,
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
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
      )}

      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          overflowX: 'hidden',
          overflowY: 'hidden',
          minWidth: {
            xs: '275px',
            sm: '400px',
            lg: '600px'
          },
          maxWidth: {
            xs: '320px',
            sm: 'none'
          },
          maxHeight: '100%',
        }}
      >
        <Box
          ref={chatRef}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            px: messages.length >= 1 ? 3 : 1,
            py: messages.length >= 1 ? 3 : 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxHeight: 'calc(100vh - 200px)',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '4px',
              '&:hover': {
                background: '#a8a8a8',
              },
            },
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
                gap: 1.5,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#1D4645',
                  width: 36,
                  height: 36,
                }}
              >
                {message.sender === 'user' ? <Person /> : <SmartToy />}
              </Avatar>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor:
                    message.sender === 'user'
                      ? 'linear-gradient(135deg, #1D4645, #1D4645)'
                      : theme.palette.background.default,
                  color: 'text.primary',
                  border: '1px solid',
                  borderColor:
                    message.sender === 'user' ? '#1D4645' : 'rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                  '&::after': message.sender === 'user'
                    ? {
                      content: '""',
                      position: 'absolute',
                      top: 12,
                      right: -8,
                      width: 0,
                      height: 0,
                      border: '8px solid transparent',
                      borderLeftColor: '#1D4645',
                      borderRight: 0,
                      marginRight: -8,
                    }
                    : {
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
                    },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontSize: '0.75rem' }}
                >
                  {message.text}
                </Typography>

                {/* Show location buttons when AI asks for location */}
                {message.sender === 'ai' && 
                 !extractedInfo.location && 
                 (message.text.toLowerCase().includes('location') || 
                  message.text.toLowerCase().includes('city') || 
                  message.text.toLowerCase().includes('where')) && 
                 availableLocations.length > 0 && (
                  <Box 
                    sx={{ 
                      mt: 2,
                      p: 2, 
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 1.5, 
                        fontWeight: 600,
                        color: 'text.secondary',
                        fontSize: '0.875rem'
                      }}
                    >
                      Available locations:
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: 1.5 
                      }}
                    >
                      {availableLocations.map((location) => (
                        <Button
                          key={location}
                          variant="outlined"
                          onClick={() => handleLocationSelect(location)}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            color: '#1D4645',
                            fontWeight: 500,
                            '&:hover': {
                              borderColor: '#1D4645',
                              bgcolor: 'rgba(29, 70, 69, 0.05)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                            },
                            '&:active': {
                              transform: 'translateY(0)',
                            },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1
                          }}
                        >
                          <LocationOnOutlined sx={{ fontSize: 18 }} />
                          {location}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}

                {message.sender === 'ai' && message.showCalendar && (
                  <Box
                    mt={2}
                    mb={1}
                    sx={{
                      width: '100%',
                      overflowX: 'auto',
                      px: { xs: 0, sm: 1 },
                      display: 'flex',
                      justifyContent: { xs: 'center', sm: 'flex-start' },
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <ChatCalendarComponent
                      onSelectDate={handleDateSelect}
                      treatmentType={
                        extractedInfo.treatmentType ||
                        determineTreatmentType(extractedInfo.medicalIssue)
                      }
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
                gap: 1.5,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#1D4645',
                  width: 36,
                  height: 36,
                }}
              >
                <SmartToy />
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
        
      {/* CLINIC RECOMMENDATIONS MOVED INSIDE CHAT CONTAINER */}
          {showRecommendations && bestClinic && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'background.paper', 
              borderRadius: 3, 
              boxShadow: theme.shadows[1],
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.08)',
              alignSelf: 'flex-start',
              width: '100%'
            }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <InfoOutlined fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Based on your symptoms and availability, here are the best clinics for your needs
            </Typography>
          </Box>

          {bestClinic.map((clinic, index) => (
                <Card 
                  key={clinic.id || index} 
                  sx={{ 
                    mb: 2, 
                    overflow: 'hidden', 
                    borderRadius: 2, 
                    boxShadow: theme.shadows[1],
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: theme.shadows[3],
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => navigate('/book-now', {
                    state: {
                      clinic: clinic,
                      date: extractedInfo.appointmentDate || '',
                      time: '10:00 AM'
                    }
                  })}
                >
                  <Box sx={{ position: 'relative', height: 120, overflow: 'hidden' }}>
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
                        p: 1.5,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                    color: 'white',
                  }}
                >
                      <Typography variant="subtitle1" fontWeight="bold">{clinic.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating value={clinic.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2">{clinic.rating || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                        📍 {clinic.location} {clinic.distance ? `(${clinic.distance})` : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                        ⏰ {clinic.availability || 'Contact for availability'}
                  </Typography>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Services:
                </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                      {(clinic.services || []).slice(0, 3).map((service, index) => (
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

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mt: 2 }}>
                  <Button
                        size="small"
                    color="primary"
                    startIcon={<InfoOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowExpandedClinicDetails(!showExpandedClinicDetails);
                        }}
                  >
                        Details
                  </Button>
                  <Button
                        size="small"
                    variant="contained"
                    color="primary"
                        sx={{
                          bgcolor: '#1D4645',
                          '&:hover': {
                            bgcolor: '#143433',
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/book-now', {
                      state: {
                        clinic: clinic,
                        date: extractedInfo.appointmentDate || '',
                              time: '10:00 AM'
                            }
                          });
                        }}
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
                variant="outlined"
            fullWidth
            color="primary"
                size="small"
            onClick={() => setShowTreatmentsInfo(true)}
                sx={{ 
                  mt: 1,
                  borderColor: '#1D4645',
                  color: '#1D4645',
                  '&:hover': {
                    borderColor: '#143433',
                    bgcolor: 'rgba(29, 70, 69, 0.05)'
                  }
                }}
          >
            View Treatment Information
          </Button>
        </Box>
      )}
        </Box>

        <Divider />

        {/* Input Fields and Send Buttons */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row'
            },
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(0, 0, 0, 0.02)',
            flexShrink: 0,
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
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1D4645',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1D4645',
                },
                '& input': {
                  color: '#1D4645',
                },
                fontSize: '0.75rem',
              },
            }}
            InputLabelProps={{
              sx: {
                color: '#1D4645',
                '&.Mui-focused': {
                  color: '#1D4645',
                },
              },
            }}
          />
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Tooltip title="Send message">
              <span>
                <IconButton
                  type="submit"
                  color="primary"
                  disabled={!inputValue.trim() || loading}
                  sx={{
                    bgcolor: '#1D4645',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#143433',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)',
                    },
                  }}
                >
                  <Send />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Voice input (coming soon)">
              <span>
                <IconButton
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'rgba(0, 0, 0, 0.08)',
                    color: '#1D4645',
                    '&:hover': {
                      bgcolor: 'rgba(29, 70, 69, 0.05)',
                    },
                  }}
                >
                  <Mic />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Render TreatmentsInfo dialog when showTreatmentsInfo is true */}
      <TreatmentsInfo
        open={showTreatmentsInfo}
        onClose={() => setShowTreatmentsInfo(false)}
      />
    </Box>
  );
};

export default AIChatFinal;

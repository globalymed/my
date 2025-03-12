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
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const FALLBACK_RESPONSE = "I'd like to help you find the right specialist. Could you tell me more about your symptoms or what type of medical treatment you're looking for?";

const AIChatFinal = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your MedYatra AI assistant. We currently offer specialized treatments in four areas: Hair Restoration, Dental Care, Cosmetic Procedures, and IVF/Fertility. Please describe your symptoms or medical needs, and I'll help you find the right clinic.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [treatmentDetails, setTreatmentDetails] = useState(null);
  const [bestClinic, setBestClinic] = useState(null);
  const [showExpandedClinicDetails, setShowExpandedClinicDetails] = useState(false);
  const [conversationState, setConversationState] = useState({
    stage: 'initial',
    detectedType: null,
    duration: null,
    severity: null,
    area: null,
    patientContext: {},
    lastQuestion: null // Track the last question asked to avoid repetition
  });
  const [showRecommendations, setShowRecommendations] = useState(false);
  const theme = useTheme();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Enhanced symptom detection with more comprehensive patterns
  const detectSymptoms = (message) => {
    const lowerMessage = message.toLowerCase();
    let detectedType = null;
    let hasSymptoms = false;
    
    // Check for hair-related symptoms - expanded keywords
    if (/\b(hair\s*loss|bald|thinning\s*hair|receding\s*hairline|hair\s*fall|hair\s*transplant|hair\s*treatment|hair\s*problem|hair\s*issue|scalp|dandruff|hair)\b/i.test(lowerMessage)) {
      detectedType = 'hair';
      hasSymptoms = true;
    }
    // Check for dental-related symptoms
    else if (/\b(tooth|teeth|dental|dentist|cavity|filling|crown|root\s*canal|gum|oral|mouth|jaw|braces|invisalign|denture)\b/i.test(lowerMessage)) {
      detectedType = 'dental';
      hasSymptoms = true;
    }
    // Check for cosmetic-related symptoms
    else if (/\b(cosmetic|beauty|skin|face|wrinkle|botox|filler|laser|plastic\s*surgery|liposuction|tummy\s*tuck|nose\s*job|facelift)\b/i.test(lowerMessage)) {
      detectedType = 'cosmetic';
      hasSymptoms = true;
    }
    // Check for IVF-related symptoms
    else if (/\b(fertility|ivf|in\s*vitro|pregnancy|conceive|conception|sperm|egg|embryo|surrogacy|infertility)\b/i.test(lowerMessage)) {
      detectedType = 'ivf';
      hasSymptoms = true;
    }
    // Check for general symptoms
    else if (/\b(pain|ache|discomfort|fever|cough|cold|flu|headache|migraine|nausea|vomit|diarrhea|constipation|rash|allergy|infection|injury|wound|sore|swelling)\b/i.test(lowerMessage)) {
      detectedType = 'general';
      hasSymptoms = true;
    }
    
    return { detectedType, hasSymptoms };
  };

  // Check if user is asking for clarification
  const isAskingForClarification = (message) => {
    const lowerMessage = message.toLowerCase();
    return /what|like what|more info|tell you what|what do you want|what do you need|what should i|how should i|not sure what|what information|what else|what more/i.test(lowerMessage);
  };

  // Handle form submission with improved conversation flow
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMessage = sanitizeInput(input);
    setInput('');
    
    // Add user message to chat
    const updatedMessages = [...messages, { text: userMessage, sender: 'user' }];
    setMessages(updatedMessages);
    
    // Set loading state
    setLoading(true);
    
    try {
      // Check if this message contains symptoms
      const { detectedType, hasSymptoms } = detectSymptoms(userMessage);
      let aiResponse = "";
      
      // Check if user is asking for clarification about what to say
      const askingForClarification = isAskingForClarification(userMessage);
      
      // First check if we've detected a treatment type
      if (detectedType) {
        // Update conversation state with detected type if not already set
        if (!conversationState.detectedType) {
          setConversationState(prev => ({
            ...prev,
            detectedType,
            stage: 'asking_details',
            lastQuestion: 'details'
          }));
          
          // Provide response based on detected type
          if (detectedType === 'hair') {
            aiResponse = "I understand you're experiencing hair-related concerns. Could you tell me more about your hair issues? For example, is it gradual thinning, patchy loss, or receding hairline?";
          } else if (detectedType === 'dental') {
            aiResponse = "I understand you're having dental issues. Could you describe the dental problem in more detail? For example, is it pain, sensitivity, or cosmetic concerns?";
          } else if (detectedType === 'cosmetic') {
            aiResponse = "I understand you're interested in cosmetic procedures. Could you tell me more about what specific treatments you're considering or what concerns you'd like to address?";
          } else {
            aiResponse = `I understand you're looking for ${detectedType} treatment. Could you tell me more about your specific concerns?`;
          }
        } 
        // If we already have a detected type, process based on conversation stage
        else {
          const treatmentType = conversationState.detectedType;
          
          switch (conversationState.stage) {
            case 'asking_details':
              setConversationState(prev => ({
                ...prev,
                stage: 'asking_duration',
                patientContext: {
                  ...prev.patientContext,
                  details: userMessage
                },
                lastQuestion: 'duration'
              }));
              
              aiResponse = `Thank you for sharing that information about your ${treatmentType} concerns. How long have you been experiencing these issues?`;
              break;
              
            case 'asking_duration':
              setConversationState(prev => ({
                ...prev,
                duration: userMessage,
                stage: 'asking_severity',
                lastQuestion: 'severity'
              }));
              
              aiResponse = `I understand you've been dealing with this for ${userMessage}. On a scale of 1 to 10, how would you rate the severity of your ${treatmentType} issues?`;
              break;
              
            case 'asking_severity':
              // Try to parse severity as a number, default to 5 if not found
              const severityMatch = userMessage.match(/\d+/);
              const severityRating = severityMatch ? parseInt(severityMatch[0]) : 5;
              
              setConversationState(prev => ({
                ...prev,
                severity: severityRating,
                stage: 'asking_area',
                lastQuestion: 'area'
              }));
              
              if (treatmentType === 'hair') {
                aiResponse = "Thank you. Could you tell me which areas are most affected? For example, is it the crown, temples, or overall thinning?";
              } else {
                aiResponse = "Thank you. Could you specify which areas are most affected?";
              }
              break;
              
            case 'asking_area':
              setConversationState(prev => ({
                ...prev,
                area: userMessage,
                stage: 'recommending',
                lastQuestion: 'recommendations'
              }));
              
              // Create treatment details for recommendation
              setTreatmentDetails({
                treatmentType: treatmentType,
                details: {
                  duration: conversationState.duration || "recently",
                  severity: conversationState.severity || 5,
                  area: userMessage
                }
              });
              
              // Show recommendations
              setShowRecommendations(true);
              
              aiResponse = `Based on what you've shared about your ${treatmentType} concerns, I recommend seeing a specialist. I've found some highly-rated clinics for you below that specialize in ${treatmentType} treatments.`;
              break;
              
            case 'recommending':
              // We're already showing recommendations, just acknowledge
              aiResponse = "Is there anything specific you'd like to know about these clinics? Or would you like me to help you book an appointment?";
              break;
              
            default:
              // Move to next stage if we're stuck
              if (conversationState.lastQuestion === 'duration') {
                setConversationState(prev => ({
                  ...prev,
                  duration: userMessage,
                  stage: 'asking_severity',
                  lastQuestion: 'severity'
                }));
                
                aiResponse = `Thank you. On a scale of 1 to 10, how would you rate the severity of your ${treatmentType} issues?`;
              } else if (conversationState.lastQuestion === 'severity') {
                setConversationState(prev => ({
                  ...prev,
                  severity: 5,
                  stage: 'asking_area',
                  lastQuestion: 'area'
                }));
                
                if (treatmentType === 'hair') {
                  aiResponse = "Could you tell me which areas are most affected? For example, is it the crown, temples, or overall thinning?";
                } else {
                  aiResponse = "Could you specify which areas are most affected?";
                }
              } else if (conversationState.lastQuestion === 'area') {
                setConversationState(prev => ({
                  ...prev,
                  area: userMessage || "not specified",
                  stage: 'recommending',
                  lastQuestion: 'recommendations'
                }));
                
                // Create treatment details for recommendation
                setTreatmentDetails({
                  treatmentType: treatmentType,
                  details: {
                    duration: conversationState.duration || "recently",
                    severity: conversationState.severity || 5,
                    area: userMessage || "not specified"
                  }
                });
                
                // Show recommendations
                setShowRecommendations(true);
                
                aiResponse = `Based on what you've shared about your ${treatmentType} concerns, I recommend seeing a specialist. I've found some highly-rated clinics for you below that specialize in ${treatmentType} treatments.`;
              } else {
                // Default response if stage is not recognized
                aiResponse = `Let me help you find the right specialist for your ${treatmentType} concerns. Could you tell me how long you've been experiencing these issues?`;
                setConversationState(prev => ({
                  ...prev,
                  stage: 'asking_duration',
                  lastQuestion: 'duration'
                }));
              }
              break;
          }
        }
      }
      // Handle greetings separately, but check for symptoms in greetings too
      else if (/^(hi|hello|hey|greetings|namaste)/i.test(userMessage.toLowerCase())) {
        // Check if greeting also contains symptoms
        const fullMessageCheck = detectSymptoms(userMessage);
        
        if (fullMessageCheck.detectedType) {
          // The greeting contains a treatment type
          setConversationState(prev => ({
            ...prev,
            detectedType: fullMessageCheck.detectedType,
            stage: 'asking_details',
            lastQuestion: 'details'
          }));
          
          switch (fullMessageCheck.detectedType) {
            case 'hair':
              aiResponse = "Hello! I understand you're experiencing hair-related concerns. Could you tell me more about your hair issues? For example, is it gradual thinning, patchy loss, or receding hairline?";
              break;
            case 'dental':
              aiResponse = "Hello! I understand you're having dental issues. Could you describe the dental problem in more detail? For example, is it pain, sensitivity, or cosmetic concerns?";
              break;
            default:
              aiResponse = `Hello! I understand you're looking for ${fullMessageCheck.detectedType} treatment. Could you tell me more about your specific concerns?`;
          }
        } else {
          // Just a greeting without symptoms
          aiResponse = "Hello! I'm here to help you find the right medical care. We currently specialize in Hair Restoration, Dental Care, Cosmetic Procedures, and IVF/Fertility treatments. Could you please describe your health concerns or which of these treatments you're interested in?";
        }
      }
      // Handle clarification questions specifically
      else if (askingForClarification && conversationState.detectedType) {
        const treatmentType = conversationState.detectedType;
        
        // Provide a helpful response based on the current stage
        switch (conversationState.stage) {
          case 'asking_details':
            aiResponse = `I'd like to know more about your ${treatmentType} concerns. For example, when did you first notice it? Is it getting worse? Any other symptoms?`;
            break;
            
          case 'asking_duration':
            aiResponse = `I'd like to know approximately how long you've been experiencing these ${treatmentType} issues. Has it been days, weeks, months, or years?`;
            break;
            
          case 'asking_severity':
            aiResponse = `I'd like to understand how severe your ${treatmentType} issues are. On a scale of 1 to 10, where 1 is very mild and 10 is extremely severe, how would you rate it?`;
            // Move to next stage if user is confused
            setConversationState(prev => ({
              ...prev,
              stage: 'asking_area',
              severity: 5,
              lastQuestion: 'area'
            }));
            break;
            
          case 'asking_area':
            if (treatmentType === 'hair') {
              aiResponse = "I'd like to know which parts of your scalp or hairline are most affected. Is it the crown (top of head), temples, front hairline, or all over?";
            } else {
              aiResponse = `I'd like to know which specific areas are affected by your ${treatmentType} condition.`;
            }
            break;
            
          default:
            // Move to recommendations if user is still confused
            setConversationState(prev => ({
              ...prev,
              stage: 'recommending',
              area: "not specified",
              lastQuestion: 'recommendations'
            }));
            
            // Create treatment details for recommendation
            setTreatmentDetails({
              treatmentType: treatmentType,
              details: {
                duration: conversationState.duration || "recently",
                severity: conversationState.severity || 5,
                area: "not specified"
              }
            });
            
            // Show recommendations
            setShowRecommendations(true);
            
            // Select the best clinic based on user's needs
            selectBestClinic(treatmentType);
            
            aiResponse = `Based on what you've shared about your ${treatmentType} concerns and clinic availability, the clinic best suited for you is shown below. This specialist clinic is highly rated and offers the treatments you need.`;
            break;
        }
      }
      // If we already have a treatment type but no specific condition was met
      else if (conversationState.detectedType) {
        const treatmentType = conversationState.detectedType;
        
        // Progress the conversation based on the current stage
        switch (conversationState.stage) {
          case 'asking_details':
            setConversationState(prev => ({
              ...prev,
              stage: 'asking_duration',
              patientContext: {
                ...prev.patientContext,
                details: userMessage
              },
              lastQuestion: 'duration'
            }));
            
            aiResponse = `Thank you. How long have you been experiencing these ${treatmentType} issues?`;
            break;
            
          case 'asking_duration':
            setConversationState(prev => ({
              ...prev,
              duration: userMessage,
              stage: 'asking_severity',
              lastQuestion: 'severity'
            }));
            
            aiResponse = `I understand. On a scale of 1 to 10, how would you rate the severity of your ${treatmentType} issues?`;
            break;
            
          case 'asking_severity':
            setConversationState(prev => ({
              ...prev,
              severity: 5,
              stage: 'asking_area',
              lastQuestion: 'area'
            }));
            
            if (treatmentType === 'hair') {
              aiResponse = "Thank you. Which areas of your scalp or hairline are most affected? For example, is it the crown, temples, or overall thinning?";
            } else {
              aiResponse = "Thank you. Could you specify which areas are most affected?";
            }
            break;
            
          case 'asking_area':
            setConversationState(prev => ({
              ...prev,
              area: userMessage,
              stage: 'recommending',
              lastQuestion: 'recommendations'
            }));
            
            // Create treatment details for recommendation
            setTreatmentDetails({
              treatmentType: treatmentType,
              details: {
                duration: conversationState.duration || "recently",
                severity: conversationState.severity || 5,
                area: userMessage
              }
            });
            
            // Show recommendations
            setShowRecommendations(true);
            
            // Select the best clinic based on user's needs
            selectBestClinic(treatmentType);
            
            aiResponse = `Based on what you've shared about your ${treatmentType} concerns and clinic availability, the clinic best suited for you is shown below. This specialist clinic is highly rated and offers the treatments you need.`;
            break;
            
          default:
            // Move to recommendations if we're stuck
            setConversationState(prev => ({
              ...prev,
              stage: 'recommending',
              lastQuestion: 'recommendations'
            }));
            
            // Create treatment details for recommendation
            setTreatmentDetails({
              treatmentType: treatmentType,
              details: {
                duration: conversationState.duration || "recently",
                severity: conversationState.severity || 5,
                area: conversationState.area || "not specified"
              }
            });
            
            // Show recommendations
            setShowRecommendations(true);
            
            // Select the best clinic based on user's needs
            selectBestClinic(treatmentType);
            
            aiResponse = `Based on what you've shared about your ${treatmentType} concerns and clinic availability, the clinic best suited for you is shown below. This specialist clinic is highly rated and offers the treatments you need.`;
            break;
        }
      }
      // General fallback for any other situation
      else {
        aiResponse = "I'd like to help you find the right specialist. MedYatra currently offers treatments in Hair Restoration, Dental Care, Cosmetic Procedures, and IVF/Fertility. Could you tell me more about your symptoms or which of these treatments you're interested in?";
      }
      
      // Add AI response to messages
      setMessages([...updatedMessages, { text: aiResponse, sender: 'ai' }]);
      
    } catch (error) {
      console.error('Error generating response:', error);
      // Provide a more specific fallback response instead of the generic error
      setMessages([...updatedMessages, { text: FALLBACK_RESPONSE, sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { text: "Hello! I'm your MedYatra AI assistant. We currently offer specialized treatments in four areas: Hair Restoration, Dental Care, Cosmetic Procedures, and IVF/Fertility. Please describe your symptoms or medical needs, and I'll help you find the right clinic.", sender: 'ai' }
    ]);
    setTreatmentDetails(null);
    setShowRecommendations(false);
    setShowExpandedClinicDetails(false);
    setBestClinic(null);
    setConversationState({
      stage: 'initial',
      detectedType: null,
      duration: null,
      severity: null,
      area: null,
      patientContext: {},
      lastQuestion: null
    });
  };

  // Function to select the best clinic based on treatment type
  const selectBestClinic = (treatmentType) => {
    // Fallback clinics if we can't get real data
    const fallbackClinics = {
      hair: {
        id: 'hair1',
        name: 'Advanced Hair Clinic',
        rating: 4.8,
        services: ['Hair Transplant', 'PRP Therapy', 'Hair Loss Treatment'],
        location: 'South Delhi',
        distance: '3.2 km',
        availability: 'Available Tomorrow',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      dental: {
        id: 'dental1',
        name: 'Smile Dental Care',
        rating: 4.9,
        services: ['Root Canal', 'Dental Implants', 'Cosmetic Dentistry'],
        location: 'Connaught Place',
        distance: '2.5 km',
        availability: 'Available Tomorrow',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      cosmetic: {
        id: 'cosmetic1',
        name: 'Elegance Aesthetics',
        rating: 4.7,
        services: ['Botox', 'Fillers', 'Laser Treatments'],
        location: 'Greater Kailash',
        distance: '4.1 km',
        availability: 'Available Tomorrow',
        image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      ivf: {
        id: 'ivf1',
        name: 'New Life Fertility Center',
        rating: 4.9,
        services: ['IVF', 'Egg Freezing', 'Fertility Counseling'],
        location: 'Vasant Vihar',
        distance: '5.3 km',
        availability: 'Available Tomorrow',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      general: {
        id: 'general1',
        name: 'City Medical Center',
        rating: 4.6,
        services: ['General Medicine', 'Diagnostics', 'Specialist Referrals'],
        location: 'Central Delhi',
        distance: '3.0 km',
        availability: 'Available Tomorrow',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      }
    };
    
    // Set the best clinic based on treatment type
    setBestClinic(fallbackClinics[treatmentType] || fallbackClinics.general);
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      gap: 3
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.main}10)`,
          border: '1px solid',
          borderColor: `${theme.palette.primary.light}30`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.primary.main, 
              width: 48, 
              height: 48,
              mr: 2,
              boxShadow: theme.shadows[2]
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
    </Box>
  );
};

function sanitizeInput(input) {
  // Basic sanitization to prevent XSS
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
}

export default AIChatFinal;

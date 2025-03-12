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
  useTheme
} from '@mui/material';
import './AIChat.css';
import ClinicRecommender from './ClinicRecommenderEnhanced';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const SYSTEM_PROMPT = `You are MedYatra's medical triage assistant, designed to help patients find appropriate healthcare providers in India. Follow these instructions precisely:

1. Identify the patient's medical concerns and symptoms.
2. Determine the appropriate medical specialty needed.
3. Recommend clinics based on the identified specialty.
4. If you can confidently identify a treatment type, return a JSON object with the following structure:
{
  "treatmentType": "hair|dental|cosmetic|ivf|general",
  "details": {
    "duration": "patient-reported duration",
    "severity": numeric-severity-rating,
    "area": "affected-area"
  }
}

Common treatment types:
- hair: Hair loss, baldness, hair transplant
- dental: Tooth pain, cavities, orthodontics
- cosmetic: Skin treatments, botox, plastic surgery
- ivf: Fertility treatments
- general: General medical concerns

Be empathetic, professional, and helpful. Do not provide medical diagnoses or treatment advice beyond clinic recommendations.`;

const FALLBACK_RESPONSE = "I apologize, but I'm having trouble processing your request at the moment. Could you please describe your symptoms or medical needs again, and I'll do my best to help you find the right clinic?";

const TIMEOUT_MS = 10000;

const fetchWithTimeout = (url, options, timeout) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]);
};

const AIChatImproved = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your MedYatra AI assistant. Please describe your symptoms or medical needs, and I'll help you find the right clinic.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [treatmentDetails, setTreatmentDetails] = useState(null);
  const [conversationState, setConversationState] = useState({
    stage: 'initial',
    detectedType: null,
    duration: null,
    severity: null,
    area: null,
    patientContext: {},
    messageHistory: [] // Track message IDs to avoid repetition
  });
  const [previousResponses, setPreviousResponses] = useState(new Set());
  const [showRecommendations, setShowRecommendations] = useState(false);
  const theme = useTheme();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Enhanced symptom detection
  const detectSymptoms = (message) => {
    const lowerMessage = message.toLowerCase();
    let detectedType = null;
    let hasSymptoms = false;
    
    // Check for hair-related symptoms - expanded keywords
    if (/\b(hair\s*loss|bald|thinning\s*hair|receding\s*hairline|hair\s*fall|hair\s*transplant|hair\s*treatment|hair\s*problem|hair\s*issue|scalp|dandruff)\b/i.test(lowerMessage)) {
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

  // Improved response generation with better conversation flow
  const generateResponse = () => {
    // Get the last few messages for context
    const lastUserMessages = messages
      .filter(msg => msg.sender === 'user')
      .slice(-2)
      .map(msg => msg.text.toLowerCase());
    
    if (lastUserMessages.length === 0) return null;
    
    const lastUserMessage = lastUserMessages[lastUserMessages.length - 1];
    
    // Check if we've already detected a treatment type
    if (conversationState.detectedType) {
      const treatmentType = conversationState.detectedType;
      
      // Check what stage we're in
      switch (conversationState.stage) {
        case 'initial':
        case 'asking_details':
          setConversationState(prev => ({
            ...prev,
            stage: 'asking_duration'
          }));
          return `Thank you for sharing that information about your ${treatmentType} concerns. How long have you been experiencing these issues?`;
          
        case 'asking_duration':
          // Update duration and move to severity
          setConversationState(prev => ({
            ...prev,
            duration: lastUserMessage,
            stage: 'asking_severity'
          }));
          return `I understand you've been dealing with this for ${lastUserMessage}. On a scale of 1 to 10, how would you rate the severity of your ${treatmentType} issues?`;
          
        case 'asking_severity':
          // Try to parse severity as a number
          const severityRating = parseInt(lastUserMessage.match(/\d+/)?.[0]) || 5;
          
          setConversationState(prev => ({
            ...prev,
            severity: severityRating,
            stage: 'asking_area'
          }));
          
          if (treatmentType === 'hair') {
            return "Thank you. Could you tell me which areas are most affected? For example, is it the crown, temples, or overall thinning?";
          } else {
            return "Thank you. Could you specify which areas are most affected?";
          }
          
        case 'asking_area':
          // Update area and move to recommending
          setConversationState(prev => ({
            ...prev,
            area: lastUserMessage,
            stage: 'recommending'
          }));
          
          // Create treatment details for recommendation
          setTreatmentDetails({
            treatmentType: treatmentType,
            details: {
              duration: conversationState.duration || "recently",
              severity: conversationState.severity || 5,
              area: lastUserMessage
            }
          });
          
          // Show recommendations
          setShowRecommendations(true);
          
          return `Based on what you've shared about your ${treatmentType} concerns, I recommend seeing a specialist. I've found some highly-rated clinics for you below that specialize in ${treatmentType} treatments.`;
          
        case 'recommending':
          // We're already showing recommendations, just acknowledge
          return "Is there anything specific you'd like to know about these clinics? Or would you like me to help you book an appointment?";
          
        default:
          // If we somehow got here without a proper stage, reset to asking details
          setConversationState(prev => ({
            ...prev,
            stage: 'asking_details'
          }));
          return `Could you tell me more about your ${treatmentType} concerns? This will help me find the right specialist for you.`;
      }
    }
    
    // If we don't have a treatment type yet, check for symptoms
    const { detectedType, hasSymptoms } = detectSymptoms(lastUserMessage);
    
    if (detectedType) {
      // We detected a treatment type from this message
      setConversationState(prev => ({
        ...prev,
        detectedType: detectedType,
        stage: 'asking_details'
      }));
      
      // Different responses based on treatment type
      if (detectedType === 'hair') {
        return "I understand you're experiencing hair-related concerns. Could you tell me more about your hair loss? For example, is it gradual thinning, patchy loss, or receding hairline?";
      } else if (detectedType === 'dental') {
        return "I understand you're having dental issues. Could you describe the dental problem in more detail? For example, is it pain, sensitivity, or cosmetic concerns?";
      } else if (detectedType === 'cosmetic') {
        return "I understand you're interested in cosmetic procedures. Could you tell me more about what specific treatments you're considering or what concerns you'd like to address?";
      } else {
        return `I understand you're looking for ${detectedType} treatment. Could you tell me more about your specific concerns?`;
      }
    }
    
    // If we still don't have a treatment type, use general responses
    if (hasSymptoms) {
      return "Thank you for sharing that. To help me find the right specialist for you, could you be more specific about which medical specialty you think would be most appropriate? For example, are you looking for a dermatologist, dentist, or general physician?";
    }
    
    // General fallback responses
    const generalResponses = [
      "I'd like to help you find the right medical care. Could you tell me more about any specific symptoms you're experiencing?",
      "To recommend the best clinic for you, I need to understand your medical needs better. Could you describe your symptoms in more detail?",
      "Thank you for reaching out. To help you effectively, could you share more details about your medical concerns?",
      "I want to make sure I recommend the right specialist for you. Could you elaborate on your symptoms or what kind of treatment you're looking for?"
    ];
    
    // Check if the last message was a greeting or very short
    if (lastUserMessage.length < 10 || /^(hi|hello|hey|greetings|namaste)/i.test(lastUserMessage)) {
      return "Welcome to MedYatra! I'm here to help you find the right medical care. Could you please describe your health concerns or the type of treatment you're looking for?";
    }
    
    // Return a random general response
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  // Improved submission handler with better conversation flow
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
      
      // If we've detected a type and don't have treatment details yet
      if (detectedType && !conversationState.detectedType) {
        console.log(`Detected ${detectedType} symptoms`);
        
        // Update conversation state with detected type
        setConversationState(prev => ({
          ...prev,
          detectedType,
          stage: 'asking_details'
        }));
        
        // Add AI response based on detected type
        let response;
        if (detectedType === 'hair') {
          response = "I understand you're experiencing hair-related concerns. Could you tell me more about your hair loss? For example, is it gradual thinning, patchy loss, or receding hairline?";
        } else if (detectedType === 'dental') {
          response = "I understand you're having dental issues. Could you describe the dental problem in more detail? For example, is it pain, sensitivity, or cosmetic concerns?";
        } else if (detectedType === 'cosmetic') {
          response = "I understand you're interested in cosmetic procedures. Could you tell me more about what specific treatments you're considering or what concerns you'd like to address?";
        } else {
          response = `I understand you're looking for ${detectedType} treatment. Could you tell me more about your specific concerns?`;
        }
        
        setMessages([...updatedMessages, { text: response, sender: 'ai' }]);
        setLoading(false);
        return;
      }
      
      // If we already have a detected type, process based on conversation stage
      if (conversationState.detectedType) {
        const treatmentType = conversationState.detectedType;
        
        switch (conversationState.stage) {
          case 'asking_details':
            setConversationState(prev => ({
              ...prev,
              stage: 'asking_duration',
              patientContext: {
                ...prev.patientContext,
                details: userMessage
              }
            }));
            
            setMessages([...updatedMessages, { 
              text: `Thank you for sharing that information about your ${treatmentType} concerns. How long have you been experiencing these issues?`, 
              sender: 'ai' 
            }]);
            break;
            
          case 'asking_duration':
            setConversationState(prev => ({
              ...prev,
              duration: userMessage,
              stage: 'asking_severity'
            }));
            
            setMessages([...updatedMessages, { 
              text: `I understand you've been dealing with this for ${userMessage}. On a scale of 1 to 10, how would you rate the severity of your ${treatmentType} issues?`, 
              sender: 'ai' 
            }]);
            break;
            
          case 'asking_severity':
            const severityRating = parseInt(userMessage.match(/\d+/)?.[0]) || 5;
            
            setConversationState(prev => ({
              ...prev,
              severity: severityRating,
              stage: 'asking_area'
            }));
            
            let areaQuestion;
            if (treatmentType === 'hair') {
              areaQuestion = "Thank you. Could you tell me which areas are most affected? For example, is it the crown, temples, or overall thinning?";
            } else {
              areaQuestion = "Thank you. Could you specify which areas are most affected?";
            }
            
            setMessages([...updatedMessages, { 
              text: areaQuestion, 
              sender: 'ai' 
            }]);
            break;
            
          case 'asking_area':
            setConversationState(prev => ({
              ...prev,
              area: userMessage,
              stage: 'recommending'
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
            
            setMessages([...updatedMessages, { 
              text: `Based on what you've shared about your ${treatmentType} concerns, I recommend seeing a specialist. I've found some highly-rated clinics for you below that specialize in ${treatmentType} treatments.`, 
              sender: 'ai' 
            }]);
            break;
            
          case 'recommending':
            // We're already showing recommendations, just acknowledge
            setMessages([...updatedMessages, { 
              text: "Is there anything specific you'd like to know about these clinics? Or would you like me to help you book an appointment?", 
              sender: 'ai' 
            }]);
            break;
            
          default:
            // If we're not in a specific stage, use the generate response function
            const aiResponse = generateResponse();
            setMessages([...updatedMessages, { text: aiResponse, sender: 'ai' }]);
            break;
        }
        
        setLoading(false);
        return;
      }
      
      // If we haven't returned yet, use the generate response function
      const aiResponse = generateResponse();
      
      if (aiResponse) {
        // Check if we've already said this exact response
        if (previousResponses.has(aiResponse)) {
          console.log("Avoiding duplicate response");
          
          // If we're repeating ourselves, be more direct
          setMessages([...updatedMessages, { 
            text: "I'd like to help you find the right specialist. Could you tell me specifically what type of medical issue you're experiencing? For example, is it related to hair, dental, skin, or general health concerns?", 
            sender: 'ai' 
          }]);
        } else {
          // Add the response to our set of previous responses
          setPreviousResponses(prev => new Set(prev).add(aiResponse));
          setMessages([...updatedMessages, { text: aiResponse, sender: 'ai' }]);
        }
        
        setLoading(false);
        return;
      }
      
      // If local response generation failed, use a fallback
      setMessages([...updatedMessages, { text: FALLBACK_RESPONSE, sender: 'ai' }]);
      
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages([...updatedMessages, { text: FALLBACK_RESPONSE, sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { text: "Hello! I'm your MedYatra AI assistant. Please describe your symptoms or medical needs, and I'll help you find the right clinic.", sender: 'ai' }
    ]);
    setTreatmentDetails(null);
    setShowRecommendations(false);
    setConversationState({
      stage: 'initial',
      detectedType: null,
      duration: null,
      severity: null,
      area: null,
      patientContext: {},
      messageHistory: []
    });
    setPreviousResponses(new Set());
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
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  border: '1px solid',
                  borderColor: message.sender === 'user' 
                    ? 'transparent' 
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
          </Tooltip>
          <Tooltip title="Voice input (coming soon)">
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
          </Tooltip>
        </Box>
      </Paper>

      {showRecommendations && treatmentDetails && (
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
              Recommended Clinics
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
              Based on your symptoms, we've found these specialized clinics for you
            </Typography>
          </Box>
          
          <ClinicRecommender treatmentType={treatmentDetails.treatmentType} />
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

export default AIChatImproved;

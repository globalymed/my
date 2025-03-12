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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const SYSTEM_PROMPT = `You are MedYatra's medical triage assistant, designed to help patients find appropriate healthcare providers in India. Follow these instructions precisely:

CONVERSATION FLOW:
1. INITIAL ASSESSMENT: Ask specific questions about symptoms, focusing on identifying if they match dental, hair, cosmetic, or IVF treatment needs.
2. INFORMATION GATHERING: Collect duration, severity (1-10), and affected area information.
3. CONFIRMATION: Summarize collected information and confirm with the patient.
4. RECOMMENDATION: Recommend appropriate specialist type based on symptoms.

TREATMENT CATEGORIES:
- Dental: Issues with teeth, gums, oral cavity, jaw pain, dental procedures
- Hair: Hair loss, baldness, scalp issues, hair transplantation needs
- Cosmetic: Skin concerns, facial aesthetics, wrinkles, beauty procedures, plastic surgery
- IVF/Fertility: Conception difficulties, reproductive health, pregnancy planning

CONVERSATION RULES:
- Always maintain context between messages
- If a user provides vague information, ask specific follow-up questions
- If a user mentions symptoms for multiple categories, ask which is their primary concern
- If a user corrects information, acknowledge and update your understanding
- If a user greets without symptoms, ask for symptoms without assuming any condition
- Never fabricate medical advice or diagnoses
- If symptoms don't clearly match a category, ask clarifying questions
- Track conversation state to avoid repeating questions
- If symptoms don't match any category, default to recommending general physician

MEMORY REQUIREMENTS:
- Remember all previous user inputs in the conversation
- Don't ask for information the user has already provided
- If user mentions new symptoms later in conversation, incorporate them

RESPONSE FORMAT:
- For internal processing, track: {treatmentType: string, details: {duration: string, severity: number, area: string}, conversationStage: string}
- Final output should be valid JSON: {treatmentType: string, details: {duration: string, severity: number, area: string}}

EDGE CASES:
- If user mentions emergency symptoms (difficulty breathing, severe bleeding, unconsciousness, chest pain), immediately advise seeking emergency care
- If user is asking on behalf of someone else, continue assessment but note this fact
- If user provides non-medical queries, gently redirect to symptom assessment
- If user mentions mental health concerns, categorize appropriately and proceed with sensitivity
- If user mentions pediatric issues, note the patient is a child
- If user mentions chronic conditions, incorporate this into your assessment

EXAMPLES:
User: "I have a toothache"
Assistant: "I'm sorry to hear about your toothache. How long have you been experiencing this pain?"

User: "Hello"
Assistant: "Hello! I'm here to help you find the right medical care. Could you please describe any symptoms or health concerns you're experiencing?"

User: "My hair is falling out and I have a cavity"
Assistant: "I understand you're experiencing both hair loss and a dental issue. Which concern would you like to address primarily today?"

User: "I've been trying to conceive for 6 months"
Assistant: "Thank you for sharing that. Have you consulted with any fertility specialists previously?"

IMPORTANT: Always maintain a professional, empathetic tone. Prioritize user privacy and data security. Do not ask for personally identifiable information.`;
const FALLBACK_RESPONSE = "Sorry, I'm having trouble. Please try again.";
const TIMEOUT_MS = 10000; // 10 seconds

const AIChat = () => {
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
    patientContext: {}
  });
  const [previousResponses, setPreviousResponses] = useState(new Set());
  const [showRecommendations, setShowRecommendations] = useState(false);
  const theme = useTheme();

  const detectSymptoms = (message) => {
    const lowerMessage = message.toLowerCase();
    
    console.log("Analyzing message:", lowerMessage);
    
    // Expanded keyword sets for better detection
    const hairKeywords = ['hair', 'bald', 'scalp', 'thinning', 'hairline', 'receding', 'transplant'];
    const dentalKeywords = ['tooth', 'teeth', 'gum', 'dental', 'dentist', 'cavity', 'filling', 'root canal', 'crown', 'braces', 'jaw'];
    const cosmeticKeywords = ['skin', 'wrinkle', 'acne', 'botox', 'filler', 'cosmetic', 'beauty', 'face', 'plastic surgery', 'aesthetic'];
    const ivfKeywords = ['fertility', 'ivf', 'pregnant', 'conceive', 'conception', 'sperm', 'egg', 'embryo', 'period', 'menstrual'];
    
    // Directly check for hair-related keywords
    if (hairKeywords.some(keyword => lowerMessage.includes(keyword))) {
      console.log("Hair symptoms detected");
      return { detectedType: 'hair', hasSymptoms: true };
    }
    
    // Check for dental-related keywords
    if (dentalKeywords.some(keyword => lowerMessage.includes(keyword))) {
      console.log("Dental symptoms detected");
      return { detectedType: 'dental', hasSymptoms: true };
    }
    
    // Check for cosmetic-related keywords
    if (cosmeticKeywords.some(keyword => lowerMessage.includes(keyword))) {
      console.log("Cosmetic symptoms detected");
      return { detectedType: 'cosmetic', hasSymptoms: true };
    }
    
    // Check for IVF-related keywords
    if (ivfKeywords.some(keyword => lowerMessage.includes(keyword))) {
      console.log("IVF symptoms detected");
      return { detectedType: 'ivf', hasSymptoms: true };
    }
    
    console.log("No specific symptoms detected");
    return { detectedType: null, hasSymptoms: false };
  };

  const generateResponse = () => {
    const { stage, detectedType, duration, severity, area, patientContext } = conversationState;
    const userMessages = messages.filter(msg => msg.sender === 'user');
    const lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1].text : '';
    
    // Combine all user messages to analyze context
    const allUserText = userMessages.map(msg => msg.text).join(' ');
    
    console.log("Current conversation state:", { stage, detectedType, userMessages: userMessages.length });
    console.log("Last user message:", lastUserMessage);
    
    // First, check if this is about hair regardless of stage
    if (lastUserMessage.toLowerCase().includes('hair')) {
      console.log("Hair mention detected directly");
      
      if (stage === 'initial') {
        setConversationState(prev => ({
          ...prev,
          stage: 'asking_details',
          detectedType: 'hair'
        }));
        
        return "I understand you're experiencing hair-related concerns. Could you please tell me more specifically what issues you're facing with your hair? For example, is it hair loss, dandruff, or something else?";
      }
    }
    
    // Check for greetings or very short messages
    if (userMessages.length === 1 && 
        (lastUserMessage.includes('hello') || 
         lastUserMessage.includes('hi') || 
         lastUserMessage.length < 10)) {
      return "Hello! I'm here to help you find the right specialist. Could you please describe your symptoms or health concerns in detail?";
    }
    
    // Check for confusion or repetition complaints
    if (lastUserMessage.includes('what') || 
        lastUserMessage.includes('repeat') || 
        lastUserMessage.includes('same') ||
        lastUserMessage.includes('again')) {
      
      // Analyze what stage we should be in based on conversation
      const { detectedType: overallType, hasSymptoms: overallHasSymptoms } = detectSymptoms(allUserText);
      
      if (overallType === 'dental') {
        setConversationState(prev => ({...prev, detectedType: 'dental', stage: 'asking_duration'}));
        return "I see you mentioned dental issues. How long have you been experiencing problems with your teeth?";
      } else if (overallType === 'hair') {
        setConversationState(prev => ({...prev, detectedType: 'hair', stage: 'asking_duration'}));
        return "I understand you're having hair-related concerns. How long have you been noticing these hair problems?";
      } else if (overallType === 'cosmetic') {
        setConversationState(prev => ({...prev, detectedType: 'cosmetic', stage: 'asking_duration'}));
        return "I see you're interested in cosmetic treatments. How long have you been concerned about this issue?";
      } else if (overallType === 'ivf') {
        setConversationState(prev => ({...prev, detectedType: 'ivf', stage: 'asking_duration'}));
        return "I understand you're interested in fertility treatments. How long have you been trying to conceive?";
      } else {
        return "I apologize for the confusion. Could you please tell me more specifically what medical concerns you're experiencing?";
      }
    }
    
    // Check for symptoms in initial message
    if (stage === 'initial' || userMessages.length <= 2) {
      // First check directly for hair-related terms
      if (lastUserMessage.toLowerCase().includes('hair') || 
          lastUserMessage.toLowerCase().includes('bald') || 
          lastUserMessage.toLowerCase().includes('thinning')) {
        
        console.log("Direct hair mention detected in initial message");
        setConversationState(prev => ({
          ...prev,
          stage: 'asking_details',
          detectedType: 'hair'
        }));
        
        return "I understand you're experiencing hair-related concerns. How long have you been noticing these issues with your hair?";
      }
      
      // Then proceed with the regular detection logic
      const { detectedType: initialType, hasSymptoms } = detectSymptoms(lastUserMessage);
      console.log("Initial detection results:", { initialType, hasSymptoms });
      
      // If we've detected a specific treatment type, move forward with it
      if (initialType) {
        setConversationState(prev => ({
          ...prev,
          stage: 'asking_details',
          detectedType: initialType
        }));
        
        if (initialType === 'hair') {
          return "I'm sorry to hear you're experiencing hair concerns. Can you tell me more specifically what you're noticing? For example, is it hair loss, thinning, or scalp issues?";
        } else if (initialType === 'dental') {
          return "I understand you're having dental issues. Could you share a bit more about what you're experiencing? Is there any pain or discomfort involved?";
        } else if (initialType === 'cosmetic') {
          return "Thanks for sharing your interest in cosmetic treatments. What specific concerns would you like to address?";
        } else if (initialType === 'ivf') {
          return "Thank you for sharing your interest in fertility treatments. Have you consulted with any specialists before, or is this your first time seeking care for this concern?";
        }
      }
      
      // If no symptoms detected but user mentioned something medical sounding
      if (lastUserMessage.length > 15 || lastUserMessage.includes('problem') || lastUserMessage.includes('issue') || lastUserMessage.includes('concern')) {
        // Try to extract meaning from context
        if (lastUserMessage.toLowerCase().includes('hair')) {
          setConversationState(prev => ({
            ...prev,
            stage: 'asking_details',
            detectedType: 'hair'
          }));
          
          return "I see you mentioned hair issues. Could you tell me more about what specific hair problems you're experiencing?";
        }
      }
      
      // Default response for initial stage with no clear symptoms
      if (!hasSymptoms && !initialType) {
        return "I'd like to help you find the right medical care. Could you tell me a bit more about any specific symptoms you're experiencing?";
      }
    }
    
    // Asking for duration
    if (stage === 'asking_details') {
      // Extract more context from the detailed description
      const detailedDescription = lastUserMessage;
      let updatedType = detectedType;
      
      // Try to detect type again if not already set
      if (!updatedType) {
        const { detectedType: newType } = detectSymptoms(detailedDescription);
        updatedType = newType || detectSymptoms(allUserText).detectedType;
      }
      
      setConversationState(prev => ({
        ...prev,
        stage: 'asking_duration',
        detectedType: updatedType,
        patientContext: {
          ...prev.patientContext,
          detailedDescription: detailedDescription
        }
      }));
      
      return "Thank you for those details. How long have you been experiencing these symptoms? Please let me know if it's been days, weeks, months, or years.";
    }
    
    // Asking for severity
    if (stage === 'asking_duration') {
      setConversationState(prev => ({
        ...prev,
        stage: 'asking_severity',
        duration: lastUserMessage
      }));
      
      return "I see you've been dealing with this for " + lastUserMessage + ". On a scale of 1 to 10, with 10 being the most severe, how would you rate the intensity of your symptoms or concern?";
    }
    
    // Asking for affected area if not already provided
    if (stage === 'asking_severity') {
      const severityRating = parseInt(lastUserMessage) || 5;
      
      setConversationState(prev => ({
        ...prev,
        stage: 'asking_area',
        severity: severityRating
      }));
      
      if (detectedType === 'hair') {
        return "Thank you. Could you specify which areas of your scalp or hairline are most affected? For example, is it the crown, temples, or overall thinning?";
      } else if (detectedType === 'dental') {
        return "Thank you. Could you please point out which specific teeth or areas in your mouth are affected? For example, is it upper/lower, left/right, front/back teeth?";
      } else if (detectedType === 'cosmetic') {
        return "Thank you. Could you specify which areas you're looking to address with cosmetic treatments? For example, is it facial wrinkles, acne scars, or body contouring?";
      } else if (detectedType === 'ivf') {
        return "Thank you. Have you had any previous fertility assessments or treatments? This will help me recommend the most appropriate specialist for your needs.";
      } else {
        return "Thank you. Could you please specify exactly which part of your body is affected by these symptoms?";
      }
    }
    
    // Confirmation and summary
    if (stage === 'asking_area') {
      const affectedArea = lastUserMessage;
      
      setConversationState(prev => ({
        ...prev,
        stage: 'confirming',
        area: affectedArea
      }));
      
      // Determine treatment type if not already set
      let finalTreatmentType = detectedType;
      if (!finalTreatmentType) {
        const { detectedType: overallType } = detectSymptoms(allUserText);
        finalTreatmentType = overallType || 'general';
      }
      
      // Create a properly formatted summary with the correct information
      const summary = `You're experiencing ${finalTreatmentType} concerns.
Duration: ${duration || 'unknown'}
Severity: ${severity || 0}/10
Affected Area: ${affectedArea || 'unspecified'}`;

      return `Thank you for providing all this information. Let me summarize what I understand: ${summary}

Is this information correct? If not, please let me know what needs to be corrected.`;
    }
    
    // Process confirmation and provide recommendations
    if (stage === 'confirming') {
      // Check if user confirmed or wants to make corrections
      if (lastUserMessage.toLowerCase().includes('no') || 
          lastUserMessage.toLowerCase().includes('incorrect') || 
          lastUserMessage.toLowerCase().includes('wrong')) {
        return "I apologize for the misunderstanding. Could you please correct the information so I can better assist you?";
      }
      
      setConversationState(prev => ({
        ...prev,
        stage: 'recommending'
      }));
      
      // Create treatment details object for clinic recommendation
      const details = {
        treatmentType: detectedType || 'general',
        details: {
          duration: duration || "unknown",
          severity: severity || 5,
          area: area || "unspecified"
        }
      };
      
      // Set treatment details for clinic recommendation
      setTreatmentDetails(details);
      
      return `Thank you for confirming. Based on your symptoms and concerns, I recommend seeing a ${details.treatmentType} specialist.

I'm now searching for the best clinics that specialize in ${details.treatmentType} care in your area...`;
    }
    
    // Default response if no conditions match
    return "I'm here to help with your medical needs. Could you please provide more details about your symptoms or concerns?";
  };

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
      // First try to detect symptoms locally
      const { detectedType, hasSymptoms } = detectSymptoms(userMessage);
      
      if (detectedType && !treatmentDetails) {
        console.log(`Detected ${detectedType} symptoms locally`);
        setConversationState(prev => ({
          ...prev,
          detectedType,
          stage: 'asking_details'
        }));
        
        // If we've detected a treatment type and we're in the final stage, show recommendations
        if (conversationState.stage === 'recommending' || messages.length > 6) {
          setTreatmentDetails({
            treatmentType: detectedType,
            details: {
              duration: conversationState.duration || "recently",
              severity: conversationState.severity || 5,
              area: conversationState.area || "unspecified"
            }
          });
          
          setShowRecommendations(true);
          
          // Add AI response about showing recommendations
          setMessages([...updatedMessages, { 
            text: `Based on your symptoms, I recommend seeing a specialist for ${detectedType} treatment. I've found some highly-rated clinics for you below.`, 
            sender: 'ai' 
          }]);
          
          setLoading(false);
          return;
        }
      }
      
      // Generate response using our local function
      const aiResponse = generateResponse();
      
      if (aiResponse) {
        // Check if we've already said this exact response
        if (previousResponses.has(aiResponse)) {
          console.log("Avoiding duplicate response");
          setMessages([...updatedMessages, { 
            text: "I think I can help you better by recommending some clinics based on what you've told me. Let me show you some options.", 
            sender: 'ai' 
          }]);
          
          // If we're repeating ourselves, move to recommendation stage
          if (!treatmentDetails && conversationState.detectedType) {
            setTreatmentDetails({
              treatmentType: conversationState.detectedType,
              details: {
                duration: conversationState.duration || "recently",
                severity: conversationState.severity || 5,
                area: conversationState.area || "unspecified"
              }
            });
            setShowRecommendations(true);
          }
        } else {
          // Add the response to our set of previous responses
          setPreviousResponses(prev => new Set(prev).add(aiResponse));
          setMessages([...updatedMessages, { text: aiResponse, sender: 'ai' }]);
        }
        
        setLoading(false);
        return;
      }
      
      // If local response generation failed, try the API
      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      
      // Add the new user message
      conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });
      
      // Add system prompt at the beginning
      conversationHistory.unshift({
        role: 'system',
        parts: [{ text: SYSTEM_PROMPT }]
      });
      
      const response = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: conversationHistory,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1000,
            },
          }),
        },
        TIMEOUT_MS
      );
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponseText = data.candidates[0].content.parts[0].text;
        
        // Try to extract treatment details from the response
        try {
          // Look for JSON in the response
          const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonStr = jsonMatch[0];
            const extractedDetails = JSON.parse(jsonStr);
            
            if (extractedDetails.treatmentType) {
              console.log("Extracted treatment details:", extractedDetails);
              setTreatmentDetails(extractedDetails);
              setShowRecommendations(true);
            }
          }
        } catch (error) {
          console.error("Error parsing treatment details:", error);
        }
        
        setMessages([...updatedMessages, { text: aiResponseText, sender: 'ai' }]);
      } else {
        throw new Error('Invalid response from API');
      }
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
      patientContext: {}
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

function fetchWithTimeout(url, options, timeout) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

function sanitizeInput(input) {
  // Implement input sanitization against prompt injection attacks
  return input;
}

export default AIChat;
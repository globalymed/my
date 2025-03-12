import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import './AIChat.css';
import ClinicRecommender from './ClinicRecommender';

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

  useEffect(() => {
    const history = localStorage.getItem('chatHistory');
    if (history) {
      const parsedHistory = JSON.parse(history);
      setMessages(parsedHistory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

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
    if (!input.trim()) return;

    // Add user message to chat
    const newUserMessage = { text: input, sender: 'user' };
    
    // Update messages state
    setMessages(prev => {
      const updatedMessages = [...prev, newUserMessage];
      
      // Generate response based on the updated messages
      setTimeout(() => {
        // Get current conversation state
        const currentState = conversationState;
        console.log("Current state before processing:", currentState);
        
        // Get all user messages including the one just added
        const allUserMessages = updatedMessages.filter(msg => msg.sender === 'user');
        const lastMsg = allUserMessages[allUserMessages.length - 1].text;
        
        console.log("Generating response for:", lastMsg);
        
        // Set loading state
        setLoading(true);
        
        let aiResponse = "";
        
        // If we're already in a specific treatment context, stay in that context
        if (currentState.detectedType) {
          console.log("Continuing conversation in context:", currentState.detectedType);
          
          // Process the message based on the current stage
          if (currentState.stage === 'asking_details') {
            // Move to asking duration
            setConversationState(prev => ({
              ...prev,
              stage: 'asking_duration',
              patientContext: {
                ...prev.patientContext,
                detailedDescription: lastMsg
              }
            }));
            
            aiResponse = "Thank you for those details. How long have you been experiencing these hair issues? Please let me know if it's been days, weeks, months, or years.";
          } 
          else if (currentState.stage === 'asking_duration') {
            // Move to asking severity
            setConversationState(prev => ({
              ...prev,
              stage: 'asking_severity',
              duration: lastMsg
            }));
            
            aiResponse = "I see you've been dealing with this for " + lastMsg + ". On a scale of 1 to 10, with 10 being the most severe, how would you rate the intensity of your hair thinning?";
          }
          else if (currentState.stage === 'asking_severity') {
            // Move to asking area
            const severityRating = parseInt(lastMsg) || 5;
            
            setConversationState(prev => ({
              ...prev,
              stage: 'asking_area',
              severity: severityRating
            }));
            
            if (currentState.detectedType === 'hair') {
              aiResponse = "Thank you. Could you specify which areas of your scalp or hairline are most affected? For example, is it the crown, temples, or overall thinning?";
            }
          }
          else if (currentState.stage === 'asking_area') {
            // Move to confirmation
            setConversationState(prev => ({
              ...prev,
              stage: 'confirming',
              area: lastMsg
            }));
            
            aiResponse = `Thank you for providing all this information. Let me confirm what I understand:
            
            - You're experiencing hair thinning
            - You've been dealing with this for ${currentState.duration || "some time"}
            - The severity is ${currentState.severity || "moderate"} out of 10
            - The affected area is ${lastMsg}
            
            Is this correct? If so, I'll recommend some hair specialists for you.`;
          }
          else {
            // Use the regular generateResponse logic
            aiResponse = generateResponse();
          }
        } else {
          // If no context yet, use the regular detection logic
          const { detectedType, hasSymptoms } = detectSymptoms(lastMsg);
          console.log("Detection results:", { detectedType, hasSymptoms });
          
          if (detectedType) {
            setConversationState(prev => ({
              ...prev,
              stage: 'asking_details',
              detectedType: detectedType
            }));
            
            if (detectedType === 'hair') {
              aiResponse = "I understand you're experiencing hair-related concerns. Could you tell me more about what specific issues you're noticing with your hair?";
            } else {
              aiResponse = generateResponse();
            }
          } else {
            aiResponse = generateResponse();
          }
        }
        
        // Add AI response to messages
        setMessages(currentMsgs => [...currentMsgs, { text: aiResponse, sender: 'ai' }]);
        setLoading(false);
      }, 100);
      
      return updatedMessages;
    });
    
    // Clear input field
    setInput('');
  };

  const formatResponse = (response) => {
    return `I understand you're looking for ${response.treatmentType} treatment.
Duration: ${response.details.duration}
Severity: ${response.details.severity}/10
Affected Area: ${response.details.area}

Let me find the best clinics for you...`;
  };

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    setMessages(prev => [...prev, {
      text: `I recommend ${clinic.name}. This clinic specializes in ${clinic.services.join(', ')} and has excellent reviews. Would you like to schedule an appointment?`,
      sender: 'ai'
    }]);
  };
  
  const resetChat = () => {
    setMessages([
      { text: "Hello! I'm your MedYatra AI assistant. Please describe your symptoms or medical needs, and I'll help you find the right clinic.", sender: 'ai' }
    ]);
    setTreatmentDetails(null);
    setConversationState({
      stage: 'initial',
      detectedType: null,
      duration: null,
      severity: null,
      area: null,
      patientContext: {}
    });
    setPreviousResponses(new Set());
    localStorage.removeItem('chatHistory');
  };
  
  return (
    <Box className="ai-chat">
      <Typography variant="h5" className="header">
        MedYatra AI Assistant
      </Typography>
      <Box className="chat-history" ref={chatRef}>
        {messages.map((msg, idx) => (
          <Box 
            key={idx}
            className={`chat-bubble ${msg.sender}`}
          >
            {msg.text}
          </Box>
        ))}
        {loading && (
          <Box className="chat-bubble ai loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </Box>
        )}
      </Box>
      
      {/* Only show ClinicRecommender when treatment details are available */}
      {treatmentDetails && conversationState.stage === 'recommending' && (
        <ClinicRecommender
          treatmentType={treatmentDetails.treatmentType}
          onClinicSelect={handleClinicSelect}
        />
      )}
      
      <form onSubmit={handleSubmit} className="input-form">
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms or medical needs..."
          variant="outlined"
          fullWidth
          aria-label="Chat input"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
        {messages.length > 1 && (
          <Button onClick={resetChat} variant="outlined" color="secondary">
            Reset
          </Button>
        )}
      </form>
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
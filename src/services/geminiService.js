// Direct API approach for Gemini
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyArjTDiaJOVP2wYoyKELb5nIuBVtXBWVoM";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent?key=${API_KEY}`;

// Add debugging to check if API key is available
console.log("Gemini API Key available:", !!API_KEY);

// Function to create a chat session with Gemini
export const createChatSession = async () => {
  try {
    // Create a simple chat session object to track conversation history
    const chatSession = {
      history: [
        {
          role: "user",
          parts: [{ text: "I need help finding medical treatment." }]
        },
        {
          role: "model",
          parts: [{ text: "Hi there! I'm your MedYatra assistant. I'm here to help you find the right care for your needs. Could you share what brings you here today?" }]
        }
      ],
      // Track conversation state
      state: {
        medicalIssue: null,
        location: null,
        appointmentDate: null,
        treatmentType: null,
        currentQuestion: "symptoms", // Start by asking about symptoms
        askedQuestions: new Set(["greeting"]), // Track questions we've already asked
        previousResponses: [], // Track previous AI responses to avoid repetition
        missingParameters: ["medicalIssue", "treatmentType", "location", "appointmentDate"] // Track missing parameters
      },
      // Method to add a message to history
      addMessage: function(role, text) {
        this.history.push({
          role,
          parts: [{ text }]
        });
        
        // If this is an AI response, add it to the previous responses
        if (role === "model") {
          this.state.previousResponses.push(text);
          // Keep only the last 5 responses to avoid memory issues
          if (this.state.previousResponses.length > 5) {
            this.state.previousResponses.shift();
          }
        }
      },
      // Method to get full conversation history
      getHistory: function() {
        return this.history;
      },
      // Method to update state
      updateState: function(updates) {
        // Merge updates with current state
        this.state = { ...this.state, ...updates };
        
        // If updates include askedQuestions, merge the sets instead of replacing
        if (updates.askedQuestions) {
          this.state.askedQuestions = new Set([
            ...Array.from(this.state.askedQuestions || []),
            ...Array.from(updates.askedQuestions || [])
          ]);
          delete updates.askedQuestions; // Remove from updates to avoid double processing
        }
        
        // Update missing parameters based on current state
        this.updateMissingParameters();
      },
      // Method to update missing parameters
      updateMissingParameters: function() {
        const missing = [];
        if (!this.state.medicalIssue) missing.push("medicalIssue");
        if (!this.state.treatmentType) missing.push("treatmentType");
        if (!this.state.location) missing.push("location");
        if (!this.state.appointmentDate) missing.push("appointmentDate");
        this.state.missingParameters = missing;
      },
      // Method to get current state
      getState: function() {
        return this.state;
      },
      // Method to check if a question has been asked
      hasAskedQuestion: function(questionType) {
        return this.state.askedQuestions.has(questionType);
      },
      // Method to mark a question as asked
      markQuestionAsked: function(questionType) {
        this.state.askedQuestions.add(questionType);
      },
      // Method to check if a response is too similar to previous responses
      isResponseRepetitive: function(response) {
        if (!response || this.state.previousResponses.length === 0) return false;
        
        return this.state.previousResponses.some(prevResponse => {
          // Check for exact match
          if (prevResponse === response) return true;
          
          // Check for high similarity (80% of words are the same)
          const prevWords = new Set(prevResponse.toLowerCase().split(/\s+/).filter(w => w.length > 3));
          const newWords = new Set(response.toLowerCase().split(/\s+/).filter(w => w.length > 3));
          
          // Count common words
          let commonWords = 0;
          for (const word of newWords) {
            if (prevWords.has(word)) commonWords++;
          }
          
          // Calculate similarity
          const similarity = commonWords / Math.max(prevWords.size, newWords.size);
          return similarity > 0.8; // 80% similarity threshold
        });
      },
      // Method to check if all required parameters are collected
      hasAllRequiredParameters: function() {
        return this.state.missingParameters.length === 0;
      }
    };
    
    console.log("Chat session created successfully");
    return chatSession;
  } catch (error) {
    console.error("Error creating chat session:", error);
    return null;
  }
};

// Function to send a message to the Gemini API and get a response
export const sendMessage = async (chatSession, message) => {
  try {
    // Check if chat session exists
    if (!chatSession) {
      console.error("No active chat session available");
      return getEmpathicResponse("fallback", null);
    }

    console.log("Sending message to Gemini:", message);
    
    // Add user message to chat history
    chatSession.addMessage("user", message);
    
    // First, try to extract information from the user message
    const extractedInfo = extractInfoFromMessage(message);
    const currentState = chatSession.getState();
    
    // Update the chat session state with any extracted information
    const updatedState = {
      medicalIssue: extractedInfo.medicalIssue || currentState.medicalIssue,
      location: extractedInfo.location || currentState.location,
      appointmentDate: extractedInfo.appointmentDate || currentState.appointmentDate,
      treatmentType: extractedInfo.treatmentType || currentState.treatmentType
    };
    
    chatSession.updateState(updatedState);
    
    // Log the current state to help with debugging
    console.log("Updated state after extraction:", updatedState);
    console.log("Missing parameters:", chatSession.state.missingParameters);
    
    // Determine what information we still need based on the missing parameters
    let nextQuestion;
    
    // Enforce strict parameter collection sequence
    if (chatSession.state.missingParameters.includes("medicalIssue")) {
      nextQuestion = "symptoms";
    } else if (chatSession.state.missingParameters.includes("treatmentType")) {
      nextQuestion = "treatmentType";
    } else if (chatSession.state.missingParameters.includes("location")) {
      nextQuestion = "location";
    } else if (chatSession.state.missingParameters.includes("appointmentDate")) {
      nextQuestion = "appointmentDate";
    } else {
      // Only if we have all parameters
      nextQuestion = "complete";
    }
    
    console.log("Next question to ask:", nextQuestion);
    
    // If we've already asked this question, try to find a different approach
    if (chatSession.hasAskedQuestion(nextQuestion) && nextQuestion !== "complete") {
      // Find an alternative question or rephrase
      const alternativeQuestion = findAlternativeQuestion(nextQuestion, updatedState, message);
      chatSession.updateState({ currentQuestion: alternativeQuestion });
      chatSession.markQuestionAsked(alternativeQuestion);
      
      console.log("Using alternative question:", alternativeQuestion);
      
      // Double-check that we're not recommending a clinic prematurely
      if (alternativeQuestion === "complete" && chatSession.hasAllRequiredParameters()) {
        const response = getEmpathicResponse("complete", updatedState);
        chatSession.addMessage("model", response);
        return response;
      } else if (alternativeQuestion === "complete") {
        // If we don't have all information but somehow got "complete", ask for missing info
        const missingParam = chatSession.state.missingParameters[0];
        const fallbackQuestion = missingParamToQuestion(missingParam);
        const response = getEmpathicResponse(fallbackQuestion, updatedState, message);
        chatSession.addMessage("model", response);
        return response;
      }
      
      const response = getEmpathicResponse(alternativeQuestion, updatedState, message);
      
      // Check if the response is too repetitive
      if (chatSession.isResponseRepetitive(response)) {
        console.log("Generated response is too repetitive, creating a variation");
        const variedResponse = createResponseVariation(alternativeQuestion, updatedState, message);
        chatSession.addMessage("model", variedResponse);
        return variedResponse;
      }
      
      chatSession.addMessage("model", response);
      return response;
    }
    
    // Mark this question as asked
    chatSession.updateState({ currentQuestion: nextQuestion });
    chatSession.markQuestionAsked(nextQuestion);
    
    // Double-check that we're not recommending a clinic prematurely
    if (nextQuestion === "complete" && chatSession.hasAllRequiredParameters()) {
      const response = getEmpathicResponse("complete", updatedState);
      chatSession.addMessage("model", response);
      return response;
    } else if (nextQuestion === "complete") {
      // If we don't have all information but somehow got "complete", ask for missing info
      const missingParam = chatSession.state.missingParameters[0];
      const fallbackQuestion = missingParamToQuestion(missingParam);
      const response = getEmpathicResponse(fallbackQuestion, updatedState, message);
      chatSession.addMessage("model", response);
      return response;
    }
    
    // Try to get a response from Gemini API
    try {
      // Create a system instruction to guide the model
      const systemInstruction = `
        You are a medical assistant for MedYatra. Be empathetic, warm, and human-like in your responses.
        
        The user has shared: "${message}"
        
        Current information:
        - Medical Issue: ${updatedState.medicalIssue || "Unknown"}
        - Location Preference: ${updatedState.location || "Unknown"}
        - Appointment Date: ${updatedState.appointmentDate || "Unknown"}
        - Treatment Type: ${updatedState.treatmentType || "Unknown"}
        
        Your next task is to ask about: ${nextQuestion}
        
        Missing parameters: ${chatSession.state.missingParameters.join(", ")}
        
        Guidelines:
        1. Keep your response brief (50-80 words)
        2. First acknowledge what the user said with 1-2 empathetic sentences
        3. Then ask ONE clear question about ${nextQuestion} in a conversational way
        4. DO NOT recommend a clinic yet - we still need to collect: ${chatSession.state.missingParameters.join(", ")}
        5. DO NOT ask questions they've already answered
        6. If asking about treatment type, don't expect them to know specific treatments - ask about their goals instead
        7. Be warm and supportive
        8. IMPORTANT: Vary your phrasing to avoid repetition
        
        Previous questions asked: ${Array.from(chatSession.getState().askedQuestions).join(", ")}
        Previous responses (to avoid repetition): ${chatSession.state.previousResponses.slice(-2).join(" | ")}
      `;
      
      // Prepare the request payload
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: systemInstruction }]
          }
        ],
        generationConfig: {
          temperature: 0.7, // Higher temperature for more natural responses
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200, // Allow slightly longer responses for empathy
        }
      };
      
      // Make the API request
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract the response text
      let responseText = "";
      if (data.candidates && data.candidates[0] && data.candidates[0].content && 
          data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        responseText = data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected API response format");
      }
      
      // Check if the response is too repetitive
      if (chatSession.isResponseRepetitive(responseText)) {
        console.log("Response is too repetitive, trying again");
        // Try to get a different response from Gemini API
        try {
          // Create a system instruction to guide the model
          const alternativeSystemInstruction = `
            You are a medical assistant for MedYatra. Be empathetic, warm, and human-like in your responses.
            
            The user has shared: "${message}"
            
            Current information:
            - Medical Issue: ${updatedState.medicalIssue || "Unknown"}
            - Location Preference: ${updatedState.location || "Unknown"}
            - Appointment Date: ${updatedState.appointmentDate || "Unknown"}
            - Treatment Type: ${updatedState.treatmentType || "Unknown"}
            
            Your next task is to ask about: ${nextQuestion}
            
            Guidelines:
            1. Keep your response brief (50-80 words)
            2. First acknowledge what the user said with 1-2 empathetic sentences
            3. Then ask ONE clear question about ${nextQuestion} in a conversational way
            4. DO NOT recommend a clinic yet
            5. DO NOT ask questions they've already answered
            6. If asking about treatment type, don't expect them to know specific treatments - ask about their goals instead
            7. Be warm and supportive
            
            Previous questions asked: ${Array.from(chatSession.getState().askedQuestions).join(", ")}
            
            Please provide a different response from the previous one.
          `;
          
          // Prepare the request payload
          const alternativePayload = {
            contents: [
              {
                role: "user",
                parts: [{ text: alternativeSystemInstruction }]
              }
            ],
            generationConfig: {
              temperature: 0.7, // Higher temperature for more natural responses
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 200, // Allow slightly longer responses for empathy
            }
          };
          
          // Make the API request
          const alternativeResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(alternativePayload)
          });
          
          if (!alternativeResponse.ok) {
            throw new Error(`API request failed with status ${alternativeResponse.status}`);
          }
          
          const alternativeData = await alternativeResponse.json();
          
          // Extract the response text
          let alternativeResponseText = "";
          if (alternativeData.candidates && alternativeData.candidates[0] && alternativeData.candidates[0].content && 
              alternativeData.candidates[0].content.parts && alternativeData.candidates[0].content.parts[0]) {
            alternativeResponseText = alternativeData.candidates[0].content.parts[0].text;
          } else {
            throw new Error("Unexpected API response format");
          }
          
          // Add AI response to chat history
          chatSession.addMessage("model", alternativeResponseText);
          
          console.log("Received alternative response from Gemini:", alternativeResponseText);
          return alternativeResponseText;
        } catch (apiError) {
          console.error("Error getting alternative response from Gemini API:", apiError);
          // Fall back to structured response
          const response = getEmpathicResponse(nextQuestion, updatedState, message);
          chatSession.addMessage("model", response);
          return response;
        }
      }
      
      // Add AI response to chat history
      chatSession.addMessage("model", responseText);
      
      console.log("Received response from Gemini:", responseText);
      return responseText;
    } catch (apiError) {
      console.error("Error getting response from Gemini API:", apiError);
      // Fall back to structured response
      const response = getEmpathicResponse(nextQuestion, updatedState, message);
      
      // Check if the response is too repetitive
      if (chatSession.isResponseRepetitive(response)) {
        console.log("Fallback response is too repetitive, creating a variation");
        const variedResponse = createResponseVariation(nextQuestion, updatedState, message);
        chatSession.addMessage("model", variedResponse);
        return variedResponse;
      }
      
      chatSession.addMessage("model", response);
      return response;
    }
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return getEmpathicResponse("fallback", null);
  }
};

// Helper function to convert a missing parameter to a question type
const missingParamToQuestion = (param) => {
  switch (param) {
    case "medicalIssue": return "symptoms";
    case "treatmentType": return "treatmentType";
    case "location": return "location";
    case "appointmentDate": return "appointmentDate";
    default: return "symptoms";
  }
};

// Helper function to create a variation of a response to avoid repetition
const createResponseVariation = (questionType, state, userMessage) => {
  // Create variations for each question type
  const variations = {
    symptoms: [
      "I'd love to help you find the right care. Could you tell me what health concerns you're experiencing?",
      "To connect you with the best treatment, I need to understand your symptoms. What's been troubling you?",
      "Let's start by understanding your health concerns. What symptoms or issues have you been experiencing?"
    ],
    symptomsAlternative: [
      "To better assist you, could you share what specific health issues you're facing?",
      "I want to make sure I understand your needs correctly. What health concerns brought you to MedYatra?",
      "It would help me to know more about your specific health situation. What symptoms are you experiencing?"
    ],
    treatmentType: [
      "Thanks for sharing that. What kind of improvement are you hoping to see from treatment?",
      "I appreciate you telling me about your situation. What outcome are you looking for from treatment?",
      "Based on what you've shared, what are your goals for treatment?"
    ],
    location: [
      "Which city or area would be most convenient for your treatment?",
      "Where would you prefer to receive your care? Any specific location in mind?",
      "To find clinics near you, could you share which area you're located in?"
    ],
    appointmentDate: [
      "When would be a good time for you to start treatment?",
      "Do you have a preferred timeframe for your appointment?",
      "Is there a particular date or day of the week that works best for your schedule?"
    ],
    fallback: [
      "I'm here to help you find the right care. Could you tell me more about your health concerns?",
      "To better assist you, I'd like to understand what brought you to MedYatra today.",
      "I want to make sure I find the right care for you. Could you share what health issues you're experiencing?"
    ]
  };
  
  // Get variations for the question type or use fallback
  const questionVariations = variations[questionType] || variations.fallback;
  
  // Select a random variation
  const randomIndex = Math.floor(Math.random() * questionVariations.length);
  return questionVariations[randomIndex];
};

// Function to extract medical information from the conversation
export const extractMedicalInfo = async (conversation) => {
  try {
    console.log("Extracting medical info from conversation");
    
    // First try to extract info using our local function
    const lastUserMessage = conversation.split('\n').filter(line => 
      line.startsWith('User:') || line.includes(': ') && !line.startsWith('AI:')
    ).pop();
    
    if (lastUserMessage) {
      const userText = lastUserMessage.replace(/^.*?: /, '').trim();
      const localExtraction = extractInfoFromMessage(userText);
      
      // If we found something locally, return it
      if (localExtraction.medicalIssue || localExtraction.location || 
          localExtraction.appointmentDate || localExtraction.treatmentType) {
        console.log("Locally extracted medical info:", localExtraction);
        return localExtraction;
      }
    }
    
    // If local extraction failed, try the API
    try {
      // Prepare the request payload
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ 
              text: `
                Based on this conversation, extract ONLY these fields:
                1. Medical problem/symptoms
                2. Desired location for treatment
                3. Preferred appointment date
                
                Return ONLY a JSON object with these fields:
                {
                  "medicalIssue": "extracted issue or null",
                  "location": "extracted location or null",
                  "appointmentDate": "extracted date or null",
                  "treatmentType": "one of: 'ivf', 'cosmetic', 'hair', 'dental' or null"
                }
                
                Conversation:
                ${conversation}
              `
            }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 200,
        }
      };
      
      // Make the API request
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract the response text
      let responseText = "";
      if (data.candidates && data.candidates[0] && data.candidates[0].content && 
          data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        responseText = data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected API response format");
      }
      
      // Parse the JSON response
      try {
        // Find JSON in the response (in case there's additional text)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        let parsedInfo;
        
        if (jsonMatch) {
          parsedInfo = JSON.parse(jsonMatch[0]);
        } else {
          parsedInfo = JSON.parse(responseText);
        }
        
        console.log("API extracted medical info:", parsedInfo);
        return parsedInfo;
      } catch (parseError) {
        console.error("Error parsing JSON from Gemini response:", parseError);
        throw parseError;
      }
    } catch (apiError) {
      console.error("API extraction failed:", apiError);
      // If API extraction fails, fall back to local extraction
      if (lastUserMessage) {
        const userText = lastUserMessage.replace(/^.*?: /, '').trim();
        return {
          medicalIssue: userText,
          location: null,
          appointmentDate: null,
          treatmentType: determineTreatmentType(userText)
        };
      }
    }
    
    // If all extraction methods fail
    return {
      medicalIssue: null,
      location: null,
      appointmentDate: null,
      treatmentType: null
    };
  } catch (error) {
    console.error("Error in extractMedicalInfo:", error);
    return {
      medicalIssue: null,
      location: null,
      appointmentDate: null,
      treatmentType: null
    };
  }
};

// Helper function to determine treatment type from symptoms
export const determineTreatmentType = (symptoms) => {
  if (!symptoms) return null;
  
  const lowerSymptoms = symptoms.toLowerCase();
  
  // Hair-related keywords
  if (/\b(hair\s*loss|bald|thinning\s*hair|receding\s*hairline|hair\s*fall|hair\s*transplant|hair\s*treatment|hair\s*problem|hair\s*issue|scalp|dandruff)\b/i.test(lowerSymptoms)) {
    return 'hair';
  }
  
  // Dental-related keywords
  if (/\b(tooth|teeth|dental|dentist|cavity|filling|crown|root\s*canal|gum|oral|mouth|jaw|braces|invisalign|denture)\b/i.test(lowerSymptoms)) {
    return 'dental';
  }
  
  // Cosmetic-related keywords
  if (/\b(cosmetic|beauty|skin|face|wrinkle|botox|filler|laser|plastic\s*surgery|liposuction|tummy\s*tuck|nose\s*job|facelift|rash|facial|appearance|look)\b/i.test(lowerSymptoms)) {
    return 'cosmetic';
  }
  
  // IVF-related keywords
  if (/\b(fertility|ivf|in\s*vitro|pregnancy|conceive|conception|sperm|egg|embryo|surrogacy|infertility|pregnant|baby|trying|conceiving)\b/i.test(lowerSymptoms)) {
    return 'ivf';
  }
  
  return null;
};

// Helper function to extract information from a message
const extractInfoFromMessage = (message) => {
  if (!message) return {};
  
  const lowerMessage = message.toLowerCase();
  const result = {
    medicalIssue: null,
    location: null,
    appointmentDate: null,
    treatmentType: null
  };
  
  // Extract treatment type
  result.treatmentType = determineTreatmentType(message);
  
  // Extract medical issue (if not already determined by treatment type)
  if (!result.medicalIssue) {
    // Look for phrases like "I have [issue]" or "I'm experiencing [issue]"
    const medicalIssueMatches = lowerMessage.match(/(?:i have|i am having|i'm having|i am experiencing|i'm experiencing|suffering from|problem with|issues with|concerned about)\s+([^.!?]+)/i);
    if (medicalIssueMatches && medicalIssueMatches[1]) {
      result.medicalIssue = medicalIssueMatches[1].trim();
    }
  }
  
  // Extract location
  const locationMatches = lowerMessage.match(/(?:in|at|near|around)\s+([a-z\s]+(?:city|town|area|district|neighborhood|locality|village|mumbai|delhi|bangalore|hyderabad|chennai|kolkata|pune|ahmedabad|jaipur))/i);
  if (locationMatches && locationMatches[1]) {
    result.location = locationMatches[1].trim();
  }
  
  // Extract date
  const dateMatches = lowerMessage.match(/(?:on|at|this|next|coming)\s+([a-z]+day|tomorrow|weekend|month|[a-z]+\s+\d{1,2}(?:st|nd|rd|th)?|january|february|march|april|may|june|july|august|september|october|november|december)/i);
  if (dateMatches && dateMatches[1]) {
    result.appointmentDate = dateMatches[1].trim();
  }
  
  console.log("Extracted info from message:", result);
  return result;
};

// Helper function to determine what information we still need
const determineNextQuestion = (state, chatSession) => {
  // Check if we have all required information
  const hasMedicalIssue = !!state.medicalIssue;
  const hasTreatmentType = !!state.treatmentType;
  const hasLocation = !!state.location;
  const hasAppointmentDate = !!state.appointmentDate;
  
  console.log("Current state for determining next question:", {
    hasMedicalIssue,
    hasTreatmentType,
    hasLocation,
    hasAppointmentDate,
    state
  });
  
  // Enforce the strict order of questions
  if (!hasMedicalIssue) {
    return "symptoms";
  } else if (!hasTreatmentType) {
    return "treatmentType";
  } else if (!hasLocation) {
    return "location";
  } else if (!hasAppointmentDate) {
    return "appointmentDate";
  } else if (hasMedicalIssue && hasTreatmentType && hasLocation && hasAppointmentDate) {
    // Only recommend a clinic if we have ALL required information
    return "complete";
  } else {
    // Fallback - if we're missing any information, determine what to ask next
    if (!hasMedicalIssue) return "symptoms";
    if (!hasTreatmentType) return "treatmentType";
    if (!hasLocation) return "location";
    if (!hasAppointmentDate) return "appointmentDate";
    
    // This should never happen, but just in case
    return "symptoms";
  }
};

// Helper function to find an alternative question when we've already asked something
const findAlternativeQuestion = (questionType, state, userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Double-check that we're not skipping any required information
  const hasMedicalIssue = !!state.medicalIssue;
  const hasTreatmentType = !!state.treatmentType;
  const hasLocation = !!state.location;
  const hasAppointmentDate = !!state.appointmentDate;
  
  // If we're missing any required information, prioritize getting that first
  if (!hasMedicalIssue) return "symptomsAlternative";
  if (!hasTreatmentType && questionType !== "symptoms") return "treatmentType";
  if (!hasLocation && (questionType !== "symptoms" && questionType !== "treatmentType")) return "location";
  if (!hasAppointmentDate && (questionType !== "symptoms" && questionType !== "treatmentType" && questionType !== "location")) return "appointmentDate";
  
  switch (questionType) {
    case "symptoms":
      return "symptomsAlternative";
      
    case "treatmentType":
      // If they mentioned fertility issues, ask about their fertility journey
      if (state.treatmentType === 'ivf' || /\b(fertility|conceive|pregnant|baby)\b/i.test(lowerMessage)) {
        return "fertilityJourney";
      }
      // If they mentioned cosmetic issues, ask about their appearance goals
      if (state.treatmentType === 'cosmetic' || /\b(appearance|look|face|skin)\b/i.test(lowerMessage)) {
        return "cosmeticGoals";
      }
      // If they mentioned hair issues, ask about their hair concerns
      if (state.treatmentType === 'hair' || /\b(hair|bald)\b/i.test(lowerMessage)) {
        return "hairConcerns";
      }
      // If they mentioned dental issues, ask about their dental concerns
      if (state.treatmentType === 'dental' || /\b(teeth|tooth|dental)\b/i.test(lowerMessage)) {
        return "dentalConcerns";
      }
      return "treatmentGoals";
      
    case "location":
      return "locationAlternative";
      
    case "appointmentDate":
      return "appointmentDateAlternative";
      
    default:
      // If we can't find an alternative, move to the next question
      if (!hasMedicalIssue) return "symptoms";
      if (!hasTreatmentType) return "treatmentType";
      if (!hasLocation) return "location";
      if (!hasAppointmentDate) return "appointmentDate";
      
      // This should never happen, but just in case
      return "symptoms";
  }
};

// Helper function to get empathic responses based on the current state
const getEmpathicResponse = (questionType, state, userMessage = "") => {
  const lowerMessage = userMessage.toLowerCase();
  
  switch (questionType) {
    case "symptoms":
      return "I'm here to help you find the right care. Could you share what health concerns brought you to MedYatra today?";
    
    case "symptomsAlternative":
      return "I understand you're looking for medical assistance. To help you better, could you tell me a bit about what you're experiencing?";
    
    case "treatmentType":
      if (state && state.medicalIssue) {
        return `Thank you for sharing that. I understand you're dealing with ${state.medicalIssue}. What kind of improvement or outcome are you hoping for?`;
      }
      return "Thank you for sharing that. What kind of improvement or outcome are you hoping for from your treatment?";
    
    case "treatmentGoals":
      return "I'd like to understand your goals better. What would a successful treatment look like for you?";
    
    case "fertilityJourney":
      return "I understand fertility concerns can be emotionally challenging. Have you consulted with any fertility specialists before, or is this your first time seeking help?";
    
    case "cosmeticGoals":
      return "Everyone deserves to feel confident about their appearance. What specific improvements would make you feel better about yourself?";
    
    case "hairConcerns":
      return "Hair concerns can significantly impact confidence. How long have you been experiencing these issues, and what solutions have you tried so far?";
    
    case "dentalConcerns":
      return "Dental health is so important for overall wellbeing. Are you experiencing any pain or discomfort, or is your concern more about appearance?";
    
    case "location":
      return "I appreciate you sharing that information. To find the right clinic for you, could you let me know which city or area would be most convenient for your treatment?";
    
    case "locationAlternative":
      return "To help narrow down the best options for you, is there a particular part of town or city that would be most accessible for your appointments?";
    
    case "appointmentDate":
      return "You're doing great providing all this helpful information. Do you have a preferred timeframe for when you'd like to start your treatment?";
    
    case "appointmentDateAlternative":
      return "Is there a particular day of the week or time of month that works best for scheduling your first appointment?";
    
    case "complete":
      if (!state) return "I'm sorry, I don't have enough information to make a recommendation yet. Could you tell me more about your needs?";
      
      let clinicType = "";
      let specializedInfo = "";
      
      switch (state.treatmentType) {
        case "hair":
          clinicType = "hair restoration";
          specializedInfo = "specializes in advanced hair transplant techniques and non-surgical treatments";
          break;
        case "dental":
          clinicType = "dental";
          specializedInfo = "offers comprehensive dental care with the latest technology";
          break;
        case "cosmetic":
          clinicType = "cosmetic";
          specializedInfo = "provides a range of aesthetic procedures with natural-looking results";
          break;
        case "ivf":
          clinicType = "fertility";
          specializedInfo = "has helped many couples with their fertility journey";
          break;
        default:
          clinicType = "specialized";
          specializedInfo = "can address your specific medical needs";
      }
      
      return `Based on what you've shared, I recommend our ${clinicType} clinic${state.location ? ` in ${state.location}` : ""} that ${specializedInfo}. ${state.appointmentDate ? `They have availability ${state.appointmentDate}.` : ""} Would you like to book an appointment now?`;
    
    case "fallback":
    default:
      // Check for specific patterns in the user message to provide more relevant fallbacks
      if (/\b(don't know|not sure|confused|uncertain)\b/i.test(lowerMessage)) {
        return "That's completely understandable. Many people aren't sure about specific treatments when they first reach out. Could you tell me more about what you're experiencing so I can guide you better?";
      }
      
      if (/\b(help|confused|what|how)\b/i.test(lowerMessage)) {
        return "I'm here to help guide you through this process. To start, could you share what health concerns brought you to MedYatra today?";
      }
      
      return "I'm here to help you find the right care. Could you share what health concerns brought you to MedYatra today?";
  }
};

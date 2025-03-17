// Direct API approach for Gemini
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyArjTDiaJOVP2wYoyKELb5nIuBVtXBWVoM";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent?key=${API_KEY}`;

// Add debugging to check if API key is available
console.log("Gemini API Key available:", !!API_KEY);

// Function to create a chat session with Gemini
export const createChatSession = () => {
  // Initialize chat history and state
  let chatHistory = [];
  
  // State to track conversation progress and parameters collected
  let state = {
    medicalIssue: null,
    location: null, 
    appointmentDate: null,
    treatmentType: null,
    currentQuestion: "symptoms",  // Start by asking about symptoms
    previousResponses: [],
    askedQuestions: new Set(["symptoms"]),  // Track which questions we've asked
    repetitionCount: {}, // Track how many times we've asked each question
    questionAskedCount: 0,
    missingParameters: ["medicalIssue", "location", "appointmentDate", "treatmentType"]
  };
  
  // First greeting message from the assistant
  const greeting = "Hello! I'm your MedYatra AI assistant. We currently offer specialized treatments in four areas: Hair, Dental Care, Cosmetic Procedures, and IVF/Fertility. Please describe your symptoms or medical needs, and I'll help you find the right clinic.";
  
  // Add greeting to history
  chatHistory.push({
    sender: 'assistant',
    text: greeting
  });
  
  // Return chat session interface
  return {
    // Get the current chat history
    getHistory: () => chatHistory,
    
    // Get a formatted history for API requests
    getFormattedHistory: () => {
      return chatHistory.map(msg => ({
        role: msg.sender === 'assistant' ? 'model' : 'user',
        content: msg.text
      }));
    },
    
    // Add a message to the history
    addMessage: (sender, text) => {
      if (!text) return;
      
      chatHistory.push({
        sender: sender === 'model' ? 'assistant' : 'user',
        text: text
      });
      
      // If it's an assistant message, save it to previous responses to avoid repetition
      if (sender === 'model' || sender === 'assistant') {
        state.previousResponses.push(text);
        // Keep only the last 5 responses
        if (state.previousResponses.length > 5) {
          state.previousResponses.shift();
        }
      }
    },
    
    // Get the current state
    getState: () => ({ ...state }),
    
    // Update state with new information
    updateState: (newState) => {
      state = { ...state, ...newState };
      
      // Update missing parameters based on what we've collected
      state.missingParameters = [];
      if (!state.medicalIssue) state.missingParameters.push("medicalIssue");
      if (!state.location) state.missingParameters.push("location");
      if (!state.appointmentDate) state.missingParameters.push("appointmentDate");
      if (!state.treatmentType) state.missingParameters.push("treatmentType");
    },
    
    // Mark a question as asked to avoid repetition
    markQuestionAsked: (questionType) => {
      state.askedQuestions.add(questionType);
      state.questionAskedCount++;
      
      // Track repetition
      if (!state.repetitionCount[questionType]) {
        state.repetitionCount[questionType] = 1;
      } else {
        state.repetitionCount[questionType]++;
      }
    },
    
    // Check if we've asked this question before
    hasAskedQuestion: (questionType) => {
      return state.askedQuestions.has(questionType);
    },
    
    // Check if we have all required parameters
    hasAllRequiredParameters: () => {
      return (
        state.medicalIssue !== null &&
        state.location !== null &&
        state.appointmentDate !== null &&
        state.treatmentType !== null
      );
    },
    
    // Check if a response is too repetitive (similar to previous responses)
    isResponseRepetitive: (response) => {
      // Only check the last 3 responses
      const recentResponses = state.previousResponses.slice(-3);
      
      for (const prevResponse of recentResponses) {
        // Calculate similarity
        const similarity = calculateStringSimilarity(response, prevResponse);
        if (similarity > 0.7) {
          return true;
        }
      }
      
      // If we've asked the same question type more than 3 times, consider it repetitive
      const currentQuestionType = state.currentQuestion;
      return state.repetitionCount[currentQuestionType] > 3;
    },
    
    // Store current state for external reference
    state
  };
};

// Helper function to calculate string similarity (Jaccard index)
function calculateStringSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  
  // Convert to lowercase and split into words
  const words1 = new Set(str1.toLowerCase().split(/\W+/).filter(word => word.length > 0));
  const words2 = new Set(str2.toLowerCase().split(/\W+/).filter(word => word.length > 0));
  
  // Calculate intersection and union sizes
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  // Calculate Jaccard index
  return intersection.size / union.size;
}

// Helper function to extract information from a message using Gemini API
const extractInfoFromMessage = async (message, conversationHistory = []) => {
  if (!message) return {};
  
  // Default result structure
  const result = {
    medicalIssue: null,
    location: null,
    appointmentDate: null,
    treatmentType: null
  };
  
  try {
    // First try simple pattern matching for treatment type since it's more straightforward
    result.treatmentType = determineTreatmentType(message);
    
    // For more complex extraction (especially dates and locations), use Gemini
    // Format the conversation history + current message for context
    const contextMessages = [...conversationHistory.slice(-5), { role: 'user', content: message }];
    const conversationText = contextMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    // Create structured prompt for Gemini to extract specific information
    const extractionPrompt = `
      Extract the following information from this conversation:
      
      Conversation:
      ${conversationText}
      
      Please extract ONLY these parameters:
      1. Medical Issue: What health problem is the user experiencing?
      2. Location: What geographical location (city, area, etc.) is mentioned for treatment?
      3. Appointment Date and Time: When does the user want to schedule an appointment?
      
      Return a VALID JSON object with ONLY these exact keys. Do NOT include markdown code block formatting (no code blocks). ONLY return the raw JSON:
      {
        'medicalIssue': 'extracted issue or null if not found',
        'location': 'geographical location or null if not found',
        'appointmentDate': 'full appointment date and time or null if not found'
      }
    `;
    
    // Prepare the request payload
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: extractionPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.1, // Lower temperature for more structured, predictable output
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200
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
    
    // Parse the JSON response - handle common markdown formatting issues
    try {
      // Clean up potential markdown formatting from the response
      const cleanedResponse = responseText
        .replace(/```json\s*/g, '') // Remove ```json
        .replace(/```/g, '')         // Remove ``` closing tags
        .trim();                     // Trim whitespace
      
      // Try to parse the cleaned JSON
      const parsedResponse = JSON.parse(cleanedResponse);
      
      // Only update fields if the API returned something
      if (parsedResponse.medicalIssue && parsedResponse.medicalIssue !== "null") {
        result.medicalIssue = parsedResponse.medicalIssue;
      }
      if (parsedResponse.location && parsedResponse.location !== "null") {
        result.location = parsedResponse.location;
      }
      if (parsedResponse.appointmentDate && parsedResponse.appointmentDate !== "null") {
        result.appointmentDate = parsedResponse.appointmentDate;
      }
      if (parsedResponse.treatmentType && parsedResponse.treatmentType !== "null") {
        result.treatmentType = parsedResponse.treatmentType;
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error, "\nResponse was:", responseText);
    }
    
    console.log("Extracted info from message:", result);
    return result;
  } catch (error) {
    console.error("Error in extractInfoFromMessage:", error);
    return {
      medicalIssue: null,
      location: null,
      appointmentDate: null,
      treatmentType: null
    };
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
  
  // STRICT ENFORCEMENT: If we're missing any required information, prioritize getting that first
  if (!hasMedicalIssue) return "symptomsAlternative";
  if (!hasTreatmentType && questionType !== "symptoms") return "treatmentType";
  if (!hasLocation && (questionType !== "symptoms" && questionType !== "treatmentType")) return "location";
  if (!hasAppointmentDate && (questionType !== "symptoms" && questionType !== "treatmentType" && questionType !== "location")) return "appointmentDate";
  
  // Only if all parameters are collected, we can proceed to complete
  if (hasMedicalIssue && hasTreatmentType && hasLocation && hasAppointmentDate) {
    return "complete";
  }
  
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
      // If we can't find an alternative, move to the next question in sequence
      if (!hasMedicalIssue) return "symptoms";
      if (!hasTreatmentType) return "treatmentType";
      if (!hasLocation) return "location";
      if (!hasAppointmentDate) return "appointmentDate";
      
      // This should never happen, but just in case
      return "symptoms";
  }
};

// Function to send a message to the Gemini API and get a response
export const sendMessage = async (chatSession, userMessage, context = '') => {
  try {
    // Check if we have a valid chat session
    if (!chatSession) {
      console.error('No chat session available');
      return getEmpathicResponse("fallback", null);
    }
    
    // Add the user message to chat history
    chatSession.addMessage('user', userMessage);
    
    // First, try to extract information from the message
    const extractedInfo = await extractInfoFromMessage(userMessage, chatSession.getFormattedHistory());
    const currentState = chatSession.getState();
    
    // Log the extracted information and current state
    console.log("Extracted info:", extractedInfo);
    console.log("Current state before update:", currentState);
    
    // Update the chat session state with any extracted information
    const updatedState = {
      medicalIssue: extractedInfo.medicalIssue || currentState.medicalIssue,
      location: extractedInfo.location || currentState.location,
      appointmentDate: extractedInfo.appointmentDate || currentState.appointmentDate,
      treatmentType: extractedInfo.treatmentType || currentState.treatmentType
    };
    
    // If we've detected a medical issue but no treatment type, infer it
    if (updatedState.medicalIssue && !updatedState.treatmentType) {
      updatedState.treatmentType = determineTreatmentType(updatedState.medicalIssue);
      console.log("Inferred treatment type:", updatedState.treatmentType);
    }
    
    chatSession.updateState(updatedState);
    
    // Log the current state to help with debugging
    console.log("Updated state after extraction:", updatedState);
    console.log("Missing parameters:", chatSession.getState().missingParameters);
    
    // Determine what information we still need based on the missing parameters
    let nextQuestion;
    
    // STRICT ENFORCEMENT: Enforce strict parameter collection sequence
    if (chatSession.getState().missingParameters.includes("medicalIssue")) {
      nextQuestion = "symptoms";
    } else if (chatSession.getState().missingParameters.includes("treatmentType")) {
      nextQuestion = "treatmentType";
    } else if (chatSession.getState().missingParameters.includes("location")) {
      nextQuestion = "location";
    } else if (chatSession.getState().missingParameters.includes("appointmentDate")) {
      nextQuestion = "appointmentDate";
    } else {
      // Only if we have all parameters
      nextQuestion = "complete";
    }
    
    console.log("Next question to ask:", nextQuestion);
    
    // STRICT ENFORCEMENT: Double-check that we're not recommending a clinic prematurely
    if (nextQuestion === "complete") {
      if (chatSession.hasAllRequiredParameters()) {
        const response = getEmpathicResponse("complete", updatedState);
        chatSession.addMessage("model", response);
        return response;
      } else {
        console.error("Attempted to recommend clinic without all parameters!");
        // Force asking for the first missing parameter
        const missingParam = chatSession.getState().missingParameters[0];
        nextQuestion = missingParamToQuestion(missingParam);
        console.log("Redirecting to ask for missing parameter:", nextQuestion);
      }
    }
    
    // If we've already asked this question, try to find a different approach
    // But ONLY if the user didn't provide the information we asked for
    const previousQuestion = currentState.currentQuestion;
    if (chatSession.hasAskedQuestion(nextQuestion) && nextQuestion !== "complete" && 
        nextQuestion === previousQuestion && 
        !(await hasProvidedRequestedInfo(extractedInfo, previousQuestion))) {
      
      console.log("User didn't provide requested info for:", previousQuestion);
      
      // Find an alternative question or rephrase
      const alternativeQuestion = findAlternativeQuestion(nextQuestion, updatedState, userMessage);
      chatSession.updateState({ currentQuestion: alternativeQuestion });
      chatSession.markQuestionAsked(alternativeQuestion);
      
      console.log("Using alternative question:", alternativeQuestion);
      
      // Double-check that we're not recommending a clinic prematurely
      if (alternativeQuestion === "complete") {
        if (chatSession.hasAllRequiredParameters()) {
          const response = getEmpathicResponse("complete", updatedState);
          chatSession.addMessage("model", response);
          return response;
        } else {
          // If we don't have all information but somehow got "complete", ask for missing info
          const missingParam = chatSession.getState().missingParameters[0];
          const fallbackQuestion = missingParamToQuestion(missingParam);
          const response = getEmpathicResponse(fallbackQuestion, updatedState, userMessage);
          chatSession.addMessage("model", response);
          return response;
        }
      }
      
      const response = getEmpathicResponse(alternativeQuestion, updatedState, userMessage);
      
      // Check if the response is too repetitive
      if (chatSession.isResponseRepetitive(response)) {
        console.log("Generated response is too repetitive, creating a variation");
        const variedResponse = createResponseVariation(alternativeQuestion, updatedState, userMessage);
        chatSession.addMessage("model", variedResponse);
        return variedResponse;
      }
      
      chatSession.addMessage("model", response);
      return response;
    }
    
    // Mark this question as asked
    chatSession.updateState({ currentQuestion: nextQuestion });
    chatSession.markQuestionAsked(nextQuestion);
    
    // STRICT ENFORCEMENT: Double-check that we're not recommending a clinic prematurely
    if (nextQuestion === "complete") {
      if (chatSession.hasAllRequiredParameters()) {
        const response = getEmpathicResponse("complete", updatedState);
        chatSession.addMessage("model", response);
        return response;
      } else {
        console.error("Attempted to recommend clinic without all parameters!");
        // Force asking for the first missing parameter
        const missingParam = chatSession.getState().missingParameters[0];
        nextQuestion = missingParamToQuestion(missingParam);
        console.log("Redirecting to ask for missing parameter:", nextQuestion);
      }
    }
    
    // Try to get a response from Gemini API
    try {
      // Create a system instruction to guide the model
      const systemInstruction = `
        You are a medical assistant for MedYatra. Be empathetic, warm, and human-like in your responses.
        
        The user has shared: "${userMessage}"
        
        Current information:
        - Medical Issue: ${updatedState.medicalIssue || "Unknown"}
        - Location Preference: ${updatedState.location || "Unknown"}
        - Appointment Date: ${updatedState.appointmentDate || "Unknown"}
        - Treatment Type: ${updatedState.treatmentType || "Unknown"}
        
        IMPORTANT: You must follow a STRICT parameter collection sequence:
        1. First ask about symptoms/medical concerns (DONE if we have this info)
        2. Then ask about location preference (where they want treatment)
        3. Then ask about appointment date/time preference
        4. Only then recommend a clinic
        
        Your next task is to ask about: ${nextQuestion}
        
        Missing parameters: ${chatSession.getState().missingParameters.join(", ")}
        
        Guidelines:
        1. Keep your response brief (50-80 words)
        2. First acknowledge what the user said with 1-2 empathetic sentences
        3. Then ask ONE clear question about ${nextQuestion} in a conversational way
        4. DO NOT recommend a clinic yet - we still need to collect: ${chatSession.getState().missingParameters.join(", ")}
        5. DO NOT ask questions they've already answered
        6. If asking about treatment type, don't expect them to know specific treatments - ask about their goals instead
        7. Be warm and supportive
        8. IMPORTANT: Vary your phrasing to avoid repetition
        9. CRITICAL: NEVER repeat a question if the user has already provided that information
        10. CRITICAL: ALL parameters (medical issue, treatment type, location, appointment date) MUST be collected before recommending a clinic
        
        Previous questions asked: ${Array.from(chatSession.getState().askedQuestions).join(", ")}
        Previous responses (to avoid repetition): ${chatSession.getState().previousResponses.slice(-2).join(" | ")}
        
        Additional context: ${context}
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
          maxOutputTokens: 200 // Allow slightly longer responses for empathy
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
            
            The user has shared: "${userMessage}"
            
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
              maxOutputTokens: 200 // Allow slightly longer responses for empathy
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
          const response = getEmpathicResponse(nextQuestion, updatedState, userMessage);
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
      const response = getEmpathicResponse(nextQuestion, updatedState, userMessage);
      
      // Check if the response is too repetitive
      if (chatSession.isResponseRepetitive(response)) {
        console.log("Fallback response is too repetitive, creating a variation");
        const variedResponse = createResponseVariation(nextQuestion, updatedState, userMessage);
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

// Helper function to check if the user has provided the requested information
async function hasProvidedRequestedInfo(extractedInfo, previousQuestion) {
  switch (previousQuestion) {
    case "symptoms":
      return !!extractedInfo.medicalIssue;
    case "symptomsAlternative":
      return !!extractedInfo.medicalIssue;
    case "treatmentType":
      return !!extractedInfo.treatmentType;
    case "treatmentGoals":
    case "fertilityJourney":
    case "cosmeticGoals":
    case "hairConcerns":
    case "dentalConcerns":
      // These are all variations of treatment type questions
      return !!extractedInfo.treatmentType;
    case "location":
      return !!extractedInfo.location;
    case "locationAlternative":
      return !!extractedInfo.location;
    case "appointmentDate":
    case "appointmentTime":
    case "appointmentPreference":
      return !!extractedInfo.appointmentDate;
    default:
      return false;
  }
}

// Helper function to determine treatment type from symptoms
export const determineTreatmentType = (symptoms) => {
  if (!symptoms) return null;
  
  const lowerSymptoms = symptoms.toLowerCase();
  
  // Hair-related keywords
  if (lowerSymptoms.includes('hair loss') || 
      lowerSymptoms.includes('bald') || 
      lowerSymptoms.includes('receding') || 
      lowerSymptoms.includes('thinning hair') ||
      lowerSymptoms.includes('hair fall') ||
      lowerSymptoms.includes('hair thinning') ||
      lowerSymptoms.includes('hair problem')) {
    return 'hair';
  }
  
  // Dental-related keywords
  if (lowerSymptoms.includes('tooth') || 
      lowerSymptoms.includes('teeth') || 
      lowerSymptoms.includes('dental') ||
      lowerSymptoms.includes('gum') ||
      lowerSymptoms.includes('mouth pain')) {
    return 'dental';
  }
  
  // Cosmetic-related keywords
  if (lowerSymptoms.includes('cosmetic') || 
      lowerSymptoms.includes('botox') || 
      lowerSymptoms.includes('wrinkle') || 
      lowerSymptoms.includes('acne') ||
      lowerSymptoms.includes('skin') ||
      lowerSymptoms.includes('face') ||
      lowerSymptoms.includes('nose') ||
      lowerSymptoms.includes('beauty')) {
    return 'cosmetic';
  }
  
  // IVF-related keywords
  if (lowerSymptoms.includes('fertil') || 
      lowerSymptoms.includes('pregnan') || 
      lowerSymptoms.includes('ivf') || 
      lowerSymptoms.includes('conceive') ||
      lowerSymptoms.includes('birth') ||
      lowerSymptoms.includes('baby') ||
      lowerSymptoms.includes('sperm')) {
    return 'ivf';
  }
  
  return null;
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
          clinicType = "hair";
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
      "Let's start by understanding your health concerns. What symptoms or issues have you been experiencing?",
      "To find the right specialist for you, could you share what health issues you're facing?"
    ],
    symptomsAlternative: [
      "To better assist you, could you share what specific health issues you're facing?",
      "I want to make sure I understand your needs correctly. What health concerns brought you to MedYatra?",
      "It would help me to know more about your specific health situation. What symptoms are you experiencing?",
      "Could you describe your health concerns in a bit more detail so I can find the right care for you?"
    ],
    treatmentType: [
      "Thanks for sharing that. What kind of improvement are you hoping to see from treatment?",
      "I appreciate you telling me about your situation. What outcome are you looking for from treatment?",
      "Based on what you've shared, what are your goals for treatment?",
      "What would successful treatment look like for you?"
    ],
    treatmentGoals: [
      "I'd like to understand your goals better. What would a successful treatment look like for you?",
      "Everyone has different priorities for their care. What's most important to you in your treatment?",
      "What specific improvements are you hoping to achieve with treatment?",
      "To match you with the right specialist, could you share what you're hoping to achieve?"
    ],
    fertilityJourney: [
      "I understand fertility concerns can be emotionally challenging. Have you consulted with any fertility specialists before?",
      "Fertility treatments have many options. What stage are you at in your fertility journey?",
      "To help find the right fertility specialist, could you share a bit about your situation and goals?",
      "Everyone's fertility journey is unique. What specific concerns would you like addressed?"
    ],
    cosmeticGoals: [
      "Everyone deserves to feel confident about their appearance. What specific improvements would make you feel better?",
      "Cosmetic treatments can address many concerns. What areas would you like to focus on?",
      "What cosmetic outcomes are you hoping to achieve with treatment?",
      "To match you with the right cosmetic specialist, what specific concerns would you like addressed?"
    ],
    hairConcerns: [
      "Hair concerns can significantly impact confidence. How long have you been experiencing these issues?",
      "There are many effective treatments for hair concerns. What specific issues are you experiencing?",
      "To find the right hair specialist, could you share more about your hair concerns?",
      "What kind of hair treatment outcomes are you hoping for?"
    ],
    dentalConcerns: [
      "Dental health is important for overall wellbeing. Are you experiencing any pain or discomfort?",
      "To connect you with the right dental specialist, what specific dental concerns do you have?",
      "Are your dental concerns more about function, appearance, or both?",
      "What dental treatment outcomes are you hoping to achieve?"
    ],
    location: [
      "Which city or area would be most convenient for your treatment?",
      "Where would you prefer to receive your care? Any specific location in mind?",
      "To find clinics near you, could you share which area you're located in?",
      "What location would be most accessible for your appointments?"
    ],
    locationAlternative: [
      "Is there a particular city or neighborhood that would be convenient for your appointments?",
      "To narrow down the options, which area would you prefer for your treatment?",
      "Which part of town would be easiest for you to access medical care?",
      "Do you have a preferred location where you'd like to receive treatment?"
    ],
    appointmentDate: [
      "When would be a good time for you to start treatment?",
      "Do you have a preferred timeframe for your appointment?",
      "Is there a particular day of the week or time of month that works best for your schedule?",
      "When were you hoping to schedule your first appointment?"
    ],
    appointmentDateAlternative: [
      "What's your availability like for appointments? Any days that work better than others?",
      "Are you looking for an appointment soon, or do you have a specific date in mind?",
      "Would you prefer a weekday or weekend appointment? Any particular time of day?",
      "To help with scheduling, when would be the most convenient time for your visit?"
    ],
    fallback: [
      "I'm here to help you find the right care. Could you tell me more about your health concerns?",
      "To better assist you, I'd like to understand what brought you to MedYatra today.",
      "I want to make sure I find the right care for your needs. Could you share what health issues you're experiencing?",
      "Let's make sure we find the perfect care for your needs. Could you share a bit more about your situation?"
    ]
  };
  
  // Get variations for the question type or use fallback
  const questionVariations = variations[questionType] || variations.fallback;
  
  // Select a random variation
  const randomIndex = Math.floor(Math.random() * questionVariations.length);
  return questionVariations[randomIndex];
};

// Function to extract medical information from the conversation
export const extractMedicalInfo = async (messages) => {
  try {
    if (!messages || messages.length === 0) {
      return {
        medicalIssue: null,
        location: null,
        appointmentDate: null,
        treatmentType: null
      };
    }
    
    // Initialize extraction object
    const extractedInfo = {
      medicalIssue: null,
      location: null,
      appointmentDate: null,
      treatmentType: null
    };
    
    // First process the messages locally to accumulate information
    for (const message of messages) {
      if (message.sender === 'user') {
        const userText = message.text.trim();
        const localExtraction = await extractInfoFromMessage(userText, messages.slice(0, messages.indexOf(message)));
        
        // Update extraction with any new information found
        if (localExtraction.medicalIssue) extractedInfo.medicalIssue = localExtraction.medicalIssue;
        if (localExtraction.location) extractedInfo.location = localExtraction.location;
        if (localExtraction.appointmentDate) extractedInfo.appointmentDate = localExtraction.appointmentDate;
        if (localExtraction.treatmentType) extractedInfo.treatmentType = localExtraction.treatmentType;
      }
    }
    
    // If we have a medical issue but no treatment type, try to infer it
    if (extractedInfo.medicalIssue && !extractedInfo.treatmentType) {
      extractedInfo.treatmentType = determineTreatmentType(extractedInfo.medicalIssue);
    }
    
    // Now try an overall extraction using the full conversation context
    try {
      // Format messages for Gemini
      const conversationText = messages
        .map(msg => `${msg.sender}: ${msg.text}`)
        .join('\n');
      
      // Create a structured prompt for more accurate extraction
      const prompt = `
        Extract key medical information from this conversation:
        
        ${conversationText}
        
        Please carefully extract ONLY these information:
        1. Medical Issue: What specific health problem or symptoms is the user experiencing?
        2. Treatment Location: What geographical location (city, area, etc.) is mentioned for treatment?
        3. Appointment Date and Time: When does the user want to schedule an appointment?
        
        Return a VALID JSON object with ONLY these keys. Do NOT include markdown code block formatting (no code blocks). ONLY return the raw JSON:
        {
          'medicalIssue': 'extracted issue or null if not found',
          'location': 'geographical location or null if not found',
          'appointmentDate': 'full date and time or null if not found'
        }
      `;
      
      // Prepare the request payload for Gemini
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more factual responses
          maxOutputTokens: 200
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
      
      if (response.ok) {
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (responseText) {
          try {
            // Clean up potential markdown formatting from the response
            const cleanedResponse = responseText
              .replace(/```json\s*/g, '') // Remove ```json
              .replace(/```/g, '')         // Remove ``` closing tags
              .trim();                     // Trim whitespace
            
            // Try to parse the cleaned JSON
            const parsedResponse = JSON.parse(cleanedResponse);
            
            // Only update fields if they're not already set and the API returned something
            if (!extractedInfo.medicalIssue && parsedResponse.medicalIssue && parsedResponse.medicalIssue !== "null") {
              extractedInfo.medicalIssue = parsedResponse.medicalIssue;
            }
            
            if (!extractedInfo.location && parsedResponse.location && parsedResponse.location !== "null") {
              extractedInfo.location = parsedResponse.location;
            }
            
            if (!extractedInfo.appointmentDate && parsedResponse.appointmentDate && parsedResponse.appointmentDate !== "null") {
              extractedInfo.appointmentDate = parsedResponse.appointmentDate;
            }
          } catch (parseError) {
            console.error("Error parsing Gemini response:", parseError, "\nResponse was:", responseText);
          }
        }
      }
    } catch (apiError) {
      console.error("Error with Gemini API extraction:", apiError);
      // Continue with what we've extracted so far
    }
    
    console.log("Final extracted medical info:", extractedInfo);
    return extractedInfo;
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

// Add a function to create calendar-related prompts and explanations
export const createCalendarPrompt = (extractedInfo) => {
  const { medicalIssue, location, treatmentType } = extractedInfo;
  
  // Format the medical issue and location for the prompt
  const medicalDescription = medicalIssue || "your medical needs";
  const locationDescription = location || "your preferred location";
  const treatmentDescription = treatmentType || "the required treatment";
  
  // Create a clear explanation of the calendar system that will be used by Gemini
  return `
When asking the user to select an appointment date, please explain the calendar availability system as follows:

"Please select your preferred appointment date from the calendar below:
- Green dates indicate days when clinics are available for ${treatmentDescription} in ${locationDescription}.
- Red dates indicate days when no clinics are available.
- You can only select available (green) dates.

This real-time availability is based on clinic schedules for ${medicalDescription} in ${locationDescription}."

If the user selects an unavailable date, respond with:
"I'm sorry, but there are no clinics available on that date for ${treatmentDescription} in ${locationDescription}. Please select a date marked in green from the calendar."

If the user selects an available date, confirm their selection with:
"Thank you for selecting [SELECTED_DATE]. I've confirmed that clinics are available on this date for ${treatmentDescription} in ${locationDescription}."

After they've selected a valid date, proceed to recommend specific clinics that are available on their chosen date.
`;
};

// Helper function to improve the calendar date selection process
export const generateCalendarResponse = async (chatSession, userMessage, context = '') => {
  if (!chatSession) {
    console.error("Chat session not initialized");
    return FALLBACK_RESPONSE;
  }
  
  try {
    console.log("Generating calendar-focused response for:", userMessage);
    console.log("With context:", context);
    
    // Add user message to chat history
    chatSession.addMessage('user', userMessage);
    
    // Try to extract any information from the message
    const extractedInfo = await extractInfoFromMessage(userMessage, chatSession.getFormattedHistory());
    console.log("Extracted info from message:", extractedInfo);
    
    // Update chat session state with any extracted information
    const currentState = chatSession.getState();
    const updatedState = {
      ...currentState,
      ...extractedInfo
    };
    
    // First determine what information we're missing
    // (medical issue, location, appointment date, treatment type)
    const currentQuestion = determineNextQuestion(updatedState);
    updatedState.currentQuestion = currentQuestion;
    chatSession.updateState(updatedState);
    
    // Mark this question as asked to avoid repetition
    chatSession.markQuestionAsked(currentQuestion);
    
    // Check if we have all required parameters to recommend a clinic
    // If yes, we'll focus on generating a response about the clinic
    const hasAllParams = chatSession.hasAllRequiredParameters();
    
    // Generate response based on current state
    let response;
    
    // Prepare the prompt for Gemini
    // If we're supposed to be showing the calendar, provide specific guidance
    let promptText;
    if (currentQuestion === 'appointmentDate') {
      // Use the calendar prompt when asking about dates
      const calendarPrompt = createCalendarPrompt(updatedState);
      promptText = `The user is looking for medical treatment. ${context}\n\n${calendarPrompt}\n\nUser message: ${userMessage}\n\nGenerate a very brief, conversational response that asks them to select a date from the calendar.`;
    } else if (hasAllParams) {
      // If we have all parameters, generate a clinic recommendation
      promptText = `The user is looking for medical treatment. ${context}\n\nYou've collected all required information from the user:\n- Medical issue: ${updatedState.medicalIssue}\n- Location: ${updatedState.location}\n- Appointment date: ${updatedState.appointmentDate}\n- Treatment type: ${updatedState.treatmentType}\n\nNow respond with a short, conversational message about the available clinic. Keep it brief and friendly. If they're asking a question about the clinic, answer it clearly.\n\nUser message: ${userMessage}`;
    } else {
      // Otherwise, focus on getting the missing information
      // Add our specific prompt for the next required information
      const nextQuestionPrompt = getQuestionPrompt(currentQuestion, updatedState);
      promptText = `The user is looking for medical treatment. ${context}\n\n${nextQuestionPrompt}\n\nUser message: ${userMessage}\n\nGenerate a very brief, conversational response that asks for this information. Do not be repetitive. Keep the response under 3 sentences.`;
    }
    
    // Make API request to Gemini
    try {
      const payload = {
        contents: [{
          role: "user",
          parts: [{ text: promptText }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok && data.candidates && data.candidates.length > 0) {
        // Extract the text from the response
        const aiText = data.candidates[0].content.parts[0].text;
        console.log("Gemini API response:", aiText);
        
        // Add AI response to chat history
        chatSession.addMessage('model', aiText);
        
        // Return the response
        return aiText;
      } else {
        console.error("Gemini API error:", data);
        
        // Try to use a fallback response based on the current question
        // This ensures the conversation can continue even if the API fails
        response = getEmpathicResponse(currentQuestion, updatedState, userMessage);
        
        // Add fallback response to chat history
        chatSession.addMessage('model', response);
        
        return response;
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      
      // Use a fallback response
      response = getEmpathicResponse(currentQuestion, updatedState, userMessage);
      
      // Add fallback response to chat history
      chatSession.addMessage('model', response);
      
      return response;
    }
  } catch (error) {
    console.error("Error in generateCalendarResponse:", error);
    return FALLBACK_RESPONSE;
  }
};

// Helper function to get a prompt for a specific question
const getQuestionPrompt = (questionType, state) => {
  switch(questionType) {
    case 'symptoms':
      return "Ask the user about their symptoms or medical concerns. Be empathetic and gentle in your questions.";
    
    case 'location':
      return `The user has mentioned they have issue with: ${state.medicalIssue}. Now ask them about their preferred location for treatment. Be brief and friendly.`;
    
    case 'appointmentDate':
      return `The user is seeking treatment for ${state.medicalIssue} in ${state.location}. Ask them to select an appointment date using the calendar component. Explain that green dates show available clinic slots, and red dates indicate no availability. Keep the explanation brief but clear.`;
    
    case 'treatmentType':
      return `Based on the user's medical issues (${state.medicalIssue}), ask any follow-up questions needed to recommend a specific treatment type.`;
    
    default:
      return "Ask the user how you can help them find medical treatment. Be brief and friendly.";
  }
};

// Helper function to determine what question to ask next
const determineNextQuestion = (state) => {
  // This function determines what information we should ask for next
  // based on what we already know
  
  // Check what information we have and what we need
  if (!state.medicalIssue) {
    return 'symptoms';
  } else if (!state.location) {
    return 'location';
  } else if (!state.appointmentDate) {
    return 'appointmentDate';
  } else if (!state.treatmentType && !determineTreatmentType(state.medicalIssue)) {
    return 'treatmentType';
  }
  
  // If we have everything, just focus on general conversation
  return 'general';
};

// Initial greeting message to show in the chat
export const GREETING_MESSAGE = 
  "Hello! I'm your MedYatra AI assistant. We currently offer specialized treatments in four areas: Hair, Dental Care, Cosmetic Procedures, and IVF/Fertility. Please describe your symptoms or medical needs, and I'll help you find the right clinic.";

// Fallback response when we can't generate a real response
export const FALLBACK_RESPONSE = 
  "I understand your concerns. To help you better, could you please provide more details about your medical needs?";

// Basic context for the AI to understand its role
const SYSTEM_INSTRUCTIONS = `
You are MedYatra's AI health assistant. Your role is to help users find appropriate medical tourism options based on their needs.
You should gather three key pieces of information:
1. The user's medical issue
2. Their preferred location for treatment
3. When they would like to schedule their appointment

Key treatment types offered:
- Hair (for hair loss treatments, transplants, etc.)
- Dental Care (for teeth, gums, etc.)
- Cosmetic Procedures (for skin treatments, plastic surgery, etc.)
- IVF/Fertility (for fertility treatments, pregnancy support, etc.)

Keep your responses brief, friendly, and focused on gathering these details.
`;

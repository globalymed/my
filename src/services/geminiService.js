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
          parts: [{ text: "Hello! I'm your MedYatra AI assistant. I can help you find the right medical treatment and clinic based on your needs. Could you please tell me about your medical concerns or symptoms? Also, if you have a specific location or date in mind for your appointment, please let me know." }]
        }
      ],
      // Method to add a message to history
      addMessage: function(role, text) {
        this.history.push({
          role,
          parts: [{ text }]
        });
      },
      // Method to get full conversation history
      getHistory: function() {
        return this.history;
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
      return "I'm having trouble connecting to my AI brain right now. Could you please tell me more about your medical concerns or symptoms?";
    }

    console.log("Sending message to Gemini:", message);
    
    // Add user message to chat history
    chatSession.addMessage("user", message);
    
    // Prepare the request payload
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
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
    
    // Add AI response to chat history
    chatSession.addMessage("model", responseText);
    
    console.log("Received response from Gemini:", responseText.substring(0, 100) + "...");
    return responseText;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    
    // Determine treatment type from the message for fallback response
    const detectedType = determineTreatmentType(message);
    if (detectedType) {
      let fallbackResponse = "";
      switch (detectedType) {
        case 'cosmetic':
          fallbackResponse = "I see you're mentioning symptoms related to skin or cosmetic concerns. Would you like me to recommend a cosmetic clinic for your condition?";
          break;
        case 'hair':
          fallbackResponse = "I understand you're having hair-related concerns. Our hair restoration clinics offer treatments for hair loss, thinning hair, and various scalp conditions. Would you like me to recommend a hair treatment specialist for you?";
          break;
        case 'dental':
          fallbackResponse = "I see you're mentioning symptoms related to dental issues. Would you like me to recommend a dental clinic for your condition?";
          break;
        case 'ivf':
          fallbackResponse = "I see you're mentioning fertility-related concerns. Would you like me to recommend an IVF clinic for your needs?";
          break;
        default:
          fallbackResponse = "I'm having trouble processing your request. Could you please tell me more about your medical concerns or symptoms?";
      }
      return fallbackResponse;
    }
    
    return "I'm having trouble processing your request. Could you please tell me more about your medical concerns or symptoms?";
  }
};

// Function to extract medical information from the conversation
export const extractMedicalInfo = async (conversation) => {
  try {
    console.log("Extracting medical info from conversation");
    
    // Prepare the request payload
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ 
            text: `
              Based on the following conversation between a user and an AI assistant, 
              extract the following information if present:
              1. Medical problem or symptoms
              2. Desired location for treatment
              3. Preferred appointment date or time
              
              Return the information in JSON format like this:
              {
                "medicalIssue": "extracted medical issue or null if not found",
                "location": "extracted location or null if not found",
                "appointmentDate": "extracted date/time or null if not found",
                "treatmentType": "one of: 'ivf', 'cosmetic', 'hair', 'dental' or null if not clear"
              }
              
              Conversation:
              ${conversation}
            `
          }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
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
      
      console.log("Extracted medical info:", parsedInfo);
      return parsedInfo;
    } catch (parseError) {
      console.error("Error parsing JSON from Gemini response:", parseError);
      console.log("Raw response:", responseText);
      
      // Fallback: Try to determine treatment type from the conversation
      const lastUserMessage = conversation.split('\n').filter(line => line.startsWith('User:')).pop();
      if (lastUserMessage) {
        const userText = lastUserMessage.replace('User:', '').trim();
        const detectedType = determineTreatmentType(userText);
        if (detectedType) {
          return {
            medicalIssue: userText,
            location: null,
            appointmentDate: null,
            treatmentType: detectedType
          };
        }
      }
      
      return {
        medicalIssue: null,
        location: null,
        appointmentDate: null,
        treatmentType: null
      };
    }
  } catch (error) {
    console.error("Error extracting medical information:", error);
    
    // Fallback: Try to determine treatment type from the conversation
    const lastUserMessage = conversation.split('\n').filter(line => line.startsWith('User:')).pop();
    if (lastUserMessage) {
      const userText = lastUserMessage.replace('User:', '').trim();
      const detectedType = determineTreatmentType(userText);
      if (detectedType) {
        return {
          medicalIssue: userText,
          location: null,
          appointmentDate: null,
          treatmentType: detectedType
        };
      }
    }
    
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
  if (/\b(cosmetic|beauty|skin|face|wrinkle|botox|filler|laser|plastic\s*surgery|liposuction|tummy\s*tuck|nose\s*job|facelift|rash)\b/i.test(lowerSymptoms)) {
    return 'cosmetic';
  }
  
  // IVF-related keywords
  if (/\b(fertility|ivf|in\s*vitro|pregnancy|conceive|conception|sperm|egg|embryo|surrogacy|infertility)\b/i.test(lowerSymptoms)) {
    return 'ivf';
  }
  
  return null;
};

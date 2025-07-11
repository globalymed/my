// Function to extract medical information from the conversation
import { extractInfoFromMessage, determineTreatmentType } from './geminiService';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent?key=${API_KEY}`;

// Validate API key is available
if (!API_KEY) {
  console.error('REACT_APP_GEMINI_API_KEY is not set in environment variables');
}

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
        
        Please carefully extract ONLY the following information:
        1. Medical Issue: What specific health problem or symptoms is the user experiencing?
        2. Treatment Location: What city or geographical area is mentioned for treatment?
        3. Appointment Date: When does the user want to schedule their appointment?
        
        Return a VALID JSON object with ONLY these keys. Do NOT include markdown code block formatting (no code blocks). ONLY return the raw JSON:
        {
          'medicalIssue': 'specific health problem or null if unclear',
          'location': 'geographical location or null if not mentioned',
          'appointmentDate': 'full date and time or null if not specified'
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
            
            // Parse the JSON response
            const geminiResponseData = JSON.parse(cleanedResponse);
            
            // Only update fields if they're not already set and the API returned something
            if (!extractedInfo.medicalIssue && geminiResponseData.medicalIssue && geminiResponseData.medicalIssue !== "null") {
              extractedInfo.medicalIssue = geminiResponseData.medicalIssue;
            }
            
            if (!extractedInfo.location && geminiResponseData.location && geminiResponseData.location !== "null") {
              extractedInfo.location = geminiResponseData.location;
            }
            
            if (!extractedInfo.appointmentDate && geminiResponseData.appointmentDate && geminiResponseData.appointmentDate !== "null") {
              extractedInfo.appointmentDate = geminiResponseData.appointmentDate;
            }
          } catch (parseError) {
            console.error("Error parsing Gemini extraction response:", parseError, "\nResponse was:", responseText);
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

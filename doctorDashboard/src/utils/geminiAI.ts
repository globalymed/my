
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with the provided key
const API_KEY = "AIzaSyChgc_to2fpsc3TFge_OaAErmepaRQYOwY";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface GeminiMessage {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
}

export class GeminiAI {
  private history: GeminiMessage[] = [];
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  constructor() {
    // Initialize with empty history
    this.clearHistory();
  }

  public addMessage(role: "user" | "model", content: string) {
    this.history.push({
      role,
      parts: [{ text: content }]
    });
  }

  public async getResponse(message: string, patientContext?: string): Promise<string> {
    // Add user message to history
    this.addMessage("user", message);

    try {
      // Construct the prompt with medical context
      let promptText = message;
      
      // Add patient context if available
      if (patientContext) {
        promptText = `[PATIENT CONTEXT: This question is regarding patient ${patientContext}. Please focus your response on this patient's information.]\n\n${message}`;
      }

      // Create a prompt that emphasizes medical responses
      const finalPrompt = `
        As a medical AI assistant, respond to this query: ${promptText}
        Provide clear, concise, and accurate medical information.
      `;

      // Generate content with the model
      const result = await this.model.generateContent(finalPrompt);
      const responseText = result.response.text();
      
      // Add model response to history
      this.addMessage("model", responseText);
      
      return responseText;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "I'm sorry, I encountered an error processing your request. Please try again.";
    }
  }

  // Clear conversation history
  public clearHistory() {
    this.history = [];
  }
}

// Create and export a singleton instance
export const geminiAI = new GeminiAI();

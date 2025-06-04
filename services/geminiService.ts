
import { GoogleGenAI, GenerateContentResponse, Part, Content, ModelConfig } from "@google/genai";
import { GeminiResponse, GroundingChunk } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Fallback to prevent crash if API_KEY is somehow undefined at runtime

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const generatePromptResponse = async (
  promptText: string,
  useGoogleSearch: boolean = false
): Promise<GeminiResponse> => {
  if (!API_KEY) {
    return { text: "Error: API_KEY is not configured. Please set the API_KEY environment variable.", groundingChunks: [] };
  }

  try {
    const contents: Content[] = [{ role: "user", parts: [{ text: promptText } as Part] }];
    
    const config: ModelConfig = {
      // Standard config options
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      // thinkingConfig: { thinkingBudget: 0 } // Disable thinking for lower latency if needed. Omit for higher quality.
    };

    if (useGoogleSearch) {
      // For Google Search, only tools config should be used. Other configs might conflict.
      // Also, responseMimeType should not be 'application/json' with googleSearch.
      config.tools = [{ googleSearch: {} }];
      // Remove other potentially conflicting configs if any were added for non-search cases
      delete config.responseMimeType; // Ensure this is not set for search
    } else {
      // config.responseMimeType = "text/plain"; // Default or specific if not searching
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: config,
    });

    const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
        web: chunk.web ? { uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri } : undefined,
        retrievedContext: chunk.retrievedContext ? { uri: chunk.retrievedContext.uri, title: chunk.retrievedContext.title || chunk.retrievedContext.uri } : undefined,
    })) || [];

    return { text: response.text, groundingChunks };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return { text: `Error generating response: ${error.message}`, groundingChunks: [] };
    }
    return { text: "An unknown error occurred while generating the response.", groundingChunks: [] };
  }
};

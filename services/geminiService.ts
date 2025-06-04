
import { GoogleGenAI, GenerateContentResponse, Chat, GenerateContentConfig, Content } from "@google/genai";
import { GeminiResponse, GroundingChunk } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set. Gemini API calls will fail.");
  // Potentially throw an error or use a more robust notification system for the user
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); 

export const MODEL_NAME = 'gemini-2.5-flash-preview-04-17'; // Export for use in App.tsx

// Define the type for the parameters of ai.chats.create()
interface CreateChatSessionArgs {
  model: string;
  config?: GenerateContentConfig;
  history?: Content[];
}

/**
 * Creates a new chat session with the Gemini API.
 * @param args Configuration for the chat session, including model, config, and optional history.
 * @returns A Chat instance.
 */
export const createChatSession = (args: CreateChatSessionArgs): Chat => {
  if (!API_KEY) {
    throw new Error("API_KEY is not configured. Cannot create chat session.");
  }
  return ai.chats.create(args);
};

/**
 * Sends a message to an active chat session.
 * @param chat The active Chat instance.
 * @param message The message string to send.
 * @returns A Promise resolving to a GeminiResponse object.
 */
export const sendChatMessage = async (
  chat: Chat,
  message: string,
): Promise<GeminiResponse> => {
  if (!API_KEY) {
    return { text: "Error: API_KEY is not configured. Please set the API_KEY environment variable.", groundingChunks: [] };
  }

  try {
    // Note: The `tools` (like Google Search) are part of the GenerateContentConfig passed
    // when `createChatSession` is called (in args.config.tools).
    // They apply to the entire session. `chat.sendMessage` itself doesn't take a `tools` config.
    const response: GenerateContentResponse = await chat.sendMessage({ message });

    const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
        web: chunk.web ? { uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri } : undefined,
        retrievedContext: chunk.retrievedContext ? { uri: chunk.retrievedContext.uri, title: chunk.retrievedContext.title || chunk.retrievedContext.uri } : undefined,
    })) || [];
    
    const responseText = response.text;

    if (!responseText && response.candidates?.[0]?.finishReason === "SAFETY") {
        return { text: "Response blocked due to safety settings. Try adjusting your prompt.", groundingChunks: [] };
    }
     if (!responseText && response.candidates?.[0]?.finishReason === "OTHER") {
        return { text: "Response was empty or incomplete for other reasons. Please try again or adjust your prompt.", groundingChunks: [] };
    }


    return { text: responseText, groundingChunks };

  } catch (error) {
    console.error("Error calling Gemini API (sendChatMessage):", error);
    if (error instanceof Error) {
        // More specific error handling based on GoogleGenAIError can be added if needed
        return { text: `Error generating response: ${error.message}`, groundingChunks: [] };
    }
    return { text: "An unknown error occurred while generating the response.", groundingChunks: [] };
  }
};

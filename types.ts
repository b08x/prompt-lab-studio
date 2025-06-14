
export interface PromptAttribute {
  id: string;
  name: string;
  value: string;
  description?: string;
  valueType?: 'text' | 'select';
  valueOptions?: string[];
}

export enum PredefinedAttributeKey {
  ROLE = "Role",
  TASK = "Task",
  CONTEXT = "Context",
  FORMAT = "Format",
  TONE = "Tone",
  EXEMPLARS = "Exemplars",
  PERSONA = "Persona",
  NEGATIVE_CONSTRAINTS = "Negative Constraints",
  STYLE_GUIDE = "Style Guide",
  LENGTH = "Length",
  LANGUAGE = "Language",
  AUDIENCE = "Audience",
  GENRE = "Genre",
  DIFFICULTY = "Difficulty"
}

export const PREDEFINED_ATTRIBUTE_DESCRIPTIONS: Record<PredefinedAttributeKey, string> = {
  [PredefinedAttributeKey.ROLE]: "Define the role the AI should assume (e.g., 'Expert Historian', 'Creative Storyteller').",
  [PredefinedAttributeKey.TASK]: "Specify the primary action or goal for the AI (e.g., 'Summarize this text', 'Write a poem').",
  [PredefinedAttributeKey.CONTEXT]: "Provide background information, data, or situational details relevant to the task.",
  [PredefinedAttributeKey.FORMAT]: "Describe the desired output structure (e.g., 'JSON object with keys: name, email', 'Markdown list', 'Python code block').",
  [PredefinedAttributeKey.TONE]: "Set the emotional style or attitude of the response (e.g., 'Formal', 'Humorous', 'Empathetic').",
  [PredefinedAttributeKey.EXEMPLARS]: "Provide one or more examples of the desired input/output format or style.",
  [PredefinedAttributeKey.PERSONA]: "Define the personality characteristics the AI should adopt (e.g., 'Curious child', 'Wise old mentor').",
  [PredefinedAttributeKey.NEGATIVE_CONSTRAINTS]: "Specify what the AI should avoid doing, mentioning, or topics to exclude.",
  [PredefinedAttributeKey.STYLE_GUIDE]: "Reference specific stylistic rules or guidelines to follow (e.g., 'APA style', 'Company brand voice').",
  [PredefinedAttributeKey.LENGTH]: "Specify desired length or range (e.g., 'Approximately 200 words', 'Concise summary').",
  [PredefinedAttributeKey.LANGUAGE]: "Specify the output language (e.g., 'Spanish', 'Japanese').",
  [PredefinedAttributeKey.AUDIENCE]: "Describe the target audience for the response (e.g., 'Children aged 5-7', 'Technical experts').",
  [PredefinedAttributeKey.GENRE]: "The genre of the content (e.g., 'Sci-Fi', 'Fantasy', 'Horror').",
  [PredefinedAttributeKey.DIFFICULTY]: "The difficulty level (e.g., 'Beginner', 'Intermediate', 'Advanced')."
};

export interface ExamplePrompt {
  id: string;
  name: string;
  basePrompt: string;
  attributes: Omit<PromptAttribute, 'id'>[];
  inputVariables?: Omit<InputVariable, 'id'>[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievedContext?: {
    uri: string;
    title: string;
  };
}

export interface GeminiResponse { // This is now primarily for the raw response from the service
  text: string;
  groundingChunks?: GroundingChunk[];
}

export interface InputVariable {
  id: string;
  name: string;
  testValue: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingChunks?: GroundingChunk[];
  error?: string; // For displaying errors specific to a message generation
}

export interface Domain {
  id: string;
  name: string;
  description?: string;
}

export interface DomainAttributeValueConfig {
  domainId: string; // ID of the Domain this config applies to
  attributeName: string; // Name of the attribute (can be PredefinedAttributeKey or custom string)
  valueOptions: string[]; // Array of string options for the attribute's value
}

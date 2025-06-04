# PromptLab Studio

**PromptLab Studio** is a web application designed to help users craft, refine, test, and export structured prompts for AI models, particularly Google's Gemini. It provides an iterative environment for prompt engineering, allowing for dynamic variable substitution, attribute-based prompt construction, and real-time chat interaction with the AI.

## Features

* **Iterative Prompt Design**: Start with a base prompt and incrementally add structured attributes.
* **Dynamic Input Variables**: Define variables (e.g., `{{topic}}`, `{{user_role}}`) within your base prompt and attributes. Provide test values for these variables to see how they affect the final prompt.
* **Structured Prompt Attributes**:
  * Add predefined attributes (Role, Task, Format, Tone, etc.) or create custom attributes to give detailed instructions to the AI.
  * Attribute values can be free-form text or selected from predefined options based on the selected domain and attribute type.
  * Reorder attributes via drag-and-drop to fine-tune the prompt structure.
* **Domain-Specific Suggestions**: Select a domain (e.g., IT, Creative Writing, NLP) to get tailored suggestions for attribute values, making prompt creation more efficient.
* **Live Prompt Preview**: See a real-time preview of the fully constructed prompt, including substituted test variables, before sending it to the AI.
* **Interactive Chat Interface**:
  * Test your structured prompt by starting a chat session directly with the configured Gemini model. The default model is `gemini-2.5-flash-preview-04-17`.
  * Send follow-up messages to continue the conversation.
  * View AI responses, including any cited sources if Google Search is enabled.
* **Google Search Integration**: Optionally enable Google Search to allow the AI to ground its responses with information from the web. This applies to new chat sessions.
* **Code Block Viewing**: Code blocks in AI responses can be opened in a dedicated modal viewer with a copy-to-clipboard feature.
* **Example Prompts**: Load predefined example prompts to quickly get started or see how different features can be used.
* **Export Functionality**:
  * Export your structured prompt templates (base prompt, attributes, and input variables) in Markdown or JSON format.
  * Export the entire chat history in Markdown or JSON format.
* **State Management**: Modifying any part of the prompt configuration (base prompt, attributes, variables, domain, or Google Search option for new chats) will reset the current chat session, ensuring the next chat starts fresh with the updated settings.
* **Error Handling**: Displays informative error messages from the API or application logic, both generally and for specific messages.
* **Responsive Design**: User interface adapts to different screen sizes using Tailwind CSS.

## Tech Stack

* **Frontend**:
  * React 19
  * TypeScript
  * Tailwind CSS for styling
* **AI Integration**:
  * `@google/genai` SDK for interacting with Google's Gemini models.
* **Development Tools**:
  * Vite for fast development and bundling.

## Project Structure

```shell
/
├── public/                 # Static assets (not explicitly shown but typical for Vite)
├── src/
│   ├── components/         # React UI components
│   │   ├── AttributeCreator.tsx
│   │   ├── AttributeItem.tsx
│   │   ├── AttributeList.tsx
│   │   ├── ChatDisplay.tsx
│   │   ├── ChatExportButton.tsx
│   │   ├── ChatInput.tsx
│   │   ├── CodeViewerModal.tsx
│   │   ├── DomainSelector.tsx
│   │   ├── ExampleLoader.tsx
│   │   ├── ExportPromptButton.tsx
│   │   ├── InputVariableManager.tsx
│   │   ├── PromptInput.tsx
│   │   ├── StructuredPromptPreview.tsx
│   │   ├── Tooltip.tsx
│   │   └── icons.tsx         # SVG Icons
│   ├── services/           # API interaction logic
│   │   └── geminiService.ts  # Gemini API integration
│   ├── utils/              # Utility functions
│   │   ├── exportUtils.ts    # Data export formatting
│   │   └── promptUtils.ts    # Prompt construction and variable substitution
│   ├── App.tsx             # Main application component, state management
│   ├── constants.ts        # Predefined data (attributes, domains, examples)
│   ├── index.css           # Global styles (if any beyond Tailwind utility classes)
│   ├── index.tsx           # React application entry point
│   └── types.ts            # TypeScript type definitions
├── .env.local              # Local environment variables (e.g., API Key, gitignored)
├── index.html              # Main HTML entry point for Vite
├── package.json            # Project metadata, dependencies, and scripts
├── tsconfig.json           # TypeScript compiler configuration
├── vite.config.ts          # Vite build tool configuration
└── README.md               # This file
```

*Note: `GeminiResponseDisplay.tsx` exists in the components folder but is not directly utilized by `App.tsx` as `ChatDisplay.tsx` manages response rendering.*

## Setup and Installation

**Prerequisites:**

* Node.js (Version compatible with Vite 6, e.g., ^18.0.0 || ^20.0.0 || >=22.0.0 as per Vite's `package.json` typically)
* npm (comes with Node.js)
* A Google Gemini API Key.

**Steps:**

1. **Clone the repository (if applicable):**

    ```bash
    git clone <repository-url>
    cd prompt-lab-studio # Or your repository's directory name
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

    ((b08x/prompt-lab-studio/prompt-lab-studio-9c747e9510bd9330b549cee2b5c11f2aaa516d19/README.md))

3. **Set up Environment Variables:**
    Create a file named `.env.local` in the root of the project. Add your Gemini API key to this file:

    ```env
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

    Replace `YOUR_GEMINI_API_KEY` with your actual API key ((b08x/prompt-lab-studio/prompt-lab-studio-9c747e9510bd9330b549cee2b5c11f2aaa516d19/README.md),(b08x/prompt-lab-studio/prompt-lab-studio-9c747e9510bd9330b549cee2b5c11f2aaa516d19/vite.config.ts)). The application will not function correctly without this key.

## Running Locally

To run the application in development mode:

```bash
npm run dev
```

This will start the Vite development server, typically accessible at <http://localhost:5173>.

## Running in Production

To create an optimized production build:

```shell
npm run build
```

The output will be in the dist/ directory. You can preview this build locally using:

```shell
npm run preview
```

## Core Functionality Workflow

1. **Start with a Base Prompt**: Enter your core instruction or question in the "Base Prompt" text area.
2. **(Optional) Select a Domain**: Choose a domain (e.g., "Information Technology") to receive tailored suggestions for attribute values.
3. **Add Attributes**: Use the "Add New Attribute" section to define specific characteristics. Choose "Predefined" or "Custom" attributes and provide values. Attributes can be managed in the "Prompt Attributes" list.
4. **Define Input Variables**: In "Input Variables," declare placeholders (e.g., `{{topic}}`) and their test values for use in prompts or attributes.
5. **(Optional) Load Examples**: Use "Load an Example Prompt" for pre-configured starting points.
6. **Review Preview**: The "Structured Prompt Preview" shows the complete text with variables substituted.
7. **Configure and Start Chat**: Optionally enable "Google Search." Click "Start New Chat" to send the previewed prompt to the AI.
8. **Interact**: View AI responses in the "Chat" panel. Use the "View Code Block" button for code snippets. Send follow-up messages via the input field.
9. **Export**: Save prompt templates or chat history using the respective "Export" buttons.
10. **Iterate**: Modifying prompt elements resets the chat, allowing fresh tests with new configurations.

## Key Component Descriptions

* **`App.tsx`**: Orchestrates the application, managing global state (base prompt, attributes, variables, chat, etc.) and integrating all other components.
* **`PromptInput.tsx`**: Textarea for the main base prompt.
* **`AttributeCreator.tsx`**: UI for adding new predefined or custom attributes with dynamic value input fields.
* **`AttributeList.tsx`**: Displays, manages, and allows reordering of added attributes.
  * **`AttributeItem.tsx`**: Renders individual attributes within the list for editing/deletion.
* **`InputVariableManager.tsx`**: Interface for defining and managing input variables and their test values.
* **`DomainSelector.tsx`**: Dropdown for selecting a specific domain to tailor attribute suggestions.
* **`ExampleLoader.tsx`**: Button/dropdown to load predefined example prompts.
* **`StructuredPromptPreview.tsx`**: Displays the fully assembled prompt with variables substituted.
* **`ChatDisplay.tsx`**: Renders the conversation history, loading states, errors, and AI response sources.
* **`ChatInput.tsx`**: Textarea and send button for user messages in an active chat.
* **`ExportPromptButton.tsx`**: Provides Markdown/JSON export options for the prompt template.
* **`ChatExportButton.tsx`**: Provides Markdown/JSON export options for chat history.
* **`CodeViewerModal.tsx`**: Modal for displaying and copying code blocks from AI responses.
* **`Tooltip.tsx`**: Generic tooltip component.
* **`icons.tsx`**: Collection of SVG icons used in the UI.

## Services and Utilities

* **`services/geminiService.ts`**: Manages all interactions with the Google Gemini API, including creating chat sessions and sending messages. It uses the `GEMINI_API_KEY` from environment variables and defaults to the `gemini-2.5-flash-preview-04-17` model.
* **`utils/promptUtils.ts`**: Contains helper functions `substituteVariablesInText` for replacing placeholders in text with their test values, and `generateFullPromptText` to assemble the final prompt string from the base prompt and attributes.
* **`utils/exportUtils.ts`**: Provides `formatChatToMarkdown` and `formatChatToJson` for converting chat history into desired export formats.
* **`constants.ts`**: Defines various constant data used throughout the application, such as predefined attributes options, domains (with descriptions and attribute value configurations), and example prompts.
* **`types.ts`**: Contains all TypeScript interface and type definitions for data structures like `PromptAttribute`, `ChatMessage`, `InputVariable`, etc.

## Contributing

Suggestions and bug reports are welcome. Please open an issue on the project's GitHub repository (if applicable).

## License

(Specify your license here, e.g., MIT, Apache 2.0. If none is specified, it's typically proprietary.)

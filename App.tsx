
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai'; // For Chat type
import { PromptAttribute, ExamplePrompt, ChatMessage, InputVariable, Domain } from './types';
import PromptInput from './components/PromptInput';
import AttributeCreator from './components/AttributeCreator';
import AttributeList from './components/AttributeList';
import StructuredPromptPreview from './components/StructuredPromptPreview';
import ChatDisplay from './components/ChatDisplay'; // Renamed
import ChatInput from './components/ChatInput';   // New
import ExampleLoader from './components/ExampleLoader';
import ExportPromptButton from './components/ExportPromptButton';
import InputVariableManager from './components/InputVariableManager';
import DomainSelector from './components/DomainSelector'; // New
import { createChatSession, sendChatMessage, MODEL_NAME } from './services/geminiService';
import { generateFullPromptText } from './utils/promptUtils';
import { DOMAINS } from './constants'; // New
import { SparklesIcon } from './components/icons';

const generateId = (): string => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [basePrompt, setBasePrompt] = useState<string>('');
  const [attributes, setAttributes] = useState<PromptAttribute[]>([]);
  const [inputVariables, setInputVariables] = useState<InputVariable[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(DOMAINS.find(d => d.id === 'general')?.id || null); // Default to general or null

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentChatInput, setCurrentChatInput] = useState<string>('');
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  
  const [isResponding, setIsResponding] = useState<boolean>(false); // Unified loading state for all AI responses
  const [error, setError] = useState<string | null>(null); // General error for non-chat specific issues
  const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(false);

  const resetChat = () => {
    setChatHistory([]);
    setChatSession(null);
    setCurrentChatInput('');
    // setError(null); // Optionally clear general errors too, or manage them separately
  };

  // --- Attribute Handlers ---
  const handleAddAttribute = useCallback((newAttr: Omit<PromptAttribute, 'id'>) => {
    setAttributes(prev => [...prev, { ...newAttr, id: generateId() }]);
    resetChat();
  }, []);

  const handleUpdateAttribute = useCallback((id: string, updatedAttr: Partial<PromptAttribute>) => {
    setAttributes(prev => prev.map(attr => attr.id === id ? { ...attr, ...updatedAttr } : attr));
    resetChat();
  }, []);

  const handleDeleteAttribute = useCallback((id: string) => {
    setAttributes(prev => prev.filter(attr => attr.id !== id));
    resetChat();
  }, []);

  const handleReorderAttributes = useCallback((reorderedAttributes: PromptAttribute[]) => {
    setAttributes(reorderedAttributes);
    resetChat();
  }, []);

  // --- Input Variable Handlers ---
  const handleAddInputVariable = useCallback(() => {
    setInputVariables(prev => [...prev, { id: generateId(), name: '', testValue: '' }]);
    resetChat();
  }, []);

  const handleUpdateInputVariable = useCallback((id: string, updatedVar: Partial<Pick<InputVariable, 'name' | 'testValue'>>) => {
    setInputVariables(prev => prev.map(v => v.id === id ? { ...v, ...updatedVar } : v));
    resetChat();
  }, []);

  const handleDeleteInputVariable = useCallback((id: string) => {
    setInputVariables(prev => prev.filter(v => v.id !== id));
    resetChat();
  }, []);

  // --- Domain Handler ---
  const handleSelectDomain = (domainId: string | null) => {
    setSelectedDomainId(domainId);
    resetChat(); // Domain change likely implies new prompt context
  };

  const handleLoadExample = useCallback((example: ExamplePrompt) => {
    setBasePrompt(example.basePrompt);
    setAttributes(example.attributes.map(attr => ({ ...attr, id: generateId() })));
    setInputVariables(example.inputVariables ? example.inputVariables.map(v => ({ ...v, id: generateId() })) : []);
    setSelectedDomainId(DOMAINS.find(d => d.id === 'general')?.id || null); // Reset domain on example load or detect from example
    resetChat();
    setError(null);
  }, []);

  const handleBasePromptChange = (newBasePrompt: string) => {
    setBasePrompt(newBasePrompt);
    resetChat();
  };
  
  // --- Chat Handlers ---
  const handleStartChat = useCallback(async () => {
    setIsResponding(true);
    setError(null);
    resetChat(); // Clears old history and session

    const fullPromptText = generateFullPromptText(basePrompt, attributes, inputVariables);
    
    if (fullPromptText === "Prompt is empty. Add a base prompt or attributes.") {
        setError("Prompt is empty. Please add content before starting a chat.");
        setIsResponding(false);
        return;
    }
    
    const hasPlaceholders = /{{\s*[^}\s]+\s*}}/g.test(basePrompt) || attributes.some(attr => /{{\s*[^}\s]+\s*}}/g.test(attr.value));
    const allVarsHaveTestValues = inputVariables.every(v => v.name.trim() === "" || v.testValue.trim() !== ""); 

    if (hasPlaceholders && !allVarsHaveTestValues) {
        const undefinedVariables = inputVariables.filter(v => v.name.trim() !== "" && v.testValue.trim() === "");
        if (undefinedVariables.length > 0) {
             setError(`The prompt uses variables that need test values. Missing for: ${undefinedVariables.map(v => v.name).join(', ')}.`);
             setIsResponding(false);
             return;
        }
    }

    const initialUserMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      text: fullPromptText,
      timestamp: new Date(),
    };
    setChatHistory([initialUserMessage]);

    try {
      const chatConfig = { 
        model: MODEL_NAME, 
        config: { 
          ...(useGoogleSearch && { tools: [{googleSearch: {}}] }) 
        } 
      };
      const newChat = createChatSession(chatConfig);
      setChatSession(newChat);

      const response = await sendChatMessage(newChat, fullPromptText);
      
      const modelMessage: ChatMessage = {
        id: generateId(),
        role: 'model',
        text: response.text,
        groundingChunks: response.groundingChunks,
        timestamp: new Date(),
        error: response.text.startsWith("Error:") ? response.text : undefined
      };
      setChatHistory(prev => [...prev, modelMessage]);
      if (modelMessage.error) setError(modelMessage.error);

    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred while starting chat.";
      setError(errorMessage);
      setChatHistory(prev => [...prev, { 
        id: generateId(), role: 'model', text: `Error: ${errorMessage}`, error: errorMessage, timestamp: new Date() 
      }]);
    } finally {
      setIsResponding(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePrompt, attributes, inputVariables, useGoogleSearch]);


  const handleSendFollowUp = useCallback(async () => {
    if (!chatSession || !currentChatInput.trim() || isResponding) return;

    setIsResponding(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      text: currentChatInput,
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, userMessage]);
    setCurrentChatInput('');

    try {
      const response = await sendChatMessage(chatSession, userMessage.text);
      const modelMessage: ChatMessage = {
        id: generateId(),
        role: 'model',
        text: response.text,
        groundingChunks: response.groundingChunks,
        timestamp: new Date(),
        error: response.text.startsWith("Error:") ? response.text : undefined
      };
      setChatHistory(prev => [...prev, modelMessage]);
      if (modelMessage.error) setError(modelMessage.error);

    } catch (e: any)      {
      const errorMessage = e.message || "An unexpected error occurred sending message.";
      setError(errorMessage);
      setChatHistory(prev => [...prev, { 
        id: generateId(), role: 'model', text: `Error: ${errorMessage}`, error: errorMessage, timestamp: new Date() 
      }]);
    } finally {
      setIsResponding(false);
    }
  }, [chatSession, currentChatInput, isResponding]);

  useEffect(() => {
    setError(null);
  }, [basePrompt, attributes, inputVariables, selectedDomainId]);

  const isPromptEmpty = !basePrompt.trim() && attributes.length === 0 && inputVariables.length === 0;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <header className="mb-6 md:mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-700 tracking-tight">PromptLab Studio</h1>
        <p className="text-slate-500 mt-1 md:mt-2 text-base">Iteratively craft, test, and export structured AI prompts with dynamic variables and chat.</p>
      </header>

      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 xl:grid-cols-5 gap-6"> {/* Updated grid columns */}
        {/* Left Column: Inputs, Attribute Management, Preview & Export */}
        <div className="xl:col-span-3 space-y-6"> {/* Updated col-span */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <DomainSelector 
              domains={DOMAINS}
              selectedDomainId={selectedDomainId}
              onSelectDomain={handleSelectDomain}
              disabled={isResponding}
            />
            <PromptInput value={basePrompt} onChange={handleBasePromptChange} disabled={isResponding} />
            <AttributeCreator 
              onAddAttribute={handleAddAttribute} 
              disabled={isResponding}
              selectedDomainId={selectedDomainId}
            />
            <InputVariableManager
              variables={inputVariables}
              onAddVariable={handleAddInputVariable}
              onUpdateVariable={handleUpdateInputVariable}
              onDeleteVariable={handleDeleteInputVariable}
              disabled={isResponding}
            />
            <ExampleLoader onLoadExample={handleLoadExample} disabled={isResponding} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-700 mb-3">Prompt Attributes</h2>
              <div className="max-h-[calc(100vh-600px)] md:max-h-[calc(100vh-520px)] xl:max-h-[300px] overflow-y-auto p-1 -m-1">
                <AttributeList
                  attributes={attributes}
                  onUpdateAttribute={handleUpdateAttribute}
                  onDeleteAttribute={handleDeleteAttribute}
                  onReorderAttributes={handleReorderAttributes}
                  disabled={isResponding}
                />
              </div>
            </div>
          </div>
        
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <StructuredPromptPreview 
              basePrompt={basePrompt} 
              attributes={attributes} 
              inputVariables={inputVariables} 
            />
            <ExportPromptButton 
              basePrompt={basePrompt} 
              attributes={attributes} 
              inputVariables={inputVariables} 
              disabled={isResponding || isPromptEmpty}
            />
          </div>
        </div>

        {/* Right Column: Actions and Output */}
        <div className="xl:col-span-2 space-y-6"> {/* Updated col-span */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <input
                type="checkbox"
                id="useGoogleSearch"
                checked={useGoogleSearch}
                onChange={(e) => { setUseGoogleSearch(e.target.checked); if (chatSession) resetChat(); }}
                disabled={isResponding} 
                className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
              />
              <label htmlFor="useGoogleSearch" className="text-sm text-slate-600">
                Enable Google Search <span className="text-xs text-slate-500">(for new chats)</span>
              </label>
            </div>

            <button
              onClick={handleStartChat}
              disabled={isResponding || isPromptEmpty}
              className="w-full flex items-center justify-center px-6 py-3 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed font-semibold"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              {isResponding && chatHistory.length === 0 ? 'Starting Chat...' : (isResponding ? 'Processing...' : 'Start New Chat')}
            </button>
             {error && !chatHistory.some(msg => msg.error) && ( 
                <p className="text-sm text-red-600 p-2 bg-red-50 rounded-md text-center">{error}</p>
             )}
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-6 flex flex-col" style={{height: 'calc(100vh - 100px)', maxHeight: '800px'}}>
            <ChatDisplay 
              chatHistory={chatHistory} 
              isLoading={isResponding && chatHistory.length > 0 && chatHistory[chatHistory.length-1].role === 'user'} // isLoading for follow-up
              isStartingChat={isResponding && chatHistory.length === 0} // isLoading for initial chat start
            />
            {chatSession && ( 
              <ChatInput
                value={currentChatInput}
                onChange={setCurrentChatInput}
                onSend={handleSendFollowUp}
                disabled={isResponding || !chatSession}
              />
            )}
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} PromptLab Studio. Experiment and iterate for the best results!</p>
      </footer>
    </div>
  );
};

export default App;

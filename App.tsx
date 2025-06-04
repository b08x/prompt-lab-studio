
import React, { useState, useCallback, useEffect } from 'react';
import { PromptAttribute, ExamplePrompt, GeminiResponse, InputVariable } from './types';
import PromptInput from './components/PromptInput';
import AttributeCreator from './components/AttributeCreator';
import AttributeList from './components/AttributeList';
import StructuredPromptPreview from './components/StructuredPromptPreview';
import GeminiResponseDisplay from './components/GeminiResponseDisplay';
import ExampleLoader from './components/ExampleLoader';
import ExportPromptButton from './components/ExportPromptButton';
import InputVariableManager from './components/InputVariableManager'; // New import
import { generatePromptResponse } from './services/geminiService';
import { generateFullPromptText } from './utils/promptUtils'; // Updated import
import { SparklesIcon } from './components/icons';

const generateId = (): string => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [basePrompt, setBasePrompt] = useState<string>('');
  const [attributes, setAttributes] = useState<PromptAttribute[]>([]);
  const [inputVariables, setInputVariables] = useState<InputVariable[]>([]); // New state for variables
  const [llmResponse, setLlmResponse] = useState<GeminiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(false);

  // --- Attribute Handlers ---
  const handleAddAttribute = useCallback((newAttr: Omit<PromptAttribute, 'id'>) => {
    setAttributes(prev => [...prev, { ...newAttr, id: generateId() }]);
  }, []);

  const handleUpdateAttribute = useCallback((id: string, updatedAttr: Partial<PromptAttribute>) => {
    setAttributes(prev => prev.map(attr => attr.id === id ? { ...attr, ...updatedAttr } : attr));
  }, []);

  const handleDeleteAttribute = useCallback((id: string) => {
    setAttributes(prev => prev.filter(attr => attr.id !== id));
  }, []);

  const handleReorderAttributes = useCallback((reorderedAttributes: PromptAttribute[]) => {
    setAttributes(reorderedAttributes);
  }, []);

  // --- Input Variable Handlers ---
  const handleAddInputVariable = useCallback(() => {
    setInputVariables(prev => [...prev, { id: generateId(), name: '', testValue: '' }]);
  }, []);

  const handleUpdateInputVariable = useCallback((id: string, updatedVar: Partial<Pick<InputVariable, 'name' | 'testValue'>>) => {
    setInputVariables(prev => prev.map(v => v.id === id ? { ...v, ...updatedVar } : v));
  }, []);

  const handleDeleteInputVariable = useCallback((id: string) => {
    setInputVariables(prev => prev.filter(v => v.id !== id));
  }, []);


  const handleLoadExample = useCallback((example: ExamplePrompt) => {
    setBasePrompt(example.basePrompt);
    setAttributes(example.attributes.map(attr => ({ ...attr, id: generateId() })));
    setInputVariables(example.inputVariables ? example.inputVariables.map(v => ({ ...v, id: generateId() })) : []);
    setLlmResponse(null);
    setError(null);
  }, []);

  const handleGenerateResponse = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setLlmResponse(null);

    // generateFullPromptText now handles substitution using inputVariables
    const fullPromptText = generateFullPromptText(basePrompt, attributes, inputVariables);
    
    if (fullPromptText === "Prompt is empty. Add a base prompt or attributes.") {
        setError("Prompt is empty. Please add a base prompt or some attributes before generating.");
        setIsLoading(false);
        return;
    }

    // Basic check: if variables are used ({{...}}) but not all defined vars have names or test values.
    const hasPlaceholders = /{{\s*[^}\s]+\s*}}/g.test(basePrompt) || attributes.some(attr => /{{\s*[^}\s]+\s*}}/g.test(attr.value));
    const allVarsDefined = inputVariables.every(v => v.name.trim() !== "" && v.testValue.trim() !== "");
    if (inputVariables.length > 0 && !allVarsDefined && hasPlaceholders) {
        const undefinedVariables = inputVariables.filter(v => v.name.trim() === "" || v.testValue.trim() === "");
        if (undefinedVariables.length > 0) {
            setError(`Please provide a name and test value for all defined input variables. Missing for: ${undefinedVariables.map(v => v.name || "Unnamed").join(', ')}.`);
            setIsLoading(false);
            return;
        }
    }


    try {
      const response = await generatePromptResponse(fullPromptText, useGoogleSearch);
      setLlmResponse(response);
      if(response.text.startsWith("Error:")) {
        setError(response.text);
        setLlmResponse(null);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      setLlmResponse(null);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePrompt, attributes, inputVariables, useGoogleSearch]);

  useEffect(() => {
    setLlmResponse(null);
    setError(null);
  }, [basePrompt, attributes, inputVariables]);

  const isPromptEmpty = !basePrompt.trim() && attributes.length === 0 && inputVariables.length === 0;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <header className="mb-6 md:mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-700 tracking-tight">PromptLab Studio</h1>
        <p className="text-slate-500 mt-1 md:mt-2 text-base">Iteratively craft, test, and export structured AI prompts with dynamic variables.</p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Wider): Inputs, Attribute Management, Preview & Export */}
        <div className="xl:col-span-2 space-y-6">
          {/* Section 1: Prompt Definition & Variables */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <PromptInput value={basePrompt} onChange={setBasePrompt} disabled={isLoading} />
            <AttributeCreator onAddAttribute={handleAddAttribute} disabled={isLoading} />
            <InputVariableManager
              variables={inputVariables}
              onAddVariable={handleAddInputVariable}
              onUpdateVariable={handleUpdateInputVariable}
              onDeleteVariable={handleDeleteInputVariable}
              disabled={isLoading}
            />
            <ExampleLoader onLoadExample={handleLoadExample} disabled={isLoading} />
          </div>

          {/* Section 2: Attributes */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-700 mb-3">Prompt Attributes</h2>
              <div className="max-h-[calc(100vh-600px)] md:max-h-[calc(100vh-520px)] xl:max-h-[300px] overflow-y-auto p-1 -m-1">
                <AttributeList
                  attributes={attributes}
                  onUpdateAttribute={handleUpdateAttribute}
                  onDeleteAttribute={handleDeleteAttribute}
                  onReorderAttributes={handleReorderAttributes}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        
          {/* Section 3: Preview & Export */}
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
              disabled={isLoading || isPromptEmpty}
            />
          </div>
        </div>

        {/* Right Column (Narrower): Actions and Output */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <input
                type="checkbox"
                id="useGoogleSearch"
                checked={useGoogleSearch}
                onChange={(e) => setUseGoogleSearch(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
              />
              <label htmlFor="useGoogleSearch" className="text-sm text-slate-600">
                Enable Google Search <span className="text-xs text-slate-500">(for recent info)</span>
              </label>
            </div>

            <button
              onClick={handleGenerateResponse}
              disabled={isLoading || isPromptEmpty}
              className="w-full flex items-center justify-center px-6 py-3 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed font-semibold"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              {isLoading ? 'Generating...' : 'Generate Response'}
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-6">
            <GeminiResponseDisplay response={llmResponse} isLoading={isLoading} error={error} />
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


import React from 'react';
import { PromptAttribute, InputVariable } from '../types';
import { generateFullPromptText } from '../utils/promptUtils'; // Updated import

interface StructuredPromptPreviewProps {
  basePrompt: string;
  attributes: PromptAttribute[];
  inputVariables: InputVariable[]; // Added inputVariables
}

const StructuredPromptPreview: React.FC<StructuredPromptPreviewProps> = ({ basePrompt, attributes, inputVariables }) => {
  // generateFullPromptText now handles substitution internally
  const fullPromptText = generateFullPromptText(basePrompt, attributes, inputVariables);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-slate-700">Structured Prompt Preview</h3>
        {inputVariables.length > 0 && (
            <span className="text-xs text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">Variables Substituted</span>
        )}
      </div>
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg overflow-y-auto min-h-[100px]">
        <pre className="whitespace-pre-wrap text-sm text-slate-700 break-words">
          {fullPromptText}
        </pre>
      </div>
      <p className="mt-1 text-xs text-slate-500">This is what will be sent to the AI (with test variables applied).</p>
    </div>
  );
};

export default StructuredPromptPreview;

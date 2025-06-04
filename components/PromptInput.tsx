
import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="mb-6">
      <label htmlFor="basePrompt" className="block text-sm font-medium text-slate-700 mb-1">
        Base Prompt
      </label>
      <textarea
        id="basePrompt"
        rows={4}
        className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 transition duration-150 ease-in-out disabled:bg-slate-100 disabled:cursor-not-allowed"
        placeholder="Enter your core prompt idea or instruction here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <p className="mt-1 text-xs text-slate-500">This is the starting point for your structured prompt.</p>
    </div>
  );
};

export default PromptInput;

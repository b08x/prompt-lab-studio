
import React from 'react';
import { ExamplePrompt } from '../types';
import { EXAMPLE_PROMPTS } from '../constants'; // Assuming constants.ts exports EXAMPLE_PROMPTS
import { ChevronDownIcon } from './icons';

interface ExampleLoaderProps {
  onLoadExample: (example: ExamplePrompt) => void;
  disabled?: boolean;
}

const ExampleLoader: React.FC<ExampleLoaderProps> = ({ onLoadExample, disabled }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelectExample = (example: ExamplePrompt) => {
    onLoadExample(example);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 transition duration-150 ease-in-out disabled:bg-slate-100 disabled:cursor-not-allowed"
      >
        <span className="text-sm">Load an Example Prompt</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {EXAMPLE_PROMPTS.length > 0 ? (
            EXAMPLE_PROMPTS.map(example => (
              <button
                key={example.id}
                onClick={() => handleSelectExample(example)}
                className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
              >
                {example.name}
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-slate-500">No examples available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExampleLoader;


import React, { useState, useRef, useEffect } from 'react';
import { PromptAttribute, InputVariable } from '../types';
import { DocumentArrowDownIcon, ChevronDownIcon } from './icons';

interface ExportPromptButtonProps {
  basePrompt: string;
  attributes: PromptAttribute[];
  inputVariables: InputVariable[]; // Added inputVariables
  disabled?: boolean;
}

const ExportPromptButton: React.FC<ExportPromptButtonProps> = ({ basePrompt, attributes, inputVariables, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatMarkdown = (): string => {
    let markdown = `# Base Prompt (Template)\n${basePrompt || "Not specified."}\n\n`;
    
    if (attributes.length > 0) {
      markdown += `## Attributes (Template)\n`;
      attributes.forEach(attr => {
        markdown += `- **${attr.name}**: ${attr.value}\n`; // Store with placeholders
      });
      markdown += `\n`;
    }

    if (inputVariables.length > 0) {
      markdown += `## Input Variables (Test Values)\n`;
      inputVariables.forEach(variable => {
        markdown += `- **${variable.name}**: ${variable.testValue}\n`;
      });
    }
    return markdown;
  };

  const formatJson = (): string => {
    return JSON.stringify({
      basePrompt, // Store with placeholders
      attributes: attributes.map(attr => ({ name: attr.name, value: attr.value, description: attr.description })), // Store with placeholders
      inputVariables: inputVariables.map(v => ({ name: v.name, testValue: v.testValue })),
    }, null, 2);
  };

  const handleExport = (format: 'markdown' | 'json') => {
    const content = format === 'markdown' ? formatMarkdown() : formatJson();
    const filename = format === 'markdown' ? 'prompt_template.md' : 'prompt_template.json';
    const mimeType = format === 'markdown' ? 'text/markdown' : 'application/json';

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const canExport = basePrompt.trim() !== '' || attributes.length > 0 || inputVariables.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || !canExport}
        className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-600 text-white rounded-lg shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 transition duration-150 ease-in-out disabled:bg-slate-300 disabled:cursor-not-allowed text-sm font-medium"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
        Export Prompt Template
        <ChevronDownIcon className={`w-5 h-5 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-20 bottom-full mb-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg py-1">
          <button
            onClick={() => handleExport('markdown')}
            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
          >
            Export as Markdown (.md)
          </button>
          <button
            onClick={() => handleExport('json')}
            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
          >
            Export as JSON (.json)
          </button>
        </div>
      )}
      {!canExport && <p className="text-xs text-slate-500 mt-1 text-center">Add content to enable export.</p>}
    </div>
  );
};

export default ExportPromptButton;

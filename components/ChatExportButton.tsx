
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { DocumentArrowDownIcon, ChevronDownIcon } from './icons';
import { formatChatToMarkdown, formatChatToJson } from '../utils/exportUtils';

interface ChatExportButtonProps {
  chatHistory: ChatMessage[];
  disabled?: boolean;
}

const ChatExportButton: React.FC<ChatExportButtonProps> = ({ chatHistory, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleExport = (format: 'markdown' | 'json') => {
    const content = format === 'markdown' ? formatChatToMarkdown(chatHistory) : formatChatToJson(chatHistory);
    const filename = format === 'markdown' ? 'chat_history.md' : 'chat_history.json';
    const mimeType = format === 'markdown' ? 'text/markdown;charset=utf-8' : 'application/json;charset=utf-8';

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

  const canExport = chatHistory.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || !canExport}
        className="flex items-center px-3 py-1.5 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 transition duration-150 ease-in-out disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-xs font-medium"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <DocumentArrowDownIcon className="w-4 h-4 mr-1.5" />
        Export Chat
        <ChevronDownIcon className={`w-4 h-4 ml-1.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-30 right-0 mt-1 w-48 bg-white border border-slate-300 rounded-lg shadow-lg py-1">
          <button
            onClick={() => handleExport('markdown')}
            className="block w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
          >
            As Markdown (.md)
          </button>
          <button
            onClick={() => handleExport('json')}
            className="block w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
          >
            As JSON (.json)
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatExportButton;

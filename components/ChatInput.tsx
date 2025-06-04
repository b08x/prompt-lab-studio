
import React from 'react';
import { PaperAirplaneIcon } from './icons';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, disabled }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!disabled && value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="mt-auto p-1 border-t border-slate-200 bg-white w-full"> {/* sticky bottom-0 */}
      <div className="flex items-center space-x-2">
        <textarea
          rows={2}
          className="flex-grow p-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 transition duration-150 ease-in-out text-sm disabled:bg-slate-100 disabled:cursor-not-allowed resize-none"
          placeholder="Type your message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Chat message input"
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="p-2.5 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 transition duration-150 ease-in-out disabled:bg-slate-300 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

import React, { useEffect, useRef, useState } from 'react';
import { LoadingSpinnerIcon, ExternalLinkIcon, SparklesIcon, CodeBracketIcon } from './icons'; // Removed ClipboardDocumentIcon, CheckIcon, Added CodeBracketIcon
import { ChatMessage } from '../types'; 
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';
import ChatExportButton from './ChatExportButton';

interface ChatDisplayProps {
  chatHistory: ChatMessage[];
  isLoading: boolean; 
  isStartingChat: boolean;
  onOpenCodeViewer: (code: string, language?: string) => void; // New prop
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ chatHistory, isLoading, isStartingChat, onOpenCodeViewer }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const customRenderers = {
    code: ({ node, inline, className, children, ...props }) => {
      const codeString = String(children).replace(/\n$/, ''); 
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : undefined;

      if (inline) {
        return <code className={`bg-slate-200 text-slate-800 px-1 py-0.5 rounded-sm text-xs font-mono ${className || ''}`} {...props}>{children}</code>;
      }

      // For block code, render a button to open the modal
      return (
        <div className="my-3">
          <button
            onClick={() => onOpenCodeViewer(codeString, language)}
            className="inline-flex items-center px-3 py-1.5 bg-slate-200 text-slate-700 rounded-md text-xs hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label={`View ${language || 'code'} block`}
          >
            <CodeBracketIcon className="w-4 h-4 mr-1.5" />
            View {language ? `${language.charAt(0).toUpperCase() + language.slice(1)} ` : ''}Code Block
          </button>
        </div>
      );
    }
  };

  if (chatHistory.length === 0 && !isStartingChat) {
    return (
      <div className="flex-grow p-4 border border-slate-200 rounded-lg bg-white shadow flex flex-col items-center justify-center min-h-[150px]">
        <SparklesIcon className="w-10 h-10 text-slate-300 mb-2" />
        <p className="text-sm text-slate-500 text-center">
          Start a new chat by configuring your prompt and clicking "Start New Chat".
        </p>
      </div>
    );
  }
  
  if (isStartingChat) {
     return (
      <div className="flex-grow p-4 border border-slate-200 rounded-lg bg-white shadow flex flex-col items-center justify-center min-h-[150px]">
        <LoadingSpinnerIcon className="w-8 h-8 text-sky-500" />
        <p className="mt-2 text-sm text-slate-600">Starting chat...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col space-y-4 p-1 overflow-y-auto mb-4">
      <div className="flex justify-between items-center sticky top-0 bg-white py-3 z-10 border-b px-3 -mx-3">
        <h3 className="text-lg font-semibold text-slate-700">Chat</h3>
        <ChatExportButton chatHistory={chatHistory} disabled={isLoading || isStartingChat || chatHistory.length === 0} />
      </div>
      <div className="space-y-4 flex-grow overflow-y-auto p-3 -m-3" style={{maxHeight: 'calc(100% - 110px)'}}>
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[90%] p-3 rounded-xl shadow-md overflow-hidden ${
                msg.role === 'user' 
                  ? 'bg-sky-500 text-white' 
                  : (msg.error ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-slate-100 text-slate-800')
              }`}
            >
              <div className="prose prose-sm max-w-none break-words">
                 <ReactMarkdown components={customRenderers} remarkPlugins={[remarkGfm]}>
                    {msg.text}
                 </ReactMarkdown>
              </div>
              
              {msg.role === 'model' && msg.groundingChunks && msg.groundingChunks.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <h4 className="text-xs font-semibold text-slate-500 mb-1">Sources:</h4>
                  <ul className="list-disc list-inside space-y-0.5">
                    {msg.groundingChunks.map((chunk, index) => {
                      const source = chunk.web || chunk.retrievedContext;
                      if (source && source.uri) {
                        return (
                          <li key={`${msg.id}-grounding-${index}`} className="text-xs">
                            <a 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`inline-flex items-center ${msg.error ? 'text-red-500 hover:text-red-600' : 'text-sky-600 hover:text-sky-700'}`}
                            >
                              {source.title || source.uri}
                              <ExternalLinkIcon className="w-3 h-3 ml-1 flex-shrink-0" />
                            </a>
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              )}
              <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-sky-100' : (msg.error ? 'text-red-400' : 'text-slate-400')} text-right`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && chatHistory.length > 0 && chatHistory[chatHistory.length-1].role === 'user' && (
          <div className="flex justify-start">
            <div className="max-w-[90%] p-3 rounded-xl shadow-md bg-slate-100 text-slate-800 flex items-center">
              <LoadingSpinnerIcon className="w-5 h-5 text-sky-500 mr-2" />
              <span className="text-sm">Generating...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatDisplay;

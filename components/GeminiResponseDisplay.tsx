
import React, { useState } from 'react'; 
import { LoadingSpinnerIcon, ExternalLinkIcon, CodeBracketIcon } from './icons'; // Removed ClipboardDocumentIcon, CheckIcon. Added CodeBracketIcon
import { GeminiResponse as GeminiResponseType } from '../types';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';

interface GeminiResponseDisplayProps {
  response: GeminiResponseType | null;
  isLoading: boolean;
  error: string | null;
  // Add this prop if you intend to use the code modal pattern here as well:
  onOpenCodeViewer?: (code: string, language?: string) => void; 
}

const GeminiResponseDisplay: React.FC<GeminiResponseDisplayProps> = ({ response, isLoading, error, onOpenCodeViewer }) => {
  
  const customRenderers = {
    code: ({ node, inline, className, children, ...props }) => {
      const codeString = String(children).replace(/\n$/, '');
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : undefined;

      if (inline) {
        return <code className={`bg-slate-200 text-slate-800 px-1 py-0.5 rounded-sm text-xs font-mono ${className || ''}`} {...props}>{children}</code>;
      }

      // If onOpenCodeViewer is provided, use the button pattern
      if (onOpenCodeViewer) {
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

      // Fallback to original rendering if onOpenCodeViewer is not provided (or keep original complex renderer if preferred for this specific component)
      // For simplicity in this refactor, I'll remove the direct copy button here, assuming modal is preferred.
      // If this component needs its own copy button, the original logic could be reinstated or adapted.
      return (
        <div className="relative group my-3">
          <pre className={`${className || ''} rounded-md overflow-x-auto`} {...props}>
            <code className={match ? `language-${match[1]}` : ''}>
              {children}
            </code>
          </pre>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 border border-slate-200 rounded-lg bg-white shadow flex flex-col items-center justify-center min-h-[150px]">
        <LoadingSpinnerIcon className="w-8 h-8 text-sky-500" />
        <p className="mt-2 text-sm text-slate-600">Generating response...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-lg shadow">
        <h4 className="text-md font-semibold text-red-700 mb-1">Error</h4>
        <p className="text-sm text-red-600 whitespace-pre-wrap">{error}</p>
      </div>
    );
  }

  if (!response || !response.text.trim()) {
    return (
      <div className="p-4 border border-slate-200 rounded-lg bg-white shadow">
        <p className="text-sm text-slate-500 text-center">No response yet. Generate one to see results here.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-white shadow">
      <h3 className="text-lg font-semibold text-slate-700 mb-2">AI Response</h3>
      <div 
        className="prose prose-sm max-w-none text-slate-700 max-h-[400px] overflow-y-auto" 
      >
        <ReactMarkdown components={customRenderers} remarkPlugins={[remarkGfm]}>
          {response.text}
        </ReactMarkdown>
      </div>
      {response.groundingChunks && response.groundingChunks.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-600 mb-1">Sources (from Google Search):</h4>
          <ul className="list-disc list-inside space-y-1">
            {response.groundingChunks.map((chunk, index) => {
              const source = chunk.web || chunk.retrievedContext;
              if (source && source.uri) {
                return (
                  <li key={index} className="text-xs text-sky-600 hover:text-sky-700">
                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                      {source.title || source.uri}
                      <ExternalLinkIcon className="w-3 h-3 ml-1" />
                    </a>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GeminiResponseDisplay;

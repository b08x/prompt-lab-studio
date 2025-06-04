
import React, { useState } from 'react'; // Added useState
import { LoadingSpinnerIcon, ExternalLinkIcon, ClipboardDocumentIcon, CheckIcon } from './icons'; // Added ClipboardDocumentIcon, CheckIcon
import { GeminiResponse as GeminiResponseType } from '../types';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';

interface GeminiResponseDisplayProps {
  response: GeminiResponseType | null;
  isLoading: boolean;
  error: string | null;
}

const GeminiResponseDisplay: React.FC<GeminiResponseDisplayProps> = ({ response, isLoading, error }) => {
  
  const customRenderers = {
    code: ({ node, inline, className, children, ...props }) => {
      const [isCopied, setIsCopied] = useState(false);
      const codeString = String(children).replace(/\n$/, '');

      const handleCopy = () => {
        if (!codeString) return;
        navigator.clipboard.writeText(codeString).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
          console.error('Failed to copy code:', err);
          alert('Failed to copy code. Ensure you are in a secure context (HTTPS) or have clipboard permissions.');
        });
      };

      const match = /language-(\w+)/.exec(className || '');

      if (inline) {
        return <code className={`bg-slate-200 text-slate-800 px-1 py-0.5 rounded-sm text-xs font-mono ${className || ''}`} {...props}>{children}</code>;
      }

      return (
        <div className="relative group my-3">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 z-10 p-1.5 bg-slate-600 text-white rounded-md text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-slate-700 disabled:opacity-50"
            aria-label={isCopied ? "Copied!" : "Copy code to clipboard"}
            title={isCopied ? "Copied!" : "Copy code to clipboard"}
            disabled={isCopied}
          >
            {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
          </button>
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

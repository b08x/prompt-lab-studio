
import React from 'react';
import { LoadingSpinnerIcon, ExternalLinkIcon } from './icons';
import { GeminiResponse as GeminiResponseType } from '../types'; // Renamed to avoid conflict

interface GeminiResponseDisplayProps {
  response: GeminiResponseType | null;
  isLoading: boolean;
  error: string | null;
}

const GeminiResponseDisplay: React.FC<GeminiResponseDisplayProps> = ({ response, isLoading, error }) => {
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
  
  // Sanitize text before rendering as HTML if necessary, or use a markdown parser for rich text
  // For simplicity, using <pre> for basic formatting.
  // In a real app, consider `react-markdown` for proper Markdown rendering.
  const formattedText = response.text.replace(/```([\s\S]*?)```/g, (match, p1) => {
    const codeContent = p1.trim().split('\n').slice(1).join('\n'); // Attempt to remove language hint like "json"
    return `<pre class="bg-slate-800 text-white p-2 rounded-md my-2 overflow-x-auto">${codeContent || p1.trim()}</pre>`;
  }).replace(/\n/g, '<br />');


  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-white shadow">
      <h3 className="text-lg font-semibold text-slate-700 mb-2">AI Response</h3>
      <div 
        className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap break-words max-h-[400px] overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: formattedText }} // Basic formatting for newlines and code blocks
      />
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

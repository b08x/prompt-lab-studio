
import React, { useState, useEffect } from 'react';
import { ClipboardDocumentIcon, CheckIcon, XMarkIcon } from './icons';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language?: string;
}

const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose, code, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsCopied(false); // Reset copied state when modal closes
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); 
    }).catch(err => {
      console.error('Failed to copy code:', err);
      alert('Failed to copy code. Ensure you are in a secure context (HTTPS) or have clipboard permissions.');
    });
  };
  
  const modalTitle = language 
    ? `${language.charAt(0).toUpperCase() + language.slice(1)} Code` 
    : 'Code Block';

  // Handle Esc key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on overlay click
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-viewer-title"
    >
      <div 
        className="bg-slate-800 text-slate-100 p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col relative transform transition-all duration-300 ease-in-out scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-600">
          <h2 id="code-viewer-title" className="text-xl font-semibold text-sky-400">{modalTitle}</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-sky-400 transition-colors"
            aria-label="Close code viewer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="relative flex-grow overflow-auto bg-slate-900 rounded-md p-1">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 z-10 p-1.5 bg-slate-600 text-white rounded-md text-xs hover:bg-slate-500 disabled:opacity-60"
            aria-label={isCopied ? "Copied!" : "Copy code to clipboard"}
            title={isCopied ? "Copied!" : "Copy code to clipboard"}
            disabled={isCopied}
          >
            {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
          </button>
          {/* Tailwind's prose classes won't apply directly inside this dark modal unless specifically adapted */}
          {/* We'll use basic pre/code styling for a code-editor feel */}
          <pre className="p-3 text-sm whitespace-pre-wrap break-all">
            <code className={language ? `language-${language}` : ''}>
              {code}
            </code>
          </pre>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-600 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeViewerModal;

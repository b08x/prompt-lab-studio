
import React from 'react';
import { InputVariable } from '../types';
import { PlusIcon, TrashIcon, VariableIcon } from './icons';

interface InputVariableManagerProps {
  variables: InputVariable[];
  onAddVariable: () => void;
  onUpdateVariable: (id: string, updatedVariable: Partial<Pick<InputVariable, 'name' | 'testValue'>>) => void;
  onDeleteVariable: (id: string) => void;
  disabled?: boolean;
}

const InputVariableManager: React.FC<InputVariableManagerProps> = ({
  variables,
  onAddVariable,
  onUpdateVariable,
  onDeleteVariable,
  disabled,
}) => {
  const handleNameChange = (id: string, name: string) => {
    // Basic validation: remove {{ and }} if user types them, and trim
    const cleanedName = name.replace(/{{|}}/g, '').trim();
    onUpdateVariable(id, { name: cleanedName });
  };

  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 shadow">
      <h3 className="text-md font-semibold text-slate-700 mb-3 flex items-center">
        <VariableIcon className="w-5 h-5 mr-2 text-sky-600" />
        Input Variables
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        Define variables like <code>{'{{your_variable}}'}</code> to use in your base prompt or attributes. Provide test values for preview and generation.
      </p>
      
      {variables.length > 0 && (
        <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
          {variables.map((variable) => (
            <div key={variable.id} className="flex items-center space-x-2 p-3 bg-white border border-slate-200 rounded-md">
              <input
                type="text"
                placeholder="Variable Name (e.g., topic)"
                value={variable.name}
                onChange={(e) => handleNameChange(variable.id, e.target.value)}
                className="flex-grow p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-100"
                disabled={disabled}
                aria-label={`Variable name for ${variable.name || 'new variable'}`}
              />
              <span className="text-slate-400 text-sm">:</span>
              <input
                type="text"
                placeholder="Test Value"
                value={variable.testValue}
                onChange={(e) => onUpdateVariable(variable.id, { testValue: e.target.value })}
                className="flex-grow p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-100"
                disabled={disabled}
                aria-label={`Test value for ${variable.name || 'new variable'}`}
              />
              <button
                onClick={() => onDeleteVariable(variable.id)}
                disabled={disabled}
                className="p-2 text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
                aria-label={`Delete variable ${variable.name || 'new variable'}`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={onAddVariable}
        disabled={disabled}
        className="w-full flex items-center justify-center px-4 py-2 bg-sky-100 text-sky-700 border border-sky-300 rounded-md hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 transition duration-150 ease-in-out disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-300 disabled:cursor-not-allowed text-sm"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        Add Variable
      </button>
    </div>
  );
};

export default InputVariableManager;

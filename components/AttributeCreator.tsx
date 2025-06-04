
import React, { useState } from 'react';
import { PromptAttribute, PredefinedAttributeKey, PREDEFINED_ATTRIBUTE_DESCRIPTIONS } from '../types';
import { PREDEFINED_ATTRIBUTES_OPTIONS } from '../constants';
import { PlusIcon, ChevronDownIcon } from './icons';
import Tooltip from './Tooltip'; // Assuming Tooltip component exists

interface AttributeCreatorProps {
  onAddAttribute: (attribute: Omit<PromptAttribute, 'id'>) => void;
  disabled?: boolean;
}

const AttributeCreator: React.FC<AttributeCreatorProps> = ({ onAddAttribute, disabled }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [selectedPredefined, setSelectedPredefined] = useState<string>(PREDEFINED_ATTRIBUTES_OPTIONS[0]?.name || '');
  const [predefinedValue, setPredefinedValue] = useState('');

  const handleAdd = () => {
    if (disabled) return;
    if (isCustom) {
      if (customName.trim() && customValue.trim()) {
        onAddAttribute({ name: customName, value: customValue, description: "Custom attribute." });
        setCustomName('');
        setCustomValue('');
      }
    } else {
      if (selectedPredefined && predefinedValue.trim()) {
        const description = PREDEFINED_ATTRIBUTE_DESCRIPTIONS[selectedPredefined as PredefinedAttributeKey] || "Predefined attribute.";
        onAddAttribute({ name: selectedPredefined, value: predefinedValue, description });
        setPredefinedValue('');
      }
    }
  };

  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold text-slate-700">Add New Attribute</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600">Type:</span>
          <button 
            onClick={() => setIsCustom(false)} 
            className={`px-3 py-1 text-xs rounded-md ${!isCustom ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            disabled={disabled}
          >
            Predefined
          </button>
          <button 
            onClick={() => setIsCustom(true)} 
            className={`px-3 py-1 text-xs rounded-md ${isCustom ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            disabled={disabled}
          >
            Custom
          </button>
        </div>
      </div>

      {isCustom ? (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Custom Attribute Name (e.g., 'Word Count Limit')"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-100"
            disabled={disabled}
          />
          <textarea
            placeholder="Value for custom attribute"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            rows={2}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-100"
            disabled={disabled}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <select
              value={selectedPredefined}
              onChange={(e) => setSelectedPredefined(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md appearance-none focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-100"
              disabled={disabled}
            >
              {PREDEFINED_ATTRIBUTES_OPTIONS.map(opt => (
                <option key={opt.name} value={opt.name}>{opt.name}</option>
              ))}
            </select>
            <ChevronDownIcon className="w-5 h-5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <Tooltip text={PREDEFINED_ATTRIBUTE_DESCRIPTIONS[selectedPredefined as PredefinedAttributeKey] || "Select an attribute type."}>
             <p className="text-xs text-slate-500 truncate">{PREDEFINED_ATTRIBUTE_DESCRIPTIONS[selectedPredefined as PredefinedAttributeKey]}</p>
          </Tooltip>
          <textarea
            placeholder={`Value for ${selectedPredefined}`}
            value={predefinedValue}
            onChange={(e) => setPredefinedValue(e.target.value)}
            rows={2}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-100"
            disabled={disabled}
          />
        </div>
      )}
      <button
        onClick={handleAdd}
        disabled={disabled || (isCustom ? (!customName.trim() || !customValue.trim()) : (!selectedPredefined || !predefinedValue.trim()))}
        className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add Attribute
      </button>
    </div>
  );
};

export default AttributeCreator;

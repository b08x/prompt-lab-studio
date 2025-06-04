
import React, { useState, useEffect, useCallback } from 'react';
import { PromptAttribute, PredefinedAttributeKey, PREDEFINED_ATTRIBUTE_DESCRIPTIONS } from '../types';
import { PREDEFINED_ATTRIBUTES_OPTIONS, DOMAIN_ATTRIBUTE_VALUE_CONFIGS } from '../constants';
import { PlusIcon, ChevronDownIcon } from './icons';
import Tooltip from './Tooltip';

interface AttributeCreatorProps {
  onAddAttribute: (attribute: Omit<PromptAttribute, 'id'>) => void;
  disabled?: boolean;
  selectedDomainId: string | null;
}

const AttributeCreator: React.FC<AttributeCreatorProps> = ({ onAddAttribute, disabled, selectedDomainId }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [currentValue, setCurrentValue] = useState(''); // Unified value state
  const [selectedPredefinedKey, setSelectedPredefinedKey] = useState<string>(PREDEFINED_ATTRIBUTES_OPTIONS[0]?.name || '');
  
  const [currentValueOptions, setCurrentValueOptions] = useState<string[] | null>(null);
  const [currentValueType, setCurrentValueType] = useState<'text' | 'select'>('text');

  const getCurrentAttributeName = useCallback(() => {
    return isCustom ? customName.trim() : selectedPredefinedKey;
  }, [isCustom, customName, selectedPredefinedKey]);

  useEffect(() => {
    const attributeName = getCurrentAttributeName();
    if (selectedDomainId && attributeName) {
      const config = DOMAIN_ATTRIBUTE_VALUE_CONFIGS.find(
        c => c.domainId === selectedDomainId && c.attributeName === attributeName
      );
      if (config && config.valueOptions.length > 0) {
        setCurrentValueOptions(config.valueOptions);
        setCurrentValueType('select');
        // If current value is not in new options, reset or set to first option
        if (!config.valueOptions.includes(currentValue)) {
           setCurrentValue(config.valueOptions[0] || '');
        }
      } else {
        setCurrentValueOptions(null);
        setCurrentValueType('text');
        // Keep current value as is, since it's a text input now
      }
    } else {
      setCurrentValueOptions(null);
      setCurrentValueType('text');
    }
  }, [selectedDomainId, selectedPredefinedKey, customName, isCustom, getCurrentAttributeName, currentValue]);


  const handleAdd = () => {
    if (disabled) return;
    const attributeName = getCurrentAttributeName();
    
    if (attributeName && currentValue.trim()) {
      let description: string | undefined;
      if (!isCustom) {
        description = PREDEFINED_ATTRIBUTE_DESCRIPTIONS[attributeName as PredefinedAttributeKey] || "Predefined attribute.";
      } else {
        description = "Custom attribute.";
      }

      onAddAttribute({ 
        name: attributeName, 
        value: currentValue, 
        description,
        valueType: currentValueType,
        valueOptions: currentValueType === 'select' ? currentValueOptions || undefined : undefined
      });

      // Reset fields
      if (isCustom) setCustomName('');
      // For predefined, we might not want to reset selectedPredefinedKey, but we reset value
      setCurrentValue(currentValueType === 'select' && currentValueOptions ? (currentValueOptions[0] || '') : '');
      // Reset to default if needed, or re-evaluate options
       if (!isCustom && currentValueType === 'select' && currentValueOptions) {
           setCurrentValue(currentValueOptions[0] || '');
       } else if (currentValueType === 'text'){
           setCurrentValue('');
       }


    }
  };
  
  const handleAttributeTypeToggle = (newIsCustom: boolean) => {
    setIsCustom(newIsCustom);
    setCurrentValue(''); // Reset value when type changes
    // Name also needs reset or re-evaluation
    if (newIsCustom) {
        setSelectedPredefinedKey(PREDEFINED_ATTRIBUTES_OPTIONS[0]?.name || ''); // Reset predefined selection
    } else {
        setCustomName(''); // Reset custom name
    }
    // useEffect will handle re-evaluating valueOptions and type
  };


  const attributeNameForDisplay = isCustom ? "Custom Attribute Name" : selectedPredefinedKey;
  const currentDescription = isCustom ? "Enter a value for your custom attribute." : PREDEFINED_ATTRIBUTE_DESCRIPTIONS[selectedPredefinedKey as PredefinedAttributeKey] || "Enter a value.";


  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold text-slate-700">Add New Attribute</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600">Type:</span>
          <button 
            onClick={() => handleAttributeTypeToggle(false)} 
            className={`px-3 py-1 text-xs rounded-md ${!isCustom ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            disabled={disabled}
          >
            Predefined
          </button>
          <button 
            onClick={() => handleAttributeTypeToggle(true)} 
            className={`px-3 py-1 text-xs rounded-md ${isCustom ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            disabled={disabled}
          >
            Custom
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {isCustom ? (
          <input
            type="text"
            placeholder="Custom Attribute Name (e.g., 'Word Count Limit')"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-100"
            disabled={disabled}
          />
        ) : (
          <div className="relative">
            <select
              value={selectedPredefinedKey}
              onChange={(e) => {
                setSelectedPredefinedKey(e.target.value);
                setCurrentValue(''); // Reset value when attribute name changes
              }}
              className="w-full p-2 border border-slate-300 rounded-md appearance-none focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-100"
              disabled={disabled}
            >
              {PREDEFINED_ATTRIBUTES_OPTIONS.map(opt => (
                <option key={opt.name} value={opt.name}>{opt.name}</option>
              ))}
            </select>
            <ChevronDownIcon className="w-5 h-5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        <Tooltip text={currentDescription}>
           <p className="text-xs text-slate-500 truncate">{currentDescription}</p>
        </Tooltip>

        {currentValueType === 'select' && currentValueOptions ? (
          <div className="relative">
            <select
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md appearance-none focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-100"
              disabled={disabled}
            >
              {currentValueOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDownIcon className="w-5 h-5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        ) : (
          <textarea
            placeholder={`Value for ${attributeNameForDisplay}`}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            rows={2}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-100"
            disabled={disabled}
          />
        )}
      </div>

      <button
        onClick={handleAdd}
        disabled={disabled || !getCurrentAttributeName() || !currentValue.trim()}
        className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add Attribute
      </button>
    </div>
  );
};

export default AttributeCreator;

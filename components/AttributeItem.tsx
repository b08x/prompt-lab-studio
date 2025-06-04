
import React from 'react';
import { PromptAttribute, PREDEFINED_ATTRIBUTE_DESCRIPTIONS, PredefinedAttributeKey } from '../types';
import { TrashIcon, DragHandleIcon, InfoIcon } from './icons';
import Tooltip from './Tooltip';

interface AttributeItemProps {
  attribute: PromptAttribute;
  onUpdate: (id: string, newAttribute: Partial<PromptAttribute>) => void;
  onDelete: (id: string) => void;
  isDraggable?: boolean;
  isDragging?: boolean;
  disabled?: boolean;
}

const AttributeItem: React.FC<AttributeItemProps> = ({ attribute, onUpdate, onDelete, isDraggable = true, isDragging, disabled }) => {
  const description = attribute.description || PREDEFINED_ATTRIBUTE_DESCRIPTIONS[attribute.name as PredefinedAttributeKey] || "Custom attribute.";

  return (
    <div 
      className={`flex items-start space-x-2 p-3 bg-white border border-slate-200 rounded-lg shadow-sm mb-3 ${isDragging ? 'opacity-50 ring-2 ring-sky-500' : ''} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isDraggable && !disabled && (
        <div className="cursor-move pt-2 text-slate-400 hover:text-slate-600">
          <DragHandleIcon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-grow space-y-2">
        <div className="flex items-center">
          <input
            type="text"
            value={attribute.name}
            onChange={(e) => onUpdate(attribute.id, { name: e.target.value })}
            placeholder="Attribute Name"
            className="flex-grow p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm font-medium disabled:bg-slate-100"
            disabled={disabled}
          />
          <Tooltip text={description}>
            <InfoIcon className="w-5 h-5 text-slate-400 hover:text-sky-500 ml-2 cursor-help" />
          </Tooltip>
        </div>
        <textarea
          value={attribute.value}
          onChange={(e) => onUpdate(attribute.id, { value: e.target.value })}
          placeholder="Attribute Value"
          rows={2}
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm disabled:bg-slate-100"
          disabled={disabled}
        />
      </div>
      {!disabled && (
        <button
          onClick={() => onDelete(attribute.id)}
          className="p-2 text-slate-500 hover:text-red-600 transition-colors self-center"
          aria-label="Delete attribute"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default AttributeItem;

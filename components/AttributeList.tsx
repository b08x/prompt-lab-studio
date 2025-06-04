
import React, { useState, useRef } from 'react';
import { PromptAttribute } from '../types';
import AttributeItem from './AttributeItem';

interface AttributeListProps {
  attributes: PromptAttribute[];
  onUpdateAttribute: (id: string, newAttribute: Partial<PromptAttribute>) => void;
  onDeleteAttribute: (id: string) => void;
  onReorderAttributes: (attributes: PromptAttribute[]) => void;
  disabled?: boolean;
}

const AttributeList: React.FC<AttributeListProps> = ({
  attributes,
  onUpdateAttribute,
  onDeleteAttribute,
  onReorderAttributes,
  disabled
}) => {
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const dragOverItem = useRef<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggingItem(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id); // Required for Firefox
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault(); // Important to allow drop
    dragOverItem.current = id;
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Important to allow drop
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggingItem || !dragOverItem.current || draggingItem === dragOverItem.current) {
      setDraggingItem(null);
      dragOverItem.current = null;
      return;
    }

    const newAttributes = [...attributes];
    const draggingItemIndex = newAttributes.findIndex(attr => attr.id === draggingItem);
    const dragOverItemIndex = newAttributes.findIndex(attr => attr.id === dragOverItem.current);

    if (draggingItemIndex === -1 || dragOverItemIndex === -1) return;

    const [draggedItem] = newAttributes.splice(draggingItemIndex, 1);
    newAttributes.splice(dragOverItemIndex, 0, draggedItem);
    
    onReorderAttributes(newAttributes);
    setDraggingItem(null);
    dragOverItem.current = null;
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
    dragOverItem.current = null;
  };

  if (!attributes.length) {
    return <p className="text-sm text-slate-500 text-center py-4">No attributes added yet. Add some to structure your prompt!</p>;
  }

  return (
    <div className="space-y-0" onDragOver={handleDragOver}> {/* Need onDragOver on the container for drop to work smoothly */}
      {attributes.map((attr) => (
        <div
          key={attr.id}
          draggable={!disabled}
          onDragStart={(e) => !disabled && handleDragStart(e, attr.id)}
          onDragEnter={(e) => !disabled && handleDragEnter(e, attr.id)}
          // onDragOver={(e) => e.preventDefault()} // Can be on individual item too
          onDrop={!disabled ? handleDrop : undefined}
          onDragEnd={!disabled ? handleDragEnd : undefined}
          className={`transition-shadow duration-150 ${draggingItem === attr.id ? 'shadow-xl' : ''}`}
        >
          <AttributeItem
            attribute={attr}
            onUpdate={onUpdateAttribute}
            onDelete={onDeleteAttribute}
            isDraggable={!disabled}
            isDragging={draggingItem === attr.id}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
};

export default AttributeList;

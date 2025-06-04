
import React from 'react';
import { Domain } from '../types';
import { ChevronDownIcon } from './icons'; // Assuming icons.tsx has ChevronDownIcon

interface DomainSelectorProps {
  domains: Domain[];
  selectedDomainId: string | null;
  onSelectDomain: (domainId: string | null) => void;
  disabled?: boolean;
}

const DomainSelector: React.FC<DomainSelectorProps> = ({ domains, selectedDomainId, onSelectDomain, disabled }) => {
  return (
    <div className="mb-6">
      <label htmlFor="domainSelector" className="block text-sm font-medium text-slate-700 mb-1">
        Select Domain (Optional)
      </label>
      <div className="relative">
        <select
          id="domainSelector"
          value={selectedDomainId || ""}
          onChange={(e) => onSelectDomain(e.target.value || null)}
          disabled={disabled}
          className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 appearance-none pr-10 transition duration-150 ease-in-out disabled:bg-slate-100 disabled:cursor-not-allowed"
        >
          <option value="">-- No Specific Domain --</option>
          {domains.map(domain => (
            <option key={domain.id} value={domain.id}>
              {domain.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {selectedDomainId && domains.find(d => d.id === selectedDomainId)?.description && (
         <p className="mt-1 text-xs text-slate-500">{domains.find(d => d.id === selectedDomainId)?.description}</p>
      )}
       <p className="mt-1 text-xs text-slate-500">Selecting a domain can provide tailored suggestions for attribute values.</p>
    </div>
  );
};

export default DomainSelector;

import React from 'react';
import { Search, X } from 'lucide-react';

interface EventSearchProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

export const EventSearch: React.FC<EventSearchProps> = ({
  value,
  onChange,
  onClear,
}) => {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-text-muted pointer-events-none transition-colors group-focus-within:text-secondary" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search events, clubs, venues..."
          aria-label="Search events"
          className="w-full pl-12 pr-11 py-3.5 sm:py-4 rounded-2xl bg-[#10121A] border border-white/10 text-white placeholder-text-muted text-sm sm:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-inner transition-all duration-200"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-3.5 p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

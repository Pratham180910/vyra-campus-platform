import React from 'react';
import { Search, X } from 'lucide-react';

interface ClubSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export const ClubSearch: React.FC<ClubSearchProps> = ({
  value,
  onChange,
  resultCount,
}) => {
  return (
    <div className="w-full relative group">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4.5 sm:left-5 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none">
          <Search className="w-4 sm:w-5 h-4 sm:h-5" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search clubs, communities, interests..."
          aria-label="Search clubs, communities, and interests"
          className="w-full pl-11 sm:pl-13 pr-12 sm:pr-24 py-3.5 sm:py-4 bg-[#10121A]/80 border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-full text-sm sm:text-base text-white placeholder-text-muted outline-none backdrop-blur-xl shadow-lg transition-all duration-300 focus:bg-[#121422]"
        />

        {/* Clear Button / Counter */}
        <div className="absolute right-3.5 sm:right-4 flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label="Clear search query"
              className="p-1.5 rounded-full text-text-muted hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {value && (
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/25 text-[11px] font-mono font-bold text-secondary">
              {resultCount} {resultCount === 1 ? 'match' : 'matches'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { SearchX, Bookmark, ArrowRight, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
  isSavedFilter?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters, isSavedFilter = false }) => {
  return (
    <div className="w-full py-20 px-4 flex flex-col items-center justify-center text-center rounded-3xl bg-[#10121A]/60 border border-white/10 my-8">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-text-muted shadow-inner">
        {isSavedFilter ? (
          <Bookmark className="w-8 h-8 text-secondary" />
        ) : (
          <SearchX className="w-8 h-8 text-secondary" />
        )}
      </div>

      <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
        {isSavedFilter ? 'NO SAVED MOMENTS YET' : 'NO MOMENTS FOUND'}
      </h3>

      <p className="mt-2 text-sm sm:text-base text-text-secondary max-w-md">
        {isSavedFilter
          ? 'Save events from Discover and they will appear in your saved list.'
          : 'Try adjusting your search or filters.'}
      </p>

      <button
        type="button"
        onClick={onClearFilters}
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-[#08090D] bg-secondary hover:bg-secondary-hover shadow-glow-lime hover:scale-105 active:scale-95 transition-all cursor-pointer font-mono uppercase tracking-wider"
      >
        {isSavedFilter ? (
          <>
            <span>DISCOVER EVENTS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        ) : (
          <>
            <RotateCcw className="w-3.5 h-3.5" />
            <span>CLEAR FILTERS</span>
          </>
        )}
      </button>
    </div>
  );
};

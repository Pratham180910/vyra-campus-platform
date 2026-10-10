import React from 'react';
import { Compass, RotateCcw } from 'lucide-react';

interface ClubEmptyStateProps {
  onClearFilters: () => void;
}

export const ClubEmptyState: React.FC<ClubEmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="w-full py-16 sm:py-24 px-4 flex flex-col items-center justify-center text-center animate-fade-in">
      {/* Radiant ambient glow */}
      <div
        className="w-40 h-40 rounded-full bg-primary/20 blur-[90px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-secondary shadow-glow-lime">
        <Compass className="w-7 h-7" />
      </div>

      <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
        NO COMMUNITY FOUND
      </h3>

      <p className="mt-2 text-sm sm:text-base text-text-secondary max-w-md leading-relaxed">
        Try another search or explore a different category.
      </p>

      <div className="mt-6">
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs uppercase tracking-wider font-bold text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 transition-all hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-secondary" />
          <span>CLEAR FILTERS</span>
        </button>
      </div>
    </div>
  );
};

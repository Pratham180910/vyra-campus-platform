import React, { useState, useEffect } from 'react';
import { X, Check, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { CLUB_CATEGORIES } from '../../data/clubs';
import type { ClubCategory, ClubSortOption } from '../../types/club';

interface MobileClubFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: ClubCategory;
  selectedSort: ClubSortOption;
  onApply: (category: ClubCategory, sort: ClubSortOption) => void;
  onReset: () => void;
}

const SORT_OPTIONS: ClubSortOption[] = [
  'Recommended',
  'Most Members',
  'Most Active',
  'Newest',
];

export const MobileClubFilters: React.FC<MobileClubFiltersProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  selectedSort,
  onApply,
  onReset,
}) => {
  const [tempCategory, setTempCategory] = useState<ClubCategory>(selectedCategory);
  const [tempSort, setTempSort] = useState<ClubSortOption>(selectedSort);

  useEffect(() => {
    setTempCategory(selectedCategory);
    setTempSort(selectedSort);
  }, [selectedCategory, selectedSort, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(tempCategory, tempSort);
    onClose();
  };

  const handleReset = () => {
    setTempCategory('All');
    setTempSort('Recommended');
    onReset();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-filters-title"
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-h-[85vh] bg-[#0E1018] border-t border-white/15 rounded-t-3xl p-6 sm:p-8 flex flex-col shadow-2xl overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-secondary" />
            <h2
              id="mobile-filters-title"
              className="font-display font-bold text-lg text-white tracking-wide"
            >
              COMMUNITY FILTERS
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 rounded-xl text-text-muted hover:text-white bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Section */}
        <div className="space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted font-bold">
            CATEGORIES
          </p>
          <div className="flex flex-wrap gap-2">
            {CLUB_CATEGORIES.map((cat) => {
              const isSelected = tempCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTempCategory(cat)}
                  className={`px-3.5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                    isSelected
                      ? 'bg-secondary text-[#08090D] font-bold border-secondary shadow-glow-lime'
                      : 'bg-white/5 text-text-secondary border-white/10'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort Section */}
        <div className="space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted font-bold">
            SORT ORDER
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SORT_OPTIONS.map((sort) => {
              const isSelected = tempSort === sort;
              return (
                <button
                  key={sort}
                  type="button"
                  onClick={() => setTempSort(sort)}
                  className={`p-3 rounded-2xl text-xs font-mono uppercase tracking-wider transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-primary/20 text-white font-bold border-primary shadow-glow-purple'
                      : 'bg-white/5 text-text-secondary border-white/10'
                  }`}
                >
                  <span>{sort}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-secondary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3.5 rounded-full font-mono text-xs uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-2 py-3.5 rounded-full font-mono font-bold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <span>APPLY FILTERS</span>
          </button>
        </div>
      </div>
    </div>
  );
};

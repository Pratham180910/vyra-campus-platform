import React from 'react';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { CLUB_CATEGORIES } from '../../data/clubs';
import type { ClubCategory, ClubSortOption } from '../../types/club';

interface ClubFiltersProps {
  selectedCategory: ClubCategory;
  onSelectCategory: (category: ClubCategory) => void;
  selectedSort: ClubSortOption;
  onSelectSort: (sort: ClubSortOption) => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

const SORT_OPTIONS: ClubSortOption[] = [
  'Recommended',
  'Most Members',
  'Most Active',
  'Newest',
];

export const ClubFilters: React.FC<ClubFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  onOpenMobileFilters,
  activeFilterCount,
}) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Filters Trigger Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#10121A] border border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-white hover:border-primary/40 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-secondary" />
          <span>FILTERS</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-secondary text-[#08090D] flex items-center justify-center text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Desktop Category Pills: Horizontally Scrollable on tablet, flex wrapped on large screens */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {CLUB_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 border ${
                  isActive
                    ? 'bg-secondary text-[#08090D] font-bold border-secondary shadow-glow-lime'
                    : 'bg-[#10121A]/70 text-text-secondary hover:text-white hover:bg-white/10 border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-text-muted">
            <ArrowUpDown className="w-3.5 h-3.5 text-secondary" />
            <span>SORT BY</span>
          </div>

          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => onSelectSort(e.target.value as ClubSortOption)}
              aria-label="Sort clubs"
              className="appearance-none bg-[#10121A] border border-white/10 hover:border-white/20 focus:border-primary focus:ring-1 focus:ring-primary/40 rounded-full px-4 py-2 pr-8 text-xs font-mono font-semibold text-white outline-none cursor-pointer transition-colors"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-[#08090D] text-white">
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-[10px]">
              ▼
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

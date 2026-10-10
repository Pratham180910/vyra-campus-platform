import React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export interface FilterState {
  category: string;
  date: string;
  eventType: string;
  sortBy: string;
}

interface EventFiltersProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

const CATEGORIES = [
  'All',
  'Saved',
  'Tech',
  'Hackathons',
  'Cultural',
  'Workshops',
  'Sports',
  'Competitions',
  'Social',
];

const DATE_OPTIONS = [
  { label: 'All dates', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'this_week' },
  { label: 'This month', value: 'this_month' },
  { label: 'Upcoming', value: 'upcoming' },
];

const TYPE_OPTIONS = [
  { label: 'All types', value: 'all' },
  { label: 'Free Pass', value: 'Free' },
  { label: 'Paid Pass', value: 'Paid' },
];

const SORT_OPTIONS = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Most popular', value: 'popular' },
  { label: 'Recently added', value: 'recent' },
];

export const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  onFilterChange,
  onOpenMobileFilters,
  activeFilterCount,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* 1. Category Pills Row (Horizontally scrollable on mobile) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pr-2 max-w-full">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterChange({ category: cat })}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-secondary text-[#08090D] border-secondary shadow-glow-lime scale-[1.02]'
                    : 'bg-[#10121A] text-text-secondary hover:text-white hover:bg-white/10 border-white/10'
                }`}
              >
                {cat === 'Saved' && (
                  <span className="mr-1.5 inline-flex items-center">
                    ★
                  </span>
                )}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Mobile Filters Trigger Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#10121A] border border-white/10 text-xs font-semibold text-text-secondary hover:text-white shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-secondary" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-secondary text-[#08090D] text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* 2. Desktop Secondary Filters & Sorting Controls */}
      <div className="hidden lg:flex items-center justify-between gap-4 pt-2 text-xs">
        <div className="flex items-center gap-4">
          {/* Date Selector */}
          <div className="flex items-center gap-1.5 bg-[#10121A] p-1 rounded-xl border border-white/10">
            <span className="text-text-muted px-2 font-mono text-[11px] uppercase">Date</span>
            {DATE_OPTIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => onFilterChange({ date: d.value })}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filters.date === d.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Event Type (Free / Paid) */}
          <div className="flex items-center gap-1.5 bg-[#10121A] p-1 rounded-xl border border-white/10">
            <span className="text-text-muted px-2 font-mono text-[11px] uppercase">Access</span>
            {TYPE_OPTIONS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => onFilterChange({ eventType: t.value })}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filters.eventType === t.value
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 bg-[#10121A] px-3 py-1.5 rounded-xl border border-white/10">
          <ArrowUpDown className="w-3.5 h-3.5 text-secondary" />
          <span className="text-text-muted font-mono text-[11px] uppercase">Sort</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value} className="bg-[#10121A] text-white">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

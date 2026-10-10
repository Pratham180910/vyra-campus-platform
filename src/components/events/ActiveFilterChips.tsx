import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import type { FilterState } from './EventFilters';

interface ActiveFilterChipsProps {
  searchQuery: string;
  filters: FilterState;
  onClearSearch: () => void;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  searchQuery,
  filters,
  onClearSearch,
  onUpdateFilter,
  onClearAll,
}) => {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (searchQuery.trim()) {
    chips.push({
      label: `"${searchQuery}"`,
      onRemove: onClearSearch,
    });
  }

  if (filters.category !== 'All') {
    chips.push({
      label: `Category: ${filters.category}`,
      onRemove: () => onUpdateFilter({ category: 'All' }),
    });
  }

  if (filters.date !== 'all') {
    const dateNames: Record<string, string> = {
      today: 'Today',
      this_week: 'This Week',
      this_month: 'This Month',
      upcoming: 'Upcoming',
    };
    chips.push({
      label: `Date: ${dateNames[filters.date] || filters.date}`,
      onRemove: () => onUpdateFilter({ date: 'all' }),
    });
  }

  if (filters.eventType !== 'all') {
    chips.push({
      label: `Pass: ${filters.eventType === 'Free' ? 'Free Pass' : 'Paid Pass'}`,
      onRemove: () => onUpdateFilter({ eventType: 'all' }),
    });
  }

  if (filters.sortBy !== 'upcoming') {
    const sortNames: Record<string, string> = {
      recommended: 'Recommended',
      popular: 'Most Popular',
      recent: 'Recently Added',
    };
    chips.push({
      label: `Sort: ${sortNames[filters.sortBy] || filters.sortBy}`,
      onRemove: () => onUpdateFilter({ sortBy: 'upcoming' }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1 animate-fade-in">
      <span className="text-xs font-mono uppercase tracking-wider text-text-muted mr-1">
        Active Filters ({chips.length}):
      </span>

      {chips.map((chip, index) => (
        <button
          key={index}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 text-white transition-all duration-150 group"
          title={`Remove filter: ${chip.label}`}
        >
          <span>{chip.label}</span>
          <X className="w-3 h-3 text-text-muted group-hover:text-acid-lime transition-colors" />
        </button>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs font-mono text-electric-purple hover:text-white transition-colors ml-2 underline underline-offset-4"
      >
        <RotateCcw className="w-3 h-3" />
        <span>CLEAR ALL</span>
      </button>
    </div>
  );
};

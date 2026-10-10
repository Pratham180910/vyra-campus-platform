import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List as ListIcon,
  Clock,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

export type CalendarViewMode = 'MONTH' | 'LIST' | 'AGENDA';
export type CalendarFilterType = 'ALL' | 'SAVED' | 'REGISTERED';

interface CalendarToolbarProps {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  filterType: CalendarFilterType;
  onFilterChange: (filter: CalendarFilterType) => void;
  currentMonthLabel: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  savedCount: number;
  registeredCount: number;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  viewMode,
  onViewModeChange,
  filterType,
  onFilterChange,
  currentMonthLabel,
  onPrevMonth,
  onNextMonth,
  onToday,
  savedCount,
  registeredCount,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0C0E17]/80 border border-white/10 backdrop-blur-md shadow-lg">
        {/* Left: Month Navigator & Today Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
            <button
              type="button"
              onClick={onPrevMonth}
              aria-label="Previous month"
              className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onNextMonth}
              aria-label="Next month"
              className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="font-display font-black text-lg sm:text-xl text-white tracking-wider">
            {currentMonthLabel}
          </h2>

          <button
            type="button"
            onClick={onToday}
            className="px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all ml-1"
          >
            TODAY
          </button>
        </div>

        {/* Center: View Switcher (MONTH / LIST / AGENDA) */}
        <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onViewModeChange('MONTH')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'MONTH'
                ? 'bg-electric-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>MONTH</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('LIST')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'LIST'
                ? 'bg-electric-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>LIST</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('AGENDA')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'AGENDA'
                ? 'bg-electric-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'text-text-muted hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>AGENDA</span>
          </button>
        </div>

        {/* Right: Quick State Filters (ALL / SAVED / REGISTERED) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => onFilterChange('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all border ${
              filterType === 'ALL'
                ? 'bg-white/15 text-white border-white/30 shadow-sm'
                : 'bg-white/[0.03] text-text-secondary border-white/5 hover:text-white'
            }`}
          >
            ALL
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('SAVED')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 transition-all border ${
              filterType === 'SAVED'
                ? 'bg-acid-lime/20 text-acid-lime border-acid-lime/50 shadow-[0_0_12px_rgba(196,255,61,0.25)]'
                : 'bg-white/[0.03] text-text-secondary border-white/5 hover:text-white'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>SAVED ({savedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('REGISTERED')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 transition-all border ${
              filterType === 'REGISTERED'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-white/[0.03] text-text-secondary border-white/5 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>REGISTERED ({registeredCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

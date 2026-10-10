import React, { useEffect, useRef } from 'react';
import { X, RotateCcw, Check, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import type { FilterState } from './EventFilters';

interface MobileFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (updates: FilterState) => void;
  onReset: () => void;
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
  { label: 'All passes', value: 'all' },
  { label: 'Free Pass', value: 'Free' },
  { label: 'Paid Pass', value: 'Paid' },
];

const SORT_OPTIONS = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Most popular', value: 'popular' },
  { label: 'Recently added', value: 'recent' },
];

export const MobileFiltersModal: React.FC<MobileFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = React.useState<FilterState>(filters);
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (!sheetRef.current || !backdropRef.current) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        sheetRef.current,
        { y: '100%' },
        { y: '0%', duration: 0.4, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = '';
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.25 });
      gsap.to(sheetRef.current, { y: '100%', duration: 0.25, ease: 'power2.in' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md opacity-0 transition-opacity"
      />

      {/* Sheet / Modal */}
      <div
        ref={sheetRef}
        className="relative w-full max-w-lg bg-[#0E1018] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-secondary/15 text-secondary">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-display font-bold text-lg text-white">Filter Events</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Options */}
        <div className="py-5 space-y-6">
          {/* Categories */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-secondary mb-3">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, category: c })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    localFilters.category.toLowerCase() === c.toLowerCase()
                      ? 'bg-secondary text-[#08090D] border-secondary'
                      : 'bg-white/5 text-text-secondary border-white/10'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-secondary mb-3">
              Date
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DATE_OPTIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, date: d.value })}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                    localFilters.date === d.value
                      ? 'bg-primary/20 text-white border-primary'
                      : 'bg-white/5 text-text-secondary border-white/10'
                  }`}
                >
                  <span>{d.label}</span>
                  {localFilters.date === d.value && <Check className="w-3.5 h-3.5 text-secondary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Access / Event Type */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-secondary mb-3">
              Access Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, eventType: t.value })}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-colors ${
                    localFilters.eventType === t.value
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-white/5 text-text-secondary border-white/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-secondary mb-3">
              Sort By
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, sortBy: s.value })}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-colors ${
                    localFilters.sortBy === s.value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white/5 text-text-secondary border-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-xs font-semibold text-text-muted hover:text-white bg-white/5 hover:bg-white/10 transition-colors w-1/3"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center justify-center gap-1.5 px-6 py-3 rounded-full text-xs font-semibold text-[#08090D] bg-secondary hover:bg-secondary-hover shadow-glow-lime transition-all w-2/3"
          >
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

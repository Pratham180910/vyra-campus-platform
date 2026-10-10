import React from 'react';
import { Sliders, Sparkles, Check } from 'lucide-react';
import type { StudentProfile } from '../../types/profile';

interface DiscoveryPreferencesSectionProps {
  preferences: StudentProfile['discoveryPreferences'];
  onUpdatePreferences: (
    prefs: Partial<StudentProfile['discoveryPreferences']>
  ) => void;
}

const AVAILABLE_EVENT_TYPES = [
  'WORKSHOPS',
  'HACKATHONS',
  'TECH TALKS',
  'COMPETITIONS',
  'CULTURAL',
  'DESIGN',
];

export const DiscoveryPreferencesSection: React.FC<DiscoveryPreferencesSectionProps> = ({
  preferences,
  onUpdatePreferences,
}) => {
  const toggleEventType = (type: string) => {
    const current = preferences.eventTypes;
    const exists = current.includes(type);
    const updated = exists
      ? current.filter((t) => t !== type)
      : [...current, type];
    onUpdatePreferences({ eventTypes: updated });
  };

  const setDiscoveryMode = (mode: 'ALL' | 'PERSONALIZED') => {
    onUpdatePreferences({ discoveryMode: mode });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sliders className="w-4 h-4 text-electric-purple" />
        <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-text-secondary">
          DISCOVERY PREFERENCES
        </h3>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#0C0E17]/80 border border-white/10 backdrop-blur-md shadow-xl space-y-6">
        {/* Row 1: Discovery Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h4 className="font-display font-bold text-base text-white">
              DISCOVERY FEED MODE
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              Choose how your campus event stream organizes recommended highlights
            </p>
          </div>

          <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setDiscoveryMode('ALL')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all ${
                preferences.discoveryMode === 'ALL'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              ALL EVENTS
            </button>
            <button
              type="button"
              onClick={() => setDiscoveryMode('PERSONALIZED')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                preferences.discoveryMode === 'PERSONALIZED'
                  ? 'bg-electric-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-acid-lime" />
              <span>PERSONALIZED</span>
            </button>
          </div>
        </div>

        {/* Row 2: Event Types */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-base text-white">
              PRIORITIZED EVENT FORMATS
            </h4>
            <span className="text-xs font-mono text-text-muted">
              {preferences.eventTypes.length} selected
            </span>
          </div>

          <p className="text-xs text-text-muted">
            Toggle categories to indicate which campus activities appear first in your feed
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            {AVAILABLE_EVENT_TYPES.map((type) => {
              const isSelected = preferences.eventTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleEventType(type)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-electric-purple/20 border-electric-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                      : 'bg-white/[0.03] border-white/10 text-text-secondary hover:text-white hover:border-white/20'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-acid-lime" />}
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-text-muted">
          💡 Preferences are stored locally on your device for fast, private frontend personalization.
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ProfileCompletionInfo } from '../../types/profile';

interface ProfileCompletionBarProps {
  completion: ProfileCompletionInfo;
  onEditClick?: () => void;
  className?: string;
}

export const ProfileCompletionBar: React.FC<ProfileCompletionBarProps> = ({
  completion,
  onEditClick,
  className = '',
}) => {
  const { percentage, message, missingFields } = completion;

  // Color dynamics based on score
  const isComplete = percentage === 100;
  const isHigh = percentage >= 80;

  const barColor = isComplete
    ? 'from-[#C4FF3D] to-[#10B981]'
    : isHigh
    ? 'from-[#8B5CF6] via-[#A855F7] to-[#C4FF3D]'
    : 'from-[#6366F1] to-[#8B5CF6]';

  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl bg-[#0C0E17]/80 border border-white/10 backdrop-blur-md shadow-lg ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-electric-purple/15 text-electric-purple border border-electric-purple/30">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-text-secondary">
            Profile Completion
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            {percentage}%
          </span>
          {isComplete && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-acid-lime bg-acid-lime/10 px-2 py-0.5 rounded-full border border-acid-lime/30">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-[1px] border border-white/5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Advisory Message */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <p className="text-text-muted leading-relaxed">
          {message}
        </p>

        {!isComplete && onEditClick && (
          <button
            type="button"
            onClick={onEditClick}
            className="inline-flex items-center gap-1 font-mono text-electric-purple hover:text-white transition-colors shrink-0 text-left sm:text-right"
          >
            <span>Complete Profile</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Missing items pills if any */}
      {!isComplete && missingFields.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-text-muted mr-1">To reach 100%:</span>
          {missingFields.slice(0, 3).map((field) => (
            <span
              key={field}
              className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/[0.04] text-text-secondary border border-white/5"
            >
              + {field}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

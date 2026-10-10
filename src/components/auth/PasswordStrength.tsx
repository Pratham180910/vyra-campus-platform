import React, { useMemo } from 'react';
import type { PasswordStrengthLevel } from '../../types/auth';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const strength = useMemo<{ level: PasswordStrengthLevel; score: number; label: string }>(() => {
    if (!password) {
      return { level: null, score: 0, label: '' };
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8 && /[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
    if (password.length >= 10 && /[^a-zA-Z0-9]/.test(password) && /[A-Z]/.test(password)) score += 1;

    if (score <= 1) {
      return { level: 'weak', score: 1, label: 'Weak' };
    }
    if (score === 2) {
      return { level: 'fair', score: 2, label: 'Fair' };
    }
    return { level: 'strong', score: 3, label: 'Strong' };
  }, [password]);

  if (!strength.level) return null;

  const getBarColor = (index: number) => {
    if (index >= strength.score) return 'bg-white/10';

    switch (strength.level) {
      case 'weak':
        return 'bg-amber-400';
      case 'fair':
        return 'bg-primary';
      case 'strong':
        return 'bg-secondary shadow-glow-lime';
      default:
        return 'bg-white/10';
    }
  };

  const getTextColor = () => {
    switch (strength.level) {
      case 'weak':
        return 'text-amber-400';
      case 'fair':
        return 'text-primary';
      case 'strong':
        return 'text-secondary';
      default:
        return 'text-text-muted';
    }
  };

  return (
    <div className="space-y-1.5 pt-1 animate-fade-in" aria-live="polite">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-text-muted uppercase tracking-wider">Security</span>
        <span className={`font-bold uppercase tracking-wider ${getTextColor()}`}>
          {strength.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 h-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${getBarColor(i)}`}
          />
        ))}
      </div>
    </div>
  );
};

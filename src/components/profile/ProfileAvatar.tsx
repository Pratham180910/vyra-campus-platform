import React from 'react';
import type { AvatarStyle } from '../../types/profile';
import { AVATAR_STYLES } from '../../services/profileService';

interface ProfileAvatarProps {
  initials: string;
  styleId?: AvatarStyle;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  initials,
  styleId = 'neon-violet',
  size = 'md',
  className = '',
  showGlow = true,
}) => {
  const currentStyle =
    AVATAR_STYLES.find((s) => s.id === styleId) || AVATAR_STYLES[0];

  const sizeClasses = {
    sm: 'w-9 h-9 rounded-xl text-xs',
    md: 'w-12 h-12 rounded-xl text-sm',
    lg: 'w-16 h-16 rounded-2xl text-xl',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 rounded-3xl text-2xl sm:text-3xl',
  };

  const glowShadow = showGlow
    ? styleId === 'acid-lime'
      ? 'shadow-[0_0_25px_rgba(196,255,61,0.35)]'
      : styleId === 'cyber-cyan'
      ? 'shadow-[0_0_25px_rgba(6,182,212,0.35)]'
      : styleId === 'obsidian-gold'
      ? 'shadow-[0_0_25px_rgba(245,158,11,0.35)]'
      : 'shadow-[0_0_25px_rgba(139,92,246,0.45)]'
    : '';

  return (
    <div
      className={`relative p-[2px] bg-gradient-to-br ${currentStyle.gradient} ${sizeClasses[size]} ${glowShadow} shrink-0 ${className}`}
      aria-hidden="true"
    >
      <div className="w-full h-full bg-[#08090D] rounded-[inherit] flex items-center justify-center overflow-hidden">
        <span className="font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 select-none">
          {initials}
        </span>
      </div>
    </div>
  );
};

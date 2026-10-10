import React from 'react';
import {
  Sparkles,
  Edit3,
  Terminal,
  Compass,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileCompletionBar } from './ProfileCompletionBar';
import type { StudentProfile, ProfileCompletionInfo } from '../../types/profile';

interface ProfileHeroProps {
  profile: StudentProfile;
  completion: ProfileCompletionInfo;
  onEditClick: () => void;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  profile,
  completion,
  onEditClick,
}) => {
  return (
    <section className="relative w-full rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#121422] via-[#0D0F18] to-[#08090D] border border-white/10 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
      {/* Ambient Radial Lighting */}
      <div
        className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-electric-purple/20 blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-acid-lime/10 blur-[110px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Futuristic Orbit Geometry */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="88%"
          cy="28%"
          r="200"
          fill="none"
          stroke="rgba(139,92,246,0.35)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <circle
          cx="88%"
          cy="28%"
          r="290"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
        <circle
          cx="88%"
          cy="28%"
          r="380"
          fill="none"
          stroke="rgba(196,255,61,0.18)"
          strokeWidth="1"
          strokeDasharray="6 10"
        />
      </svg>

      <div className="relative z-10 space-y-8 lg:space-y-10">
        {/* Top Header Row: Eyebrow, Heading, and Edit Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-electric-purple/15 border border-electric-purple/30 text-xs font-mono uppercase tracking-widest text-electric-purple shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-acid-lime" />
              <span>MY IDENTITY</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
              MAKE YOUR
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C4B5FD] to-acid-lime">
                MARK.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
              Your collegiate presence across hackathons, design sprints, technical
              societies, and campus culture.
            </p>
          </div>

          {/* Edit Profile CTA Button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={onEditClick}
              id="edit-profile-button"
              className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-electric-purple hover:bg-electric-purple/90 shadow-[0_0_25px_rgba(139,92,246,0.45)] hover:shadow-[0_0_35px_rgba(139,92,246,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-white/20"
            >
              <Edit3 className="w-4 h-4" />
              <span>EDIT PROFILE →</span>
            </button>
          </div>
        </div>

        {/* Identity Grid: Main Identity Card + Completion Meter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Identity Card (8 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#090B13]/90 border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            {/* Subtle inner corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-electric-purple/10 to-transparent pointer-events-none rounded-bl-3xl" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 pb-6 border-b border-white/10">
              {/* Monogram Avatar */}
              <ProfileAvatar
                initials={profile.initials}
                styleId={profile.avatarStyle}
                size="xl"
              />

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-acid-lime/10 border border-acid-lime/30 text-[11px] font-mono font-bold uppercase tracking-wider text-acid-lime shadow-[0_0_12px_rgba(196,255,61,0.2)]">
                    {profile.roleBadge}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-text-secondary">
                    {profile.year} • {profile.section}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {profile.status}
                  </span>
                </div>

                <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {profile.fullName}
                </h2>

                <p className="text-xs sm:text-sm font-medium text-electric-purple flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-electric-purple" />
                  <span>{profile.department}</span>
                </p>
              </div>
            </div>

            {/* Bio & Academic Badges */}
            <div className="pt-6 space-y-4">
              <p className="text-sm text-text-secondary leading-relaxed italic">
                "{profile.bio}"
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-text-muted">
                <div className="flex items-center gap-1.5 text-text-secondary bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                  <Compass className="w-3.5 h-3.5 text-acid-lime" />
                  <span>{profile.campus}</span>
                </div>

                <div className="flex items-center gap-1.5 text-text-secondary bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                  <Terminal className="w-3.5 h-3.5 text-electric-purple" />
                  <span>{profile.campusNode}</span>
                </div>

                <div className="flex items-center gap-1.5 text-text-secondary bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SRMIST Verified Student ID</span>
                </div>
              </div>
            </div>
          </div>

          {/* Completion Meter (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <ProfileCompletionBar
              completion={completion}
              onEditClick={onEditClick}
            />

            {/* Quick Status Pill Box */}
            <div className="p-5 rounded-2xl bg-[#090B13]/70 border border-white/10 backdrop-blur-md flex items-center justify-between text-xs font-mono text-text-secondary">
              <span className="uppercase tracking-wider">Campus Visibility:</span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 text-white border border-white/10 font-bold">
                {profile.visibility}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Info, Tag, Compass, Sparkles, ShieldCheck } from 'lucide-react';
import type { Club } from '../../types/club';

interface ClubAboutProps {
  club: Club;
}

export const ClubAbout: React.FC<ClubAboutProps> = ({ club }) => {
  return (
    <section className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="p-1 rounded-md bg-primary/20 text-[#C4B5FD]">
          <Info className="w-3.5 h-3.5" />
        </span>
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#C4B5FD] font-bold">
          ABOUT THE COMMUNITY
        </h2>
      </div>

      <div className="p-6 sm:p-9 rounded-3xl bg-[#0E101A] border border-white/10 space-y-6 text-text-secondary leading-relaxed text-sm sm:text-base shadow-xl">
        <p className="text-white font-medium text-base sm:text-lg leading-relaxed">
          {club.description}
        </p>

        {club.department && (
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs sm:text-sm text-text-secondary">
            <div className="w-8 h-8 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Academic Affiliation</p>
              <p className="font-semibold text-white">{club.department}</p>
            </div>
          </div>
        )}

        {/* Interests & Domains */}
        {club.interests && club.interests.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Core Focus Domains</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {club.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 text-white border border-white/10 hover:border-secondary/30 transition-colors"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {club.tags && club.tags.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-primary" />
              <span>Community Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {club.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-mono text-text-secondary bg-[#121422] border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Verified Guild Footnote */}
        <div className="pt-2 flex items-center gap-2 text-xs font-mono text-text-muted">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span>Verified Collegiate Entity • Registered on VYRA Campus Protocol</span>
        </div>
      </div>
    </section>
  );
};

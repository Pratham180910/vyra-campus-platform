import React from 'react';
import { Tag, Code2, Edit3 } from 'lucide-react';
import type { StudentProfile } from '../../types/profile';

interface InterestsAndSkillsSectionProps {
  profile: StudentProfile;
  onEditClick: () => void;
}

export const InterestsAndSkillsSection: React.FC<InterestsAndSkillsSectionProps> = ({
  profile,
  onEditClick,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Your Interests */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0C0E17]/80 border border-white/10 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-electric-purple/15 text-electric-purple border border-electric-purple/30">
                <Tag className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  YOUR INTERESTS
                </h3>
                <p className="text-xs text-text-muted">
                  Focus tracks that personalize your campus discovery
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onEditClick}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
              title="Edit Interests"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-6 flex flex-wrap gap-2.5">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-electric-purple/15 border border-electric-purple/40 shadow-[0_0_12px_rgba(139,92,246,0.2)] hover:border-acid-lime/50 transition-colors"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length === 0 && (
              <p className="text-xs text-text-muted italic">
                No interests selected yet. Click Edit Profile to add focus areas.
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-text-muted flex items-center justify-between">
          <span>{profile.interests.length} Tracks Selected</span>
          <span className="text-electric-purple">Updated from student preferences</span>
        </div>
      </div>

      {/* 2. Skills & Expertise */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0C0E17]/80 border border-white/10 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-acid-lime/15 text-acid-lime border border-acid-lime/30">
                <Code2 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  SKILLS & EXPERTISE
                </h3>
                <p className="text-xs text-text-muted">
                  Technologies, tools, and collegiate craft
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onEditClick}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
              title="Edit Skills"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-6 flex flex-wrap gap-2.5">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-200 bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-acid-lime" />
                <span>{skill}</span>
              </span>
            ))}
            {profile.skills.length === 0 && (
              <p className="text-xs text-text-muted italic">
                No skills listed. Click Edit Profile to add tech stack and tools.
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-text-muted flex items-center justify-between">
          <span>{profile.skills.length} Capabilities Documented</span>
          <span className="text-acid-lime">Collegiate Tech Profile</span>
        </div>
      </div>
    </div>
  );
};

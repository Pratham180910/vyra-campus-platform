import React from 'react';
import { School, Calendar, Hash, MapPin, Sparkles } from 'lucide-react';
import type { StudentProfile } from '../../types/profile';

interface CampusIdentitySectionProps {
  profile: StudentProfile;
}

export const CampusIdentitySection: React.FC<CampusIdentitySectionProps> = ({
  profile,
}) => {
  const credentials = [
    {
      label: 'DEPARTMENT',
      value: profile.department,
      icon: School,
      subtext: 'School of Computing',
      accent: 'text-electric-purple',
      borderGlow: 'hover:border-electric-purple/40',
    },
    {
      label: 'ACADEMIC YEAR',
      value: profile.year,
      icon: Calendar,
      subtext: 'Undergraduate Program',
      accent: 'text-acid-lime',
      borderGlow: 'hover:border-acid-lime/40',
    },
    {
      label: 'SECTION / COHORT',
      value: profile.section,
      icon: Hash,
      subtext: 'Classroom Division',
      accent: 'text-cyan-400',
      borderGlow: 'hover:border-cyan-400/40',
    },
    {
      label: 'CAMPUS',
      value: profile.campus,
      icon: MapPin,
      subtext: 'Main University Zone',
      accent: 'text-amber-400',
      borderGlow: 'hover:border-amber-400/40',
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-acid-lime" />
        <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-text-secondary">
          CAMPUS IDENTITY
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {credentials.map((cred) => {
          const IconComponent = cred.icon;
          return (
            <div
              key={cred.label}
              className={`p-5 rounded-2xl bg-[#0C0E17]/80 border border-white/10 backdrop-blur-md transition-all duration-300 ${cred.borderGlow} group shadow-lg flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between pb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                  {cred.label}
                </span>
                <span
                  className={`p-1.5 rounded-lg bg-white/5 border border-white/5 ${cred.accent} group-hover:scale-110 transition-transform`}
                >
                  <IconComponent className="w-4 h-4" />
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-display font-bold text-lg sm:text-xl text-white tracking-tight break-words">
                  {cred.value}
                </p>
                <p className="text-[11px] font-mono text-text-muted">
                  {cred.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

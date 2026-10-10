import React from 'react';
import { Users, Calendar, Award, Sparkles } from 'lucide-react';
import type { Club } from '../../types/club';

interface ClubStatsProps {
  club: Club;
}

export const ClubStats: React.FC<ClubStatsProps> = ({ club }) => {
  const formatMembers = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const statItems = [
    {
      label: 'MEMBERS',
      value: formatMembers(club.memberCount),
      subtext: 'Active campusers',
      icon: Users,
      color: 'text-primary',
    },
    {
      label: 'UPCOMING EVENTS',
      value: club.upcomingEventCount.toString(),
      subtext: 'On campus calendar',
      icon: Calendar,
      color: 'text-secondary',
    },
    {
      label: 'FOUNDED',
      value: club.foundedYear.toString(),
      subtext: 'Established node',
      icon: Award,
      color: 'text-[#38BDF8]',
    },
    {
      label: 'CATEGORY',
      value: club.category,
      subtext: club.department ? 'Verified Department' : 'Official Division',
      icon: Sparkles,
      color: 'text-[#C4B5FD]',
    },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="p-5 sm:p-6 rounded-3xl bg-[#0E101A] border border-white/10 hover:border-white/20 transition-all duration-300 space-y-2 relative overflow-hidden group shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-text-muted">
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-1">
                <p className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight truncate">
                  {item.value}
                </p>
                <p className="text-[11px] font-mono text-text-secondary truncate mt-0.5">
                  {item.subtext}
                </p>
              </div>

              {/* Ambient micro bottom accent line */}
              <div className="absolute bottom-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

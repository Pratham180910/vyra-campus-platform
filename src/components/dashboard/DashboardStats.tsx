import React from 'react';
import { Ticket, Bookmark, Users, CheckCircle2 } from 'lucide-react';
import type { DashboardStatsData } from '../../types/dashboard';

interface DashboardStatsProps {
  stats: DashboardStatsData;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      label: 'REGISTERED',
      value: stats.registeredCount,
      sublabel: 'Active Passes',
      icon: Ticket,
      color: 'text-primary',
      accent: 'group-hover:border-primary/50 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.25)]',
    },
    {
      label: 'SAVED',
      value: stats.savedCount,
      sublabel: 'For Later',
      icon: Bookmark,
      color: 'text-secondary',
      accent: 'group-hover:border-secondary/50 group-hover:shadow-[0_0_25px_rgba(196,255,61,0.2)]',
    },
    {
      label: 'COMMUNITIES',
      value: stats.communitiesCount,
      sublabel: 'Guilds Joined',
      icon: Users,
      color: 'text-[#38BDF8]',
      accent: 'group-hover:border-[#38BDF8]/50 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]',
    },
    {
      label: 'ATTENDED',
      value: stats.attendedCount,
      sublabel: 'Completed Moments',
      icon: CheckCircle2,
      color: 'text-[#C4B5FD]',
      accent: 'group-hover:border-[#C4B5FD]/50 group-hover:shadow-[0_0_25px_rgba(196,181,253,0.2)]',
    },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`group p-5 sm:p-6 rounded-3xl bg-[#0E101A] border border-white/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden shadow-lg ${card.accent}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-text-muted">
                  {card.label}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-2">
                <p className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight group-hover:text-glow-purple transition-colors">
                  {card.value}
                </p>
                <p className="text-[11px] font-mono text-text-secondary mt-1">
                  {card.sublabel}
                </p>
              </div>

              {/* Ambient bottom line accent */}
              <div className="absolute bottom-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-secondary/50 transition-all" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

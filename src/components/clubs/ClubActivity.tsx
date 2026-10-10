import React from 'react';
import { Activity, Calendar, Trophy, Users, Zap } from 'lucide-react';
import type { Club } from '../../types/club';

interface ClubActivityProps {
  club: Club;
}

export const ClubActivity: React.FC<ClubActivityProps> = ({ club }) => {
  const activities = [
    {
      title: `${club.name} Semester Roadmap Announced`,
      date: 'Active Term',
      type: 'Announcement',
      description: `Official schedule released for weekly workshops, student hackathons, and guest masterclasses.`,
      icon: Calendar,
      color: 'text-secondary',
    },
    {
      title: `${(club.memberCount / 1000).toFixed(1)}K Active Campus Members Milestone`,
      date: 'Semester Metric',
      type: 'Milestone',
      description: `Recognized as one of the fastest growing collegiate divisions under ${club.department || 'SRM Council'}.`,
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'State Showcase & Inter-Collegiate Delegations',
      date: 'Recent Assembly',
      type: 'Achievement',
      description: `Representing the university in national collegiate symposiums and state-level engineering exhibitions.`,
      icon: Trophy,
      color: 'text-[#FACC15]',
    },
    {
      title: `${club.upcomingEventCount} Flagship Gatherings Scheduled`,
      date: 'Calendar Live',
      type: 'Operations',
      description: `Pass allocations and stage schedules published on the official VYRA events platform.`,
      icon: Zap,
      color: 'text-[#38BDF8]',
    },
  ];

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <span className="p-1 rounded-md bg-secondary/15 text-secondary border border-secondary/25">
          <Activity className="w-3.5 h-3.5" />
        </span>
        <h2 className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
          COMMUNITY ACTIVITY
        </h2>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#0E101A] border border-white/10 space-y-5 shadow-xl">
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-secondary before:via-primary/50 before:to-transparent">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="relative group space-y-1">
                {/* Node Dot */}
                <div className="absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full bg-[#08090D] border-2 border-secondary flex items-center justify-center group-hover:scale-125 transition-transform shadow-glow-lime">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-mono">
                  <span className={`flex items-center gap-1 font-bold uppercase tracking-wider ${item.color}`}>
                    <Icon className="w-3 h-3" />
                    <span>{item.type}</span>
                  </span>
                  <span className="text-text-muted">•</span>
                  <span className="text-text-muted">{item.date}</span>
                </div>

                <h4 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-glow-purple transition-colors">
                  {item.title}
                </h4>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

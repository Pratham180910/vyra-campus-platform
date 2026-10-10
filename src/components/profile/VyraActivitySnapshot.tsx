import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Ticket,
  Bookmark,
  Users,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { useSavedEvents } from '../../hooks/useSavedEvents';
import { DASHBOARD_STATS_PREVIEW } from '../../data/dashboardData';
import type { StudentProfile } from '../../types/profile';

interface VyraActivitySnapshotProps {
  profile: StudentProfile;
}

export const VyraActivitySnapshot: React.FC<VyraActivitySnapshotProps> = ({
  profile,
}) => {
  const { savedEventIds } = useSavedEvents();

  // Clean read-only aggregation: dynamic saved count from savedEventsService,
  // registered and attended from established preview data
  const metrics = [
    {
      label: 'EVENTS REGISTERED',
      value: DASHBOARD_STATS_PREVIEW.registeredCount,
      icon: Ticket,
      description: 'Confirmed spots for upcoming campus events',
      link: '/dashboard',
      color: 'text-electric-purple',
    },
    {
      label: 'SAVED FOR LATER',
      value:
        savedEventIds.length > 0
          ? savedEventIds.length
          : DASHBOARD_STATS_PREVIEW.savedCount,
      icon: Bookmark,
      description: 'Bookmarked events in your personal wishlist',
      link: '/events',
      color: 'text-acid-lime',
    },
    {
      label: 'COMMUNITIES',
      value: profile.communityIds.length,
      icon: Users,
      description: 'Clubs and technical divisions affiliated with',
      link: '/clubs',
      color: 'text-cyan-400',
    },
    {
      label: 'EVENTS ATTENDED',
      value: DASHBOARD_STATS_PREVIEW.attendedCount,
      icon: Award,
      description: 'Completed campus experiences & workshops',
      link: '/dashboard',
      color: 'text-amber-400',
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-electric-purple" />
          <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-text-secondary">
            YOUR VYRA ACTIVITY
          </h3>
        </div>

        <Link
          to="/dashboard"
          className="text-xs font-mono text-electric-purple hover:text-white transition-colors inline-flex items-center gap-1 group"
        >
          <span>Open Full Student Dashboard</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const IconComp = metric.icon;
          return (
            <Link
              key={metric.label}
              to={metric.link}
              className="p-5 rounded-2xl bg-[#0C0E17]/80 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                  {metric.label}
                </span>
                <span className={`p-1.5 rounded-lg bg-white/5 border border-white/5 ${metric.color}`}>
                  <IconComp className="w-4 h-4" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-2xl sm:text-3xl text-white">
                    {metric.value}
                  </span>
                  <span className="text-xs font-mono text-text-muted">total</span>
                </div>
                <p className="text-[11px] text-text-secondary line-clamp-2">
                  {metric.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

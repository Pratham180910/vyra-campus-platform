import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Ticket, Bookmark, Eye, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ActivityItem, ActivityType } from '../../types/dashboard';

interface DashboardActivityProps {
  activity: ActivityItem[];
}

export const DashboardActivity: React.FC<DashboardActivityProps> = ({ activity }) => {
  const getActivityBadge = (type: ActivityType) => {
    switch (type) {
      case 'EVENT REGISTERED':
        return {
          icon: Ticket,
          color: 'text-primary bg-primary/10 border-primary/30',
          dot: 'border-primary bg-primary',
        };
      case 'EVENT SAVED':
        return {
          icon: Bookmark,
          color: 'text-secondary bg-secondary/10 border-secondary/30',
          dot: 'border-secondary bg-secondary',
        };
      case 'COMMUNITY VIEWED':
        return {
          icon: Eye,
          color: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30',
          dot: 'border-[#38BDF8] bg-[#38BDF8]',
        };
      case 'EVENT ATTENDED':
        return {
          icon: CheckCircle2,
          color: 'text-[#C4B5FD] bg-[#C4B5FD]/10 border-[#C4B5FD]/30',
          dot: 'border-[#C4B5FD] bg-[#C4B5FD]',
        };
      default:
        return {
          icon: Activity,
          color: 'text-white bg-white/10 border-white/20',
          dot: 'border-white bg-white',
        };
    }
  };

  return (
    <section className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-primary/20 text-[#C4B5FD] border border-primary/30">
            <Activity className="w-4 h-4" />
          </span>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
              RECENT ACTIVITY
            </h2>
          </div>
        </div>

        <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
          Personal Feed Preview
        </span>
      </div>

      {/* Visual Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0E101A] border border-white/10 shadow-xl">
        {activity.length > 0 ? (
          <div className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-7 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-secondary before:via-primary/50 before:to-transparent">
            {activity.map((item) => {
              const badge = getActivityBadge(item.type);
              const Icon = badge.icon;
              return (
                <div key={item.id} className="relative group space-y-1">
                  {/* Node Indicator Dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full bg-[#08090D] border-2 ${badge.dot} flex items-center justify-center group-hover:scale-125 transition-transform shadow-glow-lime`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono">
                      <span className={`px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider flex items-center gap-1 ${badge.color}`}>
                        <Icon className="w-3 h-3" />
                        <span>{item.type}</span>
                      </span>
                      <span className="text-text-muted">•</span>
                      <span className="text-text-muted uppercase tracking-widest">{item.relativeTime}</span>
                    </div>

                    {item.link && (
                      <Link
                        to={item.link}
                        className="text-xs font-mono text-secondary hover:text-white flex items-center gap-1 transition-colors group-hover:translate-x-0.5"
                      >
                        <span>VIEW</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>

                  <h4 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-glow-purple transition-colors pt-0.5">
                    {item.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted">
              NO RECENT ACTIVITY
            </p>
            <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
              Your registered events, saved items, and guild updates will appear in your timeline as you participate.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

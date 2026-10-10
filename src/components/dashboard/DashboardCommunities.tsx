import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users2, ArrowRight, ShieldCheck, Users, Calendar, Sparkles } from 'lucide-react';
import type { Club } from '../../types/club';

interface DashboardCommunitiesProps {
  communities: Club[];
}

export const DashboardCommunities: React.FC<DashboardCommunitiesProps> = ({ communities }) => {
  return (
    <section className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-secondary/15 text-secondary border border-secondary/25">
            <Users2 className="w-4 h-4" />
          </span>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
              <span>MY COMMUNITIES</span>
              {communities.length > 0 && (
                <span className="text-xs font-mono font-bold text-secondary px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
                  {communities.length} JOINED
                </span>
              )}
            </h2>
          </div>
        </div>

        <Link
          to="/clubs"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-secondary hover:text-white transition-colors group"
        >
          <span>EXPLORE COMMUNITIES</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid of Joined Communities or Empty State */}
      {communities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {communities.map((club) => (
            <CommunityPreviewCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="p-10 sm:p-14 rounded-3xl bg-[#0E101A] border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary">
            <Users2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base sm:text-lg text-white">
              NO JOINED COMMUNITIES
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary max-w-sm">
              Join campus guilds and clubs to connect with fellow builders and designers.
            </p>
          </div>
          <Link
            to="/clubs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold text-black bg-secondary hover:bg-secondary-hover shadow-glow-lime transition-all"
          >
            <span>DISCOVER COMMUNITIES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
};

interface CommunityPreviewCardProps {
  club: Club;
}

const CommunityPreviewCard: React.FC<CommunityPreviewCardProps> = ({ club }) => {
  const [imageError, setImageError] = useState(false);

  const formatMembers = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <article className="group h-full flex flex-col rounded-3xl bg-[#0E101A] border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg">
      {/* Cover Image & Monogram */}
      <div className="relative w-full h-32 overflow-hidden bg-[#121422]">
        {!imageError ? (
          <img
            src={club.coverImage}
            alt={club.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center filter brightness-85 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-[#1A1333] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-secondary/50 animate-pulse" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0E101A] via-transparent to-transparent pointer-events-none" />

        {/* Monogram Badge */}
        <div className="absolute -bottom-3 left-4">
          <div className="w-9 h-9 rounded-xl bg-[#08090D] border border-white/20 p-0.5 shadow-md">
            <div className="w-full h-full rounded-[9px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-display font-black text-[10px]">
              {club.shortName.slice(0, 3)}
            </div>
          </div>
        </div>

        {/* Category Pill */}
        <div className="absolute top-2.5 right-2.5">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
            {club.category}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 pt-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-glow-purple transition-colors truncate">
              {club.name}
            </h3>
            {club.verified && (
              <ShieldCheck className="w-3.5 h-3.5 text-secondary shrink-0" />
            )}
          </div>
          <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
            {club.description}
          </p>
        </div>

        {/* Stats & Link */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2 text-text-muted">
            <span className="flex items-center gap-1 text-white">
              <Users className="w-3 h-3 text-primary" />
              <span>{formatMembers(club.memberCount)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-secondary">
              <Calendar className="w-3 h-3" />
              <span>{club.upcomingEventCount}</span>
            </span>
          </div>

          <Link
            to={`/clubs/${club.id}`}
            aria-label={`Open ${club.name}`}
            className="text-secondary hover:text-white flex items-center gap-0.5 font-bold transition-colors"
          >
            <span>HUB</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Club } from '../../types/club';

interface FeaturedClubsProps {
  featuredClubs: Club[];
}

export const FeaturedClubs: React.FC<FeaturedClubsProps> = ({ featuredClubs }) => {
  if (featuredClubs.length === 0) return null;

  return (
    <section className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <span className="p-1 rounded-md bg-secondary/15 text-secondary border border-secondary/25">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
        <h2 className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
          FEATURED COMMUNITIES
        </h2>
      </div>

      {/* Grid of Large Horizontal Featured Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featuredClubs.map((club) => (
          <FeaturedClubCard key={club.id} club={club} />
        ))}
      </div>
    </section>
  );
};

interface FeaturedClubCardProps {
  club: Club;
}

const FeaturedClubCard: React.FC<FeaturedClubCardProps> = ({ club }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group relative rounded-3xl sm:rounded-[2.2rem] bg-gradient-to-br from-[#121422] to-[#0A0C14] border border-white/15 hover:border-primary/60 transition-all duration-300 p-5 sm:p-7 flex flex-col sm:flex-row gap-5 sm:gap-6 shadow-xl hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.3)] hover:-translate-y-1">
      {/* Visual Image Side */}
      <div className="relative w-full sm:w-48 sm:h-auto h-44 rounded-2xl overflow-hidden bg-[#10121A] shrink-0 border border-white/10">
        {!imageError ? (
          <img
            src={club.coverImage}
            alt={`${club.name} featured cover`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 group-hover:scale-106 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-[#181A2A] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-secondary/60 animate-pulse" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Club Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
            {club.category}
          </span>
        </div>
      </div>

      {/* Content & Details Side */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Logo & Verification */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary p-[1px]">
                <div className="w-full h-full bg-[#08090D] rounded-[7px] flex items-center justify-center text-secondary font-display font-black text-[11px]">
                  {club.shortName.slice(0, 3)}
                </div>
              </div>
              <span className="text-xs font-mono text-text-muted">{club.department || 'Official Guild'}</span>
            </div>

            {club.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-secondary/10 text-secondary border border-secondary/30 shadow-glow-lime">
                <ShieldCheck className="w-3 h-3" />
                <span>VERIFIED</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display font-black text-xl sm:text-2xl text-white group-hover:text-glow-purple transition-colors">
            {club.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {club.description}
          </p>
        </div>

        {/* Footer Meta & Action */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3 text-text-muted">
            <span className="flex items-center gap-1 text-white">
              <Users className="w-3.5 h-3.5 text-primary" />
              {(club.memberCount / 1000).toFixed(1)}K members
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-secondary">
              <Calendar className="w-3.5 h-3.5" />
              {club.upcomingEventCount} events
            </span>
          </div>

          <Link
            to={`/clubs/${club.id}`}
            aria-label={`View ${club.name}`}
            className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-secondary group-hover:text-[#08090D] border border-white/10 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

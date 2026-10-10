import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import type { Club } from '../../types/club';

interface ClubCardProps {
  club: Club;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  const [imageError, setImageError] = useState(false);

  const formatMembers = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI & Robotics':
      case 'Technology':
        return 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30';
      case 'Coding':
        return 'text-[#C4FF3D] bg-[#C4FF3D]/10 border-[#C4FF3D]/30';
      case 'Design':
        return 'text-[#F472B6] bg-[#F472B6]/10 border-[#F472B6]/30';
      case 'Cultural':
      case 'Music':
        return 'text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/30';
      case 'Sports':
        return 'text-[#FB923C] bg-[#FB923C]/10 border-[#FB923C]/30';
      case 'Entrepreneurship':
        return 'text-[#FACC15] bg-[#FACC15]/10 border-[#FACC15]/30';
      default:
        return 'text-white bg-white/10 border-white/20';
    }
  };

  return (
    <article className="group h-full flex flex-col rounded-3xl bg-[#0E101A] border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.15)] overflow-hidden">
      {/* 1. Cover Image Section */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-[#121422]">
        {!imageError ? (
          <img
            src={club.coverImage}
            alt={`${club.name} cover`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center filter brightness-[0.88] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1F1538] via-[#10121E] to-[#0A101D] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-secondary/60 animate-pulse" />
          </div>
        )}

        {/* Ambient Overlay Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E101A] via-transparent to-black/25 pointer-events-none" />

        {/* Category Pill (Top Left) */}
        <div className="absolute top-3.5 left-3.5">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${getCategoryColor(
              club.category
            )}`}
          >
            {club.category}
          </span>
        </div>

        {/* Verified Indicator (Top Right) */}
        {club.verified && (
          <div className="absolute top-3.5 right-3.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-secondary border border-secondary/30 shadow-glow-lime">
              <ShieldCheck className="w-3 h-3" />
              <span>VERIFIED</span>
            </span>
          </div>
        )}

        {/* Club Avatar/Logo Pill */}
        <div className="absolute -bottom-4 left-5">
          <div className="w-11 h-11 rounded-2xl bg-[#08090D] border border-white/20 p-1 shadow-lg group-hover:border-secondary transition-colors">
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary via-primary-dark to-[#08090D] flex items-center justify-center text-white font-display font-black text-xs">
              {club.shortName.slice(0, 3)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Body */}
      <div className="flex-1 p-5 sm:p-6 pt-7 sm:pt-8 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-glow-purple transition-colors truncate">
              {club.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {club.description}
          </p>

          {/* Tags */}
          {club.tags && club.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {club.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-text-muted border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3. Footer Stats & Visual CTA */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3 text-text-secondary">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-primary" />
              <strong className="text-white font-semibold">{formatMembers(club.memberCount)}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-secondary" />
              <strong className="text-white font-semibold">{club.upcomingEventCount}</strong> events
            </span>
          </div>

          <Link
            to={`/clubs/${club.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary group-hover:text-white transition-colors"
          >
            <span>VIEW</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

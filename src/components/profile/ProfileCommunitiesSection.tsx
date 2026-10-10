import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowUpRight, ArrowRight, ShieldCheck } from 'lucide-react';
import { clubService } from '../../services/clubService';
import type { Club } from '../../types/club';

interface ProfileCommunitiesSectionProps {
  communityIds: string[];
}

export const ProfileCommunitiesSection: React.FC<ProfileCommunitiesSectionProps> = ({
  communityIds,
}) => {
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    clubService.getClubs().then(({ data }) => {
      if (data) setClubs(data);
    });
  }, []);

  // Dynamically resolve existing clubs by ID from real Supabase clubs
  const affiliatedClubs = communityIds
    .map((id) => clubs.find((c) => c.id === id))
    .filter((c): c is Club => Boolean(c));

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-text-secondary">
            CAMPUS COMMUNITIES
          </h3>
        </div>

        <Link
          to="/clubs"
          className="text-xs font-mono text-electric-purple hover:text-white transition-colors inline-flex items-center gap-1 group"
        >
          <span>EXPLORE COMMUNITIES →</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {affiliatedClubs.map((club) => (
          <Link
            key={club.id}
            to={`/clubs/${club.id}`}
            className="group relative rounded-2xl bg-[#0C0E17]/80 border border-white/10 p-5 backdrop-blur-md hover:border-electric-purple/40 transition-all duration-300 shadow-lg flex flex-col justify-between overflow-hidden"
          >
            {/* Top row: Category & Icon */}
            <div className="flex items-start justify-between gap-3 pb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-text-secondary">
                {club.category}
              </span>
              <span className="text-text-muted group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>

            {/* Club Identity */}
            <div className="space-y-2 py-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-display font-bold text-base text-white group-hover:text-glow-purple transition-colors line-clamp-1">
                  {club.name}
                </h4>
                {club.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
              </div>

              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                {club.description}
              </p>
            </div>

            {/* Footer metrics */}
            <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-text-muted">
              <span>{club.memberCount.toLocaleString()} members</span>
              <span className="text-acid-lime">{club.upcomingEventCount} events</span>
            </div>
          </Link>
        ))}
      </div>

      {affiliatedClubs.length === 0 && (
        <div className="p-8 rounded-2xl bg-[#0C0E17]/60 border border-white/10 text-center space-y-3">
          <p className="text-sm text-text-secondary">
            You have not joined any campus communities yet.
          </p>
          <Link
            to="/clubs"
            className="inline-flex items-center gap-2 text-xs font-mono text-electric-purple hover:text-white"
          >
            <span>Browse All Student Societies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
};

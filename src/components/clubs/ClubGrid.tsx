import React from 'react';
import { ClubCard } from './ClubCard';
import { Users2 } from 'lucide-react';
import type { Club } from '../../types/club';

interface ClubGridProps {
  clubs: Club[];
  totalClubs: number;
}

export const ClubGrid: React.FC<ClubGridProps> = ({ clubs, totalClubs }) => {
  const isFiltered = clubs.length !== totalClubs;

  return (
    <section className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-primary/20 text-[#C4B5FD]">
            <Users2 className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#C4B5FD] font-bold">
            ALL COMMUNITIES
          </h2>
        </div>

        <span className="text-xs font-mono font-bold text-secondary">
          {isFiltered
            ? `${clubs.length} ${clubs.length === 1 ? 'COMMUNITY' : 'COMMUNITIES'} FOUND`
            : `${clubs.length} COMMUNITIES`}
        </span>
      </div>

      {/* Grid of Club Cards: 3 columns desktop, 3-4 large desktop, 2 columns tablet, 1 column mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-7">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </section>
  );
};

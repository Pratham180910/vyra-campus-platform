import React from 'react';
import { MOCK_STATS } from '../../data/events';

export const HeroStats: React.FC = () => {
  return (
    <div className="hero-stats w-full pt-8 pb-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 z-20">
      {/* Statistics List */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-6 sm:gap-10 lg:gap-14">
        {MOCK_STATS.map((stat, i) => (
          <div key={stat.label} className="stat-item flex flex-col group">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white group-hover:text-glow-purple transition-all duration-300">
                {stat.value}
              </span>
              {i === 3 && (
                <span className="text-secondary text-xs font-mono ml-1">UNLIMITED</span>
              )}
            </div>
            <span className="text-xs sm:text-sm font-medium text-text-secondary tracking-wide uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Right side: Scroll to explore mouse pill indicator matching reference image */}
      <a
        href="#campus-pulse"
        className="hidden md:flex items-center gap-3 text-xs tracking-widest uppercase font-mono text-text-muted hover:text-white transition-colors group cursor-pointer"
      >
        <span>SCROLL TO EXPLORE</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1 group-hover:border-secondary transition-colors">
          <div className="w-1 h-2 rounded-full bg-secondary animate-bounce" />
        </div>
      </a>
    </div>
  );
};

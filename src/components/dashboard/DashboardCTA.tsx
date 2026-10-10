import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Users2, Sparkles } from 'lucide-react';

export const DashboardCTA: React.FC = () => {
  return (
    <section className="relative w-full rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#1A1230] via-[#0E101A] to-[#08090D] border border-white/15 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl text-center space-y-6">
      {/* Background Lighting Glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-primary/25 blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-10 w-72 h-72 rounded-full bg-secondary/15 blur-[100px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/25 text-xs font-mono uppercase tracking-widest text-secondary shadow-glow-lime">
        <Sparkles className="w-3.5 h-3.5" />
        <span>CAMPUS DISCOVERY</span>
      </div>

      <div className="space-y-3 max-w-3xl mx-auto">
        <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
          YOUR NEXT
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C4B5FD] to-secondary">
            MOMENT IS OUT THERE.
          </span>
        </h2>
        <p className="text-sm sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
          Discover events, communities, and experiences happening across your campus.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/events"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-xs sm:text-sm font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Compass className="w-4 h-4 text-secondary" />
          <span>DISCOVER EVENTS</span>
          <ArrowRight className="w-4 h-4 text-secondary" />
        </Link>

        <Link
          to="/clubs"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-medium text-xs sm:text-sm font-mono uppercase tracking-wider text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          <Users2 className="w-4 h-4 text-primary" />
          <span>EXPLORE COMMUNITIES</span>
        </Link>
      </div>
    </section>
  );
};

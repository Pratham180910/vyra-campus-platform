import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Sparkles } from 'lucide-react';

export const ClubNotFound: React.FC = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20 relative">
      {/* Radiant ambient glow */}
      <div
        className="w-48 h-48 rounded-full bg-primary/20 blur-[100px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/25 text-xs font-mono uppercase tracking-widest text-secondary mb-6 shadow-glow-lime">
        <Sparkles className="w-3.5 h-3.5" />
        <span>404 DISCOVERY</span>
      </div>

      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-secondary shadow-glow-lime">
        <Compass className="w-8 h-8" />
      </div>

      <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
        COMMUNITY NOT FOUND
      </h1>

      <p className="mt-3 text-base sm:text-lg text-text-secondary max-w-md mx-auto leading-relaxed">
        This community doesn't exist or may have moved.
      </p>

      <div className="mt-8">
        <Link
          to="/clubs"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-xs sm:text-sm font-mono uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 hover:scale-105 active:scale-95 transition-all"
        >
          <span>EXPLORE COMMUNITIES</span>
          <ArrowRight className="w-4 h-4 text-secondary" />
        </Link>
      </div>
    </div>
  );
};

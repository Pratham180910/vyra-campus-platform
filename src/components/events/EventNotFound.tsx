import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const EventNotFound: React.FC = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      {/* Radiant ambient glow */}
      <div 
        className="w-48 h-48 rounded-full bg-primary/20 blur-[100px] pointer-events-none -z-10" 
        aria-hidden="true"
      />

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/25 text-xs font-mono uppercase tracking-widest text-secondary mb-6 shadow-glow-lime">
        <Sparkles className="w-3.5 h-3.5" />
        <span>404 DISCOVERY</span>
      </div>

      <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight">
        EVENT NOT FOUND
      </h1>

      <p className="mt-3 text-base sm:text-xl text-text-secondary max-w-md">
        This moment doesn't exist... yet.
      </p>

      <div className="mt-8">
        <Link
          to="/events"
          className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base text-white bg-primary hover:bg-primary-hover shadow-glow-purple border border-white/20 hover:scale-105 active:scale-95 transition-all"
        >
          <span>EXPLORE EVENTS</span>
          <ArrowRight className="w-4 h-4 text-secondary" />
        </Link>
      </div>
    </div>
  );
};

import React from 'react';
import { Calendar as CalendarIcon, Sparkles } from 'lucide-react';

export const CalendarHero: React.FC = () => {
  return (
    <section className="relative w-full rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#121422] via-[#0E101A] to-[#08090D] border border-white/10 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
      {/* Ambient Radial Backlights */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-electric-purple/20 blur-[110px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-acid-lime/10 blur-[100px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Futuristic Orbit Geometry */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="85%" cy="30%" r="180" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="85%" cy="30%" r="280" fill="none" stroke="rgba(196,255,61,0.15)" strokeWidth="1" strokeDasharray="6 8" />
      </svg>

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-electric-purple/15 border border-electric-purple/30 text-xs font-mono uppercase tracking-widest text-electric-purple shadow-[0_0_15px_rgba(139,92,246,0.25)]">
            <CalendarIcon className="w-3.5 h-3.5 text-acid-lime" />
            <span>CAMPUS CALENDAR</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
            EVERY MOMENT.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C4B5FD] to-acid-lime">
              ONE VIEW.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed font-normal max-w-xl">
            See what's happening across your campus and find your next moment.
          </p>
        </div>

        {/* Live Calendar Node Badge */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-text-muted">
          <span className="w-2 h-2 rounded-full bg-acid-lime animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-electric-purple" />
          <span className="text-white">SRMIST Live Schedule • Autumn 2026</span>
        </div>
      </div>
    </section>
  );
};

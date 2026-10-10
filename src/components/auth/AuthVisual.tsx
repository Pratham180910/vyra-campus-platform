import React from 'react';
import { Sparkles, Shield, Zap, Compass, Users } from 'lucide-react';

export const AuthVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[520px] lg:min-h-[640px] rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#121422] via-[#0D0F18] to-[#08090D] border border-white/10 p-8 sm:p-12 flex flex-col justify-between shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
      {/* 1. Atmospheric Ambient Lighting & Glows */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/25 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-secondary/15 blur-[90px] pointer-events-none"
        aria-hidden="true"
      />

      {/* 2. Abstract Geometric Orbital Lines & Grids */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="orbit-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C4FF3D" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Concentric orbital rings */}
        <circle cx="50%" cy="45%" r="160" fill="none" stroke="url(#orbit-grad)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="50%" cy="45%" r="240" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx="50%" cy="45%" r="320" fill="none" stroke="rgba(196,255,61,0.12)" strokeWidth="1" strokeDasharray="8 8" />
        {/* Coordinate crosshairs */}
        <line x1="50%" y1="10%" x2="50%" y2="80%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="15%" y1="45%" x2="85%" y2="45%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      </svg>

      {/* 3. Top Eyebrow & Brand Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-text-secondary font-semibold">
            CAMPUS ECOSYSTEM
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-text-muted">
          <span className="w-2 h-2 rounded-full bg-secondary shadow-glow-lime animate-pulse" />
          <span>SRM 2026 LIVE</span>
        </div>
      </div>

      {/* 4. Center Editorial Typography & Visual Focal */}
      <div className="relative z-10 my-auto py-8 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
            CURATED EXPERIENCES
          </p>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[0.98]">
            YOUR CAMPUS.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C4B5FD] to-secondary">
              YOUR MOMENTS.
            </span>
          </h2>
        </div>

        <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-md font-normal">
          The premier collegiate gateway to discover flagship hackathons, cultural spectacles, sports championships, and verified campus communities.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary-light shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-display font-bold text-xs text-white">Instant Passes</p>
              <p className="text-[10px] font-mono text-text-muted">Digital verification</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="font-display font-bold text-xs text-white">Verified Nodes</p>
              <p className="text-[10px] font-mono text-text-muted">Official councils</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Floating Atmospheric Card */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-primary/40 border border-[#08090D] flex items-center justify-center text-[10px] font-mono text-white">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div className="w-7 h-7 rounded-full bg-secondary/30 border border-[#08090D] flex items-center justify-center text-[10px] font-mono text-[#08090D]">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="font-mono text-[11px] text-text-muted">
            12+ Flagship Events Active
          </span>
        </div>

        <span className="text-[11px] font-mono text-secondary tracking-wider">
          VYRA • OS
        </span>
      </div>
    </div>
  );
};

import React from 'react';

interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#040507] p-2 sm:p-3 md:p-5 lg:p-6 flex flex-col items-center justify-center relative selection:bg-primary/30 selection:text-secondary">
      {/* Subtle atmospheric ambient glow in outer background */}
      <div 
        className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" 
        aria-hidden="true"
      />
      <div 
        className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[160px] pointer-events-none -z-10" 
        aria-hidden="true"
      />

      {/* Main VYRA Rounded Application Container */}
      <div className="w-full max-w-[1720px] bg-[#08090D] border border-white/10 rounded-[1.75rem] sm:rounded-[2.25rem] md:rounded-[2.75rem] lg:rounded-[3.25rem] shadow-[0_25px_90px_-20px_rgba(0,0,0,0.9),0_0_80px_-20px_rgba(139,92,246,0.18)] overflow-hidden relative flex flex-col min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2.5rem)] transition-all duration-300">
        
        {/* Subtle top edge specular highlight line */}
        <div 
          className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-30" 
          aria-hidden="true"
        />

        {children}
      </div>
    </div>
  );
};

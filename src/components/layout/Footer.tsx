import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Events', href: '/events' },
    { label: 'Clubs', href: '/clubs' },
    { label: 'Calendar', href: '/calendar' },
    { label: 'Organizer Studio', href: '/organizer' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: '#instagram-placeholder' },
    { name: 'LinkedIn', href: '#linkedin-placeholder' },
    { name: 'GitHub', href: '#github-placeholder' },
  ];

  return (
    <footer id="footer" className="w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-16 border-t border-white/10 relative z-20 bg-[#08090D]">
      <div className="max-w-7xl mx-auto flex flex-col justify-between gap-12">
        {/* Top Row: Brand & Back to Top */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary via-primary to-primary-dark p-[1px] shadow-glow-purple">
              <div className="w-full h-full bg-[#08090D] rounded-[11px] flex items-center justify-center">
                <span className="font-display font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                  V
                </span>
              </div>
            </div>
            <div>
              <span className="font-display font-black tracking-widest text-2xl text-white">
                VYRA
              </span>
              <p className="text-xs text-text-muted">
                Your campus. Your moments.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono uppercase text-text-secondary hover:text-white transition-colors border border-white/10 group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-1" />
          </button>
        </div>

        {/* Center Row: Navigation and Socials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-secondary font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Navigation
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-text-secondary hover:text-white hover:text-glow-purple transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-secondary font-semibold mb-4">
              Community
            </h4>
            <ul className="space-y-2.5">
              {socialLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-white transition-colors inline-block hover:underline"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-secondary font-semibold mb-4">
              Mission
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Empowering students to connect with collegiate communities, attend breakthrough festivals, and curate unforgettable moments. Built for SRM & beyond.
            </p>
          </div>
        </div>

        {/* Bottom Row: Legal / Credits */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-muted">
          <div>
            © {new Date().getFullYear()} VYRA. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-secondary">Obsidian × Electric Violet × Acid Lime</span>
            <span>•</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

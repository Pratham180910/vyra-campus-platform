import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CATEGORIES } from '../../data/categories';
import type { CategoryItem } from '../../types';
import { Cpu, Music, Terminal, Trophy, Flame, Zap, Users, Compass, Check, ArrowRight } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Music,
  Terminal,
  Trophy,
  Flame,
  Zap,
  Users,
};

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('hackathons');
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate(`/events?category=${categoryId.toLowerCase()}`);
  };

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="categories"
      ref={sectionRef}
      className="w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24 relative z-20 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-secondary mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>CATEGORIES</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            FIND YOUR THING.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-text-secondary">
            Explore dedicated zones tailored to your passion, curiosity, and campus ambition.
          </p>
        </div>

        {/* Categories Grid / Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {CATEGORIES.map((cat: CategoryItem) => {
            const Icon = iconMap[cat.iconName] || Compass;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`group text-left p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[160px] sm:min-h-[180px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? 'bg-[#151824] border-secondary/60 shadow-[0_0_35px_rgba(196,255,61,0.2)] scale-[1.02]'
                    : 'bg-[#10121A]/70 hover:bg-[#151824] border-white/10 hover:border-white/25 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Subtle Glow Accent in corner */}
                <div
                  className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
                  style={{ backgroundColor: cat.color }}
                  aria-hidden="true"
                />

                {/* Top: Icon & Count */}
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                      isSelected
                        ? 'bg-secondary text-[#08090D]'
                        : 'bg-white/5 text-white group-hover:text-secondary group-hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-text-muted">
                      {cat.count} events
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom: Name & Description */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-display text-lg sm:text-xl font-bold transition-colors ${
                        isSelected
                          ? 'text-white text-glow-lime'
                          : 'text-white group-hover:text-glow-purple'
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-2 group-hover:translate-x-0" />
                  </div>
                  <p className="mt-1 text-xs text-text-muted line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}

          {/* All Categories Teaser Card */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col justify-center items-center text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
              MORE COMING SOON
            </span>
            <p className="font-display font-bold text-white mt-1 text-sm sm:text-base">
              New Hubs Every Week
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

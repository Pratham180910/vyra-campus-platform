import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroContent } from './HeroContent';
import { HeroStats } from './HeroStats';
import { HeroScene } from './HeroScene';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const sceneWrapperRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Entrance GSAP Animation
  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Eyebrow
      tl.fromTo(
        '.hero-eyebrow',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.3
      );

      // 2. Heading Lines (Line-by-line reveal)
      tl.fromTo(
        '.hero-line',
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1.0, stagger: 0.12 },
        0.45
      );

      // 3. Supporting Copy
      tl.fromTo(
        '.hero-copy',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0.85
      );

      // 4. CTA Actions
      tl.fromTo(
        '.hero-actions',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.0
      );

      // 5. 3D Scene scale and fade-in
      tl.fromTo(
        sceneWrapperRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' },
        0.5
      );

      // 6. Stats bar reveal
      tl.fromTo(
        '.hero-stats',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        1.1
      );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // GSAP ScrollTrigger Pinning and Scrubbed Transition
  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || !pinTargetRef.current) return;

    const isMobile = window.innerWidth < 768;
    const pinDistance = isMobile ? '+=60%' : '+=120%';

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: pinDistance,
        pin: pinTargetRef.current,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });

      // Scrubbed timeline during pinned scroll
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: pinDistance,
          scrub: 1,
        },
      });

      // Typography moves up with subtle parallax fade
      scrubTl.to(
        contentWrapperRef.current,
        {
          y: -120,
          opacity: 0.25,
          ease: 'none',
        },
        0
      );

      // 3D Scene subtle push and scale
      scrubTl.to(
        sceneWrapperRef.current,
        {
          scale: 1.15,
          y: -30,
          ease: 'none',
        },
        0
      );

      return () => {
        st.kill();
        scrubTl.kill();
      };
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        ref={pinTargetRef}
        className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between px-4 sm:px-8 lg:px-12 pt-4 pb-6 overflow-hidden relative"
      >
        {/* Subtle Ambient Radial Gradients */}
        <div 
          className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px] pointer-events-none -z-10" 
          aria-hidden="true"
        />
        <div 
          className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-secondary/10 rounded-full blur-[160px] pointer-events-none -z-10" 
          aria-hidden="true"
        />

        {/* Hero Main Grid: Left Typography + Right 3D Scene */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center relative py-4 sm:py-6 lg:py-8">
          {/* Left Column: Editorial Display Typography & CTAs (5-6 cols) */}
          <div ref={contentWrapperRef} className="lg:col-span-6 z-20">
            <HeroContent />
          </div>

          {/* Right Column: 3D Futuristic Campus Ecosystem (6-7 cols) */}
          <div
            ref={sceneWrapperRef}
            className="lg:col-span-6 h-[380px] sm:h-[460px] md:h-[540px] lg:h-[620px] w-full relative z-10 flex items-center justify-center"
          >
            <HeroScene scrollProgress={scrollProgress} />
          </div>
        </div>

        {/* Bottom Hero Statistics */}
        <HeroStats />
      </div>
    </div>
  );
};

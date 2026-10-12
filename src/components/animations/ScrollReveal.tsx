import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionPreference } from './MotionPreferenceProvider';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: 'heading' | 'card' | 'stagger' | 'fade-up';
  delay?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion } = useMotionPreference();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion || typeof window === 'undefined') return;

    let ctx = gsap.context(() => {
      if (variant === 'heading') {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 26,
            filter: 'blur(3px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.85,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              end: 'bottom 15%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      } else if (variant === 'stagger') {
        const items = el.querySelectorAll(':scope > *');
        gsap.fromTo(
          items,
          {
            opacity: 0,
            y: 28,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'bottom 15%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      } else {
        // fade-up / card
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 28,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              end: 'bottom 15%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [variant, delay, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

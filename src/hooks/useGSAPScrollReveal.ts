import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionPreference } from '../components/animations/MotionPreferenceProvider';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hook to initialize GSAP ScrollTrigger reveals across the application
 * Automatically attaches to data-reveal attributes:
 * - data-reveal="fade-up": smooth fade and upward translation
 * - data-reveal="heading": section title reveal with gold highlight bloom
 * - data-reveal="stagger": child items with staggered entrance
 */
export function useGSAPScrollReveal() {
  const { prefersReducedMotion } = useMotionPreference();

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return;

    // Small delay to ensure all DOM elements are mounted and measured
    const timeoutId = setTimeout(() => {
      // 1. Headings Reveal
      const headings = document.querySelectorAll<HTMLElement>('[data-reveal="heading"]');
      headings.forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 28,
            filter: 'blur(4px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              end: 'bottom 15%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      // 2. Sections Fade-Up Reveal
      const fadeUps = document.querySelectorAll<HTMLElement>('[data-reveal="fade-up"]');
      fadeUps.forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 32,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'bottom 15%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      // 3. Staggered Cards Grids
      const staggerContainers = document.querySelectorAll<HTMLElement>('[data-reveal="stagger"]');
      staggerContainers.forEach((container) => {
        const children = container.querySelectorAll<HTMLElement>(':scope > *');
        if (children.length > 0) {
          gsap.fromTo(
            children,
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: container,
                start: 'top 82%',
                end: 'bottom 15%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      });

      ScrollTrigger.refresh();
    }, 120);

    return () => {
      clearTimeout(timeoutId);
      // Clean up all ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [prefersReducedMotion]);
}

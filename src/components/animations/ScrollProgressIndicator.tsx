import React, { useEffect, useRef } from 'react';

/**
 * Premium Scroll Progress Loading Bar
 * 
 * - Fixed at top, z-[100], pointer-events-none (zero click blocking)
 * - Hardware-accelerated GPU transform: scaleX (zero layout shifts, zero React re-renders)
 * - Metallic 24K gold gradient on deep obsidian black track
 * - Laser-glow leading edge with gold luminescence
 * - Bidirectional: smoothly expands on scroll down, decreases on scroll up
 */
export const ScrollProgressIndicator: React.FC = () => {
  const barRef = useRef<HTMLDivElement | null>(null);
  const glowHeadRef = useRef<HTMLDivElement | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    let currentScale = 0;
    let targetScale = 0;

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        targetScale = 0;
      } else {
        targetScale = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
      }
    };

    const loop = () => {
      // Smooth interpolation for silky visual feedback
      currentScale += (targetScale - currentScale) * 0.2;

      // When extremely close, snap to target
      if (Math.abs(targetScale - currentScale) < 0.0005) {
        currentScale = targetScale;
      }

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${currentScale})`;
      }

      if (glowHeadRef.current) {
        // Position the glowing laser head at current progress
        glowHeadRef.current.style.left = `${currentScale * 100}%`;
        glowHeadRef.current.style.opacity = currentScale > 0.005 ? '1' : '0';
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    const handleScroll = () => {
      updateProgress();
    };

    const handleResize = () => {
      updateProgress();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial measurement
    updateProgress();
    currentScale = targetScale;
    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-[#050505]/80 backdrop-blur-sm border-b border-white/[0.03]"
    >
      {/* 24K Metallic Gold Gradient Track */}
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-[#8C6D1F] via-[#D4AF37] via-[#FFF5CC] to-[#FFE08A] shadow-[0_0_12px_rgba(255,224,138,0.7)]"
        style={{
          transform: 'scaleX(0)',
          willChange: 'transform',
        }}
      />

      {/* Leading Edge Laser Glow Point */}
      <div
        ref={glowHeadRef}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#FFF5CC] shadow-[0_0_12px_3px_rgba(255,224,138,0.9),0_0_24px_6px_rgba(212,175,55,0.7)] transition-opacity duration-150 pointer-events-none"
        style={{
          left: '0%',
          opacity: 0,
          willChange: 'left, opacity',
        }}
      />
    </div>
  );
};

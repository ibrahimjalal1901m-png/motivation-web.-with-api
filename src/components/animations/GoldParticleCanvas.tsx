import React, { useRef, useEffect } from 'react';
import { useMotionPreference } from './MotionPreferenceProvider';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  glow: number;
}

interface GoldParticleCanvasProps {
  className?: string;
  particleDensity?: 'low' | 'normal' | 'dense';
}

export const GoldParticleCanvas: React.FC<GoldParticleCanvasProps> = ({
  className = '',
  particleDensity = 'normal',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { prefersReducedMotion, performanceTier } = useMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    const setupDimensions = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const getCount = () => {
      const isMobile = width < 768;
      let base = isMobile ? 24 : 55;
      if (particleDensity === 'low' || performanceTier === 'low') {
        base = Math.floor(base * 0.55);
      } else if (particleDensity === 'dense' && performanceTier === 'high') {
        base = Math.floor(base * 1.35);
      }
      return base;
    };

    const initParticles = () => {
      particles = [];
      const count = getCount();
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35 - 0.15, // slight upward drift
          radius: Math.random() * 1.8 + 0.6,
          baseAlpha: Math.random() * 0.45 + 0.2,
          alpha: Math.random() * 0.45 + 0.2,
          glow: Math.random() * 8 + 4,
        });
      }
    };

    setupDimensions();
    initParticles();

    const handleResize = () => {
      setupDimensions();
      initParticles();
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Main Draw & Update Loop
    const maxDistance = width < 768 ? 85 : 120;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle hairline gold threads
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries smoothly
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Draw particle
        ctx.save();
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = 'rgba(255, 224, 138, 0.8)';

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 224, 138, ${p.alpha})`;
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [particleDensity, performanceTier, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.85 }}
    />
  );
};

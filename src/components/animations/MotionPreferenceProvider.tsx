import React, { createContext, useContext, useState, useEffect } from 'react';

interface MotionContextType {
  prefersReducedMotion: boolean;
  performanceTier: 'high' | 'medium' | 'low';
}

const MotionContext = createContext<MotionContextType>({
  prefersReducedMotion: false,
  performanceTier: 'high',
});

export const MotionPreferenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [performanceTier, setPerformanceTier] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check system prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    // Assess device performance tier
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

    if (isMobile && (hardwareConcurrency < 4 || deviceMemory < 4)) {
      setPerformanceTier('low');
    } else if (isMobile || hardwareConcurrency < 6) {
      setPerformanceTier('medium');
    } else {
      setPerformanceTier('high');
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <MotionContext.Provider value={{ prefersReducedMotion, performanceTier }}>
      {children}
    </MotionContext.Provider>
  );
};

export const useMotionPreference = () => useContext(MotionContext);

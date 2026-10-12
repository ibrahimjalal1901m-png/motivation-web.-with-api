import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  const emblemSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-sm tracking-[0.2em]',
    md: 'text-base tracking-[0.24em]',
    lg: 'text-xl tracking-[0.28em]',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Geometric Gold Monogram Emblem */}
      <div className={`relative ${emblemSizes[size]} flex items-center justify-center flex-shrink-0 group`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)] transition-transform duration-300 group-hover:scale-105"
        >
          {/* Subtle Outer Diamond Shield Hairline */}
          <rect
            x="22"
            y="2"
            width="28"
            height="28"
            rx="2"
            transform="rotate(45 22 2)"
            stroke="url(#emblemBorderGrad)"
            strokeWidth="1.2"
            fill="#0E0E10"
          />
          {/* Internal Sharp Architectural 'A' Chevron */}
          <path
            d="M22 10L32 30H27.5L22 18.5L16.5 30H12L22 10Z"
            fill="url(#emblemGoldGrad)"
          />
          {/* Horizontal Golden Crossbar */}
          <path
            d="M17 25H27V26.8H17V25Z"
            fill="#F5D76E"
          />
          <defs>
            <linearGradient id="emblemGoldGrad" x1="12" y1="10" x2="32" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF0B3" />
              <stop offset="0.4" stopColor="#F5D76E" />
              <stop offset="1" stopColor="#D4AF37" />
            </linearGradient>
            <linearGradient id="emblemBorderGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5D76E" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#D4AF37" stopOpacity="0.4" />
              <stop offset="1" stopColor="#332B10" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className={`font-display font-bold uppercase text-white ${textSizes[size]} leading-none`}>
          ASPIRE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#AA820A]">WORK</span>
        </span>
        {showTagline && (
          <span className="text-[9px] uppercase tracking-[0.28em] text-zinc-400 mt-1 font-medium">
            Executive Discipline Protocol
          </span>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Logo } from './Logo';
import { SOCIAL_CONFIG } from '../config/social';
import { NavPage } from './Navbar';
import { Instagram, Youtube, Twitter, Radio, Shield, Globe } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal }) => {
  const currentYear = new Date().getFullYear();

  const getIcon = (id: string) => {
    switch (id) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'tiktok':
        return <Radio className="w-4 h-4" />;
      case 'x':
      default:
        return <Twitter className="w-4 h-4" />;
    }
  };

  const navLinks: { label: string; page: NavPage }[] = [
    { label: 'Home Overview', page: 'home' },
    { label: 'Motivation Vault', page: 'motivation' },
    { label: 'Daily Executive Quotes', page: 'daily-quotes' },
    { label: 'Habits & Protocol', page: 'discipline-habits' },
    { label: 'Stories & Gallery', page: 'stories-gallery' },
    { label: 'Curated Collection', page: 'saved-collection' },
    { label: 'About ASPIRE WORK', page: 'about' },
    { label: 'Contact Concierge', page: 'contact' },
  ];

  return (
    <footer className="w-full bg-[#050505] text-zinc-400 relative border-t border-white/[0.06]">
      {/* Gold Top Hairline Accent */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 flex flex-col gap-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand Manifesto Col (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Logo size="md" />
            <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
              Dream Bigger. Work Harder. Become Unstoppable.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              An elite ecosystem tailored for relentless discipline, executive stature, and high-performance craftsmanship. Built for champions who operate in silence.
            </p>

            {/* Social Icons Strip */}
            <div className="flex items-center gap-3 pt-2">
              {Object.values(SOCIAL_CONFIG).map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#111114] text-zinc-400 hover:text-[#FFE08A] hover:bg-[#1A1A1E] border border-white/5 transition-all cursor-pointer"
                  aria-label={item.platform}
                >
                  {getIcon(item.id)}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-white font-semibold">
              Platform Architecture
            </span>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onNavigate(link.page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs sm:text-sm text-zinc-400 hover:text-[#FFE08A] transition-colors text-left cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* The Daily Pledge (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-white font-semibold">
              The Daily Pledge
            </span>
            <div className="p-6 rounded-xl bg-[#111114] border border-[#D4AF37]/30 shadow-xl flex flex-col justify-between gap-4 gold-glow-card">
              <blockquote className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                “We do not rise to the level of our expectations; we fall to the level of our training. Mastery is forged in absolute silence.”
              </blockquote>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px] font-mono">
                <span className="uppercase tracking-widest text-[#FFE08A]">Executive Doctrine</span>
                <span className="text-zinc-500">05:00 AM Standard</span>
              </div>
            </div>

            {/* Quick Policies Link */}
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 pt-2">
              <button
                onClick={() => onOpenLegal('privacy')}
                className="hover:text-[#FFE08A] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => onOpenLegal('terms')}
                className="hover:text-[#FFE08A] transition-colors cursor-pointer"
              >
                Terms of Use
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300">
              System Operational • Global High Performance Node
            </span>
          </div>

          <p className="text-zinc-500 text-[11px] font-mono">
            © {currentYear} ASPIRE WORK. All rights reserved. Precision Built for Champions.
          </p>
        </div>
      </div>
    </footer>
  );
};

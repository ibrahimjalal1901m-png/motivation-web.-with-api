import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, Sparkles, Bookmark, Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../utils/audio';

export type NavPage =
  | 'home'
  | 'motivation'
  | 'daily-quotes'
  | 'discipline-habits'
  | 'stories-gallery'
  | 'saved-collection'
  | 'about'
  | 'contact';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, savedCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundFx.enabled = nextState;
    if (nextState) {
      soundFx.playSave();
    }
  };

  const navItems: { label: string; page: NavPage; badge?: number }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Motivation', page: 'motivation' },
    { label: 'Daily Quotes', page: 'daily-quotes' },
    { label: 'Discipline & Habits', page: 'discipline-habits' },
    { label: 'Stories & Gallery', page: 'stories-gallery' },
    { label: 'Saved Vault', page: 'saved-collection', badge: savedCount },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: NavPage) => {
    soundFx.playClick();
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050505]/92 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.8)] py-3'
          : 'bg-[#050505]/65 backdrop-blur-md border-b border-white/[0.03] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="focus:outline-none text-left cursor-pointer"
          aria-label="ASPIRE WORK Home"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`text-xs uppercase tracking-[0.14em] font-medium transition-all duration-200 relative py-1 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-[#FFE08A] font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#FFE08A] border border-[#D4AF37]/30">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFE08A] to-transparent" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Cluster */}
        <div className="flex items-center gap-3">
          {/* Sound Audio FX Feedback Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Audio Feedback Active' : 'Enable Subtle Executive Audio Feedback'}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#FFE08A]'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            aria-label="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Quick Bookmark View Trigger */}
          <button
            onClick={() => handleNavClick('saved-collection')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium text-zinc-300 hover:text-[#FFE08A] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition-all cursor-pointer"
            title="Open Saved Collection"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden md:inline">Vault</span>
            {savedCount > 0 && (
              <span className="text-[10px] font-mono font-bold text-[#FFE08A] px-1 bg-[#D4AF37]/20 rounded">
                {savedCount}
              </span>
            )}
          </button>

          {/* Gold "Get Inspired" CTA */}
          <button
            onClick={() => handleNavClick('daily-quotes')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold text-[#050505] bg-gradient-to-r from-[#FFE08A] to-[#D4AF37] hover:brightness-110 shadow-[0_4px_18px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_24px_rgba(212,175,55,0.4)] transition-all duration-300 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get Inspired</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 cursor-pointer"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A0A0C]/98 border-b border-white/[0.08] backdrop-blur-2xl px-6 py-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`flex items-center justify-between py-2 text-sm uppercase tracking-widest text-left font-medium transition-colors cursor-pointer ${
                    isActive ? 'text-[#FFE08A] font-semibold pl-2 border-l-2 border-[#D4AF37]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-xs font-mono text-[#FFE08A] px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
              <button
                onClick={() => handleNavClick('daily-quotes')}
                className="w-full py-3 rounded-lg text-center text-xs uppercase tracking-widest font-semibold text-[#050505] bg-gradient-to-r from-[#FFE08A] to-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.3)] cursor-pointer"
              >
                Get Inspired Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

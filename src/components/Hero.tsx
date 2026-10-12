import React from 'react';
import { ArrowRight, BookOpen, TrendingUp, Users, Award, ShieldAlert, ChevronDown } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { ThreeHeroScene } from './animations/ThreeHeroScene';
import { GoldParticleCanvas } from './animations/GoldParticleCanvas';

interface HeroProps {
  onStartJourney: () => void;
  onExploreMotivation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartJourney, onExploreMotivation }) => {
  return (
    <section className="relative min-h-[94vh] flex flex-col justify-between overflow-hidden bg-transparent pt-24 sm:pt-28">
      {/* Layer 1: Cinematic High-Resolution Dark Atmosphere Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkmUtu1WyTF5fhvvWqBqMMfygB-Aw7jgc2tZfu2Vu9NuSdIejeJJfQRR2LUfZgIq7XHb-8INOD6ETvEBZNLhRpT7NBMPE0NU0ZbxT5cccgA3m_CgEGD3W05jJB7Zo5jtV7LXYedGniapFr7MO3GDpsbSpIzkbRWvh639Js-BQvNAIW7e2GRrd-sxKrTWDP2V2heYvlgLHGUp-HTRhidvo66oRPy-T0KEInq4Bl8gsPl_pFyFu3rzNslQ"
          alt="Luxury architectural mountain vista at dusk"
          className="w-full h-full object-cover object-center brightness-[0.35] contrast-125 scale-105"
        />
        {/* Obsidian Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-[#050505]/60" />
      </div>

      {/* Layer 2: Interactive Three.js 3D Scene with Floating Gold Objects & Rings */}
      <ThreeHeroScene />

      {/* Layer 3: HTML5 Canvas Custom Gold Dust & Connecting Particle Web */}
      <GoldParticleCanvas particleDensity="normal" />

      {/* Layer 4: Foreground Hero Content & Typography (High z-index, pointer events enabled) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center py-10 md:py-16">
        <div className="max-w-4xl flex flex-col gap-6">
          {/* Executive Protocol Kicker */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111114]/90 border border-[#D4AF37]/35 backdrop-blur-md w-max shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FFE08A] animate-ping" />
            <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFE08A] font-semibold">
              Executive Protocol
            </span>
            <span className="text-zinc-600 text-xs">•</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
              Unconditional Execution
            </span>
          </div>

          {/* Main Headline with Gold Gradient Emphasis */}
          <h1 className="font-display font-extrabold uppercase text-white text-fluid-hero tracking-tight leading-[1.04]">
            YOUR{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CC] via-[#FFE08A] to-[#D4AF37] drop-shadow-[0_4px_30px_rgba(255,224,138,0.45)]">
              FUTURE
            </span>{' '}
            IS BUILT BY WHAT YOU DO{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE08A] via-[#D4AF37] to-[#AA820A]">
              TODAY
            </span>
            .
          </h1>

          {/* Supporting Headline with Key Word Accents */}
          <p className="text-zinc-300 text-base sm:text-lg lg:text-xl font-normal max-w-2xl leading-relaxed">
            <span className="text-white font-semibold">Discipline</span> over excuses.{' '}
            <span className="text-white font-semibold">Consistency</span> over comfort.{' '}
            <span className="text-white font-semibold">Progress</span> over perfection. Start building the life you deserve in uncompromising obsidian clarity.
          </p>

          {/* Interactive Call to Action Cluster */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={() => {
                soundFx.playClick();
                onStartJourney();
              }}
              className="px-8 py-4 rounded-lg font-display text-xs uppercase tracking-[0.16em] font-bold text-[#050505] bg-gradient-to-r from-[#FFE08A] to-[#D4AF37] hover:brightness-110 shadow-[0_4px_28px_rgba(212,175,55,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onExploreMotivation();
              }}
              className="px-7 py-4 rounded-lg font-display text-xs uppercase tracking-[0.16em] font-semibold text-white bg-[#111114]/90 hover:bg-[#1a1a1e] border border-white/10 hover:border-[#D4AF37]/50 backdrop-blur-md transition-all duration-300 flex items-center gap-2.5 text-zinc-300 hover:text-white cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#FFE08A]" />
              <span>Explore Motivation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-10 flex justify-center pb-4 text-zinc-500 hover:text-zinc-300 transition-colors">
        <a
          href="#motivation-pillars"
          aria-label="Scroll down to explore motivation"
          className="flex flex-col items-center gap-1 text-[10px] tracking-widest uppercase font-mono opacity-70 hover:opacity-100 transition-opacity"
        >
          <span>Scroll To Build</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#D4AF37]" />
        </a>
      </div>

      {/* Performance Metrics Strip */}
      <div className="relative z-10 w-full bg-[#0B0B0E]/95 border-t border-white/[0.08] backdrop-blur-xl py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#FFE08A]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                98.4%
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                Consistency Rate
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#FFE08A]">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                120K+
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                High Performers
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#FFE08A]">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                500+
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                Curated Principles
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#FFE08A]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                0.00
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                Zero Excuses Tolerated
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

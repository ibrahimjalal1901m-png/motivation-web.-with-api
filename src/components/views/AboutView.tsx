import React from 'react';
import { Logo } from '../Logo';
import { ArrowLeft, Shield, Award, Flame, Target, Compass } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface AboutViewProps {
  onBack: () => void;
  onExploreMotivation: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBack, onExploreMotivation }) => {
  const codes = [
    {
      num: '01',
      title: 'Unconditional Accountability',
      desc: 'Zero excuses tolerated. If an outcome in your sphere fails, you own 100% of the cause. You never blame weather, market cycles, or personnel.',
    },
    {
      num: '02',
      title: 'Sovereign Work Ethic',
      desc: 'You work long past the applause of onlookers. What you forge in obscurity will inevitably manifest in broad daylight.',
    },
    {
      num: '03',
      title: 'Ruthless Cognitive Elimination',
      desc: 'Distraction is the weapon of the mediocre. Say no to 99% of transient opportunities to defend the asymmetric 1%.',
    },
    {
      num: '04',
      title: 'Physical & Mental Hardening',
      desc: 'The mind mirrors the body. Voluntary physical hardship breeds unshakeable confidence in high-stakes boardrooms.',
    },
    {
      num: '05',
      title: 'Asymmetric Compounding',
      desc: 'Play long-term games with long-term people. Build enduring equity, intellectual capital, and unassailable reputation.',
    },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <button
            onClick={() => {
              soundFx.playClick();
              onBack();
            }}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-[#FFE08A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Overview</span>
          </button>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            Brand Manifesto • ASPIRE WORK
          </span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <Logo size="lg" showTagline />
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-white leading-tight">
            Dream Bigger. Work Harder.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CC] via-[#FFE08A] to-[#D4AF37]">
              Become Unstoppable.
            </span>
          </h1>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
            ASPIRE WORK was founded on a singular conviction: the modern world has drowned ambition in cheap comfort, algorithmic passivity, and perpetual distraction. We exist to restore the reverence for hard work, iron discipline, and relentless high performance.
          </p>
        </div>

        {/* Cinematic Image Banner */}
        <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 border border-[#D4AF37]/35 shadow-2xl">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWb3HlMkxDOY1zgWnga0vtJ0WBo3WKav9yrcdok7geYMj4GE2StKa6FPh1EQ71nv6-ZE4Ed_avXFngKG5PIYk0sguJWiGN3wovmEMmD9fX1tXcsz9JQJJKm5XMdyj3zEWJYwUHei5BI_4C1Iu1vjD8mTckVB7anzWuTfDJZVNuUUAezZGI9cN4vAlua7qk68AYnNqYJwO5EALwQmq24PHKwENDyjehtUZwrSoCpdENK_1jS-j-pvqY4Q"
            alt="Executive Boardroom Vision"
            className="w-full h-full object-cover filter brightness-[0.45] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FFE08A]">
              Our Sovereign Oath
            </span>
            <p className="font-display text-xl sm:text-2xl font-bold text-white mt-1 leading-snug">
              "We do not apologize for high expectations. We elevate ourselves until our standard becomes gravity."
            </p>
          </div>
        </div>

        {/* 5 Core Codes of Conduct */}
        <div className="flex flex-col gap-6 pt-6">
          <div className="text-center flex flex-col items-center gap-2 max-w-xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#D4AF37]">
              Foundational Pillars
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-white">
              The 5 Executive Codes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {codes.map((c) => (
              <div
                key={c.num}
                className="p-6 sm:p-7 rounded-xl bg-[#111114] border border-white/[0.08] hover:border-[#D4AF37]/50 flex flex-col justify-between gap-4 transition-all gold-glow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#FFE08A] px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30">
                    CODE {c.num}
                  </span>
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-lg font-bold text-white">
                    {c.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Final CTA Card */}
            <div className="p-6 sm:p-7 rounded-xl bg-gradient-to-br from-[#1A1504] to-[#111114] border border-[#D4AF37]/45 flex flex-col justify-between gap-4 gold-glow-card">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#FFE08A] px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40">
                  YOUR CALLING
                </span>
                <Flame className="w-4 h-4 text-[#FFE08A]" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-lg font-bold text-white">
                  Begin Your Transformation
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Join the thousands of executives, athletes, and founders forging an unshakeable identity.
                </p>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onExploreMotivation();
                }}
                className="w-full py-3 rounded-lg text-xs uppercase tracking-widest font-bold text-[#050505] bg-gradient-to-r from-[#FFE08A] to-[#D4AF37] hover:brightness-110 shadow-md transition-all text-center cursor-pointer"
              >
                Access Motivation Vault
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

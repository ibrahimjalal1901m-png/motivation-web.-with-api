import React from 'react';
import { SOCIAL_CONFIG } from '../config/social';
import { Instagram, Youtube, Twitter, Radio, ExternalLink } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const SocialSection: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-[#F5D76E]" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-[#F5D76E]" />;
      case 'tiktok':
        return <Radio className="w-5 h-5 text-[#F5D76E]" />;
      case 'x':
      default:
        return <Twitter className="w-5 h-5 text-[#F5D76E]" />;
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#050505]/80 backdrop-blur-md relative border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center flex flex-col items-center gap-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#D4AF37]">
            Synchronized Brotherhood
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-white tracking-tight">
            Join The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CC] via-[#FFE08A] to-[#D4AF37]">Aspire</span> Movement
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Daily motivation. Powerful mindsets. Consistent action. Follow the journey across our global high-performance media channels.
          </p>
        </div>

        {/* 4 Platform Cards */}
        <div data-reveal="stagger" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(SOCIAL_CONFIG).map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-xl bg-[#111114] border border-white/[0.08] hover:border-[#D4AF37]/50 flex flex-col justify-between gap-6 shadow-xl transition-all duration-300 transform hover:-translate-y-1 gold-glow-card"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center">
                  {getIcon(item.id)}
                </div>
                <span className="text-[10px] font-mono text-[#FFE08A] tracking-widest uppercase font-semibold">
                  {item.subscribersOrFollowers}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-display text-lg font-bold text-white">
                  {item.platform}
                </h3>
                <span className="text-xs font-mono text-[#FFE08A] font-medium">
                  {item.handle}
                </span>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playClick()}
                className="w-full py-2.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-[#D4AF37]/50 text-white hover:text-[#FFE08A] text-xs uppercase font-mono tracking-wider text-center flex items-center justify-center gap-2 transition-all group cursor-pointer"
              >
                <span>{item.ctaText}</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

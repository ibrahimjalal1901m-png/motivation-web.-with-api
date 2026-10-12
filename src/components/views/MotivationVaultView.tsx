import React, { useState } from 'react';
import { MOTIVATION_CATEGORIES, CategoryItem } from '../../data/categories';
import { ArrowLeft, Check, Target, Lightbulb, Search, BookOpen } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface MotivationVaultViewProps {
  onBack: () => void;
}

export const MotivationVaultView: React.FC<MotivationVaultViewProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<CategoryItem | null>(null);

  const filteredCategories = MOTIVATION_CATEGORIES.filter((cat) => {
    const q = searchQuery.toLowerCase();
    return (
      cat.title.toLowerCase().includes(q) ||
      cat.shortDescription.toLowerCase().includes(q) ||
      cat.keyTenets.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
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
            Executive Vault • 6 Pillars
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#D4AF37]">
              Intellectual Armory
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
              The Motivation Vault
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Explore the foundational doctrines and operational blueprints for extreme discipline, asymmetric wealth, and relentless mental supremacy.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search principles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#111114] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37] placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Pillars List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCategories.map((pillar) => (
            <div
              key={pillar.id}
              className="p-6 sm:p-8 rounded-2xl bg-[#111114] border border-white/[0.08] hover:border-[#D4AF37]/50 shadow-2xl flex flex-col justify-between gap-6 transition-all gold-glow-card"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#FFE08A] text-xs font-mono font-bold tracking-widest">
                    {pillar.pillarNumber}
                  </span>
                  <span className="text-xs font-mono uppercase text-zinc-500">
                    Mandatory Standard
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
                  {pillar.title}
                </h2>

                <p className="text-zinc-300 text-sm leading-relaxed">
                  {pillar.fullDoctrine}
                </p>

                {/* Key Tenets Box */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.05] flex flex-col gap-2.5 mt-2">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#FFE08A] flex items-center gap-1.5 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Immutable Tenets
                  </span>
                  <ul className="space-y-2">
                    {pillar.keyTenets.map((t, i) => (
                      <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Habit Footer */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Target className="w-4 h-4 text-[#FFE08A] flex-shrink-0" />
                  <span className="line-clamp-1">{pillar.actionHabit}</span>
                </div>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedPillar(pillar);
                  }}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-[#D4AF37] hover:text-[#080808] text-xs uppercase font-mono tracking-wider font-semibold text-zinc-300 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Inspect Pillar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Modal if clicked */}
        {selectedPillar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#121215] border border-[#D4AF37]/50 p-8 shadow-2xl flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-[#F5D76E] tracking-widest uppercase">
                    {selectedPillar.pillarNumber}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white">
                    {selectedPillar.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPillar(null)}
                  className="px-3 py-1.5 rounded bg-zinc-800 text-xs font-mono uppercase text-zinc-300 hover:text-white"
                >
                  Close
                </button>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {selectedPillar.fullDoctrine}
              </p>

              <div className="p-4 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex flex-col gap-2">
                <span className="text-xs font-mono font-bold uppercase text-[#F5D76E]">
                  Daily Execution Command:
                </span>
                <p className="text-xs text-zinc-200">
                  {selectedPillar.actionHabit}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

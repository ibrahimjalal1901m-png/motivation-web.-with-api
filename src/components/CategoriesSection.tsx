import React, { useState } from 'react';
import { MOTIVATION_CATEGORIES, CategoryItem } from '../data/categories';
import { ArrowRight, X, Check, Target, Lightbulb, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface CategoriesSectionProps {
  onCategorySelect?: (category: CategoryItem) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  const handleOpenCategory = (cat: CategoryItem) => {
    soundFx.playClick();
    setSelectedCategory(cat);
    if (onCategorySelect) {
      onCategorySelect(cat);
    }
  };

  const handleCloseModal = () => {
    soundFx.playClick();
    setSelectedCategory(null);
  };

  return (
    <section id="motivation-pillars" className="py-20 lg:py-28 bg-[#050505]/80 backdrop-blur-sm relative border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Section Header */}
        <div data-reveal="heading" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFE08A]" />
              <span className="text-xs uppercase font-mono tracking-[0.24em] text-[#D4AF37]">
                Structured Mastery
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-white tracking-tight">
              Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CC] via-[#FFE08A] to-[#D4AF37]">Pillars</span> of Greatness
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed">
            Six distinct disciplines forged to cultivate executive mental toughness, strategic dominance, and perpetual momentum.
          </p>
        </div>

        {/* 6-Card Bento Grid */}
        <div data-reveal="stagger" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOTIVATION_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleOpenCategory(cat)}
              className="group relative rounded-xl overflow-hidden bg-[#111114] border border-white/[0.08] hover:border-[#D4AF37]/60 shadow-2xl flex flex-col justify-end min-h-[390px] p-6 sm:p-7 cursor-pointer transform hover:-translate-y-1.5 active:scale-[0.99] transition-all duration-300 gold-glow-card"
            >
              {/* Card Image with cinematic gradient overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover filter brightness-[0.32] group-hover:brightness-[0.45] group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-[#0B0B0E]/75 to-transparent" />
              </div>

              {/* Card Content Overlay */}
              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFE08A] text-[10px] font-mono uppercase tracking-widest w-max backdrop-blur-md font-semibold">
                    {cat.pillarNumber}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 group-hover:text-[#FFE08A] transition-colors">
                    Explore Doctrine
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white group-hover:text-[#FFE08A] transition-colors leading-snug">
                  {cat.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed">
                  {cat.shortDescription}
                </p>

                <div className="pt-2 flex items-center justify-between text-[#D4AF37] text-xs font-semibold uppercase tracking-wider group-hover:text-[#FFE08A]">
                  <span>Access Doctrine</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category In-Depth Doctrine Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111114] border border-[#D4AF37]/50 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col gap-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono tracking-widest text-[#FFE08A]">
                  {selectedCategory.pillarNumber} • EXECUTIVE DOCTRINE
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {selectedCategory.title}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative h-48 rounded-xl overflow-hidden border border-white/10">
              <img
                src={selectedCategory.imageUrl}
                alt={selectedCategory.title}
                className="w-full h-full object-cover filter brightness-[0.5]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-sm italic text-zinc-200">
                  "{selectedCategory.shortDescription}"
                </p>
              </div>
            </div>

            {/* Full Doctrine */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#FFE08A] flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Core Philosophy
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {selectedCategory.fullDoctrine}
              </p>
            </div>

            {/* Key Tenets */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#FFE08A] flex items-center gap-2">
                <Check className="w-4 h-4" /> Uncompromising Tenets
              </h4>
              <ul className="space-y-2">
                {selectedCategory.keyTenets.map((tenet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
                    <span>{tenet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Daily Action Habit */}
            <div className="p-4 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/35 flex items-start gap-3">
              <Target className="w-5 h-5 text-[#FFE08A] mt-0.5 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFE08A]">
                  Actionable Executive Habit
                </span>
                <span className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {selectedCategory.actionHabit}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest font-semibold text-[#080808] bg-gradient-to-r from-[#FFE08A] to-[#D4AF37] hover:brightness-110 transition-all cursor-pointer"
              >
                Close & Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

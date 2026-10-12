import React, { useState } from 'react';
import { ORIGINAL_QUOTES, QuoteItem } from '../data/quotes';
import { RefreshCw, Bookmark, BookmarkCheck, Copy, Share2, Trash2, FolderHeart } from 'lucide-react';
import { useToast } from './Toast';
import { soundFx } from '../utils/audio';

interface DailyQuotesSectionProps {
  savedQuotes: QuoteItem[];
  onToggleSaveQuote: (quote: QuoteItem) => void;
  onClearSavedQuotes: () => void;
}

export const DailyQuotesSection: React.FC<DailyQuotesSectionProps> = ({
  savedQuotes,
  onToggleSaveQuote,
  onClearSavedQuotes,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const { showToast } = useToast();

  const activeQuote = ORIGINAL_QUOTES[currentIndex] || ORIGINAL_QUOTES[0];
  const isSaved = savedQuotes.some((q) => q.id === activeQuote.id);

  const categories = ['All', ...Array.from(new Set(ORIGINAL_QUOTES.map((q) => q.category)))];

  const handleNextQuote = () => {
    soundFx.playClick();
    let nextIndex = (currentIndex + 1) % ORIGINAL_QUOTES.length;
    if (filterCategory !== 'All') {
      const filtered = ORIGINAL_QUOTES.filter((q) => q.category === filterCategory);
      if (filtered.length > 0) {
        const currentFilteredIdx = filtered.findIndex((q) => q.id === activeQuote.id);
        const nextFiltered = filtered[(currentFilteredIdx + 1) % filtered.length];
        nextIndex = ORIGINAL_QUOTES.findIndex((q) => q.id === nextFiltered.id);
      }
    }
    setCurrentIndex(nextIndex);
  };

  const handleSaveToggle = () => {
    soundFx.playSave();
    onToggleSaveQuote(activeQuote);
    if (!isSaved) {
      showToast('Quote Secured to Vault', `Added to your private collection (${activeQuote.id})`, 'bookmark');
    } else {
      showToast('Removed from Vault', 'Quote unpinned from your collection', 'info');
    }
  };

  const handleCopyQuote = async () => {
    soundFx.playClick();
    const formatted = `"${activeQuote.quote}" — ${activeQuote.author} | ASPIRE WORK`;
    try {
      await navigator.clipboard.writeText(formatted);
      showToast('Copied to Clipboard', 'Directive copied to system clipboard', 'copy');
    } catch {
      showToast('Copy Failed', 'Please grant clipboard permissions', 'info');
    }
  };

  const handleShareQuote = async () => {
    soundFx.playClick();
    const text = `"${activeQuote.quote}" — ${activeQuote.author}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ASPIRE WORK Directive',
          text,
          url: window.location.href,
        });
        showToast('Shared Successfully', 'Broadcasted directive', 'share');
      } catch {
        // user aborted share
      }
    } else {
      // Fallback
      handleCopyQuote();
      showToast('Link & Directive Copied', 'Clipboard ready for broadcast', 'share');
    }
  };

  return (
    <section id="quotes-vault" className="py-20 lg:py-28 bg-[#0B0B0D]/80 backdrop-blur-md relative border-t border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* Header */}
        <div data-reveal="heading" className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#D4AF37]">
                Dynamic Executive Stream
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-white tracking-tight">
              Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CC] via-[#FFE08A] to-[#D4AF37]">Motivational</span> Engine
            </h2>
          </div>

          {/* Toggle Saved Collection Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              setDrawerOpen(!drawerOpen);
            }}
            className="px-4 py-2 rounded bg-zinc-900 border border-white/10 hover:border-[#D4AF37]/40 text-zinc-300 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <FolderHeart className="w-4 h-4 text-[#D4AF37]" />
            <span>Saved Collection ({savedQuotes.length})</span>
          </button>
        </div>

        {/* Category Filter Pills (Functional Filter Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setFilterCategory(cat);
                if (cat !== 'All') {
                  const firstOfCat = ORIGINAL_QUOTES.find((q) => q.category === cat);
                  if (firstOfCat) {
                    setCurrentIndex(ORIGINAL_QUOTES.indexOf(firstOfCat));
                  }
                }
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-[#D4AF37] text-[#080808] font-semibold shadow-[0_2px_12px_rgba(212,175,55,0.3)]'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Interactive Quote Showcase Card */}
        <div data-reveal="fade-up" className="relative rounded-2xl bg-[#111114] border border-[#D4AF37]/35 p-8 sm:p-12 lg:p-14 shadow-2xl overflow-hidden flex flex-col gap-8 gold-glow-card">
          {/* Ambient Gold Radial Background */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#D4AF37]/12 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#FFE08A]/8 blur-3xl pointer-events-none" />

          {/* Quote Meta Top Row */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#FFE08A] text-xs font-mono uppercase tracking-widest font-semibold">
              {activeQuote.category}
            </span>
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
              {activeQuote.id} • CURATED DIRECTIVE
            </span>
          </div>

          {/* Large Quote Content */}
          <div className="flex flex-col gap-5 relative z-10 my-2">
            <span className="text-[#D4AF37]/20 select-none font-display text-7xl sm:text-8xl leading-none -mb-10 font-black">
              “
            </span>
            <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-medium italic leading-relaxed tracking-tight min-h-[120px] flex items-center">
              {activeQuote.quote}
            </blockquote>

            <div className="flex flex-col pt-2">
              <span className="font-display text-lg sm:text-xl text-[#FFE08A] font-bold uppercase tracking-wider">
                {activeQuote.author}
              </span>
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 mt-0.5">
                {activeQuote.meta}
              </span>
            </div>
          </div>

          {/* Action Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.06] relative z-10">
            {/* Primary Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleNextQuote}
                className="px-5 py-2.5 rounded-lg font-display text-xs uppercase tracking-widest font-bold text-[#080808] bg-gradient-to-r from-[#FFE08A] to-[#D4AF37] hover:brightness-110 shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>New Quote</span>
              </button>

              <button
                onClick={handleSaveToggle}
                className={`px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFE08A]'
                    : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white hover:border-[#D4AF37]/40'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#FFE08A]" /> : <Bookmark className="w-4 h-4" />}
                <span>{isSaved ? 'Saved in Vault' : 'Save Quote'}</span>
              </button>

              <button
                onClick={handleCopyQuote}
                className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-[#D4AF37]/40 text-zinc-300 hover:text-white text-xs uppercase tracking-widest font-medium flex items-center gap-2 transition-all cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
            </div>

            {/* Share Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleShareQuote}
                className="px-4 py-2.5 rounded-lg bg-zinc-900/70 border border-white/10 hover:border-[#D4AF37]/40 text-zinc-400 hover:text-[#FFE08A] text-xs uppercase tracking-widest font-medium flex items-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Directive</span>
              </button>
            </div>
          </div>
        </div>

        {/* Saved Quotes Drawer */}
        {drawerOpen && (
          <div className="rounded-xl bg-[#111114] border border-[#D4AF37]/30 p-6 sm:p-8 flex flex-col gap-5 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <BookmarkCheck className="w-5 h-5 text-[#F5D76E]" />
                <h3 className="font-display text-xl font-bold uppercase text-white">
                  Your Curated Collection ({savedQuotes.length})
                </h3>
              </div>

              {savedQuotes.length > 0 && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onClearSavedQuotes();
                    showToast('Collection Cleared', 'All saved quotes removed from local storage', 'info');
                  }}
                  className="text-xs uppercase font-mono tracking-wider text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Collection</span>
                </button>
              )}
            </div>

            {savedQuotes.length === 0 ? (
              <p className="text-sm text-zinc-500 italic py-4">
                No directives stored in your vault yet. Click "Save Quote" on any directive to pin it to your browser's persistent storage.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                {savedQuotes.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg bg-[#18181C] border border-white/[0.06] flex flex-col justify-between gap-3 text-left hover:border-[#D4AF37]/40 transition-colors"
                  >
                    <p className="text-xs sm:text-sm text-zinc-200 italic leading-relaxed">
                      "{item.quote}"
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                      <span className="text-[10px] font-mono uppercase text-[#F5D76E]">
                        {item.author} • {item.category}
                      </span>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          onToggleSaveQuote(item);
                        }}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                        title="Remove quote"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

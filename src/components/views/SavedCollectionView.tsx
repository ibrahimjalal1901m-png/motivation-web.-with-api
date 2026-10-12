import React from 'react';
import { QuoteItem } from '../../data/quotes';
import { GALLERY_POSTS } from '../../data/gallery';
import { BookmarkCheck, Copy, Share2, Trash2, ArrowLeft, Download, FileText } from 'lucide-react';
import { useToast } from '../Toast';
import { soundFx } from '../../utils/audio';

interface SavedCollectionViewProps {
  savedQuotes: QuoteItem[];
  savedPostIds: string[];
  onToggleSaveQuote: (quote: QuoteItem) => void;
  onToggleSavePost: (postId: string) => void;
  onClearAll: () => void;
  onBack: () => void;
}

export const SavedCollectionView: React.FC<SavedCollectionViewProps> = ({
  savedQuotes,
  savedPostIds,
  onToggleSaveQuote,
  onToggleSavePost,
  onClearAll,
  onBack,
}) => {
  const { showToast } = useToast();

  const savedPosts = GALLERY_POSTS.filter((p) => savedPostIds.includes(p.id));

  const handleCopyQuote = async (item: QuoteItem) => {
    soundFx.playClick();
    const text = `"${item.quote}" — ${item.author} | ASPIRE WORK`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to Clipboard', item.quote.substring(0, 40) + '...', 'copy');
    } catch {
      showToast('Copy Failed', 'Please grant clipboard permissions', 'info');
    }
  };

  const handleExportText = () => {
    soundFx.playSave();
    if (savedQuotes.length === 0 && savedPosts.length === 0) {
      showToast('Collection Empty', 'No saved items to export', 'info');
      return;
    }

    let dossier = `==============================\nASPIRE WORK — CURATED EXECUTIVE DOSSIER\nExported: ${new Date().toLocaleDateString()}\n==============================\n\n`;

    if (savedQuotes.length > 0) {
      dossier += `--- SAVED EXECUTIVE DIRECTIVES (${savedQuotes.length}) ---\n\n`;
      savedQuotes.forEach((q, i) => {
        dossier += `${i + 1}. "${q.quote}"\n   — ${q.author} [${q.category}]\n\n`;
      });
    }

    if (savedPosts.length > 0) {
      dossier += `--- SAVED VISUAL CAPTIONS (${savedPosts.length}) ---\n\n`;
      savedPosts.forEach((p, i) => {
        dossier += `${i + 1}. ${p.title}: "${p.caption}"\n   Tags: ${p.hashtags.join(' ')}\n\n`;
      });
    }

    const blob = new Blob([dossier], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aspire-work-dossier-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Dossier Exported', 'Saved to your device as text file', 'success');
  };

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
          <div className="flex items-center gap-3">
            {(savedQuotes.length > 0 || savedPosts.length > 0) && (
              <>
                <button
                  onClick={handleExportText}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-white/10 hover:border-[#D4AF37] text-xs font-mono uppercase text-[#FFE08A] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Dossier</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onClearAll();
                    showToast('Vault Purged', 'All saved items removed', 'info');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-white/10 hover:border-rose-500 text-xs font-mono uppercase text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge All</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#D4AF37]">
            Private Dossier
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
            Curated Executive Vault
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Your private repository of saved directives, quotes, and visual captions. Stored safely inside your browser's persistent local storage.
          </p>
        </div>

        {/* Section 1: Saved Quotes */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-white flex items-center gap-2.5">
              <BookmarkCheck className="w-5 h-5 text-[#FFE08A]" />
              <span>Saved Directives ({savedQuotes.length})</span>
            </h2>
          </div>

          {savedQuotes.length === 0 ? (
            <div className="p-10 rounded-xl bg-[#111114] border border-white/5 text-center flex flex-col items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-zinc-600" />
              <p className="text-sm text-zinc-400">
                You haven't saved any motivational quotes yet.
              </p>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onBack();
                }}
                className="mt-2 text-xs font-mono uppercase tracking-widest text-[#FFE08A] hover:underline cursor-pointer"
              >
                Browse Daily Quotes Engine
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedQuotes.map((q) => (
                <div
                  key={q.id}
                  className="p-6 rounded-xl bg-[#111114] border border-white/[0.08] hover:border-[#D4AF37]/50 flex flex-col justify-between gap-5 transition-all shadow-lg gold-glow-card"
                >
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFE08A] font-semibold">
                      {q.category}
                    </span>
                    <blockquote className="text-sm sm:text-base text-white font-medium italic leading-relaxed">
                      "{q.quote}"
                    </blockquote>
                    <div className="flex flex-col pt-1">
                      <span className="text-xs font-bold uppercase text-[#D4AF37]">
                        {q.author}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {q.meta}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <button
                      onClick={() => handleCopyQuote(q)}
                      className="text-xs uppercase font-mono tracking-wider text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onToggleSaveQuote(q);
                        showToast('Removed from Vault', 'Directive unpinned', 'info');
                      }}
                      className="text-zinc-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Remove from vault"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Saved Visual Posts */}
        <div className="flex flex-col gap-6 pt-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-white flex items-center gap-2.5">
              <BookmarkCheck className="w-5 h-5 text-[#F5D76E]" />
              <span>Saved Visual Directives ({savedPosts.length})</span>
            </h2>
          </div>

          {savedPosts.length === 0 ? (
            <div className="p-10 rounded-xl bg-[#111114] border border-white/5 text-center flex flex-col items-center justify-center gap-3">
              <p className="text-sm text-zinc-400">
                No visual gallery cards saved yet. Tap the bookmark icon on any Instagram-style card.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl bg-[#121215] border border-white/[0.08] overflow-hidden flex flex-col shadow-lg"
                >
                  <div className="relative aspect-square">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover filter brightness-90"
                    />
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onToggleSavePost(post.id);
                        showToast('Card Removed', post.title, 'info');
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/80 text-rose-400 hover:text-rose-300"
                      title="Unsave post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 gap-2">
                    <p className="text-xs text-zinc-300 italic line-clamp-2">
                      "{post.caption}"
                    </p>
                    <span className="text-[10px] font-mono text-[#F5D76E] uppercase">
                      {post.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { GALLERY_POSTS, GalleryPost } from '../data/gallery';
import { Bookmark, BookmarkCheck, Copy, Share2, Heart, ExternalLink, Filter } from 'lucide-react';
import { useToast } from './Toast';
import { soundFx } from '../utils/audio';

interface GallerySectionProps {
  savedPostIds: string[];
  onToggleSavePost: (postId: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ savedPostIds, onToggleSavePost }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const { showToast } = useToast();

  const categories = ['All', 'Success and Ambition', 'Wealth and Financial Mindset', 'Discipline and Consistency', 'Confidence and Mental Strength'];

  const filteredPosts =
    selectedCategory === 'All'
      ? GALLERY_POSTS
      : GALLERY_POSTS.filter((p) => p.category === selectedCategory);

  const handleCopyCaption = async (post: GalleryPost) => {
    soundFx.playClick();
    const fullCaption = `${post.caption}\n\n${post.hashtags.join(' ')}`;
    try {
      await navigator.clipboard.writeText(fullCaption);
      showToast('Caption Copied', 'Instagram-ready caption & hashtags copied', 'copy');
    } catch {
      showToast('Copy Failed', 'Please grant clipboard permissions', 'info');
    }
  };

  const handleToggleLike = (postId: string) => {
    soundFx.playClick();
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleShare = async (post: GalleryPost) => {
    soundFx.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ASPIRE WORK - ${post.title}`,
          text: post.caption,
          url: window.location.href,
        });
        showToast('Shared Directive', 'Distributed to network', 'share');
      } catch {
        // user cancelled
      }
    } else {
      handleCopyCaption(post);
    }
  };

  return (
    <section id="stories-gallery" className="py-20 lg:py-28 bg-[#0B0B0E]/80 backdrop-blur-md relative border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Section Header */}
        <div data-reveal="heading" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#D4AF37]">
              Visual Directives
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-white tracking-tight">
              Cinematic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CC] via-[#FFE08A] to-[#D4AF37]">Gallery</span> & Captions
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed">
            Download, save, and distribute visual power for your mindset. Tap any visual to copy the executive caption.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mr-2 uppercase font-mono">
            <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Filter:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#D4AF37] text-[#080808] font-bold shadow-[0_2px_10px_rgba(212,175,55,0.3)]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4-Column Showcase Grid */}
        <div data-reveal="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map((post) => {
            const isSaved = savedPostIds.includes(post.id);
            const isLiked = !!likedPosts[post.id];

            return (
              <div
                key={post.id}
                className="group rounded-xl bg-[#111114] border border-white/[0.08] hover:border-[#D4AF37]/50 shadow-xl flex flex-col overflow-hidden transition-all duration-300 gold-glow-card"
              >
                {/* Image Container with Instagram Aspect Ratio */}
                <div className="relative aspect-square overflow-hidden bg-zinc-900">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    loading="lazy"
                    onError={(e) => {
                      // Fallback image
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent opacity-60" />

                  {/* Category Micro Badge */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37]/35 text-[#FFE08A] text-[10px] font-mono uppercase tracking-wider font-semibold">
                    {post.category}
                  </div>

                  {/* Bookmark Button (Quick Action) */}
                  <button
                    onClick={() => {
                      soundFx.playSave();
                      onToggleSavePost(post.id);
                      showToast(
                        isSaved ? 'Removed from Vault' : 'Saved to Visual Vault',
                        post.title,
                        isSaved ? 'info' : 'bookmark'
                      );
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white hover:text-[#FFE08A] transition-colors cursor-pointer"
                    title={isSaved ? 'Unsave Post' : 'Save Post'}
                    aria-label="Save Post"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-[#FFE08A]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Caption & Metadata Body */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <p className="text-xs sm:text-sm text-zinc-200 italic line-clamp-3 leading-relaxed">
                    "{post.caption}"
                  </p>

                  <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.05]">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      {/* Heart Like counter */}
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          isLiked ? 'text-rose-500' : 'hover:text-white'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                        />
                        <span className="font-mono text-[11px]">{post.likes}</span>
                      </button>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyCaption(post)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-[#F5D76E] transition-colors"
                          title="Copy Instagram Caption"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleShare(post)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-[#F5D76E] transition-colors"
                          title="Share Directive"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        {post.postUrl && (
                          <a
                            href={post.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            title="Open Brand Social Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

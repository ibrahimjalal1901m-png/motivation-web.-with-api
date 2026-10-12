/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavPage } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { Interactive3DObject } from './components/animations/Interactive3DObject';
import { DailyQuotesSection } from './components/DailyQuotesSection';
import { DisciplineSection } from './components/DisciplineSection';
import { GallerySection } from './components/GallerySection';
import { SocialSection } from './components/SocialSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ToastProvider } from './components/Toast';
import { MotionPreferenceProvider } from './components/animations/MotionPreferenceProvider';
import { ScrollProgressIndicator } from './components/animations/ScrollProgressIndicator';
import { ScrollBubbleUniverse3D } from './components/animations/ScrollBubbleUniverse3D';
import { CustomCursor } from './components/animations/CustomCursor';
import { AspireChatbot } from './components/chat/AspireChatbot';
import { LegalModal } from './components/views/LegalModal';
import { MotivationVaultView } from './components/views/MotivationVaultView';
import { SavedCollectionView } from './components/views/SavedCollectionView';
import { AboutView } from './components/views/AboutView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGSAPScrollReveal } from './hooks/useGSAPScrollReveal';
import { QuoteItem, ORIGINAL_QUOTES } from './data/quotes';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Initialize GSAP ScrollTrigger section reveals
  useGSAPScrollReveal();

  // Persistent Saved Quotes in LocalStorage
  const [savedQuotes, setSavedQuotes] = useLocalStorage<QuoteItem[]>(
    'aspire_saved_quotes_v2',
    [ORIGINAL_QUOTES[0]] // Sensible default: include the first flagship quote
  );

  // Persistent Saved Gallery Post IDs in LocalStorage
  const [savedPostIds, setSavedPostIds] = useLocalStorage<string[]>(
    'aspire_saved_gallery_v2',
    ['gal-01'] // Sensible default
  );

  // Synchronize with URL hash & pathname on mount, hashchange, & popstate
  useEffect(() => {
    const syncRoute = () => {
      const hash = window.location.hash.replace('#', '');
      const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
      const target = hash || path;
      const validPages: Record<string, NavPage> = {
        home: 'home',
        motivation: 'motivation',
        'daily-quotes': 'daily-quotes',
        quotes: 'daily-quotes',
        'discipline-habits': 'discipline-habits',
        discipline: 'discipline-habits',
        'stories-gallery': 'stories-gallery',
        gallery: 'stories-gallery',
        'saved-collection': 'saved-collection',
        saved: 'saved-collection',
        about: 'about',
        contact: 'contact',
      };
      if (validPages[target]) {
        setCurrentPage(validPages[target]);
      }
    };

    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const handleNavigate = (page: NavPage) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaveQuote = (quote: QuoteItem) => {
    setSavedQuotes((prev) => {
      const exists = prev.some((q) => q.id === quote.id);
      if (exists) {
        return prev.filter((q) => q.id !== quote.id);
      } else {
        return [quote, ...prev];
      }
    });
  };

  const handleToggleSavePost = (postId: string) => {
    setSavedPostIds((prev) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId);
      } else {
        return [postId, ...prev];
      }
    });
  };

  const handleClearSavedQuotes = () => {
    setSavedQuotes([]);
  };

  const handleClearAllVault = () => {
    setSavedQuotes([]);
    setSavedPostIds([]);
  };

  return (
    <MotionPreferenceProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#050505] relative">
          {/* Scroll-Reactive 3D Bubble Universe Background */}
          <ScrollBubbleUniverse3D />

          {/* Top Edge Golden Scroll Progress Indicator */}
          <ScrollProgressIndicator />

          {/* Interactive Desktop Custom Cursor */}
          <CustomCursor />

          {/* Sticky Luxury Navigation Bar */}
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            savedCount={savedQuotes.length + savedPostIds.length}
          />

          {/* Page Content View Router */}
          <main className="flex-1 w-full">
            {currentPage === 'home' && (
              <>
                {/* Flagship Hero Section with Three.js 3D & Canvas Dust */}
                <Hero
                  onStartJourney={() => {
                    const elem = document.getElementById('daily-discipline');
                    if (elem) {
                      elem.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      handleNavigate('discipline-habits');
                    }
                  }}
                  onExploreMotivation={() => {
                    const elem = document.getElementById('motivation-pillars');
                    if (elem) {
                      elem.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      handleNavigate('motivation');
                    }
                  }}
                />

                {/* Curated Motivation Categories Grid */}
                <CategoriesSection />

                {/* Interactive 3D Motivation Experience: BUILD YOUR FUTURE */}
                <Interactive3DObject />

                {/* Interactive Daily Motivational Engine */}
                <DailyQuotesSection
                  savedQuotes={savedQuotes}
                  onToggleSaveQuote={handleToggleSaveQuote}
                  onClearSavedQuotes={handleClearSavedQuotes}
                />

                {/* Success Is Earned & Daily Discipline Protocol */}
                <DisciplineSection />

                {/* Instagram-Inspired Motivational Gallery */}
                <GallerySection
                  savedPostIds={savedPostIds}
                  onToggleSavePost={handleToggleSavePost}
                />

                {/* The Aspire Movement Social Media Hub */}
                <SocialSection />

                {/* Executive Collaboration & Contact Concierge */}
                <ContactSection />
              </>
            )}

            {currentPage === 'motivation' && (
              <MotivationVaultView onBack={() => handleNavigate('home')} />
            )}

            {currentPage === 'daily-quotes' && (
              <div className="pt-10">
                <DailyQuotesSection
                  savedQuotes={savedQuotes}
                  onToggleSaveQuote={handleToggleSaveQuote}
                  onClearSavedQuotes={handleClearSavedQuotes}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <button
                    onClick={() => handleNavigate('home')}
                    className="px-6 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-xs uppercase font-mono tracking-wider text-zinc-300 hover:text-[#FFE08A] cursor-pointer"
                  >
                    ← Return to Home Overview
                  </button>
                </div>
              </div>
            )}

            {currentPage === 'discipline-habits' && (
              <div className="pt-10">
                <DisciplineSection />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <button
                    onClick={() => handleNavigate('home')}
                    className="px-6 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-xs uppercase font-mono tracking-wider text-zinc-300 hover:text-[#FFE08A] cursor-pointer"
                  >
                    ← Return to Home Overview
                  </button>
                </div>
              </div>
            )}

            {currentPage === 'stories-gallery' && (
              <div className="pt-10">
                <GallerySection
                  savedPostIds={savedPostIds}
                  onToggleSavePost={handleToggleSavePost}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <button
                    onClick={() => handleNavigate('home')}
                    className="px-6 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-xs uppercase font-mono tracking-wider text-zinc-300 hover:text-[#FFE08A] cursor-pointer"
                  >
                    ← Return to Home Overview
                  </button>
                </div>
              </div>
            )}

            {currentPage === 'saved-collection' && (
              <SavedCollectionView
                savedQuotes={savedQuotes}
                savedPostIds={savedPostIds}
                onToggleSaveQuote={handleToggleSaveQuote}
                onToggleSavePost={handleToggleSavePost}
                onClearAll={handleClearAllVault}
                onBack={() => handleNavigate('home')}
              />
            )}

            {currentPage === 'about' && (
              <AboutView
                onBack={() => handleNavigate('home')}
                onExploreMotivation={() => handleNavigate('motivation')}
              />
            )}

            {currentPage === 'contact' && (
              <div className="pt-10">
                <ContactSection />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <button
                    onClick={() => handleNavigate('home')}
                    className="px-6 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-xs uppercase font-mono tracking-wider text-zinc-300 hover:text-[#FFE08A] cursor-pointer"
                  >
                    ← Return to Home Overview
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Global Executive Footer */}
          <Footer
            onNavigate={handleNavigate}
            onOpenLegal={(type) => setLegalModalType(type)}
          />

          {/* Luxury Floating Aspire AI Chatbot */}
          <AspireChatbot />

          {/* Legal Modal (Privacy Policy & Terms of Use) */}
          <LegalModal
            type={legalModalType}
            onClose={() => setLegalModalType(null)}
          />
        </div>
      </ToastProvider>
    </MotionPreferenceProvider>
  );
}

/**
 * ASPIRE WORK - Centralized Social Media Configuration
 * 
 * Replace placeholders with official brand account URLs when ready.
 * All external links are opened securely with noopener and noreferrer.
 */

export interface SocialLink {
  id: string;
  platform: string;
  handle: string;
  url: string;
  subscribersOrFollowers: string;
  description: string;
  ctaText: string;
}

export const SOCIAL_CONFIG: Record<string, SocialLink> = {
  instagram: {
    id: 'instagram',
    platform: 'Instagram',
    handle: '@ASPIRE_WORK',
    url: 'https://www.instagram.com/YOUR_USERNAME/',
    subscribersOrFollowers: '750K FOLLOWERS',
    description: 'Daily visual directives, high-performance reels, and executive mindset briefings.',
    ctaText: 'Follow Intel',
  },
  tiktok: {
    id: 'tiktok',
    platform: 'TikTok',
    handle: '@AspireDiscipline',
    url: 'https://www.tiktok.com/@YOUR_USERNAME',
    subscribersOrFollowers: '1.2M OPERATORS',
    description: 'Raw, unfiltered execution protocols and short-form mental conditioning.',
    ctaText: 'Join Live Feed',
  },
  youtube: {
    id: 'youtube',
    platform: 'YouTube',
    handle: 'ASPIRE EXECUTION',
    url: 'https://www.youtube.com/@YOUR_CHANNEL',
    subscribersOrFollowers: '420K SUBSCRIBERS',
    description: 'Long-form deep work documentaries, high-performance routines, and philosophies.',
    ctaText: 'Subscribe Daily',
  },
  x: {
    id: 'x',
    platform: 'X (formerly Twitter)',
    handle: '@AspireDoctrine',
    url: 'https://x.com/YOUR_USERNAME',
    subscribersOrFollowers: '280K THINKERS',
    description: 'High-signal aphorisms, strategy threads, and daily executive dispatches.',
    ctaText: 'Follow Dispatch',
  },
};

export const BRAND_CONFIG = {
  name: 'ASPIRE WORK',
  tagline: 'Dream Bigger. Work Harder. Become Unstoppable.',
  email: 'director@aspirework.vip',
  location: 'Zurich • New York • Singapore',
  foundedYear: 2024,
  version: '2025.1 Executive Suite',
};

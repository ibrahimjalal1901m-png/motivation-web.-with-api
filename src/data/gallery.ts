export interface GalleryPost {
  id: string;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  likes: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  postUrl?: string;
  hashtags: string[];
}

export const GALLERY_POSTS: GalleryPost[] = [
  {
    id: 'gal-01',
    title: 'Mountain Peak Solitude',
    caption: 'The solitude of the top is what filtered out the millions who preferred company over conquest.',
    category: 'Success and Ambition',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkmUtu1WyTF5fhvvWqBqMMfygB-Aw7jgc2tZfu2Vu9NuSdIejeJJfQRR2LUfZgIq7XHb-8INOD6ETvEBZNLhRpT7NBMPE0NU0ZbxT5cccgA3m_CgEGD3W05jJB7Zo5jtV7LXYedGniapFr7MO3GDpsbSpIzkbRWvh639Js-BQvNAIW7e2GRrd-sxKrTWDP2V2heYvlgLHGUp-HTRhidvo66oRPy-T0KEInq4Bl8gsPl_pFyFu3rzNslQ',
    likes: '14.8k',
    aspectRatio: 'square',
    postUrl: 'https://www.instagram.com/YOUR_USERNAME/',
    hashtags: ['#AspireWork', '#Discipline', '#PeakPerformance', '#Ambition']
  },
  {
    id: 'gal-02',
    title: 'High Altitude Executive Order',
    caption: 'Build the boardroom inside your mind first. Capital flows where order already reigns supreme.',
    category: 'Wealth and Financial Mindset',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWb3HlMkxDOY1zgWnga0vtJ0WBo3WKav9yrcdok7geYMj4GE2StKa6FPh1EQ71nv6-ZE4Ed_avXFngKG5PIYk0sguJWiGN3wovmEMmD9fX1tXcsz9JQJJKm5XMdyj3zEWJYwUHei5BI_4C1Iu1vjD8mTckVB7anzWuTfDJZVNuUUAezZGI9cN4vAlua7qk68AYnNqYJwO5EALwQmq24PHKwENDyjehtUZwrSoCpdENK_1jS-j-pvqY4Q',
    likes: '22.4k',
    aspectRatio: 'square',
    postUrl: 'https://www.instagram.com/YOUR_USERNAME/',
    hashtags: ['#AspireWork', '#ExecutiveMindset', '#WealthCreation', '#Sovereignty']
  },
  {
    id: 'gal-03',
    title: 'Pain Barrier Breakthrough',
    caption: 'Your lungs will burn, your mind will negotiate. Take another step. That is where legends separate.',
    category: 'Discipline and Consistency',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNCXX773wQQC5uBB5WMZVSeAb1TznzFuNMOwxzF4lR9S4rbhAiVmi13EczNwVfWB6tofQP7ReIHM2rm50PNBj4naCKxPjvzhgKJizRu5gFpLmvBt9P7cmV0pLQc-QGLOVdCJnDxBI9D0iNTRU2aSEWXBfO7BKBHVwl0tl4lzfQDfk5sJ3h-7-7_lwpic8nsoZPMtuERZpEAtu4UPqE_x0WVgeL6pabxwaHNP5p4T_Lyx0ysXVyYzsnqg',
    likes: '31.9k',
    aspectRatio: 'square',
    postUrl: 'https://www.instagram.com/YOUR_USERNAME/',
    hashtags: ['#AspireWork', '#Relentless', '#Endurance', '#NoExcuses']
  },
  {
    id: 'gal-04',
    title: 'Master Stroke Calculation',
    caption: 'Never reveal your next maneuver until the opponent has already lost the board in silence.',
    category: 'Confidence and Mental Strength',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNvOIj6iMXeGhpUOG_3kd4pTWfAYuuoxWz0HVrIIanT1m74NrBDmO3UvDOp8aNYMTEy8_EwCF7QmR_yBg0ykghK5kVwf0KYtxBhDV8Y6FXR9y1Qf_Z8hoS-c02LklJ_gh18vCOfYTvbx-cQn4aIUwR-tXJqG5sYGfEBG2jJ-71pp3aJkFJxw4o7wShXwzX2dGhitWlJHS0HpBPgw_bIIZeHCJnA45Iy5k3LvQlKX77csaxkgeLLZENVA',
    likes: '19.3k',
    aspectRatio: 'square',
    postUrl: 'https://www.instagram.com/YOUR_USERNAME/',
    hashtags: ['#AspireWork', '#Grandmaster', '#Strategy', '#Discipline']
  },
  {
    id: 'gal-05',
    title: 'Architect of Destiny',
    caption: 'Do not seek a lighter burden; develop broader shoulders. Hard work is your natural habitat.',
    category: 'Discipline and Consistency',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    likes: '27.1k',
    aspectRatio: 'square',
    postUrl: 'https://www.instagram.com/YOUR_USERNAME/',
    hashtags: ['#AspireWork', '#Architecture', '#Excellence', '#Strength']
  },
  {
    id: 'gal-06',
    title: 'Deep Solitude Focus',
    caption: 'The greatest inventions and financial empires were forged when everyone else was asleep.',
    category: 'Focus and Productivity',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    likes: '18.6k',
    aspectRatio: 'square',
    postUrl: 'https://www.instagram.com/YOUR_USERNAME/',
    hashtags: ['#AspireWork', '#DeepWork', '#Focus', '#Productivity']
  }
];

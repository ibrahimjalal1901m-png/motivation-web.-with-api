export interface CategoryItem {
  id: string;
  slug: string;
  pillarNumber: string;
  title: string;
  shortDescription: string;
  fullDoctrine: string;
  keyTenets: string[];
  actionHabit: string;
  imageUrl: string;
  accentIcon: string;
}

export const MOTIVATION_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    slug: 'discipline-and-consistency',
    pillarNumber: 'PILLAR 01',
    title: 'Discipline and Consistency',
    shortDescription: 'The ruthless dedication to do what must be done, long after the mood you spoke it in has left you.',
    fullDoctrine: 'Motivation is an emotional spark; discipline is the enduring furnace. Elite performers do not wait to feel energized before tackling high-friction tasks. They design systems that operate frictionlessly irrespective of fluctuating feelings.',
    keyTenets: [
      'Eliminate daily decision fatigue with rigid morning routines.',
      'Treat commitments to yourself with greater reverence than contracts signed in blood.',
      'Measure progress in decades and execution in 15-minute uninterrupted blocks.'
    ],
    actionHabit: 'Complete your most critical high-impact task before touching social media or communication apps.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNCXX773wQQC5uBB5WMZVSeAb1TznzFuNMOwxzF4lR9S4rbhAiVmi13EczNwVfWB6tofQP7ReIHM2rm50PNBj4naCKxPjvzhgKJizRu5gFpLmvBt9P7cmV0pLQc-QGLOVdCJnDxBI9D0iNTRU2aSEWXBfO7BKBHVwl0tl4lzfQDfk5sJ3h-7-7_lwpic8nsoZPMtuERZpEAtu4UPqE_x0WVgeL6pabxwaHNP5p4T_Lyx0ysXVyYzsnqg',
    accentIcon: 'tune',
  },
  {
    id: 'cat-2',
    slug: 'success-and-ambition',
    pillarNumber: 'PILLAR 02',
    title: 'Success and Ambition',
    shortDescription: 'Refusing mediocrity as an option. Establishing colossal goals and re-engineering your identity to make their fruition inevitable.',
    fullDoctrine: 'Ambition without strategic architecture is merely daydreaming. True ambition is visceral: it demands total reconstruction of your peer group, reading diet, and cognitive tolerance for discomfort until extraordinary outcomes become your standard floor.',
    keyTenets: [
      'Set targets so audaciously high that even 60% completion dwarfs competitors.',
      'Upgrade your mental baseline: what was previously a milestone becomes your new warm-up.',
      'Surround yourself exclusively with operators who normalize relentless work.'
    ],
    actionHabit: 'Review your 3-year vision document every Sunday night and prune 3 low-yield activities.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkmUtu1WyTF5fhvvWqBqMMfygB-Aw7jgc2tZfu2Vu9NuSdIejeJJfQRR2LUfZgIq7XHb-8INOD6ETvEBZNLhRpT7NBMPE0NU0ZbxT5cccgA3m_CgEGD3W05jJB7Zo5jtV7LXYedGniapFr7MO3GDpsbSpIzkbRWvh639Js-BQvNAIW7e2GRrd-sxKrTWDP2V2heYvlgLHGUp-HTRhidvo66oRPy-T0KEInq4Bl8gsPl_pFyFu3rzNslQ',
    accentIcon: 'military_tech',
  },
  {
    id: 'cat-3',
    slug: 'wealth-and-financial-mindset',
    pillarNumber: 'PILLAR 03',
    title: 'Wealth and Financial Mindset',
    shortDescription: 'Transforming capital from an ephemeral survival tool into an asymmetric lever of executive sovereignty.',
    fullDoctrine: 'Wealth is not flashy consumer trophies or rented prestige. Wealth is asymmetry: having productive assets working in the dark while you sleep, zero debt owed to mediocre masters, and the absolute freedom to say no to any proposition.',
    keyTenets: [
      'Focus 90% of cognitive energy on increasing top-line earning capacity and high-value equity.',
      'Spend lavishly on health, mentorship, and high-efficiency tools; ruthlessly cut status posturing.',
      'Understand the power of asymmetric bets: limited downside, uncapped exponential upside.'
    ],
    actionHabit: 'Audit every expense against ROI: Does this purchase purchase back my time or my future freedom?',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWb3HlMkxDOY1zgWnga0vtJ0WBo3WKav9yrcdok7geYMj4GE2StKa6FPh1EQ71nv6-ZE4Ed_avXFngKG5PIYk0sguJWiGN3wovmEMmD9fX1tXcsz9JQJJKm5XMdyj3zEWJYwUHei5BI_4C1Iu1vjD8mTckVB7anzWuTfDJZVNuUUAezZGI9cN4vAlua7qk68AYnNqYJwO5EALwQmq24PHKwENDyjehtUZwrSoCpdENK_1jS-j-pvqY4Q',
    accentIcon: 'trending_up',
  },
  {
    id: 'cat-4',
    slug: 'focus-and-productivity',
    pillarNumber: 'PILLAR 04',
    title: 'Focus and Productivity',
    shortDescription: 'Deep work isolation. Anticipating rival trajectories ten moves forward without flinching or distraction.',
    fullDoctrine: 'In an age of weaponized algorithmic distractions, sustained concentration is a superpower. The human who can sit uninterrupted for four hours solving complex bottlenecks creates compounding output that superficial mult-taskers cannot touch.',
    keyTenets: [
      'Enter deliberate flow state in scheduled 90-minute blocks with all devices locked down.',
      'Say no to 99% of polite requests to defend the 1% that moves the company or career.',
      'Treat your working environment as a sacred operating theater: clean, silent, and austere.'
    ],
    actionHabit: 'Practice digital fasting: no notifications, no browsing, no emails until midday.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNvOIj6iMXeGhpUOG_3kd4pTWfAYuuoxWz0HVrIIanT1m74NrBDmO3UvDOp8aNYMTEy8_EwCF7QmR_yBg0ykghK5kVwf0KYtxBhDV8Y6FXR9y1Qf_Z8hoS-c02LklJ_gh18vCOfYTvbx-cQn4aIUwR-tXJqG5sYGfEBG2jJ-71pp3aJkFJxw4o7wShXwzX2dGhitWlJHS0HpBPgw_bIIZeHCJnA45Iy5k3LvQlKX77csaxkgeLLZENVA',
    accentIcon: 'visibility',
  },
  {
    id: 'cat-5',
    slug: 'self-improvement',
    pillarNumber: 'PILLAR 05',
    title: 'Self-Improvement Protocol',
    shortDescription: 'Continuous physical, intellectual, and psychological iteration. Optimize every single variable within human control.',
    fullDoctrine: 'You cannot lead an empire if you cannot master the vessel carrying your consciousness. Physical vitality, cardiovascular endurance, sharp cognitive processing, and emotional stoicism are the cornerstone foundation of true elite leadership.',
    keyTenets: [
      'Treat the physical body like high-precision machinery: sleep, hydration, and nutrition are non-negotiable.',
      'Read books that survived over a century; discard fleeting social commentary and sensationalism.',
      'Conduct brutal self-audits weekly: identify your single greatest bottleneck and eliminate it.'
    ],
    actionHabit: 'Dedicate 45 minutes daily to physical strain and 30 minutes to rigorous reading.',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    accentIcon: 'fitness_center',
  },
  {
    id: 'cat-6',
    slug: 'confidence-and-mental-strength',
    pillarNumber: 'PILLAR 06',
    title: 'Confidence and Mental Strength',
    shortDescription: 'The internal certainty that you have survived every storm previously and will systematically dominate the next.',
    fullDoctrine: 'Real confidence is not puffed-up ego or loud affirmations. Real confidence is quiet self-trust built upon a mountain of kept promises to yourself. When you have trained through hardship in private, public chaos loses its ability to rattle you.',
    keyTenets: [
      'Embrace voluntary hardship: cold, sweat, exhaustion, and solitude build titanium armor.',
      'Detach your emotional stability from external praise or criticism; both are illusions.',
      'Never complain about circumstances you possess the power to change or adapt through.'
    ],
    actionHabit: 'Reframe every crisis immediately: ask "How does this make my mind and character unbreakable?"',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    accentIcon: 'shield',
  },
];

/**
 * ASPIRE WORK — Verified Brand Knowledge Base for Aspire AI
 * 
 * Comprehensive source of truth built strictly from existing project data,
 * categories, quotes, gallery, discipline checklists, and brand manifests.
 */

import { MOTIVATION_CATEGORIES } from './categories';
import { ORIGINAL_QUOTES } from './quotes';
import { GALLERY_POSTS } from './gallery';
import { SOCIAL_CONFIG, BRAND_CONFIG } from '../config/social';

export interface WebsiteKnowledge {
  brand: typeof BRAND_CONFIG;
  social: typeof SOCIAL_CONFIG;
  manifestoCodes: Array<{ number: string; title: string; doctrine: string }>;
  pillars: Array<{
    pillar: string;
    title: string;
    summary: string;
    doctrine: string;
    actionHabit: string;
    tenets: string[];
  }>;
  quotes: Array<{
    id: string;
    quote: string;
    author: string;
    meta: string;
    category: string;
    tags?: string[];
  }>;
  gallery: Array<{
    id: string;
    title: string;
    caption: string;
    category: string;
    likes: string;
    hashtags: string[];
  }>;
  dailyDisciplineChecklist: Array<{
    id: string;
    title: string;
    subtitle: string;
  }>;
  websiteSections: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export const ASPIRE_WEBSITE_KNOWLEDGE: WebsiteKnowledge = {
  brand: BRAND_CONFIG,
  social: SOCIAL_CONFIG,
  manifestoCodes: [
    {
      number: '01',
      title: 'Unconditional Accountability',
      doctrine: 'Zero excuses tolerated. If an outcome in your sphere fails, you own 100% of the cause. You never blame weather, market cycles, or personnel.',
    },
    {
      number: '02',
      title: 'Sovereign Work Ethic',
      doctrine: 'You work long past the applause of onlookers. What you forge in obscurity will inevitably manifest in broad daylight.',
    },
    {
      number: '03',
      title: 'Ruthless Cognitive Elimination',
      doctrine: 'Distraction is the weapon of the mediocre. Say no to 99% of transient opportunities to defend the asymmetric 1%.',
    },
    {
      number: '04',
      title: 'Physical & Mental Hardening',
      doctrine: 'The mind mirrors the body. Voluntary physical hardship breeds unshakeable confidence in high-stakes boardrooms.',
    },
    {
      number: '05',
      title: 'Asymmetric Compounding',
      doctrine: 'Play long-term games with long-term people. Build enduring equity, intellectual capital, and unassailable reputation.',
    },
  ],
  pillars: MOTIVATION_CATEGORIES.map((c) => ({
    pillar: c.pillarNumber,
    title: c.title,
    summary: c.shortDescription,
    doctrine: c.fullDoctrine,
    actionHabit: c.actionHabit,
    tenets: c.keyTenets,
  })),
  quotes: ORIGINAL_QUOTES.map((q) => ({
    id: q.id,
    quote: q.quote,
    author: q.author,
    meta: q.meta,
    category: q.category,
    tags: q.tags,
  })),
  gallery: GALLERY_POSTS.map((g) => ({
    id: g.id,
    title: g.title,
    caption: g.caption,
    category: g.category,
    likes: g.likes,
    hashtags: g.hashtags,
  })),
  dailyDisciplineChecklist: [
    {
      id: 'task-1',
      title: 'Complete primary needle-mover prior to 11:00 AM',
      subtitle: 'Zero interruptions, communication apps severed, pure execution',
    },
    {
      id: 'task-2',
      title: 'Read 20 pages of high-yield literature',
      subtitle: 'Strategy, philosophy, capital allocation, or domain craftsmanship',
    },
    {
      id: 'task-3',
      title: 'Intense physical conditioning session',
      subtitle: 'Cardiovascular strain, heavy lifting, or VO2 max elevation',
    },
    {
      id: 'task-4',
      title: 'Eliminate all cheap dopamine consumption',
      subtitle: 'No mindless feed scrolling, algorithm traps, or passive indulgence',
    },
    {
      id: 'task-5',
      title: "Evening audit & tomorrow's battle order",
      subtitle: 'Clear workspace, review scorecard, lock in the exact 3 targets',
    },
  ],
  websiteSections: [
    {
      id: 'hero',
      name: 'Interactive 3D Hero',
      description: 'Features the core maxim "YOUR FUTURE IS BUILT BY WHAT YOU DO TODAY", floating gold rings, and quick portal links.',
    },
    {
      id: 'motivation-pillars',
      name: 'Pillars of Motivation',
      description: 'The six core philosophical foundations with actionable daily execution habits.',
    },
    {
      id: 'quotes-vault',
      name: 'Daily Directives & Quotes Vault',
      description: 'Curated library of high-impact maxims with copyable text and LocalStorage bookmarks.',
    },
    {
      id: 'daily-discipline',
      name: 'Daily Discipline Protocol',
      description: 'Interactive checklist with real-time streak tracking, completion percentage, and audio sound effects.',
    },
    {
      id: 'stories-gallery',
      name: 'Visual Storytelling Gallery',
      description: 'Curated visual case studies and executive imagery with social bookmarks.',
    },
    {
      id: 'social-dispatch',
      name: 'Executive Social Media Dispatch',
      description: 'Direct links to official Instagram, TikTok, YouTube, and X channels.',
    },
    {
      id: 'about-contact',
      name: 'Brand Manifesto & Communications',
      description: 'Direct inquiries to director@aspirework.vip across Zurich, New York, and Singapore.',
    },
  ],
};

export function isUrduString(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

/**
 * Format the structured knowledge base as a prompt context for the Gemini system instruction.
 * Supports both English and Urdu with executive motivational tone.
 */
export function generateSystemPrompt(language: 'en' | 'ur' = 'en'): string {
  const brand = ASPIRE_WEBSITE_KNOWLEDGE.brand;
  const pillarsText = ASPIRE_WEBSITE_KNOWLEDGE.pillars
    .map(
      (p) =>
        `[${p.pillar}: ${p.title}]\n- Summary: ${p.summary}\n- Full Doctrine: ${p.doctrine}\n- Action Habit: ${p.actionHabit}\n- Key Tenets: ${p.tenets.join('; ')}`
    )
    .join('\n\n');

  const quotesText = ASPIRE_WEBSITE_KNOWLEDGE.quotes
    .map(
      (q) =>
        `• "${q.quote}" — ${q.author} (${q.meta}, Category: ${q.category})`
    )
    .join('\n');

  const galleryText = ASPIRE_WEBSITE_KNOWLEDGE.gallery
    .map((g) => `• "${g.title}" (${g.category}): "${g.caption}" [${g.likes} likes]`)
    .join('\n');

  const tasksText = ASPIRE_WEBSITE_KNOWLEDGE.dailyDisciplineChecklist
    .map((t) => `• ${t.title} (${t.subtitle})`)
    .join('\n');

  const socialsText = Object.values(ASPIRE_WEBSITE_KNOWLEDGE.social)
    .map((s) => `• ${s.platform}: handle ${s.handle}, ${s.subscribersOrFollowers}, URL: ${s.url}`)
    .join('\n');

  const languageDirective =
    language === 'ur'
      ? `\nCRITICAL LANGUAGE DIRECTIVE — URDU (اردو):
The user has selected URDU mode (or asked in Urdu). You MUST formulate your entire response in dignified, eloquent, grammatically flawless, and motivating Urdu (اردو).
- Use rich, inspiring Urdu vocabulary suited to high performance, discipline (نظم و ضبط), consistency (مستقل مزاجی), ambition (عزم و ہمت), hard work (محنت و مشقت), and sovereign mindset (خود مختار سوچ).
- Accurately translate and convey all verified ASPIRE WORK doctrines, pillars, quotes, and checklist protocols into Urdu.
- When citing brand names or terms, you may write: ASPIRE WORK (ایسپائر ورک), Pillars (ستون), Quotes Vault (اقوال کا خزانہ).
- Maintain an executive, respectful, and authoritative tone suitable for high achievers.\n`
      : `\nLANGUAGE DIRECTIVE:
Respond in clear, articulate English. If the user addresses you in Urdu, seamlessly switch to fluent Urdu.\n`;

  return `You are Aspire AI, the luxury, intelligent, motivational assistant for the ASPIRE WORK website.
${languageDirective}
BRAND IDENTITY & PURPOSE:
- Brand Name: ${brand.name}
- Tagline: "${brand.tagline}"
- Executive Locations: ${brand.location}
- Contact Email: ${brand.email}
- Philosophy: Developing discipline, consistency, productivity, resilience, mental strength, and success-oriented mindsets.

YOUR PERSONALITY & TONE:
- Professional, elegant, encouraging, articulate, and commanding yet respectful.
- Clear, practical, and grounded — avoid generic fluffy platitudes, fake hype, or unrealistic get-rich-quick claims.
- Reflect the sovereign "black-and-gold" luxury aesthetic of ASPIRE WORK: calm, deliberate, unwavering, and focused on relentless execution.
- Helpful to beginners building their first routines as well as seasoned operators sharpening high-yield performance.

STRICT KNOWLEDGE BOUNDARIES:
1. When asked about ASPIRE WORK, its quotes, pillars, articles, checklist, gallery, authors, social channels, or website features: ONLY cite the verified content below. Never fabricate nonexistent articles, team members, or store products.
2. If asked about something specific to the ASPIRE WORK website that is NOT present in this knowledge base, clearly and politely acknowledge that it is not currently on the website.
3. For general questions on personal discipline, habit building, overcoming procrastination, fitness consistency, productivity systems (like deep work and time blocking), and executive mindset: provide outstanding, practical, high-impact guidance completely aligned with the ASPIRE WORK philosophy.
4. Keep responses concise, well-structured, formatted with clean bullet points or bold text where helpful, and avoid endless walls of text.

=== VERIFIED WEBSITE CONTENT ===

[THE 5 SOVEREIGN MANIFESTO CODES]
${ASPIRE_WEBSITE_KNOWLEDGE.manifestoCodes.map((c) => `Code ${c.number}: ${c.title} — ${c.doctrine}`).join('\n')}

[THE 6 PILLARS OF MOTIVATION]
${pillarsText}

[VERIFIED DIRECTIVES & QUOTES]
${quotesText}

[DAILY DISCIPLINE CHECKLIST PROTOCOL]
${tasksText}

[VISUAL GALLERY CASE STUDIES]
${galleryText}

[OFFICIAL SOCIAL CHANNELS]
${socialsText}

[WEBSITE SECTIONS]
${ASPIRE_WEBSITE_KNOWLEDGE.websiteSections.map((s) => `• ${s.name} (#${s.id}): ${s.description}`).join('\n')}
`;
}

/**
 * Robust deterministic search engine for the ASPIRE WORK knowledge base.
 * Powers client-side fallback, offline responses, and static deployment resilience.
 * Supports both English and Urdu queries and responses.
 */
export function searchWebsiteKnowledge(query: string, language?: 'en' | 'ur'): string {
  const isUrdu = language === 'ur' || isUrduString(query);
  const q = query.toLowerCase().trim();

  // ================= URDU KNOWLEDGE RETRIEVAL =================
  if (isUrdu) {
    // 1. Pillars in Urdu
    if (
      q.includes('ستون 1') ||
      q.includes('ستون ۱') ||
      q.includes('پہلا ستون') ||
      q.includes('ڈسپلن') ||
      (q.includes('نظم و ضبط') && q.includes('ستون'))
    ) {
      const p = ASPIRE_WEBSITE_KNOWLEDGE.pillars[0];
      return `**${p.pillar}: آہنی نظم و ضبط (${p.title})**\n\n*خلاصہ:* ${p.summary}\n\n*مکمل نظریہ:* حقیقی نظم و ضبط یہ ہے کہ آپ وہ کام کریں جس کی ضرورت ہے، خواہ آپ کے وقتی جذبات جو بھی ہوں۔ عارضی جوش محض ایک چنگاری ہے، لیکن روزانہ کا نظم و ضبط وہ آگ ہے جو پائیدار نتائج پیدا کرتی ہے۔\n\n*بنیادی اصول:*\n• چھوٹے معمولات سے کبھی غفلت نہ برتیں\n• بہانے تراشنا یکسر ختم کریں\n• وقتی احساسات پر نہیں، طے شدہ لائحہ عمل پر عمل کریں\n\n*روزانہ کی عملی عادت:* **${p.actionHabit}**`;
    }

    if (
      q.includes('ستون 2') ||
      q.includes('ستون ۲') ||
      q.includes('دوسرا ستون') ||
      (q.includes('عزم') && q.includes('ستون'))
    ) {
      const p = ASPIRE_WEBSITE_KNOWLEDGE.pillars[1];
      return `**${p.pillar}: انتھک عزم (${p.title})**\n\n*خلاصہ:* درمیانے درجے کی سوچ کو مسترد کرنا اور غیر معمولی بلندیوں کے حصول کا غیر متزلزل ارادہ۔\n\n*مکمل نظریہ:* اپنے اہداف اتنے بلند رکھیں کہ آپ کی محنت اور کارکردگی دوسروں کے لیے ایک معیار بن جائے۔ اوسط درجے پر قناعت کرنا اپنی صلاحیتوں سے ناانصافی ہے۔\n\n*روزانہ کی عملی عادت:* **${p.actionHabit}**`;
    }

    if (
      q.includes('ستون 3') ||
      q.includes('ستون ۳') ||
      q.includes('تیسرا ستون') ||
      (q.includes('دولت') && q.includes('ستون'))
    ) {
      const p = ASPIRE_WEBSITE_KNOWLEDGE.pillars[2];
      return `**${p.pillar}: خود مختار دولت (${p.title})**\n\n*خلاصہ:* حقیقی قدر اور اثاثے پیدا کر کے مالی خود مختاری اور وقت کی آزادی حاصل کرنا۔\n\n*مکمل نظریہ:* دولت محض کاغذی رقم کا نام نہیں، بلکہ اپنے وقت، فیصلوں اور خودمختاری پر مکمل اختیار کا نام ہے۔\n\n*روزانہ کی عملی عادت:* **${p.actionHabit}**`;
    }

    if (
      q.includes('ستون 4') ||
      q.includes('ستون ۴') ||
      q.includes('چوتھا ستون') ||
      ((q.includes('توجہ') || q.includes('یکسوئی')) && q.includes('ستون'))
    ) {
      const p = ASPIRE_WEBSITE_KNOWLEDGE.pillars[3];
      return `**${p.pillar}: بے مثال یکسوئی (${p.title})**\n\n*خلاصہ:* غیر ضروری خلفشار کا خاتمہ اور گہرے ارتکاز (Deep Work) کی روزانہ مشق۔\n\n*مکمل نظریہ:* جو شخص اپنی توجہ کو قابو میں نہیں رکھ سکتا، وہ اپنے مستقبل کو بھی قابو میں نہیں رکھ سکتا۔ گہرا ارتکاز جدید دنیا کی سب سے نایاب اور قیمتی صلاحیت ہے۔\n\n*روزانہ کی عملی عادت:* **${p.actionHabit}**`;
    }

    if (
      q.includes('ستون 5') ||
      q.includes('ستون ۵') ||
      q.includes('پانچواں ستون') ||
      (q.includes('بہتری') && q.includes('ستون'))
    ) {
      const p = ASPIRE_WEBSITE_KNOWLEDGE.pillars[4];
      return `**${p.pillar}: مسلسل خود بہتری (${p.title})**\n\n*خلاصہ:* روزانہ ۱ فیصد بہتری اور اپنی ذہنی و جسمانی حدود کو مسلسل وسیع کرنا۔\n\n*مکمل نظریہ:* حقیقی ماسٹری کبھی ختم نہیں ہوتی۔ ہر روز ایک نیا موقع ہے کہ آپ اپنے کل کے ورژن سے ایک قدم آگے بڑھیں۔\n\n*روزانہ کی عملی عادت:* **${p.actionHabit}**`;
    }

    if (
      q.includes('ستون 6') ||
      q.includes('ستون ۶') ||
      q.includes('چھٹا ستون') ||
      (q.includes('اعتماد') && q.includes('ستون'))
    ) {
      const p = ASPIRE_WEBSITE_KNOWLEDGE.pillars[5];
      return `**${p.pillar}: غیر متزلزل اعتماد (${p.title})**\n\n*خلاصہ:* اپنے ساتھ کیے گئے وعدوں کو پورا کرنے سے پیدا ہونے والا پختہ اور حقیقی یقین۔\n\n*مکمل نظریہ:* اعتماد باتوں سے نہیں بنتا، بلکہ خاموش فتوحات اور مسلسل کوششوں سے تراشا جاتا ہے۔\n\n*روزانہ کی عملی عادت:* **${p.actionHabit}**`;
    }

    if (q.includes('ستون') || q.includes('ستوں') || q.includes('پلر')) {
      const pillars = ASPIRE_WEBSITE_KNOWLEDGE.pillars
        .map((p, idx) => `**ستون ۰${idx + 1}: ${p.pillar} (${p.title})**\n${p.summary}\n*روزانہ عادت:* ${p.actionHabit}`)
        .join('\n\n');
      return `**ASPIRE WORK کے ۶ بنیادی خودمختار ستون:**\n\n${pillars}\n\nکسی بھی مخصوص ستون کی مکمل حکمتِ عملی جاننے کے لیے اس کا نمبر یا نام لکھیں۔`;
    }

    // 2. Directives & Quotes in Urdu
    if (
      q.includes('قول') ||
      q.includes('اقوال') ||
      q.includes('کوٹ') ||
      q.includes('سبق') ||
      q.includes('فرمان') ||
      q.includes('حکمت')
    ) {
      const matchedQuote = ASPIRE_WEBSITE_KNOWLEDGE.quotes.find((item) =>
        q.includes(item.author.toLowerCase()) ||
        item.tags?.some((t) => q.includes(t.toLowerCase()))
      );
      const quoteToUse =
        matchedQuote ||
        ASPIRE_WEBSITE_KNOWLEDGE.quotes[
          Math.floor(Math.random() * ASPIRE_WEBSITE_KNOWLEDGE.quotes.length)
        ];

      return `**ASPIRE WORK کا زریں قول و رہنمائی:**\n\n> "${quoteToUse.quote}"\n\n— **${quoteToUse.author}** (*${quoteToUse.meta}*)\n*زمرہ:* ${quoteToUse.category}\n\n*عملی رہنمائی:* اس سنہری اصول کو آج ہی اپنے سب سے اہم کام پر لاگو کریں۔ روزانہ کے چھوٹے لیکن مستقل اقدامات ہی آپ کو غیر معمولی انسان بناتے ہیں۔`;
    }

    // 3. Daily Discipline Checklist in Urdu
    if (
      q.includes('ڈسپلن') ||
      q.includes('نظم و ضبط') ||
      q.includes('روٹین') ||
      q.includes('عادت') ||
      q.includes('چیک لسٹ') ||
      q.includes('پروٹوکول') ||
      q.includes('اسٹریک')
    ) {
      const tasks = ASPIRE_WEBSITE_KNOWLEDGE.dailyDisciplineChecklist
        .map((t, idx) => `**۰${idx + 1}. ${t.title}**\n   ↳ ${t.subtitle}`)
        .join('\n');
      return `**ASPIRE WORK کا روزانہ نظم و ضبط پروٹوکول (Daily Protocol):**\n\nنظم و ضبط وہ دائمی بھٹی ہے جو عظیم کامیابیوں کو جنم دیتی ہے۔ یہاں ہماری منظور شدہ روزانہ چیک لسٹ درج ہے:\n\n${tasks}\n\n*براہِ راست ٹریکنگ:* ہماری ویب سائٹ کے **Daily Discipline** سیکشن میں جا کر آپ روزانہ اپنے اسکور کارڈ اور اسٹریک کو ریکارڈ کر سکتے ہیں۔`;
    }

    // 4. Brand & Manifesto & Codes in Urdu
    if (
      q.includes('بارے میں') ||
      q.includes('کون ہو') ||
      q.includes('برانڈ') ||
      q.includes('منشور') ||
      q.includes('کوڈ') ||
      q.includes('کوڈز') ||
      q.includes('رابطہ') ||
      q.includes('ای میل')
    ) {
      const codes = ASPIRE_WEBSITE_KNOWLEDGE.manifestoCodes
        .map((c) => `• **کوڈ ${c.number} (${c.title}):** ${c.doctrine}`)
        .join('\n');
      return `**ASPIRE WORK کے بارے میں — خود مختار اعلیٰ کارکردگی:**\n\n**شعار:** "${ASPIRE_WEBSITE_KNOWLEDGE.brand.tagline}"\n**مراکز:** ${ASPIRE_WEBSITE_KNOWLEDGE.brand.location}\n\nہمارا نصب العین پختہ نظم و ضبط، ذہنی مضبوطی اور انتھک محنت کے ذریعے درمیانے درجے کی سوچ کا خاتمہ ہے۔\n\n**۵ خود مختار برانڈ کوڈز:**\n${codes}\n\nایگزیکٹو ٹیم سے رابطہ: \`${ASPIRE_WEBSITE_KNOWLEDGE.brand.email}\``;
    }

    // 5. Social Channels in Urdu
    if (
      q.includes('سوشل') ||
      q.includes('یوٹیوب') ||
      q.includes('انسٹاگرام') ||
      q.includes('ٹک ٹاک') ||
      q.includes('ٹوئٹر') ||
      q.includes('چینل') ||
      q.includes('فالو')
    ) {
      const channels = Object.values(ASPIRE_WEBSITE_KNOWLEDGE.social)
        .map((s) => `• **${s.platform}:** [${s.handle}](${s.url}) — *${s.subscribersOrFollowers}* (${s.description})`)
        .join('\n');
      return `**ASPIRE WORK کے تصدیق شدہ سوشل میڈیا چینلز:**\n\nدنیا بھر کے ۲۶ لاکھ سے زائد سنجیدہ افراد کے ساتھ ہمارے آفیشل چینلز پر جڑیں:\n\n${channels}`;
    }

    // 6. Visual Gallery in Urdu
    if (
      q.includes('گیلری') ||
      q.includes('کہانی') ||
      q.includes('کہانیاں') ||
      q.includes('تصاویر')
    ) {
      const stories = ASPIRE_WEBSITE_KNOWLEDGE.gallery
        .map((g) => `• **${g.title}** (${g.category}): "${g.caption}" [${g.likes} پسندیدگیاں]`)
        .join('\n');
      return `**ASPIRE WORK بصری گیلری اور کہانیاں:**\n\n${stories}\n\nمزید تفصیلی تصویری مطالعہ کے لیے ویب سائٹ کا **Stories & Gallery** سیکشن ملاحظہ فرمائیں۔`;
    }

    // 7. Success, Goals & Execution in Urdu
    if (
      q.includes('مقصد') ||
      q.includes('اہداف') ||
      q.includes('کامیابی') ||
      q.includes('محنت') ||
      q.includes('موٹیویشن') ||
      q.includes('کاہلی') ||
      q.includes('پروڈکٹیوٹی')
    ) {
      return `**کامیابی اور اہداف کی فتح کے لیے ایگزیکٹو لائحہ عمل:**\n\n۱. **بلند اور غیر معمولی اہداف مقرر کریں:** اپنے اہداف اتنے جرات مندانہ رکھیں کہ اوسط سوچ پیچھے رہ جائے۔\n۲. **بغیر کسی مداخلت کے گہرا ارتکاز (Deep Work):** روزانہ صبح ۹۰ منٹ صرف اپنے سب سے اہم کام کو دیں۔\n۳. **مشکلات کے عادی بنیں:** اپنے جسم اور ذہن کو روزانہ مشقت کی تربیت دیں تاکہ رکاوٹیں معمول کا حصہ بن جائیں۔\n۴. **ہفتہ وار خود احتسابی:** ہر اتوار کی رات اپنی کارکردگی کا جائزہ لیں اور وقت ضائع کرنے والی عادات ختم کریں۔\n\n*"آپ کا مستقبل اس بات پر منحصر ہے جو آپ آج کرتے ہیں، نہ کہ ان بہانوں پر جو آپ تراشتے ہیں۔"*`;
    }

    return `**ASPIRE WORK میں خوش آمدید۔**\n\nمیں **Aspire AI** ہوں — آپ کا اعلیٰ درجے کا موٹیویشنل مشیر۔ میں آپ کو **۶ بنیادی ستونوں**، **اقوالِ زریں**، **روزانہ نظم و ضبط پروٹوکول**، یا کامیاب عادات اپنانے میں رہنمائی فراہم کر سکتا ہوں۔\n\n*آپ یہ سوالات پوچھ سکتے ہیں:*\n• "آج کا موٹیویشنل سبق بتائیں"\n• "ASPIRE WORK کا پہلا ستون کیا ہے؟"\n• "روزانہ نظم و ضبط کیسے قائم کریں؟"\n• "۵ خود مختار برانڈ کوڈز کیا ہیں؟"`;
  }

  // ================= ENGLISH KNOWLEDGE RETRIEVAL =================

  // 1. Specific or general Pillar inquiries
  if (
    q.includes('pillar 1') ||
    q.includes('first pillar') ||
    q.includes('pillar 01') ||
    (q.includes('discipline') && q.includes('pillar'))
  ) {
    const p = ASPIRE_WEBSITE_KNOWLEDGE.pillars[0];
    return `**${p.pillar}: ${p.title}**\n\n*Summary:* ${p.summary}\n\n*Full Doctrine:* ${p.doctrine}\n\n*Key Tenets:*\n${p.tenets.map((t) => `• ${t}`).join('\n')}\n\n*Daily Action Habit:* **${p.actionHabit}**`;
  }

  if (
    q.includes('pillar 2') ||
    q.includes('second pillar') ||
    q.includes('pillar 02') ||
    (q.includes('ambition') && q.includes('pillar'))
  ) {
    const p = ASPIRE_WEBSITE_KNOWLEDGE.pillars[1];
    return `**${p.pillar}: ${p.title}**\n\n*Summary:* ${p.summary}\n\n*Full Doctrine:* ${p.doctrine}\n\n*Key Tenets:*\n${p.tenets.map((t) => `• ${t}`).join('\n')}\n\n*Daily Action Habit:* **${p.actionHabit}**`;
  }

  if (
    q.includes('pillar 3') ||
    q.includes('third pillar') ||
    q.includes('pillar 03') ||
    (q.includes('wealth') && q.includes('pillar'))
  ) {
    const p = ASPIRE_WEBSITE_KNOWLEDGE.pillars[2];
    return `**${p.pillar}: ${p.title}**\n\n*Summary:* ${p.summary}\n\n*Full Doctrine:* ${p.doctrine}\n\n*Key Tenets:*\n${p.tenets.map((t) => `• ${t}`).join('\n')}\n\n*Daily Action Habit:* **${p.actionHabit}**`;
  }

  if (
    q.includes('pillar 4') ||
    q.includes('fourth pillar') ||
    q.includes('pillar 04') ||
    (q.includes('focus') && q.includes('pillar'))
  ) {
    const p = ASPIRE_WEBSITE_KNOWLEDGE.pillars[3];
    return `**${p.pillar}: ${p.title}**\n\n*Summary:* ${p.summary}\n\n*Full Doctrine:* ${p.doctrine}\n\n*Key Tenets:*\n${p.tenets.map((t) => `• ${t}`).join('\n')}\n\n*Daily Action Habit:* **${p.actionHabit}**`;
  }

  if (
    q.includes('pillar 5') ||
    q.includes('fifth pillar') ||
    q.includes('pillar 05') ||
    (q.includes('self-improvement') && q.includes('pillar'))
  ) {
    const p = ASPIRE_WEBSITE_KNOWLEDGE.pillars[4];
    return `**${p.pillar}: ${p.title}**\n\n*Summary:* ${p.summary}\n\n*Full Doctrine:* ${p.doctrine}\n\n*Key Tenets:*\n${p.tenets.map((t) => `• ${t}`).join('\n')}\n\n*Daily Action Habit:* **${p.actionHabit}**`;
  }

  if (
    q.includes('pillar 6') ||
    q.includes('sixth pillar') ||
    q.includes('pillar 06') ||
    (q.includes('confidence') && q.includes('pillar'))
  ) {
    const p = ASPIRE_WEBSITE_KNOWLEDGE.pillars[5];
    return `**${p.pillar}: ${p.title}**\n\n*Summary:* ${p.summary}\n\n*Full Doctrine:* ${p.doctrine}\n\n*Key Tenets:*\n${p.tenets.map((t) => `• ${t}`).join('\n')}\n\n*Daily Action Habit:* **${p.actionHabit}**`;
  }

  if (q.includes('pillar') || q.includes('pillars')) {
    const pillars = ASPIRE_WEBSITE_KNOWLEDGE.pillars
      .map((p) => `**${p.pillar}: ${p.title}**\n${p.summary}\n*Daily Action Habit:* ${p.actionHabit}`)
      .join('\n\n');
    return `**The 6 Sovereign Pillars of ASPIRE WORK:**\n\n${pillars}\n\nAsk me about any specific pillar for its complete doctrine and key tenets.`;
  }

  // 2. Directives & Quotes
  if (
    q.includes('quote') ||
    q.includes('directive') ||
    q.includes('aphorism') ||
    q.includes('saying') ||
    q.includes('vault') ||
    q.includes('marcus') ||
    q.includes('aurelius') ||
    q.includes('seneca') ||
    q.includes('epictetus')
  ) {
    // If specific author matched
    const matchedQuote = ASPIRE_WEBSITE_KNOWLEDGE.quotes.find((item) =>
      q.includes(item.author.toLowerCase()) ||
      item.tags?.some((t) => q.includes(t.toLowerCase())) ||
      q.includes(item.category.toLowerCase())
    );
    const quoteToUse =
      matchedQuote ||
      ASPIRE_WEBSITE_KNOWLEDGE.quotes[
        Math.floor(Math.random() * ASPIRE_WEBSITE_KNOWLEDGE.quotes.length)
      ];

    return `**Aspire Directive:**\n\n> "${quoteToUse.quote}"\n\n— **${quoteToUse.author}** (*${quoteToUse.meta}*)\n*Category:* ${quoteToUse.category}\n\n*Operational insight:* Apply this directive directly to your high-priority needle-mover today. Small actions repeated every day compound into undeniable mastery.`;
  }

  // 3. Daily Discipline & Habits
  if (
    q.includes('discipline') ||
    q.includes('routine') ||
    q.includes('habit') ||
    q.includes('checklist') ||
    q.includes('protocol') ||
    q.includes('streak')
  ) {
    const tasks = ASPIRE_WEBSITE_KNOWLEDGE.dailyDisciplineChecklist
      .map((t, idx) => `**0${idx + 1}. ${t.title}**\n   ↳ ${t.subtitle}`)
      .join('\n');
    return `**The ASPIRE WORK Daily Discipline Protocol:**\n\nDiscipline is the enduring furnace that fuels sovereign achievement. Here is the operational checklist recommended by ASPIRE WORK:\n\n${tasks}\n\n*Interactive Tracking:* Visit our **Daily Discipline** section to track your streak, complete tasks with audio cues, and record your daily execution score.`;
  }

  // 4. Brand & Manifesto & Codes
  if (
    q.includes('about') ||
    q.includes('aspire work') ||
    q.includes('brand') ||
    q.includes('manifesto') ||
    q.includes('who are you') ||
    q.includes('code') ||
    q.includes('mission') ||
    q.includes('email') ||
    q.includes('contact')
  ) {
    const codes = ASPIRE_WEBSITE_KNOWLEDGE.manifestoCodes
      .map((c) => `• **Code ${c.number} (${c.title}):** ${c.doctrine}`)
      .join('\n');
    return `**About ASPIRE WORK — Sovereign High-Performance:**\n\n**Tagline:** "${ASPIRE_WEBSITE_KNOWLEDGE.brand.tagline}"\n**Presence:** ${ASPIRE_WEBSITE_KNOWLEDGE.brand.location}\n\nWe exist to eradicate mediocrity through deliberate discipline, unshakeable mental strength, and asymmetric compounding.\n\n**The 5 Sovereign Brand Codes:**\n${codes}\n\nContact the executive suite directly at \`${ASPIRE_WEBSITE_KNOWLEDGE.brand.email}\`.`;
  }

  // 5. Social Channels
  if (
    q.includes('social') ||
    q.includes('instagram') ||
    q.includes('youtube') ||
    q.includes('tiktok') ||
    q.includes('x') ||
    q.includes('twitter') ||
    q.includes('channel') ||
    q.includes('follow')
  ) {
    const channels = Object.values(ASPIRE_WEBSITE_KNOWLEDGE.social)
      .map((s) => `• **${s.platform}:** [${s.handle}](${s.url}) — *${s.subscribersOrFollowers}* (${s.description})`)
      .join('\n');
    return `**Official ASPIRE WORK Social Dispatches:**\n\nJoin over 2.6M operators worldwide across our official media channels:\n\n${channels}\n\nAlways ensure you are connecting with our verified handles.`;
  }

  // 6. Gallery & Stories
  if (
    q.includes('gallery') ||
    q.includes('story') ||
    q.includes('stories') ||
    q.includes('visual')
  ) {
    const stories = ASPIRE_WEBSITE_KNOWLEDGE.gallery
      .map((g) => `• **${g.title}** (${g.category}): "${g.caption}" [${g.likes} likes]`)
      .join('\n');
    return `**ASPIRE WORK Curated Visual Gallery:**\n\n${stories}\n\nExplore these visual narratives in the **Stories & Gallery** section.`;
  }

  // 7. General Strategy, Goals & Execution
  if (
    q.includes('goal') ||
    q.includes('future') ||
    q.includes('success') ||
    q.includes('productivity') ||
    q.includes('motivation') ||
    q.includes('procrastinat') ||
    q.includes('focus')
  ) {
    return `**Executive Protocol for Goal Domination:**\n\n1. **Establish Asymmetric Goals:** Set targets audaciously high so that even partial execution dwarfs average benchmarks.\n2. **Isolate Deep Work Blocks:** Execute your critical needle-mover in 90-minute distraction-free intervals before noon.\n3. **Voluntary Hardening:** Train your vessel daily — physically and mentally — until friction feels like ordinary baseline operating procedure.\n4. **Audit Weekly:** Review your scorecard every Sunday night and prune 3 low-yield distractions.\n\n*"Your future is built by what you do today. Discipline over excuses."*`;
  }

  return `**Welcome to ASPIRE WORK.**\n\nI am **Aspire AI**, your high-performance motivational voice counselor. I can guide you through our **6 Motivation Pillars**, provide **verified maxims from our Quotes Vault**, outline the **Daily Discipline Protocol**, or assist with high-leverage habit construction.\n\n*Try asking:*\n• "Share today's motivational directive."\n• "What is the first pillar of ASPIRE WORK?"\n• "How do I cultivate daily discipline?"\n• "What are the 5 Sovereign Brand Codes?"`;
}

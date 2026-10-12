# ASPIRE WORK — Premium 3D Animation & Luxury Motivational Platform

> **“Dream Bigger. Work Harder. Become Unstoppable.”**

ASPIRE WORK is a world-class, cinematic, immersive motivational website designed with an obsidian-and-gold visual identity inspired by high-end digital agencies, luxury brands, and executive performance platforms.

---

## 1. Visual Design System

- **Main Background:** `#050505` (Deep Void Onyx)
- **Secondary Background:** `#0B0B0B` (Smoked Basalt)
- **Card Background:** `#111111` / `#141416` with hairline borders
- **Primary Gold:** `#D4AF37` (Classic Sovereign Gold)
- **Highlight Gold:** `#FFE08A` (Champagne Luminescence)
- **Primary Text:** `#FFFFFF`
- **Secondary Text:** `#A1A1AA`
- **Typography:** Space Grotesk (Headlines, Display, Labels) + Inter (Editorial Body)

---

## 2. Advanced 3D & Animation Architecture

### Three.js WebGL Hero Scene (`ThreeHeroScene.tsx`)
- Floating faceted gold geometric core (icosahedron) with inner metalness and outer wireframe casing.
- Concentric metallic gold orbit rings with realistic physical reflection.
- 3D luminous gold dust particles orbiting the scene with additive blending.
- Pointer and touch responsiveness: camera and objects smoothly damp toward pointer coordinates on desktop and touch coordinates on mobile.
- Comprehensive WebGL feature check and graceful fallback to golden CSS rings if WebGL is unavailable.
- Strict resource cleanup on unmount: geometries, materials, lights, and WebGLRenderer are disposed to prevent memory leaks.
- Non-blocking layout: `pointer-events-none` on canvas guarantees headlines, navigation, and buttons remain 100% interactive.

### HTML5 Canvas Custom Particle System (`GoldParticleCanvas.tsx`)
- High-DPI scaling via `window.devicePixelRatio`.
- Floating gold particles, glowing dust, and elegant hairline connecting lines between adjacent particles.
- Automatic visibility change listener (`document.hidden`) pauses the `requestAnimationFrame` loop when the tab is blurred or backgrounded to conserve CPU and battery.
- Adaptive density based on device performance tier (mobile ~24 particles, desktop ~55 particles).

### Interactive 3D Motivation Experience (`Interactive3DObject.tsx`)
- **“BUILD YOUR FUTURE”** interactive section.
- Interactive 3D gold torus knot sculpture with orbiting micro-satellites.
- Real-time interactive drag-to-rotate in 3D space with pointer velocity damping.
- 3 Content Stages:
  * **STAGE 1 — DREAM:** *“Every achievement begins with an audacious vision refused by the ordinary mind.”*
  * **STAGE 2 — DISCIPLINE:** *“Your daily habits shape your future long before the external world notices.”*
  * **STAGE 3 — BECOME:** *“Keep showing up in cold silence until your results speak for you.”*
- Interactive stage selector tabs and "Advance Stage" controls with audio feedback.

### Motion Preference & Accessibility (`MotionPreferenceProvider.tsx`)
- System `prefers-reduced-motion` detection hook.
- Automatically disables 3D rotations, particles, and cursor trailing when reduced motion is requested.
- Device capability tiering (high, medium, low) adjusts particle counts and pixel ratios.

### Interactive Desktop Custom Cursor (`CustomCursor.tsx`)
- Active exclusively on fine-pointer devices (`@media (pointer: fine)`).
- Precision gold pointer indicator accompanied by a smooth trailing ambient halo.
- Expands and glows when hovering over buttons, links, and cards.
- Automatically disabled on touchscreens and mobile devices to prevent touch interference.

### Golden Scroll Progress Indicator (`ScrollProgressIndicator.tsx`)
- Fixed top-edge hairline progress bar with a radiant gold gradient tracking scroll depth.

---

## 3. Preserved Brand Capabilities & Features

1. **Sticky Luxury Navigation:** Desktop & mobile drawer navigation, live counter badge for saved vault items, synthesized Web Audio tactile feedback toggle, and a gold *"Get Inspired"* action button.
2. **6 Curated Motivation Pillars:** Discipline & Consistency, Success & Ambition, Wealth & Financial Mindset, Focus & Productivity, Self-Improvement Protocol, and Confidence & Mental Fortitude with interactive doctrine modals detailing Core Philosophies, Immutable Tenets, and Daily Execution Habits.
3. **Dynamic Daily Motivational Engine:** Quote rotator featuring original executive aphorisms, "New Quote", "Save Quote" (with duplicate prevention), "Copy Quote", "Share Directive" (Web Share API with clipboard fallback), category filters, and saved drawer.
4. **Success & Discipline Protocol:** "Success Is Earned, Not Given" editorial section with Habit Architecture, Asymmetric Focus, and Ironclad Resilience. Includes an interactive Daily Discipline checklist with a percentage completion gauge, Local Storage date tracking (which automatically rolls over for a new day), and support for adding custom user directives.
5. **Instagram-Inspired Motivational Gallery:** Showcase cards with category filters, like counters, "Copy Caption" for ready-to-post captions with hashtags, bookmarking, and external brand profile links.
6. **Social Media Hub:** Dedicated *"Join The Aspire Movement"* section powered by a single centralized configuration file (`src/config/social.ts`) with links for Instagram, TikTok, YouTube, and X.
7. **Executive Contact Concierge:** Form with client-side validation, live character counter, explicit demo mode disclosure, and global headquarters information.
8. **Subpage Views & Vault Export:** Dedicated views for the Motivation Vault, Daily Quotes, Habits & Protocol, Stories & Gallery, About ASPIRE WORK (The 5 Executive Codes), Legal Modals (Privacy & Terms), and a Curated Vault with a one-click **"Export Dossier to Text"** utility.

---

## 4. Local Development & Build

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The server will run on `http://localhost:3000`.

### Type Checking & Linting
```bash
npm run lint
```

### Production Build
```bash
npm run build
```

---

## 5. Deployment

Fully compatible with Vercel, Netlify, Cloud Run, or any Node.js hosting platform.
© ASPIRE WORK. All rights reserved. Precision Built for Champions.

# HO Oxygen — Architecture & System Design

**Date:** 2026-03-27
**Status:** Approved for implementation (pending user sign-off on this document)
**Author:** Architecture planning session

---

## Table of Contents

1. [Project Context](#1-project-context)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Directory Structure](#3-directory-structure)
4. [ADR-001: Build Strategy — SSG over SPA or SSR](#adr-001-build-strategy--ssg-over-spa-or-ssr)
5. [ADR-002: Tailwind CSS v4 over v3](#adr-002-tailwind-css-v4-over-v3)
6. [ADR-003: i18n — Bundled Translations over HTTP Backend](#adr-003-i18n--bundled-translations-over-http-backend)
7. [ADR-004: Animation — Selective Motion + CSS Keyframes](#adr-004-animation--selective-motion--css-keyframes)
8. [ADR-005: Form Submission — Cloudflare Pages Function with Web3Forms Fallback](#adr-005-form-submission--cloudflare-pages-function-with-web3forms-fallback)
9. [ADR-006: Component Architecture — Flat + Section-Scoped](#adr-006-component-architecture--flat--section-scoped)
10. [ADR-007: Routing — Centralized Route Manifest](#adr-007-routing--centralized-route-manifest)
11. [Data Layer Design](#11-data-layer-design)
12. [Styling System Design](#12-styling-system-design)
13. [i18n System Design](#13-i18n-system-design)
14. [Animation System Design](#14-animation-system-design)
15. [Form Submission Flow](#15-form-submission-flow)
16. [Deployment Architecture](#16-deployment-architecture)
17. [Performance Budget](#17-performance-budget)
18. [Accessibility Architecture](#18-accessibility-architecture)
19. [Complete File Manifest](#19-complete-file-manifest)
20. [Implementation Risk Register](#20-implementation-risk-register)

---

## 1. Project Context

This is a **greenfield static informational website** for HO Oxygen in Nepal. As of 2026-03-27:

- Zero source code exists. No `src/`, `package.json`, or build artifacts.
- Only documentation files are present (`CLAUDE.md`, `tasks/1-FEATURES.md`, `docs/`).
- Phase 1 (design/mockup) is complete. Phase 2 (implementation) is approved.
- 14 feature tasks (F-001 to F-014) must be implemented in a prescribed order.

**Business constraints that drive architecture:**
- Informational only — no user accounts, no database, no CMS.
- Single contact form as the only dynamic interaction.
- Primary audience: hospitals, clinics, industrial users in Nepal.
- Must support EN/NP (English/Nepali) language toggle.
- Hosted on Cloudflare Pages (free tier is sufficient).
- No real prices displayed. All pricing is "Contact for pricing".

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     BUILD TIME (Vite + SSG)                      │
│                                                                   │
│  src/ (React + TypeScript)                                        │
│    ├── pages/          → pre-rendered to dist/*.html             │
│    ├── components/     → bundled into dist/assets/*.js           │
│    ├── data/           → inlined into JS bundle                  │
│    └── i18n/locales/   → bundled into JS (no HTTP fetch)         │
│                                                                   │
│  functions/            → NOT bundled into dist/                  │
│    └── api/contact.ts  → Cloudflare Pages Function (serverless)  │
└───────────────────────┬─────────────────────────────────────────┘
                        │ npm run build
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                     dist/ (Static Output)                         │
│                                                                   │
│  index.html            → Home page (pre-rendered)                │
│  about/index.html      → About page (pre-rendered)               │
│  products/index.html   → Products page (pre-rendered)            │
│  contact/index.html    → Contact page (pre-rendered)             │
│  faq/index.html        → FAQ page (pre-rendered)                 │
│  assets/               → Hashed JS + CSS bundles                 │
│  _redirects            → SPA fallback rule                       │
│  robots.txt            → Search engine directives                │
│  sitemap.xml           → All 5 page URLs                         │
└───────────────────────┬─────────────────────────────────────────┘
                        │ Cloudflare Pages deploy
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Cloudflare Pages (CDN Edge)                      │
│                                                                   │
│  Static assets → served from CDN (global edge)                   │
│  POST /api/contact → Cloudflare Pages Function (Workers runtime) │
│                      → forwards to Web3Forms API → email inbox   │
└─────────────────────────────────────────────────────────────────┘
```

**Request flow for a page visit:**
1. User visits `https://hogasfactory.com/about`
2. Cloudflare CDN serves `about/index.html` from the nearest edge node (pre-rendered HTML, fully parseable without JS)
3. Browser downloads the JS bundle → React hydrates the existing DOM (no re-render from scratch)
4. i18n initializes: `i18next-browser-languagedetector` reads `localStorage` → if Nepali, swaps all strings client-side
5. Motion library boots: hero animations trigger on load; Intersection Observer activates for scroll sections

**Request flow for form submission:**
1. User fills contact form → clicks Submit
2. `react-hook-form` validates client-side → shows inline errors if invalid
3. On valid submission: POST to `VITE_FORM_ENDPOINT` (Cloudflare Pages Function at `/api/contact`)
4. If env var not set (local dev): fallback POST directly to Web3Forms API
5. Success/error toast rendered in-place

---

## 3. Directory Structure

```
ho-gas-factory/
│
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Actions: build + deploy to Cloudflare Pages
│
├── docs/
│   ├── 1-INITIAL-SPECIFICATION.md      # Original specification (do not modify)
│   └── SKILLS.md                       # Frontend aesthetic guidelines
│
├── functions/                          # Cloudflare Pages Functions (Workers runtime, NOT src/)
│   └── api/
│       └── contact.ts                  # POST /api/contact — form submission handler
│
├── public/                             # Copied verbatim into dist/ at build time
│   ├── _redirects                      # /* /index.html 200 (SPA fallback for CF Pages)
│   ├── robots.txt                      # Search engine directives
│   └── sitemap.xml                     # All 5 page URLs for SEO
│
├── src/
│   ├── main.tsx                        # React entry point — bootstraps i18n then renders App
│   ├── App.tsx                         # Root component: RouterProvider + lang attribute effect
│   ├── routes.ts                       # Single source of truth for all routes (consumed by router AND SSG)
│   ├── index.css                       # Tailwind v4 @import + @theme tokens + global base styles
│   └── vite-env.d.ts                   # Vite env type declarations
│   │
│   ├── pages/                          # Route-level page components (one per route)
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── FAQPage.tsx
│   │
│   ├── components/
│   │   ├── ui/                         # Design system primitives (no business logic)
│   │   │   ├── index.ts                # Barrel re-export
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── PageHero.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── AnimateOnScroll.tsx
│   │   │
│   │   ├── layout/                     # App shell components
│   │   │   ├── PageLayout.tsx          # Wraps Navbar + <Outlet> + Footer
│   │   │   ├── Navbar.tsx
│   │   │   ├── MobileDrawer.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── SEOHead.tsx                 # Per-page <title> + <meta> tags
│   │   │
│   │   └── sections/                  # Page-specific composite sections
│   │       ├── home/
│   │       │   ├── HeroSection.tsx
│   │       │   ├── GasHighlights.tsx
│   │       │   ├── ServicesStrip.tsx
│   │       │   ├── TrustGallery.tsx
│   │       │   └── CTABanner.tsx
│   │       ├── about/
│   │       │   ├── StorySection.tsx
│   │       │   ├── TeamSection.tsx
│   │       │   ├── ServiceAreaSection.tsx
│   │       │   └── WhyChooseUsSection.tsx
│   │       ├── products/
│   │       │   ├── GasTabs.tsx
│   │       │   ├── CylinderTable.tsx
│   │       │   └── ServicesSection.tsx
│   │       ├── contact/
│   │       │   ├── ContactForm.tsx
│   │       │   ├── ContactInfo.tsx
│   │       │   └── MapEmbed.tsx
│   │       └── faq/
│   │           ├── CategoryFilter.tsx
│   │           ├── Accordion.tsx
│   │           └── AccordionItem.tsx
│   │
│   ├── data/                           # Typed static data — no API calls
│   │   ├── products.ts                 # Gas types, cylinder specs
│   │   ├── faq.ts                      # FAQ items with categories
│   │   └── team.ts                     # Team member records
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── useScrollPosition.ts        # Debounced scroll Y position
│   │   ├── useLanguageToggle.ts        # i18n language switcher
│   │   └── useIntersectionObserver.ts  # Scroll-triggered visibility
│   │
│   ├── i18n/
│   │   ├── config.ts                   # i18next initialization
│   │   └── locales/
│   │       ├── en.json                 # All English strings
│   │       └── np.json                 # All Nepali strings
│   │
│   └── lib/
│       └── submitForm.ts              # Form submission abstraction (CF Function + Web3Forms fallback)
│
├── tasks/
│   ├── 1-FEATURES.md                   # Feature breakdown with ASCII wireframes
│   ├── ARCHITECTURE-DECISION.md        # This file
│   ├── todo.md                         # Per-session task checklist (created during implementation)
│   └── lessons.md                      # Self-improvement log (created after corrections)
│
├── CLAUDE.md                           # Project specification and AI workflow rules
├── index.html                          # Vite HTML template (Google Fonts <link> here)
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── wrangler.toml                       # Cloudflare Pages project config
```

---

## ADR-001: Build Strategy — SSG over SPA or SSR

**Status:** Decided

**Context:**
This site has 5 pages with static content. No user-specific data, no real-time information, no authentication. The contact form is the only dynamic element (handled server-side by a Cloudflare Pages Function).

**Options considered:**

| Option | Pros | Cons |
|--------|------|------|
| Pure SPA (no prerender) | Simplest build setup | Empty HTML shell hurts SEO; slow first paint |
| SSG (static pre-render) | SEO-ready HTML; fast TTFB from CDN; no server needed | i18n defaults to English in static HTML |
| SSR (server-rendered) | Dynamic per-request HTML | Requires persistent server; overkill for static content; higher cost/complexity |

**Decision: SSG**

Pre-render all 5 routes to static HTML at build time. Deploy to Cloudflare Pages CDN. Each page URL produces a real HTML file (`/about/index.html`) with all content visible to search engines and parseable without JavaScript.

**Implementation (confirmed working as of F-001):**
- `vite-plugin-ssg` v0.1.0 is confirmed compatible with Vite 5 + React 19 (requires React 19 for `react-dom/static`'s `prerenderToNodeStream` API — React 18 is NOT sufficient).
- Actual package API: exports `ssgPlugin` (not `ssg`). Scans `src/pages/` folder for files with a `ssgOptions` export.
- Each page component must export a `ssgOptions: SsgOptions` object (from `vite-plugin-ssg/utils`) with `slug`, `routeUrl`, `Head`, and `context`. The object **must** end with `};` (semicolon) — the plugin uses a regex to detect it.
- Slugs must NOT contain `/` (e.g., use `'about'` not `'about/index'`) — the plugin has a bug where subdirectory slugs cause a temp file write failure.
- Output: `dist/about.html`, `dist/products.html`, etc. (served at `/about`, `/products` on Cloudflare Pages). No `about/index.html` structure.
- `public/_redirects` with `/* /index.html 200` provides SPA fallback. Cloudflare Pages serves static files before applying redirect rules.
- React version: **19.2.4** (upgraded from 18 during F-001 to satisfy `vite-plugin-ssg`'s use of `prerenderToNodeStream`).

**Nepali i18n tradeoff:** The static HTML will contain only English strings. Nepali content loads after JS hydration. This is intentional and acceptable: Nepali is a user preference feature, not a primary SEO target. The `html[lang]` attribute switches to `ne` after hydration.

---

## ADR-002: Tailwind CSS v4 over v3

**Status:** Decided

**Context:**
Tailwind v3 uses `tailwind.config.ts` + PostCSS. Tailwind v4 (released 2025) uses a Vite plugin and CSS-native `@theme` directive with zero config files.

**Decision: Tailwind v4**

This is a greenfield project. v4 is stable and the future of the framework. It integrates via a single Vite plugin (`@tailwindcss/vite`) and moves all token definitions into CSS, which is a cleaner separation of concerns.

**Brand tokens in `src/index.css`:**
```css
@import "tailwindcss";

@theme {
  --color-brand-blue: #1E40AF;
  --color-brand-light: #EFF6FF;
  --color-brand-dark: #1E3A5F;
  --color-brand-accent: #3B82F6;
  --color-brand-steel: #64748B;

  --font-display: "Sora", sans-serif;
  --font-body: "DM Sans", sans-serif;

  --radius-card: 0.75rem;
  --shadow-card: 0 4px 24px -4px rgb(30 64 175 / 0.12);
  --shadow-card-hover: 0 12px 40px -8px rgb(30 64 175 / 0.22);
}
```

**Usage in components:**
```tsx
// Utility classes reference the @theme tokens automatically:
<div className="bg-brand-blue text-white font-display">
<button className="shadow-card hover:shadow-card-hover">
```

**Note:** If `@tailwindcss/vite` is not yet available for Tailwind v4 in the current npm registry at implementation time, fall back to Tailwind v3 with `tailwind.config.ts`. The brand token values remain identical; only the configuration location changes.

---

## ADR-003: i18n — Bundled Translations over HTTP Backend

**Status:** Decided

**Context:**
`react-i18next` supports multiple backends for loading translation files: HTTP (fetch at runtime), filesystem (Node.js only), or bundled imports (inline into JS bundle).

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| HTTP backend (`i18next-http-backend`) | Separate files, lazy-load per language | Extra network request; flash of untranslated content; complicates SSG |
| Bundled imports | Zero extra requests; no FOUC; SSG-friendly | Slightly larger JS bundle |

**Decision: Bundled imports**

Both `en.json` and `np.json` are imported directly in `src/i18n/config.ts` and passed to `i18next.init({ resources })`. For a 5-page informational site, the translation payload is under 20KB — negligible bundle impact.

**Translation file structure:**
```json
// en.json — flat namespace, prefixed by section
{
  "nav.home": "Home",
  "nav.about": "About Us",
  "nav.products": "Products",
  "nav.contact": "Contact",
  "nav.faq": "FAQ",
  "nav.lang_toggle": "NP",

  "home.hero.headline": "Reliable Gas Supply for Medical & Industrial Use",
  "home.hero.subtext": "...",
  "home.hero.cta_contact": "Contact Us",
  "home.hero.cta_products": "Explore Products",

  "footer.copyright": "© 2026 HO Oxygen. All rights reserved.",
  ...
}
```

**Language detection order:**
1. `localStorage` (key: `i18nextLng`) — persisted user preference
2. Browser `navigator.language` — OS/browser default
3. Fallback: `en`

**`html[lang]` switching:** A `useEffect` in `App.tsx` listens to `i18n.language` changes and sets `document.documentElement.lang` to either `en` or `ne` (ISO 639-1 code for Nepali is `ne`, not `np`).

**Nepali translation quality:** Initial `np.json` will use `[NP: English text]` placeholder markers for strings not yet professionally translated. These are clearly marked for a Nepali speaker to review and correct before launch.

---

## ADR-004: Animation — Selective Motion + CSS Keyframes

**Status:** Decided

**Context:**
Two animation libraries were considered: Motion (formerly Framer Motion) and pure CSS. SKILLS.md demands "high-impact page load with staggered reveals" and "scroll-triggering and hover states."

**Decision: Hybrid approach**

| Animation type | Implementation |
|----------------|---------------|
| Hero section entrance (staggered headline → sub-copy → buttons) | Motion `motion.div` with `initial`/`animate`/`transition.delay` |
| Page transitions (route change fade) | Motion `AnimatePresence` wrapping `<Outlet>` |
| Scroll-triggered section reveals | CSS `@keyframes fadeSlideUp` + Intersection Observer via `useIntersectionObserver` hook + `AnimateOnScroll` wrapper component |
| Card hover lift (`translateY(-4px)`) | Pure CSS `transition: transform 200ms ease-out` |
| Navbar shadow on scroll | CSS `transition: box-shadow 200ms` triggered by JS class toggle |
| Accordion open/close height | CSS `grid-template-rows: 0fr → 1fr` transition (no JS height calculation needed) |

**Rationale:** Motion adds ~35KB gzipped. Limiting it to the hero + page transitions means that cost is paid exactly once (first page load), and everything else is zero-JS CSS transitions that work without hydration.

**Motion usage pattern:**
```tsx
// Hero headline — staggered entrance
<motion.h1
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>

// Sub-copy — delayed
<motion.p
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
>
```

**CSS scroll animation pattern:**
```css
/* src/index.css */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-on-scroll {
  opacity: 0;
}
.animate-on-scroll.is-visible {
  animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

---

## ADR-005: Form Submission — Cloudflare Pages Function with Web3Forms Fallback

**Status:** Decided

**Context:**
The contact form must send inquiry data to a single email inbox. Options: Cloudflare Pages Function, third-party form service (Web3Forms, Formspree), or email API (Resend, SendGrid).

**Decision: Cloudflare Pages Function as primary, Web3Forms as fallback**

**Primary path (production):**
```
Browser → POST /api/contact
         → functions/api/contact.ts (Cloudflare Workers runtime)
         → Web3Forms API (HTTP fetch with API key from CF env var)
         → Email delivered to inbox
```

**Fallback path (local dev or if CF function not configured):**
```
Browser → POST directly to https://api.web3forms.com/submit
         (with access_key from VITE_WEB3FORMS_KEY env var)
         → Email delivered to inbox
```

**`functions/api/contact.ts` responsibilities:**
1. Accept `POST` with JSON body
2. Validate required fields server-side (name, email, phone, company)
3. Sanitize inputs (trim whitespace, basic XSS prevention)
4. Forward to Web3Forms API
5. Return `{ success: true }` or `{ success: false, error: "..." }`

**`src/lib/submitForm.ts` client abstraction:**
```ts
export async function submitForm(data: ContactFormData): Promise<void> {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT ?? 'https://api.web3forms.com/submit';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Submission failed');
}
```

**TypeScript note:** `functions/api/contact.ts` uses the Cloudflare Workers runtime, not the DOM. It needs `/// <reference types="@cloudflare/workers-types" />` at the top, or a separate `tsconfig.functions.json` that extends the root config and adds `@cloudflare/workers-types`.

---

## ADR-006: Component Architecture — Flat + Section-Scoped

**Status:** Decided

**Context:**
React component organization patterns range from feature-based (one folder per feature), domain-based (one folder per domain entity), to layer-based (ui/layout/sections/pages).

**Decision: Layer-based with section scoping**

Three clear layers with no cross-layer imports in the wrong direction:

```
pages/          → compose sections + layout
sections/       → compose ui primitives + consume data
ui/             → pure presentational, zero business logic
layout/         → app shell (Navbar, Footer, PageLayout)
data/           → typed static data, no React
hooks/          → reusable stateful logic, no JSX
lib/            → pure utility functions, no React
```

**Rules:**
- `ui/` components accept only primitive props (strings, booleans, callbacks). They do not import from `data/`, `i18n/`, or `hooks/`.
- `sections/` components import from `ui/` and `data/`. They use `useTranslation()` for i18n. They do not import from `pages/`.
- `pages/` components import `sections/` and apply `SEOHead`. They do not contain layout logic.
- No index barrel re-exports inside `sections/` or `pages/` — direct imports only to keep bundle analysis clear.
- `ui/index.ts` is the only barrel file (for design system ergonomics).

**Props pattern for UI components:**
```tsx
// Button — union type variant, not separate boolean flags
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  as?: 'button' | 'a';
  to?: string;       // if as="Link" via react-router-dom
  loading?: boolean;
}
```

---

## ADR-007: Routing — Centralized Route Manifest

**Status:** Decided

**Context:**
`react-router-dom` v6 routes can be defined inline in JSX or via a central config object. The SSG plugin needs a list of routes to pre-render. These two concerns must stay in sync.

**Decision: Single `src/routes.ts` manifest consumed by both**

```ts
// src/routes.ts
export const ROUTES = [
  { path: '/',          label: 'nav.home',     component: lazy(() => import('./pages/HomePage')) },
  { path: '/about',     label: 'nav.about',    component: lazy(() => import('./pages/AboutPage')) },
  { path: '/products',  label: 'nav.products', component: lazy(() => import('./pages/ProductsPage')) },
  { path: '/contact',   label: 'nav.contact',  component: lazy(() => import('./pages/ContactPage')) },
  { path: '/faq',       label: 'nav.faq',      component: lazy(() => import('./pages/FAQPage')) },
] as const;

// Consumed by vite.config.ts SSG includedRoutes:
export const ROUTE_PATHS = ROUTES.map(r => r.path);
// → ['/', '/about', '/products', '/contact', '/faq']
```

The `label` field is an i18n key, allowing the Navbar to render translated link labels by iterating `ROUTES` — no hardcoded nav link list.

---

## 11. Data Layer Design

All data is typed TypeScript. No API calls. Data is imported directly into components.

### `src/data/products.ts`

```ts
export type GasType = 'oxygen' | 'nitrogen' | 'hydrogen';

export interface Cylinder {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  capacityLiters: number;
  weightKg: number;
  rentAvailable: boolean;
  saleAvailable: boolean;
  descriptionKey: string;  // i18n key
}

export interface GasProduct {
  type: GasType;
  nameKey: string;         // i18n key → "Oxygen Gas"
  descriptionKey: string;  // i18n key → paragraph about the gas
  useCaseKeys: string[];   // i18n keys → ["Medical therapy", "Hospital ICU", ...]
  cylinders: Cylinder[];
}

export const GAS_PRODUCTS: GasProduct[] = [
  {
    type: 'oxygen',
    nameKey: 'products.oxygen.name',
    descriptionKey: 'products.oxygen.description',
    useCaseKeys: [
      'products.oxygen.use_case_1',
      'products.oxygen.use_case_2',
      'products.oxygen.use_case_3',
    ],
    cylinders: [
      { size: 'S',  capacityLiters: 1.5,  weightKg: 3,  rentAvailable: true,  saleAvailable: true,  descriptionKey: 'products.cylinder.s.desc' },
      { size: 'M',  capacityLiters: 5,    weightKg: 8,  rentAvailable: true,  saleAvailable: true,  descriptionKey: 'products.cylinder.m.desc' },
      { size: 'L',  capacityLiters: 10,   weightKg: 15, rentAvailable: true,  saleAvailable: true,  descriptionKey: 'products.cylinder.l.desc' },
      { size: 'XL', capacityLiters: 47,   weightKg: 60, rentAvailable: true,  saleAvailable: false, descriptionKey: 'products.cylinder.xl.desc' },
    ],
  },
  // nitrogen, hydrogen follow same shape
];
```

### `src/data/faq.ts`

```ts
export type FAQCategory = 'all' | 'safety' | 'ordering' | 'delivery' | 'rental' | 'payment' | 'emergency';

export interface FAQItem {
  id: string;
  questionKey: string;
  answerKey: string;
  category: Exclude<FAQCategory, 'all'>;
}

export const FAQ_ITEMS: FAQItem[] = [
  { id: 'faq-1', questionKey: 'faq.q1.question', answerKey: 'faq.q1.answer', category: 'safety' },
  // ... all items
];
```

### `src/data/team.ts`

```ts
export interface TeamMember {
  id: string;
  nameKey: string;
  roleKey: string;
  image: string;  // placeholder URL e.g. "https://placehold.co/300x300"
}

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'tm-1', nameKey: 'about.team.member1.name', roleKey: 'about.team.member1.role', image: 'https://placehold.co/300x300/1E40AF/EFF6FF?text=Team' },
  // 3-4 members
];
```

---

## 12. Styling System Design

### Token Hierarchy

```
Level 1: CSS @theme tokens (raw values)
  --color-brand-blue: #1E40AF

Level 2: Tailwind utility classes (generated from tokens)
  bg-brand-blue, text-brand-blue, border-brand-blue

Level 3: CSS component classes (for patterns too complex for utilities)
  .card-glass, .hero-gradient, .nav-link-active

Level 4: Component-level inline variants (via cva or plain template literals)
  cn('bg-brand-blue', { 'opacity-70': disabled })
```

### Visual Design Language

Per `docs/SKILLS.md`:

| Element | Design choice | Implementation |
|---------|---------------|----------------|
| Hero background | Radial gradient mesh — not flat color | CSS `radial-gradient` with 2-3 orbs at different positions, very subtle |
| Cards | Glass morphism — translucent white + blur | `bg-white/80 backdrop-blur-sm border border-white/20` |
| Buttons (primary) | Gradient fill — not flat solid | `bg-gradient-to-br from-brand-blue to-blue-700` |
| Page hero | Diagonal clip-path | CSS `clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%)` |
| Section dividers | Soft wave SVG | Inline SVG at the bottom of key sections |
| Hover transitions | All interactive elements | `transition-all duration-200 ease-out` via global layer |
| Focus rings | Custom brand ring | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2` |

### Typography Scale

```css
/* Applied via Tailwind utilities */
/* Display: Sora */
h1 → text-4xl lg:text-6xl font-display font-bold leading-tight
h2 → text-3xl lg:text-4xl font-display font-semibold
h3 → text-xl lg:text-2xl font-display font-semibold
/* Body: DM Sans */
p  → text-base font-body leading-relaxed text-neutral-700
small → text-sm font-body text-neutral-500
```

---

## 13. i18n System Design

### Initialization (`src/i18n/config.ts`)

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import np from './locales/np.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ne: { translation: np },   // ISO 639-1: "ne" for Nepali
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
```

### App.tsx `html[lang]` wiring

```ts
// src/App.tsx
const { i18n } = useTranslation();
useEffect(() => {
  document.documentElement.lang = i18n.language === 'ne' ? 'ne' : 'en';
}, [i18n.language]);
```

### Toggle hook (`src/hooks/useLanguageToggle.ts`)

```ts
export function useLanguageToggle() {
  const { i18n } = useTranslation();
  const isNepali = i18n.language === 'ne';
  const toggle = () => i18n.changeLanguage(isNepali ? 'en' : 'ne');
  return { isNepali, toggle, currentLang: isNepali ? 'NP' : 'EN' };
}
```

### Navbar toggle button

```tsx
<button onClick={toggle} aria-label={`Switch to ${isNepali ? 'English' : 'Nepali'}`}>
  {currentLang}
</button>
```

---

## 14. Animation System Design

### `src/hooks/useIntersectionObserver.ts`

```ts
interface Options {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(options: Options = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -64px 0px', triggerOnce = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}
```

### `src/components/ui/AnimateOnScroll.tsx`

```tsx
interface Props {
  children: React.ReactNode;
  delay?: number;   // CSS animation-delay in ms, for stagger
  className?: string;
}

export function AnimateOnScroll({ children, delay = 0, className }: Props) {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('animate-on-scroll', isVisible && 'is-visible', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

### Accordion animation (CSS-only, no JS height measurement)

```tsx
// AccordionItem.tsx
<div
  className="grid transition-[grid-template-rows] duration-300 ease-in-out"
  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
>
  <div className="overflow-hidden">
    <div className="pb-4 text-neutral-600">{answer}</div>
  </div>
</div>
```

---

## 15. Form Submission Flow

```
User submits form
      │
      ▼
react-hook-form validates
      │
   invalid? ──► show inline errors, stop
      │
   valid
      ▼
submitForm(data) called
      │
      ├── VITE_FORM_ENDPOINT set?
      │         │
      │        YES ──► POST /api/contact (Cloudflare Pages Function)
      │                      │
      │                      ├── validate server-side
      │                      ├── sanitize inputs
      │                      └── POST to Web3Forms API ──► email delivered
      │
      └── NO (local dev) ──► POST https://api.web3forms.com/submit directly
                                    └── email delivered
      │
      ▼
  success? ──► show success toast, reset form
  error?   ──► show error toast, preserve form data
```

**Cloudflare Pages Function (`functions/api/contact.ts`):**
```ts
/// <reference types="@cloudflare/workers-types" />

export interface Env {
  WEB3FORMS_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const data = await request.json() as Record<string, unknown>;

  // Server-side validation
  const required = ['name', 'email', 'phone', 'company'];
  for (const field of required) {
    if (!data[field] || typeof data[field] !== 'string' || !data[field].trim()) {
      return Response.json({ success: false, error: `${field} is required` }, { status: 400 });
    }
  }

  // Forward to Web3Forms
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_key: env.WEB3FORMS_KEY, ...data }),
  });

  if (!response.ok) {
    return Response.json({ success: false, error: 'Email delivery failed' }, { status: 500 });
  }
  return Response.json({ success: true });
};
```

---

## 16. Deployment Architecture

```
GitHub repo (main branch)
      │
      │  git push to main
      ▼
GitHub Actions (.github/workflows/deploy.yml)
      │
      ├── actions/checkout@v4
      ├── actions/setup-node@v4 (Node 20)
      ├── npm ci
      ├── npm run build   ──► produces dist/
      └── cloudflare/wrangler-action@v3
              │
              └── Deploys dist/ to Cloudflare Pages
                  + Functions from functions/ automatically deployed
```

**`wrangler.toml`:**
```toml
name = "ho-gas-factory"
compatibility_date = "2026-03-01"
pages_build_output_dir = "dist"
```

**GitHub Actions secrets required:**
- `CLOUDFLARE_API_TOKEN` — CF API token with Pages deploy permissions
- `CLOUDFLARE_ACCOUNT_ID` — CF account ID

**Cloudflare Pages environment variables (set in CF dashboard):**
- `WEB3FORMS_KEY` — Web3Forms API key for form submission

**`public/_redirects`:**
```
/* /index.html 200
```

**`public/robots.txt`:**
```
User-agent: *
Allow: /
Sitemap: https://hogasfactory.com/sitemap.xml
```

**`public/sitemap.xml`:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://hogasfactory.com/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>https://hogasfactory.com/about</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://hogasfactory.com/products</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://hogasfactory.com/contact</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://hogasfactory.com/faq</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>
```

---

## 17. Performance Budget

Target: **Lighthouse score ≥ 90** on Performance, Accessibility, Best Practices, SEO.

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP (Largest Contentful Paint) | < 1.5s | SSG pre-rendered HTML; hero image preloaded |
| FID / INP | < 100ms | No blocking JS; React hydrates progressively |
| CLS | < 0.1 | Image dimensions always specified; no layout shifts |
| JS bundle (gzipped) | < 120KB | Code-split by route via `React.lazy`; Motion loaded on hero page only |
| CSS (gzipped) | < 15KB | Tailwind v4 purges unused utilities at build time |
| Total page weight | < 300KB (excluding images) | Aggressive code splitting + CDN-served fonts |

**Optimization techniques:**
- Google Fonts: `<link rel="preconnect">` + `display=swap` parameter to prevent render-blocking
- Images: `loading="lazy"` on all below-fold images; `width` and `height` always specified to prevent CLS
- Routes: `React.lazy()` + `Suspense` for each page component — each route is a separate JS chunk
- Motion: Only imported in `HeroSection.tsx` and `App.tsx` (page transitions). Not imported in any other component.
- No unused polyfills — target modern browsers (last 2 versions of Chrome, Firefox, Safari, Edge)

---

## 18. Accessibility Architecture

WCAG 2.1 AA compliance. Target score: Lighthouse Accessibility ≥ 95.

**Semantic HTML structure per page:**
```html
<body>
  <a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>
  <header> <nav>...</nav> </header>
  <main id="main-content">
    <h1>One per page, describes the page</h1>
    <section aria-labelledby="section-heading-id">
      <h2 id="section-heading-id">Section title</h2>
    </section>
  </main>
  <footer>...</footer>
</body>
```

**ARIA requirements per component:**

| Component | ARIA |
|-----------|------|
| Navbar mobile toggle | `aria-label="Open menu"` / `"Close menu"`, `aria-expanded` |
| Mobile drawer | `role="dialog"`, `aria-modal="true"`, `aria-label="Navigation menu"` |
| Language toggle | `aria-label="Switch to Nepali"` / `"Switch to English"` |
| Active nav link | `aria-current="page"` (NavLink handles automatically) |
| Product tabs | `role="tablist"`, `role="tab"`, `aria-selected`, `role="tabpanel"`, `aria-labelledby` |
| FAQ accordion | `aria-expanded` on button, `aria-controls` pointing to answer `id` |
| Form fields | `<label>` associated via `htmlFor`, `aria-required="true"`, `aria-describedby` on error messages |
| Form errors | `aria-live="polite"` on error container |
| Toast notifications | `role="status"` or `role="alert"`, `aria-live="polite"` or `"assertive"` |
| Images | `alt` attribute on all `<img>`, empty `alt=""` for decorative images |

**Contrast ratios (all must pass 4.5:1 for normal text, 3:1 for large text):**
- `#1E40AF` on `#FFFFFF` → 8.6:1 ✓
- `#FFFFFF` on `#1E40AF` → 8.6:1 ✓
- `#374151` (neutral-700, body text) on `#FFFFFF` → 10.6:1 ✓
- `#6B7280` (neutral-500, muted text) on `#FFFFFF` → 4.6:1 ✓ (just passes)
- `#EFF6FF` (brand-light) background with `#1E40AF` text → 8.6:1 ✓

**Keyboard navigation:**
- All interactive elements reachable via Tab key
- Logical tab order follows visual reading order
- Focus trap in mobile drawer (Tab cycles within drawer when open)
- Escape key closes mobile drawer and dropdowns

---

## 19. Complete File Manifest

55 files total across all 14 feature tasks. Listed in creation order.

**F-001 (Scaffolding) — 13 files:**
```
package.json
tsconfig.json
tsconfig.node.json
vite.config.ts
index.html
src/main.tsx
src/App.tsx
src/routes.ts
src/index.css
src/vite-env.d.ts
public/_redirects
wrangler.toml
.gitignore
```

**F-002 (i18n) — 4 files:**
```
src/i18n/config.ts
src/i18n/locales/en.json
src/i18n/locales/np.json
src/hooks/useLanguageToggle.ts
```

**F-003 (Design System) — 8 files:**
```
src/components/ui/Button.tsx
src/components/ui/Card.tsx
src/components/ui/Badge.tsx
src/components/ui/SectionHeader.tsx
src/components/ui/PageHero.tsx
src/components/ui/Toast.tsx
src/components/ui/AnimateOnScroll.tsx
src/components/ui/index.ts
```

**F-004 (Navbar) — 3 files:**
```
src/components/layout/Navbar.tsx
src/components/layout/MobileDrawer.tsx
src/hooks/useScrollPosition.ts
```

**F-005 (Footer) — 2 files:**
```
src/components/layout/Footer.tsx
src/components/layout/PageLayout.tsx
```

**F-006 (Home) — 6 files:**
```
src/pages/HomePage.tsx
src/components/sections/home/HeroSection.tsx
src/components/sections/home/GasHighlights.tsx
src/components/sections/home/ServicesStrip.tsx
src/components/sections/home/TrustGallery.tsx
src/components/sections/home/CTABanner.tsx
```

**F-007 (About) — 6 files:**
```
src/pages/AboutPage.tsx
src/components/sections/about/StorySection.tsx
src/components/sections/about/TeamSection.tsx
src/components/sections/about/ServiceAreaSection.tsx
src/components/sections/about/WhyChooseUsSection.tsx
src/data/team.ts
```

**F-008 (Products) — 5 files:**
```
src/pages/ProductsPage.tsx
src/components/sections/products/GasTabs.tsx
src/components/sections/products/CylinderTable.tsx
src/components/sections/products/ServicesSection.tsx
src/data/products.ts
```

**F-009 (Contact) — 6 files:**
```
src/pages/ContactPage.tsx
src/components/sections/contact/ContactForm.tsx
src/components/sections/contact/ContactInfo.tsx
src/components/sections/contact/MapEmbed.tsx
src/lib/submitForm.ts
functions/api/contact.ts
```

**F-010 (FAQ) — 5 files:**
```
src/pages/FAQPage.tsx
src/components/sections/faq/CategoryFilter.tsx
src/components/sections/faq/Accordion.tsx
src/components/sections/faq/AccordionItem.tsx
src/data/faq.ts
```

**F-011 (A11y/SEO) — 3 files:**
```
src/components/SEOHead.tsx
public/robots.txt
public/sitemap.xml
```

**F-012 (Animations) — 1 file:**
```
src/hooks/useIntersectionObserver.ts
```
*(AnimateOnScroll.tsx already created in F-003)*

**F-013 (Responsive) — 0 new files**
*(All responsive work is modification of existing components)*

**F-014 (Deployment) — 1 file:**
```
.github/workflows/deploy.yml
```

---

## 20. Implementation Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `vite-plugin-ssg` incompatible with React 18 / Vite 5 | Medium | High | Verify before starting F-001; have custom `prerender.ts` fallback ready |
| Tailwind v4 `@tailwindcss/vite` not yet stable | Low | Medium | Fall back to Tailwind v3 with `tailwind.config.ts`; brand tokens unchanged |
| Nepali translation quality insufficient | High | Medium | Mark all `np.json` strings with `[NP: ...]` prefix; flag for native speaker review before launch |
| Google Maps embed blocked by CSP | Low | Low | Add `maps.googleapis.com` to `Content-Security-Policy` header in CF Pages |
| Motion bundle too large | Low | Low | Motion is tree-shakeable; only import used components; verify bundle size after F-012 |
| Accordion animation broken in Safari | Medium | Low | Test `grid-template-rows` transition in Safari; fallback to `max-height: 500px` with `overflow: hidden` if needed |
| Form submission fails due to CORS | Low | High | Cloudflare Pages Function runs same-origin; Web3Forms CORS is open; no CORS issue expected |
| SSG pre-render fails on dynamic components (tabs, accordion) | Medium | Medium | SSR-safe initial state: first tab shown by default; accordion all collapsed by default; no `window` access at render time |

---

*This document governs all architectural decisions for Phase 2 implementation. Any deviation from these decisions must be documented here with rationale before the code change is made.*

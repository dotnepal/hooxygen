# HO Oxygen — Architecture & System Design

**Date:** 2026-03-27 (last updated: 2026-04-14 to reflect Services page addition and SEO features)
**Status:** Approved for implementation — Phase 2-3 COMPLETE, Phase 4 IN PROGRESS
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
8. [ADR-005: Form Submission — Cloudflare Pages Function with Contact Mailer Worker](#adr-005-form-submission--cloudflare-pages-function-with-contact-mailer-worker)
9. [ADR-006: Component Architecture — Layered, Page-Scoped](#adr-006-component-architecture--layered-page-scoped)
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

This is a **static informational website** for HO Oxygen in Nepal. As of 2026-04-14:

- **Phase 2 COMPLETE (2026-03-28):** All frontend pages built and deployed
  - 6 pages: Home, About, Products, Services, Contact, FAQ
  - Full i18n (EN/NP), animations, accessibility, responsive design
  - CI/CD pipeline wired to Cloudflare Pages
  
- **Phase 3 COMPLETE (2026-04-14):** Full SEO optimization
  - OG tags, hreflang, canonical URLs, structured data (JSON-LD)
  - Dynamic sitemap generation + CI/CD validation
  - Image optimization, keyword expansion, enhanced robots.txt
  
- **Phase 4 IN PROGRESS:** Backend integration
  - Contact form submission wired to Cloudflare Pages Function
  - Email notifications via contact-mailer Worker (service binding)

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
│  about.html            → About page (pre-rendered)               │
│  products.html         → Products page (pre-rendered)            │
│  services.html         → Services page (pre-rendered)            │
│  contact.html          → Contact page (pre-rendered)             │
│  faq.html              → FAQ page (pre-rendered)                 │
│  assets/               → Hashed JS + CSS bundles                 │
│  404.html              → Not-found page (HTTP 404)               │
│  _redirects            → Comment only (no SPA catch-all)         │
│  robots.txt            → Search engine directives                │
│  sitemap.xml           → All 6 page URLs with hreflang tags      │
└───────────────────────┬─────────────────────────────────────────┘
                        │ Cloudflare Pages deploy
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Cloudflare Pages (CDN Edge)                      │
│                                                                   │
│  Static assets → served from CDN (global edge)                   │
│  POST /api/contact → Cloudflare Pages Function (Workers runtime) │
│                      → Turnstile check → CONTACT_MAILER Worker  │
│                      → send_email → email inbox                  │
└─────────────────────────────────────────────────────────────────┘
```

**Request flow for a page visit:**
1. User visits `https://hooxygen.com.np/about`
2. Cloudflare CDN serves `about.html` (for `/about`) from the nearest edge node (pre-rendered HTML, fully parseable without JS)
3. Browser downloads the JS bundle → React hydrates the existing DOM (no re-render from scratch)
4. i18n initializes: `i18next-browser-languagedetector` reads `localStorage` → if Nepali, swaps all strings client-side
5. Motion library boots: hero animations trigger on load; Intersection Observer activates for scroll sections

**Request flow for form submission:**
1. User fills contact form → clicks Submit
2. `react-hook-form` validates client-side → shows inline errors if invalid
3. On valid submission (with a Turnstile token): POST to `/api/contact` (Cloudflare Pages Function)
4. The Function verifies Turnstile, validates, and hands off to the `contact-mailer` Worker, which sends the email
5. Success/error status rendered in-place

---

## 3. Directory Structure

The source tree is the source of truth — browse `src/` rather than relying on a hand-maintained listing here (an earlier detailed tree drifted from the code and was removed). Top level:

| Path | Purpose |
|------|---------|
| `src/pages/` | One file per route; each exports `ssgOptions` for SSG |
| `src/components/ui/` | Design-system primitives (Button, Card, Badge, PageHero, …) with a barrel `index.ts` |
| `src/components/layout/` | App shell: Navbar, Footer, SkipToContentLink |
| `src/components/seo/` | JSON-LD structured data |
| `src/data/` | Typed static data (products, FAQ) |
| `src/hooks/` | `useScrolled`, `useScrollAnimation` |
| `src/i18n/` | `en.json`, `np.json`, `index.ts`, `ssgContext.tsx` (SSG layout wrapper) |
| `src/utils/` | `seoHelpers.tsx` (page head + structured data) |
| `src/routes.ts` | Single route manifest (see ADR-007) |
| `functions/api/contact.ts` | Cloudflare Pages Function for the contact form |
| `workers/contact-mailer/` | Mailer Worker (service-bound from the Function) |
| `scripts/` | Post-build: `inject-scripts.mjs`, `generate-sitemap.mjs`, `seo-report.mjs` |
| `public/` | Copied verbatim into `dist/` (robots.txt, `_redirects`, favicon, OG image) |
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD |

`src/components/sections/` and `src/lib/` exist as empty placeholders (`.gitkeep`).

---

## ADR-001: Build Strategy — SSG over SPA or SSR

**Status:** Decided

**Context:**
This site has 6 pages with static content: Home, About, Products, Services, Contact, FAQ. No user-specific data, no real-time information, no authentication. The contact form is the only dynamic element (handled server-side by a Cloudflare Pages Function).

**Options considered:**

| Option | Pros | Cons |
|--------|------|------|
| Pure SPA (no prerender) | Simplest build setup | Empty HTML shell hurts SEO; slow first paint |
| SSG (static pre-render) | SEO-ready HTML; fast TTFB from CDN; no server needed | i18n defaults to English in static HTML |
| SSR (server-rendered) | Dynamic per-request HTML | Requires persistent server; overkill for static content; higher cost/complexity |

**Decision: SSG**

Pre-render all 6 routes (plus the 404 page) to static HTML at build time. Deploy to Cloudflare Pages CDN. Each page URL produces a real HTML file (`/about` → `dist/about.html`) with all content visible to search engines and parseable without JavaScript.

**Implementation (confirmed working as of F-001):**
- `vite-plugin-ssg` v0.1.0 is confirmed compatible with Vite 5 + React 19 (requires React 19 for `react-dom/static`'s `prerenderToNodeStream` API — React 18 is NOT sufficient).
- Actual package API: exports `ssgPlugin` (not `ssg`). Scans `src/pages/` folder for files with a `ssgOptions` export.
- Each page component must export a `ssgOptions: SsgOptions` object (from `vite-plugin-ssg/utils`) with `slug`, `routeUrl`, `Head`, and `context`. The object **must** end with `};` (semicolon) — the plugin uses a regex to detect it.
- Slugs must NOT contain `/` (e.g., use `'about'` not `'about/index'`) — the plugin has a bug where subdirectory slugs cause a temp file write failure.
- Output: `dist/about.html`, `dist/products.html`, etc. (served at `/about`, `/products` on Cloudflare Pages). No `about/index.html` structure.
- ~~`public/_redirects` with `/* /index.html 200` provides SPA fallback.~~ Removed 2026-10-17: the catch-all served index.html with HTTP 200 for unknown URLs, which rendered React Router's default error screen. Every route is pre-rendered to its own `.html`, so no fallback is needed. `NotFoundPage` is pre-rendered to `dist/404.html`, which Cloudflare Pages serves with HTTP 404 for any unmatched path; App.tsx's `*` route renders the same page client-side.
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
Two animation libraries were considered: Motion (formerly Framer Motion) and pure CSS. `docs/FRONTEND-GUIDELINES.md` demands "high-impact page load with staggered reveals" and "scroll-triggering and hover states."

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

## ADR-005: Form Submission — Cloudflare Pages Function with Contact Mailer Worker

**Status:** Decided (supersedes the earlier Web3Forms design; Web3Forms is no longer used)

**Context:**
The contact form must send inquiry data to a single email inbox, with bot protection. Options: Cloudflare Pages Function calling a third-party form service (Web3Forms, Formspree), an email API (Resend, SendGrid), or Cloudflare's own `send_email` binding.

**Decision: Pages Function + Turnstile, delivering via a dedicated `contact-mailer` Worker**

```
Browser → POST /api/contact (JSON + Turnstile token)
         → functions/api/contact.ts (Pages Function)
              1. verify Turnstile token (siteverify, secret = TURNSTILE_SECRET_KEY)
              2. validate + trim fields
              3. CONTACT_MAILER.fetch(...)   ← service binding
         → workers/contact-mailer/src/index.js
              → env.CONTACT_EMAIL.send(...)  ← Cloudflare `send_email` binding
         → Email delivered to info@hooxygen.com.np
```

**`functions/api/contact.ts` responsibilities:**
1. Accept `POST` with `application/json` only (415 otherwise)
2. Verify the Turnstile token (403 if the bot check fails)
3. Validate required fields server-side (name, email, phone, company) and the email format
4. Trim inputs and build the normalized payload
5. Forward to the `CONTACT_MAILER` service binding (503 if not configured, 500 if delivery fails)
6. Return `{ success: true }` or `{ success: false, error: "..." }`

**Client:** `ContactPage.tsx` POSTs directly to `/api/contact`. There is no `src/lib/submitForm.ts` abstraction, and no direct-to-third-party fallback for local dev (use `npm run cf:dev` to run the Function locally).

**TypeScript note:** `functions/api/contact.ts` uses the Cloudflare Workers runtime, not the DOM. It needs `/// <reference types="@cloudflare/workers-types" />` at the top.

---

## ADR-006: Component Architecture — Layered, Page-Scoped

**Status:** Decided (revised: the originally planned `sections/` layer was not adopted; page sections live inside each page file)

**Context:**
React component organization patterns range from feature-based (one folder per feature), domain-based (one folder per domain entity), to layer-based (ui/layout/pages).

**Decision: Layer-based, with page-specific sections defined inside their page file**

```
pages/          → compose ui primitives + layout; page-specific sections are local components
ui/             → pure presentational, zero business logic
layout/         → app shell (Navbar, Footer)
seo/            → structured data
data/           → typed static data, no React
hooks/          → reusable stateful logic, no JSX
utils/          → pure helpers (SEO head generation)
```

**Rules:**
- `ui/` components accept only primitive props (strings, booleans, callbacks). They do not import from `data/`, `i18n/`, or `hooks/`.
- `pages/` components use `useTranslation()` and import from `ui/` and `data/`; each applies its head via `generatePageHead()`.
- No index barrel re-exports inside `pages/`; `ui/index.ts` is the only barrel file (for design system ergonomics).
- Extract a section into its own component file only once it is reused by a second page.

**Props pattern for UI components:** union-type variants rather than boolean flags (see `src/components/ui/Button.tsx`).

---

## ADR-007: Routing — Centralized Route Manifest

**Status:** Decided

**Context:**
`react-router-dom` v6 routes can be defined inline in JSX or via a central config object. The SSG plugin needs a list of routes to pre-render. These two concerns must stay in sync.

**Decision: Single `src/routes.ts` manifest consumed by both**

```ts
// src/routes.ts (abridged — see the file for the full list)
export const ROUTES = [
  { path: '/',         labelKey: 'nav.home',     component: lazy(() => import('./pages/HomePage')) },
  { path: '/services', labelKey: 'nav.services', component: lazy(() => import('./pages/ServicesPage')) },
  // /products, /about, /contact, /faq …
] as const;

export const ROUTE_PATHS = ROUTES.map((r) => r.path);
```

The 404 page is intentionally **not** in `ROUTES`: it is pre-rendered by SSG (`slug: '404'`) and matched by a catch-all `*` route in `App.tsx`, so it stays out of the Navbar and sitemap.

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

Per `docs/FRONTEND-GUIDELINES.md`:

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
Turnstile token present? ──► NO ──► show error status, stop
      │
     YES
      ▼
POST /api/contact (Cloudflare Pages Function)
      │
      ├── verify Turnstile token  ──► fail: 403
      ├── validate required fields + email format ──► fail: 400
      └── CONTACT_MAILER service binding ──► contact-mailer Worker
                                                └── send_email ──► inbox
      │
      ▼
  success? ──► show success status, reset form + Turnstile widget
  error?   ──► show error status, preserve form data, reset Turnstile widget
```

**Client submit handler (`src/pages/ContactPage.tsx`):**
```ts
const onSubmit = async (data: ContactFormData) => {
  if (!turnstileToken) {
    setStatus('error')
    return
  }
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, turnstileToken }),
    })
    if (res.ok) {
      setStatus('success')
      reset()
      setTurnstileToken(null)
      if (widgetRef.current) window.turnstile?.reset(widgetRef.current)
    } else {
      setStatus('error')
      if (widgetRef.current) window.turnstile?.reset(widgetRef.current)
    }
  } catch {
    setStatus('error')
  }
}
```

**Pages Function and mailer:** see ADR-005 and `functions/api/contact.ts`; the mailer Worker is `workers/contact-mailer/src/index.js`. Required config is listed in `runbooks/DEPLOY.md` (`TURNSTILE_SECRET_KEY`, `VITE_TURNSTILE_SITE_KEY`, `CONTACT_MAILER` binding).

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
      ├── actions/setup-node@v4 (Node 22.16.0)
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
- `TURNSTILE_SECRET_KEY` — Turnstile secret for server-side token verification
- Service binding `CONTACT_MAILER` → Worker `contact-mailer` (see `wrangler.toml`)
- Full list: `runbooks/DEPLOY.md`

**`public/_redirects`:** comment only — no `/* /index.html 200` catch-all (removed 2026-10-17), so Cloudflare Pages serves `dist/404.html` with HTTP 404 for unknown URLs.

**`public/robots.txt`:**
```
User-agent: *
Allow: /
Sitemap: https://hooxygen.com.np/sitemap.xml
```

**`public/sitemap.xml`:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://hooxygen.com.np/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>https://hooxygen.com.np/about</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://hooxygen.com.np/products</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://hooxygen.com.np/contact</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://hooxygen.com.np/faq</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
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

Removed: the per-feature (F-001 … F-014) file lists went stale as the code evolved. Use `git ls-files` for the current file set and `CHANGELOG.md` / `tasks/1-FEATURES.md` for feature history. See §3 for the top-level layout.

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
| Form submission fails due to CORS | Low | High | Cloudflare Pages Function runs same-origin; no CORS issue expected |
| SSG pre-render fails on dynamic components (tabs, accordion) | Medium | Medium | SSR-safe initial state: first tab shown by default; accordion all collapsed by default; no `window` access at render time |

---

*This document governs all architectural decisions for Phase 2 implementation. Any deviation from these decisions must be documented here with rationale before the code change is made.*

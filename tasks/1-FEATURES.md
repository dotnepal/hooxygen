# HO Oxygen — Feature Breakdown

**Status:** Phase 1 (Design/Mockup) ✓ Complete → Phase 2 (Implementation) in progress

---

## Wireframe Mockups

### Global Layout
```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR: Logo | Home | About | Products | Contact | FAQ | EN/NP │
├─────────────────────────────────────────────────────────────┤
│                        <PAGE CONTENT>                        │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ ┌──────────────────┬──────────────────┬───────────────────┐ │
│ │ LEFT             │ MIDDLE           │ RIGHT             │ │
│ │ FAQ              │ Privacy Policy   │ [Google Map]      │ │
│ │ Contact details  │ Terms of Service │                   │ │
│ │                  │ Sitemap          │                   │ │
│ └──────────────────┴──────────────────┴───────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Home Page
```
┌───────────────────────────────────────────────────────────┐
│ HERO (split: text left, image right)                       │
│  "Reliable Gas Supply for Medical & Industrial Use"        │
│  [Contact Us]  [Explore Products]                          │
├───────────────────────────────────────────────────────────┤
│ GAS HIGHLIGHTS — 3-col cards                               │
│  [Oxygen / Medical]  [Nitrogen / Industrial]  [Hydrogen]   │
├───────────────────────────────────────────────────────────┤
│ SERVICES STRIP — icon row                                  │
│  Rent | Sale | Refilling | Bulk Orders | Delivery          │
├───────────────────────────────────────────────────────────┤
│ TRUST GALLERY — 3 placeholder images                       │
│  "Certified. Safe. Trusted by Hospitals across Nepal."     │
├───────────────────────────────────────────────────────────┤
│ CTA BANNER — "Ready to place an order?" [Contact Us Now]   │
└───────────────────────────────────────────────────────────┘
```

### About Us Page
```
┌───────────────────────────────────────────────────────────┐
│ PAGE HERO: "About HO Oxygen"                          │
├───────────────────────────────────────────────────────────┤
│ STORY — text left, facility image right                    │
├───────────────────────────────────────────────────────────┤
│ TEAM — card grid (photo, name, role)                       │
├───────────────────────────────────────────────────────────┤
│ SERVICE AREAS — badge strip (Local | Regional | National)  │
├───────────────────────────────────────────────────────────┤
│ WHY CHOOSE US — 4-col icon grid                            │
│  Safety | Certified | Fast Delivery | 24/7 Support         │
└───────────────────────────────────────────────────────────┘
```

### Products/Services Page
```
┌───────────────────────────────────────────────────────────┐
│ PAGE HERO: "Our Products & Services"                       │
├───────────────────────────────────────────────────────────┤
│ GAS TABS: [Oxygen] [Nitrogen] [Hydrogen]                   │
│ Active tab shows:                                          │
│  - Description + use cases paragraph                       │
│  ┌──────┬──────────┬────────┬──────┬──────┬──────────┐    │
│  │ SIZE │ CAPACITY │ WEIGHT │ RENT │ SALE │ PRICING  │    │
│  │ S    │ 1.5 L    │ 3 kg   │  ✓   │  ✓   │ Contact  │    │
│  │ M    │ 5 L      │ 8 kg   │  ✓   │  ✓   │ Contact  │    │
│  │ L    │ 10 L     │ 15 kg  │  ✓   │  ✓   │ Contact  │    │
│  └──────┴──────────┴────────┴──────┴──────┴──────────┘    │
├───────────────────────────────────────────────────────────┤
│ SERVICES — 3-col cards                                     │
│  Refilling | Bulk Orders | Delivery (same-day / regional)  │
└───────────────────────────────────────────────────────────┘
```

### Contact Page
```
┌───────────────────────────────────────────────────────────┐
│ PAGE HERO: "Get In Touch"                                  │
├───────────────────────────────────────────────────────────┤
│ ┌──────────────────────────┬───────────────────────────┐  │
│ │ CONTACT FORM             │ CONTACT INFO + MAP        │  │
│ │ Name*                    │ 📞 Phone                  │  │
│ │ Email*                   │ 📧 Email                  │  │
│ │ Phone*                   │ 📍 Address                │  │
│ │ Company*                 │                           │  │
│ │ Gas Type (dropdown)      │ [Google Map Embed]        │  │
│ │ Requirement (drop)       │                           │  │
│ │ Message (optional)       │                           │  │
│ │ [Submit Inquiry]         │                           │  │
│ └──────────────────────────┴───────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### FAQ Page
```
┌───────────────────────────────────────────────────────────┐
│ PAGE HERO: "Frequently Asked Questions"                    │
├───────────────────────────────────────────────────────────┤
│ CATEGORY FILTER: [All] [Safety] [Ordering] [Delivery]      │
│                  [Rental] [Payment] [Emergency]            │
├───────────────────────────────────────────────────────────┤
│ ACCORDION                                                  │
│ ▶ What gases are available?                                │
│ ───────────────────────────────────────────────────────   │
│ ▼ How do I place an order?                                 │
│   Expanded answer text...                                  │
│ ───────────────────────────────────────────────────────   │
│ ▶ What are delivery timeframes?                            │
└───────────────────────────────────────────────────────────┘
```

---

## Feature Tasks

### F-001: Project Scaffolding ✓ COMPLETE (2026-03-27)
- [x] Init React 19 + Vite 5 + TypeScript (manual scaffold — directory was non-empty)
- [x] Install & configure Tailwind CSS v4 with brand color tokens (`@theme` in `src/index.css`)
- [x] Set up folder structure: `src/components/`, `src/pages/`, `src/i18n/`, `src/data/`, `src/hooks/`
- [x] Configure `vite.config.ts` with `vite-plugin-ssg` (`ssgPlugin`, pages scan `src/pages/`)
- [x] Add Cloudflare Pages config (`public/_redirects`, `wrangler.toml` skeleton)
- [x] Set up ESLint + Prettier (0 errors, 0 warnings)
> Notes: React upgraded to v19 (required by vite-plugin-ssg's `prerenderToNodeStream`). Vite pinned to 5.4.21, @vitejs/plugin-react pinned to 4.3.4. SSG slugs must be flat (no `/`). ssgOptions must close with `};`.

### F-002: i18n (EN/NP Language Toggle) ✓ COMPLETE (2026-03-27)
- [x] Install `react-i18next` + `i18next` + `i18next-browser-languagedetector`
- [x] Create `src/i18n/en.json` with all English strings (nav, home, about, products, contact, faq, footer, common)
- [x] Create `src/i18n/np.json` with all Nepali strings (full Devanagari translations)
- [x] Language toggle button (`src/components/ui/LanguageToggle.tsx`) — persists to localStorage via `ho-gas-lang` key
- [x] HomePage text wrapped in `t()` calls; all other pages ready (stubs resolved in their respective F-tasks)
- [x] `<html lang>` attribute synced to active language via `useEffect` in `RootLayout`
- [x] SSG static prerender fixed with `I18nextProvider` wrapper (`src/i18n/ssgContext.tsx`) — `t()` resolves to English during build
> Notes: Translations bundled into JS (no HTTP fetch). Language detection order: localStorage → navigator. Key `ho-gas-lang` in localStorage. LanguageToggle component ready for Navbar (F-004).

### F-003: Design System / Theme ✓ COMPLETE (2026-03-27)
- [x] Tailwind config: brand tokens in `src/index.css` `@theme` — `brand-blue`, `brand-light`, `brand-dark`, `brand-accent`, `brand-steel`
- [x] Font pair: Sora (display) + DM Sans (body) via Google Fonts `<link preconnect>` in `index.html`
- [x] CSS variables in `src/index.css` — shadows, radii, keyframes, `animate-on-scroll`
- [x] `Button.tsx` — primary/secondary/outline/ghost variants; sm/md/lg sizes; polymorphic (`as="a"` for links)
- [x] `Card.tsx` — white card with brand shadow; optional hover-lift (`hover` prop); `as` prop for semantic elements; `flush` prop for full-bleed content
- [x] `Badge.tsx` — pill component; default/primary/outline/success/warning variants; `interactive` prop renders as `<button>` with `aria-pressed`
- [x] `SectionHeader.tsx` — h2 + accent bar + optional eyebrow label + optional subtitle; left/center/right alignment
- [x] `PageHero.tsx` — full-width page banner; brand-dark → brand-blue gradient; dot-grid texture; radial glow; diagonal clip-path bottom edge
- [x] `src/components/ui/index.ts` — barrel export for clean imports
- [x] `HomePage.tsx` updated to use all components as live smoke test (hero, gas cards, services strip, CTA banner)
> Notes: SSG scanner uses regex requiring `ssgOptions` to close with `};` (semicolon on own line). All pages updated to use `withI18nProvider` in SSG context.

### F-004: Navbar & Header ✓ COMPLETE (2026-03-27)
- [x] Fixed navbar (`position: fixed; top: 0; z-50`) — transparent at rest (over hero), `bg-white shadow-nav` on scroll via `useScrolled` hook
- [x] Logo: SVG cylinder icon + "HO" (brand-blue) + "Oxygen" (brand-dark) — links to home; white variant when navbar is transparent
- [x] Desktop nav links via `NavLink` (react-router-dom) — animated underline on hover; active link shows full underline + brand-blue color; white when transparent
- [x] Mobile hamburger button (`aria-expanded`, `aria-controls`) → slide-in drawer from right (width 72/288px)
- [x] Drawer: backdrop overlay, close button, focus trap (Tab cycles within), ESC key closes, body scroll lock
- [x] `LanguageToggle` wired in both desktop right-side and drawer footer; adapts to transparent/solid state
- [x] `src/hooks/useScrolled.ts` — passive scroll listener, initialises on mount; guards no-op state updates
- [x] Hero pages extend behind transparent navbar (no spacer div); hero content padding (`pt-24`) clears navbar height
> Notes: Navbar transparent mode: logo/links/CTA all white. On scroll past 20px: switches to white bg + shadow. `Logo` extracted as reusable sub-component with `transparent` prop. `Button` has `white-outline` variant for transparent CTA. `useScrolled` uses functional updater to skip re-renders when scroll boolean unchanged.

### F-005: Footer ✓ COMPLETE (2026-03-27)
- [x] 3-column grid layout
  - Left: Logo, contact details (phone, email, address)
  - Middle: Legal links (Privacy, Terms, Sitemap) + Quick Links (FAQ, Contact, Products)
  - Right: Google Map iframe embed (Kathmandu, Nepal)
- [x] Mobile: 3-col → stacked single column
- [x] Copyright line with year interpolation (`{{year}}`)
> Notes: Footer uses `bg-brand-dark` with white text. Logo uses white/accent variant for dark bg. Map iframe uses no-API-key embed URL for Kathmandu. Reuses `contact.info.*` i18n keys for phone/email/address to avoid duplication.

### F-006: Home Page ✓ COMPLETE (2026-03-27)
- [x] Hero section: tagline, sub-copy, two CTAs (`/contact`, `/products`), hero image
- [x] Gas highlights: 3 cards (Oxygen, Nitrogen, Hydrogen) with icon + desc + "Learn More"
- [x] Services strip: icon row (Rent, Sale, Refilling, Bulk Orders, Delivery)
- [x] Trust gallery: 3 placeholder images + credibility tagline
- [x] Bottom CTA banner
> Notes: HomeHero uses split 2-col layout (hidden on mobile), gradient bg + dot-grid + radial glow. GasHighlights uses inline SVG GAS_ICONS constant (O₂/N₂/H₂). ServicesStrip uses emoji badges in brand-light bg. TrustGallery uses `Card flush hover as="figure"` pattern for edge-to-edge images. CTABanner uses white Button on gradient bg.

### F-007: About Us Page ✓ COMPLETE (2026-03-27)
- [x] Page hero banner
- [x] Company story section (2-col: text + facility image)
- [x] Team cards grid (photo, name, role) — 3–4 placeholder members
- [x] Service area badges (Local / Regional / National)
- [x] "Why Choose Us" 4-col icon grid
> Notes: Reuses `PageHero` component. CompanyStory hides facility image on mobile (`hidden lg:block`). TEAM_MEMBERS is a static module-level constant (not i18n — proper nouns). ServiceAreas reuses Badge `variant="primary"` with emoji. WHY_US_ICONS constant follows GAS_ICONS pattern. Background alternation: gradient → white → brand-light → white → brand-light.

### F-008: Products/Services Page ✓ COMPLETE (2026-03-27)
- [x] Tab bar (Oxygen | Nitrogen | Hydrogen) with animated underline
- [x] Per-tab: description + use cases list
- [x] Cylinder table from `src/data/products.ts`: Size, Capacity, Weight, Rent ✓/✗, Sale ✓/✗, Pricing
- [x] `src/data/products.ts` typed data for all 3 gas types
- [x] Services section: 3 cards (Refilling, Bulk Orders, Delivery)
> Notes: Tab bar uses `role="tablist/tab/tabpanel"` ARIA pattern with `useState<GasKey>`. Table wrapped in `overflow-x-auto` for mobile. Pricing cells use `Button as="a" href="/contact" variant="outline" size="sm"`. Use cases in static data constant (English-only, not i18n). Added `products.{oxygen|nitrogen|hydrogen}.desc` keys to both locale files.

### F-009: Contact Page ✓ COMPLETE (2026-03-27)
- [x] Contact form (`react-hook-form`): Name*, Email*, Phone*, Company*, Gas Type, Requirement, Message
- [x] Client-side validation with inline error messages
- [x] Form submission via Cloudflare Pages Function (Web3Forms as fallback)
- [x] Success / error toast notification
- [x] Contact info sidebar (phone, email, address)
- [x] Google Map embed iframe
> Notes: Shared `inputClass(hasError)` helper for consistent field styling. Split layout `lg:grid-cols-[3fr_2fr]`. Status managed with `useState<'idle'|'success'|'error'>`. Select dropdowns for Gas Type and Requirement share a 2-col grid on sm+. Map reuses same Kathmandu embed URL as Footer.

### F-010: FAQ Page ✓ COMPLETE (2026-03-27)
- [x] FAQ data in `src/data/faq.ts`: `{ question, answer, category }[]`
- [x] Category filter pills (All | Safety | Ordering | Delivery | Rental | Payment | Emergency)
- [x] Accordion with smooth height animation
- [x] Reactive filter on category click
> Notes: 12 FAQ items across all 6 categories (2 per category). Accordion uses CSS `grid-template-rows: 0fr→1fr` transition (no JS height measurement, works without `display:none`). Single-open pattern (only one item open at a time). Category change keeps accordion closed. `Badge interactive` renders as `<button aria-pressed>` for accessibility.

### F-015: Main Navigation Menu (CLAUDE.md §3.1) ✓ COMPLETE (2026-03-27)
> Tracks the **business spec** for section 3.1 "Main Navigation Menu (Standard)". Technical infrastructure (fixed bar, mobile drawer, scroll shadow, focus trap) is covered by F-004. This task tracks the five named pages and any remaining nav-level UX polish.

**Navigation links — all 5 required destinations:**
- [x] Home (`/`) — landing page with overview
- [x] About Us (`/about`) — company information, mission, and team
- [x] Products/Services (`/products`) — gas types and ordering options
- [x] Contact (`/contact`) — contact form and inquiry
- [x] FAQ (`/faq`) — frequently asked questions, accordion style

**Language toggle (EN/NP):**
- [x] Visible in desktop nav (right side of bar)
- [x] Visible in mobile drawer footer
- [x] Persists selection to `localStorage` key `ho-gas-lang`
- [x] `<html lang>` attribute updates to `en` / `ne` on toggle

**Active-link visual feedback:**
- [x] Active page link shows full brand-blue underline + brand-blue text (desktop)
- [x] Active page link shows brand-light background + brand-blue text (mobile drawer)

**Remaining enhancements:**
- [x] "Contact Us" CTA button in desktop navbar (right of nav links, before language toggle) — `hidden md:inline-flex` so mobile drawer is unaffected
- [x] Skip-to-content link (`#main-content`) visible on keyboard focus — already in `App.tsx` via `sr-only focus:not-sr-only`

> **Dependency:** F-004 (Navbar & Header) delivers the infrastructure. F-015 tracks the business spec requirements from CLAUDE.md §3.1.

### F-011: Accessibility & SEO ✓ COMPLETE (2026-03-27)
- [x] ARIA labels on all interactive elements
- [x] WCAG 4.5:1 contrast verified — all brand color pairs pass AA; brand-dark/blue on white exceed AAA (7:1+)
- [x] `<meta>` tags per page (title, description, OG)
- [x] Semantic HTML throughout — `<main>`, `<section aria-label>`, `<aside>`, `<article>`, `<figure>`, `role="tablist/tab/tabpanel"`, `role="region"`, `role="alert"` audited across all pages
- [x] `alt` text on all images — all `<img>` tags carry descriptive alt text; decorative SVGs use `aria-hidden="true"`
- [x] `lang` attribute switches with i18n (`en` / `ne`)
- [x] `public/robots.txt` — corrected domain to `hooxygen.com.np`; `public/sitemap.xml` created with all 5 routes and priorities

### F-012: Animations & Polish ✓ COMPLETE (2026-03-27)
- [x] Scroll-triggered fade-in + slide-up — `useScrollAnimation` hook (`src/hooks/useScrollAnimation.ts`) uses IntersectionObserver; CSS `fadeSlideUp` keyframe; applied to all sections in Home, About, Products pages; respects `prefers-reduced-motion`
- [x] Staggered card entrance — `useScrollAnimation({ stagger: N })` queries `.animate-on-scroll` children and applies incremental `animation-delay` (80–120 ms per index); applied to gas cards, service cards, team cards, trust gallery, service area badges
- [x] Hover lift on cards (`translateY(-4px)`) — `Card` component `hover` prop; applied to gas highlight cards, trust gallery, team cards, why-choose-us grid, products services cards
- [x] Smooth page transition (fade) — `pageFadeIn` CSS keyframe; `.page-transition` class added to `<main>` in all 5 pages; triggers on every route change (component remount)
- [x] Accordion height transition (no `display:none`) — CSS `grid-template-rows: 0fr→1fr` (done in F-010)
- [x] Navbar shadow on scroll — `useScrolled` hook + `shadow-nav` token (done in F-004)

### F-013: Responsive Design ✓ COMPLETE (2026-03-27)
- [x] Mobile-first breakpoints (sm:640, md:768, lg:1024, xl:1280)
- [x] Cylinder table → card stack on mobile — `md:hidden` card list / `hidden md:block` table dual render; each card shows size badge, capacity, weight, availability pills, contact CTA
- [x] Footer 3-col → stacked on mobile (done in F-005)
- [x] Hero 2-col → stacked on mobile (done in F-006/F-007 via `hidden lg:block`)
- [x] Touch targets min 44×44px (Button/Badge/LanguageToggle all have `min-h-[44px] min-w-[44px]`)

### F-014: Deployment Setup ✓ COMPLETE (2026-03-28)
- [x] `public/_redirects`: `/* /index.html 200`
- [x] `wrangler.toml` skeleton
- [x] GitHub Actions: `.github/workflows/deploy.yml` — build on PRs, deploy to Cloudflare Pages on push to `main`
- [x] `VITE_FORM_ENDPOINT=/api/contact` injected as build-time env var in the workflow
- [x] Verify clean `dist/` build output (`npm run build` passes, SSG generates all pages)
> Notes: Two GitHub secrets required (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`). `WEB3FORMS_KEY` is a runtime secret set in CF Pages dashboard (never in GH secrets). Full deployment runbook in `runbooks/DEPLOY.md`. Build job runs on all PRs as CI check; deploy job runs only on push to `main`.

---

## Implementation Order
1. F-001 → F-002 → F-003 (foundation)
2. F-004 → F-005 (shell)
3. F-006 → F-007 → F-008 → F-009 → F-010 (pages)
4. F-011 → F-012 → F-013 (polish)
5. F-014 (deploy)

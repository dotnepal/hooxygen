# Changelog

All notable changes to the HO Oxygen website are recorded here in reverse-chronological order.

---

## 2026-04-14 — Post-launch cleanup: legal links removed, mobile nav trimmed, WCAG 2.2 SC 1.4.3 fully resolved

### Legal links removed from footer

**Affected files:** `src/components/layout/Footer.tsx`, `src/i18n/en.json`, `src/i18n/np.json`

- Removed Privacy Policy, Terms of Service, and Sitemap links from the footer middle column
- Removed the "Legal" section heading
- Middle column now contains only Quick Links (Services, Contact, Products)
- Removed `footer.links.privacy`, `footer.links.terms`, `footer.links.sitemap`, and `footer.legal.title` i18n keys from both language files

### Mobile nav trimmed

**Affected file:** `src/components/layout/Navbar.tsx`

- Removed "Contact Us" CTA button from the mobile dropdown panel
- Removed Language toggle from the mobile dropdown panel
- The Language toggle remains visible in the desktop header bar (all screen sizes)

### WCAG 2.2 SC 1.4.3 — All contrast failures resolved

Full audit performed across all pages and components. Two rounds of fixes applied.

**Round 1 fixes:**
- `ContactPage.tsx` — Required field `*` indicator: `text-brand-accent` → `text-red-600` (3.68:1 → 4.63:1)
- `ContactPage.tsx` — Placeholder text: `placeholder:text-gray-400` → `placeholder:text-gray-600` (2.54:1 → 6.93:1)
- `ServicesPage.tsx` — CTA subtitle on brand-light bg: `text-brand-steel` → `text-brand-dark` (4.37:1 → 11.50:1)
- `ProductsPage.tsx` — Services section desc on brand-light bg: `text-brand-steel` → `text-brand-dark` (4.37:1 → 11.50:1)
- `ProductsPage.tsx` — Unavailable badges: `text-gray-400` → `text-gray-600` (2.31:1 → 6.32:1)

**Round 2 fixes (comprehensive audit):**
- `SectionHeader.tsx` — Eyebrow label (text-xs): `text-brand-accent` → `text-brand-blue` (3.68:1 → 8.72:1)
- `ProductsPage.tsx` — Desktop table ✗ marks: `text-gray-300` → `text-gray-600` (1.47:1 → 6.61:1)
- `Footer.tsx` — Copyright text: `text-white/50` → `text-white/60` (4.14:1 → 5.25:1)
- `PageHero.tsx` — Gradient: removed `brand-accent 100%` stop (even pure white failed on brand-accent at 3.68:1); gradient now ends at `brand-blue 100%` — white/75 subtitle now 5.64:1 ✓
- `HomePage.tsx` — HomeHero gradient: same fix as PageHero
- `HomePage.tsx` — CTA button: `text-brand-blue` on teal bg → `text-white` (1.59:1 → 4.98:1)

---

## 2026-03-30 — CLAUDE.md stale spec fixes + typo corrections

### Stale content corrected

- **§2.1 Gas Types** — Added Carbon Dioxide (CO₂) and Argon (Ar) to the list (was 3 gases, now correctly shows all 5)
- **§2.3 Product Display** — Removed `Weight` from display fields; weight column was removed from the Products page UI in a prior session
- **§4.1 Contact Methods** — Removed "Email address display"; email is temporarily hidden until correct address is confirmed
- **§5.1 Imagery** — Removed "Team Photos"; team section was removed from the About page

### Typos fixed

- §10.3 heading: "Self-Improvemennt" → "Self-Improvement"
- §10.4: "behaviro" → "behavior"
- §11: "chagne" → "change", "root cuases" → "root causes"

---

## 2026-03-30 — UI Cleanup: WhyChooseUs moved, FAQ hidden, email hidden, flag icons

### WhyChooseUs moved: About → Services page

**From:** `src/pages/AboutPage.tsx`
**To:** `src/pages/ServicesPage.tsx`

- `WHY_US_ICONS` constant (4 SVG icons: safety, certified, delivery, support) moved to ServicesPage
- `WhyChooseUs` component function moved to ServicesPage
- `<WhyChooseUs />` placed after the CTA Banner section, before `</main>` (between CTA and footer)
- Section uses `bg-white` background (CTA uses `bg-brand-light`, so alternation is maintained)
- `Card` removed from AboutPage imports (no longer used there)
- AboutPage bundle: 5.14 kB → 2.67 kB; ServicesPage bundle: 4.67 kB → 7.13 kB

### FAQ hidden from navigation and footer

**Navbar** (`src/components/layout/Navbar.tsx`):
- Both desktop pill links and mobile dropdown links now filter out `/faq` via `.filter((route) => route.path !== '/faq')`
- FAQ page remains fully routable at `/faq` — only hidden from nav UI

**Footer** (`src/components/layout/Footer.tsx`):
- Removed `<FooterLink to="/faq">` from Quick Links section

### Email hidden from all pages

Email `info@hogasfactory.com.np` temporarily hidden until updated with correct address.

- **Footer**: removed `<ContactItem icon={EmailIcon} ...>` email row from contact details
- **ContactPage** (`src/pages/ContactPage.tsx`): removed email entry from the contact info items array
- i18n keys (`contact.info.email`, `contact.info.emailValue`) retained — not deleted, just not rendered

### Flag icons added to LanguageToggle

**File:** `src/components/ui/LanguageToggle.tsx`

Button now shows flag emoji before the language code:
- Switching to Nepali: `🇳🇵 NP`
- Switching to English: `🇬🇧 EN`

Flag emoji is wrapped in `aria-hidden="true"` span so screen readers use only the existing `aria-label` ("Switch to Nepali" / "Switch to English"), not the emoji character name.

---

## 2026-03-30 — Remove TeamGrid from AboutPage

### `TEAM_MEMBERS` data + `TeamGrid` section removed from About page

**Affected file:** `src/pages/AboutPage.tsx`

**What was removed:**
- `TEAM_MEMBERS` constant (4 placeholder team member entries with name, role, photo)
- `TeamGrid` component function (team member photo card grid, `bg-brand-light` section)
- `<TeamGrid />` usage in `AboutPage`

**What remains on About page:** Hero → Company Story → Service Areas → Why Choose Us

**i18n keys:** `about.team.title` key remains in `en.json` / `np.json` — unused but retained (cleanup not requested).

**Build result:** `AboutPage` bundle shrank from 6.53 kB → 5.14 kB. All 6 static pages prerendered successfully.

---

## 2026-03-29 — Bug Fixes: Gas Icons + Products Weight Column

### Bug Fix: Wrong SVG icon text for CO₂ and Argon

**Affected file:** `src/pages/HomePage.tsx` (GAS_ICONS constant)

**Root cause:** `carbondioxide` and `argon` icon entries were copy-pasted from the `hydrogen` entry. The key names were updated but the `<text>` content inside the SVG was left as `H₂` for both.

**Fix applied:**
- `carbondioxide` icon: `H₂` → `CO₂`, `fontSize` reduced `16` → `13` (longer symbol needs smaller font to fit inside 36px-diameter circle)
- `argon` icon: `H₂` → `Ar` (fontSize unchanged at `16`)

**Note:** TypeScript cannot catch this — the bug is a visual/content issue, not a type error. Requires browser visual QA.

**Spec file:** `docs/4-FIX-GAS-ICONS-REMOVE-WEIGHT.md`

### Bug Fix: `weight` column removed from Products page

**Affected file:** `src/pages/ProductsPage.tsx`

**Root cause:** The `weight` column was added during initial scaffolding. Per spec §2.3, the listed display fields are: Capacity, Rent, Sale, Pricing. Weight is not in the spec.

**Changes:**
- **Desktop table header:** Removed `'weight'` from columns array
- **Desktop table body:** Removed `<td>{row.weight}</td>` cell
- **Mobile card view:** Removed the weight label + value `<div>` block

**Not changed:** `weight` field remains in `src/data/products.ts` `CylinderRow` type and data (data layer untouched). `"weight"` translation keys in `en.json` / `np.json` retained (unused but harmless).

**New products table columns:** Size | Capacity | Rent | Sale | Pricing

---

## 2026-03-28 — F-014 Deploy + F-016 Services Page + Bug Fixes

### F-014: Deployment Setup

**Files added:**
- `.github/workflows/deploy.yml` — CI/CD pipeline: build job on all PRs (CI check), deploy job on push to `main`
- `runbooks/DEPLOY.md` — deployment runbook (secrets, env vars, manual deploy, rollback procedure)

**Workflow behavior:**
- Build job: `npm ci` → `npm run build` (with `VITE_FORM_ENDPOINT=/api/contact`) → uploads `dist/` artifact
- Deploy job: downloads artifact → `wrangler pages deploy dist --project-name=ho-gas-factory`

**Required setup (one-time):**
- `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` → GitHub repo secrets

### F-016: Standard Main Menu & Services Page

**New page added:**
- `src/pages/ServicesPage.tsx` — Dedicated Services page with 6 service cards (Rent, Sale, Refilling, Bulk, Delivery, Pickup) + CTA section

**Navbar redesigned:**
- Desktop: pill-style navigation links (rounded buttons, active state highlight)
- Mobile: compact dropdown menu (not drawer)
- "Services" menu item added to navigation

**Route added:**
- `/services` → ServicesPage (lazy loaded)
- `src/routes.ts` updated with Services entry

**i18n updated:**
- `src/i18n/en.json` — added full `services` namespace (hero, 6 service descriptions, CTA)
- `src/i18n/np.json` — Nepali translations for all services content

**sitemap.xml updated:** Now covers 6 routes (/, /about, /products, /services, /contact, /faq)

**New task files:**
- `tasks/3-STANDARD-MENUS.md` — F-016 specification and implementation notes
- `tasks/FIX-INTERSECTION-OBSERVER.md` — Root cause analysis and fix documentation

### Bug Fix: IntersectionObserver — Text Invisible

**Affected files:** `src/hooks/useScrollAnimation.ts`, `src/index.css`

**Root causes (two independent bugs):**
1. React re-renders (triggered by i18next language detection) overwrote `className` prop, wiping the `is-visible` class from DOM elements
2. `threshold: 0.12` (12% visibility) was too high for tall stacked containers on mobile

**Fixes applied:**
1. Changed `classList.add('is-visible')` → `dataset.visible = '1'` (data attributes survive React reconciliation)
2. CSS selector updated from `.animate-on-scroll.is-visible` → `.animate-on-scroll[data-visible]`
3. `threshold: 0.12` → `threshold: 0` (fire on any pixel intersection)
4. `rootMargin: -40px` → `rootMargin: '0px 0px -60px 0px'` (ensures element is meaningfully in view)

### Corrections to Earlier Sections (applied in CLAUDE.md)

- **Runtime** — React 18 → React 19 (v19.2.4) throughout
- **Navigation** — Services page (`/services`) added as 6th route
- **Page Wireframes** — Services row added
- **Repository Contents** — sitemap.xml covers 6 routes; `src/pages/` includes `ServicesPage.tsx`

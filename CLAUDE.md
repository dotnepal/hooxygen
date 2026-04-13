**Date:** March 30, 2026

**Project:** Informational Website for Gas Refilling Factory

**Purpose:** Build brand trust, showcase services, and generate sales leads

**Current State:** Phase 2 COMPLETE — F-001 through F-016 complete (including F-014 Deploy). All pages live, CI/CD pipeline wired. Post-launch cleanup in progress. Ready for Phase 3 (backend integration / production launch).

**Repository Contents (as of 2026-03-30):**
- `CLAUDE.md` — project specification and workflow rules (this file)
- `CHANGELOG.md` — full history of changes, bug fixes, and feature completions
- `tasks/1-FEATURES.md` — feature breakdown with ASCII wireframes and task items (F-001 to F-016, all complete)
- `tasks/DEPLOY.md` — deployment specification and runbook (secrets, env vars, manual deploy, rollback)
- `.github/workflows/deploy.yml` — GitHub Actions CI/CD (build on PRs, deploy to CF Pages on main)
- `tasks/ARCHITECTURE-DECISION.md` — detailed architecture and system design decisions
- `tasks/lessons.md` — lessons learned during implementation
- `docs/1-INITIAL-SPECIFICATION.md` — full original specification document
- `docs/SKILLS.md` — frontend aesthetic guidelines (fonts, motion, spatial composition)
- `docs/4-FIX-GAS-ICONS-REMOVE-WEIGHT.md` — spec + root cause analysis for gas icon and weight column fixes
- `package.json`, `vite.config.ts`, `tsconfig.json` — build configuration
- `index.html` — entry HTML with Google Fonts preconnect
- `src/main.tsx` — React 19 entry point
- `src/App.tsx` — root router with RootLayout (Navbar + Footer + Suspense)
- `src/index.css` — Tailwind v4 @theme brand tokens + global styles
- `src/routes.ts` — route definitions for react-router-dom v6
- `src/pages/` — HomePage, AboutPage, ProductsPage, ContactPage, FAQPage, ServicesPage (all complete)
- `src/components/layout/` — Navbar.tsx (transparent hero mode + white-on-scroll), Footer.tsx
- `src/components/ui/` — Button (white-outline variant added), Card, Badge, PageHero, SectionHeader, LanguageToggle, index.ts
- `src/hooks/useScrolled.ts` — scroll detection hook
- `src/hooks/useScrollAnimation.ts` — IntersectionObserver hook for scroll-triggered animations (stagger support)
- `src/i18n/` — en.json, np.json, index.ts, ssgContext.tsx
- `src/data/` — products.ts (cylinder data for all 5 gas types), faq.ts (12 FAQ items)
- `public/robots.txt` — crawl rules pointing to sitemap
- `public/sitemap.xml` — all 6 routes with priorities
- `functions/api/contact.ts` — Cloudflare Pages Function for form submission
- `public/_redirects` — SPA routing rule for Cloudflare Pages
- `wrangler.toml` — Cloudflare Pages config skeleton

**Decisions:**
- Color palette: Blue & White
- Framework: React + Vite (SSG)
- Deployment: Cloudflare pages
- Website Language: EN/NP toggle
- Accessibility: WCAG 4.5:1 contrast + ARIA labels
- Images: placeholder.com (via `https://placehold.co/WxH`)
- Pages: Home, About, Products, Services, Contact, FAQ (accordion style; FAQ hidden from nav)

---
## Tech Stack (Confirmed & Locked)
- **Runtime:** React 19 + TypeScript
- **Build:** Vite 5 + SSG prerender (verify `vite-plugin-ssg` compatibility; fallback to custom `prerender.ts` script using `renderToString` if package is unmaintained)
- **Styling:** Tailwind CSS v4 with CSS-native `@theme` config (brand tokens in `src/index.css`, not `tailwind.config.ts`)
- **Fonts:** Sora 400/600/700 (display) + DM Sans 400/500/700 (body) — loaded via Google Fonts `<link preconnect>` in `index.html`
- **Routing:** react-router-dom v6 with `createBrowserRouter`
- **i18n:** react-i18next + i18next + i18next-browser-languagedetector (EN/NP toggle, persisted to localStorage, translations bundled into JS — no HTTP fetch)
- **Forms:** react-hook-form (client-side validation with inline errors)
- **Animations:** Motion library (React, formerly Framer Motion) — used selectively for hero staggered reveal and page transitions only; CSS `@keyframes` + Intersection Observer for scroll-triggered effects
- **Hosting:** Cloudflare Pages (with Pages Functions at `functions/api/contact.ts` for form submission)
- **Form Fallback:** Web3Forms API (used when Cloudflare Pages Function env var is not configured)

## Tailwind v4 Note
Tailwind v4 does NOT use `tailwind.config.ts`. Brand tokens are defined using `@theme` directive in `src/index.css`:
```css
@import "tailwindcss";
@theme {
  --color-brand-blue: #1E40AF;
  --color-brand-light: #EFF6FF;
  --color-brand-dark: #1E3A5F;
  --color-brand-accent: #3B82F6;
  --font-display: "Sora", sans-serif;
  --font-body: "DM Sans", sans-serif;
}
```

---
## Page Wireframes (Summary)
See `tasks/1-FEATURES.md` for full ASCII wireframes.

**Global layout:** Sticky Navbar → Page Content → 3-col Footer (Contact | Links | Map)

| Page | Key Sections |
|------|-------------|
| Home | Hero split, Gas highlights 3-col, Services strip, Trust gallery, CTA banner |
| About | Story 2-col, Service area badges |
| Products | Gas type tabs (Oxygen/Nitrogen/Hydrogen/CO₂/Argon), Cylinder table (Size/Capacity/Rent/Sale/Pricing), Services 3-col |
| Services | 6 service cards (Rent/Sale/Refilling/Bulk/Delivery/Pickup), CTA banner, Why-us 4-col |
| Contact | Split: Form left + Info+Map right (phone + address; email hidden) |
| FAQ | Category filter pills + Accordion (page accessible at /faq but hidden from nav) |

---
## Footer Section
- It has 3 sections (left, middle, right)

### Left
    - Contact details (phone + address; email hidden until corrected)
### Middle
    - privacy
    - terms
    - sitemap
### Right
    - Google map on the right side

---
## 1. Website Overview

### 1.1 Purpose & Goals

- **Primary Purpose:** Informational website
- **Key Objectives:**
    - Build brand trust with customers
    - Showcase services and capabilities
    - Generate leads for sales inquiries

### 1.2 Target Audience

- Hospitals and medical facilities
- Clinics and homecare providers
- Industrial users
- Laboratories
- All customer types (no segmentation needed)

### 1.3 Tone & Brand Voice

- Professional
- Friendly and approachable
- Trustworthy and reliable
- Safety-conscious

---

## 2. Products & Services

### 2.1 Gas Types Offered

1. **Oxygen Gas** (Primary - Medical use)
2. **Nitrogen Gas**
3. **Hydrogen Gas**
4. **Carbon Dioxide (CO₂)**
5. **Argon (Ar)**

### 2.2 Product Organization

- **Structure:** Gas Type → Cylinder Sizes
- **Cylinder Capacity Range:** Small to highest capacities (medical purpose)
- **Sizes:** Standard sizes only (no custom orders)

### 2.3 Product Display Information (Per Cylinder)

For each cylinder size, display:

- **Capacity:** In liters
- **Description:** Brief description of the cylinder/use case
- **Availability Indicators:**
    - Available for Rent (✓ or ✗)
    - Available for Sale (✓ or ✗)
- **Pricing:** “Contact for pricing” (no actual prices displayed)

### 2.4 Services Offered

1. **Gas Cylinders** - Available for rent and sale
2. **Cylinder Refilling** - Refill existing cylinders
3. **Bulk Orders** - Large volume orders
4. **Delivery Options:**
- Same-day delivery (local region)
- Few days delivery (regional and national areas)
1. **Pickup:** Customer pickup available at facility

---

## 3. Website Structure & Pages

### 3.1 Main Navigation Menu (Standard)

1. **Home** - Landing page with overview
2. **Services** - Service offerings overview
3. **Products** - Gas types and cylinder details
4. **About Us** - Company information, mission, and service areas
5. **Contact** - Contact form and inquiry

> **Note:** FAQ page exists at `/faq` but is hidden from the main nav and footer links. Accessible via direct URL.

### 3.2 Page Descriptions

### Home Page

- Hero section with company tagline/value proposition
- Brief introduction to services
- Call-to-action buttons (Contact Us, Explore Products)
- Highlights of key services
- Trust-building elements (facility/team photos)

### About Us Page

- Company history and mission
- Facility photos/images
- Service areas coverage (local, regional, national)

> **Note:** Team member section and Why Choose Us removed/relocated. Why Choose Us is now on the Services page.

### Products/Services Page

- **Gas Types Section:**
    - Organized tabs or sections for each gas type (Oxygen, Nitrogen, Hydrogen)
    - For each gas type:
        - Description of the gas and its uses
        - List of available cylinder sizes
        - Cylinder details table (Capacity, Rent availability, Sale availability, Pricing CTA)
- **Services Section:**
    - Cylinder refilling services
    - Bulk order capabilities
    - Delivery and pickup options
    - Service area coverage

### Contact Page

- **Contact Form with fields:**
    - Name (required)
    - Email (required)
    - Phone (required)
    - Company Name (required)
    - Gas Type of Interest (dropdown: Oxygen, Nitrogen, Hydrogen, Other)
    - Requirement Type (dropdown: Rent, Sale, Both)
    - Message/Additional Details (optional)
- **Contact Information Display:**
    - Phone number
    - Physical address
    - Google map
    - *(Email address hidden until correct address is confirmed)*
- **Form Submission:** All inquiries go to single email inbox

### FAQ Page

- **Common Questions to Address:**
    - Gas safety and handling
    - Ordering process and how to place an order
    - Delivery timeframes and coverage areas
    - Rental vs. purchase options
    - Refilling services and frequency
    - Payment and billing
    - Emergency support availability
    - Product specifications and certifications (to be detailed later)

---

## 4. Contact & Lead Generation

### 4.1 Lead Capture

- **Contact Form Fields:**
    - Name
    - Email
    - Phone
    - Company Name
    - Gas Type of Interest
    - Rent/Sale Preference
    - Message (optional)

### 4.1 Contact Methods

- Contact form (primary lead capture)
- Phone number display
- Single inbox for all inquiries
- *(Email address display temporarily hidden until correct address is confirmed)*

---

## 5. Visual Content

### 5.1 Imagery

- **Facility Photos:** Production and storage areas
- **Product Photos:** Cylinder samples (different sizes)
- **Safety/Professional Images:** As needed for credibility

### 5.2 Content Not Included (For Now)

- Technical specification PDFs
- Detailed purity level information
- Company statistics/metrics
- Blog or news section

---

## 6. Future Considerations (To Brainstorm Later)

- Purity level information for each gas type
- Industry certifications and compliance details (ISO, medical certifications, safety standards)
- Technical specifications and downloadable documents
- Customer testimonials or case studies
- Advanced features (inventory tracking, real-time stock, customer accounts)

---

## 7. Design & Development Notes

### 7.1 Design Approach

- Clean, professional layout
- Mobile-responsive design
- Trust-building visual hierarchy
- Easy navigation
- Clear call-to-action elements

**Instruction to coding agent**:

- Always delegate task to subagent
- After every feature is complete, always ensure that `npm run build` is not broken.
- Always run `npm run build` to verify that build is not broken. 
- Elaborate your answer. 
- After successful completion, wait for input for next feature.

### 7.2 Technology Stack (CONFIRMED — See "Tech Stack" section above)

- **Frontend:** React 19 + TypeScript + Vite 5 + SSG prerender
- **Styling:** Tailwind CSS v4 (CSS-native @theme config)
- **Hosting:** Cloudflare Pages
- **Email/Form:** Cloudflare Pages Functions (`functions/api/contact.ts`) with Web3Forms fallback
- **Domain/SSL:** Cloudflare (managed via `wrangler.toml`)

### 7.3 Accessibility & SEO

- Mobile-friendly design first
- Fast loading times
- Clear metadata and SEO optimization
- Accessible color contrast and font sizing
- Proper heading hierarchy

---

## 8. Development Phases

**Phase 1:** Design mockups and approval — ✓ COMPLETE (2026-03-27)
**Phase 2:** Frontend development — ✓ COMPLETE (2026-03-28)
  - F-001 through F-016 all complete — scaffolding, i18n, design system, navbar, footer, all 6 pages, accessibility, animations, responsive design, CI/CD
  - F-014 ✓ COMPLETE — `.github/workflows/deploy.yml` (build on PRs, deploy to CF Pages on main push); `VITE_FORM_ENDPOINT=/api/contact` injected at build time; deployment runbook at `tasks/DEPLOY.md`
  - Architecture decisions documented in `tasks/ARCHITECTURE-DECISION.md`
**Phase 3:** Backend integration (contact form, email notifications)
**Phase 4:** Testing and QA
**Phase 5:** Deployment and launch
**Phase 6:** Post-launch optimizations and updates

---

## 9. Changelog

See `CHANGELOG.md` for the full history of changes, bug fixes, and feature completions.

---

## 10. Workflow Orchestration

### 10.1 Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 10.2 Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution

### 10.3 Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 10.4 Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 10.5 Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 10.6 Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

### 10.7 Task Management
1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Result**: Add review section to `tasks/todo.md`
5. **Capture Lessons**: Update `tasks/lessons.md` after corrections

---

## 11. Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

---

## 12. Claude Model usage

- Use model Sonnet for code writes
- Use model Haiku for quick tasks, answers
- Use model opusplan for complex logic reasoning

---

## 13. Tooling for shell interactions
- Is it about finding FILES? use 'fd'
- Is it about finding TEXT/strings? use 'rg'
- Is it about finding CODE STRUCTURE? use 'ast-grep'
- Is it about SELECTING from multiple results? pipe to 'fzf'
- Is it about interacting with JSON? use 'jq'
- Is it about interacting with YAML or XML? use 'yq'


*This specification document outlines the complete plan for the gas factory website. Any updates or changes should be documented and approved before implementation.*

---


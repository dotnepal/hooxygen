# F-016 — Standard Main Menu & Footer Visibility

**Status:** COMPLETE ✓ — Implemented & verified 2026-03-28
**Date:** 2026-03-28
**Scope:** Navbar redesign (pills + dropdown) + Services route + footer on all pages

---

## 1. Overview & Goals

Replace the current underline-style desktop navigation and full-screen slide-in mobile drawer with:

- **Desktop (md+):** Pills/tabs-style navigation where the active page is highlighted with a filled pill background
- **Mobile (<md):** Compact dropdown panel that drops below the navbar (not a full-screen drawer)
- **Menu items:** Home, Services, Products, About Us, Contact, FAQ (6 items)
- **Always visible:** Navbar and Footer render on every page — homepage AND inner pages

### What changes
| Area | Before | After |
|------|--------|-------|
| Desktop nav style | Underline animation | Filled pill background |
| Mobile nav style | Full-screen slide-in drawer (w-72, h-full) | Compact dropdown below navbar |
| Menu items | Home, About, Products, Contact, FAQ | Home, Services, Products, About Us, Contact, FAQ |
| Services route | Does not exist | New `/services` page |
| "About" label | "About" | "About Us" |
| Footer | Already on all pages | No change (confirmed correct) |

### What does NOT change
- Navbar transparent mode on homepage hero (white text on transparent bg when at top)
- Navbar solid mode after scrolling 20px (white bg, dark text)
- Logo component and its transparent/solid theming
- Language toggle (LanguageToggle)
- Desktop CTA button ("Contact Us")
- Footer structure and content
- All existing pages (Home, About, Products, Contact, FAQ)
- Routing infrastructure (react-router-dom v6, ROUTES as source of truth)

---

## 2. Menu Items & Route Mapping

Final primary navigation menu (in display order):

| # | Label (EN) | Label (NP) | Path | Action Required |
|---|-----------|-----------|------|----------------|
| 1 | Home | गृह पृष्ठ | `/` | Keep, no change |
| 2 | Services | सेवाहरू | `/services` | **New route + page** |
| 3 | Products | उत्पादनहरू | `/products` | Keep, no change |
| 4 | About Us | हाम्रो बारेमा | `/about` | i18n label rename only |
| 5 | Contact | सम्पर्क | `/contact` | Keep, no change |
| 6 | FAQ | सामान्य प्रश्नहरू | `/faq` | Keep, no change |

---

## 3. Desktop Pills Design Spec

### Visual Design

```
[ Logo ]  [ Home ] [ Services ] [● Products ●] [ About Us ] [ Contact ] [ FAQ ]  [ Contact Us btn ] [ EN/NP ]
           (inactive)  (inactive)   (ACTIVE pill)   (inactive)   (inactive)  (inactive)
```

**Active pill** (solid navbar mode):
- Background: `bg-brand-blue` (#1E40AF)
- Text: `text-white`
- Shape: `rounded-full`
- Padding: `px-4 py-1.5`

**Inactive pill** (solid navbar mode):
- Background: transparent
- Text: `text-brand-dark`
- Hover: `hover:bg-brand-light hover:text-brand-blue`
- Shape: `rounded-full`
- Padding: `px-4 py-1.5`

**Active pill** (transparent hero mode — at top of homepage):
- Background: `bg-white/20`
- Text: `text-white`
- Shape: `rounded-full`
- Padding: `px-4 py-1.5`

**Inactive pill** (transparent hero mode):
- Background: transparent
- Text: `text-white/80`
- Hover: `hover:bg-white/15 hover:text-white`
- Shape: `rounded-full`
- Padding: `px-4 py-1.5`

**Container:**
- `flex items-center gap-1` (tight gap — pills are visually grouped)
- Font: `font-body font-medium text-sm`
- Transition: `transition-colors duration-200`

### DesktopNavLink Component Changes

Replace the current `after:` pseudo-element underline approach with a direct background + text color approach:

```tsx
// BEFORE (underline style)
'relative font-body font-medium text-sm transition-colors duration-200 pb-0.5',
'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-200',
transparent
  ? isActive ? 'text-white after:w-full after:bg-white' : '...'
  : isActive ? 'text-brand-blue after:w-full after:bg-brand-blue' : '...'

// AFTER (pill style)
'font-body font-medium text-sm rounded-full px-4 py-1.5 transition-colors duration-200',
transparent
  ? isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/15 hover:text-white'
  : isActive ? 'bg-brand-blue text-white' : 'text-brand-dark hover:bg-brand-light hover:text-brand-blue'
```

---

## 4. Mobile Dropdown Design Spec

### Visual Design

```
┌─────────────────────────────────────────────────┐
│ [Logo]                           [EN/NP] [☰]    │  ← navbar bar (h-16)
├─────────────────────────────────────────────────┤
│ Home                                            │  ↑
│ Services                                        │  dropdown panel
│ Products                                        │  drops down from
│ About Us                                        │  bottom of navbar
│ Contact                                         │
│ FAQ                                             │
│ ─────────────────────────────────────────────── │
│ [        Contact Us         ]  [EN/NP]          │  ↓
└─────────────────────────────────────────────────┘
[semi-transparent backdrop behind rest of page]
```

### Dropdown Panel Properties

```
position: absolute
top: 100% (flush with bottom of navbar)
left: 0, right: 0 (full width)
background: white
shadow: shadow-lg
border-radius: bottom corners rounded-b-xl
z-index: z-50 (same as navbar)
```

### Animation

Slide down from navbar bottom edge:
- Hidden: `opacity-0 -translate-y-2 pointer-events-none`
- Visible: `opacity-100 translate-y-0 pointer-events-auto`
- Timing: `transition-all duration-200 ease-out`

### Mobile Nav Link Style

Each link in the dropdown:
- **Active:** `bg-brand-light text-brand-blue font-semibold` with `rounded-lg`
- **Inactive:** `text-brand-dark hover:bg-brand-light/70 hover:text-brand-blue` with `rounded-lg`
- Padding: `px-5 py-3`
- Full width block

### Dropdown Footer (inside panel)

Below the links, a divider + CTA + language toggle row:
```
─────────────────────────────────────────────
[ Contact Us ]    [ EN/NP toggle ]
```

### Accessibility

Keep from current implementation:
- `aria-expanded` on hamburger button
- `aria-controls="mobile-dropdown"` on hamburger button
- `id="mobile-dropdown"` on panel
- `aria-label="Navigation menu"` on panel
- ESC key closes dropdown + returns focus to hamburger

Remove from current drawer (not needed for small dropdown):
- Focus trap (Tab cycling inside panel)
- `document.body.style.overflow` body scroll lock
- `role="dialog"` + `aria-modal="true"` (not a modal, just a panel)
- Backdrop click to close: **KEEP** (still good UX)

---

## 5. New Services Page Spec

### Route
- Path: `/services`
- Lazy-loaded (same pattern as other pages)
- Added to `ROUTES` in `src/routes.ts`

### Page Content (stub — full content TBD)

The ServicesPage should display:
- PageHero with title "Our Services" and subtitle describing what HO Oxygen offers
- 3-col service cards (same pattern as Home page services strip):
  1. **Gas Cylinder Rental** — Flexible rental options for short and long-term needs
  2. **Gas Cylinder Sales** — Purchase cylinders outright for permanent use
  3. **Cylinder Refilling** — Fast and safe refilling of existing cylinders
  4. **Bulk Orders** — Large-volume supply for hospitals and industrial clients
  5. **Same-Day Delivery** — Local delivery within the Kathmandu valley
  6. **Customer Pickup** — Pickup available at our facility
- A CTA section: "Ready to order? Contact us today." with a Contact Us button

### i18n Keys Needed (en.json + np.json)
```json
"services": {
  "hero": {
    "title": "Our Services",
    "subtitle": "Comprehensive gas supply solutions for medical and industrial needs."
  },
  "rent": { "title": "Cylinder Rental", "desc": "Flexible short and long-term rental options." },
  "sale": { "title": "Cylinder Sales", "desc": "Purchase cylinders for permanent ownership." },
  "refilling": { "title": "Cylinder Refilling", "desc": "Fast, safe refilling of your existing cylinders." },
  "bulk": { "title": "Bulk Orders", "desc": "High-volume supply for hospitals and industry." },
  "delivery": { "title": "Same-Day Delivery", "desc": "Local delivery within the Kathmandu valley." },
  "pickup": { "title": "Customer Pickup", "desc": "Pick up directly at our facility anytime." }
}
```

---

## 6. i18n Changes

### src/i18n/en.json

```json
// Change:
"nav": {
  "home": "Home",
  "about": "About",        // ← change to "About Us"
  "products": "Products",
  "contact": "Contact",
  "faq": "FAQ",
  "language": "NP",
  "services": "Services"   // ← add this
}
```

### src/i18n/np.json

Same structure changes:
```json
"nav": {
  "about": "हाम्रो बारेमा",   // ← update
  "services": "सेवाहरू"       // ← add
}
```

---

## 7. Footer Visibility Confirmation

The footer is already included in `RootLayout` inside `src/App.tsx`:

```tsx
// src/App.tsx — RootLayout (already implemented)
function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />   ← renders on ALL pages automatically
    </>
  )
}
```

**No changes needed.** Footer renders on all pages including inner pages.

**Minor addition:** Add a "Services" link to the footer's Quick Links section in `Footer.tsx`:
```tsx
<FooterLink to="/services">{t('nav.services')}</FooterLink>
```

---

## 8. Files to Create / Modify

| File | Change Type | Description |
|------|-------------|-------------|
| `src/components/layout/Navbar.tsx` | Modify | Desktop pills + mobile dropdown |
| `src/routes.ts` | Modify | Add `/services` route |
| `src/pages/ServicesPage.tsx` | **Create** | New page stub |
| `src/i18n/en.json` | Modify | Add `nav.services`, update `nav.about`, add services section keys |
| `src/i18n/np.json` | Modify | Same changes in Nepali |
| `src/components/layout/Footer.tsx` | Modify | Add Services to Quick Links |

---

## 9. Step-by-Step Implementation Tasks

### Step 1 — i18n updates
- [x] In `src/i18n/en.json`: add `nav.services = "Services"`, change `nav.about = "About Us"`, add `services.*` keys
- [x] In `src/i18n/np.json`: mirror the same additions/changes

### Step 2 — Add Services route
- [x] In `src/routes.ts`: insert Services entry between Home and Products
- [x] Verify ROUTE_PATHS and RoutePath type auto-derive `/services`

### Step 3 — Create ServicesPage
- [x] Create `src/pages/ServicesPage.tsx` with PageHero + 6 service cards + CTA
- [x] Use existing `Card`, `SectionHeader`, `PageHero`, `Button` UI components
- [x] Use `useScrollAnimation` hook for scroll-triggered card reveal
- [x] Add i18n keys via `useTranslation()`
- [x] Added `ssgOptions` with correct semicolon terminator (SSG scanner requires `\n};` pattern)

### Step 4 — Desktop pills (Navbar.tsx)
- [x] Rewrite `DesktopNavLink` component: remove `after:` pseudo-element underline logic
- [x] Apply pill bg/text classes based on `isActive` + `transparent` props
- [x] Change `ul` container gap from `gap-8` → `gap-1`

### Step 5 — Mobile dropdown (Navbar.tsx)
- [x] Remove: drawer panel (fixed, h-full, slide-in)
- [x] Remove: `drawerRef`, focus-trap `useEffect`, body scroll lock `useEffect`
- [x] Add: dropdown panel below navbar (`absolute top-full left-0 right-0 bg-white shadow-lg`)
- [x] Add: slide-down CSS transition (opacity + translate-y)
- [x] Add: Contact Us button + Language Toggle row at bottom of dropdown
- [x] Keep: `isOpen` state, `hamburgerRef`, ESC key handler, `aria-expanded`, `aria-controls`
- [x] Keep: backdrop overlay with click-to-close (simplified, no backdrop-blur)

### Step 6 — Footer Services link
- [x] In `Footer.tsx` Quick Links section: added Services link

### Step 7 — Build & verify
- [x] Run `npm run build` — zero TS errors, zero build warnings ✓
- [x] All 6 pages pre-rendered by SSG: index, about, products, contact, faq, services ✓
- [x] `dist/services.html` generated successfully

---

## 10. Acceptance Criteria

- [x] Desktop nav shows 6 pill-shaped items; active page pill is filled (brand-blue bg on solid mode)
- [x] Desktop transparent mode (homepage hero): pills use white/translucent styling
- [x] Mobile hamburger opens a compact dropdown below the navbar (not full-screen)
- [x] Mobile dropdown includes all 6 nav links + Contact Us CTA
- [x] Mobile dropdown closes on: link click, ESC key, backdrop click
- [x] `/services` route loads ServicesPage without errors
- [x] "About Us" label appears in nav (not "About")
- [x] Footer renders on homepage AND all inner pages
- [x] Footer Quick Links includes Services link
- [x] `npm run build` succeeds with zero errors

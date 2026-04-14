# Lessons Learned

## L-001: vite-plugin-ssg scanner requires `ssgOptions` to close with `};`

**Pattern:** Every page that exports `ssgOptions` MUST end the object literal with `};` (semicolon on its own line). The scanner uses the regex:
```
/export\s+const\s+ssgOptions\s*(?::\s*\w+)?\s*=\s*\{([\s\S]*?)\n\};/
```
If the closing is just `}` (no semicolon), the page is silently skipped: `[SSG] Skipping <file>.tsx (no ssgOptions export)`.

**Symptom:** Build succeeds and the page JS is bundled, but the static HTML is NOT prerendered and `index.html` remains as a bare SPA shell.

**Fix:** Always close ssgOptions with `};` not `}`:
```ts
export const ssgOptions: SsgOptions = {
  slug: 'index',
  ...
  context: async (children) => { ... },
};  // ← semicolon required
```

**Discovered during:** F-003 when HomePage.tsx grew complex enough that the missing `;` became visible.

---

## L-002: Team member names and placeholder content belong in data constants, not i18n

**Pattern:** Proper nouns (people's names, job titles, hardcoded facts like "Since 2005") live as module-level constants in the page file — never in `en.json` / `np.json`.

**Why:** i18n is for UI labels and body copy that genuinely change between locales. Names like "Ram Prasad Shrestha" do not translate. Putting them in i18n creates meaningless duplicate keys in both locale files and pollutes the namespace.

**How to apply:**
```ts
// ✅ Correct — static module-level constant
const TEAM_MEMBERS = [
  { name: 'Ram Prasad Shrestha', role: 'Founder & Managing Director', photo: '...' },
] as const

// ❌ Wrong — don't put proper nouns in i18n
// "about.team.member1.name": "Ram Prasad Shrestha"
```

Apply this rule to: team members, service area emoji icons, gas use-case lists (English placeholder), hardcoded business facts.

**Discovered during:** F-007 About Page team grid design.

---

## L-003: `Card flush` pattern for image-first cards — don't re-add `overflow-hidden`

**Pattern:** `Card` already includes `overflow-hidden` in its base class. Adding `className="overflow-hidden"` is redundant and adds a no-op class.

**How to apply:**
```tsx
// ✅ Correct
<Card flush hover as="article">
  <img className="w-full h-48 object-cover" ... />
  <div className="p-5">...</div>
</Card>

// ❌ Wrong — overflow-hidden already in Card base
<Card flush hover as="article" className="overflow-hidden">
```

**Rule:** Use `flush` to remove default `p-6` when an image must bleed to the card edge. Apply inner padding (`p-5`) on a child `<div>` below the image.

**Discovered during:** F-006 TrustGallery and F-007 TeamGrid implementation.

---

## L-004: Plan section background alternation before writing any component

**Pattern:** Every page must alternate: `gradient hero → bg-white → bg-brand-light → bg-white → bg-brand-light → gradient CTA`. Adjacent sections with the same background visually merge.

**How to apply:** Before writing the first section of a new page, write down the bg sequence:
```
PageHero         → gradient (internal)
Section 2        → bg-white
Section 3        → bg-brand-light (via style={{ background: 'var(--color-brand-light)' }})
Section 4        → bg-white
Section 5        → bg-brand-light
CTABanner        → gradient dark
```

**Rule:** `bg-brand-light` sections use inline `style` (not Tailwind class) since it references a CSS variable. `bg-white` sections use the Tailwind class directly.

**Discovered during:** F-007 About Page — 5 sections needed careful alternation planning.

---

## L-005: `hidden lg:block` is the correct breakpoint for 2-col layout images

**Pattern:** For text+image 2-col layouts, always hide the image on mobile with `hidden lg:block`, not `hidden sm:block` or `hidden md:block`.

**Why:** At `sm` (640px) and `md` (768px) the grid is still 1-col (stacked), so showing the image just makes it full-width below the text. The image is only useful at `lg` (1024px+) when the 2-col grid is active.

**How to apply:**
```tsx
// ✅ Correct
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  <div>{ /* text */ }</div>
  <div className="hidden lg:block">
    <img ... />
  </div>
</div>
```

**Discovered during:** F-006 HomeHero and F-007 CompanyStory — same pattern applied consistently.

---

## L-006: Inline SVG icons — always define as module-level constants before component functions

**Pattern:** Define all icon sets as a `const NAME_ICONS = { key: (<svg .../>), ... }` object at module level, above all function declarations.

**Why:** Inline SVG inside `map()` renders creates a new JSX object on every render pass and makes the icon set hard to update. Module-level constants are stable references and immediately visible for maintenance.

**How to apply:**
```ts
// ✅ Correct — module level, before any function
const GAS_ICONS = {
  oxygen: (
    <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
      ...
    </svg>
  ),
} as const

// ✅ Consistent icon container in JSX
<div className="p-3 rounded-xl bg-brand-light text-brand-blue">
  {GAS_ICONS[gas]}
</div>
```

**Rules:**
- Always `aria-hidden="true"` on the `<svg>`
- Always `className="w-10 h-10"` for standard icon size
- Icon container: `p-3 rounded-xl bg-brand-light text-brand-blue` — consistent across all pages

**Discovered during:** F-006 GasHighlights, F-007 WhyChooseUs — same pattern both times.

---

## L-007: SSG StaticRouter location must exactly match the page's routeUrl

**Pattern:** The `context` function in `ssgOptions` must pass the exact `routeUrl` string to `StaticRouter location`:

```ts
// ✅ Correct — location matches routeUrl
export const ssgOptions: SsgOptions = {
  slug: 'about',
  routeUrl: '/about',
  context: async (children) => {
    const { StaticRouter } = await import('react-router-dom/server')
    const { withI18nProvider } = await import('../i18n/ssgContext')
    return withI18nProvider(<StaticRouter location="/about">{children}</StaticRouter>)
  },
};

// ❌ Wrong — mismatched location
// routeUrl: '/about', but location="/"
```

**Why:** `NavLink` uses the router context to determine `isActive`. A mismatch causes the wrong nav link to appear active in the prerendered static HTML (wrong underline/color in SSG output).

**Rule:** Always copy the `context` block from an existing stub and change only the `location` string. Never write it from scratch.

**Discovered during:** F-004 Navbar active-link testing during SSG prerender verification.

---

## L-008: SVG icon text content is not type-checked — requires visual QA

**Pattern:** When building `GAS_ICONS` (or any SVG icon map) by copy-paste, the `<text>` content inside the SVG is a plain string. TypeScript validates the object's keys and shape, but never the string values.

**Why this matters:** Copying the `hydrogen` icon entry and only renaming the key will silently leave `H₂` as the displayed text for `carbondioxide` and `argon`. The bug is invisible in code review and only appears when rendered in a browser.

**How to apply:**
- After adding any new icon entry, open the browser and visually confirm the correct chemical formula renders
- Checklist when copy-pasting icons: (1) key name, (2) `<text>` content, (3) `fontSize` (longer symbols like `CO₂` need a smaller size, e.g. `13` vs `16`)

**Discovered during:** Post-Phase-2 bug fix (2026-03-29) — `carbondioxide` and `argon` icons both showed `H₂`.

---

## L-009: Cross-reference rendered columns against CLAUDE.md §2.3 before shipping

**Pattern:** Scaffold code often includes more data fields than the spec requires. The `weight` column was added during initial `ProductsPage` scaffolding but is not listed in §2.3 (Product Display Information).

**How to apply:** Before marking any data-display feature done, open CLAUDE.md §2.3 and verify each rendered column/field appears in the spec. Remove anything not explicitly listed.

**Discovered during:** Post-Phase-2 bug fix (2026-03-29) — weight column appeared in Products table but was never part of the spec.

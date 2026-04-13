# Fix: SSGLayout — Navbar Missing in Build Version

**Status:** ✓ FIXED (2026-03-28)
**Affected files:** `src/i18n/ssgContext.tsx`, all 6 page files in `src/pages/`

---

## Symptom

`npm run dev` showed the Navbar (menu) on every page correctly.
`npm run build && npm run preview` generated pages with **no Navbar at all** — the menu was completely absent from the pre-rendered HTML. It only appeared after the JavaScript bundle loaded and React mounted the full app.

---

## Root Cause

### How vite-plugin-ssg renders pages

`vite-plugin-ssg` scans `src/pages/` for files that export a `ssgOptions` object. For each page, it calls `ssgOptions.context(pageComponent)` and passes the result to `renderToString()`. The `children` argument is the page component itself (e.g. `<HomePage />`).

Before the fix, every page's `context()` was:

```tsx
context: async (children) => {
  const { StaticRouter } = await import('react-router-dom/server')
  const { withI18nProvider } = await import('../i18n/ssgContext')
  return withI18nProvider(<StaticRouter location="/">{children}</StaticRouter>)
},
```

This produced the following SSG render tree:

```
I18nextProvider
  StaticRouter (location="/")
    <HomePage />       ← only the page component
```

### Where Navbar lives

`Navbar` (and `Footer`) live inside `RootLayout` in `App.tsx`:

```tsx
// App.tsx — only runs at runtime via main.tsx
function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />    ← page component rendered here
      <Footer />
    </>
  )
}
```

`App.tsx` is **never executed during SSG**. It only runs when `main.tsx` loads in the browser. The SSG build knows nothing about `App.tsx` or `RootLayout`.

### What dist/ HTML actually contained (before fix)

```html
<!-- index.html — no <nav>, no <header>, no <footer> -->
<div id="root">
  <!-- page content only -->
  <main>...</main>
</div>
```

The Navbar existed only in the JavaScript bundle. Visitors on slow connections or with JS disabled saw no navigation at all. Even with JS enabled, there was a flash of no-navbar content before React mounted.

---

## The Fix

### Step 1 — Added `withSSGLayout` to `src/i18n/ssgContext.tsx`

A new async helper that dynamically imports `Navbar` and `Footer` and wraps them around the page content, mirroring what `RootLayout` does at runtime:

```tsx
export async function withSSGLayout(children: ReactNode, routeUrl: string): Promise<ReactNode> {
  const { StaticRouter } = await import('react-router-dom/server')
  const { default: Navbar } = await import('../components/layout/Navbar')
  const { default: Footer } = await import('../components/layout/Footer')

  return (
    <I18nextProvider i18n={i18n}>
      <StaticRouter location={routeUrl}>
        <a href="#main-content" className="sr-only ...">Skip to content</a>
        <Navbar />
        {children}
        <Footer />
      </StaticRouter>
    </I18nextProvider>
  )
}
```

Key design decisions:
- **Dynamic imports** for Navbar/Footer prevent circular dependency issues (pages → ssgContext → layout → pages)
- **`StaticRouter location={routeUrl}`** ensures `NavLink` active-link highlighting is correct in the pre-rendered HTML — the correct nav item is highlighted for each page without JavaScript
- **`I18nextProvider`** wraps everything so `useTranslation()` works inside Navbar/Footer during SSG (always resolves to English, since no browser APIs available in Node.js)
- **Skip link** matches `App.tsx`'s `RootLayout` skip link so the DOM structure is consistent

### Step 2 — Updated all 6 pages to use `withSSGLayout`

Each page's `context()` was updated from the old pattern to:

```tsx
context: async (children) => {
  const { withSSGLayout } = await import('../i18n/ssgContext')
  return withSSGLayout(children, '/about')  // routeUrl matches the page
},
```

Pages updated:
- `src/pages/HomePage.tsx` → `withSSGLayout(children, '/')`
- `src/pages/AboutPage.tsx` → `withSSGLayout(children, '/about')`
- `src/pages/ProductsPage.tsx` → `withSSGLayout(children, '/products')`
- `src/pages/ServicesPage.tsx` → `withSSGLayout(children, '/services')`
- `src/pages/ContactPage.tsx` → `withSSGLayout(children, '/contact')`
- `src/pages/FAQPage.tsx` → `withSSGLayout(children, '/faq')`

### What dist/ HTML now contains (after fix)

```html
<!-- index.html — now has full layout -->
<div id="root">
  <a href="#main-content" class="sr-only ...">Skip to content</a>
  <header>
    <nav aria-label="Main navigation">
      <!-- Logo, nav links (Home active on /, etc), CTA, LanguageToggle -->
    </nav>
  </header>
  <main>
    <!-- page content -->
  </main>
  <footer>
    <!-- footer with links, map -->
  </footer>
</div>
```

---

## Secondary Benefit: Correct Active Nav Link in Static HTML

Because `StaticRouter location={routeUrl}` passes the exact page URL, `NavLink` components in the Navbar compute `isActive` correctly during SSG. The active page's nav link shows the highlighted/active style even before JavaScript loads.

Before fix: No Navbar at all in static HTML.
After fix: Navbar present with correct active link per page.

---

## Verification

Confirmed by grepping the build output:

```bash
grep 'aria-label="Main navigation"' dist/index.html dist/about.html
# → aria-label="Main navigation" (appears in both files)
```

Build passes clean (`npm run build` exits 0, all 6 pages generated).

---

## Runtime Behavior After Fix

After the browser loads the page:

1. **Pre-JS (SSG HTML):** Full Navbar visible, correct active link, English text
2. **JS loads:** `main.tsx` → `createRoot(rootElement).render(<App />)` → React replaces the SSG HTML with a fresh client render
3. **Post-JS:** Navbar re-renders via `RootLayout`. Functionally identical to SSG HTML. Language may switch if user has stored Nepali in localStorage (see `tasks/5-FIX-i18n.md`)

### Why `createRoot` (not `hydrateRoot`) is used

`main.tsx` uses `createRoot`, not `hydrateRoot`. This means React performs a full client-side re-render, discarding the SSG HTML entirely. This is intentional: because i18n language detection runs client-side (from localStorage), the SSG HTML is always English regardless of user preference. Attempting to `hydrateRoot` would produce constant hydration mismatch warnings.

The SSG HTML's purpose is to:
- Provide fast initial paint (content visible before JS loads)
- Provide crawlable HTML for search engines and link previews
- Not intended for React hydration (it's replaced on mount)

---

## Files Modified

| File | Change |
|------|--------|
| `src/i18n/ssgContext.tsx` | Added `withSSGLayout` async helper |
| `src/pages/HomePage.tsx` | `context()` uses `withSSGLayout(children, '/')` |
| `src/pages/AboutPage.tsx` | `context()` uses `withSSGLayout(children, '/about')` |
| `src/pages/ProductsPage.tsx` | `context()` uses `withSSGLayout(children, '/products')` |
| `src/pages/ServicesPage.tsx` | `context()` uses `withSSGLayout(children, '/services')` |
| `src/pages/ContactPage.tsx` | `context()` uses `withSSGLayout(children, '/contact')` |
| `src/pages/FAQPage.tsx` | `context()` uses `withSSGLayout(children, '/faq')` |

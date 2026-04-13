# Fix Plan: NP/EN Language Toggle Broken in Build

**Status:** ✓ FIXED (2026-03-28)
**Affected files changed:** `src/i18n/index.ts`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `vite.config.ts`, `scripts/inject-scripts.mjs`, `package.json`

---

## Bug 0 — Newly Discovered Root Cause (supersedes Bug 1 & 2 in severity)

### vite-plugin-ssg Overwrites dist/index.html — Removing the JS Bundle Reference

`vite build` first generates a `dist/index.html` that contains:
```html
<script type="module" crossorigin src="/assets/index-{hash}.js"></script>
```

`vite-plugin-ssg` then **overwrites** `dist/index.html` (and generates `dist/about.html`, etc.) using its own HTML template. That template does **not** include a `<script>` tag referencing the main JS bundle.

**Effect:** React never loads. Every page in `dist/` is pure static HTML. No JavaScript runs at all — the language toggle button renders (from SSG HTML) but clicking it does nothing. Same for the mobile menu, FAQ accordion, contact form, and all other interactive elements.

**Why invisible in `npm run dev`:** Dev mode never runs the SSG build; Vite serves the live React app directly.

### Fix — Post-build Script: `scripts/inject-scripts.mjs`

After `vite build` completes, a Node.js script:
1. Scans `dist/assets/` for `index-*.js` (the hashed main bundle)
2. Constructs `<script type="module" crossorigin src="/assets/index-{hash}.js"></script>`
3. Injects it before `</body>` in every `dist/*.html` file

`package.json` build script updated:
```
"build": "tsc -b && vite build && node scripts/inject-scripts.mjs"
```

**Note on Fix 3 (blocking script injection):** The `index.html` is NOT used by `vite-plugin-ssg` for HTML output — the plugin generates its own HTML. The blocking script is injected via `config.html.headTags` in `vite.config.ts`. This ensures all 6 pre-rendered pages in `dist/` contain the script. Verified with `grep` on all 6 `dist/*.html` files.

---

## Observed Symptom

`npm run dev` — language toggle works correctly. Switching to Nepali shows Nepali text; the preference persists across navigation.

`npm run build && npm run preview` — language toggle is broken:
- If a user has previously stored `ho-gas-lang=ne` in localStorage, the page **flashes English text** on every load before switching to Nepali. The toggle button visually jumps from "NP" → "EN".
- First-time users (no localStorage) may see English only — toggle appears to do nothing, or Nepali loads a beat late.
- The experience looks like the toggle is unreliable or broken.

---

## Root Cause Analysis

There are **two independent bugs** that combine to produce the broken behaviour.

---

### Bug 1 — `i18n.init()` Promise Is Not Awaited Before React Renders

**File:** `src/i18n/index.ts` and `src/main.tsx`

In `src/i18n/index.ts`:

```ts
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({ ... })   // ← returns a Promise, but nothing awaits it
```

In `src/main.tsx`:

```ts
import './i18n'    // triggers i18n.init() — fire-and-forget
import App from './App'

createRoot(rootElement).render(
  <StrictMode><App /></StrictMode>  // React renders IMMEDIATELY
)
```

`i18n.init()` returns a `Promise<TFunction>`. Even though `LanguageDetector` reads from `localStorage` synchronously, the Promise itself resolves via the **microtask queue**. In JavaScript the microtask queue runs _after_ the current synchronous execution stack completes.

The execution order in the production bundle:

```
1. [sync]  i18n module evaluates → i18n.init() called → Promise queued to microtask queue
2. [sync]  main.tsx evaluates  → createRoot.render() called → React schedules render
3. [micro] i18n init Promise resolves → i18n.language correctly set (e.g. 'ne')
4. [task]  React performs actual render — but i18n.language was already read in step 2
           and the component tree was committed before step 3
```

**Result:** On first render, `i18n.language` is `'en'` (the fallback, before `LanguageDetector` has resolved). React commits the English tree to the DOM. When the microtask resolves in step 3, `initReactI18next` triggers a re-render — but by then the English content has already been painted.

**Why this is invisible in `npm run dev`:**

In Vite dev mode, modules are loaded via individual HTTP requests. The browser's network I/O introduces natural async gaps between module evaluations. By the time `main.tsx` is evaluated and `createRoot.render()` is called, the earlier `import './i18n'` has had enough time for its microtask to resolve. In the production bundle, all modules are concatenated into one JS file and evaluated synchronously with no gaps.

---

### Bug 2 — SSG Pre-renders in English; `createRoot` Discards the HTML on Every Load

**File:** `src/i18n/ssgContext.tsx` (root limitation, not a code error)

The SSG build runs in **Node.js**, where `localStorage` and `navigator` do not exist. `LanguageDetector` silently falls back to `fallbackLng: 'en'`. Every page in `dist/` is generated with English text, including the LanguageToggle button showing `"NP"` (the label for "switch to Nepali").

At runtime, `main.tsx` calls `createRoot(rootElement).render(...)`. React 18's `createRoot` performs a **full client render** — it discards the existing pre-rendered DOM and replaces it with a fresh React tree.

For a user with `ho-gas-lang=ne` in localStorage:

```
Time 0ms   HTML arrives from server → browser paints English content (from SSG)
           LanguageToggle shows "NP" button (English mode)

Time ~50ms JS bundle evaluates → i18n detects 'ne' from localStorage
           React mounts → replaces DOM with Nepali content
           LanguageToggle shows "EN" button (Nepali mode)
```

The user sees:
1. English page with "NP" button (pre-rendered)
2. Flash → Nepali page with "EN" button (React-mounted)

This is called **FOUC** (Flash of Original/wrong language Content). The toggle appears to spontaneously jump state. On a slow connection the flash is even more pronounced.

---

### Interaction Between Bug 1 and Bug 2

Bug 2 (FOUC) is unavoidable without server-side language detection — SSG can never know the user's localStorage. But Bug 1 makes it worse: because the init Promise is not awaited, React renders English content TWICE before settling on Nepali, making the flash longer and causing an extra re-render cycle.

---

## Evidence from Build Artifacts

### dist/index.html shows English-only pre-render:
```
aria-label="Switch to Nepali"   ← toggle shows "NP" (English mode), twice (desktop + mobile)
aria-label="Switch to Nepali"
```
This is correct for SSG (always English), but will flash when the user has Nepali stored.

### ssgContext client chunk shipped to browser:
`dist/assets/ssgContext-7eDUSic2.js` is bundled and delivered to the browser because Vite includes all dynamic imports as lazy chunks. The chunk references `withSSGLayout` (only useful for SSG), but crucially it also imports and re-exports the `i18n` singleton from the main bundle. This chunk is **never executed** in the browser (the `ssgOptions.context()` function that calls it is never invoked client-side), but its presence confirms the i18n singleton is shared correctly between SSG and runtime.

### i18n.init() is in the main bundle:
`lookupLocalStorage` and `ho-gas-lang` are present in `dist/assets/index-*.js`, confirming `LanguageDetector` is included in the main client chunk and will run on every page load.

---

## Fix Plan

Three changes required. All small and targeted.

---

### Fix 1 — Export the i18n init Promise from `src/i18n/index.ts`

**Why:** The Promise must be exported so `main.tsx` can await it.

**Change:**

```ts
// src/i18n/index.ts  — BEFORE
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({ ... })

export default i18n
export type SupportedLang = 'en' | 'ne'
```

```ts
// src/i18n/index.ts  — AFTER
export const i18nReady = i18n   // ← capture the Promise returned by .init()
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({ ... })

export default i18n
export type SupportedLang = 'en' | 'ne'
```

`i18nReady` is a `Promise<TFunction>` that resolves once `LanguageDetector` has finished reading from localStorage and `initReactI18next` has set up the React context. Exporting it makes it awaitable from `main.tsx`.

---

### Fix 2 — Await `i18nReady` in `src/main.tsx` Before Rendering

**Why:** Ensures `i18n.language` is set to the user's stored preference _before_ React renders. Eliminates the initial wrong-language flash caused by Bug 1.

**Change:**

```ts
// src/main.tsx  — BEFORE
import './i18n'
import App from './App'

createRoot(rootElement).render(
  <StrictMode><App /></StrictMode>
)
```

```ts
// src/main.tsx  — AFTER
import { i18nReady } from './i18n'
import App from './App'

i18nReady.then(() => {
  createRoot(rootElement).render(
    <StrictMode><App /></StrictMode>
  )
})
```

**Effect:** React now renders only after `LanguageDetector` has resolved the user's language from localStorage. First render is in the correct language. No extra re-render cycle due to language change.

**Why `.then()` instead of `async/await`?** The module entry point (`main.tsx`) is not inside an async function. Using `.then()` is the correct top-level pattern. The behaviour is identical to `await`.

**Performance impact:** Near-zero. `LanguageDetector` reads from `localStorage` synchronously. `i18nReady` should already be in the resolved state by the time `.then()` is registered, so the callback fires as a microtask with no observable delay.

---

### Fix 3 — Add Blocking Language Script to `index.html` to Prevent FOUC

**Why:** Fixes Bug 2. The SSG HTML will always arrive in English. Even with Fix 1+2, the pre-rendered English HTML is visible from `Time 0ms` to `Time ~50ms` (when JS loads). A blocking `<script>` in `<head>` runs before the browser paints, allowing us to mark the page as the correct language before it's shown to the user.

**Change to `index.html`:**

```html
<!-- index.html — add this BEFORE the closing </head> tag -->
<script>
  (function () {
    try {
      var lang = localStorage.getItem('ho-gas-lang');
      if (lang === 'ne') {
        document.documentElement.setAttribute('data-lang', 'ne');
      }
    } catch (e) {}
  })();
</script>
```

**What this does:**
- Runs synchronously, before the browser paints anything
- Reads `ho-gas-lang` from localStorage
- If Nepali is stored, sets `data-lang="ne"` on `<html>`
- The `try/catch` ensures it never throws (localStorage can be blocked in private browsing)

**Add corresponding CSS to `src/index.css`:**

```css
/* Hide the pre-rendered SSG HTML if the user's stored language is Nepali.
   The React app will mount and render Nepali content. Without this rule,
   English content flashes briefly before React replaces it. */
html[data-lang="ne"] #root {
  visibility: hidden;
}

/* Once React mounts and renders the correct language, restore visibility.
   React sets data-lang on <html> via RootLayout's useEffect — the selector
   change triggers this rule to be removed, making the content visible. */
html:not([data-lang="ne"]) #root,
html[data-lang="ne"].lang-ready #root {
  visibility: visible;
}
```

**Add `lang-ready` class in `src/App.tsx`'s `RootLayout` after mount:**

```tsx
// RootLayout in App.tsx — inside the useEffect that syncs html lang
useEffect(() => {
  const isNepali = i18n.language.startsWith('ne')
  document.documentElement.lang = isNepali ? 'ne' : 'en'
  document.documentElement.setAttribute('data-lang', isNepali ? 'ne' : 'en')
  document.documentElement.classList.add('lang-ready')  // ← add this
}, [i18n.language])
```

**Full sequence after fixes:**

```
Time 0ms     HTML arrives → blocking script runs
             If ho-gas-lang=ne: data-lang="ne" set on <html>
             CSS hides #root (English SSG content not shown)

Time 0ms     Browser paints → nothing visible (hidden) or English (first visit)

Time ~50ms   JS bundle loads → i18nReady resolves → createRoot.render()
             React renders Nepali content
             RootLayout useEffect fires: data-lang="ne", adds lang-ready class
             CSS: html[data-lang="ne"].lang-ready #root { visibility: visible }
             Nepali content becomes visible — no flash
```

For first-time visitors (no localStorage):
```
Time 0ms     HTML arrives → blocking script runs
             ho-gas-lang is null → data-lang NOT set → #root NOT hidden
             English SSG content visible immediately ← correct

Time ~50ms   JS mounts → English content (same as SSG) → no visible change
```

---

## Summary of Changes

| File | Change | Fixes |
|------|--------|-------|
| `src/i18n/index.ts` | Export `i18nReady` Promise from `.init()` call | Bug 1 (race condition) |
| `src/main.tsx` | Await `i18nReady` before `createRoot.render()` | Bug 1 (race condition) |
| `index.html` | Blocking `<script>` to set `data-lang` on `<html>` | Bug 2 (FOUC) |
| `src/index.css` | `html[data-lang="ne"] #root { visibility: hidden }` | Bug 2 (FOUC) |
| `src/App.tsx` | `document.documentElement.classList.add('lang-ready')` in `RootLayout` useEffect | Bug 2 (FOUC reveal) |

---

## What Is NOT Changed

- `src/i18n/index.ts` — detection config, resources, fallbackLng, supportedLngs — all unchanged
- `src/components/ui/LanguageToggle.tsx` — no changes needed; `i18n.changeLanguage()` works correctly
- `src/i18n/ssgContext.tsx` — no changes; SSG always pre-renders in English (unavoidable for static SSG)
- Any page files — no changes

---

## Verification After Fix

1. **First visit (no localStorage):**
   - Page loads → English content immediately visible → correct
   - Click "NP" → Nepali text replaces English immediately
   - localStorage now has `ho-gas-lang=ne`

2. **Return visit (localStorage = 'ne'):**
   - Page loads → `#root` hidden (no English flash)
   - JS loads → React renders Nepali → `lang-ready` added → content visible
   - All text in Nepali on first paint, no flash

3. **Toggle works both ways:**
   - Click "EN" while in Nepali → English content, localStorage → `'en'`
   - Reload → English shown (SSG matches stored preference)

4. **No regression for English users:**
   - All behaviour identical to before for users who stay in English

5. **Build passes:**
   - `npm run build` exits 0
   - All 6 SSG pages generated correctly

---

## Known Limitation (Not Fixed)

SSG will always generate English HTML. This is a fundamental constraint of static site generation without server-side language detection. The fixes above reduce or eliminate the visible flash, but the underlying cause (SSG cannot read localStorage) is architectural and cannot be fixed without switching to a different rendering strategy (e.g., Cloudflare Workers edge rendering with cookie-based language detection). This is out of scope for the current project phase.

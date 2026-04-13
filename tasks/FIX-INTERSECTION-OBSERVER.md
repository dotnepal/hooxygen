# FIX: IntersectionObserver — Text Invisible on Homepage

**Date:** 2026-03-28
**Files changed:** `src/hooks/useScrollAnimation.ts`, `src/index.css`
**Status:** Applied and verified (`npm run build` passes)

---

## Symptoms

- Text in card sections (Gas Highlights, Trust Gallery, Services, Team, Why Choose Us) was invisible
- Sections remained blank even after scrolling completely through them
- Affected both mobile and desktop viewports
- Reproducible in `npm run build && vite preview` (production build)
- Hero text (no `animate-on-scroll`) was unaffected

---

## Root Cause Analysis

Elements with `animate-on-scroll` start at `opacity: 0` (CSS). They become visible only when the `IntersectionObserver` fires and marks them as visible. Two independent bugs prevented this.

---

## Bug 1 — React re-renders wiped `is-visible` class

### Mechanism

The hook called `element.classList.add('is-visible')` to trigger the CSS animation. React's reconciler, on any re-render of the component, writes the `className` prop back to the `class` DOM attribute as a **full replacement** — removing any class not present in the original JSX prop. Since `is-visible` was never in the prop, React silently erased it.

The trigger: **i18next language detection** causes a re-render of every component that calls `useTranslation()`. This re-render fired shortly after hydration — often after the IntersectionObserver had already added `is-visible`. Result: elements flashed visible for a frame, then went back to `opacity: 0`.

### Why `data-visible` is immune

React only manages DOM attributes it knows about from the component's props. Attributes set externally (via `element.dataset.xxx`) are invisible to the reconciler. React never reads them, never diffs them, and never removes them — even across re-renders and language switches.

### Fix applied

| Location | Before | After |
|---|---|---|
| `useScrollAnimation.ts` | `el.classList.add('is-visible')` | `el.dataset.visible = '1'` |
| `useScrollAnimation.ts` | `child.classList.add('is-visible')` | `child.dataset.visible = '1'` |
| `index.css` | `.animate-on-scroll.is-visible { ... }` | `.animate-on-scroll[data-visible] { ... }` |

The CSS attribute selector `[data-visible]` matches any element that has the attribute set, regardless of value.

---

## Bug 2 — `threshold: 0.12` caused observer to never fire

### Mechanism

`IntersectionObserver` was configured with `threshold: 0.12`. This means **12% of the observed element's height** must be visible before the callback fires.

In stagger mode, the `ref` is attached to the **grid container** (the `<div>` wrapping all cards), not to the individual card children. The container spans the full stacked height. On mobile (single-column layout), these containers are very tall:

| Section | Container height (mobile) | Required visible (12%) | Typical visible on entry | Fires? |
|---|---|---|---|---|
| GasHighlights (3 cards) | ~1440 px | 173 px | ~10 px | ❌ NEVER |
| TrustGallery (3 cards) | ~600 px | 72 px | ~10 px | ❌ NEVER |
| TeamGrid (4 cards) | ~1200 px | 144 px | ~10 px | ❌ NEVER |
| WhyChooseUs (4 cards) | ~800 px | 96 px | ~10 px | ❌ NEVER |
| ServicesSection (3 cards) | ~600 px | 72 px | ~10 px | ❌ NEVER |
| ServicesStrip badges | ~240 px | 29 px | ~10 px | ❌ NEVER |
| Section headers | ~150 px | 18 px | ~50 px | ✅ fires |

**Only section headers (small, standalone elements) animated correctly.** Every staggered card group stayed invisible permanently.

On desktop (3-column layout), containers shrink to ~240 px. Combined with `rootMargin: '0px 0px -40px 0px'`, the effective trigger zone was a narrow window that could be missed if i18next re-renders disconnected and re-attached the observer during a scroll event.

### Fix applied

| Setting | Before | After | Reason |
|---|---|---|---|
| `threshold` | `0.12` | `0` | Fire on any pixel of intersection — unconditionally reliable for containers of any height |
| `rootMargin` (bottom) | `-40px` | `-60px` | Compensates for threshold=0 firing more eagerly; preserves "scroll to reveal" feel by delaying trigger until element is 60 px above viewport bottom |

### Why `threshold: 0` is correct for containers

The observed element (the grid `<div>`) has no visual presence — it is a pure layout box. Its only purpose is to serve as a sentinel for when the *section* enters view. A threshold applied to a layout container penalises tall layouts (mobile stacks) with no benefit. `threshold: 0` fires the moment the container's leading edge crosses the effective root boundary, which is precisely when the section starts to become visible to the user.

---

## Final State of `useScrollAnimation.ts`

```ts
const observer = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) return

    if (stagger > 0) {
      const children = el.querySelectorAll<HTMLElement>('.animate-on-scroll')
      children.forEach((child, i) => {
        child.style.animationDelay = `${i * stagger}ms`
        child.dataset.visible = '1'          // Bug 1 fix: data attr survives React re-renders
      })
    } else {
      el.dataset.visible = '1'               // Bug 1 fix
    }

    observer.disconnect()
  },
  { threshold: 0, rootMargin: '0px 0px -60px 0px' }  // Bug 2 fix: threshold 0, rootMargin -60px
)
```

## Final State of `index.css` (relevant block)

```css
@media (prefers-reduced-motion: no-preference) {
  .animate-on-scroll {
    opacity: 0;
  }

  .animate-on-scroll[data-visible] {           /* Bug 1 fix: attribute selector */
    animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .page-transition {
    animation: pageFadeIn 0.35s ease-out;
  }
}
```

---

## Verification Checklist

- [ ] `npm run build` — zero errors, all 5 SSG pages generated
- [ ] `npm run dev` — open at 375 px wide (mobile), scroll through homepage: Gas Highlights, Services, Trust Gallery, CTA all animate in
- [ ] Same at 1280 px wide (desktop): all sections animate correctly
- [ ] About page: Team Grid and Why Choose Us cards animate in on scroll
- [ ] Products page: Services section cards animate in on scroll
- [ ] DevTools > Rendering > `prefers-reduced-motion: reduce` — all elements fully visible, no animation, no invisible text

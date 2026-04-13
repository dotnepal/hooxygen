# Fix: Gas Icons (CO₂ / Ar) + Remove Weight Column

**Date:** 2026-03-29
**Status:** Complete

---

## Problem Statement

### Bug 1 — Wrong SVG icon text for CO₂ and Ar

In `src/pages/HomePage.tsx`, the `GAS_ICONS` constant defines SVG circle icons with chemical formula text for each gas. Due to copy-paste, both `carbondioxide` and `argon` were incorrectly displaying `H₂` (the Hydrogen formula) instead of their correct symbols.

| Key | Was | Should Be |
|---|---|---|
| `carbondioxide` | `H₂` | `CO₂` |
| `argon` | `H₂` | `Ar` |

TypeScript cannot catch this — it's a visual/content bug, not a type error.

### Bug 2 — Weight column on Products page

The `/products` page cylinder listing table included a `weight` column (next to `size` and `capacity`). This column was present in both:
- **Desktop table** (`hidden md:block`) — `weight` header + `row.weight` cell
- **Mobile card view** (`md:hidden`) — a small weight label+value block alongside capacity

Weight is not a required display field per the spec (`CLAUDE.md` §2.3 lists: Capacity, Rent, Sale, Pricing — Weight is not listed). Removing it simplifies the table.

---

## Files Changed

### `src/pages/HomePage.tsx`
- `carbondioxide` SVG icon: `H₂` → `CO₂`, `fontSize` reduced `16` → `13` (longer text needs smaller font to fit inside the 36px-diameter circle)
- `argon` SVG icon: `H₂` → `Ar`

### `src/pages/ProductsPage.tsx`
- **Desktop table header:** Removed `'weight'` from the `(['size', 'capacity', 'weight', 'rent', 'sale', 'pricing'] as const)` array
- **Desktop table body:** Removed `<td className="px-5 py-4 text-brand-steel">{row.weight}</td>`
- **Mobile card:** Removed the entire weight `<div>` block (the `text-right` div containing `products.table.weight` label and `row.weight` value)

### Not changed
- `src/i18n/en.json` and `src/i18n/np.json` — `"weight"` translation keys retained (unused but harmless)
- `src/data/products.ts` — `weight` field on `CylinderRow` retained (data layer untouched; UI simply no longer renders it)

---

## Root Cause Analysis

**Icon bug:** The `GAS_ICONS` object was built by duplicating the `hydrogen` icon entry and updating the key name, but forgetting to update the `<text>` content from `H₂` to the correct formula. TypeScript types only validate the object shape, not string content values.

**Weight column:** The column was added during initial scaffolding when the spec was less defined. §2.3 of CLAUDE.md lists the display fields — Weight is not among them.

---

## Verification

```bash
npm run build   # Must pass with 0 errors
```

Visual checks:
- Home → GasHighlights section: CO₂ icon shows `CO₂`, Ar icon shows `Ar`
- Products page table columns: Size | Capacity | Rent | Sale | Pricing (no Weight)
- Products page mobile cards: Size badge + Capacity only (no Weight)

---

## Lessons

- **L-008:** SVG icon text content is not type-checked. Copy-paste icon entries require manual visual QA — the bug is invisible until rendered in a browser.
- **L-009:** Cross-reference rendered columns against the spec (CLAUDE.md §2.3) before shipping. Scaffold code often includes more columns than the spec requires.

---
name: fix-stale-docs
description: "Audit CLAUDE.md for stale content and fix it. Use when CLAUDE.md may be out of sync with the actual codebase — e.g. after removing a page section, hiding nav items, changing product display fields, or any structural change. Also fixes typos. Updates CHANGELOG.md after changes."
user-invocable: true
---

# Fix Stale Docs

You are auditing `CLAUDE.md` for content that no longer matches the actual codebase of this project. Follow these steps precisely.

## Step 1 — Read CLAUDE.md

Read the full `CLAUDE.md` file.

## Step 2 — Audit against actual codebase

Check each of the following areas by reading the relevant source files. For each area, compare what CLAUDE.md says against what the code actually does:

### Pages & Navigation (`src/routes.ts`, `src/components/layout/Navbar.tsx`)
- Do the listed pages in CLAUDE.md match the routes defined in `routes.ts`?
- Does the nav menu section correctly reflect which routes are shown vs hidden (`.filter()` calls in Navbar.tsx)?

### Footer (`src/components/layout/Footer.tsx`)
- Do the footer sections (Left/Middle/Right) match what is actually rendered?
- Are any links listed in CLAUDE.md that no longer appear in the footer?
- Is the email shown or hidden?

### Products (`src/pages/ProductsPage.tsx`, `src/data/products.ts`)
- Does §2.1 Gas Types list all gas types present in `products.ts`?
- Does §2.3 Product Display list only the columns actually rendered in the table (check the column array in the desktop table and the mobile card view)?

### About Page (`src/pages/AboutPage.tsx`)
- Does the About page description in §3.2 reflect the sections actually in the component?
- Are any removed sections (team grid, why-us) still described as present?

### Services Page (`src/pages/ServicesPage.tsx`)
- Does §3.2 Services page description match what is actually rendered?

### Contact Page (`src/pages/ContactPage.tsx`)
- Does the Contact Information Display list match what is rendered (phone, address, email visibility)?

### Imagery §5.1
- Does the imagery list mention "Team Photos" when the team section has been removed?

### Tech Stack
- Does the Runtime version (React) match `package.json`?

### Typos
- Scan all section headings and body text for typos. Common past offenders: "Improvemennt", "chagne", "cuases", "behaviro". Fix any found.

## Step 3 — Fix all stale items

For every mismatch found:
- Edit `CLAUDE.md` using the Edit tool (one edit per logical change)
- Do not rewrite sections wholesale — make targeted, minimal edits

## Step 4 — Update CHANGELOG.md

Prepend a new entry at the top of `CHANGELOG.md` (after the title and intro, before the existing first entry) with:
- Today's date
- Title: `CLAUDE.md stale spec audit`
- A bulleted list of every item that was changed, with before → after for each

If no stale items were found, add a brief entry noting the audit was clean.

## Step 5 — Report

List every change made (or confirm the audit was clean). Be specific: section number, what was wrong, what it was changed to.

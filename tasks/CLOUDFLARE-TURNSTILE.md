# Cloudflare Turnstile — Implementation Plan

**Date:** 2026-04-14
**Feature:** Bot protection for the Contact form via Cloudflare Turnstile
**Scope:** `src/pages/ContactPage.tsx`, `functions/api/contact.ts`, `index.html`, `wrangler.toml`, `runbooks/DEPLOY.md`
**See Online documentation**: https://developers.cloudflare.com/turnstile/?preferred-color-scheme=light

---

## Why

The contact form at `/contact` is currently unprotected. Any bot can POST to `/api/contact` and spam
the contact-mailer Worker. Cloudflare Turnstile adds invisible/managed bot detection with zero user
friction (no image puzzles) and is already part of the Cloudflare ecosystem used for hosting.

---

## Overview

```
User fills form
  └─► Turnstile widget (client) runs JS challenges → emits cf-turnstile-response token
        └─► onSubmit sends token inside JSON body to POST /api/contact
              └─► Pages Function verifies token via CF Siteverify API
                    ├─ fail → 403 (bot rejected, form shows error)
                    └─ pass → forward to contact-mailer Worker (existing flow)
```

---

## Step-by-Step Implementation

### Step 1 — Provision Turnstile Widget in CF Dashboard

> Do this before writing any code — you need the keys.

1. Log in to **Cloudflare Dashboard → Turnstile** (left sidebar).
2. Click **Add widget**.
3. Fill in:
   - **Name:** `ho-gas-factory-contact`
   - **Hostname:** your Pages domain (e.g. `ho-gas-factory.pages.dev` and/or `hooxygen.com.np`)
   - **Widget type:** `Managed` (recommended — CF decides whether to show checkbox)
4. Copy the **Site Key** (public) and **Secret Key** (private).

> For local development use CF's test keys:
> - Site key: `1x00000000000000000000AA`
> - Secret key: `1x0000000000000000000000000000000AA`

---

### Step 2 — Add Turnstile Script to `index.html`

Add the Turnstile script tag to `<head>` **after** the Google Fonts links.
Use `render=explicit` so the widget only mounts when React explicitly calls it.

**File:** `index.html`

```html
<!-- Cloudflare Turnstile (explicit render — mounted by ContactPage) -->
<script
  src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
  async
  defer
></script>
```

> `render=explicit` prevents Turnstile from auto-scanning the DOM for `.cf-turnstile` elements,
> which avoids double-mounting issues in a React SPA.

---

### Step 3 — Add Site Key to `.env.local` (local dev)

**File:** `.env.local` (gitignored — create manually):

```env
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

> Use CF's test site key for local development. Vite automatically reads `.env.local` at build time.
> Verify `.env.local` is in `.gitignore` — it should never be committed.

---

### Step 4 — Expose Site Key as Build-Time Env Var (CI/CD)

**File:** `.github/workflows/deploy.yml` — inject in the build step `env:`:

```yaml
env:
  VITE_TURNSTILE_SITE_KEY: ${{ secrets.VITE_TURNSTILE_SITE_KEY }}
```

Add `VITE_TURNSTILE_SITE_KEY` as a **GitHub Secret** (it is public, but keeping it in secrets
means it is configurable without a code push).

> The site key is safe to expose in client-side code — it is designed to be public.
> Build-time `VITE_` vars must NOT go in `wrangler.toml [vars]` (that section is for runtime
> Worker/Pages Function env vars only).

---

### Step 5 — Add Turnstile Secret Key as Runtime Secret

**CF Dashboard → Pages → ho-gas-factory → Settings → Environment Variables → Add variable:**

| Variable | Environment | Value |
|----------|-------------|-------|
| `TURNSTILE_SECRET_KEY` | Production | `<secret key from Step 1>` |
| `TURNSTILE_SECRET_KEY` | Preview | `1x0000000000000000000000000000000AA` (test key) |

> Never put the secret key in `wrangler.toml` (committed to git) or inject it at build time.
> It must stay server-side only.

---

### Step 6 — Extend `vite-env.d.ts` with Turnstile Site Key Type

**File:** `src/vite-env.d.ts`

Add to the `ImportMetaEnv` interface:

```typescript
interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITE_KEY: string
}
```

> This ensures TypeScript recognizes `import.meta.env.VITE_TURNSTILE_SITE_KEY` as a string.

---

### Step 7 — Update `ContactFormData` Interface and `Env` in the Pages Function

**File:** `functions/api/contact.ts`

**5a — Add `turnstileToken` to the request body interface:**

```typescript
interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  gasType?: string
  requirementType?: string
  message?: string
  turnstileToken: string   // ← new
}
```

**5b — Add `TURNSTILE_SECRET_KEY` to `Env`:**

```typescript
export interface Env {
  CONTACT_MAILER: Fetcher
  TURNSTILE_SECRET_KEY: string   // ← new
}
```

**5c — Add Turnstile verification block immediately after JSON parse, before field validation:**

```typescript
// ── Turnstile bot check ───────────────────────────────────────────────────
const { turnstileToken } = data
if (!turnstileToken) {
  return Response.json({ success: false, error: 'Bot check token missing' }, { status: 400 })
}

const verifyForm = new FormData()
verifyForm.append('secret', env.TURNSTILE_SECRET_KEY)
verifyForm.append('response', turnstileToken)
verifyForm.append('remoteip', request.headers.get('CF-Connecting-IP') ?? '')

const verifyRes = await fetch(
  'https://challenges.cloudflare.com/turnstile/v0/siteverify',
  { method: 'POST', body: verifyForm }
)
const verifyData = await verifyRes.json<{ success: boolean; 'error-codes'?: string[] }>()

if (!verifyData.success) {
  console.error('Turnstile verification failed', verifyData['error-codes'])
  return Response.json({ success: false, error: 'Bot check failed. Please try again.' }, { status: 403 })
}
// ─────────────────────────────────────────────────────────────────────────
```

> Place this block **between** the JSON parse `try/catch` and the `required fields` loop.
> Tokens are single-use and expire in 300 s — verify immediately on receipt.

---

### Step 8 — Integrate Turnstile Widget into `ContactPage.tsx`

The widget must be mounted imperatively (explicit mode) because the contact form is inside a
React component that conditionally renders. Use a `useEffect` + `useRef` approach.

**File:** `src/pages/ContactPage.tsx`

**6a — Declare the global `turnstile` API type at the top of the file (after imports):**

```typescript
declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}
```

**6b — In `ContactForm`, add state + refs for the widget:**

```typescript
const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
const widgetRef = useRef<string | null>(null)        // stores widgetId returned by turnstile.render
const containerRef = useRef<HTMLDivElement>(null)    // DOM node for the widget
```

**6c — Mount the widget after first render:**

```typescript
useEffect(() => {
  if (!containerRef.current || widgetRef.current) return

  widgetRef.current = window.turnstile?.render(containerRef.current, {
    sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
    theme: 'light',
    callback: (token: string) => setTurnstileToken(token),
    'expired-callback': () => setTurnstileToken(null),
    'error-callback': () => setTurnstileToken(null),
  })

  return () => {
    if (widgetRef.current) {
      window.turnstile?.remove(widgetRef.current)
      widgetRef.current = null
    }
  }
}, [])
```

**6d — Include token in `onSubmit` and guard against missing token:**

```typescript
const onSubmit = async (data: ContactFormData) => {
  if (!turnstileToken) {
    setStatus('error')
    return
  }
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, turnstileToken }),
    })
    if (res.ok) {
      setStatus('success')
      reset()
      setTurnstileToken(null)
      if (widgetRef.current) window.turnstile?.reset(widgetRef.current)
    } else {
      setStatus('error')
      if (widgetRef.current) window.turnstile?.reset(widgetRef.current)
    }
  } catch {
    setStatus('error')
  }
}
```

**6e — Add the widget container div inside the form, just above the Submit button:**

```tsx
{/* Cloudflare Turnstile */}
<div ref={containerRef} className="min-h-[65px]" aria-label="Bot verification" />
```

**6f — Disable Submit until token is available:**

```tsx
<Button
  type="submit"
  size="lg"
  disabled={isSubmitting || !turnstileToken}
  className="w-full sm:w-auto"
>
  {isSubmitting ? t('common.loading') : t('contact.form.submit')}
</Button>
```

---

### Step 9 — Update `runbooks/DEPLOY.md`

Add the following to the **Required GitHub Secrets** table:

| Secret Name | Description |
|-------------|-------------|
| `VITE_TURNSTILE_SITE_KEY` | Public Turnstile site key (baked into JS bundle at build time) |

Add to the **Runtime (Cloudflare Pages Dashboard)** table:

| Variable | Environment | Purpose |
|----------|-------------|---------|
| `TURNSTILE_SECRET_KEY` | Production | Turnstile secret key for server-side token verification |
| `TURNSTILE_SECRET_KEY` | Preview | CF test secret key (`1x0000000...AA`) for PR preview environments |

Add a pre-launch checklist item:

```
- [ ] Turnstile widget created in CF Dashboard with correct hostnames
- [ ] TURNSTILE_SECRET_KEY set in CF Pages environment variables (Production + Preview)
- [ ] VITE_TURNSTILE_SITE_KEY added as GitHub secret
- [ ] Contact form tested: widget appears, submit blocked until challenge passes, email received
```

---

## Verification Steps

### Required Verifications (blocking)

1. **Local dev:** Run `npm run dev`. Widget container `<div>` renders in the form. Because the
   script is loaded async/defer, `window.turnstile` may not be available immediately in dev — use
   CF test site key so the widget auto-passes.

2. **Build check:** `npm run build` — should complete with no TS errors (the `declare global` block
   satisfies the compiler; `import.meta.env.VITE_TURNSTILE_SITE_KEY` is typed by Vite).

3. **Functional test (Preview environment):**
   - Open the deployed preview URL → Contact page
   - Turnstile widget appears (or passes invisibly with test keys)
   - Submit button is disabled until the challenge completes
   - Submit with valid data → success banner appears
   - Check CF Pages logs: no `Turnstile verification failed` errors

4. **Bot rejection test:**
   - POST directly to `/api/contact` without `turnstileToken` in the body
   - Expect `400 Bot check token missing`
   - POST with a forged/expired token → expect `403 Bot check failed`

### Edge Case TODOs (post-implementation)

- [ ] **Widget reset on success** — After successful submit, confirm widget resets via `window.turnstile.reset()` and Submit button re-enables for a second submission
- [ ] **Expired token path** — Wait for token to expire (300s) or trigger `expired-callback` manually, verify Submit becomes disabled again
- [ ] **`window.turnstile` timing** — In local dev, add console warning if `window.turnstile` is undefined when `useEffect` tries to mount widget
- [ ] **End-to-end flow** — Turnstile challenge passes → `/api/contact` POST succeeds → `CONTACT_MAILER` is called → email received in inbox
- [ ] **Form state after error** — Submit fails on backend (e.g., invalid email) — confirm error banner shows and widget resets for retry

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| `render=explicit` in script tag | Avoids Turnstile scanning the DOM before React mounts; prevents double-widget issues in SPA |
| Widget mounted in `useEffect` with cleanup | Follows React lifecycle; prevents stale widget on hot reload |
| Submit button disabled until token present | UX signal that challenge must pass; prevents silent 403 |
| `CF-Connecting-IP` header passed to siteverify | Improves CF's bot signal accuracy (available in Pages Functions automatically) |
| Test keys for Preview env | Prevents real challenges on PR preview deployments while still exercising the full code path |
| Secret key in CF Dashboard env vars only | Never in `wrangler.toml` (git-committed) or bundle — server-side only |

---

## Implementation Checklist (Dependency Order)

### Parallel Batch 1 (no dependencies)
- [ ] **STEP 1** — `index.html` — Add Turnstile `<script>` tag with `render=explicit` after Google Fonts
- [ ] **STEP 2** — `src/vite-env.d.ts` — Extend `ImportMetaEnv` with `VITE_TURNSTILE_SITE_KEY: string`
- [ ] **STEP 3** — `.env.local` — Create with test site key (gitignored, local dev only)
- [ ] **STEP 4** — `.github/workflows/deploy.yml` — Inject `VITE_TURNSTILE_SITE_KEY` from GitHub Secret
- [ ] **STEP 7** — `functions/api/contact.ts` — Add `turnstileToken` field, `TURNSTILE_SECRET_KEY` to `Env`, siteverify block

### Sequential After Batch 1
- [ ] **STEP 8** — `src/pages/ContactPage.tsx` — Full widget integration (depends on STEP 1 + 2)
  - Declare global `window.turnstile` type
  - Add state: `turnstileToken`, refs: `widgetRef`, `containerRef`
  - Mount widget in `useEffect` with cleanup
  - Gate `onSubmit` on token presence
  - Reset widget after success/error
  - Add `<div ref={containerRef}>` above Submit
  - Disable Submit when `!turnstileToken`
- [ ] **STEP 10** — `npm run build` — Verify no TS errors (gates everything else)

### Parallel Batch 2 (after build passes)
- [ ] **STEP 5** — `runbooks/DEPLOY.md` — Add secrets table + Turnstile checklist
- [ ] **STEP 6** — This file (`tasks/CLOUDFLARE-TURNSTILE.md`) — Verification complete, mark edge cases tested

---

## Notes

- **GitHub Secrets required:** `VITE_TURNSTILE_SITE_KEY` (public site key from CF Dashboard)
- **CF Pages env vars required:**
  - Production: `TURNSTILE_SECRET_KEY` = real secret key
  - Preview: `TURNSTILE_SECRET_KEY` = test key `1x0000000000000000000000000000000AA`
- **Local dev:** Must create `.env.local` with test site key; it's gitignored
- After implementation, manually test edge cases (see Verification Steps above)

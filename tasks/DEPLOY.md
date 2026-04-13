# HO Oxygen — Deployment Specification

**Last updated:** 2026-03-28

---

## Architecture Overview

```
Developer → PR to main → GitHub Actions (build + deploy Worker + deploy Pages) → Cloudflare
```

- **Build** job runs on every PR (CI check) and every push to `main`
- **Deploy** job runs only on push to `main` (i.e., merged PRs); never on open PRs

---

## GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

| Job | Trigger | Steps |
|-----|---------|-------|
| `build` | All PRs + push to main | checkout → setup Node 20 → `npm ci` → `npm run build` → upload artifact |
| `deploy` | Push to `main` only | download artifact → `wrangler deploy` for `workers/contact-mailer` → `wrangler pages deploy dist` |

---

## Required GitHub Secrets

Set these in **GitHub → Repository → Settings → Secrets and variables → Actions**:

| Secret Name | Description | How to get |
|-------------|-------------|-----------|
| `CLOUDFLARE_API_TOKEN` | API token scoped to Cloudflare Pages | CF Dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Pages" template |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | CF Dashboard → right sidebar (any page) |

---

## Runtime Configuration

### Contact mailer Worker

The Pages Function uses a service binding named `CONTACT_MAILER` that points to a separate Worker named `contact-mailer`.
That Worker must be deployed in the same Cloudflare account before the Pages deployment can succeed.

Worker config lives in `workers/contact-mailer/wrangler.toml`:

| Variable | Purpose |
|----------|---------|
| `CONTACT_SENDER_EMAIL` | Sender address for outbound email |
| `CONTACT_RECIPIENT_EMAIL` | Destination inbox for contact form submissions |

The Worker also requires the `send_email` binding declared in that same file.

## Environment Variables

### Build-time (GitHub Actions)

Injected in the `build` step of the workflow — these get baked into the JS bundle:

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_FORM_ENDPOINT` | `/api/contact` | Points contact form to the Cloudflare Pages Function |

### Runtime (Cloudflare Pages Dashboard)

Set in **CF Dashboard → Pages → ho-gas-factory → Settings → Environment Variables**:

| Variable | Environment | Purpose |
|----------|-------------|---------|
| `WEB3FORMS_KEY` | Production | API key for Web3Forms email relay (used by `functions/api/contact.ts`) |

> **Note:** `WEB3FORMS_KEY` is a server-side secret used by the Pages Function — it is never exposed to the client. Do not add it to GitHub secrets or the workflow env.

---

## How to Get a Web3Forms Key

1. Go to [web3forms.com](https://web3forms.com) and create a free account
2. Create a new access key for `ho-gas-factory.pages.dev`
3. Add it as `WEB3FORMS_KEY` in the Cloudflare Pages dashboard (Production environment)

---

## Cloudflare Pages Project Setup (One-Time)

If the Pages project does not exist yet:

```bash
# Install wrangler globally (or use npx)
npm install -g wrangler

# Authenticate
wrangler login

# Deploy the contact mailer Worker first
wrangler deploy --config workers/contact-mailer/wrangler.toml

# Deploy Pages (creates the project if needed)
VITE_FORM_ENDPOINT=/api/contact npm run build
wrangler pages deploy dist --project-name=ho-gas-factory
```

After first deploy, subsequent deploys are handled automatically by GitHub Actions.

---

## Manual Deploy (Fallback)

If GitHub Actions is unavailable, deploy manually from the repo root:

```bash
# Deploy the service-bound Worker
wrangler deploy --config workers/contact-mailer/wrangler.toml

# Build and deploy Pages
VITE_FORM_ENDPOINT=/api/contact npm run build
wrangler pages deploy dist --project-name=ho-gas-factory
```

Requires `wrangler` authenticated via `wrangler login`.

---

## Rollback Procedure

1. Go to **CF Dashboard → Pages → ho-gas-factory → Deployments**
2. Find the last known-good deployment
3. Click the three-dot menu → **Rollback to this deployment**

Alternatively, revert the offending commit on `main` — GitHub Actions will trigger a new deploy automatically.

---

## Deployment Checklist (Pre-Launch)

- [ ] `CLOUDFLARE_API_TOKEN` added to GitHub secrets
- [ ] `CLOUDFLARE_ACCOUNT_ID` added to GitHub secrets
- [ ] Worker `contact-mailer` deployed in the target Cloudflare account
- [ ] Cloudflare Pages project `ho-gas-factory` created (via first manual deploy or CF dashboard)
- [ ] Custom domain (`hogasfactory.com.np`) configured in CF Pages → Custom Domains
- [ ] SSL certificate provisioned by Cloudflare (automatic once domain is added)
- [ ] Contact form tested end-to-end on production URL

---

## Deployed Pages

All 6 routes are pre-rendered via SSG and verified at deploy:

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About Us |
| `/products` | Products/Services |
| `/services` | Services |
| `/contact` | Contact |
| `/faq` | FAQ |

SPA fallback is handled by `public/_redirects` (`/* /index.html 200`), so client-side navigation between routes works without server-side route config.

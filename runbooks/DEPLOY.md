# HO Oxygen — Deployment Specification

**Last updated:** 2026-10-17

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

GitHub Actions is the **only** production deploy path.

---

## Branch Previews (Cloudflare Workers Builds)

A Workers Builds Git connection on the Worker `hooxygen` deploys a Pages **preview** for every non-`main` branch. It shows up on PRs as the `Workers Builds: hooxygen` check.

| Setting | Value |
|---------|-------|
| Trigger | `Deploy non-production branches` |
| Branches | include `*`, exclude `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler pages deploy --branch=$WORKERS_CI_BRANCH` |

- Preview URL: `https://<deployment-id>.ho-gas-factory.pages.dev` (listed by `npx wrangler pages deployment list --project-name=ho-gas-factory`)
- `--branch=$WORKERS_CI_BRANCH` is required: Workers Builds checks out a detached HEAD, so without it the deploy is labelled `HEAD`
- Do **not** use `npx wrangler versions upload` here — it expects a Worker script or `[assets]` in `wrangler.toml` and always fails for this Pages project
- There is intentionally **no** `main` trigger (removed 2026-10-17); it duplicated GitHub Actions and skipped the SEO check and mailer deploy

Inspect or change the trigger with the `cf` CLI:
```bash
cf workers scripts search --name hooxygen                      # get the Worker tag (id)
cf builds triggers list --external-script-id <worker-tag>      # show triggers
cf builds triggers update <trigger-uuid> --deploy-command '...' # change a command
cf builds create <trigger-uuid> --branch <branch>              # re-run a branch build
```

---

## Required GitHub Secrets

Set these in **GitHub → Repository → Settings → Secrets and variables → Actions**:

| Secret Name | Description | How to get |
|-------------|-------------|-----------|
| `CLOUDFLARE_API_TOKEN` | API token scoped to Cloudflare Pages | CF Dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Pages" template |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | CF Dashboard → right sidebar (any page) |
| `VITE_TURNSTILE_SITE_KEY` | Public Turnstile site key (baked into JS bundle at build time) | CF Dashboard → Turnstile → Widget → Site Key |

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
| `TURNSTILE_SECRET_KEY` | Production | Turnstile secret key for server-side token verification |
| `TURNSTILE_SECRET_KEY` | Preview | CF test secret key (`1x0000000000000000000000000000000AA`) for PR preview environments |

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

> **NOTE**: Here `ho-gas-factory` must match with name in 'wrangler.toml' at repo root.

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
- [ ] Custom domain (`hooxygen.com.np`) configured in CF Pages → Custom Domains
- [ ] SSL certificate provisioned by Cloudflare (automatic once domain is added)
- [ ] Contact form tested end-to-end on production URL
- [ ] Turnstile widget created in CF Dashboard with correct hostnames
- [ ] `TURNSTILE_SECRET_KEY` set in CF Pages environment variables (Production + Preview)
- [ ] `VITE_TURNSTILE_SITE_KEY` added as GitHub secret
- [ ] Contact form tested: widget appears, submit blocked until challenge passes, email received

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

Every route is pre-rendered to its own `.html` file, so Cloudflare Pages serves them natively — there is no SPA fallback in `public/_redirects`. Unknown URLs get `dist/404.html` (from `src/pages/NotFoundPage.tsx`) with HTTP 404. Do not re-add a `/* /index.html 200` rule: it overrides `404.html` and makes every unknown URL return 200.

Post-deploy check:
```bash
curl -s -o /dev/null -w '%{http_code}\n' https://www.hooxygen.com.np/page-not-found.html   # expect 404
```

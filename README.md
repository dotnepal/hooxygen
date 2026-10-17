# HO Oxygen Website

Informational website for HO Oxygen — [https://www.hooxygen.com.np](https://www.hooxygen.com.np)

React 19 + Vite 5 (SSG) + Tailwind CSS v4, EN/NP i18n, hosted on Cloudflare Pages.

## Develop

```bash
npm ci
npm run dev          # local dev server
npm run build        # production build → dist/
npm run seo:report   # SEO checks on dist/
```

## Deploy

- **Production:** GitHub Actions deploys on push to `main` (`.github/workflows/deploy.yml`).
- **Previews:** Cloudflare Workers Builds deploys a Pages preview for every other branch.

See [`runbooks/DEPLOY.md`](runbooks/DEPLOY.md) for details.

## Configure Repository level secrets in Github Repository

    CLOUDFLARE_API_TOKEN=
    CLOUDFLARE_ACCOUNT_ID=

Visit Cloudflare dashboard [https://dash.cloudflare.com/](https://dash.cloudflare.com/)

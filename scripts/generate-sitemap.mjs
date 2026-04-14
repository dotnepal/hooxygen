/**
 * generate-sitemap.mjs
 *
 * Post-build step: generates a complete sitemap.xml for SEO with hreflang support
 * for EN/NP language alternates.
 *
 * This script:
 *  1. Defines route config with priorities and changefreq
 *  2. Gets today's date in YYYY-MM-DD format
 *  3. Generates XML with proper namespaces and hreflang links
 *  4. Writes to dist/sitemap.xml
 *
 * Run automatically as part of `npm run build`:
 *   "build": "tsc -b && vite build && node scripts/inject-scripts.mjs && node scripts/generate-sitemap.mjs"
 */

import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const DOMAIN = 'https://www.hooxygen.com.np'

const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/services', priority: '0.8', changefreq: 'monthly' },
  { path: '/products', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/faq', priority: '0.5', changefreq: 'monthly' },
]

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0]

// Build XML content
const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`
const urlsetOpen = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`

const urls = ROUTES.map((route) => {
  const loc = route.path === '/' ? DOMAIN + '/' : DOMAIN + route.path
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="ne" href="${loc}" />
  </url>`
}).join('\n')

const urlsetClose = `</urlset>`

const xmlContent = `${xmlHeader}
${urlsetOpen}
${urls}
${urlsetClose}
`

// Write to dist/sitemap.xml
const sitemapPath = join('dist', 'sitemap.xml')

await writeFile(sitemapPath, xmlContent, 'utf-8')
console.log(`[generate-sitemap] Generated sitemap.xml with ${ROUTES.length} routes`)
console.log(`[generate-sitemap] Last modified date: ${today}`)
console.log(`[generate-sitemap] Wrote to ${sitemapPath}`)
console.log('[generate-sitemap] Done.')

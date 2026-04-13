/**
 * inject-scripts.mjs
 *
 * Post-build step: vite-plugin-ssg overwrites dist/index.html with its own
 * HTML template, which does NOT include a <script> tag loading the main Vite
 * bundle. Without it, React never mounts and the site is completely static.
 *
 * This script:
 *  1. Finds the hashed main bundle in dist/assets/ (index-{hash}.js)
 *  2. Injects <script type="module" src="/assets/index-{hash}.js"> before
 *     </body> in every dist/*.html file
 *
 * Run automatically as part of `npm run build`:
 *   "build": "tsc -b && vite build && node scripts/inject-scripts.mjs"
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const distDir = 'dist'
const assetsDir = join(distDir, 'assets')

// Find the main entry chunk: index-{hash}.js
const assetFiles = await readdir(assetsDir)
const mainChunk = assetFiles.find((f) => /^index-[A-Za-z0-9_-]+\.js$/.test(f))

if (!mainChunk) {
  console.error('[inject-scripts] ERROR: Could not find main bundle (index-*.js) in dist/assets/')
  process.exit(1)
}

const scriptTag = `<script type="module" crossorigin src="/assets/${mainChunk}"></script>`
console.log(`[inject-scripts] Main bundle: ${mainChunk}`)

// Inject into every dist/*.html that does not already reference the assets bundle
const distFiles = await readdir(distDir)
const htmlFiles = distFiles.filter((f) => f.endsWith('.html'))

await Promise.all(
  htmlFiles.map(async (htmlFile) => {
    const htmlPath = join(distDir, htmlFile)
    const html = await readFile(htmlPath, 'utf-8')

    if (html.includes('/assets/index-')) {
      console.log(`[inject-scripts] Skipped  ${htmlFile} (already has bundle reference)`)
      return
    }

    await writeFile(htmlPath, html.replace('</body>', `    ${scriptTag}\n</body>`))
    console.log(`[inject-scripts] Injected ${htmlFile}`)
  }),
)

console.log('[inject-scripts] Done.')

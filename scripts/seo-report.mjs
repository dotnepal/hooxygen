#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

let failureCount = 0;
let warningCount = 0;

console.log('🔍 Running SEO checks...\n');

// Check 1: robots.txt exists
const robotsPath = path.join(distDir, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  console.log('✅ robots.txt exists');
} else {
  console.log('❌ robots.txt missing');
  failureCount++;
}

// Check 2: sitemap.xml exists and contains all 6 routes
const sitemapPath = path.join(distDir, 'sitemap.xml');
const requiredRoutes = [
  '/',
  '/services',
  '/products',
  '/about',
  '/contact',
  '/faq'
];

if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const sitemapUrl = 'https://www.hooxygen.com.np';

  let missingRoutes = [];
  requiredRoutes.forEach(route => {
    const routeUrl = route === '/' ? sitemapUrl + '/' : sitemapUrl + route;
    if (!sitemapContent.includes(`<loc>${routeUrl}</loc>`)) {
      missingRoutes.push(route);
    }
  });

  if (missingRoutes.length === 0) {
    console.log('✅ sitemap.xml exists and contains all 6 routes');
  } else {
    console.log(`❌ sitemap.xml missing routes: ${missingRoutes.join(', ')}`);
    failureCount++;
  }
} else {
  console.log('❌ sitemap.xml missing');
  failureCount++;
}

// Check 3 & 4: Check HTML files for OG meta tags and img alt attributes
const requiredOGTags = [
  'og:title',
  'og:description',
  'og:image',
  'og:url'
];

const htmlFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.html'));

console.log(`\n📄 Checking ${htmlFiles.length} HTML files for SEO meta tags...\n`);

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for OG tags
  const missingOGTags = [];
  requiredOGTags.forEach(tag => {
    if (!content.includes(`property="${tag}"`)) {
      missingOGTags.push(tag);
    }
  });

  if (missingOGTags.length === 0) {
    console.log(`  ✅ ${file} has all OG meta tags`);
  } else {
    console.log(`  ❌ ${file} missing OG tags: ${missingOGTags.join(', ')}`);
    failureCount++;
  }

  // Check for img alt attributes (warning only)
  const imgRegex = /<img[^>]*>/g;
  const imgMatches = content.match(imgRegex) || [];

  const imgsWithoutAlt = imgMatches.filter(img => !img.includes('alt='));

  if (imgsWithoutAlt.length > 0) {
    console.log(`  ⚠️  ${file} has ${imgsWithoutAlt.length} img(s) without alt attribute`);
    warningCount += imgsWithoutAlt.length;
  }
});

// Summary
console.log(`\n${'─'.repeat(50)}`);
if (failureCount === 0) {
  console.log('✓ All SEO checks passed');
  if (warningCount > 0) {
    console.log(`⚠️  ${warningCount} warning(s) found (non-critical)`);
  }
  process.exit(0);
} else {
  console.log(`✗ SEO checks failed: ${failureCount} issue(s) found`);
  process.exit(1);
}

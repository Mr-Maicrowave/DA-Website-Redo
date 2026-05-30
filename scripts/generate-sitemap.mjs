#!/usr/bin/env node
/**
 * Build-time sitemap.xml generator for DA Tuition.
 *
 * Enumerates:
 *  - Static routes (hand-maintained list; keep in sync with src/App.tsx)
 *  - Dynamic article routes from public/Articles/articles-index.json
 *  - Dynamic testimonial routes from src/data/testimonials.ts
 *
 * Writes to public/sitemap.xml. Run via `npm run sitemap` or as part of `npm run build`.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SITE_URL = 'https://datuition.com.au';

/**
 * Static routes — mirror src/App.tsx. Redirect-only routes and dead pages are excluded.
 *
 * priority: 1.0 (home) > 0.9 (core conversion pages) > 0.8 (subjects/programs) > 0.7 (content/info) > 0.5 (utility)
 * changefreq: monthly for most, weekly for articles/success stories
 */
const STATIC_ROUTES = [
    { path: '/', priority: 1.0, changefreq: 'weekly' },
    { path: '/tutoring-canley-heights', priority: 0.95, changefreq: 'monthly' },
    { path: '/tutoring-cabramatta', priority: 0.9, changefreq: 'monthly' },
    { path: '/tutoring-fairfield', priority: 0.9, changefreq: 'monthly' },
    { path: '/tutoring-canley-vale', priority: 0.9, changefreq: 'monthly' },
    { path: '/tutoring-smithfield', priority: 0.9, changefreq: 'monthly' },
    { path: '/tutoring-lansvale', priority: 0.9, changefreq: 'monthly' },
    { path: '/interview', priority: 0.9, changefreq: 'monthly' },
    { path: '/success-stories', priority: 0.9, changefreq: 'weekly' },
    { path: '/why-choose-da', priority: 0.85, changefreq: 'monthly' },
    { path: '/our-approach', priority: 0.85, changefreq: 'monthly' },
    { path: '/find-teacher', priority: 0.85, changefreq: 'monthly' },
    { path: '/hsc-excellence', priority: 0.9, changefreq: 'monthly' },
    { path: '/subjects', priority: 0.85, changefreq: 'monthly' },
    { path: '/subjects/mathematics', priority: 0.8, changefreq: 'monthly' },
    { path: '/subjects/english', priority: 0.8, changefreq: 'monthly' },
    { path: '/subjects/science', priority: 0.8, changefreq: 'monthly' },
    { path: '/subjects/business-studies', priority: 0.8, changefreq: 'monthly' },
    { path: '/subjects/legal-studies', priority: 0.8, changefreq: 'monthly' },
    { path: '/programs/primary-school', priority: 0.85, changefreq: 'monthly' },
    { path: '/programs/high-school', priority: 0.85, changefreq: 'monthly' },
    { path: '/programs/hsc', priority: 0.85, changefreq: 'monthly' },
    { path: '/learning-formats', priority: 0.75, changefreq: 'monthly' },
    { path: '/articles', priority: 0.8, changefreq: 'weekly' },
    { path: '/faq', priority: 0.75, changefreq: 'monthly' },
    { path: '/principal-reflections', priority: 0.7, changefreq: 'monthly' },
    { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
];

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function urlEntry({ path, lastmod, changefreq, priority }) {
    const loc = `${SITE_URL}${path}`;
    const parts = [`  <url>`, `    <loc>${escapeXml(loc)}</loc>`];
    if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
    if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`);
    if (priority !== undefined) parts.push(`    <priority>${priority.toFixed(2)}</priority>`);
    parts.push(`  </url>`);
    return parts.join('\n');
}

async function loadArticles() {
    try {
        const raw = await readFile(
            resolve(ROOT, 'public/Articles/articles-index.json'),
            'utf8'
        );
        const articles = JSON.parse(raw);
        return articles.map((a) => ({
            path: `/articles/${a.slug}`,
            lastmod: a.publishedDate,
            changefreq: 'monthly',
            priority: 0.7,
        }));
    } catch (err) {
        console.warn('[sitemap] Could not load articles-index.json:', err.message);
        return [];
    }
}

async function loadTestimonials() {
    try {
        // Parse testimonials.ts by extracting slug values via regex — avoids needing a TS runtime
        const raw = await readFile(resolve(ROOT, 'src/data/testimonials.ts'), 'utf8');
        const slugRegex = /slug:\s*`([^`]+)`|slug:\s*'([^']+)'|slug:\s*"([^"]+)"/g;
        const slugs = [];
        let match;
        while ((match = slugRegex.exec(raw)) !== null) {
            slugs.push(match[1] || match[2] || match[3]);
        }
        return slugs.map((slug) => ({
            path: `/testimonials/${slug}`,
            changefreq: 'yearly',
            priority: 0.5,
        }));
    } catch (err) {
        console.warn('[sitemap] Could not load testimonials:', err.message);
        return [];
    }
}

async function main() {
    const today = new Date().toISOString().slice(0, 10);

    const staticEntries = STATIC_ROUTES.map((r) => ({
        ...r,
        lastmod: today,
    }));
    const articleEntries = await loadArticles();
    const testimonialEntries = await loadTestimonials();

    const all = [...staticEntries, ...articleEntries, ...testimonialEntries];

    const xml = [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
        ...all.map(urlEntry),
        `</urlset>`,
        ``,
    ].join('\n');

    const outPath = resolve(ROOT, 'public/sitemap.xml');
    await writeFile(outPath, xml, 'utf8');

    console.log(
        `[sitemap] Wrote ${all.length} urls (` +
            `${staticEntries.length} static, ` +
            `${articleEntries.length} articles, ` +
            `${testimonialEntries.length} testimonials)` +
            ` → ${outPath}`
    );
}

main().catch((err) => {
    console.error('[sitemap] Failed:', err);
    process.exit(1);
});

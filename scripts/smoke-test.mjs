#!/usr/bin/env node
/**
 * Production smoke test.
 *
 * Loads every route from src/App.tsx in headless Chrome and fails if any
 * route renders empty or throws a runtime error. Catches the class of bug
 * that took down /programs/primary-school, /programs/high-school, and
 * /interview in April 2026 (missing imports → ReferenceError → white page).
 *
 * Usage:
 *   npm run smoke                 # against production
 *   BASE=http://localhost:8080 npm run smoke   # against local dev server
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_TSX = resolve(__dirname, '..', 'src', 'App.tsx');
const BASE = process.env.BASE || 'https://da-tuition-website.vercel.app';
const TIMEOUT_MS = 25_000;
const MIN_ROOT_CHARS = 1000;

// Patterns to ignore in console.error — third-party SDKs that fail in
// headless Chrome with no signed-in user. These aren't site bugs.
// pageerror events (real uncaught exceptions) are NEVER filtered.
const IGNORED_CONSOLE_PATTERNS = [
  /Not signed in with the identity provider/i,
  /\[GSI_LOGGER\]/,
  /FedCM/i,
  /accounts\.google\.com/,
  /Failed to load resource: the server responded with a status of (401|403|429)/,
  /Cross-Origin-Opener-Policy/,
];

function isIgnoredConsoleError(text) {
  return IGNORED_CONSOLE_PATTERNS.some((re) => re.test(text));
}

function extractRoutes() {
  const src = readFileSync(APP_TSX, 'utf8');
  const routes = new Set();
  const re = /<Route\s+path="([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const path = m[1];
    if (path === '*') continue;
    if (path.includes(':')) continue; // skip dynamic routes (need real slugs)
    routes.add(path);
  }
  return [...routes].sort();
}

async function checkRoute(browser, route) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  const errors = [];
  const failedRequests = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (isIgnoredConsoleError(text)) return;
    errors.push(`console.error: ${text}`);
  });
  page.on('requestfailed', (req) => {
    failedRequests.push(`${req.method()} ${req.url()} -- ${req.failure()?.errorText ?? 'unknown'}`);
  });

  try {
    await page.goto(`${BASE}${route}`, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT_MS,
    });
    // Wait for React to mount (#root populated) instead of fixed sleep
    try {
      await page.waitForFunction(
        () => (document.getElementById('root')?.innerHTML.length ?? 0) > 500,
        { timeout: 8000 }
      );
    } catch {
      // continue — we'll report whatever rootLen ended up at
    }
    const rootLen = await page.evaluate(
      () => document.getElementById('root')?.innerHTML.length ?? 0
    );

    const ok = rootLen >= MIN_ROOT_CHARS && errors.length === 0;
    return { route, ok, rootLen, errors, failedRequests };
  } catch (err) {
    return {
      route,
      ok: false,
      rootLen: 0,
      errors: [String(err.message ?? err)],
      failedRequests,
    };
  } finally {
    await page.close();
  }
}

async function main() {
  const routes = extractRoutes();
  console.log(`\n→ Smoke testing ${routes.length} routes against ${BASE}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    // CI runners (GitHub Actions ubuntu-24.04) restrict user namespaces,
    // so Chrome's sandbox can't initialize. Safe to disable in CI because
    // the runner is already an isolated VM and we only load our own URL.
    args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  });
  const results = [];
  for (const route of routes) {
    process.stdout.write(`  ${route.padEnd(38)} `);
    const result = await checkRoute(browser, route);
    results.push(result);
    process.stdout.write(
      result.ok
        ? `OK (${result.rootLen} chars)\n`
        : `BROKEN (${result.errors[0]?.slice(0, 80) ?? 'empty root'})\n`
    );
  }
  await browser.close();

  const broken = results.filter((r) => !r.ok);
  console.log(
    `\n→ Result: ${results.length - broken.length}/${results.length} passed`
  );

  if (broken.length > 0) {
    console.log('\nBROKEN ROUTES:');
    for (const b of broken) {
      console.log(`\n  ${b.route} (rootLen=${b.rootLen})`);
      for (const e of b.errors) console.log(`    error: ${e.slice(0, 250)}`);
      for (const r of (b.failedRequests || []).slice(0, 5)) {
        console.log(`    failed: ${r.slice(0, 250)}`);
      }
    }
    process.exit(1);
  }

  console.log('✅ All routes healthy.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const baseUrl = process.env.TUTORBOOK_STUDIO_URL ?? 'http://127.0.0.1:4178';
const outputDir = fileURLToPath(
  new URL('../artifacts/tutor-library/complete-shelf-prototype-visual-gate/', import.meta.url),
);
const captures = [
  ['A-open', 'open'],
  ['B-turn-25-front', 'page-turn-25'],
  ['C-turn-25-top', 'page-turn-25', 'turn-top-oblique'],
  ['D-turn-50-front', 'page-turning'],
  ['E-turn-50-top', 'page-turning', 'turn-top-oblique'],
  ['F-turn-50-close', 'page-turning', 'turn-close'],
  ['G-turn-75-front', 'page-turn-75'],
  ['H-turn-75-top', 'page-turn-75', 'turn-top-oblique'],
  ['I-page-settled', 'page-settled'],
  ['J-closed-returned-front', 'closed-returned'],
  ['K-closed-returned-spine', 'closed-spine'],
  ['L-closed-returned-top', 'closed-returned', 'open-top-oblique'],
];
const requestedState = process.env.TUTORBOOK_CAPTURE_STATE;
const requestedName = process.env.TUTORBOOK_CAPTURE_NAME;
const requestedCaptures = requestedName
  ? captures.filter(([name]) => name === requestedName)
  : requestedState
    ? captures.filter(([, state]) => state === requestedState)
    : captures;

if ((requestedState || requestedName) && requestedCaptures.length === 0) {
  throw new Error(`Unknown TutorBook capture request: ${requestedName ?? requestedState}`);
}

await fs.mkdir(outputDir, { recursive: true });
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  for (const [name, state, camera, collisionDebug] of requestedCaptures) {
    const cameraQuery = camera && camera !== 'default' ? `&bookEngineCamera=${camera}` : '';
    const debugQuery = collisionDebug ? '&bookCollisionDebug=1' : '';
    await page.goto(`${baseUrl}/tutors?tutor-book-studio=1&bookEngineState=${state}${cameraQuery}${debugQuery}`, { waitUntil: 'domcontentloaded', timeout: 20_000 }).catch(() => undefined);
    await page.waitForSelector('[aria-label="TutorBook prototype states"]', { timeout: 45_000 });
    await new Promise(resolve => setTimeout(resolve, 2_500));
    await page.screenshot({ path: path.join(outputDir, `${name}.png`) });
    console.log(`captured ${name}`);
  }
} finally {
  await browser.close();
}

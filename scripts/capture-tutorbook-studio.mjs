import fs from 'node:fs/promises';
import puppeteer from 'puppeteer';

const baseUrl = process.env.TUTORBOOK_STUDIO_URL ?? 'http://127.0.0.1:8083';
const outputDir = new URL('../artifacts/tutor-library/tutorbook-v2-studio/', import.meta.url);
const captures = [
  ['A-front-three-quarter', 'front'], ['B-rear-three-quarter', 'rear'],
  ['C-top-head-view', 'top'], ['D-fore-edge-view', 'fore'],
  ['E-spine-close-up', 'spine'], ['F-front-cover-close-up', 'cover'],
  ['G-three-book-material-comparison', 'shelf'], ['H-normal-shelf-distance', 'shelf'],
  ['I-spine-typography-normal', 'typography'], ['I-spine-typography-close', 'typography-close'],
];

await fs.mkdir(outputDir, { recursive: true });
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  for (const [name, view] of captures) {
    await page.goto(`${baseUrl}/tutors?tutor-book-studio=1&studioView=${view}`, { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await new Promise(resolve => setTimeout(resolve, 3_000));
    await page.screenshot({ path: new URL(`${name}.png`, outputDir).pathname });
    console.log(`captured ${name}`);
  }
} finally {
  await browser.close();
}

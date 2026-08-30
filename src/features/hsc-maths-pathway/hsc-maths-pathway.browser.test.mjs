import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { createServer } from 'vite';

let browser;
let server;
let baseUrl;

before(async () => {
  server = await createServer({ logLevel: 'silent', server: { host: '127.0.0.1', port: 0 } });
  await server.listen();
  const address = server.httpServer?.address();
  assert.ok(address && typeof address === 'object');
  baseUrl = `http://127.0.0.1:${address.port}`;
  browser = await puppeteer.launch({ headless: true, args: process.env.CI ? ['--no-sandbox'] : [] });
}, { timeout: 30_000 });

after(async () => { await browser?.close(); await server?.close(); });

async function openPathway(viewport, reducedMotion = false) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(`${baseUrl}/subjects/mathematics#hsc-maths`, { waitUntil: 'domcontentloaded' });
  const skip = await page.$('[aria-labelledby="maths-intro-video-title"] button');
  if (skip) await skip.click();
  await page.waitForSelector('#hsc-maths');
  await page.$eval('#hsc-maths', (element) => element.scrollIntoView({ block: 'start' }));
  return page;
}

async function selectCourse(page, label) {
  const selected = await page.$$eval('#hsc-maths [role="tab"]', (buttons, expected) => {
    const button = buttons.find((candidate) => candidate.textContent?.includes(expected));
    if (!(button instanceof HTMLButtonElement)) return false;
    button.click();
    return true;
  }, label);
  assert.equal(selected, true, `Expected a course control for ${label}`);
}

test('desktop pathway presents every course and keeps the selected detail inside the viewport', { timeout: 30_000 }, async () => {
  const page = await openPathway({ width: 1440, height: 900 });
  try {
    assert.equal(await page.$$eval('.hsc-pathway-ladder [role="tab"]', (nodes) => nodes.length), 4);
    assert.match(await page.$eval('#hsc-course-guide', (node) => node.textContent ?? ''), /Standard 1/);
    const geometry = await page.$eval('#hsc-maths', (node) => { const rect = node.getBoundingClientRect(); return { width: rect.width, scrollWidth: node.scrollWidth }; });
    assert.ok(geometry.scrollWidth <= geometry.width + 1);
  } finally { await page.close(); }
});

test('every course updates the detail and preserves the actual prerequisite path', { timeout: 30_000 }, async () => {
  const page = await openPathway({ width: 1440, height: 900 });
  try {
    for (const [course, detail] of [['Standard 1 & 2', 'Standard 1'], ['Advanced', 'Advanced'], ['Extension 1', 'Extension 1'], ['Extension 2', 'Extension 2']]) {
      await selectCourse(page, course);
      assert.match(await page.$eval('#hsc-course-guide', (node) => node.textContent ?? ''), new RegExp(detail.replace(/[&]/g, '\\&')));
    }
    await selectCourse(page, 'Standard 1 & 2');
    await selectCourse(page, 'Standard 2');
    assert.match(await page.$eval('#hsc-course-guide', (node) => node.textContent ?? ''), /Standard 2/);
    assert.equal(await page.$eval('[data-course-path="advanced"] [role="tab"]', (node) => node.classList.contains('is-on-path')), true);
    assert.equal(await page.$eval('[data-course-path="extension-1"] [role="tab"]', (node) => node.classList.contains('is-on-path')), true);
  } finally { await page.close(); }
});

test('progressive details are keyboard-operable and reduced motion preserves the selected state', { timeout: 30_000 }, async () => {
  const page = await openPathway({ width: 390, height: 844 }, true);
  try {
    await selectCourse(page, 'Extension 1');
    await page.focus('#hsc-course-guide [role="tab"]:nth-of-type(3)');
    await page.keyboard.press('Enter');
    assert.match(await page.$eval('.hsc-pathway-detail__explore-panel', (node) => node.textContent ?? ''), /Challenges & DA help/);
    assert.equal(await page.$eval('[data-course-path="extension-1"] [role="tab"]', (node) => node.getAttribute('aria-selected')), 'true');
    const widths = await page.$eval('#hsc-maths', (node) => ({ width: node.clientWidth, scrollWidth: node.scrollWidth }));
    assert.ok(widths.scrollWidth <= widths.width + 1);
  } finally { await page.close(); }
});

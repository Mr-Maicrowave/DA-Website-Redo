import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { createServer } from 'vite';

const server = await createServer({ logLevel: 'silent', server: { host: '127.0.0.1', port: 0 } });
let browser;
try {
  await server.listen();
  const address = server.httpServer?.address();
  assert.ok(address && typeof address !== 'string');
  browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', message => console.error(`Browser console: ${message.text()}`));
  page.on('pageerror', error => console.error(`Browser page error: ${error.message}`));
  await page.setRequestInterception(true);
  page.on('request', request => request.url().includes('google') ? void request.abort() : void request.continue());
  await page.goto(`http://127.0.0.1:${address.port}/src/features/tutor-library/tutor-library-controls.fixture.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-edition-id="T003:primary"]');

  const book = '[data-edition-id="T003:primary"]';
  await page.$eval(book, element => element.click());
  await page.focus(book);
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await page.focus('.tutor-library__wall-nav button:not(:disabled)');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  assert.deepEqual((await page.evaluate(() => window.tutorLibraryFixture.events)).filter(event => event.includes('keyboard-activate')), [
    'book:T003:primary:keyboard-activate',
    'book:T003:primary:keyboard-activate',
    'book:T003:primary:keyboard-activate',
  ]);
  assert.ok((await page.evaluate(() => window.tutorLibraryFixture.events)).includes('cancel:T003:primary'));
  assert.ok((await page.evaluate(() => window.tutorLibraryFixture.events)).includes('turn:mathematics'));
  assert.ok((await page.evaluate(() => window.tutorLibraryFixture.events)).includes('escape'));

  await page.evaluate(() => window.tutorLibraryFixture.setPhase('BOOK_READING'));
  await page.evaluate(() => window.tutorLibraryFixture.setPage(0));
  const previousPage = '[aria-label="Previous tutor profile page"]';
  const nextPage = '[aria-label="Next tutor profile page"]';
  assert.equal(await page.$eval(previousPage, element => element.disabled), true);
  assert.equal(await page.$eval(nextPage, element => element.disabled), false);
  await page.$eval(nextPage, element => element.click());
  await page.focus('.tutor-library__reader');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('PageDown');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('PageUp');
  await page.$eval('.tutor-library__reader', element => {
    element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 180, clientY: 120, pointerId: 4, isPrimary: true }));
    element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 100, clientY: 126, pointerId: 4, isPrimary: true }));
  });
  assert.deepEqual((await page.evaluate(() => window.tutorLibraryFixture.events)).filter(event => event.startsWith('page:')), [
    'page:1', 'page:1', 'page:1', 'page:-1', 'page:-1', 'page:1',
  ]);
  assert.match(await page.$eval('.tutor-library__page-status', element => element.textContent ?? ''), /Page 3 of 6/i);

  const disabledBook = '[data-edition-id="T009:primary"]';
  assert.equal(await page.$eval(disabledBook, element => element.disabled), true);
  const eventCount = await page.evaluate(() => window.tutorLibraryFixture.events.length);
  await page.$eval(disabledBook, element => element.click());
  assert.equal(await page.evaluate(() => window.tutorLibraryFixture.events.length), eventCount);

  await page.evaluate(() => window.tutorLibraryFixture.setPhase('ROOM_IDLE'));
  await page.focus('.tutor-library__wall-nav button:not(:disabled)');
  const beforeFocusReturn = await page.evaluate(() => window.tutorLibraryFixture.events.length);
  await page.evaluate(() => window.tutorLibraryFixture.setFocusReturn('T003:primary'));
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-edition-id')), 'T003:primary');
  assert.equal(await page.evaluate(() => window.tutorLibraryFixture.events.length), beforeFocusReturn);

  await page.evaluate(() => window.tutorLibraryFixture.setFailure(true));
  assert.deepEqual(await page.$eval('.tutor-library__controls', element => ({ inert: element.hasAttribute('inert'), ariaDisabled: element.getAttribute('aria-disabled'), enabled: element.querySelectorAll('button:not(:disabled)').length })), { inert: true, ariaDisabled: 'true', enabled: 0 });
  assert.equal(await page.$eval('.tutor-library__fallback a', element => element.getAttribute('href')), '/find-teacher?tutor=T003');
  console.log('Tutor Library semantic DOM controls: PASS');
} finally {
  if (browser) await browser.close();
  await server.close();
}

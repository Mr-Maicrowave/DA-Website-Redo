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

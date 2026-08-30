import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { createServer } from 'vite';

const server = await createServer({ logLevel: 'silent', server: { host: '127.0.0.1', port: 0 } });
let browser;
try {
  await server.listen();
  const address = server.httpServer?.address();
  assert.ok(address && typeof address !== 'string');
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  page.on('console', message => console.error(`Browser console: ${message.text()}`));
  page.on('pageerror', error => console.error(`Browser page error: ${error.message}`));
  await page.setRequestInterception(true);
  page.on('request', request => request.url().includes('google') ? void request.abort() : void request.continue());
  await page.goto(`http://127.0.0.1:${address.port}/src/features/tutor-library/tutor-library-controls.fixture.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.tutor-library__controls');
  assert.equal(await page.$$eval('.tutor-library__book-control', elements => elements.length), 0, 'the bottom surface must not render every tutor name');
  assert.equal(await page.$$eval('.tutor-library__tutor-picker select', elements => elements.length), 1, 'tutors remain available through one progressive-disclosure picker');

  const picker = '.tutor-library__tutor-picker select';
  await page.select(picker, 'T003:primary');
  await page.focus('.tutor-library__wall-nav button:not(:disabled)');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  assert.deepEqual((await page.evaluate(() => window.tutorLibraryFixture.events)).filter(event => event.includes('keyboard-activate')), [
    'book:T003:primary:keyboard-activate',
  ]);
  assert.ok((await page.evaluate(() => window.tutorLibraryFixture.events)).includes('turn:mathematics'));
  assert.ok((await page.evaluate(() => window.tutorLibraryFixture.events)).includes('escape'));

  await page.evaluate(() => window.tutorLibraryFixture.setPhase('BOOK_READING'));
  await page.evaluate(() => window.tutorLibraryFixture.setPage(0));
  await new Promise(resolve => setTimeout(resolve, 350));
  assert.deepEqual(await page.$eval('.tutor-library__copy', element => ({
    ariaHidden: element.getAttribute('aria-hidden'),
    visibility: getComputedStyle(element).visibility,
    opacity: getComputedStyle(element).opacity,
  })), { ariaHidden: 'true', visibility: 'hidden', opacity: '0' });
  assert.deepEqual(await page.$eval('.tutor-library', element => ({
    ariaLabel: element.getAttribute('aria-label'),
    ariaLabelledBy: element.getAttribute('aria-labelledby'),
  })), { ariaLabel: 'Mrs Jenny N. tutor library reader', ariaLabelledBy: null });
  assert.equal(await page.$eval('.tutor-library__reader', element => element.getAttribute('aria-label')), 'Mrs Jenny N. tutor book controls');
  assert.equal(await page.$eval('.tutor-library__tutor-picker', element => getComputedStyle(element).display), 'none', 'the picker yields to the selected-book reader');
  const previousPage = '[aria-label="Previous tutor profile page"]';
  const nextPage = '[aria-label="Next tutor profile page"]';
  assert.equal(await page.$eval(previousPage, element => element.disabled), true);
  assert.equal(await page.$eval(nextPage, element => element.disabled), false);
  await page.$eval(nextPage, element => element.click());
  await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : undefined));
  await page.keyboard.press('ArrowRight');
  await page.focus('.tutor-library__reader');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('PageDown');
  await page.keyboard.press('ArrowLeft');
  await page.$eval('.tutor-library__reader', element => {
    element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 180, clientY: 120, pointerId: 4, isPrimary: true }));
    element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 100, clientY: 126, pointerId: 4, isPrimary: true }));
  });
  assert.deepEqual((await page.evaluate(() => window.tutorLibraryFixture.events)).filter(event => event.startsWith('page:')), [
    'page:1', 'page:-1', 'page:1',
  ]);
  assert.match(await page.$eval('.tutor-library__page-status', element => element.textContent ?? ''), /Spread 2 of 2/i);

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const mobileReadingLayout = await page.evaluate(() => {
    const reader = document.querySelector('.tutor-library__reader');
    const picker = document.querySelector('.tutor-library__tutor-picker');
    const actions = document.querySelector('.tutor-library__reader-actions');
    if (!(reader instanceof HTMLElement) || !(picker instanceof HTMLElement) || !(actions instanceof HTMLElement)) return null;
    const readerRect = reader.getBoundingClientRect();
    const actionButtons = [...actions.querySelectorAll('button, a')].map(element => element.getBoundingClientRect().height);
    return {
      libraryHeight: Math.round(document.querySelector('.tutor-library')?.getBoundingClientRect().height ?? 0),
      readerBottom: Math.round(innerHeight - readerRect.bottom),
      readerHeight: Math.round(readerRect.height),
      pickerDisplay: getComputedStyle(picker).display,
      actionColumns: getComputedStyle(actions).gridTemplateColumns.split(' ').length,
      minimumActionHeight: Math.min(...actionButtons),
      horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  assert.ok(mobileReadingLayout);
  assert.ok(mobileReadingLayout.libraryHeight <= 780, 'the library must fit beneath the mobile site navigation without forcing focus-scroll');
  assert.equal(mobileReadingLayout.pickerDisplay, 'none', 'the compact tutor picker must not cover the reading book on mobile');
  assert.equal(mobileReadingLayout.actionColumns, 1, 'the inline toolbar preserves an unambiguous reading order on mobile');
  assert.ok(mobileReadingLayout.readerHeight <= 390, 'mobile reader panel must leave the upper canvas readable');
  assert.ok(mobileReadingLayout.minimumActionHeight >= 44, 'mobile action targets remain at least 44 CSS pixels');
  assert.ok(mobileReadingLayout.readerBottom >= 52, 'wall navigation remains separately reachable below the reader');
  assert.ok(mobileReadingLayout.horizontalOverflow <= 0, 'mobile controls cannot introduce horizontal scrolling');
  await page.evaluate(() => window.tutorLibraryFixture.setPage(1));
  assert.equal(await page.$eval(nextPage, element => element.disabled), true);
  assert.match(await page.$eval('.tutor-library__page-status', element => element.textContent ?? ''), /Spread 2 of 2/i);

  assert.equal(await page.$eval(picker, element => element.disabled), true);
  const eventCount = await page.evaluate(() => window.tutorLibraryFixture.events.length);
  await page.select(picker, 'T009:primary');
  assert.equal(await page.evaluate(() => window.tutorLibraryFixture.events.length), eventCount);

  await page.evaluate(() => window.tutorLibraryFixture.setPhase('ROOM_IDLE'));
  await page.focus('.tutor-library__wall-nav button:not(:disabled)');
  const beforeFocusReturn = await page.evaluate(() => window.tutorLibraryFixture.events.length);
  await page.evaluate(() => window.tutorLibraryFixture.setFocusReturn('T003:primary'));
  assert.equal(await page.evaluate(() => document.activeElement?.matches('.tutor-library__tutor-picker select')), true);
  assert.equal(await page.evaluate(() => window.tutorLibraryFixture.events.length), beforeFocusReturn);

  await page.evaluate(() => window.tutorLibraryFixture.setFailure(true));
  assert.deepEqual(await page.$eval('.tutor-library__controls', element => ({ inert: element.hasAttribute('inert'), ariaDisabled: element.getAttribute('aria-disabled'), enabled: element.querySelectorAll('button:not(:disabled)').length })), { inert: true, ariaDisabled: 'true', enabled: 0 });
  assert.equal(await page.$eval('.tutor-library__fallback a', element => element.getAttribute('href')), '/find-teacher?tutor=T003');

  console.log('Tutor Library semantic DOM controls: PASS');
} finally {
  if (browser) await browser.close();
  await server.close();
}

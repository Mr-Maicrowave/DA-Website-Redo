import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { createServer } from 'vite';

let browser;
let server;
let baseUrl;

before(async () => {
  server = await createServer({
    logLevel: 'silent',
    server: { host: '127.0.0.1', port: 0 },
  });
  await server.listen();
  const address = server.httpServer?.address();
  assert.ok(address && typeof address === 'object');
  baseUrl = `http://127.0.0.1:${address.port}`;
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}, { timeout: 60_000 });

after(async () => {
  await browser?.close();
  await server?.close();
});

async function openStaticStory({ reducedMotion = false } = {}) {
  const page = await browser.newPage();
  const consoleMessages = [];

  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warn') {
      consoleMessages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => consoleMessages.push(`pageerror: ${error.message}`));

  await page.setViewport({ width: 390, height: 844 });
  await page.evaluateOnNewDocument(() => sessionStorage.setItem('da-maths-intro-played', '1'));
  if (reducedMotion) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  await page.goto(`${baseUrl}/subjects/mathematics`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.maths-syllabus-story');

  await page.$eval('.maths-syllabus-story', (element) => element.scrollIntoView({ block: 'start' }));
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

  return { page, consoleMessages };
}

function relevantConsoleMessages(messages) {
  return messages.filter((message) => !(
    message.includes('unsupported `as` value')
    || message.includes('ERR_NETWORK_ACCESS_DENIED')
    || message.includes('Reduced Motion enabled on your device')
  ));
}

async function readStaticStoryState(page) {
  return page.$eval('.maths-syllabus-story', (element) => {
    const plates = [...element.querySelectorAll('.maths-syllabus-story__plate')];
    const beats = [...element.querySelectorAll('.maths-syllabus-story__beat')];
    const visual = element.querySelector('.maths-syllabus-story__visual');
    const heading = element.querySelector('#maths-syllabus-story-heading');
    const overlay = element.querySelector('.maths-syllabus-story__overlay');
    const sticky = element.querySelector('.maths-syllabus-story__sticky');

    return {
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      visiblePlateIds: plates
        .filter((plate) => getComputedStyle(plate).display !== 'none')
        .map((plate) => plate.getAttribute('data-plate')),
      overlayDisplay: overlay ? getComputedStyle(overlay).display : null,
      beatCount: beats.length,
      visibleBeatCount: beats.filter((beat) => {
        const styles = getComputedStyle(beat);
        return styles.display !== 'none' && styles.visibility !== 'hidden' && Number(styles.opacity) > 0;
      }).length,
      stickyPosition: sticky ? getComputedStyle(sticky).position : null,
      visualBeforeHeading: Boolean(
        visual
        && heading
        && visual.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING
      ),
      pinSpacers: document.querySelectorAll('.pin-spacer').length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  });
}

test('mobile renders one representative plate followed by all six explanations', { timeout: 60_000 }, async () => {
  const { page, consoleMessages } = await openStaticStory();

  try {
    const state = await readStaticStoryState(page);

    assert.deepEqual(state.visiblePlateIds, ['explore']);
    assert.equal(state.overlayDisplay, 'block');
    assert.equal(state.beatCount, 6);
    assert.equal(state.visibleBeatCount, 6);
    assert.equal(state.stickyPosition, 'static');
    assert.equal(state.visualBeforeHeading, true);
    assert.equal(state.pinSpacers, 0);
    assert.ok(state.scrollWidth <= state.clientWidth);
    assert.deepEqual(relevantConsoleMessages(consoleMessages), []);
  } finally {
    await page.close();
  }
});

test('reduced motion renders the completed static state without pinning', { timeout: 60_000 }, async () => {
  const { page, consoleMessages } = await openStaticStory({ reducedMotion: true });

  try {
    const state = await readStaticStoryState(page);

    assert.equal(state.reducedMotion, true);
    assert.deepEqual(state.visiblePlateIds, ['explore']);
    assert.equal(state.overlayDisplay, 'block');
    assert.equal(state.beatCount, 6);
    assert.equal(state.visibleBeatCount, 6);
    assert.equal(state.stickyPosition, 'static');
    assert.equal(state.visualBeforeHeading, true);
    assert.equal(state.pinSpacers, 0);
    assert.ok(state.scrollWidth <= state.clientWidth);
    assert.deepEqual(relevantConsoleMessages(consoleMessages), []);

    if (process.env.MATHS_STORY_QA_SCREENSHOT) {
      await page.screenshot({ path: process.env.MATHS_STORY_QA_SCREENSHOT, fullPage: false });
    }
  } finally {
    await page.close();
  }
});

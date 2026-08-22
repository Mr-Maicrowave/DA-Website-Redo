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

test('legacy tutor deep link keeps its query and opens the requested profile', { timeout: 60_000 }, async () => {
  const page = await browser.newPage();

  try {
    await page.goto(`${baseUrl}/find-teacher?tutor=T010`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.location.pathname === '/tutors');

    const location = await page.evaluate(() => ({
      pathname: window.location.pathname,
      search: window.location.search,
    }));
    assert.deepEqual(location, { pathname: '/tutors', search: '?tutor=T010' });

    await page.waitForSelector('[role="dialog"][aria-labelledby="full-profile-name"]');
    assert.equal(
      await page.$eval('#full-profile-name', (heading) => heading.textContent),
      'Mr Danny Q.',
    );
  } finally {
    await page.close();
  }
});

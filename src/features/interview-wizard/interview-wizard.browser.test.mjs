import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4175';

async function clickButton(page, label) {
  const clicked = await page.evaluate((text) => {
    const button = [...document.querySelectorAll('button')]
      .find((candidate) => candidate.textContent?.trim() === text);
    button?.click();
    return Boolean(button);
  }, label);
  assert.equal(clicked, true, `Expected a button labelled “${label}”.`);
}

async function hasButton(page, label) {
  return page.evaluate((text) => [...document.querySelectorAll('button')]
    .some((candidate) => candidate.textContent?.trim() === text), label);
}

async function selectYear(page, year) {
  await page.select('#school-year', String(year));
}

test('adapts the interview journey for primary, high-school and HSC students', async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(120_000);

  try {
    await page.goto(`${baseUrl}/book-interview`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#parent-first-name');
    await page.type('#parent-first-name', 'Alex');
    await page.type('#parent-last-name', 'Tester');
    await page.type('#parent-email', 'alex.tester@example.com');
    await page.type('#parent-mobile', '0412345678');
    await page.type('#student-first-name', 'Jordan');

    await selectYear(page, 3);
    await clickButton(page, 'Continue');
    assert.equal(await hasButton(page, 'Creative Writing'), true);

    await clickButton(page, 'Back');
    await selectYear(page, 8);
    await clickButton(page, 'Continue');
    assert.equal(await hasButton(page, 'Science'), true);

    await clickButton(page, 'Back');
    await selectYear(page, 12);
    await clickButton(page, 'Continue');
    assert.equal(await hasButton(page, 'Science'), false);
    assert.equal(await hasButton(page, 'Physics'), true);

    await clickButton(page, 'Mathematics');
    await clickButton(page, 'English');
    await clickButton(page, 'Continue');
    await clickButton(page, 'They know the content but lose marks in assessments.');
    await new Promise((resolve) => setTimeout(resolve, 350));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('h2')?.textContent?.includes('What is happening right now?'));

    assert.match(await page.locator('h2').map((heading) => heading.textContent).wait(), /What is happening right now/);
    assert.equal(await page.$eval('button[aria-pressed="true"]', (button) => button.textContent?.trim()), 'They know the content but lose marks in assessments.');
  } finally {
    await browser.close();
  }
});

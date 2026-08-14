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
  const isolatedRunner = process.env.CI || process.env.CODEX_CI;
  browser = await puppeteer.launch({
    headless: true,
    args: isolatedRunner ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  });
}, { timeout: 30_000 });

after(async () => {
  await browser?.close();
  await server?.close();
});

async function openPathway({ width, height, reducedMotion = false }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  if (reducedMotion) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  await page.goto(`${baseUrl}/subjects/mathematics#hsc-maths`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForSelector('#hsc-maths');

  const skipIntro = await page.$('[aria-labelledby="maths-intro-video-title"] button');
  if (skipIntro) {
    await skipIntro.click();
    await page.waitForSelector('[aria-labelledby="maths-intro-video-title"]', { hidden: true });
  }

  await page.$eval('#hsc-maths', (section) => {
    document.documentElement.style.scrollBehavior = 'auto';
    section.scrollIntoView({ block: 'start' });
  });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  return page;
}

async function clickButtonByText(page, selector, label) {
  const clicked = await page.$$eval(selector, (buttons, expectedLabel) => {
    const button = buttons.find((candidate) => candidate.textContent?.includes(expectedLabel));
    if (!(button instanceof HTMLButtonElement)) return false;
    button.click();
    return true;
  }, label);
  assert.equal(clicked, true, `Expected ${selector} button containing ${label}`);
}

async function tabToSelector(page, selector, maxTabs = 200) {
  for (let index = 0; index < maxTabs; index += 1) {
    if (await page.evaluate((target) => document.activeElement?.matches(target) ?? false, selector)) return;
    await page.keyboard.press('Tab');
  }
  assert.fail(`Tab did not reach ${selector} within ${maxTabs} presses`);
}

test('desktop selection keeps full routes aligned and the primary CTA above the fold', { timeout: 30_000 }, async () => {
  for (const viewport of [{ width: 1900, height: 1080 }, { width: 1440, height: 1000 }]) {
    const page = await openPathway(viewport);
    try {
      const result = await page.evaluate(async () => {
        const routeBefore = document.querySelector('[data-route-segment="advanced"]');
        const buttons = [...document.querySelectorAll('#hsc-maths button[aria-pressed]')];
        const extensionButton = buttons.find((button) => button.textContent?.includes('Extension 1'));
        if (!(extensionButton instanceof HTMLButtonElement)) throw new Error('Extension 1 button missing');
        extensionButton.click();
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        const pressed = buttons.filter((button) => button.getAttribute('aria-pressed') === 'true');
        const cta = document.querySelector('#hsc-maths a[href="/book-interview"]');
        if (!(cta instanceof HTMLAnchorElement)) throw new Error('Primary CTA missing');
        const kicker = [...document.querySelectorAll('#hsc-maths p')]
          .find((paragraph) => paragraph.textContent?.trim() === 'HSC pathway map');
        if (!(kicker instanceof HTMLParagraphElement)) throw new Error('Pathway kicker missing');
        const fixedNav = [...document.querySelectorAll('nav')]
          .find((nav) => {
            const rect = nav.getBoundingClientRect();
            return rect.height > 0 && rect.top <= 0.5 && rect.bottom > 0;
          });
        if (!(fixedNav instanceof HTMLElement)) throw new Error('Visible fixed navigation missing');
        const ctaRect = cta.getBoundingClientRect();
        const kickerRect = kicker.getBoundingClientRect();
        const navRect = fixedNav.getBoundingClientRect();
        const year10 = [...document.querySelectorAll('#hsc-maths span')]
          .find((label) => label.textContent?.trim() === 'Year 10' && label.getBoundingClientRect().width > 0);
        const advancedRoute = document.querySelector('[data-route-segment="advanced"] path');
        const extensionTwoRoute = document.querySelector('[data-route-segment="extension-2"] path');
        const routeSvg = document.querySelector('#hsc-maths svg[viewBox="0 0 520 560"]');
        const routeGlow = document.querySelector('#hsc-pathway-glow');
        const year12Threshold = document.querySelector('[aria-label="Year 12 threshold"]');
        const availabilityCaption = [...document.querySelectorAll('#hsc-maths p')]
          .find((paragraph) => paragraph.textContent?.trim() === 'Extension 2 becomes available');
        if (!(year10 instanceof HTMLSpanElement)) throw new Error('Visible Year 10 label missing');
        if (!(advancedRoute instanceof SVGPathElement)) throw new Error('Advanced route missing');
        if (!(extensionTwoRoute instanceof SVGPathElement)) throw new Error('Extension 2 route missing');
        if (!(routeSvg instanceof SVGSVGElement)) throw new Error('Route SVG missing');
        if (!(routeGlow instanceof SVGFilterElement)) throw new Error('Route glow filter missing');
        if (!(year12Threshold instanceof HTMLDivElement)) throw new Error('Year 12 threshold missing');
        if (!(availabilityCaption instanceof HTMLParagraphElement)) throw new Error('Availability caption missing');
        const routeStart = advancedRoute.getPointAtLength(0).matrixTransform(advancedRoute.getScreenCTM());
        const year10Rect = year10.getBoundingClientRect();
        const activeRoutePaths = [...document.querySelectorAll('[data-route-active="true"] path')];
        const availabilityRect = availabilityCaption.getBoundingClientRect();
        const extensionTwoLength = extensionTwoRoute.getTotalLength();
        let routeAtCaption = extensionTwoRoute.getPointAtLength(0).matrixTransform(extensionTwoRoute.getScreenCTM());
        for (let index = 1; index <= 200; index += 1) {
          const point = extensionTwoRoute
            .getPointAtLength((extensionTwoLength * index) / 200)
            .matrixTransform(extensionTwoRoute.getScreenCTM());
          if (Math.abs(point.y - (availabilityRect.top + availabilityRect.height / 2))
            < Math.abs(routeAtCaption.y - (availabilityRect.top + availabilityRect.height / 2))) {
            routeAtCaption = point;
          }
        }
        return {
          buttonCount: buttons.length,
          pressedCount: pressed.length,
          pressedText: pressed[0]?.textContent ?? '',
          heading: document.querySelector('[aria-labelledby^="hsc-stream-desktop-heading"] h3')?.textContent ?? '',
          routeCount: document.querySelectorAll('[data-route-segment]').length,
          routePersisted: routeBefore === document.querySelector('[data-route-segment="advanced"]'),
          activeRoute: document.querySelector('[data-route-segment="advanced"]')?.getAttribute('data-route-active'),
          activeRoutesAreSolid: activeRoutePaths.every((path) => getComputedStyle(path).strokeDasharray === 'none'),
          year10Right: year10Rect.right,
          year10CenterY: year10Rect.top + year10Rect.height / 2,
          routeStartX: routeStart.x,
          routeStartY: routeStart.y,
          glowFilterUnits: routeGlow.getAttribute('filterUnits'),
          routeZIndex: Number(getComputedStyle(routeSvg).zIndex) || 0,
          thresholdZIndex: Number(getComputedStyle(year12Threshold).zIndex) || 0,
          availabilityZIndex: Number(getComputedStyle(availabilityCaption).zIndex) || 0,
          availabilityLeft: availabilityRect.left,
          routeAtCaptionX: routeAtCaption.x,
          kickerTop: kickerRect.top,
          navBottom: navRect.bottom,
          ctaTop: ctaRect.top,
          ctaBottom: ctaRect.bottom,
          viewportHeight: window.innerHeight,
        };
      });

      assert.equal(result.buttonCount, 4);
      assert.equal(result.pressedCount, 1);
      assert.match(result.pressedText, /Extension 1/);
      assert.equal(result.heading, 'Extension 1 at a glance');
      assert.equal(result.routeCount, 4);
      assert.equal(result.routePersisted, true);
      assert.equal(result.activeRoute, 'true');
      assert.ok(result.routeZIndex > result.thresholdZIndex, 'Active route should paint above the Year 12 divider');
      assert.ok(result.availabilityZIndex > result.routeZIndex, 'Availability caption should remain above the route');
      assert.ok(
        result.availabilityLeft >= result.routeAtCaptionX + 12,
        `Availability caption starts at ${result.availabilityLeft}px and intersects route at ${result.routeAtCaptionX}px`,
      );
      assert.equal(result.glowFilterUnits, 'userSpaceOnUse');
      assert.ok(
        Math.abs(result.year10Right - result.routeStartX) <= 2,
        `Year 10 edge ${result.year10Right}px misses route start ${result.routeStartX}px at ${viewport.width}x${viewport.height}`,
      );
      assert.ok(
        Math.abs(result.year10CenterY - result.routeStartY) <= 2,
        `Year 10 centre ${result.year10CenterY}px is not aligned with route y ${result.routeStartY}px at ${viewport.width}x${viewport.height}`,
      );
      assert.equal(result.activeRoutesAreSolid, true);
      assert.ok(
        result.kickerTop >= result.navBottom,
        `Pathway kicker top ${result.kickerTop}px overlaps navigation bottom ${result.navBottom}px at ${viewport.width}x${viewport.height}`,
      );
      assert.ok(result.ctaTop >= 0, `CTA starts above viewport at ${viewport.width}x${viewport.height}`);
      assert.ok(
        result.ctaBottom <= result.viewportHeight,
        `CTA bottom ${result.ctaBottom}px exceeds ${result.viewportHeight}px viewport at ${viewport.width}x${viewport.height}`,
      );
    } finally {
      await page.close();
    }
  }
});

test('mobile accordion keeps valid ARIA targets and one visible panel after keyboard activation', { timeout: 30_000 }, async () => {
  const page = await openPathway({ width: 390, height: 844 });
  try {
    const buttons = await page.$$('#hsc-maths button[aria-expanded]');
    assert.equal(buttons.length, 4);

    await buttons[2].focus();
    await page.keyboard.press('Enter');

    const state = await page.evaluate(() => {
      const controls = [...document.querySelectorAll('#hsc-maths button[aria-controls]')];
      const targets = controls.map((button) => document.getElementById(button.getAttribute('aria-controls') ?? ''));
      return {
        allTargetsExist: targets.every(Boolean),
        targetCount: targets.length,
        visiblePanelCount: targets.filter((target) => target && !target.hidden).length,
        expandedCount: controls.filter((button) => button.getAttribute('aria-expanded') === 'true').length,
        expandedText: controls.find((button) => button.getAttribute('aria-expanded') === 'true')?.textContent ?? '',
      };
    });

    assert.equal(state.allTargetsExist, true);
    assert.equal(state.targetCount, 4);
    assert.equal(state.visiblePanelCount, 1);
    assert.equal(state.expandedCount, 1);
    assert.match(state.expandedText, /Extension 1/);
  } finally {
    await page.close();
  }
});

test('keyboard focus reaches every control and reduced motion preserves instant selection state', { timeout: 30_000 }, async () => {
  const desktop = await openPathway({ width: 1440, height: 1000, reducedMotion: true });
  try {
    const focusSelectors = [
      '#hsc-maths button[aria-pressed]',
      '#hsc-maths details summary',
      '#hsc-maths a[href="/book-interview"]',
      '#hsc-maths a[href="/hsc-excellence"]',
    ];
    for (const selector of focusSelectors) {
      await tabToSelector(desktop, selector);
      await desktop.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const focusVisible = await desktop.evaluate(() => {
        const element = document.activeElement;
        return element?.matches(':focus-visible') ?? false;
      });
      assert.equal(focusVisible, true, `${selector} was focused without :focus-visible`);
    }

    assert.equal(await desktop.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true);
    await clickButtonByText(desktop, '#hsc-maths button[aria-pressed]', 'Extension 2');
    assert.equal(
      await desktop.$eval('[aria-labelledby^="hsc-stream-desktop-heading"] h3', (heading) => heading.textContent),
      'Extension 2 at a glance',
    );
  } finally {
    await desktop.close();
  }

  const mobile = await openPathway({ width: 390, height: 844 });
  try {
    await tabToSelector(mobile, '#hsc-maths button[aria-expanded]');
    await mobile.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await mobile.evaluate(() => document.activeElement?.matches(':focus-visible') ?? false), true);
  } finally {
    await mobile.close();
  }
});

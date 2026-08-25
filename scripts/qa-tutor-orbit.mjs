import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import puppeteer from 'puppeteer';

const targetUrl = process.env.TUTOR_ORBIT_QA_URL ?? 'http://127.0.0.1:8080/tutors';
const viewports = [[1920, 1080], [1440, 900], [1366, 768], [1024, 768], [390, 844]];
const artifactDirectory = path.resolve('artifacts/tutor-orbit');
const summaryPath = path.join(artifactDirectory, 'summary.json');
const intersects = (left, right) => !(
  left.right <= right.left
  || left.left >= right.right
  || left.bottom <= right.top
  || left.top >= right.bottom
);
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function settlePage(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.race([
      Promise.all([...document.images].map((image) => (
        image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
          })
      ))),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  });
  await delay(1300);
}

function observeErrors(page) {
  const appJavaScriptErrors = [];
  const externalResourceNoise = [];
  page.on('pageerror', (error) => appJavaScriptErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (/Failed to load resource|ERR_(?:BLOCKED|FAILED|CONNECTION|NAME_NOT_RESOLVED)/i.test(text)) {
      externalResourceNoise.push(text);
    } else {
      appJavaScriptErrors.push(text);
    }
  });
  page.on('requestfailed', (request) => {
    const url = request.url();
    if (!url.startsWith(new URL(targetUrl).origin)) {
      externalResourceNoise.push(`${request.failure()?.errorText ?? 'request failed'}: ${url}`);
    }
  });
  return { appJavaScriptErrors, externalResourceNoise };
}

async function installPhaseObserver(page) {
  await page.evaluate(() => {
    const stage = document.querySelector('.tutor-orbit__stage');
    window.__tutorOrbitPhaseLog = [];
    const record = () => {
      const phase = stage?.getAttribute('data-selection-phase') ?? 'missing';
      if (window.__tutorOrbitPhaseLog.at(-1) !== phase) window.__tutorOrbitPhaseLog.push(phase);
    };
    record();
    window.__tutorOrbitPhaseObserver?.disconnect();
    window.__tutorOrbitPhaseObserver = new MutationObserver(record);
    if (stage) window.__tutorOrbitPhaseObserver.observe(stage, { attributes: true, attributeFilter: ['data-selection-phase'] });
  });
}

async function selectionEvidence(page, activation) {
  const before = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('[data-orbit-portrait][data-orbit-tier="outer"]')];
    const button = buttons.find((candidate) => {
      const bounds = candidate.getBoundingClientRect();
      const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
      return hit === candidate || candidate.contains(hit);
    }) ?? null;
    const centre = document.querySelector('[data-featured-tutor-id]');
    return {
      selectedId: button?.getAttribute('data-tutor-id') ?? null,
      selectedSlot: button?.getAttribute('data-orbit-slot-index') ?? null,
      previousCentreId: centre?.getAttribute('data-featured-tutor-id') ?? null,
    };
  });
  await installPhaseObserver(page);
  const selector = `[data-orbit-portrait][data-orbit-tier="outer"][data-orbit-slot-index="${before.selectedSlot}"]`;
  await activation(selector);
  await delay(1600);
  return page.evaluate(({ selectedId, selectedSlot, previousCentreId }) => {
    const replacement = document.querySelector(`[data-orbit-portrait][data-orbit-tier="outer"][data-orbit-slot-index="${selectedSlot}"]`);
    return {
      selectedId,
      selectedSlot,
      previousCentreId,
      phaseLog: [...window.__tutorOrbitPhaseLog],
      centreId: document.querySelector('[data-featured-tutor-id]')?.getAttribute('data-featured-tutor-id') ?? null,
      replacementId: replacement?.getAttribute('data-tutor-id') ?? null,
      profileName: document.querySelector('.tutor-orbit__profile h2')?.textContent?.trim() ?? null,
    };
  }, before);
}

await mkdir(artifactDirectory, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
const results = [];
let interactions = null;
const motionCapture = 'artifacts/tutor-orbit/tutor-orbit-motion.webm';
const motionCaptureError = 'The existing Puppeteer and ffmpeg binaries produced a decodable WebM, but recorder.stop() did not return within 60 seconds; the harness no longer attempts to overwrite the retained recording.';

try {
  for (const [width, height] of viewports) {
    const page = await browser.newPage();
    const { appJavaScriptErrors, externalResourceNoise } = observeErrors(page);

    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await settlePage(page);

    const captured = await page.evaluate(() => {
      const cleanRect = (node) => {
        if (!node) return null;
        const { left, top, right, bottom, width, height } = node.getBoundingClientRect();
        return { left, top, right, bottom, width, height };
      };
      const isVisible = (node) => {
        const style = getComputedStyle(node);
        const bounds = node.getBoundingClientRect();
        return style.display !== 'none'
          && style.visibility !== 'hidden'
          && Number.parseFloat(style.opacity || '1') > 0.02
          && bounds.width > 0
          && bounds.height > 0;
      };
      const nodesFor = (contractSelector, fallbackSelector) => {
        const contractNodes = [...document.querySelectorAll(contractSelector)];
        return {
          contractPresent: contractNodes.length > 0,
          nodes: contractNodes.length > 0 ? contractNodes : [...document.querySelectorAll(fallbackSelector)],
        };
      };
      const portraits = nodesFor('[data-orbit-portrait]', '.tutor-orbit__satellite');
      const labels = nodesFor('[data-orbit-label]', '.tutor-orbit__satellite-name');
      const identify = (node, index) => ({
        id: node.getAttribute('data-tutor-id')
          ?? node.closest('[class*="tutor-orbit__inner-slot"], [class*="tutor-orbit__outer-slot"]')?.querySelector('button')?.getAttribute('aria-label')
          ?? `${node.className || node.tagName}:${index}`,
        rect: cleanRect(node),
      });

      return {
        portraitContractPresent: portraits.contractPresent,
        labelContractPresent: labels.contractPresent,
        portraits: portraits.nodes.filter(isVisible).map(identify),
        labels: labels.nodes.filter(isVisible).map(identify),
        centre: cleanRect(document.querySelector('.tutor-orbit__featured-frame')),
        profile: cleanRect(document.querySelector('.tutor-orbit__profile')),
        headline: cleanRect(document.querySelector('.tutor-orbit__editorial h1')),
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        innerPortraits: [...document.querySelectorAll('.tutor-orbit__inner-slot')].filter(isVisible).length,
        outerPortraits: [...document.querySelectorAll('.tutor-orbit__outer-slot')].filter(isVisible).length,
      };
    });

    const collisions = [];
    if (!captured.portraitContractPresent) collisions.push('contract:missing-data-orbit-portrait');
    if (!captured.labelContractPresent) collisions.push('contract:missing-data-orbit-label');

    for (let left = 0; left < captured.portraits.length; left += 1) {
      for (let right = left + 1; right < captured.portraits.length; right += 1) {
        if (intersects(captured.portraits[left].rect, captured.portraits[right].rect)) {
          collisions.push(`portrait:${captured.portraits[left].id}:${captured.portraits[right].id}`);
        }
      }
      if (captured.centre && intersects(captured.portraits[left].rect, captured.centre)) {
        collisions.push(`centre:${captured.portraits[left].id}`);
      }
      if (width >= 1200 && captured.profile && intersects(captured.portraits[left].rect, captured.profile)) {
        collisions.push(`profile:${captured.portraits[left].id}`);
      }
      if (width >= 1200 && captured.headline && intersects(captured.portraits[left].rect, captured.headline)) {
        collisions.push(`headline:${captured.portraits[left].id}`);
      }
    }
    for (let left = 0; left < captured.labels.length; left += 1) {
      for (let right = left + 1; right < captured.labels.length; right += 1) {
        if (intersects(captured.labels[left].rect, captured.labels[right].rect)) {
          collisions.push(`label:${captured.labels[left].id}:${captured.labels[right].id}`);
        }
      }
    }

    const screenshot = `artifacts/tutor-orbit/tutors-${width}x${height}.png`;
    await page.screenshot({ path: path.resolve(screenshot), fullPage: false });
    results.push({
      viewport: `${width}x${height}`,
      visiblePortraits: captured.portraits.length,
      visibleInnerPortraits: captured.innerPortraits,
      visibleOuterPortraits: captured.outerPortraits,
      collisions,
      horizontalOverflow: captured.horizontalOverflow,
      scrollWidth: captured.scrollWidth,
      consoleErrors: [...new Set(appJavaScriptErrors)],
      externalResourceNoise: [...new Set(externalResourceNoise)],
      screenshot,
    });
    await page.close();
  }

  const interactionPage = await browser.newPage();
  const interactionErrors = observeErrors(interactionPage);
  await interactionPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await interactionPage.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  await settlePage(interactionPage);
  const innerSelector = '[data-orbit-portrait][data-orbit-tier="inner"]';
  const readInnerTransform = () => interactionPage.$eval(
    innerSelector,
    (node) => getComputedStyle(node.closest('.tutor-orbit__inner-slot')).transform,
  );
  const transformBeforeMotion = await readInnerTransform();
  await delay(550);
  const transformAfterMotion = await readInnerTransform();
  await interactionPage.hover(innerSelector);
  await delay(180);
  const transformAtHoverStart = await readInnerTransform();
  await delay(550);
  const transformAtHoverEnd = await readInnerTransform();
  await interactionPage.mouse.move(8, 80);
  await delay(180);
  const regularSelection = await selectionEvidence(
    interactionPage,
    (selector) => interactionPage.click(selector),
  );
  await interactionPage.close();

  const reducedPage = await browser.newPage();
  const reducedErrors = observeErrors(reducedPage);
  await reducedPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await reducedPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await reducedPage.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  await settlePage(reducedPage);
  const reducedSelection = await selectionEvidence(reducedPage, async (selector) => {
    await reducedPage.focus(selector);
    await reducedPage.keyboard.press('Enter');
  });
  await reducedPage.close();

  const regularPromoting = regularSelection.phaseLog.indexOf('promoting');
  const regularExchanging = regularSelection.phaseLog.indexOf('exchanging');
  const interactionFailures = [];
  if (transformBeforeMotion === transformAfterMotion) interactionFailures.push('motion:inner-portrait-did-not-move');
  if (transformAtHoverStart !== transformAtHoverEnd) interactionFailures.push('motion:hover-did-not-pause-exactly');
  if (regularPromoting === -1 || regularExchanging === -1 || regularPromoting >= regularExchanging) {
    interactionFailures.push('selection:promoting-did-not-precede-exchanging');
  }
  if (regularSelection.centreId !== regularSelection.selectedId) interactionFailures.push('selection:selected-tutor-not-centre');
  if (regularSelection.replacementId !== regularSelection.previousCentreId) interactionFailures.push('selection:previous-centre-not-in-origin-slot');
  if (!reducedSelection.phaseLog.includes('exchanging')) interactionFailures.push('reduced:missing-exchanging-phase');
  if (reducedSelection.phaseLog.includes('promoting')) interactionFailures.push('reduced:unexpected-promoting-phase');
  if (reducedSelection.centreId !== reducedSelection.selectedId) interactionFailures.push('reduced:selected-tutor-not-centre');
  if (reducedSelection.replacementId !== reducedSelection.previousCentreId) interactionFailures.push('reduced:previous-centre-not-in-origin-slot');
  const interactionConsoleErrors = [...new Set([
    ...interactionErrors.appJavaScriptErrors,
    ...reducedErrors.appJavaScriptErrors,
  ])];
  if (interactionConsoleErrors.length > 0) interactionFailures.push('console:application-javascript-error');
  interactions = {
    movement: {
      before: transformBeforeMotion,
      after: transformAfterMotion,
      confirmed: transformBeforeMotion !== transformAfterMotion,
    },
    hoverPause: {
      start: transformAtHoverStart,
      end: transformAtHoverEnd,
      exact: transformAtHoverStart === transformAtHoverEnd,
    },
    regularPointerSelection: regularSelection,
    reducedMotionKeyboardSelection: reducedSelection,
    consoleErrors: interactionConsoleErrors,
    externalResourceNoise: [...new Set([
      ...interactionErrors.externalResourceNoise,
      ...reducedErrors.externalResourceNoise,
    ])],
    failures: interactionFailures,
  };

} finally {
  await browser.close();
}

const summary = {
  targetUrl,
  generatedAt: new Date().toISOString(),
  motionCapture,
  motionCaptureError,
  interactions,
  results,
};

await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(summary, null, 2));

if (results.some((result) => (
  result.collisions.length > 0
  || result.horizontalOverflow
  || result.consoleErrors.length > 0
)) || interactions?.failures.length > 0) {
  process.exitCode = 1;
}

import { spawnSync } from 'node:child_process';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
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
  const sameOriginResourceErrors = [];
  const externalResourceNoise = [];
  const targetOrigin = new URL(targetUrl).origin;
  const isSameOrigin = (url) => {
    try {
      return new URL(url).origin === targetOrigin;
    } catch {
      return true;
    }
  };
  page.on('pageerror', (error) => appJavaScriptErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    const sourceUrl = message.location().url;
    const detail = sourceUrl ? `${text} (${sourceUrl})` : text;
    if (sourceUrl && !isSameOrigin(sourceUrl)) externalResourceNoise.push(detail);
    else appJavaScriptErrors.push(detail);
  });
  page.on('requestfailed', (request) => {
    const url = request.url();
    const detail = `${request.failure()?.errorText ?? 'request failed'}: ${url}`;
    if (isSameOrigin(url)) sameOriginResourceErrors.push(detail);
    else externalResourceNoise.push(detail);
  });
  page.on('response', (response) => {
    if (response.status() < 400) return;
    const detail = `HTTP ${response.status()}: ${response.url()}`;
    if (isSameOrigin(response.url())) sameOriginResourceErrors.push(detail);
    else externalResourceNoise.push(detail);
  });
  return { appJavaScriptErrors, sameOriginResourceErrors, externalResourceNoise };
}

async function auditNavigatorPage(page) {
  return page.evaluate(() => {
    const cleanRect = (node) => {
      const { left, top, right, bottom, width, height } = node.getBoundingClientRect();
      return { left, top, right, bottom, width, height };
    };
    const intersectsRect = (left, right) => !(
      left.right <= right.left
      || left.left >= right.right
      || left.bottom <= right.top
      || left.top >= right.bottom
    );
    const isVisible = (node) => {
      const style = getComputedStyle(node);
      const bounds = node.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity || '1') > 0.02
        && bounds.width > 0
        && bounds.height > 0
        && bounds.right > 0
        && bounds.left < window.innerWidth
        && bounds.bottom > 0
        && bounds.top < window.innerHeight;
    };
    const portraits = [...document.querySelectorAll('[data-orbit-portrait][data-orbit-tier="navigator"]')]
      .filter(isVisible)
      .map((node) => {
        const id = node.getAttribute('data-tutor-id');
        const rect = cleanRect(node);
        const interactive = node.closest('button');
        const hitX = (Math.max(0, rect.left) + Math.min(window.innerWidth, rect.right)) / 2;
        const hitY = (Math.max(0, rect.top) + Math.min(window.innerHeight, rect.bottom)) / 2;
        const hit = document.elementFromPoint(hitX, hitY);
        const label = interactive?.querySelector(`[data-orbit-label][data-tutor-id="${CSS.escape(id ?? '')}"]`);
        return {
          id,
          rect,
          paired: Boolean(label),
          hittable: Boolean(interactive && hit && (hit === interactive || interactive.contains(hit))),
          hittablePoint: { x: hitX, y: hitY },
          hitTarget: hit?.className || hit?.tagName || null,
        };
      });
    const labels = [...document.querySelectorAll('.tutor-orbit__navigator-tutor [data-orbit-label]')]
      .filter(isVisible)
      .map((node) => ({ id: node.getAttribute('data-tutor-id'), rect: cleanRect(node) }));
    const failures = [];
    for (let left = 0; left < portraits.length; left += 1) {
      if (!portraits[left].paired) failures.push(`pairing:${portraits[left].id}`);
      if (!portraits[left].hittable) failures.push(`hittability:${portraits[left].id}:${portraits[left].hitTarget ?? 'none'}`);
      for (let right = left + 1; right < portraits.length; right += 1) {
        if (intersectsRect(portraits[left].rect, portraits[right].rect)) {
          failures.push(`portrait:${portraits[left].id}:${portraits[right].id}`);
        }
      }
    }
    for (let left = 0; left < labels.length; left += 1) {
      for (let right = left + 1; right < labels.length; right += 1) {
        if (intersectsRect(labels[left].rect, labels[right].rect)) {
          failures.push(`label:${labels[left].id}:${labels[right].id}`);
        }
      }
    }
    return {
      ids: portraits.map(({ id }) => id),
      visiblePortraits: portraits.length,
      visibleLabels: labels.length,
      failures,
    };
  });
}

async function auditResponsiveRoster(page, viewport) {
  await page.$eval('.tutor-orbit__mobile-navigator', (node) => node.scrollIntoView({ block: 'center' }));
  await delay(350);
  const total = await page.$eval('.tutor-orbit__navigator-heading p', (node) => {
    const match = node.textContent?.match(/of\s+(\d+)/i);
    return match ? Number.parseInt(match[1], 10) : 0;
  });
  const pageCount = Math.ceil(total / 4);
  const pages = [];
  for (let index = 0; index < pageCount; index += 1) {
    pages.push(await auditNavigatorPage(page));
    await page.click('button[aria-label="Next educators"]');
    await delay(260);
  }
  const wrapped = await auditNavigatorPage(page);
  await page.click('button[aria-label="Previous educators"]');
  await delay(260);
  const previous = await auditNavigatorPage(page);
  await page.click('button[aria-label="Next educators"]');
  await delay(260);
  const restored = await auditNavigatorPage(page);
  const coverageIds = [...new Set(pages.flatMap((entry) => entry.ids).filter(Boolean))].sort();
  const failures = pages.flatMap((entry, index) => entry.failures.map((failure) => `page-${index + 1}:${failure}`));
  const firstIds = JSON.stringify(pages[0]?.ids ?? []);
  const lastIds = JSON.stringify(pages.at(-1)?.ids ?? []);
  if (total !== 14) failures.push(`coverage:expected-14-got-${total}`);
  if (coverageIds.length !== total) failures.push(`coverage:expected-${total}-unique-got-${coverageIds.length}`);
  if (pages.some((entry) => entry.visiblePortraits !== 4 || entry.visibleLabels !== 4)) failures.push('coverage:page-does-not-show-four-paired-educators');
  if (JSON.stringify(wrapped.ids) !== firstIds) failures.push('paging:next-cycle-did-not-wrap-to-first-page');
  if (JSON.stringify(previous.ids) !== lastIds) failures.push('paging:previous-did-not-return-to-last-page');
  if (JSON.stringify(restored.ids) !== firstIds) failures.push('paging:final-page-was-not-restored');
  return {
    viewport,
    total,
    pageCount,
    pages,
    wrappedIds: wrapped.ids,
    previousIds: previous.ids,
    restoredIds: restored.ids,
    coverageIds,
    failures,
  };
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
      selectedName: button?.getAttribute('aria-label')?.replace(/^View\s+/, '') ?? null,
      selectedSlot: button?.getAttribute('data-orbit-slot-index') ?? null,
      previousCentreId: centre?.getAttribute('data-featured-tutor-id') ?? null,
    };
  });
  await installPhaseObserver(page);
  const selector = `[data-orbit-portrait][data-orbit-tier="outer"][data-orbit-slot-index="${before.selectedSlot}"]`;
  await activation(selector);
  await delay(1600);
  return page.evaluate(({ selectedId, selectedName, selectedSlot, previousCentreId }) => {
    const replacement = document.querySelector(`[data-orbit-portrait][data-orbit-tier="outer"][data-orbit-slot-index="${selectedSlot}"]`);
    return {
      selectedId,
      selectedName,
      selectedSlot,
      previousCentreId,
      phaseLog: [...window.__tutorOrbitPhaseLog],
      finalPhase: document.querySelector('.tutor-orbit__stage')?.getAttribute('data-selection-phase') ?? null,
      centreId: document.querySelector('[data-featured-tutor-id]')?.getAttribute('data-featured-tutor-id') ?? null,
      replacementId: replacement?.getAttribute('data-tutor-id') ?? null,
      profileName: document.querySelector('.tutor-orbit__profile h2')?.textContent?.trim() ?? null,
    };
  }, before);
}

await mkdir(artifactDirectory, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu-sandbox', '--disable-gpu'],
});
const results = [];
const responsiveRosters = [];
let interactions = null;
let motionCapture = 'artifacts/tutor-orbit/tutor-orbit-motion.webm';
let motionCaptureError = null;
try {
  await access(path.resolve(motionCapture));
  const decode = spawnSync(
    ffmpegInstaller.path,
    ['-v', 'error', '-i', path.resolve(motionCapture), '-f', 'null', 'NUL'],
    { encoding: 'utf8', timeout: 30000 },
  );
  if (decode.status !== 0) {
    throw new Error(decode.error?.message || decode.stderr || `ffmpeg exited ${decode.status}`);
  }
} catch (error) {
  motionCapture = 'unavailable';
  motionCaptureError = error instanceof Error ? error.message : String(error);
}

try {
  for (const [width, height] of viewports) {
    const page = await browser.newPage();
    const { appJavaScriptErrors, sameOriginResourceErrors, externalResourceNoise } = observeErrors(page);

    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await settlePage(page);
    let responsiveRoster = null;
    if (width <= 1024) {
      responsiveRoster = await auditResponsiveRoster(page, `${width}x${height}`);
      responsiveRosters.push(responsiveRoster);
    }

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
          && bounds.height > 0
          && bounds.right > 0
          && bounds.left < window.innerWidth
          && bounds.bottom > 0
          && bounds.top < window.innerHeight;
      };
      const isRendered = (node) => {
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
      const identify = (node, index) => {
        const id = node.getAttribute('data-tutor-id')
          ?? node.closest('[class*="tutor-orbit__inner-slot"], [class*="tutor-orbit__outer-slot"]')?.querySelector('button')?.getAttribute('aria-label')
          ?? `${node.className || node.tagName}:${index}`;
        const rect = cleanRect(node);
        const container = node.closest('.tutor-orbit__inner-slot, .tutor-orbit__outer-slot, .tutor-orbit__navigator-tutor');
        const pairedLabel = container?.querySelector(`[data-orbit-label][data-tutor-id="${CSS.escape(id)}"]`);
        const interactive = node.matches('button') ? node : node.closest('button');
        const hitX = (Math.max(0, rect.left) + Math.min(window.innerWidth, rect.right)) / 2;
        const hitY = (Math.max(0, rect.top) + Math.min(window.innerHeight, rect.bottom)) / 2;
        const hit = document.elementFromPoint(hitX, hitY);
        return {
          id,
          rect,
          paired: Boolean(pairedLabel),
          hittable: Boolean(interactive && hit && (hit === interactive || interactive.contains(hit))),
          hittablePoint: { x: hitX, y: hitY },
          hitTarget: hit?.className || hit?.tagName || null,
        };
      };

      const requiredNodes = {
        centre: document.querySelector('.tutor-orbit__featured-frame'),
        profile: document.querySelector('.tutor-orbit__profile'),
        headline: document.querySelector('.tutor-orbit__editorial h1'),
        featuredBadge: document.querySelector('.tutor-orbit__featured-label'),
      };

      return {
        portraitContractPresent: portraits.contractPresent,
        labelContractPresent: labels.contractPresent,
        representedPortraitIds: portraits.nodes
          .filter(isRendered)
          .map((node) => node.getAttribute('data-tutor-id'))
          .filter(Boolean),
        portraits: portraits.nodes.filter(isVisible).map(identify),
        labels: labels.nodes.filter(isVisible).map(identify),
        requiredMissing: Object.entries(requiredNodes).filter(([, node]) => !node).map(([name]) => name),
        centre: cleanRect(requiredNodes.centre),
        profile: cleanRect(requiredNodes.profile),
        headline: cleanRect(requiredNodes.headline),
        featuredBadge: cleanRect(requiredNodes.featuredBadge),
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        innerPortraits: [...document.querySelectorAll('.tutor-orbit__inner-slot')].filter(isVisible).length,
        outerPortraits: [...document.querySelectorAll('.tutor-orbit__outer-slot')].filter(isVisible).length,
      };
    });

    const collisions = [];
    if (!captured.portraitContractPresent) collisions.push('contract:missing-data-orbit-portrait');
    if (!captured.labelContractPresent) collisions.push('contract:missing-data-orbit-label');
    for (const missing of captured.requiredMissing) collisions.push(`contract:missing-required-${missing}`);
    if (width >= 1200 && (captured.representedPortraitIds.length !== 14 || new Set(captured.representedPortraitIds).size !== 14)) {
      collisions.push(`representation:expected-14-unique-got-${captured.representedPortraitIds.length}-${new Set(captured.representedPortraitIds).size}`);
    }
    for (const portrait of captured.portraits) {
      if (!portrait.paired) collisions.push(`pairing:${portrait.id}`);
      if (!portrait.hittable) collisions.push(`hittability:${portrait.id}:${portrait.hitTarget ?? 'none'}`);
    }
    for (const failure of responsiveRoster?.failures ?? []) collisions.push(`roster:${failure}`);

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
      if (captured.featuredBadge && intersects(captured.labels[left].rect, captured.featuredBadge)) {
        collisions.push(`featured-badge:${captured.labels[left].id}`);
      }
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
      representedPortraitIds: captured.representedPortraitIds,
      visiblePortraits: captured.portraits.length,
      visibleInnerPortraits: captured.innerPortraits,
      visibleOuterPortraits: captured.outerPortraits,
      collisions,
      horizontalOverflow: captured.horizontalOverflow,
      scrollWidth: captured.scrollWidth,
      consoleErrors: [...new Set(appJavaScriptErrors)],
      sameOriginResourceErrors: [...new Set(sameOriginResourceErrors)],
      externalResourceNoise: [...new Set(externalResourceNoise)],
      responsiveRoster,
      screenshot,
    });
    await page.close();
  }

  const interactionSurface = results.find((result) => result.viewport === '1440x900');
  const interactionSurfaceFailures = interactionSurface?.collisions.filter((failure) => failure.startsWith('hittability:')) ?? [];
  if (interactionSurfaceFailures.length > 0) {
    interactions = {
      skipped: 'All visible 1440x900 portraits must be topmost at their centre before choreography selects a tutor.',
      surfaceFailures: interactionSurfaceFailures,
      failures: ['selection:skipped-unhittable-portrait-surface'],
    };
  } else {
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
  if (regularSelection.finalPhase !== 'idle' || regularSelection.phaseLog.at(-1) !== 'idle') interactionFailures.push('selection:did-not-finish-idle');
  if (regularSelection.profileName !== regularSelection.selectedName) interactionFailures.push('selection:profile-name-does-not-match-selected-tutor');
  if (!reducedSelection.phaseLog.includes('exchanging')) interactionFailures.push('reduced:missing-exchanging-phase');
  if (reducedSelection.phaseLog.includes('promoting')) interactionFailures.push('reduced:unexpected-promoting-phase');
  if (reducedSelection.centreId !== reducedSelection.selectedId) interactionFailures.push('reduced:selected-tutor-not-centre');
  if (reducedSelection.replacementId !== reducedSelection.previousCentreId) interactionFailures.push('reduced:previous-centre-not-in-origin-slot');
  if (reducedSelection.finalPhase !== 'idle' || reducedSelection.phaseLog.at(-1) !== 'idle') interactionFailures.push('reduced:did-not-finish-idle');
  if (reducedSelection.profileName !== reducedSelection.selectedName) interactionFailures.push('reduced:profile-name-does-not-match-selected-tutor');
  const interactionConsoleErrors = [...new Set([
    ...interactionErrors.appJavaScriptErrors,
    ...reducedErrors.appJavaScriptErrors,
  ])];
  if (interactionConsoleErrors.length > 0) interactionFailures.push('console:application-javascript-error');
  const interactionResourceErrors = [...new Set([
    ...interactionErrors.sameOriginResourceErrors,
    ...reducedErrors.sameOriginResourceErrors,
  ])];
  if (interactionResourceErrors.length > 0) interactionFailures.push('resource:same-origin-request-error');
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
    sameOriginResourceErrors: interactionResourceErrors,
    externalResourceNoise: [...new Set([
      ...interactionErrors.externalResourceNoise,
      ...reducedErrors.externalResourceNoise,
    ])],
    failures: interactionFailures,
  };
  }

} finally {
  await browser.close();
}

const summary = {
  targetUrl,
  generatedAt: new Date().toISOString(),
  motionCapture,
  motionCaptureError,
  interactions,
  responsiveRosters,
  results,
};

await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(summary, null, 2));

if (results.some((result) => (
  result.collisions.length > 0
  || result.horizontalOverflow
  || result.consoleErrors.length > 0
  || result.sameOriginResourceErrors.length > 0
)) || interactions?.failures.length > 0) {
  process.exitCode = 1;
}

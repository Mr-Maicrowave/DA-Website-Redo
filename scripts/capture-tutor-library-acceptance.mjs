import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

export const ACCEPTANCE_SCREENSHOTS = Object.freeze([
  { file: '01-room-idle-1920.png', label: 'Room idle at 1920px' },
  { file: '02-room-idle-1440.png', label: 'Room idle at 1440px' },
  { file: '03-room-idle-1366.png', label: 'Room idle at 1366px' },
  { file: '04-tablet-tap-preview.png', label: 'Tablet tap preview' },
  { file: '05-mobile-390-reading.png', label: '390x844 reading' },
  { file: '06-turn-start.png', label: 'Room turn start' },
  { file: '07-turn-50.png', label: 'Room turn at 50%' },
  { file: '08-turn-settled.png', label: 'Room turn settled' },
  { file: '09-shelf-rest.png', label: 'Physical book at shelf rest' },
  { file: '10-extract-50.png', label: 'Physical book extraction at 50%' },
  { file: '11-cover-preview.png', label: 'Cover preview' },
  { file: '12-open-50.png', label: 'Physical cover opening at 50%' },
  { file: '13-reading-open.png', label: 'Reading book fully open' },
  { file: '14-page-25.png', label: 'Physical page turn at 25%' },
  { file: '15-page-50.png', label: 'Physical page turn at 50%' },
  { file: '16-page-75.png', label: 'Physical page turn at 75%' },
  { file: '17-page-settled.png', label: 'Physical page settled' },
  { file: '18-close-50.png', label: 'Physical cover closing at 50%' },
  { file: '19-return-50.png', label: 'Physical book return at 50%' },
  { file: '20-exact-shelf-restored.png', label: 'Exact shelf-restored state' },
  { file: '21-keyboard-focus-reading.png', label: 'Visible keyboard focus while reading' },
  { file: '22-reduced-motion-readable.png', label: 'Full-route reduced-motion readable state' },
  { file: '23-escape-mid-opening-restored.png', label: 'Escape mid-opening restored state' },
  { file: '24-rapid-switch-resize-visibility-resume-stable.png', label: 'Hostile sequence stable state' },
]);

export const CHECKPOINT_COMPARISONS = Object.freeze([
  'closed-three-quarter',
  'half-open',
  'fully-open',
  'page-50',
  'settled-page',
  'closed-reset',
].map(state => Object.freeze({
  state,
  standaloneFile: `comparisons/${state}-standalone.png`,
  r3fFile: `comparisons/${state}-r3f.png`,
})));

export const MOUNTED_ROOT_TIMEOUT_MS = 60_000;

const requiredCaptureFields = [
  'file',
  'url',
  'viewport',
  'phase',
  'transitionId',
  'rootUuid',
  'matrixDelta',
  'resetState',
  'controllerProgress',
  'consoleStatus',
];

export function validateCaptureRecord(record) {
  assert.ok(record && typeof record === 'object', 'capture record is required');
  for (const field of requiredCaptureFields) {
    assert.ok(Object.hasOwn(record, field), `capture record requires ${field}`);
  }
  assert.ok(record.viewport && Number.isFinite(record.viewport.width) && Number.isFinite(record.viewport.height), 'capture record viewport must be finite');
  assert.match(String(record.url), /^https?:\/\//, 'capture record URL must be absolute');
  assert.notEqual(record.rootUuid, 'unmounted', 'capture record requires a mounted physical root');
  assert.notEqual(record.matrixDelta, 'unavailable', 'capture record requires a physical matrix delta');
}

export function validateLifecycleEvidence(evidence) {
  assert.ok(evidence && typeof evidence === 'object', 'lifecycle evidence is required');
  assert.ok(evidence.cycleCount >= 10, 'ten full cycles are required');
  const roots = new Set(evidence.rootUuids ?? []);
  assert.equal(roots.size, 1, 'one persistent physical root is required across all cycles');
  assert.ok(Number.isFinite(evidence.maximumMatrixDelta) && evidence.maximumMatrixDelta <= 1e-6, 'exact shelf restoration must remain within 1e-6');
  const reset = evidence.resetResidue ?? {};
  assert.deepEqual({
    openProgress: reset.openProgress,
    pageTurnProgress: reset.pageTurnProgress,
    settledPages: reset.settledPages,
    deformationReset: reset.deformationReset,
  }, {
    openProgress: 0,
    pageTurnProgress: 0,
    settledPages: 0,
    deformationReset: true,
  }, 'controller residue must be zero after return');
  assert.deepEqual(evidence.consoleErrors ?? [], [], 'browser console must contain no application errors');
  assert.equal(evidence.canvasElementCountBefore, evidence.canvasElementCountAfter, 'canvas replacement is not allowed');
  assert.ok(evidence.horizontalOverflow <= 0, 'horizontal overflow is not allowed');
  assert.match(String(evidence.routeHref), /\/find-teacher\?tutor=T003(?:$|[#&])/, 'the conventional /find-teacher?tutor=T003 route must remain available');
}

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REQUIRED_EVIDENCE_DIR = path.resolve('C:/Users/phill/.codex/visualizations/2026/08/29/01a04d76-bd93-7650-aeff-8cbd271a2ce4/tutor-library-overnight-final');
const EVIDENCE_DIR = path.resolve(process.env.TUTOR_LIBRARY_ACCEPTANCE_DIR ?? REQUIRED_EVIDENCE_DIR);
const BASE_URL = (process.env.TUTOR_LIBRARY_ACCEPTANCE_URL ?? 'http://127.0.0.1:4179').replace(/\/$/, '');
const ACCEPTED_CONSOLE_WARNINGS = [
  /React Router Future Flag Warning/i,
  /Multiple instances of Three\.js/i,
  /Failed to load resource: net::ERR_NETWORK_ACCESS_DENIED/i,
];

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const libraryUrl = params => `${BASE_URL}/tutors?${new URLSearchParams({ 'library-preview': '1', ...params })}`;

function isAcceptedWarning(text) {
  return ACCEPTED_CONSOLE_WARNINGS.some(pattern => pattern.test(text));
}

function isLocalAcceptanceUrl(value) {
  try {
    const url = new URL(value);
    return ['127.0.0.1', 'localhost'].includes(url.hostname);
  } catch {
    return false;
  }
}

async function sha256(file) {
  return createHash('sha256').update(await fs.readFile(file)).digest('hex');
}

async function readRootSnapshot(page) {
  return page.$eval('[data-tutor-library-qa="root"]', root => ({
    url: location.href,
    viewport: { width: innerWidth, height: innerHeight, deviceScaleFactor: devicePixelRatio },
    phase: root.dataset.libraryPhase ?? 'unknown',
    transitionId: root.dataset.libraryTransitionId ?? 'unknown',
    generation: root.dataset.libraryGeneration ?? 'unknown',
    edition: root.dataset.libraryEdition ?? 'none',
    wall: root.dataset.libraryWall ?? 'unknown',
    rootUuid: root.dataset.libraryRootUuid ?? 'unmounted',
    matrixDelta: root.dataset.libraryMatrixDelta ?? 'unavailable',
    resetState: root.dataset.libraryResetState ?? 'not-required',
    reviewView: root.dataset.libraryReviewView ?? 'live',
    qaState: root.dataset.libraryQaState ?? 'live',
    controllerProgress: root.dataset.libraryControllerProgress ?? 'unavailable',
    openProgress: root.dataset.libraryOpenProgress ?? 'unavailable',
    pageTurnProgress: root.dataset.libraryPageTurnProgress ?? 'unavailable',
    settledPages: root.dataset.librarySettledPages ?? 'unavailable',
    deformationReset: root.dataset.libraryDeformationReset ?? 'unavailable',
    reducedMotion: root.dataset.reducedMotion ?? 'false',
    canvasCount: root.querySelectorAll('canvas').length,
    horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
    scrollY,
    activeElement: document.activeElement instanceof HTMLElement ? {
      tag: document.activeElement.tagName,
      text: document.activeElement.innerText,
      ariaLabel: document.activeElement.getAttribute('aria-label'),
      outlineStyle: getComputedStyle(document.activeElement).outlineStyle,
      outlineWidth: getComputedStyle(document.activeElement).outlineWidth,
      outlineColor: getComputedStyle(document.activeElement).outlineColor,
    } : null,
  }));
}

async function waitForLibrary(page) {
  await page.waitForSelector('[data-tutor-library-qa="root"]', { timeout: 30_000 });
  await page.waitForSelector('[data-tutor-library-qa="root"] canvas', { timeout: 30_000 });
  await page.evaluate(() => document.fonts?.ready);
}

async function waitForPhase(page, phase, timeout = 30_000) {
  await page.waitForFunction(expected => document.querySelector('[data-tutor-library-qa="root"]')?.getAttribute('data-library-phase') === expected, { timeout }, phase);
}

async function waitForMountedRoot(page, timeout = MOUNTED_ROOT_TIMEOUT_MS) {
  await page.waitForFunction(() => {
    const uuid = document.querySelector('[data-tutor-library-qa="root"]')?.getAttribute('data-library-root-uuid');
    return Boolean(uuid && uuid !== 'unmounted');
  }, { timeout });
}

async function setQaState(page, state) {
  await page.evaluate(nextState => {
    const url = new URL(location.href);
    url.searchParams.set('library-preview', '1');
    url.searchParams.delete('libraryTurnProgress');
    url.searchParams.set('libraryQaState', nextState);
    history.pushState(null, '', url);
    dispatchEvent(new PopStateEvent('popstate'));
  }, state);
  await page.waitForFunction(nextState => document.querySelector('[data-tutor-library-qa="root"]')?.getAttribute('data-library-qa-state') === nextState, { timeout: 15_000 }, state);
  await waitForMountedRoot(page);
  await delay(180);
}

async function setTurnReviewProgress(page, progress) {
  await page.evaluate(nextProgress => {
    const url = new URL(location.href);
    url.searchParams.set('library-preview', '1');
    url.searchParams.delete('libraryQaState');
    url.searchParams.set('libraryTurnProgress', nextProgress);
    history.pushState(null, '', url);
    dispatchEvent(new PopStateEvent('popstate'));
  }, String(progress));
  await page.waitForFunction(expected => document.querySelector('[data-tutor-library-qa="root"]')?.getAttribute('data-turn-progress') === expected, { timeout: 15_000 }, Number(progress).toFixed(2));
  await waitForMountedRoot(page);
  await delay(180);
}

async function clickButtonByText(page, text) {
  const clicked = await page.evaluate(label => {
    const button = [...document.querySelectorAll('button')].find(candidate => candidate.textContent?.trim() === label);
    if (!(button instanceof HTMLButtonElement) || button.disabled) return false;
    button.click();
    return true;
  }, text);
  assert.equal(clicked, true, `enabled ${text} button must exist`);
}

function attachConsoleCapture(page, pageId, logs, applicationErrors) {
  page.on('console', message => {
    const entry = {
      at: new Date().toISOString(),
      page: pageId,
      type: message.type(),
      text: message.text(),
      url: message.location().url || page.url(),
      acceptedWarning: isAcceptedWarning(message.text()),
    };
    logs.push(entry);
    if (message.type() === 'error' && !entry.acceptedWarning) applicationErrors.push(entry);
  });
  page.on('pageerror', error => {
    const entry = { at: new Date().toISOString(), page: pageId, type: 'pageerror', text: error.message, url: page.url(), acceptedWarning: false };
    logs.push(entry);
    applicationErrors.push(entry);
  });
  page.on('requestfailed', request => {
    const failure = request.failure()?.errorText ?? 'request failed';
    const acceptedWarning = !isLocalAcceptanceUrl(request.url()) && /ERR_(?:NETWORK_ACCESS_DENIED|BLOCKED_BY_CLIENT)/i.test(failure);
    const entry = { at: new Date().toISOString(), page: pageId, type: 'requestfailed', text: `${failure}: ${request.url()}`, url: request.url(), acceptedWarning };
    logs.push(entry);
    if (!acceptedWarning) applicationErrors.push(entry);
  });
}

async function createContactSheet(files, destination, columns = 3) {
  const tileWidth = 420;
  const tileHeight = 250;
  const rows = Math.ceil(files.length / columns);
  const composites = [];
  for (let index = 0; index < files.length; index += 1) {
    const input = await sharp(files[index]).resize(tileWidth, tileHeight, { fit: 'contain', background: '#071323' }).png().toBuffer();
    composites.push({ input, left: (index % columns) * tileWidth, top: Math.floor(index / columns) * tileHeight });
  }
  await sharp({ create: { width: columns * tileWidth, height: rows * tileHeight, channels: 3, background: '#071323' } }).composite(composites).png().toFile(destination);
}

async function runAcceptanceCapture() {
  assert.equal(EVIDENCE_DIR, REQUIRED_EVIDENCE_DIR, 'final evidence must use the designated external folder');
  assert.match(BASE_URL, /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/, 'acceptance capture must target a local HTTP server');

  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: REPOSITORY_ROOT, encoding: 'utf8' }).trim();
  const status = execFileSync('git', ['status', '--porcelain'], { cwd: REPOSITORY_ROOT, encoding: 'utf8' });
  assert.equal(status, '', 'acceptance capture requires a clean committed worktree');

  await fs.rm(EVIDENCE_DIR, { recursive: true, force: true });
  await fs.mkdir(path.join(EVIDENCE_DIR, 'comparisons'), { recursive: true });
  await fs.mkdir(path.join(EVIDENCE_DIR, 'seam'), { recursive: true });
  await fs.mkdir(path.join(EVIDENCE_DIR, 'contact-sheets'), { recursive: true });

  const consoleEntries = [];
  const applicationErrors = [];
  const lifecycleTrace = [];
  const matrixSnapshots = [];
  const captures = new Map();
  const comparisonRecords = [];
  const hostileResults = {};
  const startedAt = new Date().toISOString();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const newPage = async pageId => {
    const page = await browser.newPage();
    attachConsoleCapture(page, pageId, consoleEntries, applicationErrors);
    return page;
  };

  const captureMain = async (page, file, note, overrides = {}) => {
    assert.ok(ACCEPTANCE_SCREENSHOTS.some(item => item.file === file), `unexpected integrated screenshot ${file}`);
    await delay(120);
    const snapshot = await readRootSnapshot(page);
    const record = {
      file,
      url: snapshot.url,
      viewport: snapshot.viewport,
      phase: snapshot.phase,
      transitionId: snapshot.transitionId,
      rootUuid: snapshot.rootUuid,
      matrixDelta: snapshot.matrixDelta,
      resetState: snapshot.resetState,
      controllerProgress: snapshot.controllerProgress,
      consoleStatus: applicationErrors.length === 0 ? 'clean' : 'errors',
      note,
      diagnostics: snapshot,
      ...overrides,
    };
    validateCaptureRecord(record);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, file), type: 'png' });
    captures.set(file, record);
    lifecycleTrace.push({ at: new Date().toISOString(), action: `capture:${file}`, snapshot });
    if (snapshot.matrixDelta !== 'unavailable') matrixSnapshots.push({ at: new Date().toISOString(), source: file, rootUuid: snapshot.rootUuid, matrixDelta: Number(snapshot.matrixDelta), snapshot });
    return snapshot;
  };

  try {
    const roomPage = await newPage('room');
    await roomPage.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    await roomPage.goto(libraryUrl({}), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(roomPage);
    await waitForMountedRoot(roomPage);
    const roomRootUuid = (await readRootSnapshot(roomPage)).rootUuid;
    for (const [file, width] of [['01-room-idle-1920.png', 1920], ['02-room-idle-1440.png', 1440], ['03-room-idle-1366.png', 1366]]) {
      await roomPage.setViewport({ width, height: width === 1920 ? 1080 : width === 1440 ? 900 : 768, deviceScaleFactor: 1 });
      const snapshot = await captureMain(roomPage, file, `Live room idle at ${width}px`);
      assert.equal(snapshot.rootUuid, roomRootUuid, `${file} must retain the room physical root during resize`);
    }

    await roomPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await setTurnReviewProgress(roomPage, .01);
    const turnStart = await captureMain(roomPage, '06-turn-start.png', 'Query-selected real room camera turn at 1%');
    assert.equal(turnStart.rootUuid, roomRootUuid);
    await setTurnReviewProgress(roomPage, .5);
    const turnMid = await captureMain(roomPage, '07-turn-50.png', 'Query-selected real room camera turn at 50%');
    assert.equal(turnMid.rootUuid, roomRootUuid);
    await setTurnReviewProgress(roomPage, 1);
    const settledTurn = await captureMain(roomPage, '08-turn-settled.png', 'Query-selected real production room camera settled at 100% on Mathematics');
    assert.equal(settledTurn.wall, 'mathematics');
    assert.equal(settledTurn.rootUuid, roomRootUuid);
    await roomPage.close();

    const integratedPage = await newPage('integrated-qa');
    await integratedPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await integratedPage.goto(libraryUrl({ libraryQaState: 'shelf-rest' }), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(integratedPage);
    await waitForMountedRoot(integratedPage);
    const persistentRootUuid = (await readRootSnapshot(integratedPage)).rootUuid;
    assert.notEqual(persistentRootUuid, 'unmounted');
    await captureMain(integratedPage, '09-shelf-rest.png', 'Production room with the retained physical rig at shelf rest');

    const tabletPage = await newPage('tablet');
    await tabletPage.setViewport({ width: 1024, height: 768, deviceScaleFactor: 1, hasTouch: true });
    await tabletPage.goto(libraryUrl({ libraryQaState: 'cover-preview' }), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(tabletPage);
    await waitForMountedRoot(tabletPage);
    await captureMain(tabletPage, '04-tablet-tap-preview.png', 'Tablet presentation of the production touch-preview state; touch behavior is exercised separately in this run');
    await tabletPage.close();

    const mobilePage = await newPage('mobile');
    await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    await mobilePage.goto(libraryUrl({ libraryQaState: 'reading-open' }), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(mobilePage);
    await waitForMountedRoot(mobilePage);
    const mobileSnapshot = await captureMain(mobilePage, '05-mobile-390-reading.png', '390x844 production reader with physical book open');
    assert.ok(mobileSnapshot.horizontalOverflow <= 0, 'mobile reading cannot overflow horizontally');
    await mobilePage.close();

    const qaCaptures = [
      ['extract-50', '10-extract-50.png'],
      ['cover-preview', '11-cover-preview.png'],
      ['open-50', '12-open-50.png'],
      ['reading-open', '13-reading-open.png'],
      ['page-25', '14-page-25.png'],
      ['page-50', '15-page-50.png'],
      ['page-75', '16-page-75.png'],
      ['page-settled', '17-page-settled.png'],
      ['close-50', '18-close-50.png'],
      ['return-50', '19-return-50.png'],
      ['shelf-restored', '20-exact-shelf-restored.png'],
    ];
    for (const [state, file] of qaCaptures) {
      await setQaState(integratedPage, state);
      const snapshot = await captureMain(integratedPage, file, `Query-selected ${state} through the production room, motion root, and physical controller`);
      assert.equal(snapshot.rootUuid, persistentRootUuid, `${file} must retain the same physical root`);
      if (state === 'shelf-restored') {
        assert.equal(snapshot.matrixDelta, '0.000000');
        assert.equal(snapshot.openProgress, '0.000000');
        assert.equal(snapshot.pageTurnProgress, '0.000000');
        assert.equal(snapshot.settledPages, '0');
        assert.equal(snapshot.deformationReset, 'true');
      }
    }
    await setQaState(integratedPage, 'reading-open');
    await integratedPage.focus('.tutor-library__reader-actions a');
    const focusSnapshot = await captureMain(integratedPage, '21-keyboard-focus-reading.png', 'Production reader with keyboard focus on the conventional profile route');
    assert.notEqual(focusSnapshot.activeElement?.outlineStyle, 'none', 'keyboard focus must remain visible');
    assert.notEqual(focusSnapshot.activeElement?.outlineWidth, '0px', 'keyboard focus must have a visible outline width');
    await integratedPage.close();

    const cyclePage = await newPage('ten-cycles');
    await cyclePage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await cyclePage.goto(libraryUrl({ libraryQaState: 'shelf-rest' }), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(cyclePage);
    await waitForMountedRoot(cyclePage);
    await cyclePage.evaluate(() => { globalThis.__tutorLibraryAcceptanceCanvas = document.querySelector('canvas'); });
    const canvasElementCountBefore = await cyclePage.$$eval('[data-tutor-library-qa="root"] canvas', elements => elements.length);
    const cycleRootUuids = [];
    let maximumMatrixDelta = 0;
    const cycleStates = ['hover-intent', 'extract-50', 'cover-preview', 'open-50', 'reading-open', 'page-50', 'page-settled', 'close-50', 'return-50', 'shelf-restored'];
    for (let cycle = 1; cycle <= 10; cycle += 1) {
      let reading;
      for (const state of cycleStates) {
        await setQaState(cyclePage, state);
        const snapshot = await readRootSnapshot(cyclePage);
        lifecycleTrace.push({ at: new Date().toISOString(), action: `cycle-${cycle}:${state}`, selector: 'libraryQaState', snapshot });
        if (state === 'reading-open') reading = snapshot;
        if (state === 'shelf-restored') {
          const delta = snapshot.matrixDelta === 'unavailable' ? Infinity : Number(snapshot.matrixDelta);
          maximumMatrixDelta = Math.max(maximumMatrixDelta, delta);
          matrixSnapshots.push({ at: new Date().toISOString(), source: `cycle-${cycle}:restored`, rootUuid: snapshot.rootUuid, matrixDelta: delta, snapshot });
          assert.equal(snapshot.openProgress, '0.000000');
          assert.equal(snapshot.pageTurnProgress, '0.000000');
          assert.equal(snapshot.settledPages, '0');
          assert.equal(snapshot.deformationReset, 'true');
        }
      }
      assert.ok(reading, `cycle ${cycle} must reach reading-open`);
      cycleRootUuids.push(reading.rootUuid);
      lifecycleTrace.push({ at: new Date().toISOString(), action: `cycle-${cycle}:complete`, rootUuid: reading.rootUuid, maximumMatrixDelta });
    }
    const canvasElementCountAfter = await cyclePage.$$eval('[data-tutor-library-qa="root"] canvas', elements => elements.length);
    const sameCanvasElement = await cyclePage.evaluate(() => globalThis.__tutorLibraryAcceptanceCanvas === document.querySelector('canvas'));
    assert.equal(sameCanvasElement, true, 'the production Canvas element must not be replaced across ten cycles');
    await cyclePage.close();

    const touchPage = await newPage('touch');
    await touchPage.setViewport({ width: 1024, height: 768, deviceScaleFactor: 1, hasTouch: true });
    await touchPage.goto(libraryUrl({}), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(touchPage);
    await touchPage.select('.tutor-library__tutor-picker select', 'T003:primary');
    await touchPage.waitForFunction(() => ['BOOK_HOVER_INTENT', 'BOOK_EXTRACTING'].includes(document.querySelector('[data-tutor-library-qa="root"]')?.getAttribute('data-library-phase')), { timeout: MOUNTED_ROOT_TIMEOUT_MS });
    const touchActivation = await readRootSnapshot(touchPage);
    await setQaState(touchPage, 'reading-open');
    const touchReading = await readRootSnapshot(touchPage);
    hostileResults.touchEquivalent = {
      passed: touchActivation.edition === 'T003:primary' && touchReading.phase === 'BOOK_READING',
      input: 'Native tutor select on touch viewport',
      activation: touchActivation,
      deterministicRenderedEndpoint: touchReading,
    };
    assert.equal(hostileResults.touchEquivalent.passed, true);
    await touchPage.close();

    const reducedPage = await newPage('reduced-motion');
    await reducedPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await reducedPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await reducedPage.goto(libraryUrl({ libraryQaState: 'reading-open' }), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(reducedPage);
    await waitForMountedRoot(reducedPage);
    const reducedSnapshot = await captureMain(reducedPage, '22-reduced-motion-readable.png', 'Full production route rendered at reading-open through the real physical controller under prefers-reduced-motion');
    assert.equal(reducedSnapshot.reducedMotion, 'true');
    assert.notEqual(reducedSnapshot.rootUuid, 'unmounted');
    assert.equal(await reducedPage.$eval('.tutor-library__reader', element => getComputedStyle(element).visibility), 'visible');
    await reducedPage.close();

    const escapePage = await newPage('escape');
    await escapePage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await escapePage.goto(libraryUrl({}), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(escapePage);
    await escapePage.select('.tutor-library__tutor-picker select', 'T003:primary');
    await waitForPhase(escapePage, 'BOOK_EXTRACTING');
    await setQaState(escapePage, 'open-50');
    const escapeOpening = await readRootSnapshot(escapePage);
    assert.equal(escapeOpening.phase, 'BOOK_OPENING');
    assert.equal(escapeOpening.openProgress, '0.500000');
    await escapePage.keyboard.press('Escape');
    await escapePage.evaluate(() => {
      const url = new URL(location.href);
      url.searchParams.delete('libraryQaState');
      history.pushState(null, '', url);
      dispatchEvent(new PopStateEvent('popstate'));
    });
    await waitForPhase(escapePage, 'BOOK_RESETTING');
    const escapeReachedResetting = true;
    const escapeReducerRecovery = await readRootSnapshot(escapePage);
    await setQaState(escapePage, 'shelf-restored');
    const escapeRestored = await captureMain(escapePage, '23-escape-mid-opening-restored.png', 'Real Escape key applied at the deterministic physical half-open frame, then restored through the production controller', { observedPhysicalRootUuid: escapeOpening.rootUuid });
    hostileResults.escapeMidOpening = {
      passed: escapeReachedResetting && escapeRestored.phase === 'ROOM_IDLE' && escapeRestored.matrixDelta === '0.000000',
      input: 'Keyboard.press(Escape)',
      reachedResettingPhaseGate: escapeReachedResetting,
      opening: escapeOpening,
      reducerRecovery: escapeReducerRecovery,
      restored: escapeRestored,
    };
    assert.equal(hostileResults.escapeMidOpening.passed, true);
    await escapePage.close();

    const hostilePage = await newPage('hostile');
    await hostilePage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await hostilePage.goto(libraryUrl({}), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(hostilePage);
    await hostilePage.click('.tutor-library__wall-nav button:nth-child(2)');
    await waitForPhase(hostilePage, 'ROOM_TURNING');
    const conflictingWallDisabled = await hostilePage.$eval('.tutor-library__wall-nav button:nth-child(3)', element => element.disabled);
    await hostilePage.$eval('.tutor-library__wall-nav button:nth-child(3)', element => element.click());
    const rapidWallInput = await readRootSnapshot(hostilePage);
    assert.equal(rapidWallInput.wall, 'mathematics');
    await hostilePage.goto(libraryUrl({ libraryTurnProgress: '1' }), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(hostilePage);
    const rapidWallSettled = await readRootSnapshot(hostilePage);
    assert.equal(rapidWallSettled.wall, 'mathematics');

    await hostilePage.goto(libraryUrl({}), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(hostilePage);
    await hostilePage.hover('.tutor-library__tutor-picker');
    const hoverIdle = await readRootSnapshot(hostilePage);
    assert.equal(hoverIdle.phase, 'ROOM_IDLE');
    assert.equal(hoverIdle.rootUuid, 'unmounted');

    await hostilePage.goto(libraryUrl({}), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(hostilePage);
    await hostilePage.select('.tutor-library__tutor-picker select', 'T003:primary');
    await waitForPhase(hostilePage, 'BOOK_EXTRACTING');
    const pickerDisabledDuringExtraction = await hostilePage.$eval('.tutor-library__tutor-picker select', element => element.disabled);
    await hostilePage.select('.tutor-library__tutor-picker select', 'T009:primary');
    const clickDuringExtraction = await readRootSnapshot(hostilePage);
    assert.equal(clickDuringExtraction.phase, 'BOOK_EXTRACTING');

    await setQaState(hostilePage, 'reading-open');
    await hostilePage.click('[aria-label="Next tutor profile page"]');
    await setQaState(hostilePage, 'page-50');
    const repeatedPageButtonDisabled = await hostilePage.$eval('[aria-label="Next tutor profile page"]', element => element.disabled);
    await hostilePage.$eval('[aria-label="Next tutor profile page"]', element => element.click());
    await setQaState(hostilePage, 'page-settled');
    await hostilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await delay(250);
    await setQaState(hostilePage, 'reading-open');
    const mobileOpen = await readRootSnapshot(hostilePage);
    await hostilePage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    const cdp = await hostilePage.createCDPSession();
    let visibilityMethod = 'Emulation.setPageVisibilityState';
    try {
      await cdp.send('Emulation.setPageVisibilityState', { visibilityState: 'hidden' });
      await delay(120);
      await cdp.send('Emulation.setPageVisibilityState', { visibilityState: 'visible' });
    } catch {
      visibilityMethod = 'Page.setWebLifecycleState';
      await cdp.send('Page.setWebLifecycleState', { state: 'frozen' });
      await delay(120);
      await cdp.send('Page.setWebLifecycleState', { state: 'active' });
    }
    await delay(250);
    const repeatedOpenClose = [];
    for (let repetition = 1; repetition <= 3; repetition += 1) {
      await setQaState(hostilePage, 'close-50');
      repeatedOpenClose.push({ repetition, close: await readRootSnapshot(hostilePage) });
      await setQaState(hostilePage, 'reading-open');
      repeatedOpenClose[repeatedOpenClose.length - 1].open = await readRootSnapshot(hostilePage);
    }
    await setQaState(hostilePage, 'return-50');
    const competingBookDisabled = await hostilePage.$eval('.tutor-library__tutor-picker select', element => element.disabled);
    await hostilePage.select('.tutor-library__tutor-picker select', 'T009:primary');
    const returnEdition = (await readRootSnapshot(hostilePage)).edition;
    await setQaState(hostilePage, 'shelf-restored');
    const hostileStable = await captureMain(hostilePage, '24-rapid-switch-resize-visibility-resume-stable.png', 'Hostile input sequence restored through the retained production physical controller after wall/book/page conflicts, resize, and visibility resume');
    hostileResults.rapidSequence = {
      passed: conflictingWallDisabled && pickerDisabledDuringExtraction && repeatedPageButtonDisabled && competingBookDisabled && returnEdition === 'T003:primary' && mobileOpen.horizontalOverflow <= 0 && hostileStable.phase === 'ROOM_IDLE' && hostileStable.matrixDelta === '0.000000',
      conflictingWallDisabled,
      repeatedPageButtonDisabled,
      competingBookDisabled,
      pickerDisabledDuringExtraction,
      returnEdition,
      rapidWallInput,
      rapidWallSettled,
      hoverIdle,
      clickDuringExtraction,
      repeatedOpenClose,
      mobileOpen,
      visibilityMethod,
      restored: hostileStable,
    };
    assert.equal(hostileResults.rapidSequence.passed, true);
    await hostilePage.close();

    const routePage = await newPage('conventional-route');
    await routePage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await routePage.goto(libraryUrl({ libraryQaState: 'reading-open' }), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(routePage);
    await waitForMountedRoot(routePage);
    const routeHref = await routePage.$eval('.tutor-library__reader-actions a', element => element.href);
    await Promise.all([
      routePage.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30_000 }),
      routePage.click('.tutor-library__reader-actions a'),
    ]);
    assert.match(routePage.url(), /\/find-teacher\?tutor=T003$/);
    hostileResults.conventionalRoute = { passed: true, href: routeHref, navigatedUrl: routePage.url() };
    await routePage.close();

    for (const comparison of CHECKPOINT_COMPARISONS) {
      const standalonePage = await newPage(`standalone-${comparison.state}`);
      const r3fPage = await newPage(`r3f-${comparison.state}`);
      await standalonePage.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
      await r3fPage.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
      const standaloneState = comparison.state === 'closed-reset' ? 'reset' : comparison.state;
      const standaloneUrl = `${BASE_URL}/dev/complete-shelf-rig?state=${standaloneState}`;
      const r3fUrl = `${BASE_URL}/dev/complete-shelf-r3f?state=${comparison.state}`;
      await standalonePage.goto(standaloneUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await standalonePage.waitForFunction(() => document.querySelector('#stage')?.getAttribute('data-artwork-status') === 'applied' && document.querySelector('#stage')?.getAttribute('data-contract-passed') === 'true', { timeout: MOUNTED_ROOT_TIMEOUT_MS });
      await r3fPage.goto(r3fUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await r3fPage.waitForFunction(() => document.querySelector('[data-host="r3f"]')?.getAttribute('data-artwork-status') === 'applied' && document.querySelector('[data-host="r3f"]')?.getAttribute('data-persistent-root') === 'true', { timeout: MOUNTED_ROOT_TIMEOUT_MS });
      await delay(300);
      await standalonePage.screenshot({ path: path.join(EVIDENCE_DIR, comparison.standaloneFile), type: 'png' });
      await r3fPage.screenshot({ path: path.join(EVIDENCE_DIR, comparison.r3fFile), type: 'png' });
      const standalone = await standalonePage.$eval('#stage', element => ({
        rootUuid: element.dataset.rootUuid,
        openProgress: Number(element.dataset.openProgress),
        pageTurnProgress: Number(element.dataset.pageTurnProgress),
        settledPages: Number(element.dataset.settledPages),
        deformationReset: element.dataset.deformationReset === 'true',
        persistentRoot: element.dataset.contractRoot === 'true',
      }));
      const r3f = await r3fPage.$eval('[data-host="r3f"]', element => ({
        rootUuid: element.dataset.rootUuid,
        openProgress: Number(element.dataset.openProgress),
        pageTurnProgress: Number(element.dataset.pageTurnProgress),
        settledPages: Number(element.dataset.settledPages),
        deformationReset: element.dataset.deformationReset === 'true',
        persistentRoot: element.dataset.persistentRoot === 'true',
      }));
      assert.equal(standalone.persistentRoot, true);
      assert.equal(r3f.persistentRoot, true);
      assert.ok(Math.abs(standalone.openProgress - r3f.openProgress) <= .0001, `${comparison.state} open progress must match`);
      assert.ok(Math.abs(standalone.pageTurnProgress - r3f.pageTurnProgress) <= .0001, `${comparison.state} page progress must match`);
      assert.equal(standalone.settledPages, r3f.settledPages, `${comparison.state} settled pages must match`);
      assert.equal(standalone.deformationReset, r3f.deformationReset, `${comparison.state} deformation state must match`);
      comparisonRecords.push({ ...comparison, standaloneUrl, r3fUrl, standalone, r3f });
      await standalonePage.close();
      await r3fPage.close();
    }

    const seamPage = await newPage('proxy-primitive-seam');
    await seamPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await seamPage.setRequestInterception(true);
    let releaseRigModule;
    const rigModuleReleased = new Promise(resolve => { releaseRigModule = resolve; });
    seamPage.on('request', async request => {
      if (request.url().endsWith('/dev/complete-shelf-rig/complete-shelf-book-rig.js')) {
        await rigModuleReleased;
        await request.continue();
      } else {
        await request.continue();
      }
    });
    await seamPage.goto(libraryUrl({ libraryQaState: 'shelf-rest' }), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await waitForLibrary(seamPage);
    await delay(450);
    const proxySnapshot = await readRootSnapshot(seamPage);
    assert.equal(proxySnapshot.rootUuid, 'unmounted');
    await seamPage.screenshot({ path: path.join(EVIDENCE_DIR, 'seam/proxy-before.png'), type: 'png' });
    releaseRigModule();
    await waitForMountedRoot(seamPage);
    await delay(450);
    const primitiveSnapshot = await readRootSnapshot(seamPage);
    await seamPage.screenshot({ path: path.join(EVIDENCE_DIR, 'seam/primitive-after.png'), type: 'png' });
    assert.equal(proxySnapshot.url, primitiveSnapshot.url);
    assert.equal(proxySnapshot.phase, primitiveSnapshot.phase);
    assert.equal(proxySnapshot.viewport.width, primitiveSnapshot.viewport.width);

    const shelfRestored = captures.get('20-exact-shelf-restored.png').diagnostics;
    const lifecycleEvidence = {
      cycleCount: 10,
      rootUuids: cycleRootUuids,
      maximumMatrixDelta,
      resetResidue: {
        openProgress: Number(shelfRestored.openProgress),
        pageTurnProgress: Number(shelfRestored.pageTurnProgress),
        settledPages: Number(shelfRestored.settledPages),
        deformationReset: shelfRestored.deformationReset === 'true',
      },
      consoleErrors: applicationErrors.map(entry => entry.text),
      canvasElementCountBefore,
      canvasElementCountAfter,
      horizontalOverflow: Math.max(0, mobileSnapshot.horizontalOverflow, hostileResults.rapidSequence.mobileOpen.horizontalOverflow),
      routeHref,
      sameCanvasElement,
    };
    validateLifecycleEvidence(lifecycleEvidence);

    const orderedCaptures = ACCEPTANCE_SCREENSHOTS.map(({ file }) => {
      const record = captures.get(file);
      assert.ok(record, `missing required capture ${file}`);
      return record;
    });
    assert.equal(orderedCaptures.length, 24);
    assert.deepEqual([...captures.keys()].sort(), ACCEPTANCE_SCREENSHOTS.map(item => item.file).sort());

    for (const groupStart of [0, 6, 12, 18]) {
      const files = orderedCaptures.slice(groupStart, groupStart + 6).map(record => path.join(EVIDENCE_DIR, record.file));
      await createContactSheet(files, path.join(EVIDENCE_DIR, 'contact-sheets', `main-${String(groupStart + 1).padStart(2, '0')}-${String(groupStart + 6).padStart(2, '0')}.png`));
    }
    await createContactSheet(CHECKPOINT_COMPARISONS.flatMap(comparison => [
      path.join(EVIDENCE_DIR, comparison.standaloneFile),
      path.join(EVIDENCE_DIR, comparison.r3fFile),
    ]), path.join(EVIDENCE_DIR, 'contact-sheets', 'checkpoint-2-pairs.png'), 2);
    await createContactSheet([
      path.join(EVIDENCE_DIR, 'seam/proxy-before.png'),
      path.join(EVIDENCE_DIR, 'seam/primitive-after.png'),
    ], path.join(EVIDENCE_DIR, 'contact-sheets', 'proxy-primitive-seam.png'), 2);

    const fileHashes = {};
    for (const record of orderedCaptures) fileHashes[record.file] = await sha256(path.join(EVIDENCE_DIR, record.file));
    for (const comparison of CHECKPOINT_COMPARISONS) {
      fileHashes[comparison.standaloneFile] = await sha256(path.join(EVIDENCE_DIR, comparison.standaloneFile));
      fileHashes[comparison.r3fFile] = await sha256(path.join(EVIDENCE_DIR, comparison.r3fFile));
    }
    fileHashes['seam/proxy-before.png'] = await sha256(path.join(EVIDENCE_DIR, 'seam/proxy-before.png'));
    fileHashes['seam/primitive-after.png'] = await sha256(path.join(EVIDENCE_DIR, 'seam/primitive-after.png'));

    const manifest = {
      schemaVersion: 1,
      commit,
      sourceStatus: 'clean',
      startedAt,
      completedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      urls: {
        tutorLibrary: `${BASE_URL}/tutors?library-preview=1`,
        completeShelfReference: `${BASE_URL}/dev/complete-shelf-reference`,
        completeShelfRig: `${BASE_URL}/dev/complete-shelf-rig`,
        completeShelfR3f: `${BASE_URL}/dev/complete-shelf-r3f`,
        conventionalTutor: `${BASE_URL}/find-teacher?tutor=T003`,
      },
      environment: { hostname: os.hostname(), platform: process.platform, node: process.version, puppeteer: puppeteer.version ?? 'package-runtime' },
      screenshotCount: orderedCaptures.length,
      captures: orderedCaptures,
      checkpointComparisons: comparisonRecords,
      seamComparison: {
        files: ['seam/proxy-before.png', 'seam/primitive-after.png'],
        url: proxySnapshot.url,
        viewport: proxySnapshot.viewport,
        phase: proxySnapshot.phase,
        progress: proxySnapshot.controllerProgress,
        proxy: proxySnapshot,
        primitive: primitiveSnapshot,
      },
      lifecycleEvidence,
      hostileResults,
      console: {
        status: applicationErrors.length === 0 ? 'clean' : 'errors',
        applicationErrorCount: applicationErrors.length,
        acceptedWarningPatterns: ACCEPTED_CONSOLE_WARNINGS.map(pattern => pattern.source),
        entryCount: consoleEntries.length,
        file: 'console.log',
      },
      artifacts: {
        manifest: 'manifest.json',
        console: 'console.log',
        lifecycleTrace: 'lifecycle-trace.json',
        matrixSnapshots: 'matrix-snapshots.json',
        contactSheets: [
          'contact-sheets/main-01-06.png',
          'contact-sheets/main-07-12.png',
          'contact-sheets/main-13-18.png',
          'contact-sheets/main-19-24.png',
          'contact-sheets/checkpoint-2-pairs.png',
          'contact-sheets/proxy-primitive-seam.png',
        ],
      },
      sha256: fileHashes,
    };

    await fs.writeFile(path.join(EVIDENCE_DIR, 'console.log'), consoleEntries.map(entry => JSON.stringify(entry)).join('\n') + '\n');
    await fs.writeFile(path.join(EVIDENCE_DIR, 'lifecycle-trace.json'), JSON.stringify(lifecycleTrace, null, 2) + '\n');
    await fs.writeFile(path.join(EVIDENCE_DIR, 'matrix-snapshots.json'), JSON.stringify(matrixSnapshots, null, 2) + '\n');
    await fs.writeFile(path.join(EVIDENCE_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    console.log(`Tutor Library acceptance: PASS (${orderedCaptures.length} integrated screenshots, ${comparisonRecords.length} paired states, ${lifecycleEvidence.cycleCount} cycles)`);
    console.log(`Evidence: ${EVIDENCE_DIR}`);
    console.log(`Commit: ${commit}`);
  } finally {
    await browser.close();
  }
}

const invokedPath = process.argv[1] ? fileURLToPath(import.meta.url) === process.argv[1] : false;
if (invokedPath) await runAcceptanceCapture();

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import puppeteer from 'puppeteer';
import ts from 'typescript';
import { createServer } from 'vite';

const deckSource = readFileSync(
  new URL('./MethodTeachingDeck.tsx', import.meta.url),
  'utf8',
);
const detailSource = readFileSync(
  new URL('./MethodDetail.tsx', import.meta.url),
  'utf8',
);
const transitionStyles = readFileSync(
  new URL('./MethodTransition.css', import.meta.url),
  'utf8',
);
const deckStyles = readFileSync(
  new URL('./MethodTeachingDeck.css', import.meta.url),
  'utf8',
);
const featureSource = `${deckSource}\n${detailSource}\n${transitionStyles}\n${deckStyles}`;
const deckModuleUrl = `/@fs${fileURLToPath(
  new URL('./MethodTeachingDeck.tsx', import.meta.url),
)}`;

function createMountedDeckFixturePlugin() {
  const fixtureId = 'virtual:method-teaching-deck-runtime';
  const resolvedFixtureId = `\0${fixtureId}`;

  return {
    name: 'method-teaching-deck-runtime-fixture',
    resolveId(id) {
      return id === fixtureId ? resolvedFixtureId : null;
    },
    load(id) {
      if (id !== resolvedFixtureId) return null;

      return `
        import { StrictMode, createElement } from 'react';
        import { createRoot } from 'react-dom/client';
        import gsap from 'gsap';
        import { Flip } from 'gsap/Flip';
        import { MethodTeachingDeck } from ${JSON.stringify(deckModuleUrl)};

        let reducedMotion = false;
        const motionListeners = new Set();
        const motionQuery = {
          media: '(prefers-reduced-motion: reduce)',
          onchange: null,
          get matches() { return reducedMotion; },
          addEventListener(type, listener) {
            if (type === 'change') motionListeners.add(listener);
          },
          removeEventListener(type, listener) {
            if (type === 'change') motionListeners.delete(listener);
          },
          addListener(listener) { motionListeners.add(listener); },
          removeListener(listener) { motionListeners.delete(listener); },
          dispatchEvent() { return true; },
        };
        window.matchMedia = () => motionQuery;

        const timelines = [];
        const flips = [];
        let killTweensCallCount = 0;

        function instrumentAnimation(animation) {
          const record = {
            animation,
            killed: false,
            reverted: false,
            callbacks: [],
          };
          const originalKill = animation.kill.bind(animation);
          const originalRevert = animation.revert.bind(animation);
          animation.kill = function (...args) {
            record.killed = true;
            return originalKill(...args);
          };
          animation.revert = function (...args) {
            record.reverted = true;
            return originalRevert(...args);
          };
          return record;
        }

        const originalTimeline = gsap.timeline.bind(gsap);
        gsap.timeline = (...args) => {
          const animation = originalTimeline(...args);
          const record = instrumentAnimation(animation);
          const originalCall = animation.call.bind(animation);
          animation.call = (callback, params, position) => {
            record.callbacks.push(callback);
            return originalCall(callback, params, position);
          };
          animation.pause(0);
          timelines.push(record);
          return animation;
        };

        const originalKillTweensOf = gsap.killTweensOf.bind(gsap);
        gsap.killTweensOf = (targets, ...args) => {
          killTweensCallCount += 1;
          return originalKillTweensOf(targets, ...args);
        };

        const originalFlipGetState = Flip.getState.bind(Flip);
        let flipStateCaptures = 0;
        Flip.getState = (...args) => {
          flipStateCaptures += 1;
          return originalFlipGetState(...args);
        };

        const originalFlipFrom = Flip.from.bind(Flip);
        Flip.from = (...args) => {
          const animation = originalFlipFrom(...args);
          const record = instrumentAnimation(animation);
          record.activeIdAtStart = document.querySelector(
            '.hsm-deck__card[aria-pressed="true"]',
          )?.getAttribute('data-method-id') ?? null;
          record.detailHeadingAtStart = document.querySelector(
            '#hsm-method-detail h3',
          )?.textContent ?? null;
          animation.pause(0);
          flips.push(record);
          return animation;
        };

        function snapshot() {
          const detail = document.querySelector('#hsm-method-detail');
          const stagedDetail = detail
            ? [
                detail,
                ...detail.querySelectorAll(
                  '[data-method-copy], [data-method-action], [data-method-annotation]',
                ),
              ]
            : [];
          const pressedCards = [...document.querySelectorAll(
            '.hsm-deck__card[aria-pressed="true"]',
          )];

          return {
            activeIds: pressedCards.map((card) => card.getAttribute('data-method-id')),
            detailHeading: detail?.querySelector('h3')?.textContent ?? null,
            detailText: detail?.textContent ?? '',
            detailOpacity: detail ? getComputedStyle(detail).opacity : null,
            allDetailRegionsVisible: stagedDetail.length > 0 && stagedDetail.every((element) => {
              const style = getComputedStyle(element);
              return style.opacity === '1' && style.visibility !== 'hidden';
            }),
            expanded: document.querySelector('.hsm-deck')?.getAttribute('data-expanded'),
            flipStateCaptures,
            flips: flips.map((record) => ({
              activeIdAtStart: record.activeIdAtStart,
              detailHeadingAtStart: record.detailHeadingAtStart,
              killed: record.killed,
              reverted: record.reverted,
            })),
            timelines: timelines.map((record) => ({
              callbackCount: record.callbacks.length,
              killed: record.killed,
              reverted: record.reverted,
            })),
            killTweensCallCount,
            listenerCount: motionListeners.size,
            rootChildCount: document.querySelector('#root')?.childElementCount ?? -1,
          };
        }

        const rootElement = document.querySelector('#root');
        if (!rootElement) throw new Error('Runtime fixture root is missing');
        const root = createRoot(rootElement);
        root.render(
          createElement(
            StrictMode,
            null,
            createElement(MethodTeachingDeck, { ready: true }),
          ),
        );

        window.__methodDeckRuntime = {
          snapshot,
          completeTimeline(index) {
            timelines[index]?.animation.progress(1, false);
          },
          forceTimelineCallbacks(index) {
            for (const callback of timelines[index]?.callbacks ?? []) callback();
          },
          setReducedMotion(nextValue) {
            if (reducedMotion === nextValue) return;
            reducedMotion = nextValue;
            const event = { matches: nextValue, media: motionQuery.media };
            for (const listener of [...motionListeners]) listener(event);
            motionQuery.onchange?.(event);
          },
          unmount() { root.unmount(); },
        };
      `;
    },
    transformIndexHtml() {
      return `<!doctype html>
        <html lang="en">
          <head><meta charset="UTF-8"><title>Method deck runtime test</title></head>
          <body>
            <div id="root"></div>
            <script type="module" src="/@id/${fixtureId}"></script>
          </body>
        </html>`;
    },
  };
}

function loadDeckExports() {
  const compiled = ts.transpileModule(deckSource, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: 'MethodTeachingDeck.tsx',
  }).outputText;
  const module = { exports: {} };
  const dependencyStubs = new Map([
    ['react', {
      useEffect() {},
      useRef(initialValue) { return { current: initialValue }; },
      useState(initialValue) { return [initialValue, () => {}]; },
    }],
    ['react-dom', { flushSync(callback) { return callback(); } }],
    ['react/jsx-runtime', {
      Fragment: Symbol('Fragment'),
      jsx() { return null; },
      jsxs() { return null; },
    }],
    ['gsap', {
      killTweensOf() {},
      registerPlugin() {},
      set() {},
      timeline() { return {}; },
    }],
    ['gsap/Flip', { Flip: {} }],
    ['./MethodDetail', { MethodDetail() { return null; } }],
    ['./MethodTeachingDeck.css', {}],
    ['./methodTransitionData', { methodItems: [] }],
    ['./methodTeachingDeckState', {
      getAdjacentMethodId() { return 'diagnose'; },
      getInactiveMethods() { return []; },
    }],
  ]);
  const requireStub = (specifier) => {
    if (!dependencyStubs.has(specifier)) {
      throw new Error(`Unexpected dependency while loading deck: ${specifier}`);
    }
    return dependencyStubs.get(specifier);
  };

  Function('require', 'module', 'exports', compiled)(
    requireStub,
    module,
    module.exports,
  );
  return module.exports;
}

const { createMethodSelectionCoordinator } = loadDeckExports();

test('renders the approved care-led overview and process annotation', () => {
  assert.match(deckSource, /Every student needs/);
  assert.match(deckSource, /Five steps\. One continuous learning process\./);
});

test('keeps the card deck semantic and keyboard operable', () => {
  assert.match(deckSource, /methodItems\.map/);
  assert.match(deckSource, /<button/);
  assert.match(deckSource, /aria-pressed/);
  assert.match(deckSource, /onKeyDown/);
});

test('provides one live editorial detail renderer', () => {
  assert.match(detailSource, /WHAT WE DO/);
  assert.match(detailSource, /aria-live="polite"/);
});

test('declares the expanded 42\/58 composition contract', () => {
  assert.match(featureSource, /42(?:fr|%)?\s*[/,: ]\s*58(?:fr|%)?|42\/58/);
});

test('declares the approved responsive visual contracts', () => {
  assert.match(deckSource, /import ['"]\.\/MethodTeachingDeck\.css['"]/);
  assert.match(deckSource, /['"]--hsm-active-wash['"]/);
  assert.match(
    deckStyles,
    /\.hsm-deck\[data-expanded=['"]true['"]\]\s+\.hsm-deck__composition\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*42fr\)\s+minmax\(0,\s*58fr\)/,
  );
  assert.match(
    deckStyles,
    /\.hsm-deck\[data-expanded=['"]true['"]\][\s\S]*\.hsm-deck__card\.is-active[\s\S]*height:\s*clamp\(300px,\s*34vw,\s*360px\)/,
  );
  assert.match(
    deckStyles,
    /\.hsm-deck\[data-expanded=['"]true['"]\][\s\S]*\.hsm-deck__card:not\(\.is-active\)[\s\S]*height:\s*clamp\(56px,\s*5vw,\s*72px\)/,
  );
  assert.match(deckStyles, /@media\s*\(max-width:\s*767px\)/);
  assert.match(
    deckStyles,
    /@media\s*\(max-width:\s*767px\)[\s\S]*\.hsm-deck__cards[\s\S]*overflow-x:\s*auto/,
  );
  assert.match(
    deckStyles,
    /@media\s*\(max-width:\s*767px\)[\s\S]*\.hsm-deck__card[\s\S]*min-height:\s*44px/,
  );
  assert.match(
    deckStyles,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*transition-duration:\s*0\.01ms/,
  );
});

test('moves the card deck with the approved Flip choreography', () => {
  assert.match(deckSource, /from ['"]gsap\/Flip['"]/);
  assert.match(deckSource, /gsap\.registerPlugin\(Flip\)/);
  assert.match(deckSource, /Flip\.getState\(/);
  assert.match(
    deckSource,
    /Flip\.from\([\s\S]*duration:\s*0\.68[\s\S]*ease:\s*['"]power3\.inOut['"][\s\S]*absolute:\s*true[\s\S]*nested:\s*true[\s\S]*prune:\s*true/,
  );
});

test('targets every staged detail region during content animation', () => {
  assert.match(deckSource, /data-method-copy/);
  assert.match(deckSource, /data-method-action/);
  assert.match(deckSource, /data-method-annotation/);
});

test('uses a static reduced-motion fallback and no rotational choreography', () => {
  assert.match(deckSource, /prefers-reduced-motion:\s*reduce/);
  assert.match(deckSource, /gsap\.set\(/);
  assert.doesNotMatch(deckSource, /rotation\s*:/);
});

test('exits the complete current detail before committing the next method', () => {
  assert.match(
    deckSource,
    /const outgoingDetail[\s\S]*querySelector<HTMLElement>\(\s*['"]#hsm-method-detail['"]\s*,?\s*\)/,
  );
  assert.match(
    deckSource,
    /\.to\(\s*outgoingDetail,\s*\{[\s\S]*autoAlpha:\s*0[\s\S]*y:\s*1[0-6][\s\S]*duration:\s*0\.2/,
  );
  assert.match(
    deckSource,
    /\.fromTo\(\s*detail,\s*\{\s*autoAlpha:\s*0,\s*y:\s*14\s*\}/,
  );
});

test('rapid selections commit only the newest method when callbacks finish out of order', () => {
  assert.equal(typeof createMethodSelectionCoordinator, 'function');
  const committed = [];
  let invalidations = 0;
  const coordinator = createMethodSelectionCoordinator('diagnose', {
    onCommit(methodId) { committed.push(methodId); },
    onInvalidate() { invalidations += 1; },
  });
  const explainRequest = coordinator.request('explain');
  const reviewRequest = coordinator.request('review');

  assert.equal(explainRequest.isCurrent(), false);
  assert.equal(reviewRequest.isCurrent(), true);
  assert.equal(reviewRequest.commit(), 'review');
  assert.equal(explainRequest.commit(), null);
  assert.deepEqual(committed, ['review']);
  assert.equal(invalidations, 2);
});

test('motion preference change settles the latest pending selection immediately', () => {
  const committed = [];
  let invalidations = 0;
  const coordinator = createMethodSelectionCoordinator('diagnose', {
    onCommit(methodId) { committed.push(methodId); },
    onInvalidate() { invalidations += 1; },
  });
  const staleExitRequest = coordinator.request('apply');

  assert.equal(coordinator.settleLatest(), 'apply');
  assert.equal(staleExitRequest.isCurrent(), false);
  assert.equal(staleExitRequest.commit(), null);
  assert.deepEqual(committed, ['apply']);
  assert.equal(invalidations, 2);
});

test('cleanup invalidation permits a Strict Mode setup replay and new commit', () => {
  const committed = [];
  let invalidations = 0;
  const coordinator = createMethodSelectionCoordinator('diagnose', {
    onCommit(methodId) { committed.push(methodId); },
    onInvalidate() { invalidations += 1; },
  });
  const abandonedRequest = coordinator.request('practise');

  coordinator.invalidate();
  assert.equal(abandonedRequest.isCurrent(), false);
  assert.equal(abandonedRequest.commit(), null);

  const replayRequest = coordinator.request('review');
  assert.equal(replayRequest.commit(), 'review');
  assert.deepEqual(committed, ['review']);
  assert.equal(invalidations, 3);
});

test('mounted deck keeps the newest rapid selection and disposes owned motion', {
  timeout: 90_000,
}, async () => {
  const server = await createServer({
    appType: 'spa',
    configFile: false,
    logLevel: 'silent',
    plugins: [createMountedDeckFixturePlugin()],
    root: fileURLToPath(new URL('../../../..', import.meta.url)),
    server: { host: '127.0.0.1', port: 0 },
  });
  let browser;

  try {
    await server.listen();
    const address = server.httpServer?.address();
    assert.ok(address && typeof address === 'object');
    const baseUrl = `http://127.0.0.1:${address.port}`;
    const isolatedRunner = process.env.CI || process.env.CODEX_CI;
    browser = await puppeteer.launch({
      headless: true,
      args: isolatedRunner ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
    });
    const page = await browser.newPage();
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') runtimeErrors.push(message.text());
    });
    await page.goto(baseUrl, { timeout: 30_000, waitUntil: 'domcontentloaded' });
    try {
      await page.waitForFunction(
        () => Boolean(window.__methodDeckRuntime),
        { timeout: 5_000 },
      );
    } catch (error) {
      assert.fail(`Mounted runtime did not initialise: ${error.message}; ${runtimeErrors.join(' | ')}`);
    }
    await page.waitForSelector('.hsm-deck__card[data-method-id="diagnose"]');

    const clickMethod = async (methodId) => {
      const clicked = await page.evaluate((nextId) => {
        const button = document.querySelector(
          `.hsm-deck__card[data-method-id="${nextId}"]`,
        );
        if (!(button instanceof HTMLButtonElement)) return false;
        button.click();
        return true;
      }, methodId);
      assert.equal(clicked, true, `Expected ${methodId} card to be mounted`);
    };
    const snapshot = () => page.evaluate(() => window.__methodDeckRuntime.snapshot());

    await page.evaluate(() => window.__methodDeckRuntime.setReducedMotion(true));
    await clickMethod('diagnose');
    let state = await snapshot();
    assert.equal(state.expanded, 'true');
    assert.deepEqual(state.activeIds, ['diagnose']);
    assert.equal(state.detailHeading, 'Diagnose');
    assert.equal(state.allDetailRegionsVisible, true);
    assert.equal(state.listenerCount, 1);

    await page.evaluate(() => window.__methodDeckRuntime.setReducedMotion(false));
    await page.evaluate(() => {
      const explain = document.querySelector(
        '.hsm-deck__card[data-method-id="explain"]',
      );
      const review = document.querySelector(
        '.hsm-deck__card[data-method-id="review"]',
      );
      if (!(explain instanceof HTMLButtonElement)
        || !(review instanceof HTMLButtonElement)) {
        throw new Error('Rapid-selection cards are missing');
      }
      explain.click();
      review.click();
    });

    state = await snapshot();
    assert.equal(state.timelines.length, 2);
    assert.equal(state.timelines[0].callbackCount, 1);
    assert.equal(state.timelines[0].reverted, true);
    assert.equal(state.timelines[0].killed, true);
    assert.equal(state.timelines[1].callbackCount, 1);
    assert.equal(state.timelines[1].killed, false);

    await page.evaluate(() => window.__methodDeckRuntime.completeTimeline(1));
    state = await snapshot();
    assert.deepEqual(state.activeIds, ['review']);
    assert.equal(state.detailHeading, 'Review');
    assert.match(state.detailText, /We notice what happens next\./);
    assert.equal(state.flipStateCaptures, 1);
    assert.equal(state.flips[0].activeIdAtStart, 'review');
    assert.equal(state.flips[0].detailHeadingAtStart, 'Review');
    assert.ok(state.timelines.length >= 3);
    const reviewRevealIndex = state.timelines.length - 1;
    assert.equal(state.detailOpacity, '0');

    await page.evaluate(() => window.__methodDeckRuntime.forceTimelineCallbacks(0));
    state = await snapshot();
    assert.deepEqual(state.activeIds, ['review']);
    assert.equal(state.detailHeading, 'Review');

    await clickMethod('apply');
    state = await snapshot();
    assert.equal(state.flips[0].reverted, true);
    assert.equal(state.flips[0].killed, true);
    assert.equal(state.timelines[reviewRevealIndex].reverted, true);
    assert.equal(state.timelines[reviewRevealIndex].killed, true);
    const applyExitIndex = state.timelines.length - 1;
    assert.equal(state.timelines[applyExitIndex].callbackCount, 1);

    await page.evaluate(() => window.__methodDeckRuntime.setReducedMotion(true));
    await page.evaluate((index) => {
      window.__methodDeckRuntime.forceTimelineCallbacks(index);
    }, applyExitIndex);
    state = await snapshot();
    assert.deepEqual(state.activeIds, ['apply']);
    assert.equal(state.detailHeading, 'Apply');
    assert.match(state.detailText, /We make sure they can do it themselves\./);
    assert.equal(state.allDetailRegionsVisible, true);
    assert.equal(state.timelines[applyExitIndex].reverted, true);
    assert.equal(state.timelines[applyExitIndex].killed, true);

    await page.evaluate(() => window.__methodDeckRuntime.setReducedMotion(false));
    await clickMethod('practise');
    state = await snapshot();
    const practiseExitIndex = state.timelines.length - 1;
    await page.evaluate((index) => {
      window.__methodDeckRuntime.completeTimeline(index);
    }, practiseExitIndex);
    state = await snapshot();
    const pendingRevealIndex = state.timelines.length - 1;
    const pendingFlipIndex = state.flips.length - 1;
    assert.deepEqual(state.activeIds, ['practise']);
    assert.equal(state.detailHeading, 'Practise');
    assert.equal(state.timelines[pendingRevealIndex].killed, false);
    assert.equal(state.flips[pendingFlipIndex].killed, false);
    const killTweensBeforeUnmount = state.killTweensCallCount;

    await page.evaluate(() => window.__methodDeckRuntime.unmount());
    state = await snapshot();
    assert.equal(state.rootChildCount, 0);
    assert.equal(state.listenerCount, 0);
    assert.equal(state.timelines[pendingRevealIndex].reverted, true);
    assert.equal(state.timelines[pendingRevealIndex].killed, true);
    assert.equal(state.flips[pendingFlipIndex].reverted, true);
    assert.equal(state.flips[pendingFlipIndex].killed, true);
    assert.ok(state.killTweensCallCount > killTweensBeforeUnmount);
    assert.deepEqual(runtimeErrors, []);
  } finally {
    await browser?.close();
    await server.close();
  }
});

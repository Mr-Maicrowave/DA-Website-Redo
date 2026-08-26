import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
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
const dataSource = readFileSync(
  new URL('./methodTransitionData.ts', import.meta.url),
  'utf8',
);
const transitionStyles = readFileSync(
  new URL('./MethodTransition.css', import.meta.url),
  'utf8',
);
const transitionSource = readFileSync(
  new URL('./MethodTransition.tsx', import.meta.url),
  'utf8',
);
const deckStyles = readFileSync(
  new URL('./MethodTeachingDeck.css', import.meta.url),
  'utf8',
);
const featureSource = `${deckSource}\n${detailSource}\n${dataSource}\n${transitionStyles}\n${deckStyles}`;
const deckModuleUrl = `/@fs${fileURLToPath(
  new URL('./MethodTeachingDeck.tsx', import.meta.url),
)}`;
const transitionModuleUrl = `/@fs${fileURLToPath(
  new URL('./MethodTransition.tsx', import.meta.url),
)}`;
const assetDirectory = new URL('../../../../public/images/programs/high-school-method-transition/', import.meta.url);

const CARD_BASES = [
  'method-card-diagnose-forest-v1',
  'method-card-explain-blue-v1',
  'method-card-practise-purple-v1',
  'method-card-apply-orange-v1',
  'method-card-review-gold-v1',
];
const SUPPORT_BASES = [
  'how-we-teach-tutor-student-v1',
  'how-we-teach-watercolor-botanical-v1',
];
const optimizedAssetNames = [
  ...CARD_BASES.flatMap((base) => [
    `${base}-512w.avif`,
    `${base}-512w.webp`,
    `${base}-1024w.avif`,
    `${base}-1024w.webp`,
  ]),
  ...SUPPORT_BASES.flatMap((base) => [
    `${base}-768w.avif`,
    `${base}-768w.webp`,
    `${base}-1536w.avif`,
    `${base}-1536w.webp`,
  ]),
];

function relativeLuminance([red, green, blue]) {
  const linear = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
}

function parseCssColor(color) {
  const hex = color.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  if (hex) return hex.slice(1).map((channel) => Number.parseInt(channel, 16));

  const rgb = color.match(/^rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/);
  assert.ok(rgb, `Expected an RGB or hex color, received ${color}`);
  return rgb.slice(1, 4).map(Number);
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(parseCssColor(foreground));
  const backgroundLuminance = relativeLuminance(parseCssColor(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

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
        window.matchMedia = (query) => {
          if (query === motionQuery.media) return motionQuery;
          return {
            media: query,
            onchange: null,
            matches: query === '(min-width: 768px)' ? innerWidth >= 768 : false,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
            dispatchEvent() { return true; },
          };
        };

        const originalImageDecode = HTMLImageElement.prototype.decode;
        let artworkDecodeMode = 'native';
        let artworkDecodeCallCount = 0;
        const pendingArtworkDecodes = [];
        HTMLImageElement.prototype.decode = function () {
          artworkDecodeCallCount += 1;
          if (artworkDecodeMode !== 'defer') {
            return originalImageDecode.call(this);
          }
          return new Promise((resolve, reject) => {
            pendingArtworkDecodes.push({ resolve, reject });
          });
        };

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
            artworkDecodeCallCount,
            pendingArtworkDecodeCount: pendingArtworkDecodes.length,
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
          deferArtworkDecodes() {
            artworkDecodeMode = 'defer';
          },
          settleArtworkDecodes(outcome = 'resolve') {
            artworkDecodeMode = 'native';
            const pending = pendingArtworkDecodes.splice(0);
            for (const deferred of pending) {
              if (outcome === 'reject') deferred.reject(new Error('forced decode failure'));
              else deferred.resolve();
            }
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

function createMethodRouteFixturePlugin() {
  const fixtureId = 'virtual:method-transition-route-runtime';
  const resolvedFixtureId = `\0${fixtureId}`;

  return {
    name: 'method-transition-route-runtime-fixture',
    resolveId(id) {
      return id === fixtureId ? resolvedFixtureId : null;
    },
    load(id) {
      if (id !== resolvedFixtureId) return null;

      return `
        import { createElement } from 'react';
        import { createRoot } from 'react-dom/client';
        import { MethodTransition } from ${JSON.stringify(transitionModuleUrl)};

        const rootElement = document.querySelector('#root');
        if (!rootElement) throw new Error('Route fixture root is missing');
        createRoot(rootElement).render(createElement(MethodTransition));
      `;
    },
    transformIndexHtml() {
      return `<!doctype html>
        <html lang="en">
          <head><meta charset="UTF-8"><title>High School method route</title></head>
          <body style="margin:0">
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
  assert.equal((deckSource.match(/methodItems\.map/g) ?? []).length, 1);
  assert.equal((deckSource.match(/<button/g) ?? []).length, 1);
  assert.match(
    deckSource,
    /methodItems\.map\([\s\S]*?<button[\s\S]*?cardRefs\.current\[method\.id\]\s*=\s*element[\s\S]*?<\/button>/,
  );
  assert.match(deckSource, /aria-pressed/);
  assert.match(
    deckSource,
    /const focusMethod[\s\S]*?cardRefs\.current\[methodId\]\?\.focus\(\)/,
  );
  assert.match(
    deckSource,
    /onKeyDown=\{\(event\) => handleKeyDown\(event, method\.id\)\}/,
  );
  assert.match(deckSource, /selectMethod\(nextId\);\s*focusMethod\(nextId\);/);
});

test('only exposes the detail relationship while its target is mounted', () => {
  assert.doesNotMatch(deckSource, /aria-controls="hsm-method-detail"/);
  assert.match(
    deckSource,
    /aria-controls=\{expanded\s*\?\s*['"]hsm-method-detail['"]\s*:\s*undefined\}/,
  );
});

test('provides one editorial detail renderer', () => {
  assert.match(detailSource, /WHAT WE DO/);
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

test('keeps feature display typography stronger than the host page heading rule', () => {
  assert.match(
    deckStyles,
    /\.hsm-deck\s+\.hsm-deck__heading h2\s*\{[\s\S]*?font-family:\s*var\(--hsm-display\)/,
  );
  assert.match(
    deckStyles,
    /\.hsm-deck\s+\.hsm-deck__detail h3\s*\{[\s\S]*?font-family:\s*var\(--hsm-display\)/,
  );
});

test('uses a dedicated AA text accent for every method', () => {
  const textAccents = [...dataSource.matchAll(/textAccent:\s*['"](#[\da-f]{6})['"]/gi)]
    .map((match) => match[1]);

  assert.equal(textAccents.length, 5);
  for (const textAccent of textAccents) {
    assert.ok(
      contrastRatio(textAccent, '#fffdf7') >= 4.5,
      `${textAccent} must reach 4.5:1 against #fffdf7`,
    );
  }
  assert.match(deckSource, /['"]--hsm-active-text-accent['"]/);
  assert.match(deckStyles, /\.hsm-deck__emotional\s*\{[\s\S]*color:\s*var\(--hsm-active-text-accent\)/);
});

test('uses AA textual gold and a focus ring that contrasts with ivory and dark cards', () => {
  const textualGold = deckStyles.match(/--hsm-textual-gold:\s*(#[\da-f]{6})/i)?.[1];
  const focusRing = deckStyles.match(/--hsm-focus-ring:\s*(#[\da-f]{6})/i)?.[1];

  assert.ok(textualGold, 'Expected a textual-gold design token');
  assert.ok(focusRing, 'Expected a focus-ring design token');
  assert.ok(contrastRatio(textualGold, '#fffdf7') >= 4.5);
  assert.ok(contrastRatio(focusRing, '#fffdf7') >= 3);
  assert.ok(contrastRatio(focusRing, '#173d2a') >= 3);
  assert.match(
    deckStyles,
    /\.hsm-deck__method-index\s*\{[\s\S]*color:\s*var\(--hsm-textual-gold\)/,
  );
  assert.match(
    deckStyles,
    /\.hsm-deck__detail li em\s*\{[\s\S]*color:\s*var\(--hsm-textual-gold\)/,
  );
  assert.match(
    deckStyles,
    /\.hsm-deck__card:focus-visible\s*\{[\s\S]*outline:\s*3px solid var\(--hsm-focus-ring\)/,
  );
});

test('pins the mobile hero independently of selector scroll position', () => {
  assert.match(
    deckStyles,
    /@media\s*\(max-width:\s*767px\)[\s\S]*\.hsm-deck\[data-expanded=['"]true['"]\]\s+\.hsm-deck__card\.is-active\s*\{[\s\S]*position:\s*sticky[\s\S]*left:\s*0/,
  );
});

test('serves responsive AVIF and WebP deck imagery with intrinsic dimensions', () => {
  assert.ok(
    optimizedAssetNames.every((name) => existsSync(new URL(name, assetDirectory))),
    'Every card and supporting image needs both optimized widths in AVIF and WebP',
  );
  assert.match(dataSource, /cardAvifSmall/);
  assert.match(dataSource, /cardAvifLarge/);
  assert.match(dataSource, /cardWebpSmall/);
  assert.match(dataSource, /cardWebpLarge/);
  assert.match(deckSource, /type="image\/avif"/);
  assert.match(deckSource, /type="image\/webp"/);
  assert.match(deckSource, /srcSet=/);
  assert.match(deckSource, /width=\{1024\}[\s\S]*height=\{1536\}/);
  assert.match(deckSource, /width=\{1536\}[\s\S]*height=\{1024\}/);
  assert.match(deckSource, /loading="lazy"/);

  const originalBytes = [...CARD_BASES, ...SUPPORT_BASES]
    .map((base) => statSync(new URL(`${base}.png`, assetDirectory)).size)
    .reduce((total, size) => total + size, 0);
  const optimizedBytes = optimizedAssetNames
    .map((name) => statSync(new URL(name, assetDirectory)).size)
    .reduce((total, size) => total + size, 0);
  assert.ok(
    optimizedBytes < originalBytes,
    `Optimized responsive set (${optimizedBytes}) must stay below original delivery (${originalBytes})`,
  );
});

test('uses optimized handoff art without original card delivery and crops Apply consistently', () => {
  assert.match(
    transitionSource,
    /method\.cardAvifSmall[\s\S]*method\.cardAvifLarge[\s\S]*method\.cardWebpSmall[\s\S]*method\.cardWebpLarge/,
  );
  assert.match(
    transitionSource,
    /<picture>[\s\S]*type="image\/avif"[\s\S]*type="image\/webp"[\s\S]*<img[\s\S]*src=\{method\.card\}/,
  );
  assert.match(
    transitionStyles,
    /\.hsm-transition__card\s*\{[\s\S]*image-set\([\s\S]*method-card-diagnose-forest-v1-512w\.avif[\s\S]*method-card-diagnose-forest-v1-1024w\.avif[\s\S]*method-card-diagnose-forest-v1\.png/,
  );
  assert.match(
    deckStyles,
    /\.hsm-deck__card--apply\s*\{[\s\S]*--hsm-card-art-scale:\s*1\.2[3-9]/,
  );
  assert.match(
    transitionStyles,
    /\.hsm-transition__companion-card--apply\s*\{[\s\S]*--hsm-card-art-scale:\s*1\.2[3-9]/,
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
  timeout: 240_000,
}, async () => {
  const server = await createServer({
    appType: 'spa',
    configFile: false,
    logLevel: 'silent',
    optimizeDeps: { entries: [] },
    plugins: [createMountedDeckFixturePlugin()],
    root: fileURLToPath(new URL('../../../..', import.meta.url)),
    server: { host: '127.0.0.1', port: 0, hmr: false },
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
    await page.goto(baseUrl, { timeout: 180_000, waitUntil: 'domcontentloaded' });
    try {
      await page.waitForFunction(
        () => Boolean(window.__methodDeckRuntime),
        { timeout: 30_000 },
      );
    } catch (error) {
      assert.fail(`Mounted runtime did not initialise: ${error.message}; ${runtimeErrors.join(' | ')}`);
    }
    await page.waitForSelector('.hsm-deck__card[data-method-id="diagnose"]');
    await page.waitForFunction(
      () => [...document.querySelectorAll('.hsm-deck__card img')]
        .every((image) => image instanceof HTMLImageElement
          && image.complete
          && image.naturalWidth > 0),
      { timeout: 10_000 },
    );
    const optimizedCardSources = await page.evaluate(() => (
      [...document.querySelectorAll('.hsm-deck__card img')]
        .map((image) => image instanceof HTMLImageElement ? image.currentSrc : '')
    ));
    assert.equal(optimizedCardSources.length, 5);
    assert.ok(
      optimizedCardSources.every((source) => /\.(?:avif|webp)$/.test(source)),
      `Expected optimized card sources, received ${optimizedCardSources.join(', ')}`,
    );
    const overviewApplyCoverage = await page.$eval(
      '.hsm-deck__card[data-method-id="apply"]',
      (card) => {
        const image = card.querySelector('img');
        if (!(image instanceof HTMLImageElement)) {
          throw new Error('Apply overview artwork is missing');
        }
        const cardRect = card.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();
        return {
          widthRatio: imageRect.width / cardRect.width,
          coversLeft: imageRect.left <= cardRect.left,
          coversRight: imageRect.right >= cardRect.right,
        };
      },
    );
    assert.ok(overviewApplyCoverage.widthRatio >= 1.23);
    assert.equal(overviewApplyCoverage.coversLeft, true);
    assert.equal(overviewApplyCoverage.coversRight, true);

    const initialSemantics = await page.evaluate(() => {
      const collections = [...document.querySelectorAll('.hsm-deck__cards')];
      const buttons = collections.flatMap((collection) => (
        [...collection.querySelectorAll(':scope > button.hsm-deck__card')]
      ));
      const status = document.querySelector('[data-method-status]');

      return {
        collectionCount: collections.length,
        buttonCount: buttons.length,
        controlledTargets: buttons.map((button) => button.getAttribute('aria-controls')),
        detailExists: document.querySelector('#hsm-method-detail') !== null,
        statusCount: document.querySelectorAll('[data-method-status]').length,
        statusText: status?.textContent ?? null,
        statusRole: status?.getAttribute('role') ?? null,
        statusLive: status?.getAttribute('aria-live') ?? null,
        statusAtomic: status?.getAttribute('aria-atomic') ?? null,
      };
    });
    assert.equal(initialSemantics.collectionCount, 1);
    assert.equal(initialSemantics.buttonCount, 5);
    assert.deepEqual(initialSemantics.controlledTargets, [null, null, null, null, null]);
    assert.equal(initialSemantics.detailExists, false);
    assert.equal(initialSemantics.statusCount, 1);
    assert.equal(initialSemantics.statusText, '');
    assert.equal(initialSemantics.statusRole, 'status');
    assert.equal(initialSemantics.statusLive, 'polite');
    assert.equal(initialSemantics.statusAtomic, 'true');

    await page.evaluate(() => window.__methodDeckRuntime.setReducedMotion(true));
    await page.evaluate(() => {
      const status = document.querySelector('[data-method-status]');
      if (!(status instanceof HTMLElement)) {
        throw new Error('Method status region is missing');
      }
      window.__methodStatusElement = status;
      window.__methodStatusUpdates = [];
      window.__methodStatusObserver = new MutationObserver(() => {
        const text = status.textContent ?? '';
        if (window.__methodStatusUpdates.at(-1) !== text) {
          window.__methodStatusUpdates.push(text);
        }
      });
      window.__methodStatusObserver.observe(status, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    });
    await page.focus('.hsm-deck__card[data-method-id="diagnose"]');
    await page.keyboard.press('ArrowRight');
    const keyboardSelection = await page.evaluate(async () => {
      await new Promise((resolve) => queueMicrotask(resolve));
      const status = document.querySelector('[data-method-status]');
      const detail = document.querySelector('#hsm-method-detail');
      return {
        focusedId: document.activeElement instanceof HTMLButtonElement
          ? document.activeElement.dataset.methodId ?? null
          : null,
        activeIds: [...document.querySelectorAll('.hsm-deck__card[aria-pressed="true"]')]
          .map((button) => button.getAttribute('data-method-id')),
        controlledTargets: [...document.querySelectorAll('.hsm-deck__card')]
          .map((button) => button.getAttribute('aria-controls')),
        detailExists: detail !== null,
        detailLive: detail?.getAttribute('aria-live') ?? null,
        detailAtomic: detail?.getAttribute('aria-atomic') ?? null,
        statusCount: document.querySelectorAll('[data-method-status]').length,
        statusText: status?.textContent ?? null,
        statusUpdates: [...window.__methodStatusUpdates],
        statusStayedMounted: status === window.__methodStatusElement,
      };
    });
    assert.equal(keyboardSelection.focusedId, 'explain');
    assert.deepEqual(keyboardSelection.activeIds, ['explain']);
    assert.deepEqual(
      keyboardSelection.controlledTargets,
      Array.from({ length: 5 }, () => 'hsm-method-detail'),
    );
    assert.equal(keyboardSelection.detailExists, true);
    assert.equal(keyboardSelection.detailLive, null);
    assert.equal(keyboardSelection.detailAtomic, null);
    assert.equal(keyboardSelection.statusCount, 1);
    assert.equal(keyboardSelection.statusText, 'Explain selected');
    assert.deepEqual(keyboardSelection.statusUpdates, ['Explain selected']);
    assert.equal(keyboardSelection.statusStayedMounted, true);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(
      () => Boolean(window.__methodDeckRuntime),
      { timeout: 30_000 },
    );

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

    await page.evaluate(() => {
      window.__methodDeckRuntime.setReducedMotion(false);
      window.__methodDeckRuntime.deferArtworkDecodes();
    });
    await clickMethod('explain');
    state = await snapshot();
    assert.equal(state.timelines.length, 1);
    assert.equal(state.timelines[0].callbackCount, 1);

    await page.evaluate(() => window.__methodDeckRuntime.completeTimeline(0));
    state = await snapshot();
    assert.equal(state.pendingArtworkDecodeCount, 5);
    assert.equal(state.flipStateCaptures, 0);
    assert.deepEqual(state.activeIds, ['diagnose']);

    await clickMethod('review');
    state = await snapshot();
    assert.equal(state.timelines.length, 2);
    assert.equal(state.timelines[0].reverted, true);
    assert.equal(state.timelines[0].killed, true);
    assert.equal(state.timelines[1].callbackCount, 1);
    assert.equal(state.timelines[1].killed, false);

    await page.evaluate(() => window.__methodDeckRuntime.completeTimeline(1));
    state = await snapshot();
    assert.equal(state.pendingArtworkDecodeCount, 10);
    assert.equal(state.flipStateCaptures, 0);
    assert.deepEqual(state.activeIds, ['diagnose']);

    await page.evaluate(() => window.__methodDeckRuntime.settleArtworkDecodes());
    await page.waitForFunction(() => (
      window.__methodDeckRuntime.snapshot().activeIds[0] === 'review'
    ));
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

    await page.evaluate(() => window.__methodDeckRuntime.deferArtworkDecodes());
    await clickMethod('apply');
    state = await snapshot();
    assert.equal(state.flips[0].reverted, true);
    assert.equal(state.flips[0].killed, true);
    assert.equal(state.timelines[reviewRevealIndex].reverted, true);
    assert.equal(state.timelines[reviewRevealIndex].killed, true);
    const applyExitIndex = state.timelines.length - 1;
    assert.equal(state.timelines[applyExitIndex].callbackCount, 1);

    await page.evaluate((index) => {
      window.__methodDeckRuntime.completeTimeline(index);
    }, applyExitIndex);
    state = await snapshot();
    assert.equal(state.pendingArtworkDecodeCount, 5);
    const flipCountBeforeDecodeFailure = state.flipStateCaptures;
    await page.evaluate(() => window.__methodDeckRuntime.settleArtworkDecodes('reject'));
    await page.waitForFunction(() => (
      window.__methodDeckRuntime.snapshot().activeIds[0] === 'apply'
    ));
    state = await snapshot();
    assert.deepEqual(state.activeIds, ['apply']);
    assert.equal(state.detailHeading, 'Apply');
    assert.match(state.detailText, /We make sure they can do it themselves\./);
    assert.equal(state.allDetailRegionsVisible, true);
    assert.equal(state.flipStateCaptures, flipCountBeforeDecodeFailure);

    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await page.evaluate(() => window.__methodDeckRuntime.setReducedMotion(true));
    await page.evaluate(() => {
      const selector = document.querySelector('.hsm-deck__cards');
      if (!(selector instanceof HTMLElement)) {
        throw new Error('Mobile selector is missing');
      }
      selector.scrollLeft = selector.scrollWidth;
    });
    const heroApplyCoverage = await page.$eval(
      '.hsm-deck__card[data-method-id="apply"]',
      (card) => {
        const image = card.querySelector('img');
        if (!(image instanceof HTMLImageElement)) {
          throw new Error('Apply hero artwork is missing');
        }
        const cardRect = card.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();
        return {
          widthRatio: imageRect.width / cardRect.width,
          coversLeft: imageRect.left <= cardRect.left,
          coversRight: imageRect.right >= cardRect.right,
        };
      },
    );
    assert.ok(heroApplyCoverage.widthRatio >= 1.23);
    assert.equal(heroApplyCoverage.coversLeft, true);
    assert.equal(heroApplyCoverage.coversRight, true);
    const mobileKeyboard = await page.$eval(
      '.hsm-deck__card[data-method-id="apply"]',
      (button) => {
        if (!(button instanceof HTMLButtonElement)) {
          throw new Error('Apply mobile card is missing');
        }
        button.focus();
        const down = new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          bubbles: true,
          cancelable: true,
        });
        const downDispatchResult = button.dispatchEvent(down);
        const afterDown = document.querySelector(
          '.hsm-deck__card[aria-pressed="true"]',
        )?.getAttribute('data-method-id');
        const right = new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          bubbles: true,
          cancelable: true,
        });
        const rightDispatchResult = button.dispatchEvent(right);
        return {
          downDefaultPrevented: down.defaultPrevented,
          downDispatchResult,
          activeAfterDown: afterDown,
          rightDefaultPrevented: right.defaultPrevented,
          rightDispatchResult,
          activeAfterRight: document.querySelector(
            '.hsm-deck__card[aria-pressed="true"]',
          )?.getAttribute('data-method-id'),
          focusedAfterRight: document.activeElement instanceof HTMLButtonElement
            ? document.activeElement.dataset.methodId
            : null,
        };
      },
    );
    assert.equal(mobileKeyboard.downDefaultPrevented, false);
    assert.equal(mobileKeyboard.downDispatchResult, true);
    assert.equal(mobileKeyboard.activeAfterDown, 'apply');
    assert.equal(mobileKeyboard.rightDefaultPrevented, true);
    assert.equal(mobileKeyboard.rightDispatchResult, false);
    assert.equal(mobileKeyboard.activeAfterRight, 'review');
    assert.equal(mobileKeyboard.focusedAfterRight, 'review');
    const mobileHero = await page.evaluate(() => {
      const selector = document.querySelector('.hsm-deck__cards');
      const hero = document.querySelector('.hsm-deck__card.is-active');
      if (!(selector instanceof HTMLElement)
        || !(hero instanceof HTMLButtonElement)) {
        throw new Error('Mobile hero layout is missing');
      }
      const heroRect = hero.getBoundingClientRect();
      return {
        activeId: hero.dataset.methodId,
        left: heroRect.left,
        right: heroRect.right,
        height: heroRect.height,
        viewportWidth: window.innerWidth,
        selectorScrollLeft: selector.scrollLeft,
      };
    });
    assert.equal(mobileHero.activeId, 'review');
    assert.ok(mobileHero.selectorScrollLeft > 0);
    assert.ok(mobileHero.left >= 0, `Hero left edge ${mobileHero.left} is clipped`);
    assert.ok(
      mobileHero.right <= mobileHero.viewportWidth,
      `Hero right edge ${mobileHero.right} exceeds ${mobileHero.viewportWidth}`,
    );
    assert.ok(mobileHero.height >= 300 && mobileHero.height <= 360);
    const mobileScreenshot = await page.screenshot({ type: 'png' });
    assert.ok(mobileScreenshot.byteLength > 0);
    const inactiveApplyCoverage = await page.$eval(
      '.hsm-deck__card[data-method-id="apply"]',
      (card) => {
        const image = card.querySelector('img');
        if (!(image instanceof HTMLImageElement)) {
          throw new Error('Apply inactive artwork is missing');
        }
        const cardRect = card.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();
        return {
          widthRatio: imageRect.width / cardRect.width,
          coversLeft: imageRect.left <= cardRect.left,
          coversRight: imageRect.right >= cardRect.right,
        };
      },
    );
    assert.ok(inactiveApplyCoverage.widthRatio >= 1.23);
    assert.equal(inactiveApplyCoverage.coversLeft, true);
    assert.equal(inactiveApplyCoverage.coversRight, true);

    const computedTextAccents = [];
    for (const methodId of ['diagnose', 'explain', 'practise', 'apply', 'review']) {
      await clickMethod(methodId);
      computedTextAccents.push(await page.evaluate(() => {
        const emotional = document.querySelector('.hsm-deck__emotional');
        if (!(emotional instanceof HTMLElement)) {
          throw new Error('Emotional subheading is missing');
        }
        return getComputedStyle(emotional).color;
      }));
    }
    for (const computedTextAccent of computedTextAccents) {
      assert.ok(
        contrastRatio(computedTextAccent, '#fffdf7') >= 4.5,
        `${computedTextAccent} must reach 4.5:1 against #fffdf7`,
      );
    }
    const goldAndFocusColors = await page.evaluate(() => {
      const methodIndex = document.querySelector('.hsm-deck__method-index');
      const annotation = document.querySelector('[data-method-annotation]');
      const focusedCard = document.querySelector('.hsm-deck__card[aria-pressed="true"]');
      if (!(methodIndex instanceof HTMLElement)
        || !(annotation instanceof HTMLElement)
        || !(focusedCard instanceof HTMLButtonElement)) {
        throw new Error('Contrast targets are missing');
      }
      focusedCard.focus();
      return {
        methodIndex: getComputedStyle(methodIndex).color,
        annotation: getComputedStyle(annotation).color,
        focusRing: getComputedStyle(focusedCard).outlineColor,
      };
    });
    assert.ok(contrastRatio(goldAndFocusColors.methodIndex, '#fffdf7') >= 4.5);
    assert.ok(contrastRatio(goldAndFocusColors.annotation, '#fffdf7') >= 4.5);
    assert.ok(contrastRatio(goldAndFocusColors.focusRing, '#fffdf7') >= 3);
    assert.ok(contrastRatio(goldAndFocusColors.focusRing, '#173d2a') >= 3);

    await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 1 });

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

test('high-school method route decodes artwork and stays within its request budget', {
  timeout: 240_000,
}, async () => {
  const projectRoot = fileURLToPath(new URL('../../../..', import.meta.url));
  const server = await createServer({
    appType: 'spa',
    configFile: false,
    root: projectRoot,
    logLevel: 'silent',
    optimizeDeps: { entries: [] },
    plugins: [createMethodRouteFixturePlugin()],
    server: { host: '127.0.0.1', port: 0, hmr: false },
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
    page.setDefaultTimeout(90_000);
    const routeErrors = [];
    page.on('pageerror', (error) => routeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') routeErrors.push(message.text());
    });
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);
    const failedArtworkRequests = [];
    const requestedCardAssets = [];
    page.on('request', (request) => {
      if (/method-card-/.test(request.url())) {
        requestedCardAssets.push(new URL(request.url()).pathname.split('/').at(-1));
      }
    });
    page.on('requestfailed', (request) => {
      if (/method-card-/.test(request.url())) {
        failedArtworkRequests.push(
          `${request.url()}: ${request.failure()?.errorText ?? 'unknown failure'}`,
        );
      }
    });

    await page.goto(`${baseUrl}/programs/high-school`, {
      timeout: 180_000,
      waitUntil: 'domcontentloaded',
    });
    try {
      await page.waitForSelector('.hsm-deck__card[data-method-id="diagnose"]');
    } catch (error) {
      assert.fail(`Route deck did not render: ${error.message}; ${routeErrors.join(' | ')}`);
    }
    await page.waitForFunction(
      () => document.querySelector('.hsm-deck')?.getAttribute('data-ready') === 'true',
      { timeout: 90_000 },
    );
    const transitionTop = await page.$eval(
      '.hsm-transition__runway',
      (runway) => runway.getBoundingClientRect().top + scrollY,
    );
    await page.evaluate((top) => scrollTo(0, top), transitionTop);
    await page.evaluate(() => new Promise((resolve) => (
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    )));
    const handoffScreenshot = await page.screenshot({ type: 'png' });
    assert.ok(handoffScreenshot.byteLength > 0);
    const deckTop = await page.$eval(
      '.hsm-deck',
      (deck) => deck.getBoundingClientRect().top + scrollY,
    );
    await page.evaluate((top) => scrollTo(0, top + 40), deckTop);
    const upstreamApplyCoverage = await page.$eval(
      '.hsm-transition__companion-card--apply',
      (card) => {
        const image = card.querySelector('img');
        if (!(image instanceof HTMLImageElement)) {
          throw new Error('Upstream Apply companion artwork is missing');
        }
        const cardRect = card.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();
        return {
          widthRatio: imageRect.width / cardRect.width,
          coversLeft: imageRect.left <= cardRect.left,
          coversRight: imageRect.right >= cardRect.right,
        };
      },
    );
    assert.ok(upstreamApplyCoverage.widthRatio >= 1.23);
    assert.equal(upstreamApplyCoverage.coversLeft, true);
    assert.equal(upstreamApplyCoverage.coversRight, true);

    const inspectArtworksBeforeCapture = async (expectedActiveId) => {
      const evidence = await page.evaluate(async () => {
        const cards = [...document.querySelectorAll('.hsm-deck__card')];
        await Promise.all(cards.map(async (card) => {
          const image = card.querySelector('img');
          if (!(image instanceof HTMLImageElement)) {
            throw new Error(`Artwork image missing for ${card.getAttribute('data-method-id')}`);
          }
          await image.decode();
        }));
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        return cards.map((card) => {
          const image = card.querySelector('img');
          const cardRect = card.getBoundingClientRect();
          const imageRect = image.getBoundingClientRect();
          const cardStyle = getComputedStyle(card);
          const imageStyle = getComputedStyle(image);
          return {
            id: card.getAttribute('data-method-id'),
            active: card.matches('.is-active'),
            complete: image.complete,
            naturalWidth: image.naturalWidth,
            currentSrc: image.currentSrc,
            cardWidth: cardRect.width,
            cardHeight: cardRect.height,
            imageWidth: imageRect.width,
            imageHeight: imageRect.height,
            cardOpacity: cardStyle.opacity,
            cardVisibility: cardStyle.visibility,
            imageOpacity: imageStyle.opacity,
            imageVisibility: imageStyle.visibility,
          };
        });
      });

      assert.equal(evidence.length, 5);
      assert.deepEqual(
        evidence.filter((artwork) => artwork.active).map((artwork) => artwork.id),
        [expectedActiveId],
      );
      for (const artwork of evidence) {
        assert.equal(artwork.complete, true, `${artwork.id} must finish loading`);
        assert.ok(artwork.naturalWidth > 0, `${artwork.id} must decode`);
        assert.match(artwork.currentSrc, /method-card-.+\.(?:avif|webp|png)$/);
        assert.ok(artwork.cardWidth > 0 && artwork.cardHeight > 0, `${artwork.id} card must have visible bounds`);
        assert.ok(artwork.imageWidth > 0 && artwork.imageHeight > 0, `${artwork.id} image must have visible bounds`);
        assert.equal(artwork.cardOpacity, '1');
        assert.equal(artwork.cardVisibility, 'visible');
        assert.equal(artwork.imageOpacity, '1');
        assert.equal(artwork.imageVisibility, 'visible');
        if (artwork.id === 'apply') {
          assert.ok(artwork.imageWidth / artwork.cardWidth >= 1.23);
        }
      }

      const screenshot = await page.screenshot({ type: 'png' });
      assert.ok(screenshot.byteLength > 0);
    };

    await inspectArtworksBeforeCapture('diagnose');
    for (const methodId of ['diagnose', 'explain', 'practise', 'apply', 'review']) {
      await page.$eval(
        `.hsm-deck__card[data-method-id="${methodId}"]`,
        (button) => button.click(),
      );
      await page.waitForFunction((expectedId) => (
        document.querySelector('.hsm-deck__card[aria-pressed="true"]')
          ?.getAttribute('data-method-id') === expectedId
      ), {}, methodId);
      await inspectArtworksBeforeCapture(methodId);
    }

    const uniqueCardAssets = [...new Set(requestedCardAssets)].sort();
    const originalCardRequests = uniqueCardAssets.filter((asset) => /-v1\.png$/.test(asset));
    assert.deepEqual(originalCardRequests, []);
    const expectedCardAssets = CARD_BASES
      .flatMap((base) => [
        `${base}-512w.avif`,
        `${base}-1024w.avif`,
      ])
      .sort();
    assert.deepEqual(uniqueCardAssets, expectedCardAssets);
    const originalHandoffBytes = CARD_BASES
      .map((base) => statSync(new URL(`${base}.png`, assetDirectory)).size)
      .reduce((total, size) => total + size, 0);
    const optimizedHandoffBytes = CARD_BASES
      .map((base) => statSync(new URL(`${base}-512w.avif`, assetDirectory)).size)
      .reduce((total, size) => total + size, 0);
    const currentRouteCardBytes = CARD_BASES
      .flatMap((base) => [`${base}-512w.avif`, `${base}-1024w.avif`])
      .map((asset) => statSync(new URL(asset, assetDirectory)).size)
      .reduce((total, size) => total + size, 0);
    const previousUniqueRouteCardBytes = originalHandoffBytes + currentRouteCardBytes;
    assert.equal(previousUniqueRouteCardBytes - currentRouteCardBytes, 14_297_202);
    assert.equal(originalHandoffBytes - optimizedHandoffBytes, 14_121_074);
    assert.deepEqual(failedArtworkRequests, []);
  } finally {
    await browser?.close();
    await server.close();
  }
});

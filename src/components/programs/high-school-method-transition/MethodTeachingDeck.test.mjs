import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

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
const featureSource = `${deckSource}\n${detailSource}\n${transitionStyles}`;

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

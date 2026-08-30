import assert from 'node:assert/strict';
import test from 'node:test';

const expectedScreenshotNames = [
  '01-room-idle-1920.png',
  '02-room-idle-1440.png',
  '03-room-idle-1366.png',
  '04-tablet-tap-preview.png',
  '05-mobile-390-reading.png',
  '06-turn-start.png',
  '07-turn-50.png',
  '08-turn-settled.png',
  '09-shelf-rest.png',
  '10-extract-50.png',
  '11-cover-preview.png',
  '12-open-50.png',
  '13-reading-open.png',
  '14-page-25.png',
  '15-page-50.png',
  '16-page-75.png',
  '17-page-settled.png',
  '18-close-50.png',
  '19-return-50.png',
  '20-exact-shelf-restored.png',
  '21-keyboard-focus-reading.png',
  '22-reduced-motion-readable.png',
  '23-escape-mid-opening-restored.png',
  '24-rapid-switch-resize-visibility-resume-stable.png',
] as const;

const expectedComparisonStates = [
  'closed-three-quarter',
  'half-open',
  'fully-open',
  'page-50',
  'settled-page',
  'closed-reset',
] as const;

const captureModule = await import('../../../scripts/capture-tutor-library-acceptance.mjs')
  .catch(() => ({} as Record<string, unknown>));
const debugModule = await import('./tutor-library-debug.ts');

test('binds the final acceptance run to the exact 24 integrated screenshot names', () => {
  const captures = captureModule.ACCEPTANCE_SCREENSHOTS as undefined | readonly { file: string }[];
  assert.deepEqual(captures?.map(capture => capture.file), expectedScreenshotNames);
  assert.equal(new Set(captures?.map(capture => capture.file)).size, 24);
});

test('pairs every approved Checkpoint 2 state between standalone and R3F hosts', () => {
  const comparisons = captureModule.CHECKPOINT_COMPARISONS as undefined | readonly { state: string; standaloneFile: string; r3fFile: string }[];
  assert.deepEqual(comparisons?.map(comparison => comparison.state), expectedComparisonStates);
  for (const comparison of comparisons ?? []) {
    assert.equal(comparison.standaloneFile, `comparisons/${comparison.state}-standalone.png`);
    assert.equal(comparison.r3fFile, `comparisons/${comparison.state}-r3f.png`);
  }
});

test('allows the production Complete Shelf primitive enough time to mount in constrained browsers', () => {
  assert.equal(captureModule.MOUNTED_ROOT_TIMEOUT_MS, 60_000);
});

test('rejects evidence that is not root-persistent, reset-clean, console-clean, or restored within 1e-6', () => {
  const validate = captureModule.validateLifecycleEvidence as undefined | ((evidence: unknown) => void);
  assert.equal(typeof validate, 'function');
  const valid = {
    cycleCount: 10,
    rootUuids: Array.from({ length: 10 }, () => 'persistent-root'),
    maximumMatrixDelta: 0.000001,
    resetResidue: { openProgress: 0, pageTurnProgress: 0, settledPages: 0, deformationReset: true },
    consoleErrors: [],
    canvasElementCountBefore: 1,
    canvasElementCountAfter: 1,
    horizontalOverflow: 0,
    routeHref: 'http://127.0.0.1:4179/find-teacher?tutor=T003',
  };
  validate?.(valid);
  assert.throws(() => validate?.({ ...valid, cycleCount: 9 }), /ten full cycles/i);
  assert.throws(() => validate?.({ ...valid, rootUuids: [...valid.rootUuids.slice(0, 9), 'replacement-root'] }), /persistent physical root/i);
  assert.throws(() => validate?.({ ...valid, maximumMatrixDelta: 0.0000011 }), /1e-6/i);
  assert.throws(() => validate?.({ ...valid, resetResidue: { ...valid.resetResidue, settledPages: 1 } }), /residue/i);
  assert.throws(() => validate?.({ ...valid, consoleErrors: ['Uncaught Error'] }), /console/i);
  assert.throws(() => validate?.({ ...valid, canvasElementCountAfter: 2 }), /canvas replacement/i);
  assert.throws(() => validate?.({ ...valid, horizontalOverflow: 1 }), /overflow/i);
  assert.throws(() => validate?.({ ...valid, routeHref: 'http://127.0.0.1:4179/tutors?tutor=T003' }), /find-teacher/i);
});

test('requires every manifest capture to record the reproducibility and health fields', () => {
  const validate = captureModule.validateCaptureRecord as undefined | ((record: unknown) => void);
  assert.equal(typeof validate, 'function');
  const valid = {
    file: expectedScreenshotNames[0],
    url: 'http://127.0.0.1:4179/tutors?library-preview=1',
    viewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
    phase: 'ROOM_IDLE',
    transitionId: 'library-0',
    rootUuid: 'persistent-root',
    matrixDelta: '0.000000',
    resetState: 'idle',
    controllerProgress: 'unavailable',
    consoleStatus: 'clean',
  };
  validate?.(valid);
  for (const field of ['file', 'url', 'viewport', 'phase', 'transitionId', 'rootUuid', 'matrixDelta', 'resetState', 'controllerProgress', 'consoleStatus']) {
    const incomplete = { ...valid } as Record<string, unknown>;
    delete incomplete[field];
    assert.throws(() => validate?.(incomplete), new RegExp(field, 'i'));
  }
  assert.throws(() => validate?.({ ...valid, rootUuid: 'unmounted' }), /mounted physical root/i);
  assert.throws(() => validate?.({ ...valid, matrixDelta: 'unavailable' }), /matrix delta/i);
});

test('maps query-driven integrated QA states onto the production scene and physical controller', () => {
  const select = (debugModule as Record<string, unknown>).selectTutorLibraryQaState as undefined | ((value: string | null) => unknown);
  assert.equal(typeof select, 'function');
  const expectations = [
    ['shelf-rest', 'ROOM_IDLE', 0, 0, 0, false],
    ['hover-intent', 'BOOK_HOVER_INTENT', 0, 0, 0, false],
    ['extract-50', 'BOOK_EXTRACTING', .5, 0, 0, false],
    ['cover-preview', 'BOOK_PREVIEW', 1, 0, 0, false],
    ['open-50', 'BOOK_OPENING', 1, .5, 0, false],
    ['reading-open', 'BOOK_READING', 1, 1, 0, false],
    ['page-25', 'PAGE_TURNING', 1, 1, .25, false],
    ['page-50', 'PAGE_TURNING', 1, 1, .5, false],
    ['page-75', 'PAGE_TURNING', 1, 1, .75, false],
    ['page-settled', 'PAGE_SETTLED', 1, 1, 0, true],
    ['close-50', 'BOOK_CLOSING', 1, .5, 0, false],
    ['return-50', 'BOOK_RETURNING', .5, 0, 0, false],
    ['shelf-restored', 'ROOM_IDLE', 0, 0, 0, false],
  ] as const;
  for (const [value, phase, motionProgress, openProgress, pageTurnProgress, settlePage] of expectations) {
    assert.deepEqual(select?.(value), {
      id: value,
      phase,
      motionProgress,
      controller: { openProgress, pageTurnProgress, settlePage },
      showReader: !['shelf-rest', 'shelf-restored', 'hover-intent', 'extract-50'].includes(value),
    });
  }
});

test('rejects malformed integrated QA selectors instead of approximating a state', () => {
  const select = (debugModule as Record<string, unknown>).selectTutorLibraryQaState as undefined | ((value: string | null) => unknown);
  for (const value of [null, '', 'page-49', 'open', 'BOOK_READING', 'shelf-rest ']) {
    assert.equal(select?.(value), undefined);
  }
});

test('publishes physical reset residue alongside root and matrix diagnostics', () => {
  const root = { dataset: {} as Record<string, string> };
  const canvas = { closest: () => root } as unknown as HTMLCanvasElement;
  debugModule.writeTutorLibraryRigDiagnostics(canvas, {
    rootUuid: 'persistent-root',
    matrixDelta: 0,
    resetState: 'complete',
    controllerSnapshot: {
      rootUuid: 'persistent-root',
      openProgress: 0,
      pageTurnProgress: 0,
      settledPages: 0,
      pagePivotCount: 6,
      pageSettled: false,
      deformationReset: true,
    },
  });
  assert.deepEqual(root.dataset, {
    libraryRootUuid: 'persistent-root',
    libraryMatrixDelta: '0.000000',
    libraryResetState: 'complete',
    libraryOpenProgress: '0.000000',
    libraryPageTurnProgress: '0.000000',
    librarySettledPages: '0',
    libraryDeformationReset: 'true',
  });
});

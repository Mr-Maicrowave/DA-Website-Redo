import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createLibraryState,
  libraryReducer,
  type ControllerResetSnapshot,
  type LibraryEvent,
  type LibraryPhase,
  type LibraryState,
} from './tutor-library-state.ts';

const resetReady: ControllerResetSnapshot = {
  rootUuid: 'root-a',
  closeComplete: true,
  resetComplete: true,
  openProgress: 0,
  pageTurnProgress: 0,
  settledPages: 0,
  deformationReset: true,
};

type CompletionType =
  | 'TURN_COMPLETE'
  | 'HOVER_INTENT_COMPLETE'
  | 'EXTRACT'
  | 'PREVIEW_READY'
  | 'READING_POSE_READY'
  | 'OPEN_COMPLETE'
  | 'PAGE_TURN_COMPLETE'
  | 'CLOSE_COMPLETE'
  | 'RESET_COMPLETE'
  | 'RETURN_COMPLETE';
type CompletionEvent = Extract<LibraryEvent, { type: CompletionType }>;
type WithoutGeneration<T> = T extends unknown ? Omit<T, 'generation'> : never;

const complete = (state: LibraryState, event: WithoutGeneration<CompletionEvent>): LibraryState =>
  libraryReducer(state, { ...event, generation: state.transitionGeneration } as LibraryEvent);

function reachPreview(): LibraryState {
  let state = libraryReducer(createLibraryState('primary'), { type: 'HOVER', editionId: 'book-a', rootUuid: 'root-a' });
  state = complete(state, { type: 'HOVER_INTENT_COMPLETE' });
  return complete(state, { type: 'PREVIEW_READY' });
}

function reachReading(): LibraryState {
  let state = libraryReducer(reachPreview(), { type: 'OPEN' });
  state = complete(state, { type: 'READING_POSE_READY' });
  return complete(state, { type: 'OPEN_COMPLETE' });
}

function finishReturn(state: LibraryState): LibraryState {
  state = complete(state, { type: 'CLOSE_COMPLETE' });
  state = complete(state, { type: 'RESET_COMPLETE', controller: resetReady });
  return complete(state, { type: 'RETURN_COMPLETE' });
}

test('runs every legal book lifecycle transition without frame-level state', () => {
  let state = createLibraryState('primary');
  assert.deepEqual(state, { phase: 'ROOM_IDLE', activeWallId: 'primary', transitionGeneration: 0 });

  state = libraryReducer(state, { type: 'HOVER', editionId: 'book-a', rootUuid: 'root-a' });
  assert.deepEqual([state.phase, state.selectedEditionId, state.expectedRootUuid, state.transitionGeneration], ['BOOK_HOVER_INTENT', 'book-a', 'root-a', 1]);
  state = complete(state, { type: 'HOVER_INTENT_COMPLETE' });
  assert.equal(state.phase, 'BOOK_EXTRACTING');
  state = complete(state, { type: 'PREVIEW_READY' });
  assert.equal(state.phase, 'BOOK_PREVIEW');
  state = libraryReducer(state, { type: 'OPEN' });
  assert.equal(state.phase, 'BOOK_TO_READING');
  state = complete(state, { type: 'READING_POSE_READY' });
  assert.equal(state.phase, 'BOOK_OPENING');
  state = complete(state, { type: 'OPEN_COMPLETE' });
  assert.equal(state.phase, 'BOOK_READING');
  state = libraryReducer(state, { type: 'PAGE_DRAG_START' });
  assert.equal(state.phase, 'PAGE_DRAGGING');
  state = libraryReducer(state, { type: 'PAGE_TURN' });
  assert.equal(state.phase, 'PAGE_TURNING');
  state = complete(state, { type: 'PAGE_TURN_COMPLETE' });
  assert.equal(state.phase, 'PAGE_SETTLED');
  state = libraryReducer(state, { type: 'CLOSE' });
  assert.equal(state.phase, 'BOOK_CLOSING');
  state = complete(state, { type: 'CLOSE_COMPLETE' });
  assert.equal(state.phase, 'BOOK_RESETTING');
  state = complete(state, { type: 'RESET_COMPLETE', controller: resetReady });
  assert.equal(state.phase, 'BOOK_RETURNING');
  state = complete(state, { type: 'RETURN_COMPLETE' });
  assert.equal(state.phase, 'ROOM_IDLE');
  assert.equal(state.activeWallId, 'primary');
  assert.equal(state.selectedEditionId, undefined);
});

test('returns the same state object for representative illegal transitions', () => {
  const idle = createLibraryState('primary');
  const preview = reachPreview();
  const reading = reachReading();
  const turning = libraryReducer(idle, { type: 'TURN', wallId: 'english' });
  const cases: Array<[LibraryState, LibraryEvent]> = [
    [idle, { type: 'TURN', wallId: 'primary' }],
    [idle, { type: 'OPEN' }],
    [turning, { type: 'HOVER', editionId: 'book-a', rootUuid: 'root-a' }],
    [preview, { type: 'PAGE_TURN' }],
    [reading, { type: 'TURN', wallId: 'english' }],
  ];

  for (const [state, event] of cases) assert.equal(libraryReducer(state, event), state);
});

test('enumerates every legal reducer transition, including direct-open and cancellation variants', () => {
  const state = (phase: LibraryPhase, changes: Partial<LibraryState> = {}): LibraryState => ({
    phase,
    activeWallId: 'primary',
    transitionGeneration: 7,
    selectedEditionId: phase.startsWith('BOOK_') || phase.startsWith('PAGE_') ? 'book-a' : undefined,
    expectedRootUuid: phase.startsWith('BOOK_') || phase.startsWith('PAGE_') ? 'root-a' : undefined,
    ...changes,
  });
  const cases: Array<{ name: string; from: LibraryState; event: LibraryEvent; phase: LibraryPhase }> = [
    { name: 'idle turn', from: state('ROOM_IDLE'), event: { type: 'TURN', wallId: 'english' }, phase: 'ROOM_TURNING' },
    { name: 'idle hover', from: state('ROOM_IDLE'), event: { type: 'HOVER', editionId: 'book-a', rootUuid: 'root-a' }, phase: 'BOOK_HOVER_INTENT' },
    { name: 'turn retarget', from: state('ROOM_TURNING', { pendingWallId: 'english' }), event: { type: 'TURN', wallId: 'mathematics' }, phase: 'ROOM_TURNING' },
    { name: 'turn complete', from: state('ROOM_TURNING', { pendingWallId: 'english' }), event: { type: 'TURN_COMPLETE', generation: 7 }, phase: 'ROOM_IDLE' },
    { name: 'turn escape', from: state('ROOM_TURNING', { pendingWallId: 'english' }), event: { type: 'ESCAPE' }, phase: 'ROOM_IDLE' },
    { name: 'hover switch', from: state('BOOK_HOVER_INTENT'), event: { type: 'HOVER', editionId: 'book-b', rootUuid: 'root-b' }, phase: 'BOOK_HOVER_INTENT' },
    { name: 'hover completes', from: state('BOOK_HOVER_INTENT'), event: { type: 'HOVER_INTENT_COMPLETE', generation: 7 }, phase: 'BOOK_EXTRACTING' },
    { name: 'legacy extract completes', from: state('BOOK_HOVER_INTENT'), event: { type: 'EXTRACT', generation: 7 }, phase: 'BOOK_EXTRACTING' },
    { name: 'direct open from hover', from: state('BOOK_HOVER_INTENT'), event: { type: 'OPEN' }, phase: 'BOOK_EXTRACTING' },
    { name: 'leave hover', from: state('BOOK_HOVER_INTENT'), event: { type: 'LEAVE' }, phase: 'BOOK_RESETTING' },
    { name: 'close hover', from: state('BOOK_HOVER_INTENT'), event: { type: 'CLOSE' }, phase: 'BOOK_RESETTING' },
    { name: 'extract open intent', from: state('BOOK_EXTRACTING'), event: { type: 'OPEN' }, phase: 'BOOK_EXTRACTING' },
    { name: 'extract preview', from: state('BOOK_EXTRACTING'), event: { type: 'PREVIEW_READY', generation: 7 }, phase: 'BOOK_PREVIEW' },
    { name: 'extract open then preview', from: state('BOOK_EXTRACTING', { openRequested: true }), event: { type: 'PREVIEW_READY', generation: 7 }, phase: 'BOOK_TO_READING' },
    { name: 'leave extracting', from: state('BOOK_EXTRACTING'), event: { type: 'LEAVE' }, phase: 'BOOK_RESETTING' },
    { name: 'close extracting', from: state('BOOK_EXTRACTING'), event: { type: 'CLOSE' }, phase: 'BOOK_RESETTING' },
    { name: 'preview open', from: state('BOOK_PREVIEW'), event: { type: 'OPEN' }, phase: 'BOOK_TO_READING' },
    { name: 'preview leave', from: state('BOOK_PREVIEW'), event: { type: 'LEAVE' }, phase: 'BOOK_RESETTING' },
    { name: 'preview close', from: state('BOOK_PREVIEW'), event: { type: 'CLOSE' }, phase: 'BOOK_RESETTING' },
    { name: 'reading pose ready', from: state('BOOK_TO_READING'), event: { type: 'READING_POSE_READY', generation: 7 }, phase: 'BOOK_OPENING' },
    { name: 'leave reading transit', from: state('BOOK_TO_READING'), event: { type: 'LEAVE' }, phase: 'BOOK_RESETTING' },
    { name: 'close reading transit', from: state('BOOK_TO_READING'), event: { type: 'CLOSE' }, phase: 'BOOK_RESETTING' },
    { name: 'open complete', from: state('BOOK_OPENING'), event: { type: 'OPEN_COMPLETE', generation: 7 }, phase: 'BOOK_READING' },
    { name: 'close opening', from: state('BOOK_OPENING'), event: { type: 'CLOSE' }, phase: 'BOOK_CLOSING' },
    { name: 'reading drag', from: state('BOOK_READING'), event: { type: 'PAGE_DRAG_START' }, phase: 'PAGE_DRAGGING' },
    { name: 'reading turn', from: state('BOOK_READING'), event: { type: 'PAGE_TURN' }, phase: 'PAGE_TURNING' },
    { name: 'reading close', from: state('BOOK_READING'), event: { type: 'CLOSE' }, phase: 'BOOK_CLOSING' },
    { name: 'drag cancel', from: state('PAGE_DRAGGING'), event: { type: 'PAGE_DRAG_CANCEL' }, phase: 'BOOK_READING' },
    { name: 'drag commit', from: state('PAGE_DRAGGING'), event: { type: 'PAGE_TURN' }, phase: 'PAGE_TURNING' },
    { name: 'drag close', from: state('PAGE_DRAGGING'), event: { type: 'CLOSE' }, phase: 'BOOK_CLOSING' },
    { name: 'page complete', from: state('PAGE_TURNING'), event: { type: 'PAGE_TURN_COMPLETE', generation: 7 }, phase: 'PAGE_SETTLED' },
    { name: 'page close', from: state('PAGE_TURNING'), event: { type: 'CLOSE' }, phase: 'BOOK_CLOSING' },
    { name: 'settled drag', from: state('PAGE_SETTLED'), event: { type: 'PAGE_DRAG_START' }, phase: 'PAGE_DRAGGING' },
    { name: 'settled turn', from: state('PAGE_SETTLED'), event: { type: 'PAGE_TURN' }, phase: 'PAGE_TURNING' },
    { name: 'settled close', from: state('PAGE_SETTLED'), event: { type: 'CLOSE' }, phase: 'BOOK_CLOSING' },
    { name: 'close complete', from: state('BOOK_CLOSING'), event: { type: 'CLOSE_COMPLETE', generation: 7 }, phase: 'BOOK_RESETTING' },
    { name: 'reset complete', from: state('BOOK_RESETTING'), event: { type: 'RESET_COMPLETE', generation: 7, controller: resetReady }, phase: 'BOOK_RETURNING' },
    { name: 'return complete', from: state('BOOK_RETURNING'), event: { type: 'RETURN_COMPLETE', generation: 7 }, phase: 'ROOM_IDLE' },
  ];

  for (const entry of cases) {
    assert.equal(libraryReducer(entry.from, entry.event).phase, entry.phase, entry.name);
  }

  const escapeToReset: LibraryPhase[] = ['BOOK_HOVER_INTENT', 'BOOK_EXTRACTING', 'BOOK_PREVIEW', 'BOOK_TO_READING'];
  const escapeToClose: LibraryPhase[] = ['BOOK_OPENING', 'BOOK_READING', 'PAGE_DRAGGING', 'PAGE_TURNING', 'PAGE_SETTLED'];
  for (const phase of escapeToReset) assert.equal(libraryReducer(state(phase), { type: 'ESCAPE' }).phase, 'BOOK_RESETTING', phase);
  for (const phase of escapeToClose) assert.equal(libraryReducer(state(phase), { type: 'ESCAPE' }).phase, 'BOOK_CLOSING', phase);

  const restartable: LibraryPhase[] = ['ROOM_TURNING', 'BOOK_HOVER_INTENT', 'BOOK_EXTRACTING', 'BOOK_TO_READING', 'BOOK_OPENING', 'PAGE_DRAGGING', 'PAGE_TURNING', 'BOOK_CLOSING', 'BOOK_RESETTING', 'BOOK_RETURNING'];
  for (const phase of restartable) {
    assert.equal(libraryReducer(state(phase), { type: 'RESIZE' }).transitionGeneration, 8, `${phase} resize`);
    assert.equal(libraryReducer(state(phase), { type: 'VISIBILITY_RESUME' }).transitionGeneration, 8, `${phase} resume`);
  }
});

test('enumerates illegal events as identity-preserving no-ops in every phase', () => {
  const events: LibraryEvent[] = [
    { type: 'TURN', wallId: 'english' },
    { type: 'TURN_COMPLETE', generation: 7 },
    { type: 'HOVER', editionId: 'book-b', rootUuid: 'root-b' },
    { type: 'HOVER_INTENT_COMPLETE', generation: 7 },
    { type: 'EXTRACT', generation: 7 },
    { type: 'PREVIEW_READY', generation: 7 },
    { type: 'LEAVE' },
    { type: 'OPEN' },
    { type: 'READING_POSE_READY', generation: 7 },
    { type: 'OPEN_COMPLETE', generation: 7 },
    { type: 'PAGE_DRAG_START' },
    { type: 'PAGE_DRAG_CANCEL' },
    { type: 'PAGE_TURN' },
    { type: 'PAGE_TURN_COMPLETE', generation: 7 },
    { type: 'CLOSE' },
    { type: 'CLOSE_COMPLETE', generation: 7 },
    { type: 'RESET_COMPLETE', generation: 7, controller: resetReady },
    { type: 'RETURN_COMPLETE', generation: 7 },
    { type: 'ESCAPE' },
    { type: 'RESIZE' },
    { type: 'VISIBILITY_RESUME' },
  ];
  const allowed: Record<LibraryPhase, ReadonlySet<LibraryEvent['type']>> = {
    ROOM_IDLE: new Set(['TURN', 'HOVER']),
    ROOM_TURNING: new Set(['TURN', 'TURN_COMPLETE', 'ESCAPE', 'RESIZE', 'VISIBILITY_RESUME']),
    BOOK_HOVER_INTENT: new Set(['HOVER', 'HOVER_INTENT_COMPLETE', 'EXTRACT', 'LEAVE', 'OPEN', 'CLOSE', 'ESCAPE', 'RESIZE', 'VISIBILITY_RESUME']),
    BOOK_EXTRACTING: new Set(['PREVIEW_READY', 'LEAVE', 'OPEN', 'CLOSE', 'ESCAPE', 'RESIZE', 'VISIBILITY_RESUME']),
    BOOK_PREVIEW: new Set(['LEAVE', 'OPEN', 'CLOSE', 'ESCAPE']),
    BOOK_TO_READING: new Set(['LEAVE', 'READING_POSE_READY', 'CLOSE', 'ESCAPE', 'RESIZE', 'VISIBILITY_RESUME']),
    BOOK_OPENING: new Set(['OPEN_COMPLETE', 'CLOSE', 'ESCAPE', 'RESIZE', 'VISIBILITY_RESUME']),
    BOOK_READING: new Set(['PAGE_DRAG_START', 'PAGE_TURN', 'CLOSE', 'ESCAPE']),
    PAGE_DRAGGING: new Set(['PAGE_DRAG_CANCEL', 'PAGE_TURN', 'CLOSE', 'ESCAPE', 'RESIZE', 'VISIBILITY_RESUME']),
    PAGE_TURNING: new Set(['PAGE_TURN_COMPLETE', 'CLOSE', 'ESCAPE', 'RESIZE', 'VISIBILITY_RESUME']),
    PAGE_SETTLED: new Set(['PAGE_DRAG_START', 'PAGE_TURN', 'CLOSE', 'ESCAPE']),
    BOOK_CLOSING: new Set(['CLOSE_COMPLETE', 'RESIZE', 'VISIBILITY_RESUME']),
    BOOK_RESETTING: new Set(['RESET_COMPLETE', 'RESIZE', 'VISIBILITY_RESUME']),
    BOOK_RETURNING: new Set(['RETURN_COMPLETE', 'RESIZE', 'VISIBILITY_RESUME']),
  };

  for (const phase of Object.keys(allowed) as LibraryPhase[]) {
    const state: LibraryState = {
      phase,
      activeWallId: 'primary',
      transitionGeneration: 7,
      pendingWallId: phase === 'ROOM_TURNING' ? 'mathematics' : undefined,
      selectedEditionId: phase.startsWith('BOOK_') || phase.startsWith('PAGE_') ? 'book-a' : undefined,
      expectedRootUuid: phase.startsWith('BOOK_') || phase.startsWith('PAGE_') ? 'root-a' : undefined,
    };
    for (const event of events) {
      if (!allowed[phase].has(event.type)) assert.equal(libraryReducer(state, event), state, `${phase} + ${event.type}`);
    }
  }
});

test('rejects stale async completions after a newer transition generation starts', () => {
  const idle = createLibraryState('primary');
  const firstTurn = libraryReducer(idle, { type: 'TURN', wallId: 'english' });
  assert.equal(libraryReducer(firstTurn, { type: 'TURN_COMPLETE' } as LibraryEvent), firstTurn);
  const secondTurn = libraryReducer(firstTurn, { type: 'TURN', wallId: 'mathematics' });

  assert.equal(secondTurn.transitionGeneration, firstTurn.transitionGeneration + 1);
  assert.equal(libraryReducer(secondTurn, { type: 'TURN_COMPLETE', generation: firstTurn.transitionGeneration }), secondTurn);
  assert.equal(complete(secondTurn, { type: 'TURN_COMPLETE' }).activeWallId, 'mathematics');

  const extracting = complete(libraryReducer(idle, { type: 'HOVER', editionId: 'book-a', rootUuid: 'root-a' }), { type: 'HOVER_INTENT_COMPLETE' });
  const resetting = libraryReducer(extracting, { type: 'ESCAPE' });
  assert.equal(libraryReducer(resetting, { type: 'PREVIEW_READY', generation: extracting.transitionGeneration }), resetting);
});

test('rejects stale completions in every asynchronous semantic phase', () => {
  const state = (phase: LibraryPhase): LibraryState => ({
    phase,
    activeWallId: 'primary',
    transitionGeneration: 7,
    pendingWallId: phase === 'ROOM_TURNING' ? 'english' : undefined,
    selectedEditionId: phase.startsWith('BOOK_') || phase.startsWith('PAGE_') ? 'book-a' : undefined,
    expectedRootUuid: phase.startsWith('BOOK_') || phase.startsWith('PAGE_') ? 'root-a' : undefined,
  });
  const cases: Array<[LibraryPhase, LibraryEvent]> = [
    ['ROOM_TURNING', { type: 'TURN_COMPLETE', generation: 6 }],
    ['BOOK_HOVER_INTENT', { type: 'HOVER_INTENT_COMPLETE', generation: 6 }],
    ['BOOK_HOVER_INTENT', { type: 'EXTRACT', generation: 6 }],
    ['BOOK_EXTRACTING', { type: 'PREVIEW_READY', generation: 6 }],
    ['BOOK_TO_READING', { type: 'READING_POSE_READY', generation: 6 }],
    ['BOOK_OPENING', { type: 'OPEN_COMPLETE', generation: 6 }],
    ['PAGE_TURNING', { type: 'PAGE_TURN_COMPLETE', generation: 6 }],
    ['BOOK_CLOSING', { type: 'CLOSE_COMPLETE', generation: 6 }],
    ['BOOK_RESETTING', { type: 'RESET_COMPLETE', generation: 6, controller: resetReady }],
    ['BOOK_RETURNING', { type: 'RETURN_COMPLETE', generation: 6 }],
  ];

  for (const [phase, event] of cases) {
    const current = state(phase);
    assert.equal(libraryReducer(current, event), current, `${phase} + ${event.type}`);
  }
});

test('keeps conditional duplicates and wrong-root reset completions as identity no-ops', () => {
  const idle = createLibraryState('primary');
  assert.equal(libraryReducer(idle, { type: 'TURN', wallId: 'primary' }), idle);
  const turning: LibraryState = { ...idle, phase: 'ROOM_TURNING', pendingWallId: 'english', transitionGeneration: 7 };
  assert.equal(libraryReducer(turning, { type: 'TURN', wallId: 'english' }), turning);
  const hover: LibraryState = {
    ...idle,
    phase: 'BOOK_HOVER_INTENT',
    transitionGeneration: 7,
    selectedEditionId: 'book-a',
    expectedRootUuid: 'root-a',
  };
  assert.equal(libraryReducer(hover, { type: 'HOVER', editionId: 'book-a', rootUuid: 'root-a' }), hover);
  const extracting: LibraryState = { ...hover, phase: 'BOOK_EXTRACTING', openRequested: true };
  assert.equal(libraryReducer(extracting, { type: 'OPEN' }), extracting);
  const resetting: LibraryState = { ...hover, phase: 'BOOK_RESETTING' };
  assert.equal(complete(resetting, { type: 'RESET_COMPLETE', controller: { ...resetReady, rootUuid: 'wrong-root' } }), resetting);
});

test('rejects missing or blank root identifiers before hover selection begins', () => {
  const idle = createLibraryState('primary');
  const missingRoot = { type: 'HOVER', editionId: 'book-a' } as LibraryEvent;
  const blankRoot = { type: 'HOVER', editionId: 'book-a', rootUuid: '   ' } as LibraryEvent;

  assert.equal(libraryReducer(idle, missingRoot), idle);
  assert.equal(libraryReducer(idle, blankRoot), idle);
});

test('completes a full recovery cycle with one stable required root identifier', () => {
  let state = libraryReducer(createLibraryState('primary'), {
    type: 'HOVER',
    editionId: 'book-a',
    rootUuid: 'logical:tutor-book:book-a',
  });
  state = complete(state, { type: 'HOVER_INTENT_COMPLETE' });
  state = complete(state, { type: 'PREVIEW_READY' });
  state = libraryReducer(state, { type: 'OPEN' });
  state = complete(state, { type: 'READING_POSE_READY' });
  state = complete(state, { type: 'OPEN_COMPLETE' });
  state = libraryReducer(state, { type: 'CLOSE' });
  state = complete(state, { type: 'CLOSE_COMPLETE' });
  state = complete(state, {
    type: 'RESET_COMPLETE',
    controller: { ...resetReady, rootUuid: 'logical:tutor-book:book-a' },
  });
  state = complete(state, { type: 'RETURN_COMPLETE' });

  assert.deepEqual(state, {
    phase: 'ROOM_IDLE',
    activeWallId: 'primary',
    transitionGeneration: 10,
  });
});

test('switches hover intent from A to B and invalidates A completion', () => {
  const hoverA = libraryReducer(createLibraryState('primary'), { type: 'HOVER', editionId: 'book-a', rootUuid: 'root-a' });
  const hoverB = libraryReducer(hoverA, { type: 'HOVER', editionId: 'book-b', rootUuid: 'root-b' });

  assert.equal(hoverB.selectedEditionId, 'book-b');
  assert.equal(hoverB.expectedRootUuid, 'root-b');
  assert.equal(hoverB.transitionGeneration, hoverA.transitionGeneration + 1);
  assert.equal(libraryReducer(hoverB, { type: 'HOVER_INTENT_COMPLETE', generation: hoverA.transitionGeneration }), hoverB);
  assert.equal(complete(hoverB, { type: 'HOVER_INTENT_COMPLETE' }).phase, 'BOOK_EXTRACTING');
});

test('remembers a click during extraction and proceeds through the safe reading pose', () => {
  let state = libraryReducer(createLibraryState('primary'), { type: 'HOVER', editionId: 'book-a', rootUuid: 'root-a' });
  state = complete(state, { type: 'HOVER_INTENT_COMPLETE' });
  const generation = state.transitionGeneration;
  state = libraryReducer(state, { type: 'OPEN' });

  assert.equal(state.phase, 'BOOK_EXTRACTING');
  assert.equal(state.openRequested, true);
  assert.equal(state.transitionGeneration, generation);
  state = complete(state, { type: 'PREVIEW_READY' });
  assert.equal(state.phase, 'BOOK_TO_READING');
});

test('Escape recovers deterministically from every book transient and reading state', () => {
  const selected = { selectedEditionId: 'book-a' };
  const resetDirectly: LibraryPhase[] = ['BOOK_HOVER_INTENT', 'BOOK_EXTRACTING', 'BOOK_PREVIEW', 'BOOK_TO_READING'];
  const closeFirst: LibraryPhase[] = ['BOOK_OPENING', 'BOOK_READING', 'PAGE_DRAGGING', 'PAGE_TURNING', 'PAGE_SETTLED'];

  for (const phase of resetDirectly) {
    const state: LibraryState = { ...createLibraryState('primary'), ...selected, phase, transitionGeneration: 7 };
    const escaped = libraryReducer(state, { type: 'ESCAPE' });
    assert.equal(escaped.phase, 'BOOK_RESETTING', phase);
    assert.equal(escaped.transitionGeneration, 8, phase);
  }

  for (const phase of closeFirst) {
    const state: LibraryState = { ...createLibraryState('primary'), ...selected, phase, transitionGeneration: 7 };
    const escaped = libraryReducer(state, { type: 'ESCAPE' });
    assert.equal(escaped.phase, 'BOOK_CLOSING', phase);
    assert.equal(escaped.transitionGeneration, 8, phase);
  }

  for (const phase of ['BOOK_CLOSING', 'BOOK_RESETTING', 'BOOK_RETURNING'] as const) {
    const state: LibraryState = { ...createLibraryState('primary'), ...selected, phase, transitionGeneration: 7 };
    assert.equal(libraryReducer(state, { type: 'ESCAPE' }), state, phase);
  }
});

test('will not return until close/reset complete with zero controller residue', () => {
  const closing = libraryReducer(reachReading(), { type: 'CLOSE' });
  const resetting = complete(closing, { type: 'CLOSE_COMPLETE' });
  const invalidSnapshots: ControllerResetSnapshot[] = [
    { ...resetReady, closeComplete: false },
    { ...resetReady, resetComplete: false },
    { ...resetReady, openProgress: 0.000001 },
    { ...resetReady, pageTurnProgress: 0.000001 },
    { ...resetReady, settledPages: 1 },
    { ...resetReady, deformationReset: false },
    { ...resetReady, rootUuid: 'wrong-root' },
  ];

  for (const controller of invalidSnapshots) {
    assert.equal(complete(resetting, { type: 'RESET_COMPLETE', controller }), resetting);
  }
  assert.equal(complete(resetting, { type: 'RESET_COMPLETE', controller: resetReady }).phase, 'BOOK_RETURNING');
});

test('blocks selection B while A returns and keeps A identity until restoration completes', () => {
  let state = libraryReducer(reachPreview(), { type: 'ESCAPE' });
  state = complete(state, { type: 'RESET_COMPLETE', controller: resetReady });
  assert.equal(state.phase, 'BOOK_RETURNING');

  const attemptedB = libraryReducer(state, { type: 'HOVER', editionId: 'book-b', rootUuid: 'root-b' });
  assert.equal(attemptedB, state);
  assert.equal(attemptedB.selectedEditionId, 'book-a');
  assert.equal(complete(attemptedB, { type: 'RETURN_COMPLETE' }).selectedEditionId, undefined);
});

test('rapid wall turns retarget the current turn and only the newest completion settles', () => {
  let state = libraryReducer(createLibraryState('primary'), { type: 'TURN', wallId: 'english' });
  const englishGeneration = state.transitionGeneration;
  state = libraryReducer(state, { type: 'TURN', wallId: 'science-social' });
  const scienceGeneration = state.transitionGeneration;
  state = libraryReducer(state, { type: 'TURN', wallId: 'mathematics' });

  assert.equal(state.pendingWallId, 'mathematics');
  assert.ok(state.transitionGeneration > scienceGeneration);
  assert.equal(libraryReducer(state, { type: 'TURN_COMPLETE', generation: englishGeneration }), state);
  assert.equal(complete(state, { type: 'TURN_COMPLETE' }).activeWallId, 'mathematics');
});

test('restarts transient generations after resize and visibility resume but leaves stable states alone', () => {
  const extracting = complete(libraryReducer(createLibraryState('primary'), { type: 'HOVER', editionId: 'book-a', rootUuid: 'root-a' }), { type: 'HOVER_INTENT_COMPLETE' });
  const resized = libraryReducer(extracting, { type: 'RESIZE' });
  const resumed = libraryReducer(resized, { type: 'VISIBILITY_RESUME' });

  assert.equal(resized.phase, 'BOOK_EXTRACTING');
  assert.equal(resized.transitionGeneration, extracting.transitionGeneration + 1);
  assert.equal(resumed.transitionGeneration, resized.transitionGeneration + 1);
  const idle = createLibraryState('primary');
  assert.equal(libraryReducer(idle, { type: 'RESIZE' }), idle);
  const reading = reachReading();
  assert.equal(libraryReducer(reading, { type: 'VISIBILITY_RESUME' }), reading);
});

test('supports repeated open/close cycles without retaining book state', () => {
  let state = createLibraryState('primary');
  for (let cycle = 0; cycle < 2; cycle += 1) {
    state = libraryReducer(state, { type: 'HOVER', editionId: 'book-a', rootUuid: 'root-a' });
    state = complete(state, { type: 'HOVER_INTENT_COMPLETE' });
    state = complete(state, { type: 'PREVIEW_READY' });
    state = libraryReducer(state, { type: 'OPEN' });
    state = complete(state, { type: 'READING_POSE_READY' });
    state = complete(state, { type: 'OPEN_COMPLETE' });
    state = libraryReducer(state, { type: 'CLOSE' });
    state = finishReturn(state);
    assert.equal(state.phase, 'ROOM_IDLE');
    assert.equal(state.selectedEditionId, undefined);
    assert.equal(state.openRequested, undefined);
  }
});

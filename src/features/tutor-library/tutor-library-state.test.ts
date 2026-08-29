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
  let state = libraryReducer(createLibraryState('primary'), { type: 'HOVER', editionId: 'book-a' });
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

  state = libraryReducer(state, { type: 'HOVER', editionId: 'book-a' });
  assert.deepEqual([state.phase, state.selectedEditionId, state.transitionGeneration], ['BOOK_HOVER_INTENT', 'book-a', 1]);
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
    [turning, { type: 'HOVER', editionId: 'book-a' }],
    [preview, { type: 'PAGE_TURN' }],
    [reading, { type: 'TURN', wallId: 'english' }],
  ];

  for (const [state, event] of cases) assert.equal(libraryReducer(state, event), state);
});

test('rejects stale async completions after a newer transition generation starts', () => {
  const idle = createLibraryState('primary');
  const firstTurn = libraryReducer(idle, { type: 'TURN', wallId: 'english' });
  assert.equal(libraryReducer(firstTurn, { type: 'TURN_COMPLETE' } as LibraryEvent), firstTurn);
  const secondTurn = libraryReducer(firstTurn, { type: 'TURN', wallId: 'mathematics' });

  assert.equal(secondTurn.transitionGeneration, firstTurn.transitionGeneration + 1);
  assert.equal(libraryReducer(secondTurn, { type: 'TURN_COMPLETE', generation: firstTurn.transitionGeneration }), secondTurn);
  assert.equal(complete(secondTurn, { type: 'TURN_COMPLETE' }).activeWallId, 'mathematics');

  const extracting = complete(libraryReducer(idle, { type: 'HOVER', editionId: 'book-a' }), { type: 'HOVER_INTENT_COMPLETE' });
  const resetting = libraryReducer(extracting, { type: 'ESCAPE' });
  assert.equal(libraryReducer(resetting, { type: 'PREVIEW_READY', generation: extracting.transitionGeneration }), resetting);
});

test('switches hover intent from A to B and invalidates A completion', () => {
  const hoverA = libraryReducer(createLibraryState('primary'), { type: 'HOVER', editionId: 'book-a' });
  const hoverB = libraryReducer(hoverA, { type: 'HOVER', editionId: 'book-b' });

  assert.equal(hoverB.selectedEditionId, 'book-b');
  assert.equal(hoverB.transitionGeneration, hoverA.transitionGeneration + 1);
  assert.equal(libraryReducer(hoverB, { type: 'HOVER_INTENT_COMPLETE', generation: hoverA.transitionGeneration }), hoverB);
  assert.equal(complete(hoverB, { type: 'HOVER_INTENT_COMPLETE' }).phase, 'BOOK_EXTRACTING');
});

test('remembers a click during extraction and proceeds through the safe reading pose', () => {
  let state = libraryReducer(createLibraryState('primary'), { type: 'HOVER', editionId: 'book-a' });
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

  const attemptedB = libraryReducer(state, { type: 'HOVER', editionId: 'book-b' });
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
  const extracting = complete(libraryReducer(createLibraryState('primary'), { type: 'HOVER', editionId: 'book-a' }), { type: 'HOVER_INTENT_COMPLETE' });
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
    state = libraryReducer(state, { type: 'HOVER', editionId: 'book-a' });
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

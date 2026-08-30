import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createLibraryState,
  createPendingRigIntentTracker,
  getBookInteractionEvents,
  getControllerCompletionEvent,
  getFocusReturnEditionId,
  getLibraryControlAvailability,
  getLibraryLiveStatus,
  isBookControlDisabled,
  libraryReducer,
  shouldPreviewBookOnFocus,
  type LibraryEvent,
  type LibraryState,
} from './tutor-library-state.ts';

const applyEvents = (state: LibraryState, events: readonly LibraryEvent[]) =>
  events.reduce(libraryReducer, state);

test('pointer hover previews through the shared reducer with the ready rig root', () => {
  const idle = createLibraryState('primary');
  const events = getBookInteractionEvents(idle, 'pointer-preview', 'T003:primary', 'root-jenny');
  const selected = applyEvents(idle, events);

  assert.deepEqual(events, [{ type: 'HOVER', editionId: 'T003:primary', rootUuid: 'root-jenny' }]);
  assert.equal(selected.phase, 'BOOK_HOVER_INTENT');
  assert.equal(selected.expectedRootUuid, 'root-jenny');
});

test('touch and native selection request reading from the first activation', () => {
  for (const input of ['touch-activate', 'keyboard-activate'] as const) {
    const idle = createLibraryState('primary');
    const events = getBookInteractionEvents(idle, input, 'T003:primary', 'root-jenny');
    const selected = applyEvents(idle, events);

    assert.deepEqual(events.map(event => event.type), ['HOVER', 'OPEN'], input);
    assert.equal(selected.phase, 'BOOK_EXTRACTING', input);
    assert.equal(selected.openRequested, true, input);
  }
});

test('Escape closes reading states and resets preview states through the semantic reducer', () => {
  const preview: LibraryState = {
    ...createLibraryState('primary'),
    phase: 'BOOK_PREVIEW',
    selectedEditionId: 'T003:primary',
    expectedRootUuid: 'root-jenny',
  };
  const reading: LibraryState = { ...preview, phase: 'BOOK_READING' };

  assert.equal(libraryReducer(preview, { type: 'ESCAPE' }).phase, 'BOOK_RESETTING');
  assert.equal(libraryReducer(reading, { type: 'ESCAPE' }).phase, 'BOOK_CLOSING');
});

test('returns focus to the invoking tutor-book control only after restoration reaches idle', () => {
  const returning: LibraryState = {
    ...createLibraryState('primary'),
    phase: 'BOOK_RETURNING',
    selectedEditionId: 'T003:primary',
    expectedRootUuid: 'root-jenny',
  };
  const idle = createLibraryState('primary');

  assert.equal(getFocusReturnEditionId(returning, idle), 'T003:primary');
  assert.equal(getFocusReturnEditionId(returning, { ...returning, phase: 'BOOK_RESETTING' }), undefined);
});

test('does not reopen a returned book from its programmatic focus restoration', () => {
  assert.equal(shouldPreviewBookOnFocus(true), false);
  assert.equal(shouldPreviewBookOnFocus(false), true);
});

test('selection switching during preview intent invalidates the first root and opens the second', () => {
  const idle = createLibraryState('primary');
  const first = applyEvents(idle, getBookInteractionEvents(idle, 'pointer-preview', 'T003:primary', 'root-jenny'));
  const switchedEvents = getBookInteractionEvents(first, 'keyboard-activate', 'T009:primary', 'root-jacob');
  const switched = applyEvents(first, switchedEvents);

  assert.deepEqual(switchedEvents.map(event => event.type), ['HOVER', 'OPEN']);
  assert.equal(switched.selectedEditionId, 'T009:primary');
  assert.equal(switched.expectedRootUuid, 'root-jacob');
  assert.equal(switched.phase, 'BOOK_EXTRACTING');
  assert.equal(switched.openRequested, true);
});

test('disables hostile selection and wall actions during book and room transitions', () => {
  const turning: LibraryState = {
    ...createLibraryState('primary'),
    phase: 'ROOM_TURNING',
    pendingWallId: 'english',
  };
  const returning: LibraryState = {
    ...createLibraryState('primary'),
    phase: 'BOOK_RETURNING',
    selectedEditionId: 'T003:primary',
    expectedRootUuid: 'root-jenny',
  };

  assert.equal(isBookControlDisabled(turning, 'T003:primary'), true);
  assert.equal(isBookControlDisabled(returning, 'T009:primary'), true);
  assert.deepEqual(getBookInteractionEvents(returning, 'touch-activate', 'T009:primary', 'root-jacob'), []);
  assert.deepEqual(getLibraryControlAvailability(turning), {
    canOpen: false,
    canTurnPage: false,
    canClose: false,
    canTurnRoom: false,
  });
});

test('exposes readable live status and controls for every stable reader checkpoint', () => {
  const preview: LibraryState = {
    ...createLibraryState('primary'),
    phase: 'BOOK_PREVIEW',
    selectedEditionId: 'T003:primary',
    expectedRootUuid: 'root-jenny',
  };
  const reading = { ...preview, phase: 'BOOK_READING' as const };
  const settled = { ...preview, phase: 'PAGE_SETTLED' as const };

  assert.match(getLibraryLiveStatus(preview, 'Mrs Jenny N.', 'Primary'), /ready to open/i);
  assert.match(getLibraryLiveStatus(reading, 'Mrs Jenny N.', 'Primary'), /open for reading/i);
  assert.match(getLibraryLiveStatus(settled, 'Mrs Jenny N.', 'Primary'), /page turned/i);
  assert.deepEqual(getLibraryControlAvailability(reading), {
    canOpen: false,
    canTurnPage: true,
    canClose: true,
    canTurnRoom: false,
  });
});

test('binds controller completions to the active reducer generation and physical root', () => {
  const opening = getControllerCompletionEvent('BOOK_OPENING', 12, {
    rootUuid: 'root-jenny', openProgress: 0.9999, pageTurnProgress: 0,
    settledPages: 0, pagePivotCount: 6, deformationReset: true, pageSettled: false,
  });
  const resetting = getControllerCompletionEvent('BOOK_RESETTING', 18, {
    rootUuid: 'root-jenny', openProgress: 0, pageTurnProgress: 0,
    settledPages: 0, pagePivotCount: 6, deformationReset: true, pageSettled: false,
  });

  assert.deepEqual(opening, { type: 'OPEN_COMPLETE', generation: 12 });
  assert.deepEqual(resetting, {
    type: 'RESET_COMPLETE',
    generation: 18,
    controller: {
      rootUuid: 'root-jenny',
      closeComplete: true,
      resetComplete: true,
      openProgress: 0,
      pageTurnProgress: 0,
      settledPages: 0,
      deformationReset: true,
    },
  });
  assert.equal(getControllerCompletionEvent('BOOK_OPENING', 12, {
    rootUuid: 'root-jenny', openProgress: 0.4, pageTurnProgress: 0,
    settledPages: 0, pagePivotCount: 6, deformationReset: true, pageSettled: false,
  }), undefined);
});

test('waits for physical page settling instead of treating command progress as completion', () => {
  const snapshot = {
    rootUuid: 'root-jenny', openProgress: 1, settledPages: 1,
    pagePivotCount: 6, deformationReset: false,
  };

  assert.equal(getControllerCompletionEvent('PAGE_TURNING', 21, {
    ...snapshot, pageTurnProgress: 1, pageSettled: false,
  }), undefined, 'command progress alone cannot complete the reducer phase');
  assert.equal(getControllerCompletionEvent('PAGE_TURNING', 21, {
    ...snapshot, pageTurnProgress: 0, pageSettled: false,
  }), undefined, 'settlePage alone cannot complete before the pivot converges');
  assert.deepEqual(getControllerCompletionEvent('PAGE_TURNING', 21, {
    ...snapshot, pageTurnProgress: 0, pageSettled: true,
  }), { type: 'PAGE_TURN_COMPLETE', generation: 21 });
});

test('invalidates delayed rig readiness after pointer leave, blur, or Escape', () => {
  const pending = createPendingRigIntentTracker();
  const pointer = pending.begin('T003:primary', 'pointer-preview');
  pending.cancel('T003:primary');
  assert.equal(pending.consumeReady('T003:primary', pointer.token), undefined);

  const keyboard = pending.begin('T003:primary', 'keyboard-activate');
  pending.cancel();
  assert.equal(pending.consumeReady('T003:primary', keyboard.token), undefined);
});

test('only the latest selection intent can consume a late rig-ready callback', () => {
  const pending = createPendingRigIntentTracker();
  const first = pending.begin('T003:primary', 'pointer-preview');
  const second = pending.begin('T009:primary', 'touch-activate');

  assert.equal(pending.consumeReady('T003:primary', first.token), undefined);
  assert.deepEqual(pending.consumeReady('T009:primary', second.token), second);
  assert.equal(pending.consumeReady('T009:primary', second.token), undefined);
});

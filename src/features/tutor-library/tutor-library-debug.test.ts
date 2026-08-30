import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createTutorLibraryQaSnapshot,
  getMatrixDeltaFromIdentity,
  getTutorLibraryViewportProfile,
  parseDebugTurnProgress,
} from './tutor-library-debug.ts';

test('accepts exact diagnostic camera samples only within the turn range', () => {
  assert.equal(parseDebugTurnProgress('0.5'), .5);
  assert.equal(parseDebugTurnProgress('0'), 0);
  assert.equal(parseDebugTurnProgress('1'), 1);
  assert.equal(parseDebugTurnProgress('1.01'), undefined);
  assert.equal(parseDebugTurnProgress('corner'), undefined);
});

test('defines bounded viewport profiles for every Task 6 acceptance width', () => {
  const desktopWide = getTutorLibraryViewportProfile(1920, 1080, 'BOOK_READING');
  const desktop = getTutorLibraryViewportProfile(1440, 900, 'BOOK_READING');
  const laptop = getTutorLibraryViewportProfile(1366, 768, 'BOOK_READING');
  const tablet = getTutorLibraryViewportProfile(1024, 768, 'BOOK_READING');
  const mobile = getTutorLibraryViewportProfile(390, 844, 'BOOK_READING');

  assert.equal(desktopWide.maxDpr, 1.5);
  assert.equal(desktop.maxDpr, 1.5);
  assert.equal(laptop.maxDpr, 1.5);
  assert.equal(tablet.maxDpr, 1.4);
  assert.equal(mobile.maxDpr, 1.25);
  assert.ok(desktopWide.lateralTargetOffset > tablet.lateralTargetOffset);
  assert.ok(mobile.lateralTargetOffset < 0, 'mobile compensates for the real rig opening asymmetrically from its spine');
  assert.ok(mobile.targetHeight < tablet.targetHeight, 'mobile reading aim must lift the physical book above the controls');
  assert.ok(mobile.fov > desktopWide.fov, 'mobile needs more breathing room around the unchanged physical book');
});

test('keeps idle room framing architectural while applying reading-only composition', () => {
  const idle = getTutorLibraryViewportProfile(390, 844, 'ROOM_IDLE');
  const reading = getTutorLibraryViewportProfile(390, 844, 'BOOK_READING');

  assert.equal(idle.lateralTargetOffset, 0);
  assert.equal(idle.targetHeight, 2.7);
  assert.notEqual(reading.targetHeight, idle.targetHeight);
});

test('serializes stable QA state without presentation copy or invalid progress', () => {
  assert.deepEqual(createTutorLibraryQaSnapshot({
    phase: 'BOOK_READING',
    generation: 14,
    editionId: 'T003:primary',
    wallId: 'primary',
    reviewView: 'live',
    progress: 1.4,
  }), {
    phase: 'BOOK_READING',
    transitionId: 'library-14',
    generation: '14',
    edition: 'T003:primary',
    wall: 'primary',
    rootUuid: 'unmounted',
    matrixDelta: 'unavailable',
    resetState: 'not-required',
    reviewView: 'live',
    progress: '1.000',
  });
});

test('reports the actual local-root matrix seam delta deterministically', () => {
  const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  assert.equal(getMatrixDeltaFromIdentity(identity), 0);
  const shifted = [...identity];
  shifted[12] = .0007421;
  assert.equal(getMatrixDeltaFromIdentity(shifted), .000742);
  assert.equal(getMatrixDeltaFromIdentity([1, 2]), undefined);
});

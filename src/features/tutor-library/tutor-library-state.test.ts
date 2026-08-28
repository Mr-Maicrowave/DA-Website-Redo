import assert from 'node:assert/strict';
import test from 'node:test';
import { createLibraryState, libraryReducer } from './tutor-library-state.ts';

test('returns to ROOM_IDLE before book interaction begins', () => {
  const idle = createLibraryState('primary');
  const turning = libraryReducer(idle, { type: 'TURN', wallId: 'english' });
  assert.equal(turning.phase, 'ROOM_TURNING');
  const settled = libraryReducer(turning, { type: 'TURN_COMPLETE' });
  assert.equal(settled.phase, 'ROOM_IDLE');
  assert.equal(settled.activeWallId, 'english');
  assert.equal(libraryReducer(settled, { type: 'HOVER', editionId: 'T003:english' }).phase, 'BOOK_HOVER_INTENT');
  assert.deepEqual(libraryReducer(turning, { type: 'HOVER', editionId: 'T003:english' }), turning);
});

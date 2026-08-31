import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getTutorLibraryRouteMountPolicy,
  isTutorLibraryRevealReady,
  shouldPreloadTutorLibrary,
  shouldMountTutorLibraryWallBooks,
} from './tutor-library-performance.ts';

test('runs only the intro WebGL scene until the user enters the library', () => {
  assert.deepEqual(getTutorLibraryRouteMountPolicy(false), {
    mountIntro: true,
    mountLibrary: false,
  });
  assert.deepEqual(getTutorLibraryRouteMountPolicy(true), {
    mountIntro: false,
    mountLibrary: true,
  });
});

test('mounts book rigs only for the inspectable wall at rest and both walls during a turn', () => {
  assert.equal(shouldMountTutorLibraryWallBooks(0, 0, 0, 'ROOM_IDLE'), true);
  assert.equal(shouldMountTutorLibraryWallBooks(1, 0, 0, 'ROOM_IDLE'), false);
  assert.equal(shouldMountTutorLibraryWallBooks(3, 0, 0, 'ROOM_IDLE'), false);

  assert.equal(shouldMountTutorLibraryWallBooks(0, 0, 1, 'ROOM_TURNING'), true);
  assert.equal(shouldMountTutorLibraryWallBooks(1, 0, 1, 'ROOM_TURNING'), true);
  assert.equal(shouldMountTutorLibraryWallBooks(2, 0, 1, 'ROOM_TURNING'), false);
});

test('warms the library during the intro without ignoring reduced-data preferences', () => {
  assert.equal(shouldPreloadTutorLibrary({ introComplete: false, saveData: false }), true);
  assert.equal(shouldPreloadTutorLibrary({ introComplete: true, saveData: false }), false);
  assert.equal(shouldPreloadTutorLibrary({ introComplete: false, saveData: true }), false);
});

test('reveals the room only after its first frame and visible shelf assets are ready', () => {
  assert.equal(isTutorLibraryRevealReady({ roomReady: false, assetsReady: false, sceneError: false }), false);
  assert.equal(isTutorLibraryRevealReady({ roomReady: true, assetsReady: false, sceneError: false }), false);
  assert.equal(isTutorLibraryRevealReady({ roomReady: false, assetsReady: true, sceneError: false }), false);
  assert.equal(isTutorLibraryRevealReady({ roomReady: true, assetsReady: true, sceneError: false }), true);
  assert.equal(isTutorLibraryRevealReady({ roomReady: false, assetsReady: false, sceneError: true }), true);
});

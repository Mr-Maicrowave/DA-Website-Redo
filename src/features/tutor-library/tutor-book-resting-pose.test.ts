import assert from 'node:assert/strict';
import test from 'node:test';
import { getInitialTutorBookRestingPose } from './tutor-book-resting-pose.ts';

test('starts a featured face-out tutor at its final resting transform', () => {
  const pose = getInitialTutorBookRestingPose({
    shelfPose: {
      position: [1, 2, .59],
      rotation: [0, 0, 0],
      scale: [.72, .72, .72],
    },
    faceOut: true,
    spotlight: false,
  });

  assert.deepEqual(pose, {
    position: [1, 2.03, .79],
    rotation: [0, 0, 0],
    scale: [.72, .72, .72],
  });
});

test('uses the same shelf scale for a spine-out tutor as a face-forward tutor', () => {
  const pose = getInitialTutorBookRestingPose({
    shelfPose: {
      position: [-1, .5, .2],
      rotation: [0, Math.PI / 2, 0],
      scale: [.41, .41, .41],
    },
    faceOut: false,
    spotlight: false,
  });

  assert.deepEqual(pose.scale, [.72, .72, .72]);
  assert.deepEqual(pose.position, [-1, .5, .2]);
  assert.deepEqual(pose.rotation, [0, Math.PI / 2, 0]);
});

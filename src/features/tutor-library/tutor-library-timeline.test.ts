import assert from 'node:assert/strict';
import test from 'node:test';
import { createRoomTurnPose, sampleTimeline, type Pose } from './tutor-library-timeline.ts';

test('keeps deterministic pose endpoints', () => {
  const from: Pose = { position: [0, 1, 2], rotation: [0, 0, 0] };
  const to: Pose = { position: [4, 5, 6], rotation: [0, Math.PI, 0] };
  assert.deepEqual(sampleTimeline(0, from, to), from);
  assert.deepEqual(sampleTimeline(1, from, to), to);
  assert.deepEqual(sampleTimeline(-1, from, to), from);
  assert.deepEqual(sampleTimeline(2, from, to), to);
});

test('moves the viewer through the corner when turning to the next wall', () => {
  const start = createRoomTurnPose(0, 1, 0, 4.1, 7.75);
  const midway = createRoomTurnPose(0, 1, .5, 4.1, 7.75);
  const settled = createRoomTurnPose(0, 1, 1, 4.1, 7.75);

  assert.deepEqual(start.position, [0, 2.45, 4.1]);
  assert.deepEqual(settled.position, [-4.1, 2.45, 0]);
  assert.ok(midway.position[0] < 0 && midway.position[2] > 0, 'mid-turn camera must travel on the room arc');
  assert.ok(midway.target[0] > 0 && midway.target[2] < 0, 'mid-turn camera must look across the shared corner');
  assert.ok(Math.hypot(midway.position[0], midway.position[2]) >= 4.4, 'mid-turn adds a restrained positional sweep for parallax');
  assert.deepEqual(midway.target, [7.75, 2.7, -7.75], 'geometric midpoint looks directly at the shared physical corner');
});

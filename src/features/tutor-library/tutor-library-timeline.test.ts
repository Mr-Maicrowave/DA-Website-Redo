import assert from 'node:assert/strict';
import test from 'node:test';
import { sampleTimeline, type Pose } from './tutor-library-timeline.ts';

test('keeps deterministic pose endpoints', () => {
  const from: Pose = { position: [0, 1, 2], rotation: [0, 0, 0] };
  const to: Pose = { position: [4, 5, 6], rotation: [0, Math.PI, 0] };
  assert.deepEqual(sampleTimeline(0, from, to), from);
  assert.deepEqual(sampleTimeline(1, from, to), to);
  assert.deepEqual(sampleTimeline(-1, from, to), from);
  assert.deepEqual(sampleTimeline(2, from, to), to);
});

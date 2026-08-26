import assert from 'node:assert/strict';
import test from 'node:test';
import { reconcileSourceHandoffPose } from './methodTransitionGeometry.ts';

function assertPoseClose(
  actual: { x: number; y: number; scale: number },
  expected: { x: number; y: number; scale: number },
) {
  for (const property of ['x', 'y', 'scale'] as const) {
    assert.ok(
      Math.abs(actual[property] - expected[property]) < 1e-9,
      `${property}: expected ${expected[property]}, received ${actual[property]}`,
    );
  }
}

test('reconciles a cached source pose to the live animated source at handoff', () => {
  const reconciled = reconcileSourceHandoffPose(
    { x: 488, y: 288, scale: 0.5 },
    { left: 500, top: 300, width: 40, height: 40 },
    { left: 496.46, top: 304.89, width: 40.78, height: 40.78 },
    1,
  );

  assertPoseClose(reconciled, {
    x: 484.85,
    y: 293.28,
    scale: 0.50975,
  });
});

test('blends normalized-to-live correction without changing the detach endpoint', () => {
  const halfway = reconcileSourceHandoffPose(
    { x: 200, y: 120, scale: 0.75 },
    { left: 100, top: 200, width: 80, height: 80 },
    { left: 104, top: 194, width: 82, height: 82 },
    0.5,
  );
  const detached = reconcileSourceHandoffPose(
    { x: 240, y: 100, scale: 1.1 },
    { left: 100, top: 200, width: 80, height: 80 },
    { left: 104, top: 194, width: 82, height: 82 },
    0,
  );

  assertPoseClose(halfway, {
    x: 202.5,
    y: 117.5,
    scale: 0.759375,
  });
  assert.deepEqual(detached, { x: 240, y: 100, scale: 1.1 });
});

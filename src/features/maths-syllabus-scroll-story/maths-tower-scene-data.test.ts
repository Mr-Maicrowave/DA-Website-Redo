import assert from 'node:assert/strict';
import test from 'node:test';

import { TOWER_RAIL_POINTS, getEndingProgress } from './maths-tower-scene-data.ts';

test('rail and chapters are ordered and end at landing', () => {
  assert.equal(TOWER_RAIL_POINTS[0].progress, 0);
  assert.equal(TOWER_RAIL_POINTS.at(-1)?.kind, 'landing');
  assert.ok(TOWER_RAIL_POINTS.every((point, index) => index === 0 || point.progress > TOWER_RAIL_POINTS[index - 1].progress));
});

test('ending fully clears tower and reveals logo', () => {
  assert.deepEqual(getEndingProgress(1), { towerOpacity: 0, logoProgress: 1 });
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { CatmullRomCurve3, Vector3 } from 'three';

import { TOWER_CHAPTERS, TOWER_RAIL_POINTS, getEndingProgress, getRailPoint } from './maths-tower-scene-data.ts';

test('rail and chapters are ordered and end at landing', () => {
  assert.equal(TOWER_RAIL_POINTS[0].progress, 0);
  assert.equal(TOWER_RAIL_POINTS.at(-1)?.kind, 'landing');
  assert.ok(TOWER_RAIL_POINTS.every((point, index) => index === 0 || point.progress > TOWER_RAIL_POINTS[index - 1].progress));
});

test('keeps the six approved chapters in their truthful pathway order', () => {
  assert.deepEqual(TOWER_CHAPTERS.map(({ id }) => id), [
    'years-7-8',
    'years-9-10',
    'standard',
    'advanced',
    'extension-1',
    'extension-2',
  ]);

  const standard = TOWER_CHAPTERS.find(({ id }) => id === 'standard')!;
  assert.match(standard.teaching, /separate senior pathway/i);
  assert.doesNotMatch(standard.teaching, /leads to Advanced|prerequisite/i);
  assert.match(TOWER_CHAPTERS.find(({ id }) => id === 'extension-1')!.teaching, /alongside Advanced/i);
  assert.match(TOWER_CHAPTERS.find(({ id }) => id === 'extension-2')!.teaching, /Advanced and Extension 1/i);
});

test('samples the same Catmull-Rom rail used for the visible tube', () => {
  const curve = new CatmullRomCurve3(TOWER_RAIL_POINTS.map(({ position }) => new Vector3(...position)));
  const expected = curve.getPointAt(0.41);

  assert.deepEqual(getRailPoint(0.41).position, [expected.x, expected.y, expected.z]);
});

test('ending fully clears tower and reveals logo', () => {
  assert.equal(getEndingProgress(0.985).towerOpacity, 0);
  assert.deepEqual(getEndingProgress(1), { towerOpacity: 0, logoProgress: 1 });
});

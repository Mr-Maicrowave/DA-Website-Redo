import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import * as sceneData from './maths-tower-scene-data.ts';

const { TOWER_CHAPTERS, TOWER_RAIL_POINTS, getEndingProgress } = sceneData;

const dataSource = readFileSync(new URL('./maths-tower-scene-data.ts', import.meta.url), 'utf8');

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

test('ball reaches and holds the landing before the tower begins fading', () => {
  assert.equal(typeof sceneData.getBallProgress, 'function');
  const getBallProgress = sceneData.getBallProgress!;
  assert.ok(getBallProgress(0.919) < 1);
  assert.equal(getBallProgress(0.92), 1);
  assert.equal(getBallProgress(0.94), 1);
  assert.deepEqual(getEndingProgress(0.94), { towerOpacity: 1, logoProgress: 0 });
});

test('ending fully clears tower before revealing the exact logo', () => {
  assert.deepEqual(getEndingProgress(0.985), { towerOpacity: 0, logoProgress: 0 });
  assert.deepEqual(getEndingProgress(1), { towerOpacity: 0, logoProgress: 1 });
});

test('shared story data stays free of Three so static fallbacks do not load the 3D runtime', () => {
  assert.doesNotMatch(dataSource, /from ['"]three(?:\/|['"])/);
});

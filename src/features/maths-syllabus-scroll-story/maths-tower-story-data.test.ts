import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOGO_REVEAL_PROGRESS,
  MATHS_TOWER_COPY_GROUPS,
  TOWER_RAIL_POINTS,
  getTowerCopyGroup,
} from './maths-tower-story-data.ts';

test('covers the approved Year 7-12 reading order', () => {
  assert.deepEqual(MATHS_TOWER_COPY_GROUPS.map(({ id }) => id), [
    'years-7-8',
    'years-9-10',
    'standard',
    'advanced',
    'extension-1',
    'extension-2',
  ]);
  assert.equal(getTowerCopyGroup('standard').course, 'Mathematics Standard');
});

test('does not make Standard a prerequisite', () => {
  assert.match(getTowerCopyGroup('standard').teaching, /separate senior pathway/i);
  assert.doesNotMatch(getTowerCopyGroup('standard').teaching, /leads to Advanced|prerequisite/i);
});

test('uses one ordered rail and ends in a logo reveal', () => {
  assert.ok(TOWER_RAIL_POINTS.every((point, index) => index === 0 || point.progress > TOWER_RAIL_POINTS[index - 1].progress));
  assert.equal(TOWER_RAIL_POINTS.filter((point) => point.hidden).length, 2);
  assert.ok(LOGO_REVEAL_PROGRESS > TOWER_RAIL_POINTS.at(-1)!.progress);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { GOALS_BY_STAGE, STEP_META, SUBJECTS_BY_STAGE } from './config.ts';

test('defines exactly six wizard steps', () => {
  assert.deepEqual(STEP_META.map(item => item.step), [1, 2, 3, 4, 5, 6]);
});

test('limits primary subjects and excludes HSC-only goals', () => {
  assert.deepEqual(
    SUBJECTS_BY_STAGE.primary.map(item => item.value),
    ['english', 'mathematics', 'creative-writing'],
  );
  assert.ok(
    !GOALS_BY_STAGE.primary.some(item =>
      ['strong-hsc-preparation', 'band-6-goal'].includes(item.value),
    ),
  );
});

test('provides the required HSC subjects and goals', () => {
  for (const value of [
    'mathematics', 'english', 'biology', 'chemistry', 'physics',
    'business-studies', 'legal-studies',
  ]) {
    assert.ok(SUBJECTS_BY_STAGE.hsc.some(item => item.value === value));
  }
  assert.ok(GOALS_BY_STAGE.hsc.some(item => item.value === 'band-6-goal'));
});

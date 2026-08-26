import assert from 'node:assert/strict';
import test from 'node:test';
import { getAdjacentMethodId, getInactiveMethods } from './methodTeachingDeckState.ts';

test('inactive methods preserve canonical order', () => {
  assert.deepEqual(getInactiveMethods('practise'), ['diagnose', 'explain', 'apply', 'review']);
});

test('navigation wraps', () => {
  assert.equal(getAdjacentMethodId('review', 1), 'diagnose');
  assert.equal(getAdjacentMethodId('diagnose', -1), 'review');
});

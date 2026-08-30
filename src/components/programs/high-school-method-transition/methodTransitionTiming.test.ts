import assert from 'node:assert/strict';
import test from 'node:test';
import { METHOD_TRANSITION_SCROLL_VH } from './methodTransitionTiming.ts';

test('holds the pinned stage for a bit over two viewport heights of scroll', () => {
  assert.equal(METHOD_TRANSITION_SCROLL_VH, 230);
});

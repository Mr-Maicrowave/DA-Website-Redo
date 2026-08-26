import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getHoverFlipState } from './noticeFlipInteraction.ts';

test('desktop hover reveals the back and leaving restores the front', () => {
  assert.equal(getHoverFlipState(true, true, false), true);
  assert.equal(getHoverFlipState(true, false, true), false);
});

test('touch pointers retain the current click-controlled face', () => {
  assert.equal(getHoverFlipState(false, true, false), false);
  assert.equal(getHoverFlipState(false, false, true), true);
});

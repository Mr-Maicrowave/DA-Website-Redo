import assert from 'node:assert/strict';
import test from 'node:test';
import { getNextMethodIndex } from './methodTransitionKeyboard.ts';

test('wraps horizontal method navigation and supports Home and End', () => {
  assert.equal(getNextMethodIndex('ArrowRight', 4, 5), 0);
  assert.equal(getNextMethodIndex('ArrowLeft', 0, 5), 4);
  assert.equal(getNextMethodIndex('Home', 3, 5), 0);
  assert.equal(getNextMethodIndex('End', 1, 5), 4);
  assert.equal(getNextMethodIndex('Enter', 1, 5), null);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { parseDebugTurnProgress } from './tutor-library-debug.ts';

test('accepts exact diagnostic camera samples only within the turn range', () => {
  assert.equal(parseDebugTurnProgress('0.5'), .5);
  assert.equal(parseDebugTurnProgress('0'), 0);
  assert.equal(parseDebugTurnProgress('1'), 1);
  assert.equal(parseDebugTurnProgress('1.01'), undefined);
  assert.equal(parseDebugTurnProgress('corner'), undefined);
});

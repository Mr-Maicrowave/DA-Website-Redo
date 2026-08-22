import assert from 'node:assert/strict';
import test from 'node:test';
import { restoreProfileReturnFocus, type ProfileFocusTarget } from './profileFocus.ts';

const target = (isConnected: boolean) => {
  let focusCount = 0;
  const focusTarget: ProfileFocusTarget = {
    isConnected,
    focus() { focusCount += 1; },
  };
  return { focusTarget, get focusCount() { return focusCount; } };
};

test('focuses the original profile trigger while it remains connected', () => {
  const trigger = target(true);
  const fallback = target(true);
  assert.equal(restoreProfileReturnFocus(trigger.focusTarget, fallback.focusTarget), true);
  assert.equal(trigger.focusCount, 1);
  assert.equal(fallback.focusCount, 0);
});

test('focuses the connected directory fallback when the trigger was detached', () => {
  const detachedTrigger = target(false);
  const fallback = target(true);
  assert.equal(restoreProfileReturnFocus(detachedTrigger.focusTarget, fallback.focusTarget), true);
  assert.equal(detachedTrigger.focusCount, 0);
  assert.equal(fallback.focusCount, 1);
});

test('does not focus anything when neither focus target is connected', () => {
  const trigger = target(false);
  const fallback = target(false);
  assert.equal(restoreProfileReturnFocus(trigger.focusTarget, fallback.focusTarget), false);
  assert.equal(trigger.focusCount, 0);
  assert.equal(fallback.focusCount, 0);
});

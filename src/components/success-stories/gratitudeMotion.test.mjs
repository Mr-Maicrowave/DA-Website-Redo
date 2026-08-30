import assert from 'node:assert/strict';
import test from 'node:test';

import { getEnvelopeShellMotion } from './gratitudeMotion.ts';

test('hides the envelope shell only after its 300ms exit completes', () => {
  const motion = getEnvelopeShellMotion(true, false);

  assert.deepEqual(motion.animate, {
    opacity: 0,
    scale: 0.92,
    y: 40,
    visibility: 'visible',
    pointerEvents: 'auto',
    transitionEnd: { visibility: 'hidden', pointerEvents: 'none' },
  });
  assert.deepEqual(motion.transition, {
    duration: 0.3,
    delay: 0.86,
    ease: [0.55, 0.085, 0.68, 0.53],
  });
});

test('reveals the envelope shell immediately before the letter returns', () => {
  const motion = getEnvelopeShellMotion(false, false);

  assert.deepEqual(motion.animate, {
    opacity: 1,
    scale: 1,
    y: 0,
    visibility: 'visible',
    pointerEvents: 'auto',
  });
  assert.deepEqual(motion.transition, {
    duration: 0.3,
    delay: 0,
    ease: [0.22, 1, 0.36, 1],
  });
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { FEATURED_TUTOR_IDS, TUTOR_ORBIT_LAYOUT, orbitMotionFor, orbitPositionFor } from './tutor-orbit-config.ts';

test('uses the six homepage educators as the tutor-orbit starting set', () => {
  assert.deepEqual(FEATURED_TUTOR_IDS, ['T010', 'T003', 'T011', 'T005', 'T012', 'T015']);
});

test('assigns every featured tutor a distinct orbit position', () => {
  assert.equal(new Set(FEATURED_TUTOR_IDS.map(orbitPositionFor)).size, FEATURED_TUTOR_IDS.length);
});

test('gives each tutor a closed, staggered circular drift path', () => {
  const motion = orbitMotionFor('T010');
  assert.deepEqual(motion.x.at(0), motion.x.at(-1));
  assert.deepEqual(motion.y.at(0), motion.y.at(-1));
  assert.ok(motion.duration >= 16);
});

test('uses one stable expanded layout rather than a hover-triggered layout swap', () => {
  assert.equal(TUTOR_ORBIT_LAYOUT, 'always-expanded');
});

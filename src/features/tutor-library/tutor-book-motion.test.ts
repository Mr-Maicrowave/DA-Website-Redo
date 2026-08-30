import assert from 'node:assert/strict';
import test from 'node:test';
import { createTutorBookEditions } from './tutor-library-data.ts';
import { TUTORS } from '../../data/teacherCatalogue.ts';
import {
  createBookMotionPoses,
  createBookMotionTimingPolicy,
  createBookReturnMotion,
  interpolateBookMotion,
  type BookMotionPose,
} from './tutor-book-motion.ts';
import { getShelfPose } from './tutor-book-geometry.ts';

test('keeps extraction continuous from the exact stored shelf pose into preview', () => {
  const [edition] = createTutorBookEditions(TUTORS);
  const shelf = getShelfPose(edition);
  const motion = createBookMotionPoses(shelf);

  assert.deepEqual(motion.extraction.from, motion.shelf);
  assert.deepEqual(motion.preview.from, motion.extraction.to);
  assert.ok(motion.preview.to.position[2] > motion.shelf.position[2] + 3);
  assert.ok(motion.preview.to.scale[0] > 2);
  assert.notEqual(motion.preview.to.rotation[1], 0, 'preview retains a visible hardcover edge');
  assert.ok(motion.preview.to.rotation[0] !== 0, 'preview avoids poster-flat alignment');
  assert.deepEqual(motion.reading.from, motion.preview.to);
  assert.ok(motion.reading.to.position[1] > motion.preview.to.position[1], 'reading pose clears the furniture before opening');
});

test('returns from the exact sampled interruption pose instead of the preview endpoint', () => {
  const sampled: BookMotionPose = {
    position: [1.234567, 2.345678, 3.456789],
    rotation: [.17, -.28, .39],
    scale: [2.2, 2.2, 2.2],
  };
  const shelf: BookMotionPose = {
    position: [-.5, 1.2, -7.1],
    rotation: [0, Math.PI / 2, 0],
    scale: [1, 1, 1],
  };
  const motion = createBookReturnMotion(sampled, shelf);

  assert.deepEqual(motion.from, sampled);
  assert.notEqual(motion.from, sampled, 'the contract owns a snapshot rather than a mutable Three tuple');
  assert.deepEqual(interpolateBookMotion(motion.from, motion.to, 0), sampled);
  assert.deepEqual(interpolateBookMotion(motion.from, motion.to, 1), shelf);
  assert.notDeepEqual(interpolateBookMotion(motion.from, motion.to, .25), interpolateBookMotion(motion.from, motion.to, .75));
});

test('clamps invalid interpolation progress and never mutates either endpoint', () => {
  const from: BookMotionPose = { position: [0, 1, 2], rotation: [0, .1, .2], scale: [1, 1, 1] };
  const to: BookMotionPose = { position: [3, 4, 5], rotation: [.3, .4, .5], scale: [2, 2, 2] };
  const before = structuredClone({ from, to });

  assert.deepEqual(interpolateBookMotion(from, to, Number.NaN), from);
  assert.deepEqual(interpolateBookMotion(from, to, -1), from);
  assert.deepEqual(interpolateBookMotion(from, to, 2), to);
  assert.deepEqual({ from, to }, before);
});

test('reduced motion shortens movement while retaining every semantic lifecycle phase', () => {
  const standard = createBookMotionTimingPolicy(false);
  const reduced = createBookMotionTimingPolicy(true);

  assert.equal(standard.preserveSemanticPhases, true);
  assert.equal(reduced.preserveSemanticPhases, true);
  assert.equal(reduced.reducedMotion, true);
  assert.equal(reduced.hoverIntentMs, 0);
  assert.equal(reduced.extractionMs, 0);
  assert.equal(reduced.toReadingMs, 0);
  assert.equal(reduced.returnMs, 0);
  assert.ok(reduced.openingMs > 0 && reduced.openingMs < standard.openingMs);
  assert.ok(reduced.pageTurnMs > 0 && reduced.pageTurnMs < standard.pageTurnMs);
  assert.equal(reduced.pageRiffle, false);
});

test('uses the shortened click-to-reading timing budget', () => {
  const timing = createBookMotionTimingPolicy(false);

  assert.equal(timing.extractionMs, 450);
  assert.equal(timing.toReadingMs, 380);
});

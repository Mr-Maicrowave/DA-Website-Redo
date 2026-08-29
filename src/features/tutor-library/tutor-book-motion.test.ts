import assert from 'node:assert/strict';
import test from 'node:test';
import { createTutorBookEditions } from './tutor-library-data.ts';
import { TUTORS } from '../../data/teacherCatalogue.ts';
import { createBookMotionPoses } from './tutor-book-motion.ts';
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
});

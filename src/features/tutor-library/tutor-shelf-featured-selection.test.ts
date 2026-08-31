import assert from 'node:assert/strict';
import test from 'node:test';
import { TUTORS } from '../../data/teacherCatalogue.ts';
import { createTutorBookEditions, SUBJECT_WALLS } from './tutor-library-data.ts';
import { getExplicitFaceOutTutorEditionIds, getFeaturedTutorColumnPose, selectCentredFaceOutTutorEditionIds } from './tutor-library-presentation.ts';

test('places every explicitly featured tutor in a distinct, uniformly sized middle-bay position', () => {
  const tutors = new Map(TUTORS.map(tutor => [tutor.id, tutor]));
  const editions = createTutorBookEditions(TUTORS);

  for (const wall of SUBJECT_WALLS) {
    const wallEditions = editions.filter(edition => edition.wallId === wall.id);
    const explicit = getExplicitFaceOutTutorEditionIds(wallEditions, tutors);
    const centred = selectCentredFaceOutTutorEditionIds(wallEditions, tutors);
    const poses = [...centred].map((_, index) => getFeaturedTutorColumnPose(index, centred.size));

    assert.deepEqual([...centred].sort(), [...explicit].sort(), `${wall.id} centres every explicitly featured tutor`);
    assert.equal(new Set(poses.map(pose => `${pose.position[0]}:${pose.position[1]}`)).size, poses.length, `${wall.id} has no featured-book collisions`);
    assert.ok(poses.every(pose => Math.abs(pose.position[0]) <= 1.1), `${wall.id} remains inside the middle bay`);
    assert.ok(poses.every(pose => pose.scale.every(value => value === .72)), `${wall.id} uses the shared shelf-book scale`);
  }
});

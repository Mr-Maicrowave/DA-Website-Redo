import assert from 'node:assert/strict';
import test from 'node:test';
import type { CatalogueTutor } from '../../data/teacherCatalogue.ts';
import type { TutorBookEdition } from './tutor-library-data.ts';
import { getFaceOutTutorShelfPose, selectFaceOutTutorEditionIds } from './tutor-library-presentation.ts';

const editions: TutorBookEdition[] = [
  { id: 'alpha:mathematics', tutorId: 'alpha', wallId: 'mathematics', shelfIndex: 0, slotIndex: 0, materialVariant: 0 },
  { id: 'bravo:mathematics', tutorId: 'bravo', wallId: 'mathematics', shelfIndex: 0, slotIndex: 1, materialVariant: 1 },
  { id: 'charlie:mathematics', tutorId: 'charlie', wallId: 'mathematics', shelfIndex: 0, slotIndex: 2, materialVariant: 2 },
  { id: 'delta:mathematics', tutorId: 'delta', wallId: 'mathematics', shelfIndex: 0, slotIndex: 3, materialVariant: 3 },
];

const tutor = (id: string, featuredRole?: 'manager' | 'subject-lead'): CatalogueTutor => ({
  id, tier: 'junior', primarySubject: 'math', name: id, designation: 'Tutor', tagline: '', motto: '', photo: id, posY: '50%', subjects: 'Mathematics (Yr 7–10)', hasPrimary: false,
  presentation: featuredRole ? { featuredRole } : undefined,
});

test('uses explicit featured-role metadata before deterministic discovery tutors', () => {
  const tutors = new Map(['alpha', 'bravo', 'charlie', 'delta'].map(id => [id, tutor(id, id === 'charlie' ? 'manager' : undefined)]));
  const selected = selectFaceOutTutorEditionIds(editions, tutors, 3);
  assert.ok(selected.has('charlie:mathematics'));
  assert.equal(selected.size, 3);
});

test('keeps discovery face-out selection stable regardless of input order', () => {
  const tutors = new Map(['alpha', 'bravo', 'charlie', 'delta'].map(id => [id, tutor(id)]));
  assert.deepEqual(
    [...selectFaceOutTutorEditionIds(editions, tutors, 2)].sort(),
    [...selectFaceOutTutorEditionIds([...editions].reverse(), tutors, 2)].sort(),
  );
});

test('uses one curated scale for every normal-shelf face-out tutor', () => {
  const compact = getFaceOutTutorShelfPose({ position: [-.4, .1, .2], rotation: [0, 1.4, .04], scale: [.36, .36, .36] });
  const tall = getFaceOutTutorShelfPose({ position: [.4, -.3, .1], rotation: [.02, -1.1, -.05], scale: [.52, .52, .52] });

  assert.deepEqual(compact.scale, tall.scale);
  assert.deepEqual(compact.rotation, [0, 0, 0]);
  assert.deepEqual(tall.rotation, [0, 0, 0]);
  assert.ok(compact.position[2] > .2);
  assert.ok(tall.position[2] > .1);
});

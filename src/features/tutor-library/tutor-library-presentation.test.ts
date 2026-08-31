import assert from 'node:assert/strict';
import test from 'node:test';
import type { CatalogueTutor } from '../../data/teacherCatalogue.ts';
import type { TutorBookEdition } from './tutor-library-data.ts';
import { getExplicitFaceOutTutorEditionIds, getFaceOutTutorShelfPose, getFeaturedTutorColumnPose, getOrdinaryTutorShelfPose, selectCentredFaceOutTutorEditionIds, selectFaceOutTutorEditionIds } from './tutor-library-presentation.ts';

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

test('puts explicit high-priority tutors ahead of roles and keeps their featured scale consistent', () => {
  const tutors = new Map(['alpha', 'bravo', 'charlie', 'delta'].map(id => [id, {
    ...tutor(id, id === 'charlie' ? 'manager' : undefined),
    presentation: id === 'bravo' ? { featuredPriority: 'high' as const } : tutor(id, id === 'charlie' ? 'manager' : undefined).presentation,
  }]));
  const selected = selectFaceOutTutorEditionIds(editions, tutors, 1);
  assert.deepEqual([...selected], ['bravo:mathematics']);
});

test('keeps every explicitly featured tutor face-forward without promoting ordinary shelf books', () => {
  const tutors = new Map(['alpha', 'bravo', 'charlie', 'delta'].map(id => [id, {
    ...tutor(id, id === 'bravo' ? 'manager' : undefined),
    presentation: id === 'alpha' || id === 'charlie' || id === 'delta'
      ? { featuredPriority: 'high' as const }
      : undefined,
  }]));

  assert.deepEqual(
    [...getExplicitFaceOutTutorEditionIds(editions, tutors)].sort(),
    ['alpha:mathematics', 'charlie:mathematics', 'delta:mathematics'],
  );
});

test('leaves the centre empty when no tutor is on the approved prominence list', () => {
  const tutors = new Map(['alpha', 'bravo', 'charlie', 'delta'].map(id => [id, tutor(id, id === 'charlie' ? 'manager' : undefined)]));

  assert.deepEqual([...selectCentredFaceOutTutorEditionIds(editions, tutors)], []);
});

test('centres every explicitly featured tutor instead of limiting the middle bay to two', () => {
  const tutors = new Map(['alpha', 'bravo', 'charlie', 'delta'].map(id => [id, {
    ...tutor(id),
    presentation: id === 'bravo' ? undefined : { featuredPriority: 'high' as const },
  }]));

  assert.deepEqual(
    [...selectCentredFaceOutTutorEditionIds(editions, tutors)].sort(),
    ['alpha:mathematics', 'charlie:mathematics', 'delta:mathematics'],
  );
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

test('stacks two featured tutors vertically down the exact centre column', () => {
  const poses = Array.from({ length: 2 }, (_, index) => getFeaturedTutorColumnPose(index, 2));

  assert.equal(poses[0]!.position[0], poses[1]!.position[0]);
  assert.ok(poses[0]!.position[1] > poses[1]!.position[1]);
  assert.ok(poses.every(pose => pose.rotation[1] === 0));
  assert.ok(poses.every(pose => pose.scale[0] === poses[0]!.scale[0]));
});

test('fits nine featured tutors into distinct positions inside the middle bay', () => {
  const poses = Array.from({ length: 9 }, (_, index) => getFeaturedTutorColumnPose(index, 9));
  const positions = new Set(poses.map(pose => `${pose.position[0].toFixed(3)}:${pose.position[1].toFixed(3)}`));
  const rows = new Set(poses.map(pose => pose.position[1].toFixed(3)));

  assert.equal(positions.size, 9);
  assert.equal(rows.size, 3);
  assert.ok(poses.every(pose => Math.abs(pose.position[0]) <= 1.1));
  assert.ok(poses.every(pose => pose.rotation[1] === 0));
  assert.ok(poses.every(pose => pose.scale[0] === .72 && pose.scale[1] === .72 && pose.scale[2] === .72));
});

test('keeps ordinary tutors in distinct side-bay positions away from the reserved centre column', () => {
  const ordinaryPoses = Array.from({ length: 18 }, (_, index) => getOrdinaryTutorShelfPose(editions[index % editions.length]!, index));
  const positions = new Set(ordinaryPoses.map(pose => `${pose.position[0].toFixed(3)}:${pose.position[1].toFixed(3)}`));

  assert.equal(positions.size, 18);
  assert.ok(ordinaryPoses.every(pose => Math.abs(pose.position[0]) > 2));
  assert.equal(getOrdinaryTutorShelfPose(editions[0]!, 18), undefined);
});

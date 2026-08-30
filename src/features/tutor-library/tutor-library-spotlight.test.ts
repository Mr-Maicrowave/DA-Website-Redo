import assert from 'node:assert/strict';
import test from 'node:test';
import type { CatalogueTutor } from '../../data/teacherCatalogue.ts';
import { createSpotlightSearchPose, getSpotlightResultWindow, getSpotlightRestingPose, getSpotlightSearchSlotOrder, searchTutorSpotlight } from './tutor-library-spotlight.ts';
import type { TutorBookEdition } from './tutor-library-data.ts';
import type { CompleteShelfBookPose } from './complete-shelf-book-prototype.ts';

const tutors = [
  { id: 'math', name: 'Ms Ada M.', designation: 'The Methodical Guide', tagline: 'Makes difficult mathematics feel manageable.', subjects: 'Mathematics (Yr 7–10) / Mathematics Advanced', motto: '', hasPrimary: false },
  { id: 'shaun', name: 'Mr Shaun P.', designation: 'The Calm Explainer', tagline: 'A patient guide for students finding their voice.', subjects: 'English (Yr 7–10)', motto: '', hasPrimary: false },
  { id: 'science', name: 'Ms Bea K.', designation: 'The Practical Scientist', tagline: 'Builds confidence through experiments.', subjects: 'Science (Yr 7–10)', motto: '', hasPrimary: false },
] as unknown as CatalogueTutor[];

test('spotlight searches all tutors and ranks an exact name before broad text matches', () => {
  const results = searchTutorSpotlight(tutors, 'shaun', tutor => tutor.id === 'shaun' ? ['Patient', 'Confidence'] : []);
  assert.deepEqual(results.map(result => result.tutor.id), ['shaun']);
});

test('spotlight supports a light name typo without inventing subject metadata', () => {
  const results = searchTutorSpotlight(tutors, 'shuan', () => []);
  assert.deepEqual(results.map(result => result.tutor.id), ['shaun']);
});

test('spotlight retains literal subject-level matches and searches tutor strengths', () => {
  const results = searchTutorSpotlight(tutors, 'yr 7-10 patient', tutor => tutor.id === 'shaun' ? ['Patient'] : []);
  assert.deepEqual(results.map(result => result.tutor.id), ['shaun']);
});

test('spotlight pages a bounded window without making remaining results inaccessible', () => {
  const results = tutors.map((tutor, index) => ({ tutor, score: 10 - index }));
  assert.deepEqual(getSpotlightResultWindow(results, 0, 2).map(result => result.tutor.id), ['math', 'shaun']);
  assert.deepEqual(getSpotlightResultWindow(results, 1, 2).map(result => result.tutor.id), ['shaun', 'science']);
});

test('spotlight search slots begin at the top centre and expand symmetrically before using lower shelves', () => {
  assert.deepEqual(getSpotlightSearchSlotOrder(8).slice(0, 8), [
    { shelfIndex: 1, x: 0 },
    { shelfIndex: 1, x: -.92 },
    { shelfIndex: 1, x: .92 },
    { shelfIndex: 1, x: -1.84 },
    { shelfIndex: 1, x: 1.84 },
    { shelfIndex: 1, x: -2.76 },
    { shelfIndex: 1, x: 2.76 },
    { shelfIndex: 1, x: -3.68 },
  ]);
});

test('two spotlight results form a centred top-shelf pair', () => {
  const edition: TutorBookEdition = { id: 'shaun:english', tutorId: 'shaun', wallId: 'english', shelfIndex: 4, slotIndex: 6, materialVariant: 2 };
  assert.equal(createSpotlightSearchPose(edition, 0, 2).position[0], -.46);
  assert.equal(createSpotlightSearchPose(edition, 1, 2).position[0], .46);
});

test('spotlight keeps its derived shelf pose instead of falling back to the normal idle pose', () => {
  const searchPose: CompleteShelfBookPose = { position: [0, -.5, 1.02], rotation: [0, 0, 0], scale: [.6, .6, .6] };
  const normalPose: CompleteShelfBookPose = { position: [3.8, 1.4, .34], rotation: [0, Math.PI / 2, 0], scale: [.5, .5, .5] };
  assert.deepEqual(getSpotlightRestingPose(searchPose, normalPose), searchPose);
});

test('spotlight derives an ordered shelf pose without changing the source edition', () => {
  const edition: TutorBookEdition = { id: 'shaun:english', tutorId: 'shaun', wallId: 'english', shelfIndex: 4, slotIndex: 6, materialVariant: 2 };
  const pose = createSpotlightSearchPose(edition, 2, 5);
  assert.deepEqual(edition, { id: 'shaun:english', tutorId: 'shaun', wallId: 'english', shelfIndex: 4, slotIndex: 6, materialVariant: 2 });
  assert.equal(pose.position[0], .92);
  assert.ok(pose.position[1] > -.8 && pose.position[1] < 0, 'results sit on the highest camera-visible display shelf');
  assert.ok(pose.position[2] > .9, 'results sit forward of the shelf lip');
  assert.equal(pose.rotation[1], 0);
});

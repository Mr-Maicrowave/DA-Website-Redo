import assert from 'node:assert/strict';
import test from 'node:test';
import { TUTORS } from '../../data/teacherCatalogue.ts';
import { SUBJECT_WALLS, createTutorBookEditions, getWallAngle } from './tutor-library-data.ts';

test('derives a variable-count rotunda and one edition per tutor-wall match', () => {
  const editions = createTutorBookEditions(TUTORS);
  assert.equal(new Set(editions.map(edition => edition.wallId)).size, SUBJECT_WALLS.length);
  assert.ok(editions.filter(edition => edition.tutorId === 'T030').length >= 2);
  assert.equal(getWallAngle(0, 5), 0);
  assert.equal(getWallAngle(4, 5), Math.PI * 2 * 4 / 5);
});

test('keeps science and social-science books data-driven', () => {
  const editions = createTutorBookEditions(TUTORS);
  assert.ok(editions.some(edition => edition.wallId === 'science-social' && edition.tutorId === 'T010'));
  assert.ok(editions.some(edition => edition.wallId === 'science-social' && edition.tutorId === 'T007'));
});

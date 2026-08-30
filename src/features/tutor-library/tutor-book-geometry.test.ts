import assert from 'node:assert/strict';
import test from 'node:test';
import { createTutorBookEditions } from './tutor-library-data.ts';
import { TUTORS } from '../../data/teacherCatalogue.ts';
import { createBookParts, getBookVisualProfile, getShelfPose } from './tutor-book-geometry.ts';

test('assigns every tutor edition a deterministic, shelf-contacting pose', () => {
  const [edition] = createTutorBookEditions(TUTORS);
  const firstPose = getShelfPose(edition);
  const secondPose = getShelfPose(edition);

  assert.deepEqual(firstPose, secondPose);
  assert.ok(firstPose.position[1] > -2.5 && firstPose.position[1] < 2.5);
  assert.ok(firstPose.position[2] > 0 && firstPose.position[2] < 0.8);
  assert.ok(firstPose.height > 0.55, 'book rests visibly on its shelf');
  assert.equal(firstPose.rotation[1], Math.PI / 2, 'resting editions are shelved spine-first');
});

test('defines physical book parts instead of a flat card', () => {
  const parts = createBookParts();

  assert.ok(parts.frontBoard.depth > 0);
  assert.ok(parts.backBoard.depth > 0);
  assert.ok(parts.spine.width > 0);
  assert.ok(parts.pageBlock.height < parts.frontBoard.height);
  assert.ok(parts.pageBlock.width < parts.frontBoard.width, 'page block is inset from the boards');
  assert.ok(parts.pageBlock.depth < .31 - parts.frontBoard.depth * 2, 'board and hinge thickness leave a nested page block');
  assert.ok(parts.spine.width / parts.frontBoard.width >= .08 && parts.spine.width / parts.frontBoard.width <= .10, 'spine stays proportionate');
  assert.ok(parts.frontBoard.depth / parts.frontBoard.width >= .035 && parts.frontBoard.depth / parts.frontBoard.width <= .045, 'boards remain thin and rigid');
  assert.ok(parts.boardRadius / parts.frontBoard.depth <= .15, 'board radius is a restrained edge highlight, not a padded corner');
});

test('derives restrained, stable book variation and non-uniform shelf rhythm from each edition', () => {
  const editions = createTutorBookEditions(TUTORS).filter(edition => edition.wallId === 'primary').slice(0, 8);
  const profiles = editions.map(getBookVisualProfile);
  const poses = editions.map(getShelfPose);

  assert.deepEqual(getBookVisualProfile(editions[0]), profiles[0]);
  assert.ok(new Set(profiles.map(profile => profile.height)).size > 3);
  assert.ok(new Set(profiles.map(profile => profile.width)).size > 3);
  assert.ok(profiles.every(profile => Math.abs(profile.lean) <= .09));
  assert.ok(new Set(editions.map(edition => edition.materialVariant)).size > 4, 'shelf cloth colours should not repeat in a four-book loop');
  const gaps = poses.slice(1).map((pose, index) => Number((pose.position[0] - poses[index].position[0]).toFixed(3)));
  assert.ok(new Set(gaps).size > 2, 'books should form restrained clusters, not equal intervals');
});

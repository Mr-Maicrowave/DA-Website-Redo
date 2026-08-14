import assert from 'node:assert/strict';
import test from 'node:test';
import { featuredStudentStory, hasFeaturedVideo, startingPoints } from './why-da.ts';

test('keeps an unconfigured featured story safe and reserves its future destination', () => {
  assert.equal(hasFeaturedVideo(featuredStudentStory), false);
  assert.ok('moreStudentStoriesUrl' in featuredStudentStory);
  assert.equal(featuredStudentStory.moreStudentStoriesUrl, '');
});

test('offers three distinct, low-pressure starting points', () => {
  assert.deepEqual(startingPoints.map((point) => point.id), ['confidence', 'stuck', 'challenge']);
  assert.ok(startingPoints.every((point) => point.title && point.response && point.image));
});

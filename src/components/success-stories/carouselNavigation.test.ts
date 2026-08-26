import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getAdjacentStoryIndex } from './carouselNavigation.ts';

test('moves to the next and previous success story', () => {
  assert.equal(getAdjacentStoryIndex(2, 1, 6), 3);
  assert.equal(getAdjacentStoryIndex(2, -1, 6), 1);
});

test('wraps success story navigation at both ends', () => {
  assert.equal(getAdjacentStoryIndex(5, 1, 6), 0);
  assert.equal(getAdjacentStoryIndex(0, -1, 6), 5);
});

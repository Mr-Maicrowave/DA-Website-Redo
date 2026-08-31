import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./SuccessStories.tsx', import.meta.url), 'utf8');

test('assigns a distinct generated mountain to every student story', () => {
  const paths = [...source.matchAll(/'\/images\/success-stories\/story-mountain-\d{2}-[^']+-v1\.png'/g)]
    .map(([path]) => path.slice(1, -1));

  assert.equal(paths.length, 6);
  assert.equal(new Set(paths).size, 6);
  assert.match(source, /src=\{storyMountainArtworks\[selectedIndex\]\}/);
});

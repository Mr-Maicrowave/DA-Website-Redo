import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./TutorBook.tsx', import.meta.url), 'utf8');

test('gives every selectable tutor book a forgiving pointer target', () => {
  assert.match(source, /name="tutor-book-hit-target"/);
  assert.match(source, /name="tutor-book-selection-marker"/);
  assert.match(source, /onPointerOver=/);
});

test('keeps dormant spine textures within the library texture budget', () => {
  const coverSource = readFileSync(new URL('./TutorBookCover.tsx', import.meta.url), 'utf8');

  assert.match(coverSource, /canvas\.width = mode === 'spine' \? 256 : 1024/);
  assert.match(coverSource, /texture\.anisotropy = 4/);
});

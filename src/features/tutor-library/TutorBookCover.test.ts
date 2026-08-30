import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

test('uses the canonical tutor portrait on a canvas-backed physical cover', () => {
  const source = readFileSync(new URL('./TutorBookCover.tsx', import.meta.url), 'utf8');
  assert.match(source, /getPhotoUrl\(tutor\)/);
  assert.match(source, /CanvasTexture/);
  assert.doesNotMatch(source, /<article className=/);
});

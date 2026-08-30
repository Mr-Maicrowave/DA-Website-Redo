import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

test('uses the canonical tutor portrait on a canvas-backed physical cover', () => {
  const source = readFileSync(new URL('./TutorBookCover.tsx', import.meta.url), 'utf8');
  assert.match(source, /getPhotoUrl\(tutor\)/);
  assert.match(source, /CanvasTexture/);
  assert.doesNotMatch(source, /<article className=/);
});

test('makes the portrait the dominant shelf-browsing element of a face-out cover', () => {
  const source = readFileSync(new URL('./TutorBookCover.tsx', import.meta.url), 'utf8');

  assert.match(source, /const COVER_PORTRAIT_FRAME = \{ x: 76, y: 156, width: 872, height: 850 \}/);
  assert.match(source, /context\.rect\(COVER_PORTRAIT_FRAME\.x, COVER_PORTRAIT_FRAME\.y, COVER_PORTRAIT_FRAME\.width, COVER_PORTRAIT_FRAME\.height\)/);
  assert.match(source, /context\.strokeRect\(COVER_PORTRAIT_FRAME\.x, COVER_PORTRAIT_FRAME\.y, COVER_PORTRAIT_FRAME\.width, COVER_PORTRAIT_FRAME\.height\)/);
});

test('keeps every tutor cloth theme visibly separate from black in the room lighting', () => {
  const source = readFileSync(new URL('./tutor-book-appearance.ts', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /#203a57|#25465a|#36533d|#4f345c/);
  assert.match(source, /#315775/);
  assert.match(source, /#486b4d/);
});

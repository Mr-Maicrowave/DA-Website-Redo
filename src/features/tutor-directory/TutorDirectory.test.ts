import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('starts with a neutral team prompt instead of a promoted tutor', () => {
  const source = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');
  assert.match(source, /Explore the DA team/);
  assert.match(source, /Focused educators/);
});

test('does not animate tutor positions continuously', () => {
  const source = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /requestAnimationFrame/);
  assert.doesNotMatch(source, /repeat:\s*Infinity/);
});

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

test('keeps every portrait selectable while filters only change visual state', () => {
  const source = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');
  const portraitButton = source.match(
    /<button\s+key=\{record\.tutor\.id\}[\s\S]*?onClick=\{\(\) => setSelectedTutorId\(record\.tutor\.id\)\}/,
  );
  assert.ok(portraitButton, 'expected to find the constellation portrait button');
  assert.doesNotMatch(portraitButton[0], /\bdisabled=/);
});

test('derives the neutral team total from the catalogue', () => {
  const source = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /\b43\b/);
  assert.match(source, /<span aria-hidden="true">\{TUTORS\.length\}<\/span>/);
});

test('does not nest a second main landmark inside the tutors page', () => {
  const source = readFileSync(new URL('./FullTutorProfile.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /<main className="full-profile__content">/);
});

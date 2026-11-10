import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('leads with a book of impact rather than a constellation map', () => {
  const source = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');

  assert.match(source, /Book of Impact/);
  assert.match(source, /Find the educator who fits your child/);
  assert.doesNotMatch(source, /tutor-directory__stage/);
  assert.doesNotMatch(source, /TUTOR_ORBIT_GROUPS/);
});

test('uses the active filters to reduce the visible educator stories', () => {
  const source = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');

  assert.match(source, /focusedRecords\.map\(record =>/);
  assert.match(source, /No educators match those filters yet/);
});

test('keeps the selected educator story and full profile route', () => {
  const source = readFileSync(new URL('./TutorDirectory.tsx', import.meta.url), 'utf8');

  assert.match(source, /Educator spotlight/);
  assert.match(source, /Read \{firstName\(featuredTutor\.name\)\}'s story/);
  assert.match(source, /<FullTutorProfile/);
});

test('does not nest a second main landmark inside the tutors page', () => {
  const source = readFileSync(new URL('./FullTutorProfile.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /<main className="full-profile__content">/);
});

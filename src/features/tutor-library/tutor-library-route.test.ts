import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';

const tutorsPath = new URL('../../pages/Tutors.tsx', import.meta.url);
const findTeacherPath = new URL('../../pages/FindTeacher.tsx', import.meta.url);
const libraryPath = new URL('./TutorLibrary.tsx', import.meta.url);

test('keeps FindTeacher as a deep-linkable fallback while reserving the Tutors library seam', () => {
  assert.equal(existsSync(libraryPath), true);
  assert.match(readFileSync(tutorsPath, 'utf8'), /TutorLibrary/);
  assert.match(readFileSync(findTeacherPath, 'utf8'), /searchParams\.get\('tutor'\)/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const findTeacherUrl = new URL('./FindTeacher.tsx', import.meta.url);

test('opens a requested tutor profile from the tutor query parameter', () => {
  const source = readFileSync(findTeacherUrl, 'utf8');

  assert.match(source, /useSearchParams/);
  assert.match(source, /searchParams\.get\('tutor'\)/);
  assert.match(source, /setSelected\(requestedTutor\)/);
});

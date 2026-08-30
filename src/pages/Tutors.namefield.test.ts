import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pageUrl = new URL('./Tutors.tsx', import.meta.url);
test('uses the tutor library as the default Tutors experience', () => {
  const page = readFileSync(pageUrl, 'utf8');

  assert.match(page, /const TutorLibrary = lazy\(/);
  assert.match(page, /import\('@\/features\/tutor-library\/TutorLibrary'\)/);
  assert.match(page, /const TutorBookStudio = lazy\(/);
  assert.match(page, /<Suspense fallback=\{<TutorLibraryRouteLoading \/>\}>/);
  assert.match(page, /<TutorLibrary \/>/);
  assert.doesNotMatch(page, /libraryEnabled/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';

const tutorsPath = new URL('../../pages/Tutors.tsx', import.meta.url);
const appPath = new URL('../../App.tsx', import.meta.url);
const findTeacherPath = new URL('../../pages/FindTeacher.tsx', import.meta.url);
const libraryPath = new URL('./TutorLibrary.tsx', import.meta.url);
const loadingPath = new URL('./TutorLibraryLoadingSurface.tsx', import.meta.url);

test('keeps FindTeacher as a deep-linkable fallback while reserving the Tutors library seam', () => {
  assert.equal(existsSync(libraryPath), true);
  assert.match(readFileSync(tutorsPath, 'utf8'), /TutorLibrary/);
  assert.match(readFileSync(findTeacherPath, 'utf8'), /searchParams\.get\('tutor'\)/);
});

test('preloads the library and first shelf during the intro without mounting a second WebGL scene', () => {
  const source = readFileSync(tutorsPath, 'utf8');

  assert.match(source, /shouldPreloadTutorLibrary/);
  assert.match(source, /requestIdleCallback/);
  assert.match(source, /Promise\.all\(\[importTutorLibrary\(\), warmTutorLibraryAssets\(\)\]\)/);
  assert.match(source, /assets\.warmTutorLibraryFirstShelf\(\)/);
  assert.match(source, /connection\?\.saveData/);
});

test('uses the bookshelf loading surface for every tutor-library wait state', () => {
  const appSource = readFileSync(appPath, 'utf8');
  const routeSource = readFileSync(tutorsPath, 'utf8');
  const librarySource = readFileSync(libraryPath, 'utf8');

  assert.equal(existsSync(loadingPath), true);
  const loadingSource = readFileSync(loadingPath, 'utf8');
  assert.match(loadingSource, /role="status"/);
  assert.match(loadingSource, /Array\.from\(\{ length: 7 \}\)/);
  assert.match(loadingSource, /tutor-library__loading-shelf/);
  assert.match(routeSource, /TutorLibraryLoadingSurface/);
  assert.match(librarySource, /TutorLibraryLoadingSurface/);
  assert.match(appSource, /TutorLibraryLoadingSurface/);
  assert.doesNotMatch(appSource, /Opening the tutor library/);
  assert.doesNotMatch(routeSource, /Opening the tutor library/);
});

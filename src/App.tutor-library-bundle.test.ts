import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const appUrl = new URL('./App.tsx', import.meta.url);

test('loads the Tutors route only when a visitor navigates to it', () => {
  const app = readFileSync(appUrl, 'utf8');

  assert.match(app, /const Tutors = lazy\(\(\) => import\("\.\/pages\/Tutors"\)\)/);
  assert.match(app, /path="\/tutors" element=\{<Suspense fallback=\{<TutorRouteLoading \/>\}><PageTransition><Tutors \/><\/PageTransition><\/Suspense>\}/);
  assert.doesNotMatch(app, /import Tutors from "\.\/pages\/Tutors";/);
});

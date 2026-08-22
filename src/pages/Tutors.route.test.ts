import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const appSource = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
const tutorsPageSource = readFileSync(new URL('./Tutors.tsx', import.meta.url), 'utf8');

test('uses TutorDirectory for the canonical tutors route and redirects legacy tutor paths', () => {
  assert.match(appSource, /<Route path="\/tutors" element={<PageTransition><Tutors \/><\/PageTransition>} \/>/);
  assert.match(tutorsPageSource, /import \{ TutorDirectory \} from ['"]@\/features\/tutor-directory\/TutorDirectory['"]/);
  assert.match(tutorsPageSource, /<TutorDirectory \/>/);
  assert.match(
    appSource,
    /<Route path="\/find-teacher" element={<LegacyTutorRedirect \/>} \/>/,
  );

  for (const legacyPath of ['/teachers', '/our-teachers']) {
    assert.match(
      appSource,
      new RegExp(`<Route path="${legacyPath}" element={<Navigate to="/tutors" replace \/>} \/>`),
    );
  }
});

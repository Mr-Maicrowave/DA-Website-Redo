import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pageUrl = new URL('./Tutors.tsx', import.meta.url);
test('uses the tutor library as the default Tutors experience', () => {
  const page = readFileSync(pageUrl, 'utf8');

  assert.match(page, /import \{ TutorLibrary \} from '@\/features\/tutor-library\/TutorLibrary';/);
  assert.match(page, /<TutorLibrary \/>/);
  assert.doesNotMatch(page, /libraryEnabled/);
});

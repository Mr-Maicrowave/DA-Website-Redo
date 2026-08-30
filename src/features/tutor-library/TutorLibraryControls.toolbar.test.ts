import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const controls = readFileSync(new URL('./TutorLibraryControls.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('./tutor-library.css', import.meta.url), 'utf8');

test('uses the compact inline-toolbar structure for the book companion', () => {
  assert.match(controls, /tutor-library__reader-action/);
  assert.match(controls, /BookOpen/);
  assert.match(styles, /\.tutor-library__reader-actions \{ display: grid; grid-template-columns: 1fr;/);
});

test('uses the site editorial font pair throughout the tutor library', () => {
  assert.match(styles, /'Cormorant Garamond'/);
  assert.match(styles, /'Cabin'/);
  assert.doesNotMatch(styles, /Georgia, serif/);
});

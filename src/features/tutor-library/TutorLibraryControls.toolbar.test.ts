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

test('only presents the controls that make sense for the closed cover or an open spread', () => {
  assert.match(controls, /const readerStage = library\.phase === 'BOOK_PREVIEW' \? 'cover' : 'spread'/);
  assert.match(controls, /readerStage === 'cover'/);
  assert.match(controls, /Return book/);
  assert.match(controls, /Close book/);
});

test('uses the site editorial font pair throughout the tutor library', () => {
  assert.match(styles, /'Cormorant Garamond'/);
  assert.match(styles, /'Cabin'/);
  assert.doesNotMatch(styles, /Georgia, serif/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sourceUrl = new URL('./TutorNamefieldDirectory.tsx', import.meta.url);
const cssUrl = new URL('./tutor-namefield.css', import.meta.url);

test('Namefield directory exposes a filterable portrait-led tutor index with an in-place preview and profile state', () => {
  const source = readFileSync(sourceUrl, 'utf8');

  assert.match(source, /export function TutorNamefieldDirectory/);
  assert.match(source, /TUTORS/);
  assert.match(source, /getPhotoUrl/);
  assert.match(source, /teachesEnglish/);
  assert.match(source, /onMouseEnter/);
  assert.match(source, /onFocus/);
  assert.match(source, /aria-expanded/);
  assert.match(source, /Open full profile/);
  assert.match(source, /Full profile for/);
  assert.match(source, /Escape/);
  assert.doesNotMatch(source, /The Voice Sculptor|The Excellence Standard/);

  const css = readFileSync(cssUrl, 'utf8');
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

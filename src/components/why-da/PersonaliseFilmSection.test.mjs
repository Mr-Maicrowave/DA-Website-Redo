import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const component = await readFile(new URL('./PersonaliseFilmSection.tsx', import.meta.url), 'utf8');
const photos = await readFile(new URL('./personalisationPhotos.ts', import.meta.url), 'utf8');
const styles = await readFile(new URL('./PersonaliseFilmSection.css', import.meta.url), 'utf8');

test('maps the five supplied DA photographs in the provided order', () => {
  assert.match(photos, /personalise-main\.png[\s\S]*personalise-level\.png[\s\S]*personalise-pace\.png[\s\S]*personalise-support\.png[\s\S]*personalise-goals\.png/);
  assert.equal((photos.match(/src:\s*null/g) ?? []).length, 0);
  assert.doesNotMatch(photos, /https?:\/\/|unsplash|stock|generated/i);
});

test('exposes reusable film frames with independent responsive crops', () => {
  assert.match(component, /export function FilmFrame/);
  assert.match(component, /export function FilmStrip/);
  assert.match(photos, /objectPositionDesktop/);
  assert.match(photos, /objectPositionTablet/);
  assert.match(photos, /objectPositionMobile/);
  assert.match(styles, /var\(--film-position-desktop\)/);
  assert.match(styles, /var\(--film-position-tablet\)/);
  assert.match(styles, /var\(--film-position-mobile\)/);
});

test('renders the personalisation story and ends cleanly after the responsive film roll', () => {
  assert.match(component, /Now that we[\s\S]*around them/);
  assert.match(photos, /RIGHT LEVEL[\s\S]*RIGHT PACE[\s\S]*RIGHT SUPPORT[\s\S]*RIGHT GOALS/);
  assert.doesNotMatch(component, /Not the same program|The right program|NEXT|WE TEACH|personalise-film__closing/);
  assert.match(styles, /grid-template-columns:repeat\(4/);
  assert.match(styles, /@media\(max-width:1023px\)[\s\S]*grid-template-columns:repeat\(2/);
  assert.match(styles, /@media\(max-width:639px\)[\s\S]*flex-direction:column/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
});

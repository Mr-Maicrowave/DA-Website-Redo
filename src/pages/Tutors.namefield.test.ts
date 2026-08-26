import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pageUrl = new URL('./Tutors.tsx', import.meta.url);
const heroUrl = new URL('../features/tutor-orbit/TutorOrbitHero.tsx', import.meta.url);

test('keeps Tutors as the hero entry point and reveals Namefield in the same route', () => {
  const page = readFileSync(pageUrl, 'utf8');
  const hero = readFileSync(heroUrl, 'utf8');

  assert.match(page, /TutorNamefieldDirectory/);
  assert.match(page, /useState/);
  assert.match(page, /setView\('directory'\)/);
  assert.match(page, /onExplore/);
  assert.match(hero, /onExplore/);
  assert.match(hero, /onClick=\{onExplore\}/);
  assert.doesNotMatch(hero, /to="\/find-teacher"[\s\S]{0,80}Explore the whole team/);
});

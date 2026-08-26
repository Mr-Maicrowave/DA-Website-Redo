import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('../../../pages/programs/HighSchool.tsx', import.meta.url), 'utf8');
const feature = await readFile(new URL('./HighSchoolProfessionalJourney.tsx', import.meta.url), 'utf8').catch(() => '');

test('mounts the professional journey immediately after the cinematic journey', () => {
  assert.match(page, /import HighSchoolProfessionalJourney from '@\/components\/programs\/high-school-professional\/HighSchoolProfessionalJourney';/);
  assert.match(page, /<HighSchoolCinematicScene\s*\/>\s*<HighSchoolProfessionalJourney\s*\/>/);
});

test('replaces the obsolete post-hero page chain', () => {
  for (const name of ['TeacherBeside', 'Curriculum', 'HowWeTeach', 'PerfectIf']) {
    assert.doesNotMatch(page, new RegExp(`<${name}\\s*\\/>`));
  }
});

test('composes every approved lower-page section', () => {
  for (const name of ['MethodTransition', 'TeachingProcess', 'TeacherSupport', 'ProgressJourney', 'HSCBridge']) {
    assert.match(feature, new RegExp(`<${name}`));
  }
});

test('replaces the book curriculum section with the magnifier method transition', () => {
  assert.match(feature, /<MethodTransition\s*\/>/);
  assert.doesNotMatch(feature, /<TransitionBridge\s*\/>/);
  assert.doesNotMatch(feature, /<CurriculumExplorer\s*\/>/);
  assert.doesNotMatch(feature, /curriculum-heading-open-book-v1/);
  assert.match(feature, /<MethodTransition\s*\/>\s*<TeachingProcess/);
});

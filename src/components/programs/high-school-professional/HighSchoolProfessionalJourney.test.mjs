import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('../../../pages/programs/HighSchool.tsx', import.meta.url), 'utf8');
const feature = await readFile(new URL('./HighSchoolProfessionalJourney.tsx', import.meta.url), 'utf8').catch(() => '');
const data = await readFile(new URL('./professionalJourneyData.ts', import.meta.url), 'utf8');
const styles = await readFile(new URL('./HighSchoolProfessionalJourney.css', import.meta.url), 'utf8');

test('mounts the professional journey immediately after the cinematic journey', () => {
  assert.match(page, /import HighSchoolProfessionalJourney from '@\/components\/programs\/high-school-professional\/HighSchoolProfessionalJourney';/);
  assert.match(page, /<HighSchoolCinematicScene\s*\/>\s*<HighSchoolProfessionalJourney\s*\/>/);
});

test('replaces the obsolete post-hero page chain', () => {
  for (const name of ['TeacherBeside', 'Curriculum', 'HowWeTeach', 'PerfectIf']) {
    assert.doesNotMatch(page, new RegExp(`<${name}\\s*\\/>`));
  }
});

test('composes one teacher progress story between methods and the HSC bridge', () => {
  assert.match(feature, /export function TeacherProgressStory/);
  assert.match(feature, /<MethodTransition\s*\/>\s*<TeacherProgressStory\s*\/>\s*<HSCBridge\s*\/>/);
  assert.doesNotMatch(feature, /<TeacherSupport/);
  assert.doesNotMatch(feature, /<ProgressJourney/);
  assert.doesNotMatch(feature, /TeachingProcess/);
});

test('keeps the approved story, principles, and journey copy in semantic markup', () => {
  for (const copy of [
    'Your teacher',
    'beside you.',
    'Not teaching at you.',
    'Working with you.',
    'The progress we build together',
    'Progress you can see.',
    'Independence they can feel.',
    'We prepare for what comes next.',
  ]) assert.match(feature, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  for (const title of [
    'Questions encouraged',
    'Mistakes noticed',
    'Feedback happens here',
    'Weaknesses addressed',
    'Foundations',
    'Study habits',
    'Independence',
    'Confidence',
    'Readiness',
  ]) assert.match(data, new RegExp(title));
});

test('uses responsive editorial assets and accessible structure', () => {
  assert.match(feature, /teacher-progress-tutoring-scene-v1/);
  assert.match(feature, /teacher-progress-watercolor-frame-v1/);
  assert.match(feature, /type="image\/avif"/);
  assert.match(feature, /type="image\/webp"/);
  assert.match(feature, /width=\{1536\}[\s\S]*height=\{1024\}/);
  assert.match(feature, /alt="A tutor working beside a high-school student at an open workbook"/);
  assert.match(feature, /className="hsp-story__atmosphere" aria-hidden="true"/);
  assert.match(feature, /<ol className="hsp-story__milestones"/);
});

test('defines desktop, mobile, and reduced-motion story layouts', () => {
  assert.match(styles, /\.hsp-story__upper\s*\{[\s\S]*grid-template-columns:/);
  assert.match(styles, /\.hsp-story__principles\s*\{[\s\S]*grid-template-columns:\s*repeat\(4,/);
  assert.match(styles, /\.hsp-story__milestones\s*\{[\s\S]*grid-template-columns:\s*repeat\(5,/);
  assert.match(styles, /@media\(max-width:700px\)[\s\S]*\.hsp-story__upper[\s\S]*grid-template-columns:\s*1fr/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

test('replaces the book curriculum section with the magnifier method transition', () => {
  assert.match(feature, /<MethodTransition\s*\/>/);
  assert.doesNotMatch(feature, /<TransitionBridge\s*\/>/);
  assert.doesNotMatch(feature, /<CurriculumExplorer\s*\/>/);
  assert.doesNotMatch(feature, /curriculum-heading-open-book-v1/);
  assert.match(feature, /<MethodTransition\s*\/>\s*<TeacherProgressStory/);
});

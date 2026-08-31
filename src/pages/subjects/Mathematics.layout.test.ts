import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const mathematicsUrl = new URL('./Mathematics.tsx', import.meta.url);

test('positions the Mathematics offer consistently as Years 7-12', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  const component = source.slice(source.indexOf('const Mathematics = () => {'));

  assert.match(component, /title="Mathematics Tutoring \(Years 7-12 & HSC\)"/);
  assert.match(component, /eyebrow="Years 7-12 Mathematics"/);
  assert.doesNotMatch(component, /Primary School|Years K-6|K-6 Mathematics|K-12 & HSC/);
});

test('places Graph Lab after teaching proof and before student feedback', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  const component = source.slice(source.indexOf('const Mathematics = () => {'));
  const teachingProofIndex = component.indexOf('<MathsTeachingProof />');
  const graphLabIndex = component.indexOf('<MathsGraphLabInvitation />');
  const studentFeedbackIndex = component.indexOf('In their own words');

  assert.ok(teachingProofIndex >= 0, 'teaching proof must remain mounted');
  assert.ok(graphLabIndex > teachingProofIndex, 'Graph Lab invitation must follow teaching proof');
  assert.ok(studentFeedbackIndex > graphLabIndex, 'student feedback must follow Graph Lab');
});
test('moves directly from the hero into the Year Cube without a section rail or mid-page CTA', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  const component = source.slice(source.indexOf('const Mathematics = () => {'));

  assert.match(component, /<YearCube\s*\/>/);
  assert.doesNotMatch(component, /<MathematicalFieldStation\s*\/>/);
  assert.doesNotMatch(component, /<MathsTopicNetwork\s*\/>/);
  assert.doesNotMatch(component, /aria-label="Mathematics page sections"/);
  assert.doesNotMatch(component, /Ready to find the right starting point\?/);
});

test('uses a verified student quote sourced from a real review, not the old placeholder', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');

  // review-078 in src/data/reviews.json (subject: Mathematics) — see the comment
  // above the section in Mathematics.tsx for the sourcing note.
  assert.match(source, /she broke it down into steps in the easiest method/);
  assert.match(source, /— Christina Lee, Year 10/);
  assert.doesNotMatch(source, /I used to memorise formulas and hope I picked the right one/);
  assert.doesNotMatch(source, /Placeholder — replace with verified student feedback/);
});

test('keeps the tutor and mathematics context visible in the mobile hero crop', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');

  assert.match(source, /mobileBackgroundPosition="70% center"/);
  assert.doesNotMatch(source, /mobileBackgroundPosition="100% center"/);
});

test('uses the same navy hero tint and light text treatment as English', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  const hero = source.slice(source.indexOf('<SubjectHero'), source.indexOf('/>', source.indexOf('<SubjectHero')) + 2);

  assert.doesNotMatch(hero, /heroTone="light"/);
  assert.doesNotMatch(hero, /headlineAccentClassName|subtextClassName/);
});

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

test('uses a compact horizontal quick-link rail on mobile and distinguishes the page link', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');

  assert.match(source, /overflow-x-auto[^"]*snap-x[^"]*md:grid/);
  assert.match(source, /opens a separate page/);
  assert.match(source, /ArrowUpRight/);
});

test('uses a flat section index without ambient diagrams crowding the opening transition', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  const component = source.slice(source.indexOf('const Mathematics = () => {'));
  const indexStart = component.indexOf('{/* Anchor navigation */}');
  const indexEnd = component.indexOf('</nav>', indexStart) + '</nav>'.length;
  const sectionIndex = component.slice(indexStart, indexEnd);

  assert.match(sectionIndex, /<nav[^>]*aria-label="Mathematics page sections"/);
  assert.match(sectionIndex, /border-y/);
  assert.doesNotMatch(sectionIndex, /rounded-[^\s"]+|shadow-[^\s"]+/);
  assert.equal((sectionIndex.match(/<NetworkAmbientMoment\s+passive\s*\/>/g) ?? []).length, 0);
  assert.equal((sectionIndex.match(/<DerivativeAmbientMoment\s+passive\s*\/>/g) ?? []).length, 0);
});

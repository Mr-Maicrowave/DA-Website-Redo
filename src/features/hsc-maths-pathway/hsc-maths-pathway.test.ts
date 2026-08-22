import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  getActivePath,
  getHscStream,
  type HscStreamId,
} from './hsc-maths-pathway-model.ts';

const componentUrl = new URL('./HscMathsPathway.tsx', import.meta.url);
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('Mathematics page mounts the feature and removes the legacy HSC selector', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  assert.match(source, /import \{ HscMathsPathway \}/);
  assert.match(source, /<HscMathsPathway \/>/);
  assert.doesNotMatch(source, /aria-label="Choose an HSC mathematics stream"/);
  assert.doesNotMatch(source, /hscRoutePaths/);
  assert.doesNotMatch(source, /hscStreamButtonRefs/);
});

test('Mathematics keeps the year-level selector without the removed Fourier enrichment selector', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  const mathematicsComponent = source.slice(source.indexOf('const Mathematics = () => {'));
  assert.doesNotMatch(mathematicsComponent, /<FourierDrawing\s*\/>/);
  assert.match(source, /role="tablist" aria-label="Year level"/);
  assert.match(source, /role="tab"\s+aria-selected=\{activeTab === tab\.id\}/);
});

test('Standard remains separate from the Advanced extension pathway', () => {
  assert.deepEqual(getActivePath('standard'), ['standard']);
});

test('Extension 1 includes Advanced in its active prerequisite path', () => {
  assert.deepEqual(getActivePath('extension-1'), ['advanced', 'extension-1']);
});

test('Extension 2 includes both prerequisites and is Year 12 only', () => {
  assert.deepEqual(getActivePath('extension-2'), [
    'advanced',
    'extension-1',
    'extension-2',
  ] satisfies HscStreamId[]);
  assert.equal(getHscStream('extension-2').year12Only, true);
  assert.deepEqual(getHscStream('extension-2').prerequisites, [
    'Advanced',
    'Extension 1',
  ]);
});

test('pathway begins with a course chooser and keeps the dependency map subordinate', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /Choose an HSC maths course with confidence/);
  assert.match(source, /Which course is your child considering\?/);
  assert.match(source, /I&apos;m not sure which course fits yet/);
  assert.match(source, /How the courses connect/);
  assert.doesNotMatch(source, /hsc-pathway-map/);
  assert.doesNotMatch(source, /ROUTE_SEGMENTS/);
});

test('pathway makes each course a keyboard-accessible single selection', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /aria-pressed=\{isSelected\}/);
  assert.match(source, /aria-controls="hsc-course-guide"/);
  assert.match(source, /role="region" aria-live="polite"/);
  assert.match(source, /focus-visible:ring-2/);
});

test('pathway presents the approved decision content and actions', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /Best fit when/);
  assert.match(source, /What changes/);
  assert.match(source, /Where students need help/);
  assert.match(source, /How DA helps/);
  assert.match(source, /Talk through your child/);
  assert.match(source, /to="\/book-interview"/);
  assert.match(source, /to="\/hsc-excellence"/);
  assert.match(source, /See topics covered/);
});

test('secondary actions and topic disclosure keep a 48px minimum target', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(
    source,
    /<summary className="[^"]*min-h-12[^"]*">\s*See topics covered/,
  );
  assert.match(
    source,
    /to="\/hsc-excellence" className="[^"]*min-h-12[^"]*"/,
  );
  assert.doesNotMatch(source, /to="\/hsc-excellence" className="[^"]*min-h-11/);
});

test('course guide uses a stable heading relationship', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /id="hsc-course-guide-heading"/);
  assert.match(source, /aria-labelledby="hsc-course-guide-heading"/);
});

test('course colour remains an accent rather than the only source of meaning', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /borderColor: stream\.color/);
  assert.match(source, /backgroundColor: stream\.color/);
  assert.match(source, /\{stream\.availability\}/);
});

test('chooser is full-bleed, rounds its course controls, and gives unsure families a non-diagnostic next step', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /max-w-none/);
  assert.match(source, /rounded-xl/);
  assert.match(source, /Start with the facts, not a score/);
  assert.match(source, /What year is your child entering\?/);
  assert.match(source, /What are they studying now\?/);
  assert.match(source, /What has the school recommended or offered\?/);
  assert.match(source, /This is a comparison checklist, not a placement recommendation/);
  assert.doesNotMatch(source, /Book a course-choice conversation/);
  assert.doesNotMatch(source, /bg-\[#171716\]/);
});

test('Extension 2 makes its Year 12 Advanced-course replacement explicit', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /replaces the Advanced HSC course in Year 12/);
  assert.match(getHscStream('extension-2').whatChanges, /replaces the Advanced HSC course in Year 12/);
});

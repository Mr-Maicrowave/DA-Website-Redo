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

test('Mathematics page mounts the feature and removes the incomplete tab selector', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  assert.match(source, /import \{ HscMathsPathway \}/);
  assert.match(source, /<HscMathsPathway \/>/);
  assert.doesNotMatch(source, /role="tab"/);
  assert.doesNotMatch(source, /hscRoutePaths/);
  assert.doesNotMatch(source, /hscStreamButtonRefs/);
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

test('pathway exposes selection, accordion, focus, and reduced-motion semantics', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /aria-pressed=\{isSelected\}/);
  assert.match(source, /aria-expanded=\{isSelected\}/);
  assert.match(source, /aria-controls=\{panelId\}/);
  assert.match(source, /focus-visible:ring-2/);
  assert.match(source, /useReducedMotion/);
  assert.doesNotMatch(source, /role="tab"/);
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

test('every small pathway label uses approved navy while course colour remains an accent', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.doesNotMatch(source, /style=\{\{ color: stream\.color \}\}/);
  assert.match(source, /borderColor: stream\.color/);
  assert.match(source, /className="[^"]*text-\[#071629\][^"]*">HSC pathway map<\/p>/);
  assert.equal(
    source.match(/className="[^"]*text-\[#071629\][^"]*">\{stream\.shortDescriptor\}<\/span>/g)?.length,
    2,
  );
  assert.match(source, /className="[^"]*text-\[#071629\][^"]*" aria-hidden="true">\s*Year 10/);
  assert.match(source, /className="[^"]*text-\[#071629\][^"]*">Extension 2 becomes available<\/p>/);
  assert.match(source, /className="[^"]*text-\[#071629\][^"]*">Year 12 only<\/p>/);
  assert.match(source, /className="[^"]*text-\[#071629\][^"]*">Requires Advanced \+ Extension 1<\/p>/);
});

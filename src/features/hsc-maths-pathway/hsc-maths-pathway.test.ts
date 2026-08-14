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

test('Mathematics keeps the pre-existing non-HSC selectors unchanged', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  assert.match(source, /role="tablist" aria-label="Fourier drawing presets"/);
  assert.match(source, /role="tab"\s+aria-selected=\{preset === option\.id\}/);
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

test('pathway exposes selection, accordion, focus, and reduced-motion semantics', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /aria-pressed=\{isSelected\}/);
  assert.match(source, /aria-expanded=\{isSelected\}/);
  assert.match(source, /aria-controls=\{panelId\}/);
  assert.match(source, /focus-visible:ring-2/);
  assert.match(source, /useReducedMotion/);
  assert.doesNotMatch(source, /role="tab"/);
});

test('every pathway control names the approved navy focus-visible ring', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /<summary className="[^"]*focus-visible:ring-\[#071629\][^"]*"/);
  assert.match(source, /to="\/book-interview" className="[^"]*focus-visible:ring-\[#071629\][^"]*"/);
  assert.match(source, /to="\/hsc-excellence" className="[^"]*focus-visible:ring-\[#071629\][^"]*"/);
  assert.equal(
    source.match(/<button[\s\S]*?className=(?:"[^"]*focus-visible:ring-\[#071629\][^"]*"|\{`[^`]*focus-visible:ring-\[#071629\][^`]*`\})/g)?.length,
    2,
  );
});

test('accordion keeps every controlled panel mounted while hiding inactive details', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /id=\{panelId\} hidden=\{!isSelected\} role="region" aria-labelledby=\{headingId\}/);
  assert.doesNotMatch(source, /\{isSelected \? \(\s*<div id=\{panelId\}/);
});

test('route segments stay mounted, reveal once in view, and include the Advanced companion label', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /key=\{pathId\}/);
  assert.doesNotMatch(source, /key=\{`\$\{activeStreamId\}-\$\{pathId\}`\}/);
  assert.match(source, /onViewportEnter=\{\(\) => setPathwayInView\(true\)\}/);
  assert.match(source, /viewport=\{\{ once: true/);
  assert.match(source, />\s*Studied with Advanced\s*</);
});

test('tablet widths use the accordion instead of the spatial desktop pathway', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /xl:grid xl:grid-cols-\[0\.72fr_1\.15fr_0\.9fr\]/);
  assert.match(source, /xl:hidden/);
  assert.doesNotMatch(source, /lg:grid lg:grid-cols-\[0\.72fr_1\.15fr_0\.9fr\]/);
  assert.doesNotMatch(source, /lg:hidden/);
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

test('desktop and mobile details use caller-scoped heading ids', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /function StreamDetails\(\{ stream, headingId, compact = false \}/);
  assert.match(source, /id=\{headingId\}/);
  assert.doesNotMatch(source, /id=\{`hsc-stream-heading-\$\{stream\.id\}`\}/);
  assert.match(source, /const desktopHeadingId = `hsc-stream-desktop-heading-\$\{activeStream\.id\}`/);
  assert.match(source, /aria-labelledby=\{desktopHeadingId\}/);
  assert.match(source, /<StreamDetails stream=\{activeStream\} headingId=\{desktopHeadingId\} \/>/);
  assert.match(source, /const headingId = `\$\{panelId\}-heading`/);
  assert.match(source, /id=\{panelId\} hidden=\{!isSelected\} role="region" aria-labelledby=\{headingId\}/);
  assert.match(source, /<StreamDetails stream=\{stream\} headingId=\{headingId\} compact \/>/);
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

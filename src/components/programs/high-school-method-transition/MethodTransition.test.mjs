import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(
  new URL('./MethodTransition.tsx', import.meta.url),
  'utf8',
);
const styles = readFileSync(
  new URL('./MethodTransition.css', import.meta.url),
  'utf8',
);
const dataSource = readFileSync(
  new URL('./methodTransitionData.ts', import.meta.url),
  'utf8',
);
const mobileStyles = styles.slice(
  styles.indexOf('@media (max-width: 639px)'),
  styles.indexOf('@media (prefers-reduced-motion: reduce)'),
);

test('uses one reversible pinned master timeline', () => {
  assert.equal((source.match(/gsap\.timeline\(/g) ?? []).length, 1);
  assert.match(source, /scrub:\s*0\.8/);
  assert.match(source, /invalidateOnRefresh:\s*true/);
  assert.match(source, /--method-transition-scroll/);
});

test('renders five accessible symbol buttons and a reduced-motion branch', () => {
  assert.match(source, /methodItems\.map/);
  assert.match(source, /aria-label=\{method\.label\}/);
  assert.match(source, /role="toolbar"/);
  assert.match(source, /prefers-reduced-motion/);
  assert.doesNotMatch(source, /<h[1-6]/);
});

test('fixes the selector contract at five labelled methods', () => {
  assert.equal((dataSource.match(/\blabel:\s*'/g) ?? []).length, 5);
  for (const label of ['Diagnose', 'Explain', 'Practise', 'Apply', 'Review']) {
    assert.match(dataSource, new RegExp(`label: '${label}'`));
  }
});

test('measures source and destination for a proxy handoff', () => {
  assert.match(source, /data-method-transition-magnifier/);
  assert.match(source, /getBoundingClientRect/);
  assert.match(source, /proxyRef/);
  assert.match(source, /diagnoseRef/);
});

test('normalizes the transformed finale before measuring the source', () => {
  assert.match(source, /measureUntransformedSource/);
  assert.match(source, /finale\.style\.transform\s*=\s*'none'/);
  assert.match(source, /finally\s*\{/);
  assert.match(source, /finale\.style\.transform\s*=\s*inlineTransform/);
});

test('prepares a viewport-continuous source handoff', () => {
  assert.doesNotMatch(styles, /margin-top:\s*-100(?:s)?vh/);
  assert.match(
    styles,
    /background:\s*linear-gradient\(to bottom,\s*transparent 0 100svh,\s*#fffdf8 100svh\)/,
  );
  assert.match(source, /start:\s*'top bottom'/);
  assert.match(source, /sourceYear\.style\.animation\s*=\s*'none'/);
  assert.match(source, /sourceYear\.style\.transform\s*=\s*'none'/);
  assert.match(
    source,
    /const handoffTravel\s*=\s*section\.offsetHeight\s*\*\s*0\.15/,
  );
  assert.match(source, /sourceRect\.top\s*-\s*stickyRect\.top\s*-\s*handoffTravel/);
});

test('projects sticky-stage destinations into viewport coordinates', () => {
  assert.match(source, /const stageRect\s*=\s*stage\.getBoundingClientRect\(\)/);
  assert.match(source, /centerRect\.top\s*-\s*stageRect\.top/);
  assert.match(source, /finalDiagnoseRect\.top\s*-\s*stageRect\.top/);
});

test('keeps the transition stage sticky and the desktop peak within bounds', () => {
  assert.match(styles, /\.hsm-transition\s*\{[^}]*overflow:\s*visible/s);
  assert.match(
    styles,
    /\.hs-professional:has\(> \.hsm-transition\)\s*\{[^}]*overflow:\s*visible/s,
  );
  assert.match(source, /conditions\.desktop\s*\?\s*216\s*:/);
});

test('retains 300vh on mobile and gates hidden controls from interaction', () => {
  assert.match(styles, /--method-transition-scroll:\s*300vh/);
  assert.match(styles, /min-height:\s*300svh/);
  assert.doesNotMatch(styles, /--method-transition-scroll:\s*260vh/);
  assert.doesNotMatch(styles, /min-height:\s*260svh/);
  assert.match(source, /toggleAttribute\('inert',\s*!methodsAvailable\)/);
  assert.match(source, /disabled=\{!methodsAvailable\}/);
  assert.match(source, /methodsAvailable\s*&&\s*active\s*===\s*index\s*\?\s*0\s*:\s*-1/);
  assert.match(source, /progress\s*>=\s*0\.94/);
});

test('fits all five mobile methods in one unclipped row', () => {
  assert.match(mobileStyles, /grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(mobileStyles, /overflow-x:\s*visible/);
  assert.doesNotMatch(mobileStyles, /overflow-x:\s*auto/);
});

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

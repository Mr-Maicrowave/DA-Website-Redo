import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(
  new URL('./MethodTransition.tsx', import.meta.url),
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

test('measures source and destination for a proxy handoff', () => {
  assert.match(source, /data-method-transition-magnifier/);
  assert.match(source, /getBoundingClientRect/);
  assert.match(source, /proxyRef/);
  assert.match(source, /diagnoseRef/);
});

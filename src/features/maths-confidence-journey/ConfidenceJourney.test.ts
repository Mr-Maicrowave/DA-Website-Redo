import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const moduleUrl = new URL('./ConfidenceJourney.tsx', import.meta.url);

test('confidence journey connects parent concerns to school-stage pathways without motion-only content', () => {
  assert.equal(existsSync(moduleUrl), true, 'ConfidenceJourney.tsx must render the connected Maths pathway section');

  const source = readFileSync(moduleUrl, 'utf8');
  assert.match(source, /id="parent-concerns"/);
  assert.match(source, /id="math-pathways"/);
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /useReducedMotion/);
  assert.match(source, /pathLength/);
  assert.match(source, /prefersReducedMotion \? false/);
});

test('each school stage has a distinct mathematical visual and a colour-led heading', () => {
  const source = readFileSync(moduleUrl, 'utf8');
  assert.match(source, /kind: 'number-line'/);
  assert.match(source, /kind: 'coordinate-plane'/);
  assert.match(source, /kind: 'exam-curve'/);
  assert.match(source, /linearGradient/);
  assert.match(source, /style=\{\{ color: visual\.accent \}\}/);
});

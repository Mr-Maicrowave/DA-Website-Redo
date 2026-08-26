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

test('the Years 7-12 stages use distinct high-school and HSC visuals', () => {
  const source = readFileSync(moduleUrl, 'utf8');
  assert.match(source, /kind: 'coordinate-plane'/);
  assert.match(source, /kind: 'unit-circle'/);
  assert.doesNotMatch(source, /kind: 'times-table-array'/);
  assert.match(source, /linearGradient/);
  assert.match(source, /style=\{\{ color: visual\.accent \}\}/);
});

test('stage plots keep the linear label clear and draw the exact trig value as geometry', () => {
  const source = readFileSync(moduleUrl, 'utf8');

  assert.match(source, /d="M 30 72 L 142 18"/);
  assert.match(source, /<rect x="104" y="5" width="51" height="13"/);
  assert.doesNotMatch(source, />sin 60° = √3\/2<\/motion\.text>/);
  assert.match(source, /<text x="96" y="43"[^>]*>60°<\/text>/);
  assert.match(source, /M 76 88 L 80 93 L 85 81 L 100 81/);
  assert.match(source, /<text x="104" y="93"[^>]*>\/2<\/text>/);
});

test('section orientation labels use the accessible dark-gold text token', () => {
  const source = readFileSync(moduleUrl, 'utf8');

  assert.match(source, /text-\[#8a6110\]">For parents<\/p>/);
  assert.match(source, /text-\[#8a6110\]">Your child&apos;s journey<\/p>/);
});

test('aligns the parent introduction from the top with a tighter opening rhythm', () => {
  const source = readFileSync(moduleUrl, 'utf8');
  const parentSection = source.slice(source.indexOf('id="parent-concerns"'), source.indexOf('<div className="relative mt-12">'));

  assert.match(parentSection, /pt-14/);
  assert.match(parentSection, /lg:pt-16/);
  assert.match(parentSection, /lg:items-start/);
  assert.doesNotMatch(parentSection, /lg:items-end/);
});

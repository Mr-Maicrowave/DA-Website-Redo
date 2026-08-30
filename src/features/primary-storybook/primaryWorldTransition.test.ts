import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const pageUrl = new URL('../../pages/programs/PrimarySchool.tsx', import.meta.url);
const transitionUrl = new URL('./PrimaryWorldTransition.tsx', import.meta.url);
const transitionCssUrl = new URL('./primary-world-transition.css', import.meta.url);

test('the retired world transition remains available without rendering on the Primary page', () => {
  assert.equal(existsSync(transitionUrl), true, 'PrimaryWorldTransition must exist');
  const page = readFileSync(pageUrl, 'utf8');
  const transition = readFileSync(transitionUrl, 'utf8');

  assert.doesNotMatch(page, /<PrimaryWorldTransition/);
  assert.doesNotMatch(page, /<PrimaryLandscapeJourney/);
  assert.match(transition, /className="primary-world-transition"/);
  assert.doesNotMatch(transition, /<section/);
});

test('the transition keeps decorative motion non-interactive and reduced-motion safe', () => {
  const transition = readFileSync(transitionUrl, 'utf8');
  const styles = readFileSync(transitionCssUrl, 'utf8');

  assert.match(transition, /prefers-reduced-motion/);
  assert.match(transition, /context\.revert\(\)/);
  assert.match(styles, /pointer-events:\s*none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /margin-top:\s*clamp\(-140px/);
});

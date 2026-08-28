import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pageUrl = new URL('./PrimarySchool.tsx', import.meta.url);
const heroAssetUrl = new URL('../../../public/primary-reference/hero/primary-school-watercolor-viewport.webp', import.meta.url);

test('Primary School opens with the supplied landscape and restrained Phase 1 ambient world', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.equal(existsSync(fileURLToPath(heroAssetUrl)), true, 'the supplied landscape must be stored in the project');
  assert.match(source, /primary-school-watercolor-viewport\.webp/);
  assert.match(source, /Where little steps become big ones\.|Where little steps<br \/>become big ones\./);
  assert.match(source, /Building confidence, curiosity and strong foundations from Years 1–6\./);
  assert.match(source, /Explore their journey/);
  assert.match(source, /href="#primary-page-content"/);
  assert.match(source, /ps-hero__clouds/);
  assert.match(source, /ps-hero__sunlight/);
  assert.match(source, /ps-hero__wind--foreground/);
  assert.match(source, /ps-hero__wind--door/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /cancelAnimationFrame/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /min-height:100svh/);
  assert.match(source, /\.ps-hero__background img\{[^}]*object-fit:cover/);
  assert.doesNotMatch(source, /\.ps-hero__background img\{[^}]*object-fit:contain/);
  assert.doesNotMatch(source, /PrimaryWorldTransition|PrimaryLandscapeJourney/);
  assert.doesNotMatch(source, /petal|particle/i);
});

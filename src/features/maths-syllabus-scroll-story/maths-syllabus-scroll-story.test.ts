import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const componentUrl = new URL('./MathsSyllabusScrollStory.tsx', import.meta.url);
const stylesUrl = new URL('./maths-syllabus-scroll-story.css', import.meta.url);
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('tower story uses approved ball-free assets and exact logo', () => {
  const base = resolve(process.cwd(), 'public/images/maths-tower-story');
  for (const name of ['tower-master.webp', 'tower-poster.webp', 'da-logo-full-exact.png']) {
    assert.equal(existsSync(resolve(base, name)), true, name + ' is missing');
  }
});

test('tower scene has rear-ball-front layers and no video scrubber', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /maths-tower-story__rear/);
  assert.match(source, /maths-tower-story__ball/);
  assert.match(source, /maths-tower-story__front-mask/);
  assert.match(source, /maths-tower-story__logo/);
  assert.doesNotMatch(source, /<video|videoRef|currentTime|curve-to-area-scrub/);
});

test('teaching copy stays semantic and the exact logo is announced', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /aria-labelledby="maths-syllabus-story-heading"/);
  assert.match(source, /MATHS_TOWER_COPY_GROUPS\.map/);
  assert.match(source, /<article/);
  assert.match(source, /alt="DA Tuition"/);
});

test('desktop motion writes tower properties and retains one ball layer', () => {
  const source = readFileSync(componentUrl, 'utf8');
  assert.match(source, /function applyTowerProgress\(progress: number\)/);
  assert.match(source, /--tower-y/);
  assert.match(source, /--ball-x/);
  assert.match(source, /--ball-y/);
  assert.match(source, /TOWER_RAIL_POINTS/);
  assert.match(source, /gsap\.matchMedia\(\)/);
  assert.match(source, /media\.revert\(\)/);
  assert.equal((source.match(/maths-tower-story__ball/g) ?? []).length, 1);
});

test('logo formation has a real mask, not opacity alone', () => {
  const css = readFileSync(stylesUrl, 'utf8');
  assert.match(css, /clip-path: circle\(var\(--logo-mask\)/);
  assert.match(css, /--logo-scale/);
});

test('mobile and reduced motion use poster with no ball motion', () => {
  const css = readFileSync(stylesUrl, 'utf8');
  assert.match(css, /@media \(max-width: 767px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /tower-poster\.webp/);
  assert.match(css, /maths-tower-story__ball[\s\S]*display: none/);
});

test('story remains before HSC pathway map', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  assert.ok(source.indexOf('<MathsSyllabusScrollStory />') < source.indexOf('<HscMathsPathway />'));
});

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

import { TOWER_CHAPTERS } from './maths-tower-scene-data.ts';

const componentUrl = new URL('./MathsSyllabusScrollStory.tsx', import.meta.url);
const stylesUrl = new URL('./maths-syllabus-scroll-story.css', import.meta.url);
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

const componentSource = readFileSync(componentUrl, 'utf8');
const stylesSource = readFileSync(stylesUrl, 'utf8');

test('story uses the static poster fallback and exact DA Tuition logo assets', () => {
  const base = resolve(process.cwd(), 'public/images/maths-tower-story');
  for (const name of ['tower-poster.webp', 'da-logo-full-exact.png']) {
    assert.equal(existsSync(resolve(base, name)), true, `${name} is missing`);
  }

  assert.match(componentSource, /src="\/images\/maths-tower-story\/tower-poster\.webp"/);
  assert.match(componentSource, /src="\/images\/maths-tower-story\/da-logo-full-exact\.png"/);
});

test('desktop mounts exactly one progress-driven 3D tower without raster masks or a CSS ball', () => {
  assert.match(componentSource, /import \{ MathsTowerScene \} from '.\/MathsTowerScene'/);
  assert.equal((componentSource.match(/<MathsTowerScene\b/g) ?? []).length, 1);
  assert.match(componentSource, /<MathsTowerScene[\s\S]*?progress=\{progress\}/);
  assert.doesNotMatch(componentSource, /<video|currentTime/);
  assert.doesNotMatch(componentSource, /maths-tower-story__rear|maths-tower-story__front-mask/);
  assert.doesNotMatch(componentSource, /maths-tower-story__ball|--ball-visibility/);
  assert.doesNotMatch(stylesSource, /maths-tower-story__ball|--ball-visibility/);
});

test('ScrollTrigger owns normalised React progress and retains matchMedia cleanup', () => {
  assert.match(componentSource, /const \[progress, setProgress\] = useState\(0\)/);
  assert.match(componentSource, /onUpdate: \(trigger\) => setProgress\(trigger\.progress\)/);
  assert.match(componentSource, /gsap\.matchMedia\(\)/);
  assert.match(componentSource, /media\.revert\(\)/);
});

test('all six approved chapters remain live semantic articles', () => {
  assert.equal(TOWER_CHAPTERS.length, 6);
  assert.match(componentSource, /TOWER_CHAPTERS\.map/);
  assert.match(componentSource, /<article/);
  assert.match(componentSource, /data-tower-copy=\{chapter\.id\}/);
  assert.match(componentSource, /aria-labelledby="maths-syllabus-story-heading"/);

  const standard = TOWER_CHAPTERS.find(({ id }) => id === 'standard');
  assert.match(standard?.teaching ?? '', /separate senior pathway/i);
  assert.match(TOWER_CHAPTERS.find(({ id }) => id === 'extension-1')?.teaching ?? '', /alongside Advanced/i);
  assert.match(TOWER_CHAPTERS.find(({ id }) => id === 'extension-2')?.teaching ?? '', /Advanced and Extension 1/i);
});

test('mobile, reduced-motion and WebGL failure paths remove Canvas and expose the poster cards', () => {
  assert.match(componentSource, /const canRenderTower = hasTowerViewport && webglReady && !prefersReducedMotion && !webglFailed/);
  assert.match(componentSource, /onContextFailure=\{handleContextFailure\}/);
  assert.match(componentSource, /\{canRenderTower \? \([\s\S]*?<MathsTowerScene[\s\S]*?\) : \([\s\S]*?tower-poster\.webp/);
  assert.match(componentSource, /data-fallback=\{!canRenderTower\}/);
  assert.match(stylesSource, /\[data-fallback='true'\][\s\S]*?maths-tower-story__copy/);
  assert.match(stylesSource, /@media \(max-width: 767px\)/);
  assert.match(stylesSource, /@media \(prefers-reduced-motion: reduce\)/);
});

test('WebGL is preflighted and initial Canvas errors fall through to the poster', () => {
  assert.match(componentSource, /function canCreateWebGLContext\(\): boolean/);
  assert.match(componentSource, /document\.createElement\('canvas'\)/);
  assert.match(componentSource, /getContext\('webgl2'/);
  assert.match(componentSource, /catch \{/);
  assert.match(componentSource, /setWebglReady\(towerQuery\.matches && canCreateWebGLContext\(\)\)/);
  assert.match(
    componentSource,
    /<TowerErrorBoundary onError=\{handleContextFailure\}>[\s\S]*?<MathsTowerScene[\s\S]*?<\/TowerErrorBoundary>/,
  );
});

test('raw ending progress clears content by 0.985 and the GSAP clock remains normalised to one', () => {
  assert.match(componentSource, /'--content-opacity': ending\.towerOpacity/);
  assert.match(componentSource, /timeline\.to\(\{ progress: 0 \}, \{ progress: 1, duration: 1 \}, 0\)/);
  assert.doesNotMatch(componentSource, /timeline\.to\(content/);
  assert.match(stylesSource, /\.maths-tower-story__content[\s\S]*?opacity: var\(--content-opacity\)/);
  assert.match(stylesSource, /\[data-fallback='true'\][\s\S]*?maths-tower-story__content[\s\S]*?opacity: 1 !important/);
});

test('short or zoomed desktop viewports use the normal-flow fallback', () => {
  assert.match(
    componentSource,
    /const TOWER_MEDIA_QUERY = '\(min-width: 768px\) and \(min-height: 640px\)'/,
  );
  assert.match(componentSource, /window\.matchMedia\(TOWER_MEDIA_QUERY\)/);
  assert.match(stylesSource, /@media \(min-width: 768px\) and \(min-height: 640px\)/);
  assert.match(stylesSource, /\[data-fallback='true'\][\s\S]*?overflow: visible/);
});

test('tower fades to cream before the logo blooms from the central landing', () => {
  assert.match(componentSource, /const ending = getEndingProgress\(progress\)/);
  assert.match(componentSource, /'--tower-opacity': ending\.towerOpacity/);
  assert.match(componentSource, /'--logo-progress': ending\.logoProgress/);
  assert.match(stylesSource, /\.maths-tower-story__scene[\s\S]*?opacity: var\(--tower-opacity\)/);
  assert.match(stylesSource, /\.maths-tower-story__logo[\s\S]*?clip-path: circle\(var\(--logo-mask\)/);
  assert.match(stylesSource, /\.maths-tower-story__logo[\s\S]*?scale\(var\(--logo-scale\)\)/);
  assert.match(stylesSource, /\.maths-tower-story__ending-bloom/);
  assert.match(stylesSource, /\.maths-tower-story__ending-ripple/);
});

test('story remains before the HSC pathway map', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  assert.ok(source.indexOf('<MathsSyllabusScrollStory />') < source.indexOf('<HscMathsPathway />'));
});

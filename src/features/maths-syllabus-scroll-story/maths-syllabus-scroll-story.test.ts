import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { MATHS_SYLLABUS_STORY_BEATS } from './maths-syllabus-scroll-story-data.ts';

const componentUrl = new URL('./MathsSyllabusScrollStory.tsx', import.meta.url);
const stylesUrl = new URL('./maths-syllabus-scroll-story.css', import.meta.url);
const mathematicsUrl = new URL('../../pages/subjects/Mathematics.tsx', import.meta.url);

test('cinematic story precedes the practical HSC pathway map', () => {
  const source = readFileSync(mathematicsUrl, 'utf8');
  const storyIndex = source.indexOf('<MathsSyllabusScrollStory />');
  const pathwayIndex = source.indexOf('<HscMathsPathway />');

  assert.match(source, /import \{ MathsSyllabusScrollStory \} from '@\/features\/maths-syllabus-scroll-story\/MathsSyllabusScrollStory'/);
  assert.notEqual(storyIndex, -1, 'MathsSyllabusScrollStory is not mounted');
  assert.notEqual(pathwayIndex, -1, 'HscMathsPathway is not mounted');
  assert.ok(storyIndex < pathwayIndex);
});

test('every beat has an optimised public art plate', () => {
  for (const beat of MATHS_SYLLABUS_STORY_BEATS) {
    const file = resolve(process.cwd(), 'public/images/maths-syllabus-scroll-story/' + beat.plate + '.webp');
    assert.equal(existsSync(file), true, beat.plate + ' is missing');
  }
});

test('story uses semantic labels and decorative plates', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /<section[^>]+aria-labelledby="maths-syllabus-story-heading"/);
  assert.match(source, /<h2 id="maths-syllabus-story-heading"/);
  assert.match(source, /alt=""/);
  assert.match(source, /MATHS_SYLLABUS_STORY_BEATS\.map/);
});

test('story has the restrained point, line, tangent, integral and vector overlays', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /className="maths-syllabus-story__point"/);
  assert.match(source, /className="maths-syllabus-story__line"/);
  assert.match(source, /className="maths-syllabus-story__tangent"/);
  assert.match(source, /className="maths-syllabus-story__integral"/);
  assert.match(source, /className="maths-syllabus-story__vector"/);
  assert.doesNotMatch(source, /<circle[^>]+(?:cx|cy)=/);
});

test('point animation preserves the curve start as a non-animated base transform', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(
    source,
    /<g transform="translate\(102 646\)">\s*<g className="maths-syllabus-story__point-group">/,
  );
  assert.doesNotMatch(
    source,
    /<g className="maths-syllabus-story__point-group"[^>]+transform=/,
  );
});

test('mobile and reduced motion show one completed visual before readable explanations', () => {
  const componentSource = readFileSync(componentUrl, 'utf8');
  const source = readFileSync(stylesUrl, 'utf8');
  const reducedMotionStyles = source.split('@media (prefers-reduced-motion: reduce)')[1]
    .split('@media (max-width: 767px)')[0];
  const mobileStyles = source.split('@media (max-width: 767px)')[1];
  const visualIndex = componentSource.indexOf('className="maths-syllabus-story__visual"');
  const headingIndex = componentSource.indexOf('id="maths-syllabus-story-heading"');
  const beatsIndex = componentSource.indexOf('className="maths-syllabus-story__beats"');

  assert.notEqual(visualIndex, -1, 'representative visual wrapper is missing');
  assert.notEqual(headingIndex, -1, 'story heading is missing');
  assert.notEqual(beatsIndex, -1, 'story explanations are missing');
  assert.ok(visualIndex < headingIndex && headingIndex < beatsIndex);

  for (const staticStyles of [reducedMotionStyles, mobileStyles]) {
    assert.match(staticStyles, /\.maths-syllabus-story__visual[\s\S]*?position: relative;[\s\S]*?aspect-ratio: 16 \/ 9;/);
    assert.match(staticStyles, /\.maths-syllabus-story__plate[\s\S]*?display: none;/);
    assert.match(staticStyles, /\.maths-syllabus-story__plate\[data-plate='explore'\][\s\S]*?display: block;/);
    assert.doesNotMatch(staticStyles, /\.maths-syllabus-story__overlay[\s\S]*?display: none;/);
  }
});

test('desktop GSAP work is scoped and reverted while reduced motion skips it', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /import \{ gsap \} from 'gsap'/);
  assert.match(source, /import \{ ScrollTrigger \} from 'gsap\/ScrollTrigger'/);
  assert.match(source, /gsap\.context/);
  assert.match(source, /context\.revert\(\)/);
  assert.match(source, /gsap\.matchMedia\(\)/);
  assert.match(source, /media\.add\(DESKTOP_MEDIA_QUERY/);
  assert.match(source, /media\.revert\(\)/);
  assert.match(source, /if \(prefersReducedMotion\) return/);
  assert.match(source, /pin: true/);
  assert.match(source, /scrub: true/);
});

test('mobile and reduced motion keep the story static and fully visible', () => {
  const source = readFileSync(stylesUrl, 'utf8');
  const reducedMotionStyles = source.split('@media (prefers-reduced-motion: reduce)')[1]
    .split('@media (max-width: 767px)')[0];
  const mobileStyles = source.split('@media (max-width: 767px)')[1];

  assert.match(reducedMotionStyles, /\.maths-syllabus-story__sticky[\s\S]*?position: static;[\s\S]*?min-height: 0;/);
  assert.match(reducedMotionStyles, /\.maths-syllabus-story__beat[\s\S]*?opacity: 1;[\s\S]*?transform: none;/);
  assert.match(reducedMotionStyles, /\.maths-syllabus-story__line[\s\S]*?stroke-dashoffset: 0;/);
  assert.match(reducedMotionStyles, /\.maths-syllabus-story__line--glow[\s\S]*?filter: none;/);
  assert.match(mobileStyles, /\.maths-syllabus-story__sticky[\s\S]*?position: static;[\s\S]*?min-height: 0;[\s\S]*?aspect-ratio: auto;/);
  assert.match(mobileStyles, /\.maths-syllabus-story__beat[\s\S]*?position: relative;[\s\S]*?opacity: 1;[\s\S]*?transform: none;/);
});

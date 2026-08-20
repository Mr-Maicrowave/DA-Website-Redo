import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { MATHS_SYLLABUS_STORY_BEATS } from './maths-syllabus-scroll-story-data.ts';

const componentUrl = new URL('./MathsSyllabusScrollStory.tsx', import.meta.url);
const stylesUrl = new URL('./maths-syllabus-scroll-story.css', import.meta.url);

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

test('story has the live point, glowing line, tangent and integral overlays', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /className="maths-syllabus-story__point"/);
  assert.match(source, /className="maths-syllabus-story__line"/);
  assert.match(source, /className="maths-syllabus-story__tangent"/);
  assert.match(source, /className="maths-syllabus-story__integral"/);
});

test('reduced motion returns plates and beats to normal flow', () => {
  const source = readFileSync(stylesUrl, 'utf8');
  const reducedMotionStyles = source.split('@media (prefers-reduced-motion: reduce)')[1]
    .split('@media (max-width: 767px)')[0];

  assert.match(reducedMotionStyles, /\.maths-syllabus-story__plates[\s\S]*?display: grid;/);
  assert.match(reducedMotionStyles, /\.maths-syllabus-story__plate[\s\S]*?position: relative;/);
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const motion = await readFile(new URL('./useWhyDAMotion.ts', import.meta.url), 'utf8').catch(() => '');
const page = await readFile(new URL('./WhyChooseDA.tsx', import.meta.url), 'utf8');

test('scopes and cleans up the Why DA GSAP choreography', () => {
  assert.match(motion, /gsap\.registerPlugin\(ScrollTrigger\)/);
  assert.match(motion, /gsap\.context\(/);
  assert.match(motion, /context\.revert\(\)/);
  assert.match(motion, /media\.revert\(\)/);
});

test('provides reduced-motion and fine-pointer-only interaction paths', () => {
  assert.match(motion, /prefers-reduced-motion:\s*reduce/);
  assert.match(motion, /hover:\s*hover/);
  assert.match(motion, /pointer:\s*fine/);
  assert.match(motion, /requestAnimationFrame/);
});

test('choreographs discovery into understanding and personalisation', () => {
  assert.match(page, /data-motion="hero-line"/);
  assert.match(page, /data-motion="hero-student"/);
  assert.match(page, /data-motion="observation"/);
  assert.match(page, /data-motion="gallery-card"/);
  assert.match(page, /data-motion="path-item"/);
  assert.match(page, /data-motion="proof-value"/);
  assert.match(page, /className="why-da-journey-thread"/);
});

test('pins and scrubs the desktop gallery while preserving mobile and reduced-motion paths', () => {
  assert.match(motion, /data-testid="why-da-know-gallery"/);
  assert.match(motion, /gallery-track/);
  assert.match(motion, /pin:\s*true/);
  assert.match(motion, /invalidateOnRefresh:\s*true/);
  assert.match(motion, /gallery-image/);
  assert.match(motion, /gallery-progress/);
  assert.match(motion, /ResizeObserver/);
});

test('counts proof metrics once and uses the requested personalisation sequence', () => {
  assert.match(motion, /once:\s*true/);
  assert.match(motion, /LEVEL[\s\S]*PACE[\s\S]*MATERIALS[\s\S]*CLASS FORMAT[\s\S]*TUTOR[\s\S]*LEARNING PLAN[\s\S]*GOALS[\s\S]*FOUNDATION/);
});

test('choreographs the three continuation chapters', () => {
  assert.match(page, /data-motion="teach-step"/);
  assert.match(page, /data-motion="lesson-board"/);
  assert.match(page, /data-motion="care-value"/);
  assert.match(page, /data-motion="connection-panel"/);
  assert.match(motion, /why-da-teach/);
  assert.match(motion, /why-da-care/);
  assert.match(motion, /why-da-connected/);
});

test('reveals growth milestones, results, testimonials, and the closing invitation', () => {
  assert.match(page, /data-motion="growth-milestone"/);
  assert.match(page, /data-motion="growth-quality"/);
  assert.match(page, /data-motion="result-card"/);
  assert.match(page, /data-motion="testimonial"/);
  assert.match(page, /data-motion="closing-cta"/);
  assert.match(motion, /why-da-grow/);
  assert.match(motion, /why-da-achieve/);
});

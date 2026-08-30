import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const motion = await readFile(new URL('./useWhyDAMotion.ts', import.meta.url), 'utf8').catch(() => '');
const page = await readFile(new URL('./WhyChooseDA.tsx', import.meta.url), 'utf8');
const knowSection = await readFile(new URL('../components/why-da/WeKnowYouSection.tsx', import.meta.url), 'utf8').catch(() => '');

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
  assert.match(page, /data-motion="hero-background-slice"/);
  assert.match(page, /data-motion="hero-label"/);
  assert.match(knowSection, /data-motion="know-observation"/);
  assert.match(page, /data-motion="path-item"/);
  assert.match(page, /data-motion="proof-value"/);
  assert.match(page, /className="why-da-journey-thread"/);
});

test('assembles the cinematic hero slices into one photograph before section 01', () => {
  assert.match(page, /data-motion="hero-background-slice"/);
  assert.match(motion, /hero__background-slice--top/);
  assert.match(motion, /hero__background-slice--bottom/);
  assert.match(motion, /heroAssembly/);
  assert.match(motion, /pin:\s*true/);
  assert.match(motion, /hero-statement/);
  assert.match(motion, /matchMedia\('\(max-width:\s*767px\)'\)/);
});

test('animates only background slices and never transforms the protected tutor layer', () => {
  const heroMotion = motion.slice(motion.indexOf('const heroSlices'), motion.indexOf('const knowTimeline'));

  assert.match(page, /data-testid="why-da-tutor-layer"/);
  assert.match(page, /data-motion="hero-background-slice"/);
  assert.match(heroMotion, /hero-background-slice/);
  assert.doesNotMatch(heroMotion, /hero-tutor/);
  assert.doesNotMatch(heroMotion, /clipPath:/);
});

test('reveals the complete We Know You composition without pinning or gating content', () => {
  const knowMotion = motion.slice(motion.indexOf('const knowTimeline'), motion.indexOf('const pathItems'));

  assert.match(knowSection, /data-motion="know-intro"/);
  assert.match(knowSection, /data-motion="know-observation"/);
  assert.match(knowSection, /data-motion="know-parent"/);
  assert.match(motion, /know-observation/);
  assert.doesNotMatch(knowMotion, /pin:\s*true|scrub:|gallery|ResizeObserver|scrollIntoView/);
});

test('treats the four observation rows as connected cinematic shots', () => {
  assert.match(knowSection, /data-motion="know-film"/);
  assert.match(knowSection, /data-motion="know-photo"/);
  assert.match(knowSection, /data-motion="know-image"/);
  assert.match(knowSection, /data-motion="know-row-copy"/);
  assert.match(knowSection, /data-motion="know-timeline-point"/);
  assert.match(motion, /ambientShots/);
  assert.match(motion, /sine\.inOut/);
  assert.match(motion, /clipPath:\s*'inset\(0 3% 0 3%\)'/);
  assert.match(motion, /brightness\(\.82\)/);
  assert.doesNotMatch(motion.slice(motion.indexOf('const knowTimeline'), motion.indexOf('const pathItems')), /pin:\s*true/);
});

test('creates a still listening beat and a gold-line handoff into personalisation', () => {
  assert.match(knowSection, /data-motion="know-parent-title-mask"/);
  assert.match(knowSection, /data-motion="know-parent-title"/);
  assert.match(knowSection, /data-motion="know-listen-line"/);
  assert.match(motion, /ambientFilm/);
  assert.match(motion, /know-parent-title/);
  assert.match(motion, /know-listen-line/);
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

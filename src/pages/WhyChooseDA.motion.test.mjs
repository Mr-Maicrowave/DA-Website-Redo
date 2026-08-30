import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const motion = await readFile(new URL('./useWhyDAMotion.ts', import.meta.url), 'utf8').catch(() => '');
const page = await readFile(new URL('./WhyChooseDA.tsx', import.meta.url), 'utf8');
const knowSection = await readFile(new URL('../components/why-da/WeKnowYouSection.tsx', import.meta.url), 'utf8').catch(() => '');
const personaliseSection = await readFile(new URL('../components/why-da/PersonaliseFilmSection.tsx', import.meta.url), 'utf8').catch(() => '');
const personalisePhotos = await readFile(new URL('../components/why-da/personalisationPhotos.ts', import.meta.url), 'utf8').catch(() => '');
const careSection = await readFile(new URL('../components/why-da/WeCareFilmSection.tsx', import.meta.url), 'utf8').catch(() => '');

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
  assert.match(personaliseSection, /data-motion="personalise-film-strip"/);
  assert.doesNotMatch(page, /data-motion="proof-value"/);
  assert.match(personaliseSection, /personalise-hero-film/);
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
  const knowMotion = motion.slice(motion.indexOf('const knowTimeline'), motion.indexOf('const personalisationTimeline'));

  assert.match(knowSection, /data-motion="know-intro"/);
  assert.match(knowSection, /data-motion="know-observation"/);
  assert.match(knowSection, /data-motion="know-parent"/);
  assert.match(motion, /know-observation/);
  assert.doesNotMatch(knowMotion, /pin:\s*true|scrub:|gallery|ResizeObserver|scrollIntoView/);
});

test('treats the four editorial stories as linked cinematic shots', () => {
  assert.match(knowSection, /data-motion="know-film"/);
  assert.match(knowSection, /data-motion="know-photo"/);
  assert.match(knowSection, /data-motion="know-image"/);
  assert.match(knowSection, /data-motion="know-row-copy"/);
  assert.match(knowSection, /data-motion="know-timeline-point"/);
  assert.match(motion, /revealMasks/);
  assert.match(motion, /gsap\.quickTo\(image/);
  assert.match(motion, /Math\.max\(-4/);
  assert.match(motion, /clipPath/);
  const editorialMotion = motion.slice(motion.indexOf('const revealMasks'), motion.indexOf('know-parent'));
  assert.doesNotMatch(editorialMotion, /ambientShots|repeat:\s*-1/);
  assert.doesNotMatch(motion.slice(motion.indexOf('const knowTimeline'), motion.indexOf('const personalisationTimeline')), /pin:\s*true/);
});

test('creates a still listening beat and a gold-line handoff into personalisation', () => {
  assert.match(knowSection, /data-motion="know-parent-title-mask"/);
  assert.match(knowSection, /data-motion="know-parent-title"/);
  assert.match(knowSection, /data-motion="know-listen-line"/);
  assert.match(motion, /know-parent-title/);
  assert.match(motion, /know-listen-line/);
});

test('counts proof metrics once and reveals the reusable personalisation film', () => {
  assert.match(motion, /once:\s*true/);
  assert.match(personalisePhotos, /RIGHT LEVEL[\s\S]*RIGHT PACE[\s\S]*RIGHT SUPPORT[\s\S]*RIGHT GOALS/);
  assert.match(motion, /personalisationTimeline[\s\S]*personalise-hero-film[\s\S]*personalise-film-strip/);
});

test('choreographs the remaining continuation chapters without legacy teaching motion', () => {
  assert.doesNotMatch(page, /data-motion="teach-step"|data-motion="lesson-board"/);
  assert.match(careSection, /data-motion="care-film"/);
  assert.doesNotMatch(page, /data-motion="connection-panel"/);
  assert.doesNotMatch(motion, /teach-step|teach-photo|lesson-board/);
  assert.match(motion, /why-da-care/);
  assert.doesNotMatch(motion, /connection-panel|why-da-connected__dashboard/);
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

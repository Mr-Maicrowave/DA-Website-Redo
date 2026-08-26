import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const component = readFileSync(new URL('./HSCVisionStory.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('./hsc-vision-story.css', import.meta.url), 'utf8') + readFileSync(new URL('./hsc-vision-continuity.css', import.meta.url), 'utf8');

test('follows the nine-part editorial storyboard and uses Ben once', () => {
  for (const id of ['year-shift', 'student', 'futures', 'parents', 'landscape', 'doors', 'plan', 'support', 'roadmap']) {
    assert.match(component, new RegExp(`id="hsc-vision-${id}"`));
  }
  assert.equal((component.match(/hsc-student-ben\.png/g) ?? []).length, 1);
  assert.doesNotMatch(component, /hfs-journey-network|gold-journey-line/);
});

test('uses the complete HSC Vision asset pack', () => {
  for (const asset of ['hsc-watercolour-atmosphere.png', 'hsc-future-collage.png', 'hsc-parent-reassurance.png', 'hsc-future-landscape.png', 'hsc-opportunity-doors.png', 'hsc-plan-notebook.png', 'hsc-final-horizon.png']) {
    assert.match(component, new RegExp(asset.replace('.', '\\.')));
  }
});

test('limits cinematic motion to the wash and door transitions', () => {
  assert.match(component, /hscv-wash-mask/);
  assert.match(component, /hscv-door-stage/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
});

test('connects the two cinematic transitions with sticky camera movement and parallax', () => {
  assert.match(component, /hscv-door-light/);
  assert.match(component, /scale:\s*3\.4/);
  assert.match(component, /hscv-landscape.*yPercent/s);
  assert.match(component, /hscv-roadmap.*yPercent/s);
  assert.match(css, /\.hscv-door-stage\{position:sticky/);
  assert.match(css, /\.hscv-doors\{[^}]*min-height:160vh/);
});

test('carries a visual element through every scene handoff', () => {
  for (const layer of ['hscv-shared-watercolour', 'hscv-architecture-frame', 'hscv-door-light', 'hscv-ink-wash', 'hscv-gold-carry']) {
    assert.match(component, new RegExp(layer));
  }
  assert.match(component, /continuity/);
  assert.match(css, /\.hscv-year,.hscv-student/);
  assert.match(css, /\.hscv-futures,.hscv-parents/);
  assert.match(css, /\.hscv-roadmap\{[^}]*background:#071b34/);
});

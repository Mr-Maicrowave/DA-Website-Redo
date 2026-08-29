import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pageUrl = new URL('./Science.tsx', import.meta.url);

test('renders the Programs pathway as a macro-to-micro scroll story before HSC lenses', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /<SciencePrograms\s*\/>/);
  assert.match(source, /className="science-scale-story[^\"]*"/);
  assert.match(source, /className="science-macro-stage[^\"]*"/);
  assert.match(source, /className="science-scale-caption[^\"]*"/);
  assert.match(source, /fallen-apple-impact-v3\.png/);
  assert.match(source, /apple-flesh-macro-v3\.png/);
  assert.match(source, /apple-tissue-micrograph-v3\.png/);
  assert.match(source, /molecular-material-v3\.png/);
  assert.match(source, /wave-field-v3\.png/);
  assert.match(source, /science-eyepiece/);
  assert.match(source, /science-seam-bloom/);
  assert.match(source, /newton-scroll-apple/);
  assert.match(source, /overflow-hidden rounded-full/);
  assert.match(source, /const scaleProgress = useTransform/);
  assert.match(source, /style=\{\{ left: scaleProgress \}\}/);
  assert.match(source, /Science at every scale/);
  assert.match(source, /HSC BIOLOGY · YEARS 11–12/);
  assert.match(source, /HSC CHEMISTRY · YEARS 11–12/);
  assert.match(source, /HSC PHYSICS · YEARS 11–12/);
  assert.match(source, /HSC SPECIALISATION/);
  assert.match(source, /Scale readout/);
  assert.match(source, /Current specimen/);
  assert.match(source, /Macro · impact/);
  assert.match(source, /Fields &amp; waves/);
  assert.match(source, /science-focus-target/);
  assert.doesNotMatch(source, /orchardHandoffOpacity|orchardHandoffFilter|science-handoff-orchard/);
  assert.match(source, /Optical view/);
  assert.match(source, /Physical model/);
  assert.match(source, /className="science-programs__hsc[^\"]*"/);
  assert.match(source, /prefers-reduced-motion: reduce/);
});

test('keeps the tree fall and microscope journey on one continuous scroll handoff', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /className="newton-gravity science-journey"/);
  assert.match(source, /storyProgress/);
  assert.match(source, /science-story-apple/);
  assert.doesNotMatch(source, /science-story-impact/);
  assert.match(source, /science-lens-reveal/);
});

test('grows the microscope aperture from the apple landing point before centring it', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /const lensEntryScale = useTransform/);
  assert.match(source, /const lensEntryX = useTransform/);
  assert.match(source, /const lensEntryY = useTransform/);
  assert.match(source, /const lensBackdropOpacity = useTransform/);
  assert.match(source, /className=\s*"[^"]*science-lens-entry/);
  assert.match(source, /className="science-lens-backdrop/);
  assert.match(source, /document\.querySelector<HTMLElement>\('\.science-story-apple'\)/);
  assert.match(source, /getBoundingClientRect\(\)/);
  assert.match(source, /const \[handoffGeometry, setHandoffGeometry\]/);
  assert.match(source, /transformOrigin: '50% 50%'/);
  assert.match(source, /handoffGeometry\?\.x/);
  assert.match(source, /handoffGeometry\?\.y/);
  assert.doesNotMatch(source, /science-entry-bloom/);
  assert.match(source, /lg:-mt-\[100svh\]/);
  assert.doesNotMatch(source, /border-y border-\[#071629\]\/20/);
  assert.match(source, /bg-\[radial-gradient\(circle_at_50%_42%/);
});

test('pushes each specimen through its own focal point between scale stages', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /const appleY = useTransform/);
  assert.match(source, /const macroY = useTransform/);
  assert.match(source, /\[0, \.25, \.31\]/);
  assert.match(source, /\[1, 1, 2\.35\]/);
  assert.match(source, /\[1\.28, 1\.04, 1\.08, 2\.4\]/);
  assert.match(source, /overflow-hidden rounded-full/);
});

test('uses viewport coordinates for the full-bleed stage and its supporting rails', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /science-scale-story__intro/);
  assert.match(source, /science-scale-story__readout/);
  assert.match(source, /left-1\/2 h-\[580vh\] w-screen -translate-x-1\/2/);
  assert.doesNotMatch(source, /lg:-ml-8/);
  assert.match(source, /left-\[clamp\(3rem,8vw,10rem\)\] top-\[calc\(50%-12rem\)\]/);
  assert.match(source, /right-\[clamp\(3rem,8vw,10rem\)\]/);
  assert.match(source, /w-\[min\(80rem,calc\(100vw-3rem\)\)\] -translate-x-1\/2/);
  assert.match(source, /bottom-\[clamp\(1\.5rem,4vh,3rem\)\]/);
  assert.match(source, /top-\[calc\(50%-12rem\)\]/);
  assert.match(source, /science-scale-story__readout relative mt-10 h-32/);
});

test('keeps the course context editorial, staged, and specific to each programme', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /Foundation Science · Years 7–10/);
  assert.match(source, /Investigation · Problem solving · Exam skills/);
  assert.match(source, /Cellular processes · Genetics · Ecosystems/);
  assert.match(source, /Structure &amp; bonding · Reactions · Quantitative chemistry/);
  assert.match(source, /Motion &amp; forces · Waves &amp; energy · Fields/);
});

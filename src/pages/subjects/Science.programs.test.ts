import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pageUrl = new URL('./Science.tsx', import.meta.url);

test('renders the Programs pathway as a five-stage scientific thinking journey', () => {
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
  assert.match(source, /const SCIENCE_SCALE_CHAPTERS =/);
  assert.match(source, /mode: 'Observe'/);
  assert.match(source, /mode: 'Explain'/);
  assert.match(source, /mode: 'Connect'/);
  assert.match(source, /mode: 'Model'/);
  assert.match(source, /mode: 'Predict'/);
  assert.match(source, /Observe before you explain\./);
  assert.match(source, /From explanation to prediction\./);
  assert.match(source, /science-scale-caption__result/);
  assert.match(source, /science-scale-reduced/);
  assert.doesNotMatch(source, /Scale readout/);
  assert.doesNotMatch(source, /Foundation Science · Years 7–10/);
  assert.match(source, /Fields &amp; waves/);
  assert.match(source, /science-focus-target/);
  assert.doesNotMatch(source, /orchardHandoffOpacity|orchardHandoffFilter|science-handoff-orchard/);
  assert.match(source, /Optical view/);
  assert.match(source, /Physical model/);
  assert.doesNotMatch(source, /SCIENCE_LENSES/);
  assert.doesNotMatch(source, /LensStudy/);
  assert.doesNotMatch(source, /science-programs__hsc/);
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

test('begins the scale journey from the already centred orchard lens', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /const lensEntryScale = 1;/);
  assert.match(source, /const lensBackdropOpacity = 1;/);
  assert.match(source, /className=\s*"[^"]*science-lens-entry/);
  assert.match(source, /className="science-lens-backdrop/);
  assert.match(source, /transformOrigin: '50% 50%'/);
  assert.match(source, /-mt-\[100svh\]/);
  assert.match(source, /bg-\[radial-gradient\(circle_at_50%_42%/);
});

test('pushes each specimen through its own focal point between scale stages', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /const appleY = useTransform/);
  assert.match(source, /const macroY = useTransform/);
  assert.match(source, /\[0, \.25, \.30\]/);
  assert.match(source, /\[1, 1\.12, 2\.35\]/);
  assert.match(source, /\[1\.28, 1\.04, 1\.08, 2\.4\]/);
  assert.match(source, /overflow-hidden rounded-full/);
});

test('uses viewport coordinates for the full-bleed stage and readable chapter panels', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /science-scale-story__intro/);
  assert.match(source, /left-1\/2 h-\[580vh\] w-screen -translate-x-1\/2/);
  assert.doesNotMatch(source, /lg:-ml-8/);
  assert.match(source, /science-scale-story__chapter-id/);
  assert.match(source, /right-\[clamp\(3rem,8vw,10rem\)\]/);
  assert.match(source, /xl:w-\[min\(25vw,24rem\)\]/);
  assert.match(source, /w-\[min\(80rem,calc\(100vw-3rem\)\)\] -translate-x-1\/2/);
  assert.match(source, /bottom-\[clamp\(\.25rem,1\.5vh,1rem\)\]/);
  assert.match(source, /text-wrap:balance/);
});

test('keeps the fallen apple visible for the full Impact chapter before revealing the Flesh macro', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /const appleOpacity = useTransform\(scrollYProgress, \[0, \.275, \.29, \.30\], \[1, 1, 0, 0\]\)/);
  assert.match(source, /const macroOpacity = useTransform\(scrollYProgress, \[\.25, \.275, \.29, \.485, \.50, \.52\], \[0, 0, 1, 1, 0, 0\]\)/);
  assert.match(source, /const appleCaptionOpacity = useTransform\(scrollYProgress, \[\.075, \.10, \.27, \.29\]/);
  assert.match(source, /const macroCaptionOpacity = useTransform\(scrollYProgress, \[\.275, \.30, \.49, \.505\]/);
});

test('removes subject-marketing repetition from the thinking journey', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.doesNotMatch(source, /HSC BIOLOGY · YEARS 11–12/);
  assert.doesNotMatch(source, /HSC CHEMISTRY · YEARS 11–12/);
  assert.doesNotMatch(source, /HSC PHYSICS · YEARS 11–12/);
  assert.doesNotMatch(source, /Investigation · Problem solving · Exam skills/);
  assert.doesNotMatch(source, /HSC SPECIALISATION/);
});

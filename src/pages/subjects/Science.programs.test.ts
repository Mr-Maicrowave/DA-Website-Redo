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
  assert.match(source, /1× visible world/);
  assert.match(source, /10,000× field study/);
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
  assert.match(source, /transformOrigin: '78% 72%'/);
  assert.match(source, /\['6vw', '4vw', '0vw'\]/);
  assert.match(source, /\['29vh', '10vh', '0vh'\]/);
});

test('pushes each specimen through its own focal point between scale stages', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /const appleY = useTransform/);
  assert.match(source, /const macroY = useTransform/);
  assert.match(source, /\[1, 1\.03, 2\.35\]/);
  assert.match(source, /\[\.48, 1, 1\.03, 2\.35\]/);
});

test('keeps the desktop scale-story introduction and specimen readout in one centred left rail', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /science-scale-story__intro/);
  assert.match(source, /science-scale-story__readout/);
  assert.match(source, /xl:left-\[calc\(50%-38\.5rem\)\][^\"]*xl:w-64/);
  assert.doesNotMatch(source, /science-scale-story__intro[^\n]*xl:-translate-x-/);
  assert.match(source, /xl:top-\[calc\(50%\+12rem\)\]/);
});

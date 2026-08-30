import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const componentUrl = new URL('./VisualIntro.tsx', import.meta.url);

test('reveals the hero within a shorter scroll distance than the old envelope', () => {
  const source = readFileSync(componentUrl, 'utf8');

  // website-page-audit's homepage audit flagged the old [0, 0.476] envelope for
  // delaying the H1/CTA behind ~1.5 viewport-heights of scroll before anything
  // was visible or interactive.
  assert.match(source, /useTransform\(scrollYProgress, \[0, 0\.22\], \[0, 1\]/);
  assert.doesNotMatch(source, /\[0, 0\.476\]/, 'the old, longer reveal envelope should not still be present');
});

test('keeps heroInteractive scaled to the compressed curtainProgress envelope', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /progress >= 0\.17 && progress < 0\.79/);
});

test('makes the hidden hero genuinely inert, not just aria-hidden, so its focusable CTA cannot be tabbed to while hidden', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /heroUnderlayRef\.current\?\.toggleAttribute\('inert', !heroInteractive\)/);
  assert.match(source, /ref=\{heroUnderlayRef\}/);
});

test('passes the curtain progress into the embedded hero so every reveal reverses with the same scroll timeline', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /cloneElement\(children, \{ introProgress: curtainProgress \}\)/);
});

test('keeps the hero layer sharp and crossfades the curtain during the photo handoff', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /const curtainOpacity = useTransform\(curtainProgress/);
  assert.match(source, /opacity: curtainOpacity/);
  assert.match(source, /heroY = useTransform\(curtainProgress, \[0, 1\], \[0, 0\]\)/);
});

test('gives the opening photographic walls restrained physical depth', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /const leftRotateY = useTransform\(curtainProgress/);
  assert.match(source, /const rightRotateY = useTransform\(curtainProgress/);
  assert.match(source, /transformPerspective: 1400/);
});

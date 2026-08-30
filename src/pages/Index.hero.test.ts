import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const componentUrl = new URL('./Index.tsx', import.meta.url);

test('the homepage hero uses a shared scroll timeline for its ordered visual reveal', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /introProgress\?: MotionValue<number>/);
  assert.match(source, /const revealProgress = introProgress \?\? scrollYProgress/);
  assert.match(source, /hero-title-mask/);
  assert.match(source, /hero-gold-thread/);
  assert.match(source, /const sideOpacity = useTransform\(revealProgress/);
  assert.match(source, /opacity: sideOpacity/);
});

test('keeps the centre clear so the masked headline choreography is the signature moment', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /const titleOneScale = useTransform\(revealProgress/);
  assert.match(source, /const titleTwoTracking = useTransform\(revealProgress/);
  assert.match(source, /hero-title-mask/);
  assert.doesNotMatch(source, /hero-clarity-transform|hero-clarity-lens|3x = 22 − 7|CLAIM\s+EVIDENCE\s+EXPLANATION/);
});

test('the homepage hero exposes verified editorial proof rather than generic feature cards', () => {
  const source = readFileSync(componentUrl, 'utf8');

  assert.match(source, /Established 2005/);
  assert.match(source, /YEARS 7–12/);
  assert.match(source, /MATHS · ENGLISH · SCIENCE/);
});

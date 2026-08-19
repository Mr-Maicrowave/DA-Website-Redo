import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const subjectHeroUrl = new URL('./SubjectHero.tsx', import.meta.url);

test('mobile hero focal points can override the desktop image position', () => {
  const source = readFileSync(subjectHeroUrl, 'utf8');

  assert.match(source, /--subject-hero-desktop-position/);
  assert.match(source, /--subject-hero-mobile-position/);
  assert.match(source, /object-position: var\(--subject-hero-desktop-position/);
  assert.match(source, /object-position: var\(--subject-hero-mobile-position, var\(--subject-hero-desktop-position/);
  assert.doesNotMatch(source, /\{ objectPosition: backgroundPosition \}/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const subjectHeroUrl = new URL('./SubjectHero.tsx', import.meta.url);
const englishPageUrl = new URL('../../pages/subjects/English.tsx', import.meta.url);

test('mobile hero focal points can override the desktop image position', () => {
  const source = readFileSync(subjectHeroUrl, 'utf8');

  assert.match(source, /--subject-hero-desktop-position/);
  assert.match(source, /--subject-hero-mobile-position/);
  assert.match(source, /object-position: var\(--subject-hero-desktop-position/);
  assert.match(source, /object-position: var\(--subject-hero-mobile-position, var\(--subject-hero-desktop-position/);
  assert.doesNotMatch(source, /\{ objectPosition: backgroundPosition \}/);
});

test('supports a light hero tone for photograph-led subject pages', () => {
  const source = readFileSync(subjectHeroUrl, 'utf8');

  assert.match(source, /heroTone\?: 'dark' \| 'light' \| 'muted' \| 'charcoal'/);
  assert.match(source, /heroTone = 'dark'/);
  assert.match(source, /subject-hero--light/);
});

test('supports a muted warm hero tone when the photograph should retain more depth', () => {
  const source = readFileSync(subjectHeroUrl, 'utf8');

  assert.match(source, /heroTone\?: 'dark' \| 'light' \| 'muted' \| 'charcoal'/);
  assert.match(source, /subject-hero--muted/);
  assert.match(source, /subject-hero--warm\.subject-hero--mobile-bottom-copy/);
});

test('supports a neutral charcoal grade without the navy cast', () => {
  const source = readFileSync(subjectHeroUrl, 'utf8');

  assert.match(source, /heroTone === 'charcoal'/);
  assert.match(source, /rgba\(18,18,16/);
});

test('allows a subject to strengthen its accent and supporting-copy colours over a photograph', () => {
  const source = readFileSync(subjectHeroUrl, 'utf8');

  assert.match(source, /headlineAccentClassName\?: string/);
  assert.match(source, /subtextClassName\?: string/);
});

test('English supplies its current two-part headline to the shared hero', () => {
  const source = readFileSync(englishPageUrl, 'utf8');

  assert.match(source, /headlineWhite="Writing with clarity\."/);
  assert.match(source, /headlineGold="Thinking with depth\."/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pageUrl = new URL('./Science.tsx', import.meta.url);

test('keeps the HSC and teaching navigation links pointed at visible sections', () => {
  const source = readFileSync(pageUrl, 'utf8');

  assert.match(source, /\['HSC focus areas',\s*'#science-pathways'\]/);
  assert.match(source, /\['How we teach',\s*'#science-method'\]/);
  assert.match(source, /id="science-method"/);
  assert.doesNotMatch(source, /id="hsc-sciences"/);
  assert.match(source, /<a key=\{label\} href=\{href\}/);
});

test('uses the same default navy hero treatment as English', () => {
  const source = readFileSync(pageUrl, 'utf8');
  const heroStart = source.indexOf('<SubjectHero');
  const hero = source.slice(heroStart, source.indexOf('/>', heroStart) + 2);

  assert.doesNotMatch(hero, /heroTone="charcoal"/);
  assert.doesNotMatch(hero, /headlineAccentClassName|subtextClassName/);
});

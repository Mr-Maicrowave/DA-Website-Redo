import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./HSCExcellence.tsx', import.meta.url), 'utf8');
const heroSource = readFileSync(new URL('../components/hsc/HSCHero.tsx', import.meta.url), 'utf8');
const heroStyles = readFileSync(new URL('../components/hsc/HSCHero.css', import.meta.url), 'utf8');

test('mounts the reference-led HSC journey hero instead of the generic subject hero', () => {
  assert.match(source, /<HSCHero \/>/);
  assert.doesNotMatch(source, /<SubjectHero/);
});

test('keeps the hero separate from the continuous below-hero landscape', () => {
  assert.equal((source.match(/<HSCHero \/>/g) ?? []).length, 1);
  assert.equal((source.match(/className="hsc-landscape-video"/g) ?? []).length, 1);
});

test('uses stable benefit keys and project-compatible image markup', () => {
  assert.match(heroSource, /key=\{id\}/);
  assert.doesNotMatch(heroSource, /fetchPriority/);
});

test('gives the final headline word an explicit mobile wrapping hook', () => {
  assert.match(heroSource, /className="hsc-journey-hero__tomorrow"/);
});

test('fills the full viewport behind the fixed desktop and mobile navigation', () => {
  assert.match(heroStyles, /height:\s*100svh/);
  assert.doesNotMatch(heroStyles, /100svh - \d+px/);
  assert.doesNotMatch(heroStyles, /min-height:1160px/);
});

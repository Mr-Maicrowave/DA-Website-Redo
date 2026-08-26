import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./HSCWhyYearsMatter.tsx', import.meta.url), 'utf8');

test('includes the complete editorial story and all four explanations', () => {
  for (const phrase of [
    'The HSC isn’t one final exam.',
    'EVERY MARK',
    'THE RIGHT',
    'KNOWING IT',
    'THEY NEED TO',
    'So we don’t teach every',
    'Every internal assessment contributes',
    'Scaling, workload, personal strengths',
    'Many strong students understand the content',
    'Year 12 is a marathon',
  ]) assert.match(source, new RegExp(phrase));
});

test('uses accessible expandable explanations and reduced motion', () => {
  assert.match(source, /aria-expanded=/);
  assert.equal((source.match(/<WhyToggle id=/g) ?? []).length, 4);
  assert.match(source, /useReducedMotion/);
});

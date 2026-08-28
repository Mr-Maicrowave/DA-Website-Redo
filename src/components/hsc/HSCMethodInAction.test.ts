import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./HSCMethodInAction.tsx', import.meta.url), 'utf8');

test('contains the complete DA method sequence and supporting panels', () => {
  for (const phrase of [
    'The DA method in action',
    'Understand the question',
    'Plan your approach',
    'Execute with technique',
    'Check & refine your answer',
    'REAL HSC QUESTION',
    'DA METHOD BREAKDOWN',
    'MODEL ANSWER EXCERPT',
    'Tutor expertise',
    'HSC tutor matching',
  ]) assert.match(source, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('uses the generated method artwork', () => {
  assert.match(source, /da-method-tutor-session\.png/);
  assert.match(source, /tutor-matching-group\.png/);
});

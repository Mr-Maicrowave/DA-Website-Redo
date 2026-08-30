import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./HSCCompleteStrategy.tsx', import.meta.url), 'utf8');

test('renders the complete strategy and starting-point sequence', () => {
  for (const phrase of [
    'Our complete HSC strategy',
    'SYLLABUS MASTERY',
    'ASSESSMENT PREPARATION',
    'EXAM TECHNIQUE',
    'TIME MANAGEMENT',
    'TRIAL PREPARATION',
    'PAST-PAPER PRACTICE',
    'MARKING CRITERIA',
    'TESTING',
    'CORRECTIONS',
    'FEEDBACK LOOPS',
    'SUBJECT-SPECIFIC RESOURCES',
    'Different starting points. Same goal.',
    'STRUGGLING',
    'MAINTAINING',
    'IMPROVING',
    'BAND 6 TARGET',
  ]) assert.match(source, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('uses all three generated transparent asset families', () => {
  for (const asset of ['strategy-icons-sheet.png', 'process-icons-sheet.png', 'progress-landscapes-sheet.png']) {
    assert.match(source, new RegExp(asset.replace('.', '\\.')));
  }
});

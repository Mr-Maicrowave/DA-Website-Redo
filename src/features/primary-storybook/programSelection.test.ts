import test from 'node:test';
import assert from 'node:assert/strict';
import { selectProgram } from './programSelection.ts';

test('selecting a different program makes that object dominant', () => {
  assert.equal(selectProgram('small-group', 'private-tuition'), 'private-tuition');
});

test('selecting the active program keeps the selection stable', () => {
  assert.equal(selectProgram('creative-writing', 'creative-writing'), 'creative-writing');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { splitInlineLatex } from './inline-latex.ts';

test('keeps a complete inline equation in one math segment', () => {
  assert.deepEqual(
    splitInlineLatex('If \\(d\\) changes in \\(y=x^2+d\\), what happens?'),
    [
      { type: 'text', value: 'If ' },
      { type: 'math', value: 'd' },
      { type: 'text', value: ' changes in ' },
      { type: 'math', value: 'y=x^2+d' },
      { type: 'text', value: ', what happens?' },
    ],
  );
});

test('leaves ordinary guided copy unchanged', () => {
  assert.deepEqual(splitInlineLatex('Predict before using the controls'), [
    { type: 'text', value: 'Predict before using the controls' },
  ]);
});

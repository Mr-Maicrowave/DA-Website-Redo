import assert from 'node:assert/strict';
import test from 'node:test';
import { classFormats } from './hscLearningFormatsData.ts';

test('defines four complete learning formats and 54 unique generated assets', () => {
  assert.equal(classFormats.length, 4);
  const assets = classFormats.flatMap(format => [
    format.image,
    ...format.attributes.map(item => item.icon),
    ...format.process.map(item => item.icon),
    ...format.parentQuestions.map(item => item.icon),
  ]);
  const shared = [
    '/media/hsc/editorial/explorer/explorer-panel-paper.png',
    '/media/hsc/editorial/explorer/explorer-reassurance-paper.png',
    '/media/hsc/editorial/explorer/explorer-instruction-accent.png',
  ];
  assert.equal(assets.length + shared.length, 54);
  assert.equal(new Set([...assets, ...shared]).size, 54);
});

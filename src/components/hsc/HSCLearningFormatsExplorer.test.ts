import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { classFormats } from './hscLearningFormatsData.ts';

function assertPublicPngExists(assetPath: string) {
  const path = fileURLToPath(new URL(`../../../public${assetPath}`, import.meta.url));
  assert.equal(existsSync(path), true, path);
  assert.deepEqual([...readFileSync(path).subarray(1, 4)], [80, 78, 71]);
}

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

test('ships every explorer photograph as a PNG', () => {
  for (const format of classFormats) assertPublicPngExists(format.image);
});

test('ships every generated explorer asset as a PNG', () => {
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

  for (const asset of [...assets, ...shared]) assertPublicPngExists(asset);
});

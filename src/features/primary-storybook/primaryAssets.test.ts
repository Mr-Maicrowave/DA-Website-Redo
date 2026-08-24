import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { primaryAssetManifest } from './primaryAssetManifest.ts';

const publicDir = fileURLToPath(new URL('../../../public', import.meta.url));

const assetModes = [
  ['/primary-reference/decor/foundations-crayon-set.png', true],
  ['/primary-reference/decor/curriculum-house-set.png', true],
  ['/primary-reference/decor/how-we-teach-path-set.png', true],
  ['/primary-reference/decor/growth-crayon-set.png', true],
  ['/primary-reference/decor/mastery-crayon-set.png', true],
  ['/primary-reference/decor/program-helper-icons.png', true],
  ['/primary-reference/decor/family-icons.png', true],
  ['/primary-reference/aquarium/water-background.png', false],
  ['/primary-reference/aquarium/distant-reef.png', true],
  ['/primary-reference/aquarium/midground-reef.png', true],
  ['/primary-reference/aquarium/foreground-reef.png', true],
  ['/primary-reference/aquarium/bubbles.png', true],
  ['/primary-reference/aquarium/fish/clownfish.png', true],
  ['/primary-reference/aquarium/fish/blue-tang.png', true],
  ['/primary-reference/aquarium/fish/yellow-tang.png', true],
  ['/primary-reference/aquarium/fish/pufferfish.png', true],
  ['/primary-reference/aquarium/fish/seahorse.png', true],
  ['/primary-reference/aquarium/fish/reef-fish.png', true],
  ['/primary-reference/aquarium/fish/starfish.png', true],
  ['/primary-reference/programs/da-schoolbag.png', true],
  ['/primary-reference/programs/small-group-notebook.png', true],
  ['/primary-reference/programs/private-tuition-pencil-case.png', true],
  ['/primary-reference/programs/creative-writing-book.png', true],
  ['/primary-reference/journey/closing-landscape.png', false],
] as const;

function pngHasAlpha(path: string): boolean {
  const bytes = readFileSync(path);
  assert.equal(bytes.toString('ascii', 1, 4), 'PNG');
  const colorType = bytes.readUInt8(25);
  const hasTransparencyChunk = bytes.includes(Buffer.from('tRNS'));
  return colorType === 4 || colorType === 6 || hasTransparencyChunk;
}

test('reference storyboard asset pack is complete and project local', () => {
  const required = ['foundations', 'curriculumHouse', 'aquariumWater', 'schoolbag', 'smallGroup', 'privateTuition', 'creativeWriting', 'closingLandscape'] as const;
  required.forEach((key) => assert.match(primaryAssetManifest[key], /^\/primary-reference\//));
  Object.values(primaryAssetManifest).forEach((url) => assert.equal(existsSync(join(publicDir, url)), true));
});

test('all 24 reference assets exist with the expected compositing mode', () => {
  assert.equal(assetModes.length, 24);
  assetModes.forEach(([url, expectedAlpha]) => {
    const path = join(publicDir, url);
    assert.equal(existsSync(path), true, `${url} must exist`);
    assert.equal(pngHasAlpha(path), expectedAlpha, `${url} alpha mode must match its runtime layer`);
  });
});

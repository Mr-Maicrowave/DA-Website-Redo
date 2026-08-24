import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { primaryAssetManifest } from './primaryAssetManifest.ts';

const publicDir = fileURLToPath(new URL('../../../public', import.meta.url));

test('reference storyboard asset pack is complete and project local', () => {
  const required = ['foundations', 'curriculumHouse', 'aquariumWater', 'schoolbag', 'smallGroup', 'privateTuition', 'creativeWriting', 'closingLandscape'] as const;
  required.forEach((key) => assert.match(primaryAssetManifest[key], /^\/primary-reference\//));
  Object.values(primaryAssetManifest).forEach((url) => assert.equal(existsSync(join(publicDir, url)), true));
});

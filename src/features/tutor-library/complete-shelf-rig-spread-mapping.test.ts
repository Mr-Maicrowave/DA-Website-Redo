import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const rigSource = readFileSync(new URL('../../../public/dev/complete-shelf-rig/complete-shelf-book-rig.js', import.meta.url), 'utf8');

test('maps the first physical opening directly to the two editorial spreads', () => {
  assert.match(rigSource, /const identityPageMaterial = presentationApplied \? interiorPageMaterials\[0\] : frontEndpaperMaterial/);
  assert.match(rigSource, /\[\[interiorPageMaterials\[1\], interiorPageMaterials\[2\]\], \[interiorPageMaterials\[3\], interiorPageMaterials\[3\]\]\]/);
});

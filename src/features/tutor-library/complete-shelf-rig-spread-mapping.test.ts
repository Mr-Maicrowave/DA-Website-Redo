import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const rigSource = readFileSync(new URL('../../../public/dev/complete-shelf-rig/complete-shelf-book-rig.js', import.meta.url), 'utf8');

test('maps the two readable spreads to distinct physical leaves', () => {
  assert.match(rigSource, /const identityPageMaterial = frontEndpaperMaterial/);
  assert.match(rigSource, /\[\[interiorPageMaterials\[0\], blankPageMaterial\], \[interiorPageMaterials\[1\], interiorPageMaterials\[2\]\], \[interiorPageMaterials\[3\], blankPageMaterial\]\]/);
  assert.match(rigSource, /const turnableLeafOrder = 1/);
  assert.match(rigSource, /const initialLeftLeafOrder = 0/);
  assert.match(rigSource, /const frontPageMaterial = readerLeaf\?\.\[0\] \?\? blankPageMaterial/);
  assert.match(rigSource, /const backPageMaterial = readerLeaf\?\.\[1\] \?\? blankPageMaterial/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
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

test('upper-primary classroom photos have width-described WebP variants', async () => {
  const responsivePhotos = [
    {
      source: 'tutor_mentor_girls',
      variants: [720, 1200, 1800],
    },
    {
      source: '0X1A7290',
      variants: [720, 1200, 1800],
    },
  ] as const;

  for (const photo of responsivePhotos) {
    for (const width of photo.variants) {
      const path = join(publicDir, `/images/community/responsive/${photo.source}-${width}.webp`);
      assert.equal(existsSync(path), true, `${photo.source} must provide a ${width}px WebP candidate`);

      const metadata = await sharp(path).metadata();
      assert.equal(metadata.format, 'webp');
      assert.equal(metadata.width, width, `${photo.source}-${width}.webp must match its width descriptor`);
    }
  }
});

test('How We Teach uses four standalone transparent teaching composites', async () => {
  const frameAssets = [
    'teaching-composite-explain.png',
    'teaching-composite-practise.png',
    'teaching-composite-independent.png',
    'teaching-composite-celebrate.png',
  ] as const;

  for (const filename of frameAssets) {
    const path = join(publicDir, '/primary-reference/teaching', filename);
    assert.equal(existsSync(path), true, `${filename} must exist`);

    const image = sharp(path);
    const metadata = await image.metadata();
    assert.equal(metadata.format, 'png');
    assert.equal(metadata.hasAlpha, true, `${filename} must preserve transparency`);
    assert.ok((metadata.width ?? 0) > 1000, `${filename} must retain its supplied resolution`);

    const transparentCorner = await image
      .extract({
        left: 0,
        top: 0,
        width: 1,
        height: 1,
      })
      .raw()
      .toBuffer();
    assert.equal(transparentCorner[3], 0, `${filename} must preserve its transparent outer canvas`);
  }
});

test('support journey ships eight standalone transparent illustrations', async () => {
  const assets = [
    'before-da-child.png',
    'right-support-tutor.png',
    'after-da-child.png',
    'pathway-seedling.png',
    'pathway-plant.png',
    'pathway-tree.png',
    'pathway-mountain.png',
    'support-heart-sparkle.png',
  ] as const;

  for (const filename of assets) {
    const path = join(publicDir, '/primary-reference/support-journey', filename);
    assert.equal(existsSync(path), true, `${filename} must exist`);
    const metadata = await sharp(path).metadata();
    assert.equal(metadata.format, 'png');
    assert.equal(metadata.hasAlpha, true, `${filename} must preserve transparency`);
  }
});

test('Years 3–4 reference rebuild ships its generated photo and transparent illustration pack', async () => {
  const generatedAssets = [
    ['years-3-4-learning-scene.png', false],
    ['years-3-4-outcome-atlas.png', true],
    ['years-3-4-curriculum-atlas.png', true],
    ['years-3-4-garden-strip.png', true],
    ['years-3-4-decor-atlas.png', true],
  ] as const;

  for (const [filename, expectedAlpha] of generatedAssets) {
    const path = join(publicDir, '/primary-reference/growth', filename);
    assert.equal(existsSync(path), true, `${filename} must exist`);
    const metadata = await sharp(path).metadata();
    assert.equal(metadata.format, 'png');
    assert.equal(metadata.hasAlpha, expectedAlpha, `${filename} compositing mode must match`);
  }
});

test('Years 5–6 reference rebuild ships every illustration as a separate transparent PNG', async () => {
  const generatedAssets = [
    'mastery-star-icon.png',
    'mastery-brain-icon.png',
    'mastery-collaboration-icon.png',
    'mastery-graduation-icon.png',
    'mastery-photo-tape.png',
    'mastery-photo-plane.png',
    'mastery-photo-star.png',
    'mastery-photo-note.png',
    'mastery-writing-books.png',
    'mastery-reasoning-sheet.png',
    'mastery-year-seven-books.png',
    'mastery-meadow-strip.png',
    'mastery-signpost.png',
  ] as const;

  for (const filename of generatedAssets) {
    const path = join(publicDir, '/primary-reference/mastery', filename);
    assert.equal(existsSync(path), true, `${filename} must exist`);
    const metadata = await sharp(path).metadata();
    assert.equal(metadata.format, 'png');
    assert.equal(metadata.hasAlpha, true, `${filename} must preserve transparency`);
  }
});

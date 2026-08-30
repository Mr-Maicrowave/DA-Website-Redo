import sharp from 'sharp';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assetRoot = resolve(
  projectRoot,
  'public/images/programs/high-school-professional',
);
const assets = [
  'teacher-progress-tutoring-scene-v1',
  'teacher-progress-watercolor-frame-v1',
];

for (const asset of assets) {
  const input = resolve(assetRoot, `${asset}.png`);

  for (const width of [768, 1536]) {
    const pipeline = sharp(input).resize({ width, withoutEnlargement: true });

    await pipeline
      .clone()
      .avif({ quality: 72, effort: 6 })
      .toFile(resolve(assetRoot, `${asset}-${width}w.avif`));
    await pipeline
      .clone()
      .webp({ quality: 84, alphaQuality: 95 })
      .toFile(resolve(assetRoot, `${asset}-${width}w.webp`));
  }
}

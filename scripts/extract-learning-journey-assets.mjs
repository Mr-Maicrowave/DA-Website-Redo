import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const featureRoot = path.join(projectRoot, "public", "learning-journey");

const sources = {
  character: "source/character-and-world.png",
  objects: "source/objects-and-paths.png",
  trees: "source/trees-and-shrubs.png",
  distance: "source/distant-landscape.png",
};

const extractions = [
  {
    source: sources.character,
    box: { left: 50, top: 5, width: 180, height: 320 },
    width: 180,
    destination: "character/idle.webp",
  },
  {
    source: sources.character,
    box: { left: 228, top: 38, width: 150, height: 255 },
    width: 160,
    destination: "character/walk-01.webp",
  },
  {
    source: sources.character,
    box: { left: 382, top: 48, width: 130, height: 245 },
    width: 140,
    destination: "character/walk-02.webp",
  },
  {
    source: sources.character,
    box: { left: 510, top: 40, width: 142, height: 255 },
    width: 150,
    destination: "character/walk-03.webp",
  },
  {
    source: sources.character,
    box: { left: 650, top: 42, width: 138, height: 255 },
    width: 150,
    destination: "character/walk-04.webp",
  },
  {
    source: sources.character,
    box: { left: 788, top: 50, width: 132, height: 245 },
    width: 145,
    destination: "character/walk-05.webp",
  },
  {
    source: sources.character,
    box: { left: 912, top: 50, width: 136, height: 245 },
    width: 150,
    destination: "character/walk-06.webp",
  },
  {
    source: sources.character,
    box: { left: 1040, top: 40, width: 150, height: 255 },
    width: 165,
    destination: "character/walk-07.webp",
  },
  {
    source: sources.objects,
    box: { left: 5, top: 865, width: 525, height: 140 },
    width: 720,
    destination: "path/path-left.webp",
  },
  {
    source: sources.objects,
    box: { left: 520, top: 865, width: 505, height: 155 },
    width: 720,
    destination: "path/path-stones.webp",
  },
  {
    source: sources.objects,
    box: { left: 1015, top: 880, width: 516, height: 140 },
    width: 720,
    destination: "path/path-right.webp",
  },
  {
    source: sources.objects,
    box: { left: 5, top: 535, width: 340, height: 165 },
    width: 360,
    destination: "flora/wildflower-meadow.webp",
  },
  {
    source: sources.objects,
    box: { left: 500, top: 515, width: 205, height: 185 },
    width: 250,
    destination: "flora/lavender-grass.webp",
  },
  {
    source: sources.objects,
    box: { left: 5, top: 690, width: 205, height: 120 },
    width: 220,
    destination: "flora/rocks-and-flowers.webp",
  },
  {
    source: sources.objects,
    box: { left: 25, top: 25, width: 220, height: 365 },
    width: 245,
    destination: "objects/signpost.webp",
  },
  {
    source: sources.objects,
    box: { left: 5, top: 375, width: 220, height: 170 },
    width: 230,
    destination: "objects/books-and-daisy.webp",
  },
  {
    source: sources.objects,
    box: { left: 220, top: 375, width: 300, height: 170 },
    width: 300,
    destination: "objects/open-book.webp",
  },
  {
    source: sources.trees,
    box: { left: 15, top: 0, width: 425, height: 400 },
    width: 480,
    destination: "trees/oak-tree.webp",
  },
  {
    source: sources.trees,
    box: { left: 450, top: 15, width: 205, height: 390 },
    width: 280,
    destination: "trees/daisy-tree.webp",
  },
  {
    source: sources.trees,
    box: { left: 1170, top: 5, width: 165, height: 400 },
    width: 220,
    destination: "trees/cypress-pair.webp",
  },
  {
    source: sources.distance,
    box: { left: 0, top: 100, width: 2172, height: 590 },
    width: 1800,
    destination: "distance/academy-landscape.webp",
  },
  {
    source: sources.character,
    box: { left: 1345, top: 80, width: 190, height: 205 },
    width: 220,
    destination: "classroom/seated-student.webp",
  },
  {
    source: sources.character,
    box: { left: 445, top: 370, width: 225, height: 150 },
    width: 300,
    destination: "classroom/bench.webp",
  },
  {
    source: sources.character,
    box: { left: 270, top: 280, width: 165, height: 280 },
    width: 220,
    destination: "classroom/lamp.webp",
  },
  {
    source: sources.character,
    box: { left: 682, top: 380, width: 145, height: 100 },
    width: 220,
    destination: "classroom/books.webp",
  },
];

function assertInsideFeatureRoot(filePath, label) {
  const relativePath = path.relative(featureRoot, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`${label} escapes the learning journey asset directory`);
  }
}

function validateBox(box, metadata, source) {
  const values = [box.left, box.top, box.width, box.height];

  if (!values.every(Number.isInteger) || values.some((value) => value < 0)) {
    throw new Error(`Invalid extraction box for ${source}`);
  }

  if (
    box.width === 0 ||
    box.height === 0 ||
    box.left + box.width > metadata.width ||
    box.top + box.height > metadata.height
  ) {
    throw new Error(`Extraction box exceeds ${source}`);
  }
}

async function assertVisibleAlpha(pipeline, destination) {
  const stats = await pipeline.clone().ensureAlpha().stats();
  const alpha = stats.channels[3];

  if (!alpha || alpha.max === 0) {
    throw new Error(`Extraction produced empty alpha: ${destination}`);
  }
}

async function extractAsset(entry, metadataBySource) {
  const sourcePath = path.join(featureRoot, entry.source);
  const destinationPath = path.join(featureRoot, entry.destination);
  assertInsideFeatureRoot(sourcePath, entry.source);
  assertInsideFeatureRoot(destinationPath, entry.destination);
  validateBox(entry.box, metadataBySource.get(entry.source), entry.source);

  if (!Number.isInteger(entry.width) || entry.width <= 0) {
    throw new Error(`Invalid output width for ${entry.destination}`);
  }

  const extracted = await sharp(sourcePath).extract(entry.box).png().toBuffer();
  const pipeline = sharp(extracted)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize({ width: entry.width, withoutEnlargement: true });
  await assertVisibleAlpha(pipeline, entry.destination);

  await mkdir(path.dirname(destinationPath), { recursive: true });
  const info = await pipeline
    .webp({ quality: 88, alphaQuality: 95 })
    .toFile(destinationPath);
  console.log(`${entry.destination} ${info.width}x${info.height}`);
}

async function main() {
  const metadataBySource = new Map();

  for (const source of new Set(extractions.map((entry) => entry.source))) {
    const sourcePath = path.join(featureRoot, source);
    assertInsideFeatureRoot(sourcePath, source);
    await access(sourcePath);
    const metadata = await sharp(sourcePath).metadata();

    if (!metadata.width || !metadata.height || !metadata.hasAlpha) {
      throw new Error(`${source} must be a transparent image with known dimensions`);
    }

    metadataBySource.set(source, metadata);
  }

  for (const entry of extractions) {
    await extractAsset(entry, metadataBySource);
  }
}

await main();

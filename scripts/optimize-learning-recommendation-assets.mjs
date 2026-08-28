import { access, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(projectRoot, "public/learning-journey/results");
const assets = ["private-learning", "small-group-learning", "class-environment"];
const widths = [768, 1536];

await mkdir(outputDirectory, { recursive: true });

for (const asset of assets) {
  const source = resolve(outputDirectory, `${asset}.png`);
  await access(source);

  for (const width of widths) {
    const pipeline = sharp(source).resize({
      width,
      withoutEnlargement: true,
      fit: "inside",
    });

    await pipeline
      .clone()
      .webp({ quality: 84, alphaQuality: 100, smartSubsample: true })
      .toFile(resolve(outputDirectory, `${asset}-${width}w.webp`));

    await pipeline
      .clone()
      .avif({ quality: 58, effort: 5, chromaSubsampling: "4:4:4" })
      .toFile(resolve(outputDirectory, `${asset}-${width}w.avif`));
  }
}

console.log(`Optimized ${assets.length} learning recommendation destinations.`);

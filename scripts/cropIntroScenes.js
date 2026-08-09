import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const introDir = path.join(rootDir, 'public', 'intro');
const outputDir = path.join(introDir, 'scenes');

const sourceCandidates = [
  path.join(introDir, 'storyboard.png'),
  path.join(introDir, 'storyboard.jpeg'),
  path.join(introDir, 'storyboard.jpg'),
];

const columns = 3;
const rows = 3;

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const getSourcePath = async () => {
  for (const candidate of sourceCandidates) {
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `No storyboard found. Expected one of:\n${sourceCandidates
      .map((candidate) => `- ${path.relative(rootDir, candidate)}`)
      .join('\n')}`
  );
};

const cropScenes = async () => {
  const sourcePath = await getSourcePath();
  const image = sharp(sourcePath);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not read dimensions for ${sourcePath}`);
  }

  const gridWidth = metadata.width;
  // The supplied storyboard has a 3x3 grid above a DA Tuition logo banner.
  // Its top grid is 3 wide panels by 3 rows, so the grid height is width / 2.
  const gridHeight = Math.min(metadata.height, Math.round(gridWidth / 2));
  const panelWidth = Math.floor(gridWidth / columns);
  const panelHeight = Math.floor(gridHeight / rows);

  await fs.mkdir(outputDir, { recursive: true });

  const jobs = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const sceneNumber = row * columns + column + 1;
      const left = column * panelWidth;
      const top = row * panelHeight;
      const width = column === columns - 1 ? gridWidth - left : panelWidth;
      const height = row === rows - 1 ? gridHeight - top : panelHeight;
      const outputPath = path.join(outputDir, `scene-${sceneNumber}.png`);

      jobs.push(
        sharp(sourcePath)
          .extract({ left, top, width, height })
          .png()
          .toFile(outputPath)
          .then(() => {
            console.log(
              `scene-${sceneNumber}.png: ${width}x${height} @ ${left},${top}`
            );
          })
      );
    }
  }

  await Promise.all(jobs);
  console.log(`Cropped scenes from ${path.relative(rootDir, sourcePath)}`);
  console.log(`Wrote ${rows * columns} files to ${path.relative(rootDir, outputDir)}`);
};

cropScenes().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

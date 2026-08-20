import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);
const require = createRequire(import.meta.url);
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const scenesDir = path.join(rootDir, 'public', 'intro', 'scenes');
const outDir = path.join(rootDir, 'out');
const framesDir = path.join(outDir, 'intro-frames');
const outputPath = path.join(outDir, 'da-intro.mp4');
const ffmpegPath = ffmpeg.path;

const width = 1920;
const height = 1080;
const fps = 24;
const durationInFrames = 288;
const sceneCount = 9;
const transitionFrames = 10;
const sceneDuration = durationInFrames / sceneCount;

const sceneMotion = [
  { from: 1.03, to: 1.12, x: 0, y: 0 },
  { from: 1.02, to: 1.11, x: -12, y: 4 },
  { from: 1.03, to: 1.13, x: 10, y: 0 },
  { from: 1.04, to: 1.16, x: -10, y: 0 },
  { from: 1.03, to: 1.1, x: 0, y: -8 },
  { from: 1.04, to: 1.17, x: 4, y: -4 },
  { from: 1.03, to: 1.13, x: 0, y: -6 },
  { from: 1.04, to: 1.16, x: 3, y: -4 },
  { from: 1.02, to: 1.045, x: 0, y: 0 },
];

const random = (seed) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

const makeParticles = () =>
  Array.from({ length: 80 }, (_, index) => {
    const next = random(index + 19);
    return {
      x: next(),
      y: next(),
      size: 2 + next() * 5,
      speed: 0.4 + next() * 1.4,
      delay: next() * 160,
      blue: next() > 0.78,
    };
  });

const particles = makeParticles();

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, progress) => from + (to - from) * progress;

const sceneOpacity = (frame, start, end) => {
  const fadeIn = clamp((frame - start) / transitionFrames, 0, 1);
  const fadeOut = clamp((end - frame) / transitionFrames, 0, 1);
  return Math.min(fadeIn, fadeOut);
};

const renderSceneFrame = async (sceneIndex, progress, frame) => {
  const inputPath = path.join(scenesDir, `scene-${sceneIndex + 1}.png`);
  const motion = sceneMotion[sceneIndex];
  const float = sceneIndex === 4 ? Math.sin((frame - sceneIndex * sceneDuration) / 8) * 8 : 0;
  const scale = lerp(motion.from, motion.to, progress);
  const x = lerp(0, motion.x, progress);
  const y = lerp(0, motion.y, progress) + float;
  const scaledWidth = Math.round(width * scale);
  const scaledHeight = Math.round(height * scale);
  const left = Math.round((scaledWidth - width) / 2 - x);
  const top = Math.round((scaledHeight - height) / 2 - y);

  return sharp(inputPath)
    .resize(scaledWidth, scaledHeight, { fit: 'cover' })
    .extract({
      left: clamp(left, 0, scaledWidth - width),
      top: clamp(top, 0, scaledHeight - height),
      width,
      height,
    })
    .modulate({ brightness: 1.04, saturation: 1.05 })
    .png()
    .toBuffer();
};

const overlaySvg = (frame) => {
  const particleSvg = particles
    .map((particle) => {
      const drift = ((frame + particle.delay) * particle.speed) % (height + 180);
      const shimmer = 0.5 + Math.sin((frame + particle.delay) / 8) * 0.5;
      const x = particle.x * width + Math.sin((frame + particle.delay) / 38) * 24;
      const y = particle.y * height - drift + 120;
      const color = particle.blue ? '#8ed4ff' : '#f5c85f';
      const opacity = 0.18 + shimmer * 0.42;
      return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(
        particle.size *
        (0.7 + shimmer * 0.65)
      ).toFixed(2)}" fill="${color}" opacity="${opacity.toFixed(3)}"/>`;
    })
    .join('');

  const sweep = lerp(-35, 135, frame / durationInFrames);
  const pulse = 0.22 + Math.sin(frame / 24) * 0.06;

  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="warmA" cx="50%" cy="28%" r="38%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.34"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="warmB" cx="78%" cy="18%" r="30%">
          <stop offset="0%" stop-color="#ffd682" stop-opacity="0.26"/>
          <stop offset="100%" stop-color="#ffd682" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="leak" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${sweep} .5 .5)">
          <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
          <stop offset="45%" stop-color="#ffe7a0" stop-opacity="${pulse.toFixed(3)}"/>
          <stop offset="50%" stop-color="#fff" stop-opacity="0.16"/>
          <stop offset="62%" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#warmA)"/>
      <rect width="100%" height="100%" fill="url(#warmB)"/>
      <rect width="100%" height="100%" fill="url(#leak)"/>
      <g filter="drop-shadow(0 0 10px rgba(245, 200, 95, 0.55))">${particleSvg}</g>
    </svg>
  `);
};

const renderFrame = async (frame) => {
  const layers = [];

  for (let sceneIndex = 0; sceneIndex < sceneCount; sceneIndex += 1) {
    const start = sceneIndex * sceneDuration;
    const end = start + sceneDuration;
    const opacity = sceneOpacity(frame, start, end);

    if (opacity <= 0) continue;

    const progress = clamp((frame - start) / sceneDuration, 0, 1);
    layers.push({
      input: await renderSceneFrame(sceneIndex, progress, frame),
      blend: 'over',
      opacity,
    });
  }

  const framePath = path.join(framesDir, `frame-${String(frame).padStart(4, '0')}.png`);
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: '#fff4de',
    },
  })
    .composite([...layers, { input: overlaySvg(frame), blend: 'screen' }])
    .png()
    .toFile(framePath);
};

const render = async () => {
  await fs.mkdir(outDir, { recursive: true });
  await fs.rm(framesDir, { recursive: true, force: true });
  await fs.mkdir(framesDir, { recursive: true });

  for (let frame = 0; frame < durationInFrames; frame += 1) {
    await renderFrame(frame);
    if (frame % 24 === 0) {
      console.log(`Rendered frame ${frame + 1}/${durationInFrames}`);
    }
  }

  await execFileAsync(ffmpegPath, [
    '-y',
    '-framerate',
    String(fps),
    '-i',
    path.join(framesDir, 'frame-%04d.png'),
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-crf',
    '18',
    outputPath,
  ]);

  console.log(`Wrote ${path.relative(rootDir, outputPath)}`);
};

render().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

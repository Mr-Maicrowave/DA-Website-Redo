/* ============================================================================
   AWARD SEQUENCE — TARGET POSITION SAMPLING

   Pure functions, no React. Each sampler produces a flat Float32Array of
   [x, y, z, x, y, z, ...] for exactly `count` particles, already centred
   in a shared coordinate space (roughly -3..3 on X/Y) so ParticleMorphSystem
   never has to normalise per-state.

   PHASE 1: only randomField is real. sampleLogo / sampleTrophy / videoFrame
   are placeholders (variants of the random field) so the shader has valid
   attributes to render immediately — they get replaced with the real
   canvas-pixel sampler (logo) and MeshSurfaceSampler (trophy) in phases 2-3.
============================================================================ */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { AWARD_SEQUENCE } from './award-sequence.config';

/** Shared world-space size both the logo and trophy are normalised to, so
 *  they read as the same on-screen size at the same camera distance —
 *  don't let either sampler drift from this independently. */
export const AWARD_TARGET_SIZE = 4.0;

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Deterministic pseudo-random 0-1 value for a given particle index — NOT
 *  drawn from a mutable RNG stream, so any function can independently
 *  compute the same value for the same index without needing shared
 *  state. Used to keep a particle's DEPTH LAYER consistent between
 *  randomField (which needs it for Z placement) and buildParticleSeeds
 *  (which needs it for the shader's per-layer drift-speed attribute). */
function indexHash(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export type ParticleLayer = 0 | 1 | 2; // 0=background, 1=midground, 2=foreground

export function layerForIndex(i: number, fractions: { backgroundFraction: number; midgroundFraction: number }): ParticleLayer {
  const h = indexHash(i);
  if (h < fractions.backgroundFraction) return 0;
  if (h < fractions.backgroundFraction + fractions.midgroundFraction) return 1;
  return 2;
}

/** Ambient starting cloud, placed into real depth-layer Z bands (not just
 *  a size/brightness illusion) so "background moves less, foreground
 *  moves more" is spatially true. Still kept clear of the camera (which
 *  sits at positive Z looking toward the origin). Cartesian, not polar,
 *  so density stays even rather than clumping at the poles. */
export function randomField(
  count: number,
  layers: { backgroundFraction: number; midgroundFraction: number; backgroundZ: [number, number]; midgroundZ: [number, number]; foregroundZ: [number, number] },
  seed = 1
): Float32Array {
  const rand = seededRandom(seed);
  const out = new Float32Array(count * 3);
  const zRangeFor = (layer: ParticleLayer): [number, number] =>
    layer === 0 ? layers.backgroundZ : layer === 1 ? layers.midgroundZ : layers.foregroundZ;

  for (let i = 0; i < count; i++) {
    const layer = layerForIndex(i, layers);
    const [zMin, zMax] = zRangeFor(layer);
    out[i * 3] = (rand() - 0.5) * 9; // x: -4.5..4.5
    out[i * 3 + 1] = (rand() - 0.5) * 6; // y: -3..3
    out[i * 3 + 2] = zMin + rand() * (zMax - zMin);
  }
  return out;
}

/** Placeholder shown until the async real logo sampler below resolves —
 *  keeps first paint instant instead of blocking on image decode. */
export function placeholderLogo(count: number): Float32Array {
  return randomField(count, AWARD_SEQUENCE.layers, 2);
}

const LOGO_SVG_PATH = '/assets/award-sequence/da-logo.svg';

/**
 * Real logo target positions. da-logo.svg is NOT a vector logo with usable
 * <path> data — it's a flattened Illustrator/Inkscape export: a rasterised
 * PNG embedded as base64 inside an SVG <mask>. Standard SVG-path-point
 * sampling doesn't apply here. Instead: let the browser rasterise the SVG
 * (it resolves the mask/clip exactly as it would inline), read the pixels
 * back off an offscreen canvas, and collect coordinates wherever alpha
 * crosses a threshold — the standard "image to particles" technique.
 *
 * Sampling is EDGE-BIASED, not uniform: a pixel bordering a transparent
 * neighbour (the shield outline, the D/A letterforms, the laurel branches)
 * is far more likely to be picked than one deep in a filled interior. That
 * mirrors what direct SVG-path sampling would give you — density on the
 * contours that actually read as "the logo" — without needing real vector
 * path data, which this asset doesn't have.
 *
 * `maxWorldWidth`/`maxWorldHeight` (from computeLogoWorldBounds) define the
 * bounding box the logo must fit INSIDE — the actual output size is
 * whichever axis is more constraining, computed from the logo's own real
 * aspect ratio (discovered from the scanned ink extent below), exactly
 * like CSS `object-fit: contain`. This is what guarantees the whole crest
 * — top, both sides, letters, base point, laurels — always stays within
 * the viewport regardless of window shape.
 *
 * Runs once on mount (not per-frame, not per-scroll-tick) — at 1024x1024
 * this is still low tens of milliseconds of work, see the plan's
 * rationale for why this doesn't need a build-time precompute step.
 */
export async function sampleLogo(count: number, maxWorldWidth: number, maxWorldHeight: number, seed = 2): Promise<Float32Array> {
  const img = new Image();
  img.decoding = 'async';
  const loaded = new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load ${LOGO_SVG_PATH}`));
  });
  img.src = LOGO_SVG_PATH;
  await loaded;

  // Bumped from 512 — "increase the sampling resolution substantially"
  // gives cleaner edge detection and finer detail in the D/A letterforms.
  const RES = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = RES;
  canvas.height = RES;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas context unavailable for logo sampling');

  // Preserve the SVG's own aspect ratio, centred and inset slightly so
  // edge pixels aren't clipped by the canvas bounds.
  const aspect = img.naturalWidth / img.naturalHeight;
  const inset = 0.86;
  let drawW = RES * inset;
  let drawH = drawW / aspect;
  if (drawH > RES * inset) {
    drawH = RES * inset;
    drawW = drawH * aspect;
  }
  const offsetX = (RES - drawW) / 2;
  const offsetY = (RES - drawH) / 2;
  ctx.clearRect(0, 0, RES, RES);
  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

  const { data } = ctx.getImageData(0, 0, RES, RES);
  const ALPHA_THRESHOLD = 32;
  const isOpaque = (x: number, y: number) => {
    if (x < 0 || x >= RES || y < 0 || y >= RES) return false;
    return data[(y * RES + x) * 4 + 3] > ALPHA_THRESHOLD;
  };

  const fillCandidates: number[] = []; // every opaque pixel — flat [x, y, ...]
  const edgeCandidates: number[] = []; // opaque pixels bordering a transparent neighbour
  for (let y = 0; y < RES; y++) {
    for (let x = 0; x < RES; x++) {
      if (!isOpaque(x, y)) continue;
      fillCandidates.push(x, y);
      // 4-connected neighbour check is enough to find contour pixels
      // without the cost of a full Sobel pass over a megapixel canvas.
      const isEdge = !isOpaque(x - 1, y) || !isOpaque(x + 1, y) || !isOpaque(x, y - 1) || !isOpaque(x, y + 1);
      if (isEdge) edgeCandidates.push(x, y);
    }
  }

  if (fillCandidates.length === 0) {
    // Shouldn't happen with a real logo file, but never let a bad asset
    // crash the scene — fall back to the placeholder shape.
    return placeholderLogo(count);
  }

  // Normalise against the FILL candidates' own bounding box (the real ink
  // extent), not a fixed fraction of the canvas — the source raster has
  // generous transparent padding around the artwork that a fixed-fraction
  // assumption undersized badly.
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < fillCandidates.length; i += 2) {
    const x = fillCandidates[i];
    const y = fillCandidates[i + 1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // Contain fit: use whichever axis is more constraining relative to the
  // logo's own real proportions, so both dimensions land inside the box.
  const logoAspect = width / height;
  const boxAspect = maxWorldWidth / maxWorldHeight;
  const targetHeight = logoAspect > boxAspect ? maxWorldWidth / logoAspect : maxWorldHeight;
  const pxToWorld = targetHeight / height;

  const edgeCount = edgeCandidates.length / 2;
  const fillCount = fillCandidates.length / 2;
  // Edges noticeably denser than interior fill, per spec — but interior
  // still gets real coverage so the shield/letters read as solid shapes,
  // not just outlines.
  const EDGE_BIAS = edgeCount > 0 ? 0.73 : 0;

  const rand = seededRandom(seed);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const useEdge = rand() < EDGE_BIAS;
    const pool = useEdge ? edgeCandidates : fillCandidates;
    const poolCount = useEdge ? edgeCount : fillCount;
    const pick = Math.floor(rand() * poolCount);
    const px = pool[pick * 2];
    const py = pool[pick * 2 + 1];
    out[i * 3] = (px - centerX) * pxToWorld;
    out[i * 3 + 1] = -(py - centerY) * pxToWorld; // canvas Y is down, world Y is up
    // Slight Z jitter per brief ("give the logo particles slight Z depth/noise") —
    // real depth is reserved for the trophy stage.
    out[i * 3 + 2] = (rand() - 0.5) * 0.35;
  }
  return out;
}

/** Placeholder shown until the async real trophy sampler below resolves. */
export function placeholderTrophy(count: number): Float32Array {
  return randomField(count, AWARD_SEQUENCE.layers, 3);
}

const TROPHY_GLB_PATH = '/assets/award-sequence/trophy.glb';

let cachedTrophyLoader: GLTFLoader | null = null;

/**
 * Real trophy target positions, sampled across the surface of trophy.glb.
 * The mesh itself is never rendered — only its geometry is used as a
 * particle target cloud, area-weighted via MeshSurfaceSampler so density
 * matches surface area (the cup naturally gets more particles than the
 * handles, without hand-tuning a per-part split).
 *
 * The model is authored Z-up (base_lower sits at Z=0, rim at Z≈3.29) with
 * nine separate named meshes (base_lower/base_upper/stem/stem_flare/cup/
 * rim/handle_L/handle_R/front_medallion) and no node transforms — they're
 * merged into one geometry, rotated to this scene's Y-up convention,
 * centred, and uniformly scaled so it shares the same coordinate space as
 * the logo/random targets. Real Z depth is preserved throughout — this is
 * the one stage where particles read as genuinely three-dimensional.
 */
export async function sampleTrophy(count: number, seed = 3): Promise<Float32Array> {
  cachedTrophyLoader ??= new GLTFLoader();
  const gltf = await cachedTrophyLoader.loadAsync(TROPHY_GLB_PATH);

  const geometries: THREE.BufferGeometry[] = [];
  gltf.scene.updateWorldMatrix(true, true);
  gltf.scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const geo = mesh.geometry.clone();
      geo.applyMatrix4(mesh.matrixWorld);
      // Sampler only needs position — drop everything else so the merge
      // doesn't choke on mismatched attribute sets across the 9 primitives.
      for (const key of Object.keys(geo.attributes)) {
        if (key !== 'position') geo.deleteAttribute(key);
      }
      geometries.push(geo);
    }
  });

  if (geometries.length === 0) {
    return placeholderTrophy(count);
  }

  const merged = mergeGeometries(geometries, false);
  if (!merged) return placeholderTrophy(count);

  // Z-up (Blender-style) -> Y-up: rotate -90deg about X (Z becomes Y, Y becomes -Z).
  merged.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  merged.computeBoundingBox();
  const box = merged.boundingBox!;
  const center = box.getCenter(new THREE.Vector3());
  const height = box.max.y - box.min.y || 1;
  const scale = AWARD_TARGET_SIZE / height;

  // Centre on the vertical MIDPOINT, not the base — anchoring at the base
  // put the whole cup/handles/rim above the camera's visible frame.
  const centerAndScale = new THREE.Matrix4()
    .makeScale(scale, scale, scale)
    .multiply(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));
  merged.applyMatrix4(centerAndScale);

  const sampleMesh = new THREE.Mesh(merged);
  const sampler = new MeshSurfaceSampler(sampleMesh).build();

  const out = new Float32Array(count * 3);
  const p = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(p);
    out[i * 3] = p.x;
    out[i * 3 + 1] = p.y;
    out[i * 3 + 2] = p.z;
  }

  return out;
}

/** Placeholder used until Phase 4 wires the real video-frame rectangle target. */
export function placeholderVideoFrame(count: number): Float32Array {
  return randomField(count, AWARD_SEQUENCE.layers, 4);
}

/** Per-particle static seeds: scale/colour variance, sprite selection, and
 *  a `roleSeed` the shader uses to decide which particles are ordinary
 *  formation members vs. the ~15-20% that orbit outside the shape and the
 *  small highlight subset that gets the star-pulse treatment — matching
 *  the distribution in award-sequence.config.ts. */
export function buildParticleSeeds(count: number, spriteDistribution: { dot: number; softOrb: number; star: number; streak: number }, seed = 7) {
  const rand = seededRandom(seed);
  const scaleSeed = new Float32Array(count);
  const colorSeed = new Float32Array(count);
  const spriteIndex = new Float32Array(count);
  const roleSeed = new Float32Array(count);

  const dotCut = spriteDistribution.dot;
  const orbCut = dotCut + spriteDistribution.softOrb;
  const starCut = orbCut + spriteDistribution.star;
  const HIGHLIGHT_THRESHOLD = 0.996; // top ~0.4% -> the "8-15 special particles" tier

  for (let i = 0; i < count; i++) {
    scaleSeed[i] = rand();
    colorSeed[i] = rand();
    roleSeed[i] = rand();
    const r = rand();
    // Highlight-role particles always render as the star sprite, regardless
    // of the normal distribution roll, so the special particles actually
    // look distinct rather than blending into the dot majority.
    spriteIndex[i] = roleSeed[i] > HIGHLIGHT_THRESHOLD ? 2 : r < dotCut ? 0 : r < orbCut ? 1 : r < starCut ? 2 : 3;
  }

  return { scaleSeed, colorSeed, spriteIndex, roleSeed };
}

/* ============================================================================
   AWARD SEQUENCE — TUNING
   Every scroll-linked number, particle count, colour and camera value lives
   here. Nothing else in this module should hardcode a tunable constant —
   mirrors the MOTION config convention used by HighSchoolCinematicScene.

   Shape indices: 0 = random/float, 1 = logo, 2 = trophy, 3 = video frame.
   Only three literal target shapes are choreographed in this pass (video
   frame stays reserved/unpolished for a later pass) — every named beat
   in the brief (attract, form, shimmer, pulse, dissolve, trophy emergence)
   is expressed as ONE continuous easing curve per stage plus per-particle
   staggering computed in the shader (see award-sequence.shaders.ts),
   not as extra literal target shapes.
============================================================================ */

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export type StageEasing = (t: number) => number;

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);

// FLOAT (0-28% of this stage's own span) -> ATTRACT (28-62%) -> FORM +
// SHIMMER hold (62-100%, reaches 1.0 by ~86% of the stage and holds flat).
// A single piecewise curve rather than 4 separate stages, since it's one
// continuous fromIndex=0 -> toIndex=1 morph throughout — matches the
// brief's own overlapping percentages (20-45% attract / 40-62% form) more
// naturally than hard-separated stages would.
const easeFloatAttractForm: StageEasing = (t) => {
  const c = clamp01(t);
  if (c < 0.28) return 0; // pure float, no attraction yet
  if (c < 0.86) {
    const local = (c - 0.28) / (0.86 - 0.28);
    return (1 - Math.pow(1 - local, 3)) * 1.0; // expo/power-ish accelerate-then-settle
  }
  return 1; // formed, holds for the shimmer window
};

// DISSOLVE + TROPHY EMERGENCE — one continuous fromIndex=1 -> toIndex=2
// morph; per-particle outer-edge-first staggering happens in the shader,
// this just shapes the overall envelope.
const easeDissolveTrophy: StageEasing = (t) => 1 - Math.pow(1 - clamp01(t), 2.2);

const easeStandard: StageEasing = (t) => 1 - Math.pow(1 - clamp01(t), 3);

export interface AwardStage {
  /** Shape this stage morphs TOWARD. fromIndex is the previous stage's toIndex (0 for the first). */
  toIndex: 0 | 1 | 2 | 3;
  start: number;
  end: number;
  ease: StageEasing;
  /** Debug-HUD label (dev-only overlay) — see AwardSequence.tsx. */
  label: string;
}

export const STAGES: readonly AwardStage[] = [
  // FLOAT (0-20%) + ATTRACT (20-45%) + FORM (40-62%) + SHIMMER hold (62-72%)
  { toIndex: 1, start: 0.0, end: 0.72, ease: easeFloatAttractForm, label: 'FLOAT / ATTRACT / FORM / SHIMMER' },
  // DISSOLVE (72-84%) + TROPHY EMERGENCE (78-92%, overlapping)
  { toIndex: 2, start: 0.72, end: 0.92, ease: easeDissolveTrophy, label: 'DISSOLVE / TROPHY' },
  // Reserved for a later pass — video-frame morph, not part of this
  // motion redesign's scope (the brief for this pass ends at the trophy
  // + text reveal). Left in place so the stage model doesn't need to
  // change again when that pass happens.
  { toIndex: 3, start: 0.92, end: 1.0, ease: easeStandard, label: 'REVEAL' },
] as const;

export const AWARD_SEQUENCE = {
  stages: STAGES,

  // Dense & crisp direction (confirmed over the earlier sparse/magical
  // pivot) — thousands of small particles so the D/A letters, shield
  // edge and laurels read as genuinely dense, gapless detail instead of
  // a sparse scatter. Mobile scaled down from desktop for GPU headroom,
  // still far denser than the sparse-pass values.
  particleCount: {
    desktop: 11500,
    tablet: 6800,
    mobile: 3400,
  },

  // Base multiplier before the shader's size-tier spread. Brought back up
  // from the "tiny" pass now that density is doing the detail-resolving
  // work — at 10k particles, sizes this small would read as too faint;
  // roughly mirrors the tiny(0.7-1.2x)/medium(1.2-1.6x)/highlight(1.6-2.2x)
  // mixture explicitly requested.
  particleSize: {
    desktop: 1.25,
    tablet: 1.1,
    mobile: 0.95,
  },

  // ~93% dot (the 75% tiny + 15% larger-luminous tiers are split inside
  // the vertex shader's size-tier logic), ~7% renders as the star sprite
  // (elegant sparkles). The fragment shader's `hasGlow` gives a further
  // ~8% of particles a soft halo on top — the "3% soft glow" category —
  // applied as a treatment rather than a separate sprite slot.
  // softOrb/streak are unused; kept at 0 rather than removed so
  // buildParticleSeeds' signature doesn't need to change.
  spriteDistribution: {
    dot: 0.93,
    star: 0.07,
    softOrb: 0,
    streak: 0,
  },

  // Depth layers — literal Z placement bands (not just size/brightness),
  // so "background moves less, foreground moves more" is a real spatial
  // fact, not an illusion. Fractions must sum to 1.
  layers: {
    backgroundFraction: 0.45,
    midgroundFraction: 0.4,
    foregroundFraction: 0.15,
    backgroundZ: [-7, -4.5] as [number, number],
    midgroundZ: [-4, -1.5] as [number, number],
    foregroundZ: [-1, 1.2] as [number, number],
    // Idle-drift and scroll-parallax speed multipliers per layer.
    backgroundDrift: 0.5,
    midgroundDrift: 1.0,
    foregroundDrift: 1.7,
  },

  // Five-way weighted light-blue mixture. Rebalanced toward the deeper
  // tones ("make it as good as possible" polish pass) — the original
  // 45/20/15/10/10 split leaned too far toward pale/near-white, which
  // washed out contrast against the cream background. Weights are baked
  // into the fragment shader's pickColor() cumulative thresholds
  // (0.40/0.65/0.80/0.88) — keep the two in sync if these ever change.
  colors: {
    rich: hexToRgb('#5AA9E6'), // 40% — clear light-medium blue
    warm: hexToRgb('#3D7FC4'), // 25% — deeper blue, for contrast/depth
    champagne: hexToRgb('#8ECBF0'), // 15% — light sky blue
    highlight: hexToRgb('#BFE3FA'), // 8% — near-white ice blue, kept as a minority accent
    bronze: hexToRgb('#20487A'), // 12% — deep navy, grounds the mix, deepened slightly
    background: '#F5F0E8',
  },

  // Push-in is deliberately tiny — "approximately 2-4%, do NOT
  // aggressively zoom." Applied identically across stages so logo and
  // trophy read at consistent scale.
  camera: {
    desktop: { fov: 45, z: 7.2, driftPx: 0.35, pushInStart: 6, pushInEnd: 5.82 },
    tablet: { fov: 45, z: 8.4, driftPx: 0.2, pushInStart: 6.6, pushInEnd: 6.4 },
    mobile: { fov: 48, z: 9.6, driftPx: 0, pushInStart: 7.2, pushInEnd: 6.98 },
  },

  // The logo formation's on-screen bounding box, expressed the same way
  // CSS would (vw/vh capped by an absolute px ceiling) — see
  // computeLogoWorldBounds below for how this becomes a world-space size
  // via the camera's own perspective projection, so the logo ALWAYS fits
  // regardless of the visitor's actual viewport shape.
  logoFit: {
    desktop: { maxWidthVw: 0.58, maxWidthPx: 700, maxHeightVh: 0.68, maxHeightPx: 700 },
    tablet: { maxWidthVw: 0.68, maxWidthPx: 580, maxHeightVh: 0.62, maxHeightPx: 580 },
    mobile: { maxWidthVw: 0.8, maxWidthPx: Infinity, maxHeightVh: 0.6, maxHeightPx: Infinity },
  },

  // Desktop-only, real pointer devices only — see AwardParticleScene's
  // pointermove wiring, which no-ops on touch/coarse pointers.
  mouseParallax: {
    maxPx: 10, // "maximum movement should only be around 5-12px"
    ease: 0.05,
  },

  // Small, deliberate rotation applied to the trophy shape only, keyed to
  // stage-2 local progress — never continuous spin.
  trophyTiltDeg: 2.4,

  // "Magical, luminous" tuning — orbiting particles, shimmer, the
  // one-shot settle pulse, and staggered attract/dissolve timing.
  magic: {
    orbitFraction: 0.18,
    orbitRadiusMin: 0.35,
    orbitRadiusMax: 1.1,
    orbitSpeed: 0.12,
    shimmerSpeed: 0.9,
    shimmerMin: 0.3,
    shimmerMax: 1.0,
    pulseDurationSec: 0.75,
    // How much a particle's own start distance delays its attraction /
    // dissolve departure — larger = more staggering, closer-to-zero =
    // everything moves in lockstep (which the brief explicitly does not want).
    staggerStrength: 0.35,
  },

  sectionHeightVh: 480,
  background: '#F5F0E8',

  scrub: 1,

  /** Dev-only progress/stage HUD — see AwardSequence.tsx. Never shown in production. */
  debugHud: import.meta.env.DEV,
} as const;

export type ShapeIndex = 0 | 1 | 2 | 3;

export interface ResolvedStage {
  fromIndex: ShapeIndex;
  toIndex: ShapeIndex;
  /** Eased local progress within the current stage, 0-1. */
  localT: number;
  /** Which STAGES entry this came from — useful for typography/camera keying. */
  stageIndex: number;
  /** Raw (un-eased) 0-1 scroll progress, for anything that wants the true position. */
  rawProgress: number;
}

/**
 * Pure function: raw 0-1 scroll progress -> which two shapes we're
 * morphing between and how far along. No React, no side effects —
 * shared by ParticleMorphSystem (shader uniforms), the HTML text overlay,
 * and AwardParticleScene (camera).
 */
export function resolveAwardStage(progress: number): ResolvedStage {
  const clamped = clamp01(progress);
  const stages = AWARD_SEQUENCE.stages;

  let stageIndex = stages.findIndex((s) => clamped <= s.end);
  if (stageIndex === -1) stageIndex = stages.length - 1;

  const stage = stages[stageIndex];
  const fromIndex: ShapeIndex = stageIndex === 0 ? 0 : stages[stageIndex - 1].toIndex;
  const span = stage.end - stage.start || 1;
  const raw = (clamped - stage.start) / span;
  const localT = stage.ease(clamp01(raw));

  return { fromIndex, toIndex: stage.toIndex, localT, stageIndex, rawProgress: clamped };
}

export type CameraTier = keyof typeof AWARD_SEQUENCE.camera;

/**
 * Converts the CSS-like "min(58vw, 700px) x min(68vh, 700px)" bounding box
 * from logoFit into an actual world-space width/height, using the
 * camera's own perspective projection at its SETTLED distance (pushInEnd
 * — the distance the logo is actually judged at during its hero hold, not
 * the pre-push-in starting distance).
 *
 * This is what makes the logo fit ANY viewport shape: 1 screen pixel
 * covers a different amount of world-space depending on viewport height
 * and camera distance, so the px/vw/vh caps have to be converted through
 * that relationship rather than treated as world units directly.
 */
export function computeLogoWorldBounds(tier: CameraTier, viewportWidthPx: number, viewportHeightPx: number) {
  const cam = AWARD_SEQUENCE.camera[tier];
  const fit = AWARD_SEQUENCE.logoFit[tier];
  const distance = cam.pushInEnd;
  const fovRad = (cam.fov * Math.PI) / 180;
  const worldVisibleHeight = 2 * distance * Math.tan(fovRad / 2);
  const worldPerPixel = worldVisibleHeight / viewportHeightPx;

  const maxWidthPx = Math.min(fit.maxWidthVw * viewportWidthPx, fit.maxWidthPx);
  const maxHeightPx = Math.min(fit.maxHeightVh * viewportHeightPx, fit.maxHeightPx);

  return {
    maxWorldWidth: maxWidthPx * worldPerPixel,
    maxWorldHeight: maxHeightPx * worldPerPixel,
  };
}

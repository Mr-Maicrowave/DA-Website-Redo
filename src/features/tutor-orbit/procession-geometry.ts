/**
 * The Procession — a single shallow ring seen at a low camera angle.
 *
 * Everything a node renders is derived from one number: its angle theta.
 * Depth d = (sin theta + 1) / 2, and position, size, filters, label opacity
 * and z-index all fall out of d. Because z comes from the same value as
 * position, a node crosses the featured educator's plane at exactly
 * theta 0 and 180 and can never sort inconsistently with where it is drawn.
 */

export type ProcessionBand = 'wide' | 'desktop' | 'tablet' | 'mobile';

export interface StageBox {
  width: number;
  height: number;
}

/** Authored geometry at scale 1, in px relative to the ring centre. */
export interface ProcessionBase {
  rx: number;
  ry: number;
  featuredSize: number;
  /** Featured portrait centre, relative to the ring centre (negative = above). */
  featuredY: number;
  nodeMin: number;
  nodeSpan: number;
  /** Fraction of a node's height that sits below the ring line, so it reads as standing on it. */
  seat: number;
  stations: number;
  periodSeconds: number;
  /** Name plate band, as fractions of featuredSize measured down from the portrait centre. */
  plateTop: number;
  plateHeight: number;
}

export const PROCESSION_BASE: Record<ProcessionBand, ProcessionBase> = {
  wide: {
    rx: 552, ry: 172, featuredSize: 524, featuredY: -216,
    nodeMin: 78, nodeSpan: 74, seat: 0.26,
    stations: 8, periodSeconds: 78, plateTop: 0.2, plateHeight: 0.17,
  },
  desktop: {
    rx: 510, ry: 160, featuredSize: 486, featuredY: -200,
    nodeMin: 74, nodeSpan: 70, seat: 0.26,
    stations: 8, periodSeconds: 78, plateTop: 0.2, plateHeight: 0.17,
  },
  tablet: {
    rx: 372, ry: 112, featuredSize: 372, featuredY: -152,
    nodeMin: 64, nodeSpan: 58, seat: 0.24,
    stations: 6, periodSeconds: 72, plateTop: 0.2, plateHeight: 0.17,
  },
  /* On a phone the ring becomes a shallow crescent below the featured educator
     rather than a circle around them: same mechanism, far fewer bodies. */
  mobile: {
    rx: 150, ry: 44, featuredSize: 260, featuredY: -170,
    nodeMin: 46, nodeSpan: 34, seat: 0.15,
    stations: 3, periodSeconds: 66, plateTop: 0.16, plateHeight: 0.22,
  },
};

/** Depth ramps. Rear portraits stay recognisable — below ~0.5 opacity occlusion stops reading as occlusion. */
export const DEPTH = {
  opacity: [0.55, 1] as const,
  saturate: [0.55, 1] as const,
  brightness: [0.78, 1] as const,
  contrast: [0.88, 1] as const,
  /** Hard ceiling. Anything heavier reads as a rendering fault, not as distance. */
  blurCeiling: 1.2,
  blurSlope: 1.5,
  labelFloor: 0.62,
  labelRamp: 0.12,
};

export const STAGE_PADDING = { x: 26, y: 44 };
export const MIN_SCALE = 0.45;
export const MAX_SCALE = 1;

export interface RingGeometry extends ProcessionBase {
  band: ProcessionBand;
  scale: number;
  /** Ring centre offset from the stage centre, so the whole assembly sits optically centred. */
  originY: number;
}

export interface NodePose {
  theta: number;
  depth: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  blur: number;
  saturate: number;
  brightness: number;
  contrast: number;
  labelOpacity: number;
  z: number;
}

export function processionBandForWidth(width: number): ProcessionBand {
  if (width >= 1600) return 'wide';
  if (width >= 1200) return 'desktop';
  if (width >= 721) return 'tablet';
  return 'mobile';
}

function lerp(range: readonly [number, number], t: number) {
  return range[0] + (range[1] - range[0]) * t;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Vertical extent of the whole assembly at scale 1: featured top to the front node's feet. */
export function assemblyExtent(base: ProcessionBase) {
  const frontSize = base.nodeMin + base.nodeSpan;
  return {
    top: base.featuredY - base.featuredSize / 2,
    bottom: base.ry + frontSize * (1 - base.seat),
  };
}

export function ringGeometryFor(band: ProcessionBand, stage: StageBox): RingGeometry {
  const base = PROCESSION_BASE[band];
  const extent = assemblyExtent(base);
  const naturalWidth = 2 * (base.rx + (base.nodeMin + base.nodeSpan) / 2);
  const naturalHeight = extent.bottom - extent.top;
  const scale = clamp(
    Math.min(
      (stage.width - STAGE_PADDING.x * 2) / naturalWidth,
      (stage.height - STAGE_PADDING.y * 2) / naturalHeight,
    ),
    MIN_SCALE,
    MAX_SCALE,
  );

  return {
    ...base,
    band,
    scale,
    originY: -((extent.top + extent.bottom) / 2) * scale,
  };
}

export function normaliseAngle(deg: number) {
  return ((deg % 360) + 360) % 360;
}

export function stationBaseAngle(index: number, stations: number, phaseDeg = 0) {
  return phaseDeg + (index * 360) / stations;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * How far the roster window advances each time a station passes dead rear.
 *
 * Two constraints fight each other. Duplicates appear when two station indices
 * differ by exactly poolSize - stride, so the stride must stay at or below
 * poolSize - stations. Coverage stalls unless the stride is coprime with the
 * pool. Take the largest stride that satisfies both, so the whole faculty
 * cycles through in as few revolutions as possible.
 */
export function handoverStride(stations: number, poolSize: number) {
  if (poolSize <= 1) return 1;
  const ceiling = Math.max(1, Math.min(poolSize - stations, poolSize - 1));
  for (let stride = ceiling; stride >= 1; stride -= 1) {
    if (gcd(stride, poolSize) === 1) return stride;
  }
  return 1;
}

/**
 * Which roster entry a station is carrying. A station hands over to another
 * educator each time it passes dead rear (theta 270), so cohorts swap inside
 * the occluded zone and every educator eventually reaches the front arc.
 */
export function occupantIndex(
  stationIndex: number,
  stations: number,
  baseAngle: number,
  rotationDeg: number,
  poolSize: number,
) {
  if (poolSize <= 0) return 0;
  const turn = Math.floor((baseAngle + rotationDeg - 270) / 360);
  const raw = stationIndex + turn * handoverStride(stations, poolSize);
  return ((raw % poolSize) + poolSize) % poolSize;
}

export function poseAt(theta: number, ring: RingGeometry): NodePose {
  const angle = normaliseAngle(theta);
  const radians = (angle * Math.PI) / 180;
  const depth = (Math.sin(radians) + 1) / 2;
  const size = (ring.nodeMin + ring.nodeSpan * depth) * ring.scale;
  const ringY = ring.ry * ring.scale * Math.sin(radians);

  return {
    theta: angle,
    depth,
    x: ring.rx * ring.scale * Math.cos(radians),
    y: ringY - size * ring.seat,
    size,
    opacity: lerp(DEPTH.opacity, depth),
    blur: Math.min(DEPTH.blurCeiling, (1 - depth) * DEPTH.blurSlope) * ring.scale,
    saturate: lerp(DEPTH.saturate, depth),
    brightness: lerp(DEPTH.brightness, depth),
    contrast: lerp(DEPTH.contrast, depth),
    labelOpacity: clamp((depth - DEPTH.labelFloor) / DEPTH.labelRamp, 0, 1),
    z: Math.round(depth * 1000),
  };
}

/** The featured portrait sits at z 500, so depth > 0.5 draws in front of it. */
export const FEATURED_Z = 500;

export function platePosition(ring: RingGeometry) {
  return {
    top: (ring.featuredY + ring.featuredSize * ring.plateTop) * ring.scale,
    height: ring.featuredSize * ring.plateHeight * ring.scale,
  };
}

/** Top edge of a node at its nearest point — the plate must clear this. */
export function frontNodeTop(ring: RingGeometry) {
  const frontSize = (ring.nodeMin + ring.nodeSpan) * ring.scale;
  return (ring.ry * ring.scale) - frontSize * (ring.seat + 0.5);
}

export interface CollisionRules {
  /** Two named educators must never crowd each other horizontally. */
  labelGap: number;
  /**
   * Overlap only reads as depth when one portrait is clearly larger than the
   * other. Below this size ratio the pair must not overlap at all, or it reads
   * as a layout fault rather than as one educator standing behind another.
   */
  depthSizeRatio: number;
  overlapGap: number;
}

export const COLLISION_RULES: CollisionRules = {
  labelGap: 150,
  depthSizeRatio: 1.35,
  overlapGap: 12,
};

export function nodesCollide(
  a: NodePose,
  b: NodePose,
  scale: number,
  rules: CollisionRules = COLLISION_RULES,
): boolean {
  if (a.labelOpacity > 0 && b.labelOpacity > 0) {
    if (Math.abs(a.x - b.x) < rules.labelGap * scale) return true;
  }
  const ratio = Math.max(a.size, b.size) / Math.min(a.size, b.size);
  if (ratio < rules.depthSizeRatio) {
    const needed = (a.size + b.size) / 2 * 0.92 + rules.overlapGap * scale;
    if (Math.hypot(a.x - b.x, a.y - b.y) < needed) return true;
  }
  return false;
}

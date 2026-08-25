import type { OrbitTier } from './tutor-orbit-config';

export type GeometryBand = 'wide' | 'desktop' | 'tablet' | 'mobile';

export interface OrbitPose {
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

export interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface SafeSector {
  id: string;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  phase: number;
  scale: [number, number];
  opacity: [number, number];
  labelSide: 'top' | 'bottom' | 'left' | 'right';
}

export interface ProtectedZones {
  innerDiameter: number;
  outerDiameter: number;
  centre: Bounds;
  profile: Bounds;
  headline: Bounds;
}

export function geometryBandForWidth(width: number): GeometryBand {
  if (width >= 1600) return 'wide';
  if (width >= 1200) return 'desktop';
  if (width >= 721) return 'tablet';
  return 'mobile';
}

export function poseForSector(sector: SafeSector, progress: number): OrbitPose {
  const angle = (progress + sector.phase) * Math.PI * 2;
  const depth = (Math.sin(angle) + 1) / 2;
  return {
    x: sector.x + Math.cos(angle) * sector.driftX + Math.sin(angle * 2) * sector.driftX * 0.16,
    y: sector.y + Math.sin(angle) * sector.driftY + Math.cos(angle * 2) * sector.driftY * 0.12,
    scale: sector.scale[0] + (sector.scale[1] - sector.scale[0]) * depth,
    opacity: sector.opacity[0] + (sector.opacity[1] - sector.opacity[0]) * depth,
  };
}

export function boundsForPose(pose: OrbitPose, diameter: number): Bounds {
  const radius = diameter * pose.scale / 2;
  return { left: pose.x - radius, top: pose.y - radius, right: pose.x + radius, bottom: pose.y + radius };
}

/**
 * A conservative axis-aligned envelope for every pose in a sector. The
 * coefficients bound the two harmonic drift terms in poseForSector, while
 * max scale bounds the portrait footprint at every depth.
 */
export function boundsForSectorEnvelope(sector: SafeSector, diameter: number): Bounds {
  const radius = diameter * Math.max(...sector.scale) / 2;
  const extentX = Math.abs(sector.driftX) * 1.16 + radius;
  const extentY = Math.abs(sector.driftY) * 1.12 + radius;
  return {
    left: sector.x - extentX,
    top: sector.y - extentY,
    right: sector.x + extentX,
    bottom: sector.y + extentY,
  };
}

export function rectsOverlap(a: Bounds, b: Bounds, gap = 0): boolean {
  return !(a.right + gap <= b.left || a.left - gap >= b.right || a.bottom + gap <= b.top || a.top - gap >= b.bottom);
}

const wideInner = [[-230, -175], [0, -265], [185, -220], [185, 220], [-225, 190]] as const;
const wideOuter = [[-400, -80], [-340, -300], [-120, -365], [100, -365], [335, -300], [335, 320], [90, 375], [-140, 370], [-360, 280]] as const;
const desktopInner = [[-205, -155], [0, -235], [165, -200], [165, 200], [-205, 165]] as const;
const desktopOuter = [[-355, -85], [-295, -270], [-150, -325], [150, -330], [300, -280], [300, 305], [75, 340], [-125, 335], [-315, 245]] as const;

function makeSectors(
  band: GeometryBand,
  tier: OrbitTier,
  anchors: readonly (readonly [number, number])[],
  driftX: number,
  driftY: number,
  scale: [number, number],
  opacity: [number, number],
): SafeSector[] {
  return anchors.map(([x, y], index) => ({
    id: `${band}-${tier}-${index + 1}`,
    x,
    y,
    driftX,
    driftY,
    phase: (index + 1) / (anchors.length + 1),
    scale,
    opacity,
    labelSide: y < 0 ? 'bottom' : 'top',
  }));
}

const tabletInner = desktopInner.map(([x, y]) => [x * 1.2, y * 1.2] as const);
const tabletOuter = desktopOuter.slice(0, 6).map(([x, y]) => [x * 1.35, y * 1.3] as const);
const mobileInner = [[-190, -170], [190, -170], [190, 170], [-190, 170]] as const;
const mobileOuter = [[-280, -40], [280, -40], [300, 300], [-300, 300]] as const;

export const SAFE_SECTORS: Record<GeometryBand, Record<OrbitTier, SafeSector[]>> = {
  wide: {
    inner: makeSectors('wide', 'inner', wideInner, 10, 8, [0.96, 1.04], [0.88, 1]),
    outer: makeSectors('wide', 'outer', wideOuter, 12, 9, [0.84, 0.96], [0.48, 0.72]),
  },
  desktop: {
    inner: makeSectors('desktop', 'inner', desktopInner, 10, 8, [0.96, 1.04], [0.88, 1]),
    outer: makeSectors('desktop', 'outer', desktopOuter, 12, 9, [0.84, 0.96], [0.48, 0.72]),
  },
  tablet: {
    inner: makeSectors('tablet', 'inner', tabletInner, 6, 5, [0.92, 1], [0.82, 1]),
    outer: makeSectors('tablet', 'outer', tabletOuter, 7, 5, [0.8, 0.92], [0.42, 0.64]),
  },
  mobile: {
    inner: makeSectors('mobile', 'inner', mobileInner, 0, 0, [0.9, 1], [0.8, 1]),
    outer: makeSectors('mobile', 'outer', mobileOuter, 0, 0, [0.8, 0.9], [0.4, 0.6]),
  },
};

const desktopZones = (profileLeft: number): ProtectedZones => ({
  innerDiameter: 80,
  outerDiameter: 56,
  centre: { left: -110, top: -110, right: 110, bottom: 110 },
  profile: { left: profileLeft, top: -330, right: profileLeft + 310, bottom: 330 },
  headline: { left: -650, top: -250, right: -500, bottom: 190 },
});

export const PROTECTED_ZONES: Record<GeometryBand, ProtectedZones> = {
  wide: desktopZones(390),
  desktop: desktopZones(370),
  tablet: {
    innerDiameter: 104,
    outerDiameter: 82,
    centre: { left: -110, top: -110, right: 110, bottom: 110 },
    profile: { left: -220, top: 360, right: 220, bottom: 700 },
    headline: { left: -650, top: -250, right: -550, bottom: 190 },
  },
  mobile: {
    innerDiameter: 84,
    outerDiameter: 68,
    centre: { left: -110, top: -110, right: 110, bottom: 110 },
    profile: { left: -220, top: 300, right: 220, bottom: 620 },
    headline: { left: -650, top: -250, right: -500, bottom: 190 },
  },
};

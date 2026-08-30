import type { ShelfPose } from './tutor-book-geometry';

export type CompleteShelfBookMetrics = {
  boardThickness: number;
  boardRadius: number;
  spineWidth: number;
  pageInsetWidth: number;
  pageInsetHeight: number;
  leafCount: number;
  uniformScale: number;
};

export type CompleteShelfBookPose = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

export type CompleteShelfPrototypePlan = {
  shelf: CompleteShelfBookPose;
  cleared: CompleteShelfBookPose;
  preview: CompleteShelfBookPose;
};

export type CompleteShelfLeafLayout = {
  leafOrder: number;
  restZ: number;
  turnedZ: number;
  widthSegments: number;
  verticalSegments: number;
  surfaceCount: number;
};

const REFERENCE_HEIGHT = 1.58;
const REFERENCE_HALF_HEIGHT = REFERENCE_HEIGHT / 2;
const READING_SHELF_CLEARANCE = .1;
export const COMPLETE_SHELF_STUDIO_SHELF_TOP_Y = -.37;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export type CompleteShelfReadingEnvelope = {
  safeShelfY: number;
  rootPosition: [number, number, number];
  bookHalfHeight: number;
  turningLeafLowestY: number;
};

export type CompleteShelfReturnGeometry = {
  coverAngle: number;
  activePageTurnProgress: number;
  turningLeafOffset: number;
  turningLeafRotation: number;
  pageStackReseated: boolean;
};

export function getCompleteShelfReadingEnvelope(shelfTopY: number): CompleteShelfReadingEnvelope {
  const safeShelfY = shelfTopY + READING_SHELF_CLEARANCE;
  const rootY = safeShelfY + REFERENCE_HALF_HEIGHT + .24;
  return {
    safeShelfY,
    rootPosition: [0, rootY, .96],
    bookHalfHeight: REFERENCE_HALF_HEIGHT,
    turningLeafLowestY: rootY - REFERENCE_HALF_HEIGHT,
  };
}

export function isCompleteShelfReturnSafe(geometry: CompleteShelfReturnGeometry) {
  const tolerance = .0001;
  return Math.abs(geometry.coverAngle) <= tolerance
    && Math.abs(geometry.activePageTurnProgress) <= tolerance
    && Math.abs(geometry.turningLeafOffset) <= tolerance
    && Math.abs(geometry.turningLeafRotation) <= tolerance
    && geometry.pageStackReseated;
}

export function shouldRenderCompleteShelfLeaves(openAmount: number) {
  return openAmount > .08;
}

export type CompleteShelfLeafBounds = { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number };

export function isCompleteShelfLeafInsideClosedEnvelope(bounds: CompleteShelfLeafBounds) {
  const tolerance = .002;
  return bounds.minX >= -.455 - tolerance && bounds.maxX <= .455 + tolerance
    && bounds.minY >= -.72 - tolerance && bounds.maxY <= .72 + tolerance
    && bounds.minZ >= -.11 - tolerance && bounds.maxZ <= .11 + tolerance;
}

export type CompleteShelfPageTurnSample = {
  rotation: number;
  bow: number;
  twist: number;
};

/**
 * A compact, physically legible approximation of the Complete Shelf leaf curve.
 * The root hinge supplies the principal turn; this only adds the modest local curl
 * that stops the turning leaf reading as a rigid card.
 */
export function sampleCompleteShelfPageTurn(progress: number, acrossPage: number, vertical: number): CompleteShelfPageTurnSample {
  const turn = clamp01(progress);
  const u = clamp01(acrossPage);
  const v = Math.max(-1, Math.min(1, vertical * 2 - 1));
  const middleWeight = Math.sin(Math.PI * turn);
  const forwardBias = Math.sin(Math.PI * turn * .86);
  const constrainedDistance = Math.pow(u, 1.38);
  const bow = .056 * middleWeight * Math.sin(Math.PI * u) * (.52 + .48 * constrainedDistance);
  const twist = .018 * forwardBias * constrainedDistance * v * (turn < .62 ? 1 : 1 - (turn - .62) * 1.5);
  return {
    rotation: Math.PI * turn * constrainedDistance,
    bow,
    twist,
  };
}

const interpolatePose = (from: CompleteShelfBookPose, to: CompleteShelfBookPose, progress: number): CompleteShelfBookPose => {
  const t = clamp01(progress);
  const interpolate = (left: number, right: number) => left + (right - left) * t;
  return {
    position: from.position.map((value, index) => interpolate(value, to.position[index])) as CompleteShelfBookPose['position'],
    rotation: from.rotation.map((value, index) => interpolate(value, to.rotation[index])) as CompleteShelfBookPose['rotation'],
    scale: from.scale.map((value, index) => interpolate(value, to.scale[index])) as CompleteShelfBookPose['scale'],
  };
};

export function getCompleteShelfBookMetrics(shelfPose: ShelfPose): CompleteShelfBookMetrics {
  return {
    boardThickness: .032,
    boardRadius: .0045,
    spineWidth: .082,
    pageInsetWidth: .074,
    pageInsetHeight: .068,
    leafCount: 6,
    uniformScale: shelfPose.height / REFERENCE_HEIGHT,
  };
}

export function createCompleteShelfPrototypePlan(shelfPose: ShelfPose): CompleteShelfPrototypePlan {
  const { uniformScale } = getCompleteShelfBookMetrics(shelfPose);
  const scale: CompleteShelfBookPose['scale'] = [uniformScale, uniformScale, uniformScale];
  const shelf: CompleteShelfBookPose = { position: shelfPose.position, rotation: shelfPose.rotation, scale };
  const cleared: CompleteShelfBookPose = {
    position: [shelf.position[0], shelf.position[1] + .028, shelf.position[2] + 1.12],
    rotation: shelf.rotation,
    scale,
  };
  const preview: CompleteShelfBookPose = {
    position: [.12, .08, 4.82],
    rotation: [-.045, 0, .012],
    scale: [uniformScale * 3.6, uniformScale * 3.6, uniformScale * 3.6],
  };
  return { shelf, cleared, preview };
}

export function createCompleteShelfLeafLayout(): CompleteShelfLeafLayout[] {
  return Array.from({ length: 6 }, (_, pageIndex) => {
    const leafOrder = 5 - pageIndex;
    const restZ = .118 + pageIndex * .0015;
    return {
      leafOrder,
      restZ,
      turnedZ: .162 + leafOrder * .0015,
      widthSegments: 18,
      verticalSegments: 5,
      surfaceCount: 2,
    };
  });
}

export function sampleCompleteShelfPrototypePose(plan: CompleteShelfPrototypePlan, progress: number, direction: 'opening' | 'returning' = 'opening'): CompleteShelfBookPose {
  const t = direction === 'returning' ? 1 - clamp01(progress) : clamp01(progress);
  if (t <= .48) return interpolatePose(plan.shelf, plan.cleared, t / .48);
  return interpolatePose(plan.cleared, plan.preview, (t - .48) / .52);
}

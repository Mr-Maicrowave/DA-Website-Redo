import type { ShelfPose } from './tutor-book-geometry';

export type BookMotionPose = Pick<ShelfPose, 'position' | 'rotation'> & { scale: [number, number, number] };
export type BookMotionSegment = { from: BookMotionPose; to: BookMotionPose };
export type BookMotionTimelines = {
  shelf: BookMotionPose;
  extraction: BookMotionSegment;
  preview: BookMotionSegment;
  reading: BookMotionSegment;
};

export interface BookMotionTimingPolicy {
  reducedMotion: boolean;
  preserveSemanticPhases: true;
  roomTurnMs: number;
  hoverIntentMs: number;
  extractionMs: number;
  toReadingMs: number;
  openingMs: number;
  pageTurnMs: number;
  closingMs: number;
  resetMs: number;
  returnMs: number;
  pageRiffle: boolean;
}

export const cloneBookMotionPose = (pose: BookMotionPose): BookMotionPose => ({
  position: [...pose.position],
  rotation: [...pose.rotation],
  scale: [...pose.scale],
});

export function createBookMotionPoses(shelfPose: ShelfPose): BookMotionTimelines {
  const shelf: BookMotionPose = {
    position: [...shelfPose.position],
    rotation: [...shelfPose.rotation],
    scale: [1, 1, 1],
  };
  const extraction: BookMotionPose = {
    position: [shelf.position[0], shelf.position[1] + .03, shelf.position[2] + 1.12],
    rotation: [0, -.035, shelf.rotation[2]],
    scale: [1, 1, 1],
  };
  const preview: BookMotionPose = {
    position: [.12, .08, 4.82],
    rotation: [-.045, -.18, .012],
    scale: [3.2, 3.2, 3.2],
  };
  const reading: BookMotionPose = {
    position: [0, .48, 4.96],
    rotation: [-.045, 0, .012],
    scale: [3.2, 3.2, 3.2],
  };
  return {
    shelf,
    extraction: { from: cloneBookMotionPose(shelf), to: extraction },
    preview: { from: cloneBookMotionPose(extraction), to: preview },
    reading: { from: cloneBookMotionPose(preview), to: reading },
  };
}

export function createBookReturnMotion(sampledPose: BookMotionPose, shelfPose: BookMotionPose): BookMotionSegment {
  return {
    from: cloneBookMotionPose(sampledPose),
    to: cloneBookMotionPose(shelfPose),
  };
}

export function interpolateBookMotion(from: BookMotionPose, to: BookMotionPose, progress: number): BookMotionPose {
  const finiteProgress = Number.isFinite(progress) ? progress : 0;
  const t = Math.max(0, Math.min(1, finiteProgress));
  if (t === 0) return cloneBookMotionPose(from);
  if (t === 1) return cloneBookMotionPose(to);
  const interpolate = (left: number, right: number) => left + (right - left) * t;
  return {
    position: from.position.map((value, index) => interpolate(value, to.position[index])) as BookMotionPose['position'],
    rotation: from.rotation.map((value, index) => interpolate(value, to.rotation[index])) as BookMotionPose['rotation'],
    scale: from.scale.map((value, index) => interpolate(value, to.scale[index])) as BookMotionPose['scale'],
  };
}

export function createBookMotionTimingPolicy(reducedMotion: boolean): BookMotionTimingPolicy {
  if (reducedMotion) {
    return {
      reducedMotion: true,
      preserveSemanticPhases: true,
      roomTurnMs: 80,
      hoverIntentMs: 0,
      extractionMs: 0,
      toReadingMs: 0,
      openingMs: 120,
      pageTurnMs: 120,
      closingMs: 120,
      resetMs: 0,
      returnMs: 0,
      pageRiffle: false,
    };
  }

  return {
    reducedMotion: false,
    preserveSemanticPhases: true,
    roomTurnMs: 1600,
    hoverIntentMs: 90,
    extractionMs: 450,
    toReadingMs: 380,
    openingMs: 900,
    pageTurnMs: 760,
    closingMs: 760,
    resetMs: 180,
    returnMs: 560,
    pageRiffle: true,
  };
}

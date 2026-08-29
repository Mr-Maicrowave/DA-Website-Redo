import type { ShelfPose } from './tutor-book-geometry';

export type BookMotionPose = Pick<ShelfPose, 'position' | 'rotation'> & { scale: [number, number, number] };
export type BookMotionTimelines = {
  shelf: BookMotionPose;
  extraction: { from: BookMotionPose; to: BookMotionPose };
  preview: { from: BookMotionPose; to: BookMotionPose };
};

export function createBookMotionPoses(shelfPose: ShelfPose): BookMotionTimelines {
  const shelf: BookMotionPose = { position: shelfPose.position, rotation: shelfPose.rotation, scale: [1, 1, 1] };
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
  return { shelf, extraction: { from: shelf, to: extraction }, preview: { from: extraction, to: preview } };
}

export function interpolateBookMotion(from: BookMotionPose, to: BookMotionPose, progress: number): BookMotionPose {
  const t = Math.max(0, Math.min(1, progress));
  const interpolate = (left: number, right: number) => left + (right - left) * t;
  return {
    position: from.position.map((value, index) => interpolate(value, to.position[index])) as BookMotionPose['position'],
    rotation: from.rotation.map((value, index) => interpolate(value, to.rotation[index])) as BookMotionPose['rotation'],
    scale: from.scale.map((value, index) => interpolate(value, to.scale[index])) as BookMotionPose['scale'],
  };
}

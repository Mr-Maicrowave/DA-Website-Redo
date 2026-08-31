import type { CompleteShelfBookPose } from './complete-shelf-book-prototype.ts';
import { getFaceOutTutorShelfPose, getUniformTutorShelfPose } from './tutor-library-presentation.ts';
import { getSpotlightRestingPose } from './tutor-library-spotlight.ts';

export function getInitialTutorBookRestingPose({
  shelfPose,
  searchPose,
  faceOut,
  spotlight,
}: {
  shelfPose: CompleteShelfBookPose;
  searchPose?: CompleteShelfBookPose;
  faceOut: boolean;
  spotlight: boolean;
}): CompleteShelfBookPose {
  const normalPose = faceOut ? getFaceOutTutorShelfPose(shelfPose) : getUniformTutorShelfPose(shelfPose);
  return spotlight ? getSpotlightRestingPose(searchPose, normalPose) : normalPose;
}

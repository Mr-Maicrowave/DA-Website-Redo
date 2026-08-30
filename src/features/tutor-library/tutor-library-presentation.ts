import type { CatalogueTutor } from '../../data/teacherCatalogue.ts';
import type { TutorBookEdition } from './tutor-library-data.ts';
import type { CompleteShelfBookPose } from './complete-shelf-book-prototype.ts';

const roleWeight: Record<NonNullable<NonNullable<CatalogueTutor['presentation']>['featuredRole']>, number> = {
  manager: 0,
  'subject-lead': 1,
};

function stableDiscoveryOrder(id: string) {
  let value = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    value ^= id.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

/**
 * Reserves face-out places for explicitly verified roles, then fills the remaining
 * places with a stable discovery selection. Catalogue order and seniority are never inputs.
 */
export function selectFaceOutTutorEditionIds(
  editions: readonly TutorBookEdition[],
  tutors: ReadonlyMap<string, CatalogueTutor>,
  limit: number,
) {
  const count = Math.max(0, Math.trunc(limit));
  const ordered = [...editions].sort((left, right) => {
    const leftRole = tutors.get(left.tutorId)?.presentation?.featuredRole;
    const rightRole = tutors.get(right.tutorId)?.presentation?.featuredRole;
    const leftWeight = leftRole ? roleWeight[leftRole] : Number.POSITIVE_INFINITY;
    const rightWeight = rightRole ? roleWeight[rightRole] : Number.POSITIVE_INFINITY;
    return leftWeight - rightWeight
      || stableDiscoveryOrder(left.tutorId) - stableDiscoveryOrder(right.tutorId)
      || left.id.localeCompare(right.id);
  });
  return new Set(ordered.slice(0, count).map(edition => edition.id));
}

const FACE_OUT_TUTOR_SCALE = .64;

/**
 * Face-out books are a curated browsing layer, so their size is intentionally
 * independent of the varied spine scale used to create a lived-in shelf.
 */
export function getFaceOutTutorShelfPose(pose: CompleteShelfBookPose): CompleteShelfBookPose {
  return {
    position: [pose.position[0], pose.position[1] + .03, pose.position[2] + .2],
    rotation: [0, 0, 0],
    scale: [FACE_OUT_TUTOR_SCALE, FACE_OUT_TUTOR_SCALE, FACE_OUT_TUTOR_SCALE],
  };
}

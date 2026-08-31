import type { CatalogueTutor } from '../../data/teacherCatalogue.ts';
import type { TutorBookEdition } from './tutor-library-data.ts';
import type { CompleteShelfBookPose } from './complete-shelf-book-prototype.ts';
import { createCompleteShelfPrototypePlan } from './complete-shelf-book-prototype.ts';
import { getShelfPose } from './tutor-book-geometry.ts';
import { createCabinetBlueprint } from './room-architecture.ts';

const roleWeight: Record<NonNullable<NonNullable<CatalogueTutor['presentation']>['featuredRole']>, number> = {
  manager: 0,
  'subject-lead': 1,
};

function featuredWeight(tutor: CatalogueTutor | undefined) {
  if (tutor?.presentation?.featuredPriority === 'high') return 0;
  const role = tutor?.presentation?.featuredRole;
  return role ? roleWeight[role] + 1 : Number.POSITIVE_INFINITY;
}

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
    const leftWeight = featuredWeight(tutors.get(left.tutorId));
    const rightWeight = featuredWeight(tutors.get(right.tutorId));
    return leftWeight - rightWeight
      || stableDiscoveryOrder(left.tutorId) - stableDiscoveryOrder(right.tutorId)
      || left.id.localeCompare(right.id);
  });
  return new Set(ordered.slice(0, count).map(edition => edition.id));
}

/** Every tutor on the explicit prominence list keeps a face-forward cover. */
export function getExplicitFaceOutTutorEditionIds(
  editions: readonly TutorBookEdition[],
  tutors: ReadonlyMap<string, CatalogueTutor>,
) {
  return new Set(editions
    .filter(edition => {
      const presentation = tutors.get(edition.tutorId)?.presentation;
      return presentation?.featuredPriority === 'high';
    })
    .map(edition => edition.id));
}

export function selectCentredFaceOutTutorEditionIds(
  editions: readonly TutorBookEdition[],
  tutors: ReadonlyMap<string, CatalogueTutor>,
) {
  const explicit = getExplicitFaceOutTutorEditionIds(editions, tutors);
  return explicit;
}

export const FACE_OUT_TUTOR_SCALE = .72;

const FEATURED_SHELF_ROWS = [2, 1, 0] as const;

/**
 * Places curated face-out tutors in the physical centre bay, one per shelf,
 * filling vertically from the shelf beneath the subject heading downward.
 */
export function getFeaturedTutorColumnPose(index: number, count: number): CompleteShelfBookPose {
  const cabinet = createCabinetBlueprint(16.45, 5.8);
  const safeCount = Math.max(1, Math.trunc(count));
  const safeIndex = Math.min(Math.max(0, Math.trunc(index)), safeCount - 1);
  const rowCount = Math.min(FEATURED_SHELF_ROWS.length, safeCount);
  const tutorsPerRow = Array.from({ length: rowCount }, (_, rowIndex) =>
    Math.floor(safeCount / rowCount) + (rowIndex < safeCount % rowCount ? 1 : 0));
  let rowIndex = 0;
  let rowStartIndex = 0;
  while (safeIndex >= rowStartIndex + tutorsPerRow[rowIndex]!) {
    rowStartIndex += tutorsPerRow[rowIndex]!;
    rowIndex += 1;
  }
  const booksInRow = tutorsPerRow[rowIndex]!;
  const indexInRow = safeIndex - rowStartIndex;
  const row = FEATURED_SHELF_ROWS[rowIndex]!;
  const bay = cabinet.bays[1]!;
  const shelfY = cabinet.shelfLevels[row]! + cabinet.shelfThickness / 2;
  return {
    position: [bay.centerX + (indexInRow - (booksInRow - 1) / 2) * .86, shelfY + .57, bay.bookFrontZ + .05],
    rotation: [0, 0, 0],
    scale: [FACE_OUT_TUTOR_SCALE, FACE_OUT_TUTOR_SCALE, FACE_OUT_TUTOR_SCALE],
  };
}

const ORDINARY_SIDE_SLOTS = [0, 1, 2, 5, 6, 7] as const;
const ORDINARY_SHELF_CAPACITY = ORDINARY_SIDE_SLOTS.length * FEATURED_SHELF_ROWS.length;

/** Keeps non-featured books out of the centre bay reserved for approved covers. */
export function getOrdinaryTutorShelfPose(edition: TutorBookEdition, index: number): CompleteShelfBookPose | undefined {
  const safeIndex = Math.max(0, Math.trunc(index));
  if (safeIndex >= ORDINARY_SHELF_CAPACITY) return undefined;
  const shelfIndex = Math.floor(safeIndex / ORDINARY_SIDE_SLOTS.length);
  const slotIndex = ORDINARY_SIDE_SLOTS[safeIndex % ORDINARY_SIDE_SLOTS.length]!;
  return createCompleteShelfPrototypePlan(getShelfPose({ ...edition, shelfIndex, slotIndex })).shelf;
}

export function getUniformTutorShelfPose(pose: CompleteShelfBookPose): CompleteShelfBookPose {
  return {
    position: [...pose.position],
    rotation: [...pose.rotation],
    scale: [FACE_OUT_TUTOR_SCALE, FACE_OUT_TUTOR_SCALE, FACE_OUT_TUTOR_SCALE],
  };
}

/**
 * Face-out books are a curated browsing layer, so their size is intentionally
 * independent of the varied spine scale used to create a lived-in shelf.
 */
export function getFaceOutTutorShelfPose(pose: CompleteShelfBookPose): CompleteShelfBookPose {
  const uniformPose = getUniformTutorShelfPose(pose);
  return {
    position: [uniformPose.position[0], uniformPose.position[1] + .03, uniformPose.position[2] + .2],
    rotation: [0, 0, 0],
    scale: [FACE_OUT_TUTOR_SCALE, FACE_OUT_TUTOR_SCALE, FACE_OUT_TUTOR_SCALE],
  };
}

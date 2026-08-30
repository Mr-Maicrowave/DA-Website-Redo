import type { CatalogueTutor } from '../../data/teacherCatalogue.ts';
import type { CompleteShelfBookPose } from './complete-shelf-book-prototype.ts';
import { getShelfPose } from './tutor-book-geometry.ts';
import { createCabinetBlueprint } from './room-architecture.ts';
import type { TutorBookEdition } from './tutor-library-data.ts';

export type SpotlightResult = Readonly<{ tutor: CatalogueTutor; score: number }>;

const normalise = (value: string) => value
  .toLocaleLowerCase()
  .normalize('NFKD')
  .replace(/[–—]/g, '-')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const editDistanceAtMostOne = (left: string, right: string) => {
  if (left.length === right.length) {
    const mismatches = [...left].reduce<number[]>((indices, letter, index) => letter === right[index] ? indices : [...indices, index], []);
    if (mismatches.length === 2 && left[mismatches[0]] === right[mismatches[1]] && left[mismatches[1]] === right[mismatches[0]]) return true;
  }
  if (Math.abs(left.length - right.length) > 1) return false;
  let leftIndex = 0;
  let rightIndex = 0;
  let edits = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) { leftIndex += 1; rightIndex += 1; continue; }
    edits += 1;
    if (edits > 1) return false;
    if (left.length > right.length) leftIndex += 1;
    else if (right.length > left.length) rightIndex += 1;
    else { leftIndex += 1; rightIndex += 1; }
  }
  return true;
};

function hasNameMatch(name: string, term: string) {
  const words = normalise(name).split(' ');
  return words.some(word => word.includes(term) || (term.length >= 4 && editDistanceAtMostOne(word, term)));
}

export function searchTutorSpotlight(
  tutors: readonly CatalogueTutor[],
  query: string,
  getStrengths: (tutor: CatalogueTutor) => readonly string[],
): readonly SpotlightResult[] {
  const terms = normalise(query).split(' ').filter(Boolean);
  if (terms.length === 0) return [];
  return tutors.flatMap(tutor => {
    const name = normalise(tutor.name);
    const searchable = normalise([tutor.subjects, tutor.designation, tutor.tagline, ...getStrengths(tutor)].join(' '));
    let score = 0;
    for (const term of terms) {
      if (name.includes(term)) { score += 100; continue; }
      if (hasNameMatch(tutor.name, term)) { score += 80; continue; }
      if (searchable.includes(term)) { score += 20; continue; }
      return [];
    }
    return [{ tutor, score }];
  }).sort((left, right) => right.score - left.score || left.tutor.name.localeCompare(right.tutor.name));
}

export function getSpotlightResultWindow<T>(results: readonly T[], page: number, windowSize: number): readonly T[] {
  const size = Math.max(1, Math.trunc(windowSize));
  const maxPage = Math.max(0, results.length - size);
  const start = Math.max(0, Math.min(maxPage, Math.trunc(page)));
  return results.slice(start, start + size);
}

export function getSpotlightPageCount(resultCount: number, windowSize: number) {
  return Math.max(1, resultCount - Math.max(1, Math.trunc(windowSize)) + 1);
}

type SpotlightShelfSlot = Readonly<{ shelfIndex: number; x: number }>;

const TOP_SHELF_OUTWARD_X = [0, -.92, .92, -1.84, 1.84, -2.76, 2.76, -3.68, 3.68] as const;
const MIDDLE_SHELF_OUTWARD_X = [0, -.92, .92, -1.84, 1.84, -2.76, 2.76, -3.68, 3.68] as const;

/**
 * The search shelf is a presentation layer, not a mutation of a tutor's catalogue slot.
 * The order deliberately reads top-centre, then symmetric outward pairs, then the shelf below.
 */
export function getSpotlightSearchSlotOrder(limit = Number.POSITIVE_INFINITY): readonly SpotlightShelfSlot[] {
  const slots = [
    ...TOP_SHELF_OUTWARD_X.map(x => ({ shelfIndex: 1, x })),
    ...MIDDLE_SHELF_OUTWARD_X.map(x => ({ shelfIndex: 0, x })),
  ];
  return slots.slice(0, Math.max(0, Math.trunc(limit)));
}

/** The presentation pose wins while Spotlight is active; normal idle motion remains the fallback. */
export function getSpotlightRestingPose<T>(searchPose: T | undefined, normalIdlePose: T): T {
  return searchPose ?? normalIdlePose;
}

function getSearchSlot(index: number, resultCount: number): SpotlightShelfSlot {
  // A pair is deliberately centred around the hero zone rather than making one result look secondary.
  if (resultCount === 2) return { shelfIndex: 2, x: index === 0 ? -.46 : .46 };
  const slots = getSpotlightSearchSlotOrder();
  return slots[Math.max(0, Math.min(slots.length - 1, index))] ?? slots[0];
}

/** A transient, top-centre-first shelf arrangement. The edition's original shelf slot stays untouched. */
export function createSpotlightSearchPose(edition: TutorBookEdition, index: number, resultCount: number): CompleteShelfBookPose {
  const original = getShelfPose(edition);
  const cabinet = createCabinetBlueprint(16.45, 5.8);
  const slot = getSearchSlot(index, resultCount);
  const scale = original.height / 1.58;
  const shelfY = cabinet.shelfLevels[slot.shelfIndex] + cabinet.shelfThickness / 2;
  return {
    position: [slot.x, shelfY + original.height / 2, 1.02],
    rotation: [0, 0, 0],
    scale: [scale, scale, scale],
  };
}

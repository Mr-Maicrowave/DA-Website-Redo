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

type FieldMatch = Readonly<{ score: number; directName: boolean }>;

const EXACT_NAME = 1_000;
const PREFIX_NAME = 900;
const PARTIAL_NAME = 800;
const FUZZY_NAME = 700;
const EXACT_SUBJECT = 600;
const PREFIX_SUBJECT = 500;
const PARTIAL_SUBJECT = 400;
const PROFILE_TEXT = 200;

function findNameMatch(name: string, term: string): FieldMatch | undefined {
  const normalisedName = normalise(name);
  const words = normalisedName.split(' ');
  if (normalisedName === term || words.includes(term)) return { score: EXACT_NAME, directName: true };
  if (words.some(word => word.startsWith(term))) return { score: PREFIX_NAME, directName: true };
  if (words.some(word => word.includes(term))) return { score: PARTIAL_NAME, directName: false };
  if (term.length >= 4 && words.some(word => editDistanceAtMostOne(word, term))) return { score: FUZZY_NAME, directName: false };
  return undefined;
}

function findTextMatch(value: string, term: string, exactScore: number, prefixScore: number, partialScore: number): FieldMatch | undefined {
  const normalisedValue = normalise(value);
  const words = normalisedValue.split(' ').filter(Boolean);
  if (normalisedValue === term || words.includes(term)) return { score: exactScore, directName: false };
  if (words.some(word => word.startsWith(term))) return { score: prefixScore, directName: false };
  if (normalisedValue.includes(term)) return { score: partialScore, directName: false };
  return undefined;
}

function findTutorTermMatch(tutor: CatalogueTutor, term: string, strengths: readonly string[]): FieldMatch | undefined {
  const nameMatch = findNameMatch(tutor.name, term);
  if (nameMatch) return nameMatch;

  const subjectMatch = findTextMatch(tutor.subjects, term, EXACT_SUBJECT, PREFIX_SUBJECT, PARTIAL_SUBJECT);
  if (subjectMatch) return subjectMatch;

  return findTextMatch([tutor.designation, tutor.tagline, ...strengths].join(' '), term, PROFILE_TEXT, PROFILE_TEXT, PROFILE_TEXT);
}

export function searchTutorSpotlight(
  tutors: readonly CatalogueTutor[],
  query: string,
  getStrengths: (tutor: CatalogueTutor) => readonly string[],
): readonly SpotlightResult[] {
  const terms = normalise(query).split(' ').filter(Boolean);
  if (terms.length === 0) return [];
  const matches = tutors.flatMap(tutor => {
    const strengths = getStrengths(tutor);
    let score = 0;
    let isDirectNameResult = true;
    for (const term of terms) {
      const match = findTutorTermMatch(tutor, term, strengths);
      if (!match) return [];
      score += match.score;
      isDirectNameResult &&= match.directName;
    }
    return [{ tutor, score, isDirectNameResult }];
  });

  const authoritativeNameMatches = matches.filter(result => result.isDirectNameResult);
  const ranked = authoritativeNameMatches.length > 0 ? authoritativeNameMatches : matches;
  return ranked
    .sort((left, right) => right.score - left.score || left.tutor.name.localeCompare(right.tutor.name))
    .map(({ tutor, score }) => ({ tutor, score }));
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
    ...TOP_SHELF_OUTWARD_X.map(x => ({ shelfIndex: 2, x })),
    ...MIDDLE_SHELF_OUTWARD_X.map(x => ({ shelfIndex: 1, x })),
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

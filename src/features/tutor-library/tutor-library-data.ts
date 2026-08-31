import {
  teachesEnglish,
  teachesMath,
  teachesScience,
  type CatalogueTutor,
} from '../../data/teacherCatalogue.ts';

export type SubjectWallPalette = 'primary' | 'mathematics' | 'english' | 'science-social';

export interface SubjectWall {
  id: string;
  label: string;
  palette: SubjectWallPalette;
  matches: (tutor: CatalogueTutor) => boolean;
}

export interface TutorBookEdition {
  id: string;
  tutorId: string;
  wallId: string;
  shelfIndex: number;
  slotIndex: number;
  materialVariant: number;
}

export const teachesScienceSocial = (tutor: CatalogueTutor) =>
  teachesScience(tutor) || /Business|Legal/i.test(tutor.subjects);

export const SUBJECT_WALLS: SubjectWall[] = [
  { id: 'primary', label: 'Primary', palette: 'primary', matches: tutor => tutor.hasPrimary },
  { id: 'mathematics', label: 'Mathematics', palette: 'mathematics', matches: teachesMath },
  { id: 'english', label: 'English', palette: 'english', matches: teachesEnglish },
  { id: 'science-social', label: 'Science & Social Science', palette: 'science-social', matches: teachesScienceSocial },
];

export const getWallAngle = (index: number, count: number) => (index / count) * Math.PI * 2;

function getMaterialVariant(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 10;
}

const CENTRE_FIRST_SLOTS = [3, 4, 2, 5, 1, 6, 0, 7] as const;

function stableTutorOrder(id: string) {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) { hash ^= id.charCodeAt(index); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}

function normalShelfOrder(tutors: readonly CatalogueTutor[]) {
  return [...tutors].sort((left, right) => {
    const leftPriority = left.presentation?.featuredPriority === 'high' ? 0 : 1;
    const rightPriority = right.presentation?.featuredPriority === 'high' ? 0 : 1;
    return leftPriority - rightPriority || stableTutorOrder(left.id) - stableTutorOrder(right.id) || left.id.localeCompare(right.id);
  });
}

export function createTutorBookEditions(tutors: readonly CatalogueTutor[]): TutorBookEdition[] {
  return SUBJECT_WALLS.flatMap((wall) => {
    const matching = normalShelfOrder(tutors.filter(wall.matches));
    return matching.map((tutor, index) => ({
      id: `${tutor.id}:${wall.id}`,
      tutorId: tutor.id,
      wallId: wall.id,
      shelfIndex: Math.floor(index / 8),
      slotIndex: CENTRE_FIRST_SLOTS[index % CENTRE_FIRST_SLOTS.length]!,
      materialVariant: getMaterialVariant(`${tutor.id}:${wall.id}:${index}`),
    }));
  });
}

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

export function createTutorBookEditions(tutors: readonly CatalogueTutor[]): TutorBookEdition[] {
  return SUBJECT_WALLS.flatMap((wall) => {
    const matching = tutors.filter(wall.matches);
    return matching.map((tutor, index) => ({
      id: `${tutor.id}:${wall.id}`,
      tutorId: tutor.id,
      wallId: wall.id,
      shelfIndex: Math.floor(index / 8),
      slotIndex: index % 8,
      materialVariant: index % 4,
    }));
  });
}

export type MathsSyllabusStoryBeatId =
  | 'locate'
  | 'relate'
  | 'change'
  | 'accumulate'
  | 'extend'
  | 'explore';

export interface MathsSyllabusStoryBeat {
  id: MathsSyllabusStoryBeatId;
  eyebrow: string;
  course:
    | 'Mathematics Standard'
    | 'Mathematics Advanced'
    | 'Mathematics Extension 1'
    | 'Mathematics Extension 2';
  title: string;
  syllabusAnchor: string;
  plate: string;
  desktopProgress: number;
}

export const MATHS_SYLLABUS_STORY_BEATS = [
  {
    id: 'locate',
    eyebrow: 'Model',
    course: 'Mathematics Standard',
    title: 'Locate a relationship',
    syllabusAnchor: 'Linear relationships, measurement, networks and modelling.',
    plate: '01-model',
    desktopProgress: 0,
  },
  {
    id: 'relate',
    eyebrow: 'Relation',
    course: 'Mathematics Advanced',
    title: 'Let a path become a function',
    syllabusAnchor: 'Functions and graph transformations.',
    plate: '02-function',
    desktopProgress: 0.18,
  },
  {
    id: 'change',
    eyebrow: 'Change',
    course: 'Mathematics Advanced',
    title: 'Measure what changes',
    syllabusAnchor: 'Differential calculus.',
    plate: '03-tangent',
    desktopProgress: 0.36,
  },
  {
    id: 'accumulate',
    eyebrow: 'Accumulation',
    course: 'Mathematics Advanced',
    title: 'Gather what has changed',
    syllabusAnchor: 'Integral calculus and applications.',
    plate: '04-integral',
    desktopProgress: 0.54,
  },
  {
    id: 'extend',
    eyebrow: 'Motion',
    course: 'Mathematics Extension 1',
    title: 'Extend the plane',
    syllabusAnchor: 'Parametric equations, vectors and further calculus.',
    plate: '05-vectors',
    desktopProgress: 0.72,
  },
  {
    id: 'explore',
    eyebrow: 'New space',
    course: 'Mathematics Extension 2',
    title: 'Explore a richer structure',
    syllabusAnchor: 'Vectors, complex numbers, further integration, mechanics and proof.',
    plate: '06-structure',
    desktopProgress: 0.9,
  },
] as const satisfies readonly MathsSyllabusStoryBeat[];

export const STORY_SOURCE_NOTE = {
  standard: 'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-standard-11-12-2024/overview/course',
  advanced: 'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-advanced-11-12-2024/overview/course',
  extension1: 'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-extension-1-11-12-2024/outcomes',
  extension2: 'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-extension-2-11-12-2024/overview/course',
  pathwayClarification:
    'Mathematics Standard is a separate pathway and not a prerequisite for Mathematics Advanced, Extension 1 or Extension 2.',
} as const;

export function getStoryBeat(id: MathsSyllabusStoryBeatId): MathsSyllabusStoryBeat {
  const beat = MATHS_SYLLABUS_STORY_BEATS.find((candidate) => candidate.id === id);

  if (!beat) {
    throw new Error(`Unknown Maths syllabus story beat: ${id}`);
  }

  return beat;
}

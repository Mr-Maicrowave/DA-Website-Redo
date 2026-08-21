export type MathsTowerCopyGroupId =
  | 'years-7-8'
  | 'years-9-10'
  | 'standard'
  | 'advanced'
  | 'extension-1'
  | 'extension-2';

export interface MathsTowerCopyGroup {
  id: MathsTowerCopyGroupId;
  eyebrow: string;
  course: string;
  title: string;
  teaching: string;
  visualChapter: 'point' | 'curve' | 'plane' | 'space';
  progress: number;
}

export interface TowerRailPoint {
  progress: number;
  x: number;
  y: number;
  hidden: boolean;
}

export const MATHS_TOWER_COPY_GROUPS = [
  {
    id: 'years-7-8',
    eyebrow: 'Foundation',
    course: 'Years 7-8',
    title: 'Start with the point',
    teaching: 'Build confidence with number, algebra, geometry, measurement and data.',
    visualChapter: 'point',
    progress: 0,
  },
  {
    id: 'years-9-10',
    eyebrow: 'Connection',
    course: 'Years 9-10',
    title: 'Follow the relationship',
    teaching: 'Connect algebra, graphs, geometry, trigonometry and probability through problem-solving.',
    visualChapter: 'curve',
    progress: 0.18,
  },
  {
    id: 'standard',
    eyebrow: 'Senior pathway',
    course: 'Mathematics Standard',
    title: 'Apply mathematics in context',
    teaching: 'A separate senior pathway focused on practical mathematics, financial applications, measurement, networks and statistics.',
    visualChapter: 'curve',
    progress: 0.36,
  },
  {
    id: 'advanced',
    eyebrow: 'Senior pathway',
    course: 'Mathematics Advanced',
    title: 'Model change and structure',
    teaching: 'Build calculus, functions, trigonometry, sequences and probability for quantitative pathways.',
    visualChapter: 'plane',
    progress: 0.54,
  },
  {
    id: 'extension-1',
    eyebrow: 'Extension',
    course: 'Mathematics Extension 1',
    title: 'Extend the plane',
    teaching: 'Study alongside Advanced to deepen proof, vectors, combinatorics and further calculus.',
    visualChapter: 'plane',
    progress: 0.72,
  },
  {
    id: 'extension-2',
    eyebrow: 'Extension',
    course: 'Mathematics Extension 2',
    title: 'Explore richer space',
    teaching: 'In Year 12, extend Advanced and Extension 1 through complex numbers, mechanics, deeper integration and proof.',
    visualChapter: 'space',
    progress: 0.88,
  },
] as const satisfies readonly MathsTowerCopyGroup[];

export const TOWER_RAIL_POINTS = [
  { progress: 0, x: 52, y: 8, hidden: false },
  { progress: 0.14, x: 64, y: 19, hidden: false },
  { progress: 0.28, x: 44, y: 31, hidden: false },
  { progress: 0.42, x: 58, y: 43, hidden: true },
  { progress: 0.56, x: 48, y: 56, hidden: false },
  { progress: 0.7, x: 62, y: 68, hidden: true },
  { progress: 0.84, x: 47, y: 80, hidden: false },
  { progress: 0.94, x: 50, y: 91, hidden: false },
] as const satisfies readonly TowerRailPoint[];

export const LOGO_REVEAL_PROGRESS = 0.985;

export function getTowerCopyGroup(id: MathsTowerCopyGroupId): MathsTowerCopyGroup {
  const group = MATHS_TOWER_COPY_GROUPS.find((candidate) => candidate.id === id);
  if (!group) throw new Error(`Unknown maths tower copy group: ${id}`);
  return group;
}

export type TowerRailKind = 'rail' | 'landing';

export type TowerChapterId =
  | 'years-7-8'
  | 'years-9-10'
  | 'standard'
  | 'advanced'
  | 'extension-1'
  | 'extension-2';

export interface TowerRailPoint {
  progress: number;
  position: readonly [number, number, number];
  kind: TowerRailKind;
}

export interface TowerChapter {
  id: TowerChapterId;
  eyebrow: string;
  course: string;
  title: string;
  teaching: string;
  progress: number;
}

export interface TowerCameraPose {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
}

export interface TowerEndingProgress {
  towerOpacity: number;
  logoProgress: number;
}

interface CameraKeyframe extends TowerCameraPose {
  progress: number;
}

const TOWER_FADE_START_PROGRESS = 0.94;
const TOWER_FADE_COMPLETE_PROGRESS = 0.985;
const LOGO_REVEAL_START_PROGRESS = TOWER_FADE_COMPLETE_PROGRESS;

/**
 * The reading order is shared with the semantic story cards so the visual route
 * cannot imply that Mathematics Standard is a prerequisite for Advanced.
 */
export const TOWER_CHAPTERS: readonly TowerChapter[] = [
  {
    id: 'years-7-8',
    eyebrow: 'Foundation',
    course: 'Years 7-8',
    title: 'Start with the point',
    teaching: 'Build confidence with number, algebra, geometry, measurement and data.',
    progress: 0,
  },
  {
    id: 'years-9-10',
    eyebrow: 'Connection',
    course: 'Years 9-10',
    title: 'Follow the relationship',
    teaching: 'Connect algebra, graphs, geometry, trigonometry and probability through problem-solving.',
    progress: 0.18,
  },
  {
    id: 'standard',
    eyebrow: 'Senior pathway',
    course: 'Mathematics Standard',
    title: 'Apply mathematics in context',
    teaching: 'A separate senior pathway focused on practical mathematics, financial applications, measurement, networks and statistics.',
    progress: 0.36,
  },
  {
    id: 'advanced',
    eyebrow: 'Senior pathway',
    course: 'Mathematics Advanced',
    title: 'Model change and structure',
    teaching: 'Build calculus, functions, trigonometry, sequences and probability for quantitative pathways.',
    progress: 0.54,
  },
  {
    id: 'extension-1',
    eyebrow: 'Extension',
    course: 'Mathematics Extension 1',
    title: 'Extend the plane',
    teaching: 'Study alongside Advanced to deepen proof, vectors, combinatorics and further calculus.',
    progress: 0.72,
  },
  {
    id: 'extension-2',
    eyebrow: 'Extension',
    course: 'Mathematics Extension 2',
    title: 'Explore richer space',
    teaching: 'In Year 12, extend Advanced and Extension 1 through complex numbers, mechanics, deeper integration and proof.',
    progress: 0.88,
  },
] as const;

/**
 * Authored CatmullRomCurve3 control points, ordered from the upper tower to its
 * central landing. This is the sole geometry source for the rendered rail and ball.
 */
export const TOWER_RAIL_POINTS: readonly TowerRailPoint[] = [
  { progress: 0, position: [0.5, 5.8, 0], kind: 'rail' },
  { progress: 0.09, position: [1.55, 5.1, 0.85], kind: 'rail' },
  { progress: 0.18, position: [1.7, 4.15, -0.65], kind: 'rail' },
  { progress: 0.27, position: [0.48, 3.15, -1.62], kind: 'rail' },
  { progress: 0.36, position: [-1.18, 2.1, -1.2], kind: 'rail' },
  { progress: 0.45, position: [-1.7, 1.05, 0.25], kind: 'rail' },
  { progress: 0.54, position: [-0.83, 0.05, 1.48], kind: 'rail' },
  { progress: 0.63, position: [0.82, -1, 1.42], kind: 'rail' },
  { progress: 0.72, position: [1.5, -2.02, 0.08], kind: 'rail' },
  { progress: 0.81, position: [0.74, -3.02, -1.12], kind: 'rail' },
  { progress: 0.9, position: [-0.2, -4.7, 0.1], kind: 'rail' },
  { progress: 0.965, position: [0, -5.9, 0], kind: 'landing' },
] as const;

const TOWER_RAIL_CURVE = new CatmullRomCurve3(
  TOWER_RAIL_POINTS.map(({ position }) => new Vector3(...position)),
);

const CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  { progress: 0, position: [9.5, 6.1, 11.5], target: [0, 1.5, 0] },
  { progress: 0.42, position: [-10.2, 2.2, 9.4], target: [0, 0.25, 0] },
  { progress: 0.78, position: [8.4, -2.2, 10.8], target: [0, -2.7, 0] },
  { progress: 1, position: [0, -3.6, 12.8], target: [0, -5.9, 0] },
] as const;

function clampProgress(progress: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
}

function interpolatePosition(
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  amount: number,
): readonly [number, number, number] {
  return [
    from[0] + (to[0] - from[0]) * amount,
    from[1] + (to[1] - from[1]) * amount,
    from[2] + (to[2] - from[2]) * amount,
  ];
}

function findBounds<T extends { progress: number }>(points: readonly T[], progress: number): readonly [T, T] {
  const last = points.at(-1)!;
  if (progress <= points[0].progress) return [points[0], points[0]];
  if (progress >= last.progress) return [last, last];

  const upperIndex = points.findIndex((point) => point.progress >= progress);
  return [points[upperIndex - 1], points[upperIndex]];
}

function interpolationAmount(fromProgress: number, toProgress: number, progress: number): number {
  if (fromProgress === toProgress) return 0;
  return (progress - fromProgress) / (toProgress - fromProgress);
}

export function getRailPoint(progress: number): TowerRailPoint {
  const boundedProgress = clampProgress(progress);
  const point = TOWER_RAIL_CURVE.getPointAt(boundedProgress);

  return {
    progress: boundedProgress,
    position: [point.x, point.y, point.z],
    kind: boundedProgress >= TOWER_RAIL_POINTS.at(-1)!.progress ? 'landing' : 'rail',
  };
}

export function getCameraPose(progress: number): TowerCameraPose {
  const boundedProgress = clampProgress(progress);
  const [from, to] = findBounds(CAMERA_KEYFRAMES, boundedProgress);
  const amount = interpolationAmount(from.progress, to.progress, boundedProgress);

  return {
    position: interpolatePosition(from.position, to.position, amount),
    target: interpolatePosition(from.target, to.target, amount),
  };
}

export function getEndingProgress(progress: number): TowerEndingProgress {
  const boundedProgress = clampProgress(progress);
  const towerFadeAmount = clampProgress(
    (boundedProgress - TOWER_FADE_START_PROGRESS) / (TOWER_FADE_COMPLETE_PROGRESS - TOWER_FADE_START_PROGRESS),
  );
  const logoRevealAmount = clampProgress(
    (boundedProgress - LOGO_REVEAL_START_PROGRESS) / (1 - LOGO_REVEAL_START_PROGRESS),
  );

  return {
    towerOpacity: 1 - towerFadeAmount,
    logoProgress: logoRevealAmount,
  };
}
import { CatmullRomCurve3, Vector3 } from 'three';

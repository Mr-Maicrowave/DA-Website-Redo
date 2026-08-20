import { evaluateAst } from './evaluator.ts';
import type { ExprNode, GraphPoint, SampledGraph, Viewport } from './types.ts';

type EvaluatedSample = { x: number; y: number | null };
type PathSample = EvaluatedSample | null;

type SamplingOptions = {
  baseIntervals?: number;
  maxDepth?: number;
  maxSamples?: number;
  pixelTolerance?: number;
};

const mergeSamples = (left: PathSample[], right: PathSample[]) => {
  if (left.length === 0) return right;
  if (right.length === 0) return left;
  const leftLast = left[left.length - 1];
  const rightFirst = right[0];
  if (leftLast && rightFirst && leftLast.x === rightFirst.x && leftLast.y === rightFirst.y) {
    return [...left, ...right.slice(1)];
  }
  return [...left, ...right];
};

export const sampleExpression = (
  ast: ExprNode,
  viewport: Viewport,
  width: number,
  height: number,
  options: SamplingOptions = {},
): SampledGraph => {
  const baseIntervals = options.baseIntervals ?? 72;
  const maxDepth = options.maxDepth ?? 10;
  const maxSamples = options.maxSamples ?? 2400;
  const pixelTolerance = options.pixelTolerance ?? 0.8;
  const xSpan = viewport.xMax - viewport.xMin;
  const ySpan = viewport.yMax - viewport.yMin;
  const cache = new Map<number, EvaluatedSample>();
  let hitBudget = false;

  const sample = (x: number): EvaluatedSample => {
    const cached = cache.get(x);
    if (cached !== undefined) return cached;
    if (cache.size >= maxSamples) {
      hitBudget = true;
      return { x, y: null };
    }
    const y = evaluateAst(ast, x);
    const point = { x, y: Number.isFinite(y) ? y : null };
    cache.set(x, point);
    return point;
  };

  const toPixelY = (y: number) => height - ((y - viewport.yMin) / ySpan) * height;
  const refine = (left: EvaluatedSample, right: EvaluatedSample, depth: number): PathSample[] => {
    if (left.y === null || right.y === null) {
      if (depth >= maxDepth || hitBudget) return [left, null, right];
      const middle = sample((left.x + right.x) / 2);
      if (left.y === null && right.y === null && middle.y === null) return [null];
      if (left.y === null && middle.y === null) {
        return mergeSamples([null, middle], refine(middle, right, depth + 1));
      }
      if (middle.y === null && right.y === null) {
        return mergeSamples(refine(left, middle, depth + 1), [middle, null]);
      }
      return mergeSamples(refine(left, middle, depth + 1), refine(middle, right, depth + 1));
    }

    const middle = sample((left.x + right.x) / 2);
    if (middle.y === null) {
      if (depth >= maxDepth || hitBudget) return [left, null, right];
      return mergeSamples(refine(left, middle, depth + 1), refine(middle, right, depth + 1));
    }

    const linearMidpoint = (toPixelY(left.y) + toPixelY(right.y)) / 2;
    const curveError = Math.abs(toPixelY(middle.y) - linearMidpoint);
    const verticalJump = Math.abs(toPixelY(left.y) - toPixelY(right.y));
    const likelyDiscontinuity = verticalJump > height * 0.7 && curveError > height * 0.2;
    const allFarAbove = left.y > viewport.yMax + ySpan && middle.y > viewport.yMax + ySpan && right.y > viewport.yMax + ySpan;
    const allFarBelow = left.y < viewport.yMin - ySpan && middle.y < viewport.yMin - ySpan && right.y < viewport.yMin - ySpan;

    if (allFarAbove || allFarBelow) return [null];
    if ((curveError > pixelTolerance || likelyDiscontinuity) && depth < maxDepth && !hitBudget) {
      return mergeSamples(refine(left, middle, depth + 1), refine(middle, right, depth + 1));
    }
    if (likelyDiscontinuity) return [left, null, right];
    return [left, right];
  };

  let samples: PathSample[] = [];
  for (let index = 0; index < baseIntervals; index += 1) {
    const x1 = viewport.xMin + (index / baseIntervals) * xSpan;
    const x2 = viewport.xMin + ((index + 1) / baseIntervals) * xSpan;
    samples = mergeSamples(samples, refine(sample(x1), sample(x2), 0));
  }

  const segments: GraphPoint[][] = [];
  let current: GraphPoint[] = [];
  samples.forEach((point) => {
    if (!point || point.y === null) {
      if (current.length > 1) segments.push(current);
      current = [];
      return;
    }
    const last = current[current.length - 1];
    if (!last || last.x !== point.x || last.y !== point.y) current.push(point);
  });
  if (current.length > 1) segments.push(current);

  return { segments, sampleCount: cache.size, hitBudget };
};

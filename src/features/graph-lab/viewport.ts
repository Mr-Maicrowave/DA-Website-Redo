import type { Viewport } from './types.ts';

export const DEFAULT_VIEWPORT: Viewport = { xMin: -10, xMax: 10, yMin: -6, yMax: 6 };

export const formatViewportBound = (value: number) => Number(value.toFixed(2)).toString();

export const panViewport = (viewport: Viewport, xShift: number, yShift: number): Viewport => ({
  xMin: Number((viewport.xMin + xShift).toFixed(2)),
  xMax: Number((viewport.xMax + xShift).toFixed(2)),
  yMin: Number((viewport.yMin + yShift).toFixed(2)),
  yMax: Number((viewport.yMax + yShift).toFixed(2)),
});

const niceStep = (rawStep: number) => {
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / magnitude;
  const multiplier = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
  return multiplier * magnitude;
};

export const createTicks = (min: number, max: number, pixelLength: number, minimumSpacing = 64) => {
  const range = max - min;
  if (!Number.isFinite(range) || range <= 0) return [];
  const targetIntervals = Math.max(2, Math.floor(pixelLength / minimumSpacing));
  const step = niceStep(range / targetIntervals);
  const first = Math.ceil((min - step * 1e-9) / step) * step;
  const ticks: number[] = [];
  for (let value = first; value <= max + step * 1e-9 && ticks.length < 100; value += step) {
    const clean = Math.abs(value) < step * 1e-9 ? 0 : Number(value.toPrecision(12));
    ticks.push(clean);
  }
  return ticks;
};

export const formatTick = (value: number, step: number) => {
  if (value === 0) return '0';
  const decimals = Math.max(0, Math.min(6, -Math.floor(Math.log10(Math.abs(step))) + 1));
  return value.toFixed(decimals).replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, '').replace('-', '−');
};

export const validateViewport = (viewport: Viewport) => {
  if (Object.values(viewport).some((value) => !Number.isFinite(value))) return 'Use finite numbers for every boundary.';
  if (viewport.xMin >= viewport.xMax) return 'The minimum x-value must be smaller than the maximum.';
  if (viewport.yMin >= viewport.yMax) return 'The minimum y-value must be smaller than the maximum.';
  if (viewport.xMax - viewport.xMin < 0.0001 || viewport.yMax - viewport.yMin < 0.0001) return 'That view is too narrow to draw reliably.';
  return '';
};

const NICE_EXTENT_MULTIPLIERS = [1, 2, 2.5, 5];

const adjacentNiceExtent = (current: number, direction: 'in' | 'out') => {
  const exponent = Math.floor(Math.log10(current));
  const candidates: number[] = [];
  for (let power = exponent - 2; power <= exponent + 2; power += 1) {
    NICE_EXTENT_MULTIPLIERS.forEach((multiplier) => candidates.push(multiplier * (10 ** power)));
  }
  const ordered = [...new Set(candidates)].sort((a, b) => a - b);
  const epsilon = current * 1e-9;
  if (direction === 'in') {
    return ordered.filter((candidate) => candidate < current - epsilon).at(-1) ?? current / 2;
  }
  return ordered.find((candidate) => candidate > current + epsilon) ?? current * 2;
};

const cleanBound = (value: number) => Number(value.toPrecision(10));

export const zoomViewport = (viewport: Viewport, direction: 'in' | 'out'): Viewport => {
  const xCenter = (viewport.xMin + viewport.xMax) / 2;
  const yCenter = (viewport.yMin + viewport.yMax) / 2;
  const xRadius = adjacentNiceExtent((viewport.xMax - viewport.xMin) / 2, direction);
  const yRadius = adjacentNiceExtent((viewport.yMax - viewport.yMin) / 2, direction);
  return {
    xMin: cleanBound(xCenter - xRadius),
    xMax: cleanBound(xCenter + xRadius),
    yMin: cleanBound(yCenter - yRadius),
    yMax: cleanBound(yCenter + yRadius),
  };
};

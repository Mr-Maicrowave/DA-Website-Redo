const LANDSCAPE_STAGE_THRESHOLDS = [0.25, 0.55, 0.82] as const;

export const LANDSCAPE_PATH_TIMING = { start: 0.04, duration: 0.96 } as const;

export const getLandscapeJourneyStage = (progress: number): 0 | 1 | 2 | 3 => {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  if (clampedProgress >= LANDSCAPE_STAGE_THRESHOLDS[2]) return 3;
  if (clampedProgress >= LANDSCAPE_STAGE_THRESHOLDS[1]) return 2;
  if (clampedProgress >= LANDSCAPE_STAGE_THRESHOLDS[0]) return 1;
  return 0;
};

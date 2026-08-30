export type JourneyPhase =
  | "opening"
  | "departure"
  | "travel"
  | "approach"
  | "arrival";

export interface JourneyRange {
  start: number;
  end: number;
}

export const OPENING_RANGE: JourneyRange = { start: 0, end: 0.1 };
export const DEPARTURE_RANGE: JourneyRange = { start: 0.1, end: 0.2 };
export const TRAVEL_RANGE: JourneyRange = { start: 0.2, end: 0.65 };
export const APPROACH_RANGE: JourneyRange = { start: 0.65, end: 0.85 };
export const ARRIVAL_RANGE: JourneyRange = { start: 0.85, end: 1 };

export const clamp01 = (progress: number): number =>
  Math.min(1, Math.max(0, progress));

const getNormalizedProgress = (
  progress: number,
  range: JourneyRange,
): number => {
  const clampedProgress = clamp01(progress);
  return clamp01(
    (clampedProgress - range.start) / (range.end - range.start),
  );
};

export const getJourneyPhase = (progress: number): JourneyPhase => {
  const clampedProgress = clamp01(progress);

  if (clampedProgress < DEPARTURE_RANGE.start) return "opening";
  if (clampedProgress < TRAVEL_RANGE.start) return "departure";
  if (clampedProgress < APPROACH_RANGE.start) return "travel";
  if (clampedProgress < ARRIVAL_RANGE.start) return "approach";
  return "arrival";
};

export const getCharacterScreenProgress = (progress: number): number =>
  getNormalizedProgress(progress, {
    start: OPENING_RANGE.start,
    end: TRAVEL_RANGE.start,
  });

export const getWorldTravelProgress = (progress: number): number =>
  getNormalizedProgress(progress, {
    start: TRAVEL_RANGE.start,
    end: ARRIVAL_RANGE.end,
  });

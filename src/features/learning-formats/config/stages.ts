/**
 * STAGE CONFIG
 *
 * Year → stage mapping and school-year list.
 * Edit the year groupings here if DA's stage boundaries ever change.
 */

import type { LearningStage } from "../logic/types.ts";

export const SCHOOL_YEARS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

interface StageRange {
  stage: LearningStage;
  label: string;
  minYear: number;
  maxYear: number;
}

export const STAGE_RANGES: StageRange[] = [
  { stage: "primary", label: "Primary", minYear: 1, maxYear: 6 },
  { stage: "high-school", label: "High School", minYear: 7, maxYear: 10 },
  { stage: "hsc", label: "HSC", minYear: 11, maxYear: 12 },
];

export function stageForYear(year: number | null): LearningStage | null {
  if (year == null) return null;
  const match = STAGE_RANGES.find((r) => year >= r.minYear && year <= r.maxYear);
  return match ? match.stage : null;
}

export function stageLabel(stage: LearningStage | null): string {
  return STAGE_RANGES.find((r) => r.stage === stage)?.label ?? "";
}

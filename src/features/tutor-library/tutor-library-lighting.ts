import { createCabinetBlueprint } from './room-architecture.ts';

export type CaseLightStrip = {
  row: number;
  y: number;
  z: number;
  width: number;
  height: number;
  intensity: number;
};

/**
 * Rect-area strips sit under each shelf board and are aimed down and slightly back into the case,
 * so a spine is bright at the head and falls into shadow at the tail. That vertical gradient is the
 * cue that was missing while the room ran on ambient plus hemisphere fill.
 */
export const CASE_STRIP_TILT_X = -Math.PI / 2 + 0.34;

/** One strip per shelf board that has books standing beneath it (the lowest board carries, never lights). */
export function createCaseLightPlan(width: number, height: number): CaseLightStrip[] {
  const cabinet = createCabinetBlueprint(width, height);
  return cabinet.shelfLevels.slice(1).map((level, row) => ({
    row,
    y: level - cabinet.shelfThickness / 2 - 0.055,
    z: 0.46,
    width: width - cabinet.frameThickness * 2.6,
    height: 0.16,
    intensity: row === 1 ? 4.4 : 3.6,
  }));
}

/**
 * The strips and the shadow-casting key live on a single group that travels to the wall being viewed,
 * which keeps the scene's light count constant. Changing light count forces every material in the
 * scene to recompile, which would stall the turn.
 */
export function getIlluminationAngle(
  fromWallIndex: number,
  toWallIndex: number,
  progress: number,
  wallCount: number,
): number {
  if (!Number.isInteger(wallCount) || wallCount < 3) throw new Error('wallCount must be an integer of at least 3');
  const t = Math.max(0, Math.min(1, progress));
  let delta = toWallIndex - fromWallIndex;
  if (delta > wallCount / 2) delta -= wallCount;
  if (delta < -wallCount / 2) delta += wallCount;
  return (fromWallIndex + delta * t) * ((Math.PI * 2) / wallCount);
}

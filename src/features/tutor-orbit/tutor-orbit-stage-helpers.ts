import type { OrbitTier } from './tutor-orbit-config.ts';
import { SAFE_SECTORS, type GeometryBand } from './tutor-orbit-geometry.ts';

export function normalizeStagePointer(position: number, start: number, size: number) {
  if (!Number.isFinite(size) || size <= 0) return 0;
  const value = ((position - start) / size) * 2 - 1;
  return Math.max(-1, Math.min(1, value));
}

export function pruneTutorHoldKeys(holdKeys: ReadonlySet<string>, tutorId: string) {
  return new Set(
    [...holdKeys].filter((key) => key !== `hover:${tutorId}` && key !== `focus:${tutorId}`),
  );
}

export function tutorsForGeometryBand<T>(tutors: readonly T[], band: GeometryBand, tier: OrbitTier) {
  return tutors.slice(0, SAFE_SECTORS[band][tier].length);
}

export interface SelectionLockState {
  locked: boolean;
}

export function canBeginSelection(lock: SelectionLockState) {
  return !lock.locked;
}

export function transitionSelectionLock(
  lock: SelectionLockState,
  event: 'select' | 'idle' | 'cleanup',
): SelectionLockState {
  if (event === 'select') return lock.locked ? lock : { locked: true };
  return { locked: false };
}

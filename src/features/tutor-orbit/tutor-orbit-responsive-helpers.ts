import type { GeometryBand } from './tutor-orbit-geometry.ts';

export const NAVIGATOR_PAGE_SIZE = 4;
const SWIPE_CLICK_SUPPRESSION_MS = 400;

export interface NavigatorSwipeState {
  pointerId: number | null;
  x: number;
  y: number;
  captured: boolean;
  accepted: boolean;
  suppressClickUntil: number;
}

export type NavigatorSwipeResult =
  | { accepted: true; direction: 1 | -1; state: NavigatorSwipeState }
  | { accepted: false; direction: 0; state: NavigatorSwipeState };

export function supportingTutorIds(
  activeId: string,
  innerIds: readonly string[],
  outerIds: readonly string[],
) {
  return [...innerIds, ...outerIds].filter((id) => id !== activeId);
}

export function navigatorRosterStatus(total: number, page: number, pageSize = NAVIGATOR_PAGE_SIZE) {
  if (total <= 0) return 'Educators 0 of 0';
  const start = page * pageSize + 1;
  const finalContiguous = Math.min(start + pageSize - 1, total);
  const wrapped = start + pageSize - 1 - total;

  return wrapped > 0
    ? `Educators ${start}–${finalContiguous} and ${wrapped === 1 ? '1' : `1–${wrapped}`} of ${total}`
    : `Educators ${start}–${finalContiguous} of ${total}`;
}

export function shouldRunOrbitClocks(band: GeometryBand, reduced: boolean, paused: boolean) {
  return band !== 'mobile' && !reduced && !paused;
}

export function beginNavigatorSwipe(pointerId: number, x: number, y: number): NavigatorSwipeState {
  return { pointerId, x, y, captured: false, accepted: false, suppressClickUntil: 0 };
}

export function trackNavigatorSwipe(
  state: NavigatorSwipeState,
  pointerId: number,
  x: number,
  y: number,
): NavigatorSwipeResult {
  if (state.pointerId !== pointerId) return { accepted: false, direction: 0, state };
  if (state.accepted) return { accepted: false, direction: 0, state };
  const dx = x - state.x;
  const dy = y - state.y;
  const accepted = Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy);
  if (!accepted) return { accepted: false, direction: 0, state };
  return { accepted: true, direction: dx < 0 ? 1 : -1, state: { ...state, captured: true, accepted: true } };
}

export function finishNavigatorSwipe(state: NavigatorSwipeState, pointerId: number, now: number) {
  if (state.pointerId !== pointerId) return state;
  return {
    pointerId: null,
    x: 0,
    y: 0,
    captured: false,
    accepted: false,
    suppressClickUntil: state.accepted ? now + SWIPE_CLICK_SUPPRESSION_MS : 0,
  };
}

export function cancelNavigatorSwipe(state: NavigatorSwipeState, pointerId: number) {
  return state.pointerId === pointerId
    ? { pointerId: null, x: 0, y: 0, captured: false, accepted: false, suppressClickUntil: 0 }
    : state;
}

export function consumeNavigatorClickSuppression(state: NavigatorSwipeState, detail: number, now: number) {
  const suppressed = detail !== 0 && state.suppressClickUntil > now;
  return {
    suppressed,
    state: { ...state, suppressClickUntil: 0 },
  };
}

export function parallaxLimitsForBand(band: GeometryBand) {
  if (band === 'mobile') return { field: 0, halo: 0, geometry: 0 };
  if (band === 'tablet') return { field: 2.5, halo: 4, geometry: 1.5 };
  return { field: 5, halo: 8, geometry: 3 };
}

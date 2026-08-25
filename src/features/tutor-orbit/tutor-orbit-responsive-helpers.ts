import type { GeometryBand } from './tutor-orbit-geometry.ts';

export const NAVIGATOR_PAGE_SIZE = 4;

export interface NavigatorSwipeState {
  pointerId: number | null;
  x: number;
  y: number;
  suppressNextClick: boolean;
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
    ? `Educators ${start}–${finalContiguous} and 1–${wrapped} of ${total}`
    : `Educators ${start}–${finalContiguous} of ${total}`;
}

export function beginNavigatorSwipe(pointerId: number, x: number, y: number): NavigatorSwipeState {
  return { pointerId, x, y, suppressNextClick: false };
}

export function resolveNavigatorSwipe(
  state: NavigatorSwipeState,
  pointerId: number,
  x: number,
  y: number,
): NavigatorSwipeResult {
  if (state.pointerId !== pointerId) return { accepted: false, direction: 0, state };
  const dx = x - state.x;
  const dy = y - state.y;
  const accepted = Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy);
  const nextState = { pointerId: null, x: 0, y: 0, suppressNextClick: accepted };
  if (!accepted) return { accepted: false, direction: 0, state: nextState };
  return { accepted: true, direction: dx < 0 ? 1 : -1, state: nextState };
}

export function cancelNavigatorSwipe(state: NavigatorSwipeState, pointerId: number) {
  return state.pointerId === pointerId
    ? { ...state, pointerId: null, x: 0, y: 0 }
    : state;
}

export function consumeNavigatorClickSuppression(state: NavigatorSwipeState) {
  return {
    suppressed: state.suppressNextClick,
    state: { ...state, suppressNextClick: false },
  };
}

export function parallaxLimitsForBand(band: GeometryBand) {
  if (band === 'mobile') return { field: 0, halo: 0, geometry: 0 };
  if (band === 'tablet') return { field: 2.5, halo: 4, geometry: 1.5 };
  return { field: 5, halo: 8, geometry: 3 };
}

export type OrbitTier = 'inner' | 'outer';

export type SelectionPhase = 'idle' | 'promoting' | 'exchanging';
export interface SelectionStep {
  phase: SelectionPhase;
  at: number;
}

export function selectionSequenceFor(tier: OrbitTier, reduced: boolean): SelectionStep[] {
  if (reduced) return [{ phase: 'exchanging', at: 0 }, { phase: 'idle', at: 160 }];
  if (tier === 'outer') {
    return [
      { phase: 'promoting', at: 0 },
      { phase: 'exchanging', at: 240 },
      { phase: 'idle', at: 1080 },
    ];
  }
  return [{ phase: 'exchanging', at: 0 }, { phase: 'idle', at: 960 }];
}

export function rosterWindow(ids: readonly string[], page: number, pageSize: number) {
  if (ids.length === 0) return [];
  const start = page * pageSize;
  return Array.from({ length: Math.min(pageSize, ids.length) }, (_, offset) => ids[(start + offset) % ids.length]);
}

export function nextRosterPage(page: number, direction: 1 | -1, total: number, pageSize: number) {
  const pages = Math.ceil(total / pageSize);
  return pages === 0 ? 0 : (page + direction + pages) % pages;
}

export const DEFAULT_FEATURED_TUTOR_ID = 'T003';

export const INNER_ORBIT_TUTOR_IDS = [
  'T011',
  'T005',
  'T010',
  'T012',
  'T015',
] as const;

export const OUTER_ORBIT_TUTOR_IDS = [
  'T001',
  'T002',
  'T009',
  'T004',
  'T006',
  'T007',
  'T008',
  'T013',
  'T014',
] as const;

export const INNER_ORBIT_DURATION_SECONDS = 52;
export const OUTER_ORBIT_DURATION_SECONDS = 86;

export const INNER_PHASE_OFFSETS = [0.02, 0.2, 0.41, 0.63, 0.84] as const;
export const OUTER_PHASE_OFFSETS = [
  0.01,
  0.105,
  0.225,
  0.34,
  0.465,
  0.59,
  0.705,
  0.82,
  0.925,
] as const;

export function orbitPoint(angle: number, tier: OrbitTier) {
  const outer = tier === 'outer';
  const radiusX = outer ? 288 : 258;
  const radiusY = outer ? 278 : 205;
  const wobbleX = Math.sin(angle * 3) * (outer ? 9 : 7) + Math.sin(angle * 5) * 3;
  const wobbleY = Math.cos(angle * 2) * (outer ? 8 : 6) + Math.sin(angle * 4) * 3;
  const tilt = outer ? -0.12 : 0.1;
  const x = Math.cos(angle) * (radiusX + wobbleX);
  const y = Math.sin(angle) * (radiusY + wobbleY);

  return {
    x: x * Math.cos(tilt) - y * Math.sin(tilt) - (outer ? 30 : 0),
    y: y * Math.cos(tilt) + x * Math.sin(tilt) + Math.sin(angle * 3) * 3,
  };
}

export function swapFacultyTutor(
  activeId: string,
  innerIds: readonly string[],
  outerIds: readonly string[],
  selectedId: string,
) {
  const innerSlot = innerIds.indexOf(selectedId);
  if (innerSlot !== -1) {
    const nextInnerIds = [...innerIds];
    nextInnerIds[innerSlot] = activeId;
    return {
      activeId: selectedId,
      innerIds: nextInnerIds,
      outerIds: [...outerIds],
      selectedTier: 'inner' as const,
      selectedSlot: innerSlot,
    };
  }

  const outerSlot = outerIds.indexOf(selectedId);
  if (outerSlot !== -1) {
    const nextOuterIds = [...outerIds];
    nextOuterIds[outerSlot] = activeId;
    return {
      activeId: selectedId,
      innerIds: [...innerIds],
      outerIds: nextOuterIds,
      selectedTier: 'outer' as const,
      selectedSlot: outerSlot,
    };
  }

  return {
    activeId,
    innerIds: [...innerIds],
    outerIds: [...outerIds],
    selectedTier: null,
    selectedSlot: -1,
  };
}

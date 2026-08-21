export const FEATURED_TUTOR_IDS = ['T010', 'T003', 'T011', 'T005', 'T012', 'T015'] as const;

export const TUTOR_ORBIT_LAYOUT = 'always-expanded' as const;

const ORBIT_POSITIONS = ['north', 'northEast', 'east', 'southEast', 'southWest', 'west'] as const;

export function orbitPositionFor(id: string) {
  const index = FEATURED_TUTOR_IDS.indexOf(id as typeof FEATURED_TUTOR_IDS[number]);
  return ORBIT_POSITIONS[index < 0 ? 0 : index];
}

/**
 * A deliberately gentle, closed loop for each portrait. The satellite itself
 * stays upright while its position moves around the larger orbit ring.
 */
export function orbitMotionFor(id: string) {
  const index = Math.max(0, FEATURED_TUTOR_IDS.indexOf(id as typeof FEATURED_TUTOR_IDS[number]));
  const radiusX = 16 + (index % 3) * 3;
  const radiusY = 11 + (index % 2) * 3;

  return {
    x: [0, radiusX, 0, -radiusX, 0],
    y: [-radiusY, 0, radiusY, 0, -radiusY],
    duration: 18 + index * 1.4,
  };
}

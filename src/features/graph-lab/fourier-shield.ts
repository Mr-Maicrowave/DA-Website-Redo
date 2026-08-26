export type FourierShieldPoint = { x: number; y: number };

const SHIELD_ANCHORS: FourierShieldPoint[] = [
  { x: 0, y: -108 }, { x: -18, y: -91 }, { x: -48, y: -73 },
  { x: -78, y: -67 }, { x: -80, y: -18 }, { x: -74, y: 28 },
  { x: -57, y: 61 }, { x: -31, y: 86 }, { x: 0, y: 106 },
  { x: 31, y: 86 }, { x: 57, y: 61 }, { x: 74, y: 28 },
  { x: 80, y: -18 }, { x: 78, y: -67 }, { x: 48, y: -73 },
  { x: 18, y: -91 }, { x: 0, y: -108 },
];

const distance = (first: FourierShieldPoint, second: FourierShieldPoint) => Math.hypot(second.x - first.x, second.y - first.y);

export const createShieldTrace = (count = 360): FourierShieldPoint[] => {
  const lengths = SHIELD_ANCHORS.slice(0, -1).map((point, index) => distance(point, SHIELD_ANCHORS[index + 1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  return Array.from({ length: count }, (_, index) => {
    let target = (index / count) * total;
    let segment = 0;
    while (segment < lengths.length - 1 && target > lengths[segment]) {
      target -= lengths[segment];
      segment += 1;
    }
    const start = SHIELD_ANCHORS[segment];
    const end = SHIELD_ANCHORS[segment + 1];
    const local = lengths[segment] === 0 ? 0 : target / lengths[segment];
    const eased = local * local * (3 - 2 * local);
    return { x: start.x + (end.x - start.x) * eased, y: start.y + (end.y - start.y) * eased };
  });
};

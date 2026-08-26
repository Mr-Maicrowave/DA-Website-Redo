export type Point = { x: number; y: number };

export type FishMotion = Point & {
  vx: number;
  vy: number;
  phase: number;
  speed: number;
};

type AquariumSize = {
  width: number;
  height: number;
};

const clampVelocity = (fish: FishMotion, maxVelocity: number): FishMotion => {
  const magnitude = Math.hypot(fish.vx, fish.vy);
  if (magnitude <= maxVelocity || magnitude === 0) return fish;
  const ratio = maxVelocity / magnitude;
  return { ...fish, vx: fish.vx * ratio, vy: fish.vy * ratio };
};

export const stepFish = (fish: FishMotion, deltaMs: number): FishMotion => {
  const frame = Math.min(deltaMs / 16.667, 2);
  const nextPhase = fish.phase + 0.025 * frame * fish.speed;
  return {
    ...fish,
    x: fish.x + fish.vx * frame * fish.speed,
    y: fish.y + (fish.vy + Math.sin(nextPhase) * 0.12) * frame,
    phase: nextPhase,
  };
};

export const steerFromPointer = (
  fish: FishMotion,
  pointer: Point,
  radius = 170,
  maxVelocity = 2.4,
): FishMotion => {
  const dx = fish.x - pointer.x;
  const dy = fish.y - pointer.y;
  const distance = Math.max(Math.hypot(dx, dy), 0.001);
  if (distance >= radius) return fish;
  const force = (1 - distance / radius) * 0.42;
  return clampVelocity({ ...fish, vx: fish.vx + (dx / distance) * force, vy: fish.vy + (dy / distance) * force }, maxVelocity);
};

export const keepInBounds = (fish: FishMotion, width: number, height: number, margin = 28): FishMotion => {
  let { vx, vy } = fish;
  if (fish.x < margin) vx = Math.abs(vx) + 0.12;
  if (fish.x > width - margin) vx = -Math.abs(vx) - 0.12;
  if (fish.y < margin) vy = Math.abs(vy) + 0.08;
  if (fish.y > height - margin) vy = -Math.abs(vy) - 0.08;
  return { ...fish, vx, vy };
};

export const resizeFishMotion = (
  fish: FishMotion,
  previous: AquariumSize,
  next: AquariumSize,
): FishMotion => {
  const xRatio = next.width / Math.max(previous.width, 1);
  const yRatio = next.height / Math.max(previous.height, 1);
  return {
    ...fish,
    x: fish.x * xRatio,
    y: fish.y * yRatio,
    vx: fish.vx * xRatio,
    vy: fish.vy * yRatio,
  };
};

export const markDiscovered = (discovered: string[], id: string): string[] =>
  discovered.includes(id) ? discovered : [...discovered, id];

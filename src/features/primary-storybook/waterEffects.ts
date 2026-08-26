export type WaterPointer = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  targetSpeed: number;
};

export type WaterRipple = {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  radius: number;
  alpha: number;
  strength: number;
  active: boolean;
  kind: 'click' | 'wake';
};

export type AquariumMotionPolicy = {
  trackPointer: boolean;
  spawnClickRipple: boolean;
  spawnDragBubbles: boolean;
  spawnWake: boolean;
  updateDisplacement: boolean;
  animateFish: boolean;
};

export const createAquariumMotionPolicy = (prefersReducedMotion: boolean): AquariumMotionPolicy => {
  const motionEnabled = !prefersReducedMotion;

  return {
    trackPointer: motionEnabled,
    spawnClickRipple: motionEnabled,
    spawnDragBubbles: motionEnabled,
    spawnWake: motionEnabled,
    updateDisplacement: motionEnabled,
    animateFish: motionEnabled,
  };
};

export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
export const easeOutCubic = (progress: number) => 1 - Math.pow(1 - Math.min(Math.max(progress, 0), 1), 3);

export const smoothSpeed = (previous: number, raw: number, amount = .15, maximum = 48) =>
  lerp(previous, Math.min(raw, maximum), amount);

export const smoothPointer = (pointer: WaterPointer, amount = .2): WaterPointer => ({
  ...pointer,
  x: lerp(pointer.x, pointer.targetX, amount),
  y: lerp(pointer.y, pointer.targetY, amount),
  speed: smoothSpeed(pointer.speed, pointer.targetSpeed),
});

export const createRipple = (x: number, y: number, delay = 0): WaterRipple => ({
  x,
  y,
  age: -delay,
  maxAge: 1100 + delay * .25,
  radius: 10,
  alpha: .5,
  strength: 1,
  active: true,
  kind: 'click',
});

export const createWakeRipple = (x: number, y: number): WaterRipple => ({
  x,
  y,
  age: 0,
  maxAge: 760,
  radius: 4,
  alpha: .34,
  strength: .58,
  active: true,
  kind: 'wake',
});

export const advanceRipple = (ripple: WaterRipple, deltaMs: number): WaterRipple => {
  const age = ripple.age + deltaMs;
  if (age < 0) return { ...ripple, age };
  const progress = Math.min(age / ripple.maxAge, 1);
  const isWake = ripple.kind === 'wake';
  return {
    ...ripple,
    age,
    radius: lerp(isWake ? 4 : 10, isWake ? 72 : 180, easeOutCubic(progress)),
    alpha: (isWake ? .34 : .5) * (1 - progress),
    strength: (isWake ? .58 : 1) * (1 - progress),
    active: progress < 1,
  };
};

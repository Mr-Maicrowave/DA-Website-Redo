export interface Pose {
  position: [number, number, number];
  rotation: [number, number, number];
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export function sampleTimeline(progress: number, from: Pose, to: Pose): Pose {
  const t = clamp01(progress);
  if (t === 0) return from;
  if (t === 1) return to;
  return {
    position: from.position.map((value, index) => value + (to.position[index] - value) * t) as Pose['position'],
    rotation: from.rotation.map((value, index) => value + (to.rotation[index] - value) * t) as Pose['rotation'],
  };
}

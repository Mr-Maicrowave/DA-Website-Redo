export interface Pose {
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface RoomCameraPose {
  position: [number, number, number];
  target: [number, number, number];
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

const stable = (value: number) => {
  const rounded = Math.round(value * 1e10) / 1e10;
  return Math.abs(rounded) < 1e-10 ? 0 : rounded;
};

export function createRoomTurnPose(
  fromWallIndex: number,
  toWallIndex: number,
  progress: number,
  cameraRadius: number,
  targetRadius: number,
  wallCount: number,
): RoomCameraPose {
  if (!Number.isInteger(wallCount) || wallCount < 3) throw new Error('wallCount must be an integer of at least 3');
  const t = clamp01(progress);
  let delta = toWallIndex - fromWallIndex;
  if (delta > wallCount / 2) delta -= wallCount;
  if (delta < -wallCount / 2) delta += wallCount;
  const arcRadius = cameraRadius * (1 + .08 * Math.sin(Math.PI * t));
  const angle = (fromWallIndex + delta * t) * (Math.PI * 2 / wallCount);
  const viewerAngle = angle + Math.PI;
  const targetDistance = targetRadius * (1 + (Math.SQRT2 - 1) * Math.sin(Math.PI * t));
  const target: RoomCameraPose['target'] = [stable(Math.sin(angle) * targetDistance), 2.7, stable(-Math.cos(angle) * targetDistance)];

  return {
    position: [stable(Math.sin(viewerAngle) * arcRadius), 2.45, stable(-Math.cos(viewerAngle) * arcRadius)],
    target,
  };
}

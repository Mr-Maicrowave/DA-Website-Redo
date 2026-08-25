export type GeometryRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type TransitionPose = {
  x: number;
  y: number;
  scale: number;
};

export function reconcileSourceHandoffPose(
  basePose: TransitionPose,
  normalizedSource: GeometryRect,
  liveSource: GeometryRect,
  strength: number,
): TransitionPose {
  const normalizedCenterX = normalizedSource.left + normalizedSource.width / 2;
  const normalizedCenterY = normalizedSource.top + normalizedSource.height / 2;
  const liveCenterX = liveSource.left + liveSource.width / 2;
  const liveCenterY = liveSource.top + liveSource.height / 2;
  const liveScaleRatio = normalizedSource.width > 0
    ? liveSource.width / normalizedSource.width
    : 1;

  return {
    x: basePose.x + (liveCenterX - normalizedCenterX) * strength,
    y: basePose.y + (liveCenterY - normalizedCenterY) * strength,
    scale: basePose.scale * (1 + (liveScaleRatio - 1) * strength),
  };
}

export const METHOD_TRANSITION_SCROLL_VH = 230;

export const METHOD_TRANSITION_TIMING = {
  detachEnd: 0.05,
  fastZoomEnd: 0.15,
  largestEnd: 0.25,
  descendStart: 0.25,
  cardRiseStart: 0.32,
  insertionStart: 0.55,
  landEnd: 0.76,
  reactionEnd: 0.82,
  joinStart: 0.82,
  joinEnd: 0.94,
  companionsEnd: 1,
  settleEnd: 1,
} as const;

export function getViewportZoomTargets(viewportWidth: number, viewportHeight: number) {
  const enormous = Math.min(viewportHeight * 0.72, viewportWidth * 0.72);
  return {
    fast: Math.min(viewportHeight * 0.5, viewportWidth * 0.7),
    enormous,
    portal: enormous,
  };
}

const ZOOM_CHECKPOINTS = [
  [0, 1],
  [0.03, 1.4],
  [0.07, 2.3],
  [0.12, 3.5],
  [0.16, 5.5],
  [0.22, 8],
] as const;

export function zoomScaleAt(progress: number, sourceScale: number) {
  const bounded = Math.max(0, Math.min(progress, ZOOM_CHECKPOINTS.at(-1)![0]));

  for (let index = 1; index < ZOOM_CHECKPOINTS.length; index += 1) {
    const [endProgress, endScale] = ZOOM_CHECKPOINTS[index];
    if (bounded > endProgress) continue;
    const [startProgress, startScale] = ZOOM_CHECKPOINTS[index - 1];
    const segmentProgress = (bounded - startProgress) / (endProgress - startProgress);
    return sourceScale * (startScale + (endScale - startScale) * segmentProgress);
  }

  return sourceScale * ZOOM_CHECKPOINTS.at(-1)![1];
}

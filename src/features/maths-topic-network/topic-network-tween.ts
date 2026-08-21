export function easeInOutCubic(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
}

/**
 * Animates a single numeric value from `from` to `to` over `durationMs`, calling
 * `onFrame` with the eased current value on every animation frame. Returns a
 * cancel function — call it to stop early (e.g. if the user clicks the toggle
 * again mid-animation).
 */
export function animateValue(
  from: number,
  to: number,
  durationMs: number,
  onFrame: (value: number) => void,
): () => void {
  let cancelled = false;
  const start = performance.now();

  function step(now: number) {
    if (cancelled) return;
    const p = Math.min(1, (now - start) / durationMs);
    onFrame(from + (to - from) * easeInOutCubic(p));
    if (p < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
  return () => {
    cancelled = true;
  };
}

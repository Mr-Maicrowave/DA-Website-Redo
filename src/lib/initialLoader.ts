const INITIAL_ROUTE_PAINTED_EVENT = 'da:initial-route-painted';

/**
 * Announces that a mounted route has survived a complete browser paint.
 * The second animation frame ensures the loader never exits merely because
 * React started mounting its tree.
 */
export function signalInitialRoutePainted(): () => void {
  let active = true;
  let cancelPendingFrame = () => {};

  const firstFrame = requestAnimationFrame(() => {
    const secondFrame = requestAnimationFrame(() => {
      if (active) {
        window.dispatchEvent(new Event(INITIAL_ROUTE_PAINTED_EVENT));
      }
    });

    cancelPendingFrame = () => cancelAnimationFrame(secondFrame);
  });

  cancelPendingFrame = () => cancelAnimationFrame(firstFrame);

  return () => {
    active = false;
    cancelPendingFrame();
  };
}

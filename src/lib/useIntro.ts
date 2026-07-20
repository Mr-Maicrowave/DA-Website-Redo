import { useCallback, useEffect, useMemo, useState } from 'react';

const hasWindow = () => typeof window !== 'undefined';

const readReducedMotion = () =>
  hasWindow() &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useIntro = () => {
  const [seen, setSeen] = useState<boolean | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (!hasWindow()) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSeen(false);
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const markAsSeen = useCallback(() => {
    setSeen(true);
  }, []);

  const shouldPlay = useMemo(() => {
    if (seen === null) return false;
    return !seen && !prefersReducedMotion && !readReducedMotion();
  }, [prefersReducedMotion, seen]);

  useEffect(() => {
    if (seen === false && prefersReducedMotion) {
      markAsSeen();
    }
  }, [markAsSeen, prefersReducedMotion, seen]);

  return {
    isReady: seen !== null,
    prefersReducedMotion,
    seen: seen === true,
    shouldPlay,
    markAsSeen,
  };
};

import { useCallback, useEffect, useMemo, useState } from 'react';

export const INTRO_STORAGE_KEY = 'da-intro-seen-v1';

const hasWindow = () => typeof window !== 'undefined';

export const useIntro = () => {
  const [seen, setSeen] = useState<boolean | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (!hasWindow()) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldReplay = new URLSearchParams(window.location.search).get('intro') === 'replay';
    const storedValue = window.localStorage.getItem(INTRO_STORAGE_KEY);

    if (shouldReplay) {
      window.localStorage.removeItem(INTRO_STORAGE_KEY);
    }

    setSeen(shouldReplay ? false : storedValue === 'true');
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
    if (hasWindow()) {
      window.localStorage.setItem(INTRO_STORAGE_KEY, 'true');
    }

    setSeen(true);
  }, []);

  const shouldPlay = useMemo(() => {
    if (seen === null) return false;
    return !seen;
  }, [seen]);

  return {
    isReady: seen !== null,
    prefersReducedMotion,
    seen: seen === true,
    shouldPlay,
    markAsSeen,
  };
};

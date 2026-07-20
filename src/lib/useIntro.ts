import { useCallback, useEffect, useMemo, useState } from 'react';

const INTRO_SEEN_KEY = 'da-intro-video-seen-v1';
const hasWindow = () => typeof window !== 'undefined';

const readIntroSeen = () => {
  if (!hasWindow()) return false;

  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
};

const rememberIntro = () => {
  if (!hasWindow()) return;

  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, 'true');
  } catch {
    // The current page still remembers the intro through React state.
  }
};

const readReducedMotion = () =>
  hasWindow() &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useIntro = () => {
  const [seen, setSeen] = useState<boolean | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (!hasWindow()) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSeen(readIntroSeen());
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
    rememberIntro();
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

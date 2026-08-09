import { useCallback, useEffect, useMemo, useState } from 'react';

export const ENGLISH_SAMPLE_INTRO_VIDEO_SESSION_KEY = 'da-english-sample-intro-video-seen-v1';
export const ENGLISH_SUBJECT_INTRO_VIDEO_SESSION_KEY = 'da-english-subject-intro-video-seen-v1';

const INTRO_SEEN_KEY = ENGLISH_SAMPLE_INTRO_VIDEO_SESSION_KEY;
const hasWindow = () => typeof window !== 'undefined';

const readIntroSeen = (storageKey = INTRO_SEEN_KEY) => {
  if (!hasWindow()) return false;

  try {
    return window.sessionStorage.getItem(storageKey) === 'true';
  } catch {
    return false;
  }
};

const rememberIntro = (storageKey = INTRO_SEEN_KEY) => {
  if (!hasWindow()) return;

  try {
    window.sessionStorage.setItem(storageKey, 'true');
  } catch {
    // The current page still remembers the intro through React state.
  }
};

const readReducedMotion = () =>
  hasWindow() &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useIntro = (storageKey = INTRO_SEEN_KEY) => {
  const [seen, setSeen] = useState<boolean | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (!hasWindow()) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSeen(readIntroSeen(storageKey));
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [storageKey]);

  const markAsSeen = useCallback(() => {
    rememberIntro(storageKey);
    setSeen(true);
  }, [storageKey]);

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

const BOOK_INTRO_SESSION_KEY = 'da-book-intro-complete-v1';

const hasWindow = () => typeof window !== 'undefined';

export const isBookIntroReplayRequested = () =>
  hasWindow() && new URLSearchParams(window.location.search).get('intro') === 'replay';

export const shouldShowBookIntro = () => {
  if (!hasWindow()) return true;
  if (isBookIntroReplayRequested()) return true;

  try {
    return window.sessionStorage.getItem(BOOK_INTRO_SESSION_KEY) !== 'true';
  } catch {
    return true;
  }
};

export const markBookIntroComplete = () => {
  if (!hasWindow()) return;

  try {
    window.sessionStorage.setItem(BOOK_INTRO_SESSION_KEY, 'true');
  } catch {
    // The transition still completes when storage is unavailable.
  }
};

export const ENGLISH_SAMPLE_BOOK_INTRO_SESSION_KEY = 'da-english-sample-book-intro-complete-v1';
export const ENGLISH_SUBJECT_BOOK_INTRO_SESSION_KEY = 'da-english-subject-book-intro-complete-v1';

const BOOK_INTRO_SESSION_KEY = ENGLISH_SAMPLE_BOOK_INTRO_SESSION_KEY;

const hasWindow = () => typeof window !== 'undefined';

export const isBookIntroReplayRequested = () =>
  hasWindow() && new URLSearchParams(window.location.search).get('intro') === 'replay';

export const shouldShowBookIntro = (storageKey = BOOK_INTRO_SESSION_KEY) => {
  if (!hasWindow()) return true;
  if (isBookIntroReplayRequested()) return true;

  try {
    return window.sessionStorage.getItem(storageKey) !== 'true';
  } catch {
    return true;
  }
};

export const markBookIntroComplete = (storageKey = BOOK_INTRO_SESSION_KEY) => {
  if (!hasWindow()) return;

  try {
    window.sessionStorage.setItem(storageKey, 'true');
  } catch {
    // The transition still completes when storage is unavailable.
  }
};

export const resetBookIntroComplete = (storageKey = BOOK_INTRO_SESSION_KEY) => {
  if (!hasWindow()) return;

  try {
    window.sessionStorage.removeItem(storageKey);
  } catch {
    // The replay state handler can still show the intro for the current page.
  }
};

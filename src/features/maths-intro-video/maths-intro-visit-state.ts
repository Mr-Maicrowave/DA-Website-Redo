// ponytail: sessionStorage/matchMedia are browser-only globals — this module is also
// imported directly by a plain node:test file (no DOM), so every access is guarded and
// falls back to the in-memory flag there. In a real browser this means the intro is
// skipped for the rest of the tab session (survives a hard refresh, unlike the old
// in-memory-only flag) and skipped entirely for prefers-reduced-motion users.
const STORAGE_KEY = 'da-maths-intro-played';

let hasPlayedThisAppLoad = false;

const getSessionStorage = (): Storage | null => {
  try {
    return typeof sessionStorage !== 'undefined' ? sessionStorage : null;
  } catch {
    return null;
  }
};

const prefersReducedMotion = (): boolean => {
  try {
    return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

export const shouldShowMathsIntroOnThisAppLoad = () => {
  if (hasPlayedThisAppLoad) return false;
  if (prefersReducedMotion()) return false;
  return getSessionStorage()?.getItem(STORAGE_KEY) !== '1';
};

export const markMathsIntroPlayedThisAppLoad = () => {
  hasPlayedThisAppLoad = true;
  getSessionStorage()?.setItem(STORAGE_KEY, '1');
};

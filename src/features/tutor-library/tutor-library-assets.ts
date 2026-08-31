import { getPhotoUrl, TUTORS, type CatalogueTutor } from '../../data/teacherCatalogue.ts';
import { createTutorBookEditions, type TutorBookEdition } from './tutor-library-data.ts';

type WarmupDependencies = {
  loadFonts(): Promise<unknown>;
  loadImage(url: string): Promise<unknown>;
  waitForTimeout(timeoutMs: number): Promise<unknown>;
};

export const TUTOR_LIBRARY_REVEAL_TIMEOUT_MS = 2200;

export function createTutorLibraryAssetWarmup(urls: readonly string[], dependencies: WarmupDependencies, timeoutMs = TUTOR_LIBRARY_REVEAL_TIMEOUT_MS) {
  let warmup: Promise<{ timedOut: boolean }> | undefined;
  return () => {
    warmup ??= Promise.race([
      Promise.allSettled([
        dependencies.loadFonts(),
        ...urls.map(url => dependencies.loadImage(url)),
      ]).then(() => ({ timedOut: false })),
      dependencies.waitForTimeout(timeoutMs).then(() => ({ timedOut: true })),
    ]);
    return warmup;
  };
}

export function getInitialTutorLibraryAssetUrls(editions: readonly TutorBookEdition[], tutors: readonly CatalogueTutor[]) {
  const initialTutorIds = new Set(editions.filter(edition => edition.wallId === 'primary').map(edition => edition.tutorId));
  return [...new Set(tutors.filter(tutor => initialTutorIds.has(tutor.id)).map(getPhotoUrl))];
}

let fontPromise: Promise<unknown> | undefined;

export function areTutorLibraryFontsReady() {
  if (typeof document === 'undefined' || !document.fonts) return true;
  return document.fonts.check('600 86px "Cormorant Garamond"') && document.fonts.check('600 27px Cabin');
}

export function ensureTutorLibraryFonts() {
  if (fontPromise) return fontPromise;
  if (typeof document === 'undefined' || !document.fonts) return Promise.resolve();
  fontPromise = Promise.allSettled([
    document.fonts.load('600 86px "Cormorant Garamond"'),
    document.fonts.load('600 27px Cabin'),
  ]);
  return fontPromise;
}

function preloadImage(url: string) {
  if (typeof Image === 'undefined') return Promise.resolve();
  return new Promise<void>(resolve => {
    const image = new Image();
    let settled = false;
    const finish = () => { if (!settled) { settled = true; resolve(); } };
    image.decoding = 'async';
    image.onload = finish;
    image.onerror = finish;
    image.src = url;
    if (image.decode) {
      void image.decode().then(finish).catch(() => undefined);
    }
  });
}

const initialAssetUrls = getInitialTutorLibraryAssetUrls(createTutorBookEditions(TUTORS), TUTORS);

export const warmTutorLibraryFirstShelf = createTutorLibraryAssetWarmup(initialAssetUrls, {
  loadFonts: ensureTutorLibraryFonts,
  loadImage: preloadImage,
  waitForTimeout: timeoutMs => new Promise(resolve => window.setTimeout(resolve, timeoutMs)),
});

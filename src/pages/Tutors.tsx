import FooterNew from '@/components/FooterNew';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CompleteShelfEngineCamera } from '@/features/tutor-library/TutorBookStudio';
import type { CompleteShelfBookState } from '@/features/tutor-library/CompleteShelfTutorBook';
import { TutorLibraryIntro } from '@/features/tutor-library/TutorLibraryIntro';
import { TutorLibraryLoadingSurface } from '@/features/tutor-library/TutorLibraryLoadingSurface';
import { TutorLibraryAudioControls, useTutorLibraryAudio } from '@/features/tutor-library/TutorLibraryAudioControls';
import { getTutorLibraryRouteMountPolicy, shouldPreloadTutorLibrary } from '@/features/tutor-library/tutor-library-performance';

const importTutorLibrary = () => import('@/features/tutor-library/TutorLibrary');
const warmTutorLibraryAssets = () => import('@/features/tutor-library/tutor-library-assets');
const loadTutorLibrary = () => importTutorLibrary().then(module => ({ default: module.TutorLibrary }));
const TutorLibrary = lazy(loadTutorLibrary);
const TutorBookStudio = lazy(() => import('@/features/tutor-library/TutorBookStudio').then(module => ({ default: module.TutorBookStudio })));

const TutorLibraryRouteLoading = () => <TutorLibraryLoadingSurface standalone />;

const Tutors = () => {
  const [searchParams] = useSearchParams();
  const [introComplete, setIntroComplete] = useState(() => searchParams.get('skipTutorIntro') === '1');
  const mountPolicy = getTutorLibraryRouteMountPolicy(introComplete);
  const studioMode = searchParams.get('tutor-book-studio') === '1';
  const audio = useTutorLibraryAudio(introComplete && !studioMode);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!shouldPreloadTutorLibrary({ introComplete, saveData: Boolean(connection?.saveData) })) return;
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const warm = () => {
      void Promise.all([importTutorLibrary(), warmTutorLibraryAssets()])
        .then(([, assets]) => assets.warmTutorLibraryFirstShelf());
    };
    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(warm, { timeout: 900 });
      return () => idleWindow.cancelIdleCallback?.(handle);
    }
    const handle = window.setTimeout(warm, 180);
    return () => window.clearTimeout(handle);
  }, [introComplete]);

  if (studioMode) {
    const requested = searchParams.get('studioView');
    const studioView = requested === 'rear' || requested === 'top' || requested === 'fore' || requested === 'spine' || requested === 'cover' || requested === 'shelf' || requested === 'typography' || requested === 'typography-close' || requested === 'geometry-debug' || requested === 'geometry-debug-rear' || requested === 'geometry-debug-top' || requested === 'geometry-debug-spine' || requested === 'geometry-debug-fore' || requested === 'material-debug' || requested === 'foil-debug' || requested === 'foil-metal-debug' ? requested : 'front';
    const requestedEngineState = searchParams.get('bookEngineState');
    const engineStates: readonly CompleteShelfBookState[] = ['closed-front', 'closed-spine', 'shelf', 'extracting', 'preview', 'half-open', 'open', 'page-turn-25', 'page-turning', 'page-turn-75', 'page-settled', 'closed-returned'];
    const requestedEngineCamera = searchParams.get('bookEngineCamera');
    const engineCamera: CompleteShelfEngineCamera = requestedEngineCamera === 'open-top-oblique' || requestedEngineCamera === 'turn-side-oblique' || requestedEngineCamera === 'turn-top-oblique' || requestedEngineCamera === 'turn-close' ? requestedEngineCamera : 'default';
    return <Suspense fallback={<TutorLibraryRouteLoading />}><TutorBookStudio view={studioView} engineState={engineStates.includes(requestedEngineState as CompleteShelfBookState) ? requestedEngineState as CompleteShelfBookState : undefined} engineCamera={engineCamera} collisionDebug={searchParams.get('bookCollisionDebug') === '1'} /></Suspense>;
  }

  return (
    <div className="tutors-page">
      <SEO
        title="Meet Our Tutors"
        description="Meet the DA Tuition educators who bring clarity, momentum and belief to every lesson."
        canonicalUrl="/tutors"
      />
      <NavigationNew />
      <main className="tutors-page__library-stage">
        {mountPolicy.mountLibrary ? <Suspense fallback={<TutorLibraryRouteLoading />}><TutorLibrary /></Suspense> : null}
        {mountPolicy.mountLibrary ? <TutorLibraryAudioControls controller={audio} /> : null}
        {mountPolicy.mountIntro ? <TutorLibraryIntro onComplete={() => { audio.start(); setIntroComplete(true); }} /> : null}
      </main>
      <FooterNew />
    </div>
  );
};

export default Tutors;

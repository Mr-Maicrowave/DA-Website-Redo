import FooterNew from '@/components/FooterNew';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';
import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CompleteShelfEngineCamera } from '@/features/tutor-library/TutorBookStudio';
import type { CompleteShelfBookState } from '@/features/tutor-library/CompleteShelfTutorBook';

const TutorLibrary = lazy(() => import('@/features/tutor-library/TutorLibrary').then(module => ({ default: module.TutorLibrary })));
const TutorBookStudio = lazy(() => import('@/features/tutor-library/TutorBookStudio').then(module => ({ default: module.TutorBookStudio })));

const TutorLibraryRouteLoading = () => <main aria-live="polite" aria-label="Opening tutor library" style={{ display: 'grid', minHeight: 'min(78rem, 100svh)', placeItems: 'center', background: '#071323', color: '#f7ecd4', textAlign: 'center' }}>
  <div><p style={{ margin: 0, color: '#d5b369', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>DA Tuition faculty</p><h1 style={{ margin: '.65rem 0 0', fontFamily: 'Georgia, serif', fontWeight: 500 }}>Opening the tutor library</h1></div>
</main>;

const Tutors = () => {
  const [searchParams] = useSearchParams();

  if (searchParams.get('tutor-book-studio') === '1') {
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
      <main>
        <Suspense fallback={<TutorLibraryRouteLoading />}><TutorLibrary /></Suspense>
      </main>
      <FooterNew />
    </div>
  );
};

export default Tutors;

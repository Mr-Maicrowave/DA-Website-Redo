import FooterNew from '@/components/FooterNew';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';
import { useSearchParams } from 'react-router-dom';
import { TutorLibrary } from '@/features/tutor-library/TutorLibrary';
import { TutorBookStudio, type CompleteShelfEngineCamera } from '@/features/tutor-library/TutorBookStudio';
import type { CompleteShelfBookState } from '@/features/tutor-library/CompleteShelfTutorBook';

const Tutors = () => {
  const [searchParams] = useSearchParams();

  if (searchParams.get('tutor-book-studio') === '1') {
    const requested = searchParams.get('studioView');
    const studioView = requested === 'rear' || requested === 'top' || requested === 'fore' || requested === 'spine' || requested === 'cover' || requested === 'shelf' || requested === 'typography' || requested === 'typography-close' || requested === 'geometry-debug' || requested === 'geometry-debug-rear' || requested === 'geometry-debug-top' || requested === 'geometry-debug-spine' || requested === 'geometry-debug-fore' || requested === 'material-debug' || requested === 'foil-debug' || requested === 'foil-metal-debug' ? requested : 'front';
    const requestedEngineState = searchParams.get('bookEngineState');
    const engineStates: readonly CompleteShelfBookState[] = ['closed-front', 'closed-spine', 'shelf', 'extracting', 'preview', 'half-open', 'open', 'page-turn-25', 'page-turning', 'page-turn-75', 'page-settled', 'closed-returned'];
    const requestedEngineCamera = searchParams.get('bookEngineCamera');
    const engineCamera: CompleteShelfEngineCamera = requestedEngineCamera === 'open-top-oblique' || requestedEngineCamera === 'turn-side-oblique' || requestedEngineCamera === 'turn-top-oblique' || requestedEngineCamera === 'turn-close' ? requestedEngineCamera : 'default';
    return <TutorBookStudio view={studioView} engineState={engineStates.includes(requestedEngineState as CompleteShelfBookState) ? requestedEngineState as CompleteShelfBookState : undefined} engineCamera={engineCamera} collisionDebug={searchParams.get('bookCollisionDebug') === '1'} />;
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
        <TutorLibrary />
      </main>
      <FooterNew />
    </div>
  );
};

export default Tutors;

import FooterNew from '@/components/FooterNew';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FindTeacher from './FindTeacher';
import { TutorOrbitHero } from '@/features/tutor-orbit/TutorOrbitHero';
import { TutorLibrary } from '@/features/tutor-library/TutorLibrary';
import { TutorBookStudio } from '@/features/tutor-library/TutorBookStudio';

const libraryEnabled = (search: URLSearchParams) => search.get('library-preview') === '1';

const Tutors = () => {
  const [view, setView] = useState<'hero' | 'directory'>('hero');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('tutor')) setView('directory');
  }, [searchParams]);

  if (searchParams.get('tutor-book-studio') === '1') {
    const requested = searchParams.get('studioView');
    const view = requested === 'rear' || requested === 'top' || requested === 'fore' || requested === 'spine' || requested === 'cover' || requested === 'shelf' || requested === 'typography' || requested === 'typography-close' || requested === 'geometry-debug' || requested === 'geometry-debug-rear' || requested === 'geometry-debug-top' || requested === 'geometry-debug-spine' || requested === 'geometry-debug-fore' || requested === 'material-debug' || requested === 'foil-debug' || requested === 'foil-metal-debug' ? requested : 'front';
    return <TutorBookStudio view={view} />;
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
        {libraryEnabled(searchParams) ? <TutorLibrary /> : view === 'hero' ? (
          <TutorOrbitHero onExplore={() => setView('directory')} />
        ) : (
          <FindTeacher embedded onBackToHero={() => setView('hero')} />
        )}
      </main>
      <FooterNew />
    </div>
  );
};

export default Tutors;

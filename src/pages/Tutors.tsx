import FooterNew from '@/components/FooterNew';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FindTeacher from './FindTeacher';
import { TutorOrbitHero } from '@/features/tutor-orbit/TutorOrbitHero';

const Tutors = () => {
  const [view, setView] = useState<'hero' | 'directory'>('hero');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('tutor')) setView('directory');
  }, [searchParams]);

  return (
    <div className="tutors-page">
      <SEO
        title="Meet Our Tutors"
        description="Meet the DA Tuition educators who bring clarity, momentum and belief to every lesson."
        canonicalUrl="/tutors"
      />
      <NavigationNew />
      <main>
        {view === 'hero' ? (
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

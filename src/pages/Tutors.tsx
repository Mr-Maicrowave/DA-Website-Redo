import FooterNew from '@/components/FooterNew';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';
import { useState } from 'react';
import { TutorNamefieldDirectory } from '@/features/tutor-directory/TutorNamefieldDirectory';
import { TutorOrbitHero } from '@/features/tutor-orbit/TutorOrbitHero';

const Tutors = () => {
  const [view, setView] = useState<'hero' | 'directory'>('hero');

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
          <TutorNamefieldDirectory onBackToHero={() => setView('hero')} />
        )}
      </main>
      <FooterNew />
    </div>
  );
};

export default Tutors;

import FooterNew from '@/components/FooterNew';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';
import { TutorOrbitHero } from '@/features/tutor-orbit/TutorOrbitHero';

const Tutors = () => (
  <div className="tutors-page">
    <SEO
      title="Meet Our Tutors"
      description="Meet the DA Tuition educators who bring clarity, momentum and belief to every lesson."
      canonicalUrl="/tutors"
    />
    <NavigationNew />
    <main>
      <TutorOrbitHero />
    </main>
    <FooterNew />
  </div>
);

export default Tutors;

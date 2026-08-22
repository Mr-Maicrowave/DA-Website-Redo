import FooterNew from '@/components/FooterNew';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';
import { TutorDirectory } from '@/features/tutor-directory/TutorDirectory';

const Tutors = () => (
  <div className="tutors-page">
    <SEO
      title="Meet Our Tutors"
      description="Meet the DA Tuition educators who bring clarity, momentum and belief to every lesson."
      canonicalUrl="/tutors"
    />
    <NavigationNew />
    <main>
      <TutorDirectory />
    </main>
    <FooterNew />
  </div>
);

export default Tutors;

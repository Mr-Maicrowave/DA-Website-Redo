import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import PageJourney from '@/components/page-journey/PageJourney';
import SEO from '@/components/SEO';
import WeKnowYouSection from '@/components/why-da/WeKnowYouSection';
import PersonaliseFilmSection from '@/components/why-da/PersonaliseFilmSection';
import WeCareFilmSection from '@/components/why-da/WeCareFilmSection';
import WeTransformSection from '@/components/why-da/WeTransformSection';
import WeSucceedSection from '@/components/why-da/WeSucceedSection';
import { useWhyDAMotion } from './useWhyDAMotion';
import './WhyChooseDA.css';

const WHY_DA_JOURNEY_SECTIONS = [
  { id: 'why-da-introduction', label: 'Introduction', description: 'No two students learn alike' },
  { id: 'why-da-know-you', label: 'We know you', description: 'Understand the learner' },
  { id: 'why-da-personalise', label: 'We personalise', description: 'Build the right pathway' },
  { id: 'why-da-care', label: 'We care', description: 'Support that lasts' },
  { id: 'why-da-transform', label: 'We transform', description: 'Five student journeys' },
  { id: 'why-da-succeed', label: 'We succeed', description: 'Progress with purpose' },
] as const;

export default function WhyChooseDA() {
  const pageRef = useWhyDAMotion();

  return (
    <>
      <SEO
        title="Why DA? | Personalised Tutoring for Every Student"
        description="Discover how DA Tuition gets to know every learner and builds a personalised pathway around their strengths, needs and goals."
        canonicalUrl="/why-choose-da"
      />
      <NavigationNew heroMode />

      <main ref={pageRef} className="why-da-page">
        <section id="why-da-introduction" className="why-da-hero" data-testid="why-da-hero" aria-labelledby="why-da-title">
          <div className="why-da-hero__base" data-motion="hero-base" aria-hidden="true">
            <img src="/assets/why-da/hero-classroom.jpg" alt="" />
          </div>
          <div className="why-da-hero__background-slices" aria-hidden="true">
            <div className="why-da-hero__background-slice why-da-hero__background-slice--top" data-motion="hero-background-slice"><img src="/assets/why-da/hero-classroom.jpg" alt="" /></div>
            <div className="why-da-hero__background-slice why-da-hero__background-slice--middle" data-motion="hero-background-slice"><img src="/assets/why-da/hero-classroom.jpg" alt="" /></div>
            <div className="why-da-hero__background-slice why-da-hero__background-slice--bottom" data-motion="hero-background-slice"><img src="/assets/why-da/hero-classroom.jpg" alt="" /></div>
          </div>
          <div className="why-da-hero__tutor" data-testid="why-da-tutor-layer" aria-hidden="true">
            <img src="/assets/why-da/hero-classroom.jpg" alt="" />
          </div>
          <div className="why-da-hero__grade" data-motion="hero-grade" aria-hidden="true" />

          <div className="why-da-hero__copy" data-motion="hero-copy">
            <p className="why-da-hero__eyebrow" data-motion="hero-meta">WHY DA?</p>
            <h1 id="why-da-title">
              <span className="why-da-text-mask"><span data-motion="hero-line">NO TWO STUDENTS</span></span>
              <span className="why-da-text-mask"><span data-motion="hero-line">LEARN THE SAME.</span></span>
            </h1>
            <p className="why-da-hero__subheading" data-motion="hero-support">So why should they be taught the same way?</p>
          </div>

          <div className="why-da-hero__labels" aria-hidden="true">
            {['CONFIDENCE', 'PACE', 'ABILITY', 'GOALS'].map((label) => <span data-motion="hero-label" key={label}><i />{label}</span>)}
          </div>
          <p className="why-da-hero__statement" data-motion="hero-statement"><span>BEFORE WE TEACH,</span><strong>WE UNDERSTAND.</strong></p>
          <div className="why-da-hero__scroll" data-motion="hero-scroll" aria-hidden="true"><span>SCROLL TO UNDERSTAND</span><i /></div>
          <span className="why-da-hero__gold-line" aria-hidden="true" />
        </section>

        <WeKnowYouSection />

        <PersonaliseFilmSection />

        <WeCareFilmSection />

        <WeTransformSection />

        <WeSucceedSection />
      </main>
      <PageJourney pageLabel="Why DA" sections={WHY_DA_JOURNEY_SECTIONS} />
      <FooterNew />
    </>
  );
}

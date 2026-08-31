import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';
import WeKnowYouSection from '@/components/why-da/WeKnowYouSection';
import PersonaliseFilmSection from '@/components/why-da/PersonaliseFilmSection';
import WeCareFilmSection from '@/components/why-da/WeCareFilmSection';
import WeTransformSection from '@/components/why-da/WeTransformSection';
import WeSucceedSection from '@/components/why-da/WeSucceedSection';
import { useWhyDAMotion } from './useWhyDAMotion';
import './WhyChooseDA.css';

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
        <section className="why-da-hero" data-testid="why-da-hero" aria-labelledby="why-da-title">
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

        <section className="why-da-closing" data-testid="why-da-closing-cta" aria-labelledby="why-da-closing-title">
          <img src="/images/why-da-reference/why-da-reception-v1.jpg" alt="The welcoming DA Tuition reception" loading="lazy" decoding="async" />
          <div className="why-da-closing__veil" aria-hidden="true" />
          <div className="why-da-closing__content" data-motion="closing-cta">
            <h2 id="why-da-closing-title">Whatever your child’s<br />starting point,</h2>
            <p>let’s work out what comes next.</p>
            <Link to="/book-interview">BOOK A CONSULTATION <ArrowRight aria-hidden="true" /></Link>
            <Link to="/programs" className="why-da-closing__secondary">EXPLORE LEARNING OPTIONS <ArrowRight aria-hidden="true" /></Link>
            <small>We’re here to help.</small>
          </div>
        </section>
      </main>
    </>
  );
}

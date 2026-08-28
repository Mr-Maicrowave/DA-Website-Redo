import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { MethodTransition } from '../high-school-method-transition/MethodTransition';
import { milestones, supportPrinciples } from './professionalJourneyData';
import './HighSchoolProfessionalJourney.css';

gsap.registerPlugin(ScrollTrigger);

function useSectionReveal() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!ref.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-reveal]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .09, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 78%' } });
    }, ref);
    return () => ctx.revert();
  }, []);
  return ref;
}

const STORY_ASSET_ROOT = '/images/programs/high-school-professional';

export function TeacherProgressStory() {
  return (
    <section
      className="hsp-story"
      ref={useSectionReveal()}
      aria-labelledby="hsp-story-title"
    >
      <picture className="hsp-story__atmosphere" aria-hidden="true">
        <source
          type="image/avif"
          srcSet={`${STORY_ASSET_ROOT}/teacher-progress-watercolor-frame-v1-768w.avif 768w, ${STORY_ASSET_ROOT}/teacher-progress-watercolor-frame-v1-1536w.avif 1536w`}
          sizes="min(96vw, 1480px)"
        />
        <source
          type="image/webp"
          srcSet={`${STORY_ASSET_ROOT}/teacher-progress-watercolor-frame-v1-768w.webp 768w, ${STORY_ASSET_ROOT}/teacher-progress-watercolor-frame-v1-1536w.webp 1536w`}
          sizes="min(96vw, 1480px)"
        />
        <img
          src={`${STORY_ASSET_ROOT}/teacher-progress-watercolor-frame-v1.png`}
          alt=""
          width={1536}
          height={1024}
          loading="lazy"
          decoding="async"
        />
      </picture>

      <div className="hsp-story__upper">
        <figure className="hsp-story__photo" data-reveal>
          <picture>
            <source
              type="image/avif"
              srcSet={`${STORY_ASSET_ROOT}/teacher-progress-tutoring-scene-v1-768w.avif 768w, ${STORY_ASSET_ROOT}/teacher-progress-tutoring-scene-v1-1536w.avif 1536w`}
              sizes="(max-width: 700px) 94vw, min(55vw, 780px)"
            />
            <source
              type="image/webp"
              srcSet={`${STORY_ASSET_ROOT}/teacher-progress-tutoring-scene-v1-768w.webp 768w, ${STORY_ASSET_ROOT}/teacher-progress-tutoring-scene-v1-1536w.webp 1536w`}
              sizes="(max-width: 700px) 94vw, min(55vw, 780px)"
            />
            <img
              src={`${STORY_ASSET_ROOT}/teacher-progress-tutoring-scene-v1.png`}
              alt="A tutor working beside a high-school student at an open workbook"
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </figure>

        <div className="hsp-story__support" data-reveal>
          <h2 id="hsp-story-title">Your teacher<br />beside you.</h2>
          <p className="hsp-story__support-accent">
            <em>Not teaching at you.</em><br />Working with you.
          </p>
          <div className="hsp-story__principles">
            {supportPrinciples.map(({ title, description, Icon }) => (
              <article key={title}>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <p className="hsp-story__note">Someone who knows<br />how you learn. ♡</p>
        </div>
      </div>

      <div className="hsp-story__journey" data-reveal>
        <header>
          <p className="hsp-story__eyebrow">03 — The progress we build together</p>
          <h2>Progress you can see.<br /><em>Independence they can feel.</em></h2>
        </header>
        <ol className="hsp-story__milestones">
          {milestones.map(({ title, description, Icon }) => (
            <li key={title}>
              <span className="hsp-story__medallion"><Icon aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
        <p className="hsp-story__closing">
          We don’t just prepare for the next test.<br />
          <em>We prepare for what comes next.</em>
        </p>
      </div>
    </section>
  );
}

export function HSCBridge() {
  return <section className="hsp-hsc" ref={useSectionReveal()}><img src="/images/programs/high-school-professional/hsc-navy-ink-transition.png" alt="" aria-hidden="true" /><div className="hsp-hsc__copy" data-reveal><p><span>05</span> The HSC Bridge</p><h2>Year 10 isn’t<br />the <em>finish line.</em></h2></div><div className="hsp-hsc__star" aria-hidden="true">✦</div><div className="hsp-hsc__next" data-reveal><h3>It’s where the<br /><em>next journey</em> begins.</h3><Link to="/hsc-excellence">Explore HSC <ArrowRight /></Link></div></section>;
}

export default function HighSchoolProfessionalJourney() {
  return <div className="hs-professional"><MethodTransition /><TeacherProgressStory /><HSCBridge /></div>;
}

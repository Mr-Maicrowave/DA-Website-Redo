import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Users } from 'lucide-react';
import { MethodTransition } from '../high-school-method-transition/MethodTransition';
import { milestones, supportPrinciples, teachingStages } from './professionalJourneyData';
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

function SectionHeading({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return <header className="hsp-heading" data-reveal><span>{number}</span><div><h2>{title}</h2><p>{subtitle}</p></div></header>;
}

export function TeachingProcess() {
  return <section className="hsp-section hsp-process" ref={useSectionReveal()}>
    <SectionHeading number="02" title="How We Teach" subtitle="A proven approach that builds understanding and independence." />
    <div className="hsp-process__line" aria-hidden="true" />
    <ol>{teachingStages.map(({ title, description, Icon }) => <li key={title} data-reveal><div><Icon /></div><h3>{title}</h3><p>{description}</p></li>)}</ol>
  </section>;
}

export function TeacherSupport() {
  return <section className="hsp-section hsp-support" ref={useSectionReveal()}>
    <div className="hsp-support__photo" data-reveal><img src="/images/programs/highschool-tutor-1on1-1.jpg" alt="A DA Tuition tutor guiding a high school student" loading="lazy" /></div>
    <div className="hsp-support__content"><SectionHeading number="03" title="Your Teacher Beside You" subtitle="Small groups. Real connection." />
      <div className="hsp-support__principles">{supportPrinciples.map(({ title, description, Icon }) => <article key={title} data-reveal><Icon /><h3>{title}</h3><p>{description}</p></article>)}</div>
    </div>
    <aside data-reveal><span>Our tutors</span>{['Subject specialists', 'Vetted & trained', 'Passionate educators', "Committed to your child’s growth"].map(item => <p key={item}><Check />{item}</p>)}<Users /></aside>
  </section>;
}

export function ProgressJourney() {
  return <section className="hsp-section hsp-progress" ref={useSectionReveal()}><SectionHeading number="04" title="Progress You Can See" subtitle="Skills today. Confidence tomorrow." />
    <div className="hsp-progress__path" aria-hidden="true" />
    <ol>{milestones.map(({ title, description, Icon }) => <li key={title} data-reveal><Icon /><h3>{title}</h3><p>{description}</p></li>)}</ol>
  </section>;
}

export function HSCBridge() {
  return <section className="hsp-hsc" ref={useSectionReveal()}><img src="/images/programs/high-school-professional/hsc-navy-ink-transition.png" alt="" aria-hidden="true" /><div className="hsp-hsc__copy" data-reveal><p><span>05</span> The HSC Bridge</p><h2>Year 10 isn’t<br />the <em>finish line.</em></h2></div><div className="hsp-hsc__star" aria-hidden="true">✦</div><div className="hsp-hsc__next" data-reveal><h3>It’s where the<br /><em>next journey</em> begins.</h3><Link to="/hsc-excellence">Explore HSC <ArrowRight /></Link></div></section>;
}

export default function HighSchoolProfessionalJourney() {
  return <div className="hs-professional"><MethodTransition /><TeachingProcess /><TeacherSupport /><ProgressJourney /><HSCBridge /></div>;
}

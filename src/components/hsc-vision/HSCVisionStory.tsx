import { useLayoutEffect, useRef } from 'react';
import { BookOpen, Lightbulb, Target, Trophy } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './hsc-vision-story.css';
import './hsc-vision-continuity.css';

gsap.registerPlugin(ScrollTrigger);

const assets = '/images/hsc-vision';

const support = [
  { title: 'Understand', Icon: Lightbulb, lines: ['Where are they now?', 'What are their strengths', 'and challenges?'] },
  { title: 'Plan', Icon: Target, lines: ['What subjects?', 'What needs work?', 'What’s the goal?'] },
  { title: 'Prepare', Icon: BookOpen, lines: ['The right strategy.', 'The right support.', 'The right habits.'] },
  { title: 'Perform', Icon: Trophy, lines: ['Apply the work.', 'Stay focused.', 'Show what they know.'] },
] as const;

const roadmap = [
  ['Year 11', 'Build foundations'], ['Year 12', 'Refine skills'], ['Trials', 'Pressure test'], ['HSC', 'Perform'], ['What’s next?', 'Your future awaits'],
] as const;

export default function HSCVisionStory() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'));
        }, { threshold: .18 });
        rootRef.current?.querySelectorAll('.hscv-reveal').forEach((el) => observer.observe(el));

        gsap.fromTo('.hscv-wash-mask', { clipPath: 'polygon(0 100%,0 100%,8% 94%,18% 100%,30% 92%,42% 100%,0 100%)' }, {
          clipPath: 'polygon(0 0,18% 3%,35% 0,52% 4%,68% 0,84% 3%,100% 0,100% 100%,0 100%)', ease: 'none',
          scrollTrigger: { trigger: '#hsc-vision-landscape', start: 'top 88%', end: 'top 18%', scrub: .8 },
        });

        gsap.fromTo('.hscv-landscape img', { yPercent: -3, scale: 1.04 }, {
          yPercent: 3, scale: 1.08, ease: 'none',
          scrollTrigger: { trigger: '#hsc-vision-landscape', start: 'top bottom', end: 'bottom top', scrub: .8 },
        });
        gsap.fromTo('.hscv-shared-watercolour', { scale: .92, opacity: .72 }, {
          scale: 1.42, opacity: .92, ease: 'none',
          scrollTrigger: { trigger: '#hsc-vision-student', start: 'top 55%', end: 'bottom top', scrub: .7 },
        });
        gsap.fromTo('.hscv-architecture-frame', { autoAlpha: 0, clipPath: 'inset(0 48% 0 48%)' }, {
          autoAlpha: .42, clipPath: 'inset(0 0% 0 0%)', ease: 'none',
          scrollTrigger: { trigger: '#hsc-vision-landscape', start: '55% center', end: 'bottom top', scrub: .75 },
        });

        gsap.fromTo('.hscv-door-stage img', { scale: 1 }, {
          scale: 3.4, ease: 'power1.inOut', transformOrigin: '50% 54%',
          scrollTrigger: { trigger: '#hsc-vision-doors', start: 'top top', end: 'bottom bottom', scrub: .8 },
        });
        gsap.to('.hscv-door-copy', { autoAlpha: 0, y: -45, scrollTrigger: { trigger: '#hsc-vision-doors', start: 'top top', end: 'top -25%', scrub: .5 } });
        gsap.fromTo('.hscv-door-light', { autoAlpha: 0, scale: .5 }, { autoAlpha: 1, scale: 4.5, scrollTrigger: { trigger: '#hsc-vision-doors', start: 'top -35%', end: 'bottom bottom', scrub: .7 } });
        gsap.fromTo('.hscv-plan-card', { y: 70, opacity: 0 }, {
          y: 0, opacity: 1, ease: 'power2.out',
          scrollTrigger: { trigger: '#hsc-vision-plan', start: 'top 78%', end: 'top 42%', scrub: .55 },
        });
        gsap.fromTo('.hscv-ink-wash', { clipPath: 'polygon(0 100%,0 100%,100% 100%,100% 100%)' }, {
          clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', ease: 'none',
          scrollTrigger: { trigger: '#hsc-vision-plan', start: '58% center', end: 'bottom top', scrub: .8 },
        });
        gsap.fromTo('.hscv-gold-carry', { scale: .4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, scrollTrigger: { trigger: '#hsc-vision-plan', start: '70% center', end: 'bottom top', scrub: .6 } });
        gsap.fromTo('.hscv-roadmap>img', { yPercent: -4, scale: 1.08 }, { yPercent: 4, scale: 1.14, ease: 'none', scrollTrigger: { trigger: '#hsc-vision-roadmap', start: 'top bottom', end: 'bottom top', scrub: .8 } });
        return () => observer.disconnect();
      }, rootRef);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);

  return <div className="hscv" ref={rootRef} data-continuity="paper-watercolour-architecture-light-ink-gold">
    <section id="hsc-vision-year-shift" className="hscv-section hscv-year hscv-reveal">
      <p className="hscv-year10">Year 10</p><div className="hscv-year11"><strong>Year 11</strong><p>Before we talk about marks…</p><em>…we start with where they want to go.</em></div>
    </section>

    <section id="hsc-vision-student" className="hscv-section hscv-student">
      <div className="hscv-copy hscv-reveal"><span>Beyond the HSC</span><h2>Every student has<br/>a different picture of<br/>what comes next.</h2><p>Some already know exactly where they want to go.<br/>Others are still figuring it out.</p></div>
      <div className="hscv-student-art hscv-reveal"><img className="hscv-watercolour hscv-shared-watercolour" src={`${assets}/hsc-watercolour-atmosphere.png`} alt=""/><img className="hscv-ben" src={`${assets}/hsc-student-ben.png`} alt="HSC student considering his future"/></div>
    </section>

    <section id="hsc-vision-futures" className="hscv-section hscv-futures hscv-reveal">
      <header><span>Possibility, without pressure</span><h2>Many possible futures</h2></header>
      <div className="hscv-collage"><img src={`${assets}/hsc-future-collage.png`} alt="Medicine, engineering, science, law, business, design and teaching possibilities"/><p>Something they<br/>haven’t discovered yet.</p></div>
    </section>

    <section id="hsc-vision-parents" className="hscv-section hscv-parents">
      <div className="hscv-copy hscv-reveal"><span>Reassurance for parents</span><h2>You don’t need them<br/>to have their whole future<br/>figured out.</h2><em>Neither do we.</em><p>What matters now is helping them build the knowledge, habits and results to keep the right doors open.</p></div>
      <img className="hscv-reveal" src={`${assets}/hsc-parent-reassurance.png`} alt="Graduation cap and academic books"/>
    </section>

    <section id="hsc-vision-landscape" className="hscv-section hscv-landscape">
      <div className="hscv-wash-mask"><img src={`${assets}/hsc-future-landscape.png`} alt="A wide academic landscape opening toward the future"/></div>
      <div className="hscv-architecture-frame" aria-hidden="true"><img src={`${assets}/hsc-opportunity-doors.png`} alt=""/></div>
      <div className="hscv-landscape-copy"><h2>Different dreams.<br/>Different destinations.</h2><h2>What matters is having<br/>the foundation to reach them.</h2></div>
    </section>

    <section id="hsc-vision-doors" className="hscv-section hscv-doors">
      <div className="hscv-door-stage"><img src={`${assets}/hsc-opportunity-doors.png`} alt="Architectural openings revealing different future opportunities"/><div className="hscv-door-light" aria-hidden="true"/></div>
      <div className="hscv-door-copy"><h2>Our job isn’t to<br/><em>choose the dream</em> for them.</h2><h2>It’s to help keep their<br/><em>possibilities open.</em></h2></div>
    </section>

    <section id="hsc-vision-plan" className="hscv-section hscv-plan"><div className="hscv-plan-card"><img src={`${assets}/hsc-plan-notebook.png`} alt="An open notebook ready for an HSC plan"/><div><span>One clear plan</span><h2>The HSC plan</h2><p>We turn possibility into a clear, structured plan.</p></div></div><div className="hscv-ink-wash" aria-hidden="true"/><span className="hscv-gold-carry" aria-hidden="true"/></section>

    <section id="hsc-vision-support" className="hscv-section hscv-support hscv-reveal"><header><span>Our HSC support</span><h2>A proven approach, built for HSC success.</h2></header><div className="hscv-support-grid">{support.map(({title,Icon,lines})=><article key={title}><Icon/><h3>{title}</h3><p>{lines.map(line=><span key={line}>{line}</span>)}</p></article>)}</div></section>

    <section id="hsc-vision-roadmap" className="hscv-section hscv-roadmap"><img src={`${assets}/hsc-final-horizon.png`} alt=""/><div className="hscv-roadmap-content hscv-reveal"><span>The HSC journey</span><h2>What’s Next?</h2><p>Your Future Awaits.</p><div className="hscv-milestones">{roadmap.map(([title,copy],i)=><article key={title}><b>{i+1}</b><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
  </div>;
}

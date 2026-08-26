import { useLayoutEffect, useRef } from 'react';
import {
  Activity, BarChart3, BookOpen, BriefcaseBusiness, Compass, FlaskConical,
  GraduationCap, HeartPulse, Lightbulb, Pencil, Scale, Settings, Target, Trophy,
} from 'lucide-react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './hsc-future-story.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const assetRoot = '/images/hsc-storyboard-v3';

const futures = [
  { name: 'Medicine', Icon: HeartPulse, x: 18, y: 27, path: 'M500 480 C395 385 300 255 180 230' },
  { name: 'Law', Icon: Scale, x: 13, y: 44, path: 'M500 480 C365 440 255 390 125 390' },
  { name: 'Business', Icon: BarChart3, x: 17, y: 62, path: 'M500 480 C360 490 270 555 165 560' },
  { name: 'Teaching', Icon: GraduationCap, x: 27, y: 79, path: 'M500 480 C405 560 345 680 270 715' },
  { name: 'Engineering', Icon: Settings, x: 78, y: 26, path: 'M500 480 C610 365 690 250 780 220' },
  { name: 'Science', Icon: FlaskConical, x: 86, y: 44, path: 'M500 480 C650 425 750 385 860 390' },
  { name: 'Design', Icon: Pencil, x: 80, y: 63, path: 'M500 480 C635 490 720 550 800 565' },
] as const;

const support = [
  { title: 'Understand', Icon: Compass, copy: <>Where are they now?<br/>What are their strengths<br/>and challenges?</> },
  { title: 'Plan', Icon: Target, copy: <>What subjects?<br/>What needs work?<br/>What’s the goal?</> },
  { title: 'Prepare', Icon: BookOpen, copy: <>The right strategy.<br/>The right support.<br/>The right habits.</> },
  { title: 'Perform', Icon: Trophy, copy: <>Apply the work.<br/>Stay focused.<br/>Show what they know.</> },
] as const;

const roadmap = [
  { title: 'Year 11', copy: 'Build Foundations', Icon: Lightbulb },
  { title: 'Year 12', copy: 'Refine Skills', Icon: BarChart3 },
  { title: 'Trials', copy: 'Pressure Test', Icon: Activity },
  { title: 'HSC', copy: 'Perform', Icon: GraduationCap },
  { title: 'What’s next?', copy: 'Your Future Awaits', Icon: BriefcaseBusiness },
] as const;

export default function HSCFutureStory() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current || !stageRef.current) return;
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference) and (min-width: 769px)', () => {
      const context = gsap.context(() => {
        const q = gsap.utils.selector(stageRef.current);
        const branches = q<SVGPathElement>('.hfs-branch');
        const perspectivePaths = q<SVGPathElement>('.hfs-perspective-path');
        const supportNodes = q<HTMLElement>('.hfs-support-node');
        const roadmapNodes = q<HTMLElement>('.hfs-roadmap-node');

        gsap.set(['.hfs-copy-student', '.hfs-copy-parent', '.hfs-copy-horizon', '.hfs-copy-opportunity', '.hfs-copy-support', '.hfs-copy-roadmap'], { autoAlpha: 0 });
        gsap.set('.hfs-year11', { autoAlpha: 0, y: 20 });
        gsap.set('.hfs-ben', { autoAlpha: 0, y: 54, scale: .97 });
        gsap.set('.hfs-watercolor', { autoAlpha: 0, scale: .76 });
        gsap.set(['.hfs-horizon', '.hfs-roadmap-bg', '.hfs-door-camera', '.hfs-clear-plan', '.hfs-gold-line'], { autoAlpha: 0 });
        gsap.set('.hfs-wipe', { xPercent: -125 });
        gsap.set(branches, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(perspectivePaths, { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 });
        gsap.set('.hfs-future-label', { autoAlpha: 0, y: 8 });
        gsap.set('.hfs-light-dot', { autoAlpha: 0 });
        gsap.set('.hfs-support-line', { scaleX: 0, transformOrigin: 'left center' });
        gsap.set([...supportNodes, ...roadmapNodes], { autoAlpha: 0, y: 18, scale: .9 });
        gsap.set('.hfs-roadmap-line', { scaleX: 0, transformOrigin: 'left center' });

        const master = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        master.addLabel('handover', 0)
          .to('.hfs-year10', { y: -30, scale: .94, opacity: .12, filter: 'blur(2px)', duration: 1.2 }, 'handover')
          .fromTo('.hfs-origin-path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.65 }, 'handover')
          .to('.hfs-year11', { autoAlpha: 1, y: 0, duration: .55 }, 'handover+=.72')
          .fromTo('.hfs-copy-handover .hfs-line', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: .22, duration: .42 }, 'handover+=1.02')

          .addLabel('student', 1.75)
          .to('.hfs-year11', { xPercent: -115, yPercent: -240, scale: .52, opacity: .34, duration: 1.1 }, 'student')
          .to('.hfs-copy-handover', { y: -60, autoAlpha: 0, duration: .75 }, 'student')
          .to('.hfs-watercolor', { autoAlpha: .92, scale: 1, duration: 1.2 }, 'student')
          .to('.hfs-ben', { autoAlpha: 1, y: 0, scale: 1, duration: .9 }, 'student+=.25')
          .to('.hfs-copy-student', { autoAlpha: 1, duration: .6 }, 'student+=.5')
          .fromTo('.hfs-copy-student > *', { x: -32, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: .16, duration: .55 }, 'student+=.5')

          .addLabel('possibilities', 3.1)
          .to('.hfs-copy-student', { y: -70, opacity: .12, duration: .7 }, 'possibilities')
          .to(branches, { strokeDashoffset: 0, duration: .75, stagger: .1 }, 'possibilities')
          .to('.hfs-future-label', { autoAlpha: 1, y: 0, duration: .35, stagger: .1 }, 'possibilities+=.2')
          .to('.hfs-light-dot', { autoAlpha: 1, duration: .15 }, 'possibilities+=.45')
          .to('.hfs-light-dot-1', { motionPath: { path: '#hfs-branch-1', align: '#hfs-branch-1', alignOrigin: [.5, .5] }, duration: .65 }, 'possibilities+=.48')
          .to('.hfs-light-dot-2', { motionPath: { path: '#hfs-branch-5', align: '#hfs-branch-5', alignOrigin: [.5, .5] }, duration: .65 }, 'possibilities+=.65')
          .to('.hfs-light-dot', { autoAlpha: 0, duration: .18 }, 'possibilities+=1.15')

          .addLabel('parent', 4.55)
          .to('.hfs-ben', { xPercent: 46, scale: .92, duration: 1.05 }, 'parent')
          .to(branches, { opacity: .28, duration: .7 }, 'parent')
          .to('.hfs-future-label', { opacity: .24, filter: 'blur(1px)', duration: .7 }, 'parent')
          .to('.hfs-copy-parent', { autoAlpha: 1, duration: .5 }, 'parent+=.22')
          .fromTo('.hfs-copy-parent > *', { x: -30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: .17, duration: .55 }, 'parent+=.22')

          .addLabel('wipe', 5.72)
          .to('.hfs-copy-parent', { y: -55, autoAlpha: 0, duration: .5 }, 'wipe')
          .to('.hfs-future-label', { autoAlpha: 0, duration: .35 }, 'wipe')
          .to(branches, { opacity: 0, duration: .45 }, 'wipe')
          .to('.hfs-wipe', { xPercent: 125, duration: 1.15 }, 'wipe')
          .to('.hfs-watercolor', { autoAlpha: 0, duration: .15 }, 'wipe+=.55')

          .addLabel('horizon', 6.35)
          .to('.hfs-ben', { xPercent: 0, scale: .82, yPercent: 20, duration: 1.2 }, 'horizon')
          .to('.hfs-ben-front', { autoAlpha: 0, duration: .55 }, 'horizon+=.12')
          .to('.hfs-ben-rear', { autoAlpha: 1, duration: .55 }, 'horizon+=.12')
          .to('.hfs-horizon', { autoAlpha: 1, duration: 1.05 }, 'horizon')
          .to(perspectivePaths, { autoAlpha: 1, strokeDashoffset: 0, duration: 1.15, stagger: .04 }, 'horizon+=.15')
          .to('.hfs-copy-horizon', { autoAlpha: 1, duration: .55 }, 'horizon+=.4')

          .addLabel('opportunities', 7.75)
          .to('.hfs-copy-horizon', { y: -45, autoAlpha: 0, duration: .65 }, 'opportunities')
          .to('.hfs-door-camera', { autoAlpha: 1, duration: .8 }, 'opportunities')
          .to('.hfs-copy-opportunity', { autoAlpha: 1, duration: .6 }, 'opportunities+=.5')
          .to('.hfs-light-dot-3', { autoAlpha: 1, motionPath: { path: '#hfs-perspective-4', align: '#hfs-perspective-4', alignOrigin: [.5, .5] }, duration: .8 }, 'opportunities+=.55')
          .to('.hfs-light-dot-3', { autoAlpha: 0, duration: .2 }, 'opportunities+=1.25')

          .addLabel('doorZoom', 9.25)
          .to('.hfs-copy-opportunity', { autoAlpha: 0, y: -45, duration: .4 }, 'doorZoom')
          .to('.hfs-door-camera', { scale: 3.7, xPercent: -1.5, yPercent: 8, duration: 1.35, ease: 'power2.inOut' }, 'doorZoom')
          .to('.hfs-door-glow', { autoAlpha: 1, scale: 1.45, duration: 1.1 }, 'doorZoom+=.25')
          .to('.hfs-ben', { yPercent: 48, scale: .58, autoAlpha: 0, duration: .9 }, 'doorZoom+=.2')

          .addLabel('clearPlan', 10.55)
          .to('.hfs-door-camera', { autoAlpha: 0, duration: .35 }, 'clearPlan')
          .to('.hfs-door-glow', { scale: 5, backgroundColor: '#fffaf0', duration: .7 }, 'clearPlan')
          .to(perspectivePaths, { strokeDashoffset: 1, opacity: 0, duration: .55 }, 'clearPlan')
          .to('.hfs-horizon', { autoAlpha: 0, duration: .5 }, 'clearPlan')
          .to('.hfs-gold-line', { autoAlpha: 1, duration: .45 }, 'clearPlan+=.3')
          .to('.hfs-clear-plan', { autoAlpha: 1, duration: .45 }, 'clearPlan+=.38')

          .addLabel('support', 11.55)
          .to('.hfs-clear-plan', { y: -45, autoAlpha: 0, duration: .45 }, 'support')
          .to('.hfs-copy-support', { autoAlpha: 1, duration: .5 }, 'support')
          .to('.hfs-support-line', { scaleX: 1, duration: 1.4 }, 'support+=.1')
          .to(supportNodes, { autoAlpha: 1, y: 0, scale: 1, duration: .38, stagger: .3 }, 'support+=.22')

          .addLabel('roadmap', 13.15)
          .to('.hfs-copy-support', { autoAlpha: 0, y: -35, duration: .5 }, 'roadmap')
          .to('.hfs-support', { autoAlpha: 0, duration: .55 }, 'roadmap')
          .to('.hfs-ben', { autoAlpha: 0, xPercent: -95, duration: .55 }, 'roadmap')
          .to('.hfs-roadmap-bg', { autoAlpha: 1, duration: .9 }, 'roadmap')
          .to('.hfs-copy-roadmap', { autoAlpha: 1, duration: .65 }, 'roadmap+=.22')
          .to('.hfs-roadmap-line', { scaleX: 1, duration: 1.35 }, 'roadmap+=.28')
          .to(roadmapNodes, { autoAlpha: 1, y: 0, scale: 1, duration: .38, stagger: .24 }, 'roadmap+=.4')
          .to('.hfs-final-portal', { '--portal-progress': 1, duration: .55 } as gsap.TweenVars, 'roadmap+=1.3');
      }, stageRef);
      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={rootRef} className="hfs-story" aria-labelledby="hfs-title">
      <div ref={stageRef} className="hfs-stage">
        <img className="hfs-watercolor" src={`${assetRoot}/watercolor-bloom.png`} alt="" aria-hidden="true" />
        <img className="hfs-horizon" src={`${assetRoot}/future-horizon.png`} alt="" aria-hidden="true" />
        <img className="hfs-roadmap-bg" src={`${assetRoot}/hsc-roadmap-horizon.png`} alt="" aria-hidden="true" />
        <img className="hfs-gold-line" src={`${assetRoot}/gold-journey-line.png`} alt="" aria-hidden="true" />
        <div className="hfs-wipe" aria-hidden="true" />
        <div className="hfs-door-camera" aria-hidden="true"><img src={`${assetRoot}/opportunity-portals.png`} alt="" /></div>
        <div className="hfs-door-glow" aria-hidden="true" />

        <svg className="hfs-journey-network" viewBox="0 0 1000 900" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="hfs-gold-glow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <path className="hfs-origin-path" pathLength="1" d="M-30 400 C160 300 270 435 390 335 S520 290 580 350" />
          <g className="hfs-branch-group">{futures.map((future, index) => <path id={`hfs-branch-${index + 1}`} className="hfs-branch" pathLength="1" d={future.path} key={future.name} />)}</g>
          <g className="hfs-perspective-group">{futures.map((_, index) => <path id={`hfs-perspective-${index + 1}`} className="hfs-perspective-path" pathLength="1" d={`M500 535 C${430 + index * 24} 600 ${105 + index * 132} 690 ${45 + index * 151} 820`} key={index} />)}</g>
          <circle className="hfs-light-dot hfs-light-dot-1" r="7" />
          <circle className="hfs-light-dot hfs-light-dot-2" r="7" />
          <circle className="hfs-light-dot hfs-light-dot-3" r="8" />
        </svg>

        <div className="hfs-ben" aria-hidden="true">
          <img className="hfs-ben-front" src={`${assetRoot}/ben-front.png`} alt="" />
          <img className="hfs-ben-rear" src={`${assetRoot}/ben-rear.png`} alt="" />
        </div>

        <div className="hfs-copy-handover">
          <p className="hfs-year10">Year 10</p>
          <p className="hfs-year11">Year 11</p>
          <h2 id="hfs-title" className="hfs-line">Before we talk about marks...</h2>
          <p className="hfs-script hfs-line">...we start with where they want to go.</p>
        </div>

        <div className="hfs-copy-student hfs-copy-left">
          <p className="hfs-kicker">Beyond the HSC</p>
          <h2>Every student has<br/>a different picture of<br/>what comes next.</h2>
          <p>Some already know exactly where they want to go.<br/>Others are still figuring it out.</p>
        </div>

        <div className="hfs-future-labels">{futures.map(({ name, Icon, x, y }) => <div className="hfs-future-label" style={{ left: `${x}%`, top: `${y}%` }} key={name}><Icon/><span>{name}</span></div>)}<p className="hfs-future-label hfs-undiscovered">Something they haven’t<br/>discovered yet.</p></div>

        <div className="hfs-copy-parent hfs-copy-left">
          <h2>You don’t need them<br/>to have their whole<br/>future figured out.</h2>
          <p className="hfs-script">Neither do we.</p>
          <p>What matters now is giving them the knowledge,<br/>habits and results to keep the right doors open.</p>
        </div>

        <div className="hfs-copy-horizon">
          <p>Different dreams.<br/>Different destinations.</p>
          <h2>What matters is having<br/>the foundation to reach them.</h2>
        </div>

        <div className="hfs-copy-opportunity"><h2>Our job isn’t to<br/><em>choose the dream</em><br/>for them.</h2><h2>It’s to help keep<br/>their <em>possibilities</em><br/>open.</h2></div>
        <div className="hfs-clear-plan"><p className="hfs-kicker">Through the door</p><h2>One clear plan.</h2></div>

        <div className="hfs-support">
          <div className="hfs-support-line" aria-hidden="true"/>
          <div className="hfs-support-nodes">{support.map(({ title, Icon, copy }) => <article className="hfs-support-node" key={title}><span><Icon/></span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </div>
        <div className="hfs-copy-support"><p className="hfs-kicker">How DA helps them get there</p><h2>One clear plan.</h2><aside>Their goal.<br/>Our plan.<br/><strong>One journey forward.</strong></aside></div>

        <div className="hfs-roadmap">
          <div className="hfs-roadmap-line" aria-hidden="true" />
          <div className="hfs-roadmap-nodes">{roadmap.map(({ title, copy, Icon }, index) => <article className="hfs-roadmap-node" key={title}><span className={index === roadmap.length - 1 ? 'hfs-final-portal' : undefined}><Icon/></span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </div>
        <div className="hfs-copy-roadmap"><h2>Two Years.<br/>One <em>Carefully<br/>Managed Journey.</em></h2></div>
      </div>
    </section>
  );
}

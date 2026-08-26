import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const PrimaryJourneyLayer = () => {
  const layerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    const story = document.querySelector<HTMLElement>('.primary-story');
    if (!layer || !story || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      gsap.set('.primary-journey-plane', { transformOrigin: '50% 50%' });
      gsap.to('.primary-journey-route', {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: '#primary-page-content', start: 'top 75%', end: 'bottom 30%', scrub: .7 },
      });
      gsap.to('.primary-journey-plane', {
        ease: 'none',
        motionPath: { path: '.primary-journey-route', align: '.primary-journey-route', autoRotate: true, alignOrigin: [.5, .5] },
        scrollTrigger: { trigger: '#primary-page-content', start: 'top 75%', end: 'bottom 30%', scrub: .8 },
      });
      gsap.to(layer, {
        opacity: 1,
        scrollTrigger: { trigger: '#pathway', start: 'top 70%', endTrigger: '#primary-journey-outro', end: 'bottom 35%', toggleActions: 'play reverse play reverse' },
      });
    }, story);

    return () => context.revert();
  }, []);

  return (
    <div ref={layerRef} className="primary-journey-layer" aria-hidden="true">
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <path className="primary-journey-route" pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M850 20 C700 110 870 190 690 260 C510 330 800 400 545 500 C310 590 650 675 420 760 C250 825 600 900 880 980" />
      </svg>
      <span className="primary-journey-plane">
        <svg viewBox="0 0 52 42"><path d="M3 21 48 4 34 37 24 25 15 31l3-12Z" /><path d="m18 19 30-15-24 21" /></svg>
      </span>
    </div>
  );
};

export default PrimaryJourneyLayer;

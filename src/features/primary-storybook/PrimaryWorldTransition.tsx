import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './primary-world-transition.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const PrimaryWorldTransition = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
          desktop: '(min-width: 821px)',
        },
        (matchContext) => {
          const conditions = matchContext.conditions as { motion: boolean; reduceMotion: boolean; desktop: boolean };
          const story = root.closest<HTMLElement>('.primary-story');
          const hero = story?.querySelector<HTMLElement>('.ps-opening__hero');
          const heroImage = hero?.querySelector<HTMLElement>('img');
          const landscapeImage = story?.querySelector<HTMLElement>('.primary-landscape-journey__image');
          const mist = root.querySelector<HTMLElement>('.primary-world-transition__mist');
          const plane = root.querySelector<SVGGElement>('.primary-world-transition__plane');
          const cleanPlane = root.querySelector<SVGPathElement>('.primary-world-transition__plane-clean');
          const crayonPlane = root.querySelector<SVGPathElement>('.primary-world-transition__plane-crayon');
          const trail = root.querySelector<SVGPathElement>('.primary-world-transition__trail-progress');
          const flightPath = root.querySelector<SVGPathElement>('#primary-world-flight-path');
          const doodles = gsap.utils.toArray<SVGElement>('.primary-world-transition__doodle', root);
          if (!hero || !mist || !plane || !trail || !flightPath) return;

          const trailLength = trail.getTotalLength();
          gsap.set(trail, { strokeDasharray: trailLength, strokeDashoffset: trailLength });

          if (conditions.reduceMotion) {
            gsap.set([mist, plane], { opacity: 1 });
            gsap.set(trail, { strokeDashoffset: trailLength * 0.48 });
            gsap.set(doodles, { opacity: 0.55, scale: 1 });
            return;
          }

          if (!conditions.motion) return;

          gsap.set(mist, { opacity: 0.35 });
          gsap.set(plane, { opacity: 0 });
          gsap.set(crayonPlane, { opacity: 0 });
          gsap.set(doodles, { opacity: 0, scale: 0.8, transformOrigin: 'center' });
          if (landscapeImage) gsap.set(landscapeImage, { y: 0, scale: 1, opacity: 0.94 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: 'bottom 78%',
              end: 'bottom 18%',
              scrub: 1.1,
            },
          });

          if (heroImage) timeline.to(heroImage, { scale: 1.018, y: -8, duration: 1, ease: 'none' }, 0);
          timeline
            .to(mist, { opacity: 1, duration: 0.3, ease: 'none' }, 0.08)
            .to(plane, { opacity: 1, duration: 0.08 }, 0.18)
            .to(plane, {
              duration: 0.58,
              ease: 'none',
              motionPath: { path: flightPath, align: flightPath, alignOrigin: [0.5, 0.5], autoRotate: true },
            }, 0.2)
            .to(trail, { strokeDashoffset: 0, duration: 0.62, ease: 'none' }, 0.2)
            .to(cleanPlane, { opacity: 0, duration: 0.12 }, 0.38)
            .to(crayonPlane, { opacity: 1, duration: 0.12 }, 0.38)
            .to(doodles, { opacity: 0.62, scale: 1, rotation: (index) => index % 2 ? 8 : -6, duration: 0.2, stagger: 0.045 }, 0.3);

          if (landscapeImage) timeline.to(landscapeImage, { opacity: 1, duration: 0.5, ease: 'none' }, 0.35);
          timeline.to(mist, { opacity: 0.32, duration: 0.28, ease: 'none' }, 0.72);
        },
      );
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="primary-world-transition" aria-hidden="true">
      <div className="primary-world-transition__mist" />
      <svg className="primary-world-transition__art" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path id="primary-world-flight-path" d="M250 34 C420 64 442 194 590 164 C680 146 645 80 580 106 C528 130 592 214 760 205 C914 198 1015 144 1135 112" />
        <path className="primary-world-transition__trail-base" d="M250 34 C420 64 442 194 590 164 C680 146 645 80 580 106 C528 130 592 214 760 205 C914 198 1015 144 1135 112" />
        <path className="primary-world-transition__trail-progress" d="M250 34 C420 64 442 194 590 164 C680 146 645 80 580 106 C528 130 592 214 760 205 C914 198 1015 144 1135 112" />
        <g className="primary-world-transition__plane">
          <path className="primary-world-transition__plane-clean" d="M-24 -12 L28 0 L-24 14 L-9 1 Z M-9 1 L-1 17" />
          <path className="primary-world-transition__plane-crayon" d="M-25 -11 L28 0 L-24 14 L-8 1 L28 0 M-8 1 L-1 17" />
        </g>
        <g className="primary-world-transition__doodles">
          <path className="primary-world-transition__doodle primary-world-transition__doodle--star" d="M352 202 l7 14 15 2-11 11 3 15-14-7-14 7 3-15-11-11 15-2z" />
          <path className="primary-world-transition__doodle primary-world-transition__doodle--spark" d="M875 78 v24 M863 90 h24" />
          <path className="primary-world-transition__doodle primary-world-transition__doodle--flower" d="M1030 218 c-8-16 10-21 13-7 3-14 21-9 13 7 16-8 21 10 7 13 14 3 9 21-7 13 8 16-10 21-13 7-3 14-21 9-13-7-16 8-21-10-7-13-14-3-9-21 7-13z M1043 230 v31" />
          <path className="primary-world-transition__doodle primary-world-transition__doodle--squiggle" d="M1180 246 c18-18 30 18 48 0 s30 18 48 0" />
        </g>
      </svg>
    </div>
  );
};

export default PrimaryWorldTransition;

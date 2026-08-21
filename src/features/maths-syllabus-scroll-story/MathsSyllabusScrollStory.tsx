import { useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  LOGO_REVEAL_PROGRESS,
  MATHS_TOWER_COPY_GROUPS,
  TOWER_RAIL_POINTS,
} from './maths-tower-story-data';
import './maths-syllabus-scroll-story.css';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

function interpolate(progress: number) {
  const after = TOWER_RAIL_POINTS.find((point) => point.progress >= progress) ?? TOWER_RAIL_POINTS.at(-1)!;
  const before = [...TOWER_RAIL_POINTS].reverse().find((point) => point.progress <= progress) ?? TOWER_RAIL_POINTS[0];
  const span = after.progress - before.progress || 1;
  const ratio = Math.max(0, Math.min(1, (progress - before.progress) / span));
  return {
    x: before.x + (after.x - before.x) * ratio,
    y: before.y + (after.y - before.y) * ratio,
  };
}

export const MathsSyllabusScrollStory = () => {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useLayoutEffect(() => {
    if (prefersReducedMotion || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    const media = gsap.matchMedia();

    function applyTowerProgress(progress: number) {
      const point = interpolate(progress);
      const hidden = TOWER_RAIL_POINTS.some((railPoint) => railPoint.hidden && Math.abs(progress - railPoint.progress) < 0.022);
      const logoProgress = Math.max(0, Math.min(1, (progress - LOGO_REVEAL_PROGRESS) / 0.015));
      const exitProgress = Math.max(0, Math.min(1, (progress - 0.94) / (LOGO_REVEAL_PROGRESS - 0.94)));
      const landingX = point.x + (50 - point.x) * exitProgress;
      const landingY = point.y + (50 - point.y) * exitProgress;

      root.style.setProperty('--tower-y', `${Math.min(100, progress * 108)}%`);
      root.style.setProperty('--ball-x', `${landingX}%`);
      root.style.setProperty('--ball-y', `${landingY}%`);
      root.style.setProperty('--ball-scale', `${1 - exitProgress * 0.8}`);
      root.style.setProperty('--ball-visibility', hidden || logoProgress > 0.2 ? '0' : '1');
      root.style.setProperty('--logo-opacity', logoProgress > 0 ? '1' : '0');
      root.style.setProperty('--logo-scale', `${0.04 + logoProgress * 0.96}`);
      root.style.setProperty('--logo-mask', `${logoProgress * 72}%`);
      root.style.setProperty('--ripple-scale', `${0.2 + logoProgress * 1.8}`);
      root.style.setProperty('--ripple-opacity', `${Math.max(0, 1 - logoProgress)}`);
      root.style.setProperty('--content-opacity', `${Math.max(0, 1 - exitProgress * 2.5)}`);
    }

    const context = gsap.context(() => {
      media.add(DESKTOP_MEDIA_QUERY, () => {
        const copy = MATHS_TOWER_COPY_GROUPS.map((group) => `[data-tower-copy="${group.id}"]`);
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=620%',
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (trigger) => applyTowerProgress(trigger.progress),
          },
        });

        timeline.set(copy, { opacity: 0 }, 0);
        MATHS_TOWER_COPY_GROUPS.forEach((group, index) => {
          const current = `[data-tower-copy="${group.id}"]`;
          // Keep each explanation legible for the vast majority of its chapter.
          // A short dissolve prevents the two large serif headings from ever
          // reading as a stack of presentation slides.
          timeline.to(current, { opacity: 1, duration: 0.014 }, group.progress);
          if (index > 0) {
            const previous = `[data-tower-copy="${MATHS_TOWER_COPY_GROUPS[index - 1].id}"]`;
            timeline.to(previous, { opacity: 0, duration: 0.014 }, group.progress);
          }
        });

        return () => timeline.kill();
      });
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section ref={rootRef} className="maths-syllabus-story maths-tower-story" aria-labelledby="maths-syllabus-story-heading">
      <div className="maths-tower-story__sticky">
        <div className="maths-tower-story__visual" aria-hidden="true">
          <div className="maths-tower-story__rear" />
          <div className="maths-tower-story__ball" />
          <div className="maths-tower-story__front-mask maths-tower-story__front-mask--left" />
          <div className="maths-tower-story__front-mask maths-tower-story__front-mask--right" />
          <div className="maths-tower-story__ripple" />
        </div>

        <div className="maths-tower-story__content">
          <div className="maths-tower-story__heading-copy">
            <p className="maths-tower-story__kicker">Mathematics from Years 7 to 12</p>
            <h2 id="maths-syllabus-story-heading">Build ideas that travel further</h2>
            <p>One connected approach to the concepts, methods and confidence that mathematics asks of you next.</p>
          </div>

          <div className="maths-tower-story__copies">
            {MATHS_TOWER_COPY_GROUPS.map((group) => (
              <article className="maths-tower-story__copy" data-tower-copy={group.id} key={group.id}>
                <p className="maths-tower-story__eyebrow">{group.eyebrow}</p>
                <p className="maths-tower-story__course">{group.course}</p>
                <h3>{group.title}</h3>
                <p>{group.teaching}</p>
              </article>
            ))}
          </div>
        </div>

        <img className="maths-tower-story__logo" src="/images/maths-tower-story/da-logo-full-exact.png" alt="DA Tuition" />
      </div>
    </section>
  );
};

export default MathsSyllabusScrollStory;

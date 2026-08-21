import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MathsTowerScene } from './MathsTowerScene';
import { TOWER_CHAPTERS, getEndingProgress } from './maths-tower-scene-data';
import './maths-syllabus-scroll-story.css';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

type StoryStyle = CSSProperties & {
  '--tower-opacity': number;
  '--logo-progress': number;
  '--logo-mask': string;
  '--logo-scale': number;
  '--bloom-scale': number;
  '--ripple-scale': number;
  '--ripple-opacity': number;
};

export const MathsSyllabusScrollStory = () => {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [isDesktop, setIsDesktop] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const canRenderTower = isDesktop && !prefersReducedMotion && !webglFailed;
  const ending = getEndingProgress(progress);
  const storyStyle: StoryStyle = {
    '--tower-opacity': ending.towerOpacity,
    '--logo-progress': ending.logoProgress,
    '--logo-mask': `${ending.logoProgress * 72}%`,
    '--logo-scale': 0.08 + ending.logoProgress * 0.92,
    '--bloom-scale': 0.08 + ending.logoProgress * 1.08,
    '--ripple-scale': 0.25 + ending.logoProgress * 1.75,
    '--ripple-opacity': ending.logoProgress > 0 ? 1 - ending.logoProgress : 0,
  };

  const handleContextFailure = useCallback(() => {
    setWebglFailed(true);
  }, []);

  useLayoutEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const updateDesktopMatch = () => setIsDesktop(desktopQuery.matches);

    updateDesktopMatch();
    desktopQuery.addEventListener('change', updateDesktopMatch);
    return () => desktopQuery.removeEventListener('change', updateDesktopMatch);
  }, []);

  useLayoutEffect(() => {
    if (!canRenderTower || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    const media = gsap.matchMedia();

    const context = gsap.context(() => {
      media.add(DESKTOP_MEDIA_QUERY, () => {
        const cards = TOWER_CHAPTERS.map((chapter) => `[data-tower-copy="${chapter.id}"]`);
        const content = root.querySelector('.maths-tower-story__content');
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
            onUpdate: (trigger) => setProgress(trigger.progress),
          },
        });

        timeline.set(cards, { autoAlpha: 0 }, 0);
        TOWER_CHAPTERS.forEach((chapter, index) => {
          const current = `[data-tower-copy="${chapter.id}"]`;
          timeline.set(current, { autoAlpha: 1 }, chapter.progress);

          if (index > 0) {
            const previous = `[data-tower-copy="${TOWER_CHAPTERS[index - 1].id}"]`;
            timeline.to(previous, { autoAlpha: 0, duration: 0.018 }, Math.max(0, chapter.progress - 0.018));
          }
        });

        if (content) timeline.to(content, { opacity: 0, duration: 0.045 }, 0.94);

        return () => timeline.kill();
      });
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, [canRenderTower]);

  return (
    <section
      ref={rootRef}
      className="maths-syllabus-story maths-tower-story"
      aria-labelledby="maths-syllabus-story-heading"
      data-fallback={!canRenderTower}
      style={storyStyle}
    >
      <div className="maths-tower-story__sticky">
        <div className="maths-tower-story__visual">
          {canRenderTower ? (
            <>
              <div className="maths-tower-story__scene">
                <MathsTowerScene progress={progress} onContextFailure={handleContextFailure} />
              </div>

              <div className="maths-tower-story__ending" aria-hidden={ending.logoProgress === 0}>
                <div className="maths-tower-story__ending-bloom" aria-hidden="true" />
                <div className="maths-tower-story__ending-ripple" aria-hidden="true" />
                <img
                  className="maths-tower-story__logo"
                  src="/images/maths-tower-story/da-logo-full-exact.png"
                  alt="DA Tuition"
                />
              </div>
            </>
          ) : (
            <img
              className="maths-tower-story__poster"
              src="/images/maths-tower-story/tower-poster.webp"
              alt=""
              decoding="async"
              loading="lazy"
            />
          )}
        </div>

        <div className="maths-tower-story__content">
          <div className="maths-tower-story__heading-copy">
            <p className="maths-tower-story__kicker">Mathematics from Years 7 to 12</p>
            <h2 id="maths-syllabus-story-heading">Build ideas that travel further</h2>
            <p>One connected approach to the concepts, methods and confidence that mathematics asks of you next.</p>
          </div>

          <div className="maths-tower-story__copies">
            {TOWER_CHAPTERS.map((chapter) => (
              <article className="maths-tower-story__copy" data-tower-copy={chapter.id} key={chapter.id}>
                <p className="maths-tower-story__eyebrow">{chapter.eyebrow}</p>
                <p className="maths-tower-story__course">{chapter.course}</p>
                <h3>{chapter.title}</h3>
                <p>{chapter.teaching}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MathsSyllabusScrollStory;

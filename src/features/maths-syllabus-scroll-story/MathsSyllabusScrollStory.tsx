import { useRef } from 'react';
import { MATHS_SYLLABUS_STORY_BEATS } from './maths-syllabus-scroll-story-data';
import './maths-syllabus-scroll-story.css';

const STORY_CURVE = 'M 102 646 C 244 562, 334 614, 454 482 S 694 222, 814 362 S 1058 618, 1328 166';

export const MathsSyllabusScrollStory = () => {
  const rootRef = useRef<HTMLElement>(null);

  return (
    <section ref={rootRef} className="maths-syllabus-story" aria-labelledby="maths-syllabus-story-heading">
      <div className="maths-syllabus-story__sticky-scene">
        <div className="maths-syllabus-story__plates" aria-hidden="true">
          {MATHS_SYLLABUS_STORY_BEATS.map((beat, index) => (
            <img
              key={beat.id}
              className="maths-syllabus-story__plate"
              data-plate={beat.id}
              src={'/images/maths-syllabus-scroll-story/' + beat.plate + '.webp'}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        <svg
          className="maths-syllabus-story__overlay"
          viewBox="0 0 1440 810"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <filter id="maths-syllabus-story-glow" x="-15%" y="-30%" width="130%" height="160%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>
          <path
            className="maths-syllabus-story__line maths-syllabus-story__line--glow"
            d={STORY_CURVE}
            pathLength="1"
          />
          <path className="maths-syllabus-story__integral" d="M 776 422 C 844 474, 934 575, 1047 532 L 1047 640 L 776 640 Z" />
          <path className="maths-syllabus-story__line" d={STORY_CURVE} pathLength="1" />
          <path className="maths-syllabus-story__tangent" d="M 704 272 L 920 452" />
          <g className="maths-syllabus-story__point-group" transform="translate(814 362)">
            <circle className="maths-syllabus-story__point" r="5" />
          </g>
        </svg>
      </div>

      <div className="maths-syllabus-story__content">
        <p className="maths-syllabus-story__kicker">A connected HSC mathematics story</p>
        <h2 id="maths-syllabus-story-heading">Build ideas that travel further</h2>
        <p className="maths-syllabus-story__intro">
          Each course opens a different way to describe, test and extend the world around you.
        </p>

        <div className="maths-syllabus-story__beats">
          {MATHS_SYLLABUS_STORY_BEATS.map((beat) => (
            <article key={beat.id} className="maths-syllabus-story__beat" data-beat={beat.id}>
              <p className="maths-syllabus-story__eyebrow">{beat.eyebrow}</p>
              <p className="maths-syllabus-story__course">{beat.course}</p>
              <h3>{beat.title}</h3>
              <p className="maths-syllabus-story__anchor">{beat.syllabusAnchor}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MathsSyllabusScrollStory;

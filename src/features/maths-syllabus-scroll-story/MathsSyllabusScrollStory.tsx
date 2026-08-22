import { useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MATHS_SYLLABUS_STORY_BEATS } from './maths-syllabus-scroll-story-data';
import './maths-syllabus-scroll-story.css';

const STORY_CURVE = 'M 102 646 C 244 562, 334 614, 454 482 S 694 222, 814 362 S 1058 618, 1328 166';
const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';
const BEAT_TRANSITION_DURATION = 0.08;
const VIDEO_SCROLL_PORTION = 0.42;

const STORY_POINT_OFFSETS = [
  { x: 0, y: 0 },
  { x: 250, y: -104 },
  { x: 712, y: -284 },
  { x: 860, y: -134 },
  { x: 1018, y: -202 },
  { x: 1226, y: -480 },
] as const;

export const MathsSyllabusScrollStory = () => {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    if (!rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(DESKTOP_MEDIA_QUERY, () => {
          const video = videoRef.current;
          if (video) {
            video.preload = 'auto';
            video.load();
          }

          let storyProgress = 0;
          let pendingVideoTime: number | null = null;
          let videoSeekInFlight = false;

          const requestVideoSeek = (targetTime: number) => {
            if (!video || Math.abs(video.currentTime - targetTime) <= 1 / 30) return;

            if (video.seeking || videoSeekInFlight) {
              pendingVideoTime = targetTime;
              return;
            }

            videoSeekInFlight = true;
            video.currentTime = targetTime;
          };

          const flushPendingVideoSeek = () => {
            videoSeekInFlight = false;
            if (pendingVideoTime === null) return;

            const targetTime = pendingVideoTime;
            pendingVideoTime = null;
            requestVideoSeek(targetTime);
          };

          const syncVideoToScroll = () => {
            if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

            const targetTime = Math.min(storyProgress / VIDEO_SCROLL_PORTION, 1) * video.duration;
            requestVideoSeek(targetTime);
          };

          video?.addEventListener('loadedmetadata', syncVideoToScroll);
          video?.addEventListener('seeked', flushPendingVideoSeek);

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top top',
              end: '+=500%',
              pin: true,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (trigger) => {
                storyProgress = trigger.progress;
                syncVideoToScroll();
              },
            },
          });

          const point = '.maths-syllabus-story__point-group';
          const mainLine = '.maths-syllabus-story__line:not(.maths-syllabus-story__line--glow)';
          const glowLine = '.maths-syllabus-story__line--glow';
          const tangent = '.maths-syllabus-story__tangent';
          const integral = '.maths-syllabus-story__integral';
          const vector = '.maths-syllabus-story__vector';
          const overlay = '.maths-syllabus-story__overlay';
          const videoBridge = '.maths-syllabus-story__veo-bridge';

          timeline.set([mainLine, glowLine], { strokeDasharray: 1, strokeDashoffset: 1 }, 0);
          timeline.set([tangent, integral, vector], { opacity: 0 }, 0);
          timeline.set(point, { x: 0, y: 0 }, 0);
          timeline.set(overlay, { opacity: 0 }, 0);
          timeline.set(videoBridge, { opacity: 1 }, 0);
          timeline.to(videoBridge, { opacity: 0, duration: 0.08 }, VIDEO_SCROLL_PORTION);
          timeline.to(overlay, { opacity: 1, duration: 0.08 }, VIDEO_SCROLL_PORTION);

          MATHS_SYLLABUS_STORY_BEATS.forEach((beat, index) => {
            const pointOffset = STORY_POINT_OFFSETS[index];
            const lineOffset = 1 - (index + 1) / MATHS_SYLLABUS_STORY_BEATS.length;

            timeline.to(
              point,
              {
                x: pointOffset.x,
                y: pointOffset.y,
                duration: BEAT_TRANSITION_DURATION,
              },
              beat.desktopProgress,
            );
            timeline.to(
              mainLine,
              { strokeDashoffset: lineOffset, duration: BEAT_TRANSITION_DURATION },
              beat.desktopProgress,
            );
            timeline.to(
              glowLine,
              { strokeDashoffset: lineOffset, duration: BEAT_TRANSITION_DURATION },
              beat.desktopProgress,
            );

            if (index > 0) {
              const outgoingBeat = MATHS_SYLLABUS_STORY_BEATS[index - 1];

              timeline.to(
                [`[data-plate="${outgoingBeat.id}"]`, `[data-beat="${outgoingBeat.id}"]`],
                { opacity: 0, duration: BEAT_TRANSITION_DURATION },
                beat.desktopProgress,
              );
              timeline.to(
                [`[data-plate="${beat.id}"]`, `[data-beat="${beat.id}"]`],
                { opacity: 1, duration: BEAT_TRANSITION_DURATION },
                beat.desktopProgress,
              );
            }

            if (beat.id === 'change') {
              timeline.to(tangent, { opacity: 0.92, duration: BEAT_TRANSITION_DURATION }, beat.desktopProgress);
            }

            if (beat.id === 'accumulate') {
              timeline.to(tangent, { opacity: 0, duration: BEAT_TRANSITION_DURATION }, beat.desktopProgress);
              timeline.to(integral, { opacity: 1, duration: BEAT_TRANSITION_DURATION }, beat.desktopProgress);
            }

            if (beat.id === 'extend') {
              timeline.to(integral, { opacity: 0, duration: BEAT_TRANSITION_DURATION }, beat.desktopProgress);
              timeline.to(vector, { opacity: 0.9, duration: BEAT_TRANSITION_DURATION }, beat.desktopProgress);
              timeline.to(mainLine, { opacity: 0.48, duration: BEAT_TRANSITION_DURATION }, beat.desktopProgress);
              timeline.to(glowLine, { opacity: 0.2, duration: BEAT_TRANSITION_DURATION }, beat.desktopProgress);
            }

            if (beat.id === 'explore') {
              timeline.to(mainLine, { opacity: 0.36, duration: BEAT_TRANSITION_DURATION }, beat.desktopProgress);
              timeline.to(glowLine, { opacity: 0.14, duration: BEAT_TRANSITION_DURATION }, beat.desktopProgress);
            }
          });

          return () => {
            video?.removeEventListener('loadedmetadata', syncVideoToScroll);
            video?.removeEventListener('seeked', flushPendingVideoSeek);
            timeline.kill();
          };
      });
    }, rootRef);

    return () => {
      media.revert();
      context.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section ref={rootRef} className="maths-syllabus-story" aria-labelledby="maths-syllabus-story-heading">
      <div className="maths-syllabus-story__sticky maths-syllabus-story__sticky-scene">
        <div className="maths-syllabus-story__visual" aria-hidden="true">
          <video
            ref={videoRef}
            className="maths-syllabus-story__veo-bridge"
            src="/videos/maths-syllabus-scroll-story/curve-to-area-scrub.mp4"
            poster="/images/veo-frames/maths-veo-start-frame.png"
            muted
            playsInline
            preload="none"
          />
          <div className="maths-syllabus-story__plates">
            {MATHS_SYLLABUS_STORY_BEATS.map((beat, index) => (
              <img
                key={beat.id}
                className="maths-syllabus-story__plate"
                data-plate={beat.id}
                src={'/images/maths-syllabus-scroll-story/' + beat.plate + '.webp'}
                alt=""
                loading={index === 0 || beat.id === 'explore' ? 'eager' : 'lazy'}
              />
            ))}
          </div>

          <svg
            className="maths-syllabus-story__overlay"
            viewBox="0 0 1440 810"
            preserveAspectRatio="xMidYMid slice"
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
            <path className="maths-syllabus-story__vector" d="M 1038 496 L 1168 358 M 1168 358 L 1159 381 M 1168 358 L 1145 366" />
            <g transform="translate(102 646)">
              <g className="maths-syllabus-story__point-group">
                <circle className="maths-syllabus-story__point" r="5" />
              </g>
            </g>
          </svg>
        </div>

        <div className="maths-syllabus-story__content">
          <div className="maths-syllabus-story__heading-copy">
            <p className="maths-syllabus-story__kicker">A connected HSC mathematics story</p>
            <h2 id="maths-syllabus-story-heading">Build ideas that travel further</h2>
            <p className="maths-syllabus-story__intro">
              Each course opens a different way to describe, test and extend the world around you.
            </p>
          </div>

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
      </div>
    </section>
  );
};

export default MathsSyllabusScrollStory;

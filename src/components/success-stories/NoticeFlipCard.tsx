import { useRef, useState, type PointerEvent } from 'react';
import { motion } from 'framer-motion';

import './NoticeFlipCard.css';

// Matches the refined, non-bouncy easing already used for premium motion
// elsewhere on this page (see SuccessStories.tsx `easeOut`).
const easeOut = [0.22, 1, 0.36, 1] as const;

export type NoticeFlipCardProps = {
  theme: string;
  frontHeading: string;
  frontTitle: readonly [string, string];
  frontSubtitle: string;
  quoteLead: string;
  quoteAccent: string;
  reviewer: string;
  descriptor: string;
  frontSrc: string;
  frontAlt: string;
  backSrc: string;
  backAlt: string;
  index: number;
  reduceMotion: boolean | null;
};

const NoticeFlipCard = ({
  theme,
  frontHeading,
  frontTitle,
  frontSubtitle,
  quoteLead,
  quoteAccent,
  reviewer,
  descriptor,
  frontSrc,
  frontAlt,
  backSrc,
  backAlt,
  index,
  reduceMotion,
}: NoticeFlipCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const scene = sceneRef.current;
    if (!scene) return;
    const bounds = scene.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      scene.style.setProperty('--notice-tilt-x', `${(0.5 - y) * 5}deg`);
      scene.style.setProperty('--notice-tilt-y', `${(x - 0.5) * 7}deg`);
    });
  };

  const handlePointerLeave = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const scene = sceneRef.current;
    if (!scene) return;
    scene.style.setProperty('--notice-tilt-x', '0deg');
    scene.style.setProperty('--notice-tilt-y', '0deg');
  };

  return (
    <motion.div
      className={`notice-card notice-card--${index + 1}`}
      initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: index === 0 ? -2.5 : index === 2 ? 2.5 : 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.62, delay: 0.1 + index * 0.13, ease: easeOut }}
    >
      <div
        ref={sceneRef}
        className="notice-card__scene"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="notice-card__tilt">
          <button
            type="button"
            className={`notice-card__flip${flipped ? ' notice-card__flip--is-flipped' : ''}`}
            aria-pressed={flipped}
            aria-label={`${theme}. ${flipped ? 'Showing the parent comment. Press to flip back to the front.' : 'Press to flip and read a parent comment.'}`}
            onClick={() => setFlipped((current) => !current)}
          >
            <span className="notice-card__face notice-card__face--front" aria-hidden={flipped}>
              <img src={frontSrc} alt={frontAlt} loading="lazy" draggable={false} />
              <span className="notice-card__front-copy">
                <span className="notice-card__front-heading">{frontHeading}</span>
                <span className="notice-card__front-lower">
                  <span className="notice-card__front-title">
                    {frontTitle.map((line) => <span key={line}>{line}</span>)}
                  </span>
                  <span className="notice-card__front-divider" />
                  <span className="notice-card__front-subtitle">{frontSubtitle}</span>
                </span>
              </span>
            </span>
            <span className="notice-card__face notice-card__face--back" aria-hidden={!flipped}>
              <img src={backSrc} alt={backAlt} loading="lazy" draggable={false} />
              <span className="notice-card__back-copy">
                <span className="notice-card__back-heading">
                  <span className="notice-card__back-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="notice-card__back-heading-divider" aria-hidden="true" />
                  <span>{frontSubtitle}</span>
                </span>
                <span className="notice-card__back-quote-mark" aria-hidden="true">&ldquo;</span>
                <span className="notice-card__back-body">
                  <blockquote className="notice-card__back-quote">
                    &ldquo;{quoteLead} <em className="notice-card__back-accent">{quoteAccent}</em>&rdquo;
                  </blockquote>
                  <span className="notice-card__back-attribution">
                    <strong>— {reviewer}</strong>
                    <span>{descriptor}</span>
                  </span>
                </span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NoticeFlipCard;

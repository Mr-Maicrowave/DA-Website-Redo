import { useState } from 'react';
import { motion } from 'framer-motion';
import { gratitudeReviewNotes } from './gratitudeReviewNotes';
import { getEnvelopeShellMotion } from './gratitudeMotion';
import './GratitudeSection.css';

type GratitudeSectionProps = { reduceMotion: boolean | null };
const ease = [0.22, 1, 0.36, 1] as const;

const GratitudeSection = ({ reduceMotion }: GratitudeSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const duration = reduceMotion ? 0.12 : 0.72;
  const shellMotion = getEnvelopeShellMotion(isOpen, reduceMotion);

  return (
    <section className="ss-gratitude" data-open={isOpen} aria-labelledby="gratitude-heading">
      <p className="ss-gratitude__eyebrow">A NOTE FROM DA <span aria-hidden="true">♥</span></p>

      <motion.div
        className="ss-gratitude__polaroid-wall"
        aria-hidden={!isOpen}
        animate={isOpen
          ? { opacity: 1, visibility: 'visible', pointerEvents: 'auto' }
          : { opacity: 0, visibility: 'visible', pointerEvents: 'none', transitionEnd: { visibility: 'hidden' } }}
        transition={{ duration: reduceMotion ? 0.01 : isOpen ? 0.45 : 0.18, delay: reduceMotion || !isOpen ? 0 : 1.12, ease }}
      >
        <img className="ss-gratitude__clothesline" src="/images/success-stories/gratitude-clothesline-heart-v1.png" alt="" />
        <ul className="ss-gratitude__notes" aria-label="Messages from DA Tuition families">
          {gratitudeReviewNotes.map((note, index) => (
            <motion.li key={note.author}
              className={`ss-gratitude__note ss-gratitude__note--${index + 1}`}
              data-tone={note.tone}
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.35, delay: reduceMotion || !isOpen ? 0 : 1.18 + index * 0.045, ease }}>
              <img className="ss-gratitude__polaroid-frame" src="/images/success-stories/gratitude-polaroid-frame-v1.png" alt="" />
              <img className="ss-gratitude__clothespin" src="/images/success-stories/gratitude-clothespin-v1.png" alt="" />
              <span className="ss-gratitude__note-initial" aria-hidden="true">{note.initial}</span>
              <q>{note.quote}</q>
              <span className="ss-gratitude__note-heart" aria-hidden="true">♡</span>
              <span className="sr-only">— {note.author}</span>
            </motion.li>
          ))}
        </ul>

        <div className="ss-gratitude__central-message ss-gratitude__letter-transcript">
          <p className="ss-gratitude__central-kicker">— A NOTE FROM DA — <span aria-hidden="true">♥</span></p>
          <h2 id="gratitude-heading">These words mean <em>more than you know. ♡</em></h2>
          <span className="ss-gratitude__central-rule" aria-hidden="true" />
          <p>Thank you for trusting us with a small<br />part of your <b>child’s journey.</b></p>
          <p>Every message, every review and every story of progress reminds us that behind every lesson is a child finding a little more confidence, understanding and belief in themselves.</p>
          <strong>We're grateful to grow with you. ♡</strong>
        </div>
        <img className="ss-gratitude__flowers" src="/images/success-stories/gratitude-dried-flowers-v1.png" alt="" />
        <button className="ss-gratitude__wall-close" type="button" onClick={() => setIsOpen(false)} tabIndex={isOpen ? 0 : -1}
          aria-label="Close the thank-you wall from DA Tuition">×</button>
      </motion.div>

      <div className="ss-gratitude__stage" data-open={isOpen} data-reduce-motion={Boolean(reduceMotion)}>
        <motion.div className="ss-gratitude__envelope"
          animate={{ y: isOpen && !reduceMotion ? 96 : 0 }}
          transition={{ duration, ease }}>
          <motion.div className="ss-gratitude__shell-piece ss-gratitude__shell-piece--back" {...shellMotion}>
            <img className="ss-gratitude__envelope-back" src="/images/success-stories/gratitude-envelope-back-v2.png" alt="" />
          </motion.div>
          <motion.article className="ss-gratitude__letter" aria-labelledby="gratitude-heading"
            animate={reduceMotion
              ? { opacity: isOpen ? 1 : 0, y: 0, scale: 1, visibility: isOpen ? 'visible' : 'hidden' }
              : isOpen
                ? { opacity: 1, y: -100, scale: 1, rotate: 0, visibility: 'visible' }
                : { opacity: 1, y: 245, scale: 0.94, rotate: -1, visibility: 'visible', transitionEnd: { visibility: 'hidden' } }}
            transition={{ duration: reduceMotion ? 0.12 : 0.86, delay: reduceMotion ? 0 : isOpen ? 0.28 : 0.3, ease }}>
            <img className="ss-gratitude__letter-art" src="/images/success-stories/gratitude-letter-v2.png" alt="" />
            <button className="ss-gratitude__close" type="button" onClick={() => setIsOpen(false)}
              aria-label="Close the thank-you note from DA Tuition">×</button>
          </motion.article>
          <motion.div className="ss-gratitude__shell-piece ss-gratitude__shell-piece--flap" {...shellMotion}>
            <img className="ss-gratitude__flap" src="/images/success-stories/gratitude-envelope-flap-v2.png" alt="" />
          </motion.div>
          <motion.div className="ss-gratitude__shell-piece ss-gratitude__shell-piece--pocket" {...shellMotion}>
            <img className="ss-gratitude__pocket" src="/images/success-stories/gratitude-envelope-pocket-v2.png" alt="" />
          </motion.div>
          <motion.div className="ss-gratitude__shell-piece ss-gratitude__shell-piece--seal" {...shellMotion}>
            <img className="ss-gratitude__seal" src="/images/success-stories/gratitude-heart-seal-v2.png" alt="" />
          </motion.div>
          <button className="ss-gratitude__trigger" type="button" aria-expanded={isOpen}
            aria-label={isOpen ? 'Close the thank-you note from DA Tuition' : 'Open a thank-you note from DA Tuition'}
            onClick={() => setIsOpen((open) => !open)} />
        </motion.div>
      </div>
    </section>
  );
};

export default GratitudeSection;

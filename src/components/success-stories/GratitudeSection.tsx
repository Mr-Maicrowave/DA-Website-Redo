import { motion } from 'framer-motion';
import { Heart, Mail, MessageCircle, Sprout, type LucideIcon } from 'lucide-react';
import './GratitudeSection.css';

type GratitudeSectionProps = { reduceMotion: boolean | null };
type GratitudeItem = { icon: LucideIcon; lines: readonly [string, string, string]; highlight: string };

const gratitudeItems: readonly GratitudeItem[] = [
  { icon: MessageCircle, lines: ['Every review', 'you share', 'encourages us.'], highlight: 'review' },
  { icon: Mail, lines: ['Every message', 'you send', 'inspires us.'], highlight: 'message' },
  { icon: Heart, lines: ['Every kind word', 'means the', 'world to us.'], highlight: 'kind word' },
  { icon: Sprout, lines: ['Every child’s journey', 'is why we do', 'what we do.'], highlight: 'journey' },
];

const HighlightedLine = ({ line, highlight }: { line: string; highlight: string }) => {
  if (!line.includes(highlight)) return <>{line}</>;
  const [before, after = ''] = line.split(highlight);
  return <>{before}<em>{highlight}</em>{after}</>;
};

const GratitudeSection = ({ reduceMotion }: GratitudeSectionProps) => {
  const reveal = (delay: number, y = 15) => ({
    initial: reduceMotion ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="ss-gratitude" aria-labelledby="gratitude-heading">
      <span className="ss-gratitude__script ss-gratitude__script--left" aria-hidden="true">Thank</span>
      <span className="ss-gratitude__script ss-gratitude__script--right" aria-hidden="true">you</span>
      <span className="ss-gratitude__spark ss-gratitude__spark--one" aria-hidden="true">✦</span>
      <span className="ss-gratitude__spark ss-gratitude__spark--two" aria-hidden="true">✧</span>
      <span className="ss-gratitude__spark ss-gratitude__spark--three" aria-hidden="true">✦</span>

      <div className="ss-gratitude__content">
        <motion.div className="ss-gratitude__label-wrap" {...reveal(0.04, 10)}>
          <span aria-hidden="true" />
          <p className="ss-gratitude__label">A NOTE FROM DA</p>
          <span aria-hidden="true" />
        </motion.div>

        <h2 id="gratitude-heading" className="ss-gratitude__heading">
          <span className="ss-gratitude__heading-mask">
            <motion.span className="ss-gratitude__heading-primary" {...reveal(0.16, 24)}>Thank you</motion.span>
          </span>
          <span className="ss-gratitude__heading-mask">
            <motion.em className="ss-gratitude__heading-secondary" {...reveal(0.3, 24)}>for trusting us.</motion.em>
          </span>
        </h2>

        <svg className="ss-gratitude__headline-stroke" viewBox="0 0 510 24" aria-hidden="true">
          <motion.path d="M5 16 C82 3, 157 17, 236 11 S390 7, 505 13" fill="none" pathLength="1" stroke="currentColor" strokeDasharray="1"
            initial={reduceMotion ? false : { strokeDashoffset: 1 }} whileInView={{ strokeDashoffset: 0 }} viewport={{ once: true, amount: 0.5 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 1, delay: 0.48, ease: [0.22, 1, 0.36, 1] }} />
        </svg>

        <div className="ss-gratitude__items" aria-label="Four ways our community encourages DA Tuition">
          {gratitudeItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.highlight} className="ss-gratitude__item" {...reveal(0.62 + index * 0.1)}>
                <Icon aria-hidden="true" />
                <p>{item.lines.map((line) => <span key={line}><HighlightedLine line={line} highlight={item.highlight} /></span>)}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.p className="ss-gratitude__message" {...reveal(1.08, 12)}>
          Thank you for allowing us to be part of your <em>child’s journey.</em>
        </motion.p>

        <motion.div className="ss-gratitude__closing" {...reveal(1.2, 18)}>
          <img
            src="/images/success-stories/grateful-to-grow-with-you.png"
            alt="We’re grateful to grow with you."
            width={2172}
            height={724}
            loading="lazy"
            decoding="async"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default GratitudeSection;

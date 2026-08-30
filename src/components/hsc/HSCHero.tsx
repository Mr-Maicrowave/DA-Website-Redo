import { BookOpen, ClipboardCheck, Target, Trophy } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import './HSCHero.css';

const heroBenefits = [
  { id: 'master', icon: BookOpen, title: <>MASTER<br />THE CONTENT</>, text: <>Build deep<br />understanding.</> },
  { id: 'apply', icon: Target, title: <>APPLY WITH<br />CONFIDENCE</>, text: <>Develop skills that<br />earn the marks.</> },
  { id: 'feedback', icon: ClipboardCheck, title: <>FEEDBACK THAT<br />MOVES YOU</>, text: <>Know what to improve<br />and how to do it.</> },
  { id: 'perform', icon: Trophy, title: <>PERFORM<br />YOUR BEST</>, text: <>Walk in prepared.<br />Walk out proud.</> },
];

export default function HSCHero() {
  const reduceMotion = useReducedMotion();
  const entrance = (delay: number) => ({
    initial: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : .72, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="hsc-journey-hero" aria-labelledby="hsc-journey-hero-title">
      <img className="hsc-journey-hero__art" src="/media/hsc/hero/hsc-journey-background.png" alt="HSC student studying at sunrise with subject books and graduation imagery" />
      <div className="hsc-journey-hero__content">
        <motion.p {...entrance(.08)} className="hsc-journey-hero__kicker">HSC JOURNEY</motion.p>
        <motion.h1 {...entrance(.16)} id="hsc-journey-hero-title">
          <span>Your effort today.</span>
          <span className="hsc-journey-hero__future-line">Your <img src="/media/hsc/hero/hsc-future-lettering.png" alt="future" /><span className="hsc-journey-hero__tomorrow"> tomorrow.</span></span>
        </motion.h1>
        <motion.span {...entrance(.24)} className="hsc-journey-hero__rule" aria-hidden="true" />
        <motion.div {...entrance(.3)} className="hsc-journey-hero__intro">
          <p>HSC is more than a final exam.<br />It’s where preparation meets opportunity.</p>
          <p>We’re here to help you understand deeper,<br />perform stronger and achieve what matters.</p>
        </motion.div>
        <motion.div {...entrance(.38)} className="hsc-journey-hero__benefits" aria-label="HSC Excellence benefits">
          {heroBenefits.map(({ id, icon: Icon, title, text }) => (
            <article key={id}>
              <Icon aria-hidden="true" strokeWidth={1.35} />
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </motion.div>
        <motion.p {...entrance(.48)} className="hsc-journey-hero__closing">Different students. Different paths.<br /><span>The same goal.</span></motion.p>
      </div>
    </section>
  );
}

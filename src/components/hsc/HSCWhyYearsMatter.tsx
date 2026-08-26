import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './HSCWhyYearsMatter.css';

const explanations = {
  marks: 'Every internal assessment contributes to the bigger picture. We help students understand what matters, where marks are being lost, and what to work on next.',
  subjects: 'Scaling, workload, personal strengths and future goals all influence which subject combination is right for a student. We help families think through the decision carefully rather than treating every student the same.',
  technique: 'Many strong students understand the content but still underperform because they have not been trained in HSC-specific technique. We teach students how to turn what they know into the responses, working and exam technique that actually earn marks.',
  stamina: 'Year 12 is a marathon. Students who do not manage time, energy and stress across the year can perform below their potential in the final exams. We build strong habits, consistency and confidence alongside subject knowledge.',
} as const;

type ExplanationKey = keyof typeof explanations;

function WhyToggle({ id, open, onToggle }: { id: ExplanationKey; open: boolean; onToggle: () => void }) {
  return (
    <div className="hsc-editorial-why">
      <button type="button" aria-expanded={open} aria-controls={`hsc-why-${id}`} onClick={onToggle}>
        <span aria-hidden="true">{open ? '×' : '+'}</span>{open ? 'Close' : 'Why this matters'}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`hsc-why-${id}`}
            className="hsc-editorial-note"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -5 }}
            transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>{explanations[id]}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IdeaHeading({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="hsc-editorial-copy">
      <span className="hsc-editorial-number">{number}</span>
      <h3>{children}</h3>
    </div>
  );
}

export default function HSCWhyYearsMatter() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState<ExplanationKey | null>(null);
  const toggle = (key: ExplanationKey) => setOpen((current) => current === key ? null : key);
  const travel = reduceMotion ? 0 : 42;

  return (
    <section className="hsc-editorial" aria-labelledby="hsc-why-years-title">
      <div className="hsc-editorial-wash" aria-hidden="true" />

      <header className="hsc-editorial-intro">
        <p>WHY THESE YEARS MATTER</p>
        <span aria-hidden="true" />
        <h2 id="hsc-why-years-title">The HSC isn’t one final exam.</h2>
        <em>It’s hundreds of small moments<br />that add up.</em>
        <div className="hsc-editorial-down" aria-hidden="true">⌄</div>
      </header>

      <article className="hsc-editorial-moment hsc-editorial-moment--marks">
        <motion.div className="hsc-editorial-side" initial={{ opacity: .35 }} whileInView={{ opacity: 1 }} viewport={{ amount: .45 }} transition={{ duration: .55 }}>
          <IdeaHeading number="01">EVERY MARK<br />COUNTS.</IdeaHeading>
          <WhyToggle id="marks" open={open === 'marks'} onToggle={() => toggle('marks')} />
        </motion.div>
        <motion.div className="hsc-assessment-scene" initial={{ opacity: .45, x: travel, y: travel * .55 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ amount: .4 }} transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}>
          <div className="hsc-assessment-paper">
            <div className="hsc-paper-title">Assessment Task<small>Year 11</small></div>
            {[["Q1", "8", "10"], ["Q2", "13", "15"], ["Q3", "17", "20"]].map((row, index) => (
              <motion.div className="hsc-score-row" key={row[0]} initial={{ opacity: .25 }} whileInView={{ opacity: 1 }} viewport={{ amount: .7 }} transition={{ delay: .45 + index * .23, duration: .35 }}>
                <span>{row[0]}</span><strong>{row[1]}</strong><span>/ {row[2]}</span><b>✓</b>
              </motion.div>
            ))}
          </div>
          <motion.div className="hsc-score-total" initial={{ opacity: .2, scale: .8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: .7 }} transition={{ delay: 1.15, duration: .5 }}><strong>38</strong><span>/45</span></motion.div>
          <motion.p className="hsc-hand-note" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ amount: .7 }} transition={{ delay: 1.45, duration: .45 }}>Every mark<br />becomes part<br />of the story.</motion.p>
        </motion.div>
      </article>

      <article className="hsc-editorial-moment hsc-editorial-moment--subjects">
        <div className="hsc-subject-stack" aria-label="Example HSC subject combination">
          {['Mathematics', 'English', 'Chemistry', 'Business Studies'].map((subject, index) => (
            <motion.div key={subject} className={`hsc-subject-strip hsc-subject-strip--${index + 1}`} initial={{ opacity: .35, x: (index % 2 ? -1 : 1) * travel }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: .55 }} transition={{ delay: index * .16, duration: .62, ease: [0.16, 1, 0.3, 1] }}>
              <span>{subject}</span><i aria-hidden="true">{['√x', '□', '⚗', '▢'][index]}</i>
            </motion.div>
          ))}
        </div>
        <motion.div className="hsc-editorial-side" initial={{ opacity: .35 }} whileInView={{ opacity: 1 }} viewport={{ amount: .45 }} transition={{ delay: .25, duration: .55 }}>
          <IdeaHeading number="02">THE RIGHT<br />SUBJECTS MATTER.</IdeaHeading>
          <WhyToggle id="subjects" open={open === 'subjects'} onToggle={() => toggle('subjects')} />
        </motion.div>
      </article>

      <article className="hsc-editorial-moment hsc-editorial-moment--technique">
        <motion.div className="hsc-editorial-side" initial={{ opacity: .35 }} whileInView={{ opacity: 1 }} viewport={{ amount: .45 }} transition={{ delay: .75, duration: .55 }}>
          <IdeaHeading number="03">KNOWING IT<br />ISN’T ENOUGH.</IdeaHeading>
          <WhyToggle id="technique" open={open === 'technique'} onToggle={() => toggle('technique')} />
        </motion.div>
        <div className="hsc-feedback-scene">
          <motion.div className="hsc-answer-sheet" initial={{ opacity: .4, y: travel }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: .45 }} transition={{ duration: .72 }}>
            <p className="hsc-answer-prompt">Explain the causes of the<br />Great Depression.</p>
            {['Trade was already slowing before…', 'American markets became unstable…', 'This affected confidence and demand…', 'The consequences reached families…'].map((line, i) => <motion.p key={line} initial={{ opacity: .15 }} whileInView={{ opacity: .58 }} viewport={{ amount: .6 }} transition={{ delay: .25 + i * .16 }}>{line}</motion.p>)}
          </motion.div>
          <motion.div className="hsc-feedback-note" initial={{ opacity: .2, x: travel }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: .5 }} transition={{ delay: .55, duration: .65 }}>
            <h4>Tutor feedback</h4>
            {['Be more specific', 'Use evidence', 'Stronger structure'].map((item, i) => <motion.p key={item} initial={{ opacity: .15, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: .7 }} transition={{ delay: .85 + i * .18 }}>→ {item}</motion.p>)}
            <motion.strong initial={{ opacity: 0, scale: .7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: .8 }} transition={{ delay: 1.35 }}>13/20</motion.strong>
          </motion.div>
          <div className="hsc-feedback-pen" aria-hidden="true" />
        </div>
      </article>

      <article className="hsc-editorial-moment hsc-editorial-moment--stamina">
        <div className="hsc-year-timeline" aria-label="Timeline from Year 11 through Trials to the HSC">
          <motion.div className="hsc-year-line" initial={{ scaleX: reduceMotion ? 1 : 0 }} whileInView={{ scaleX: 1 }} viewport={{ amount: .6 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
          {['YEAR 11', 'TRIALS', 'HSC'].map((label, i) => <motion.div className={`hsc-year-point hsc-year-point--${i + 1}`} key={label} initial={{ opacity: .25 }} whileInView={{ opacity: 1 }} viewport={{ amount: .7 }} transition={{ delay: .45 + i * .28 }}><span>{label}</span><b /></motion.div>)}
          <motion.span className="hsc-year-flag" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: .7 }} transition={{ delay: 1.25 }}>⚑</motion.span>
        </div>
        <motion.div className="hsc-editorial-side" initial={{ opacity: .35 }} whileInView={{ opacity: 1 }} viewport={{ amount: .45 }} transition={{ delay: .65, duration: .55 }}>
          <IdeaHeading number="04">THEY NEED TO<br />LAST THE YEAR.</IdeaHeading>
          <WhyToggle id="stamina" open={open === 'stamina'} onToggle={() => toggle('stamina')} />
        </motion.div>
      </article>

      <footer className="hsc-editorial-final">
        <h2>So we don’t teach every<br />HSC student <em>the same way.</em></h2>
        <span />
        <p>Find the support that fits them</p>
        <div aria-hidden="true">↓</div>
      </footer>
    </section>
  );
}


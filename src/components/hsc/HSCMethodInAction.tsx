import { motion, useReducedMotion } from 'framer-motion';
import './HSCMethodInAction.css';

const methodSteps = [
  { number: '1', title: 'Understand', line: 'the question', label: 'Understand the question' },
  { number: '2', title: 'Plan', line: 'your approach', label: 'Plan your approach' },
  { number: '3', title: 'Execute', line: 'with technique', label: 'Execute with technique' },
  { number: '4', title: 'Check & refine', line: 'your answer', label: 'Check & refine your answer' },
];

const breakdown = [
  'Identify key terms (power, language, understanding)',
  'Break the question into parts',
  'Plan paragraph ideas',
  'Use evidence purposefully',
  'Analyse how language creates meaning',
  'Link back to the question',
];

const expertise = [
  'Specialist HSC-trained tutors',
  'Deep content knowledge',
  'Exam marker insight',
  'Years of proven HSC results',
];

export default function HSCMethodInAction() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="hsc-method" aria-labelledby="hsc-method-title">
      <motion.div
        className="hsc-method__inner"
        initial={{ opacity: reduceMotion ? 1 : .72, y: reduceMotion ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: .12, once: true }}
        transition={{ duration: reduceMotion ? 0 : .75, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="hsc-method__heading">
          <h2 id="hsc-method-title">The DA method in action</h2>
          <p>We don’t just teach content. We teach the method.</p>
        </header>

        <ol className="hsc-method__steps">
          {methodSteps.map(({ number, title, line, label }, index) => (
            <li key={number} aria-label={label}>
              <span>{number}</span>
              <p><strong>{title}</strong><br />{line}</p>
              {index < methodSteps.length - 1 && <i aria-hidden="true">→</i>}
            </li>
          ))}
        </ol>

        <div className="hsc-method__example">
          <article className="hsc-method__question">
            <h3>REAL HSC QUESTION <span>(EXAMPLE – ENGLISH)</span></h3>
            <div><b>Q.</b><p>How does the composer <em>use</em> language to shape the reader’s understanding of power in George Orwell’s <i>1984</i>?</p></div>
          </article>

          <article className="hsc-method__breakdown">
            <h3>DA METHOD BREAKDOWN</h3>
            <ul>{breakdown.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
          </article>

          <article className="hsc-method__answer">
            <h3>MODEL ANSWER EXCERPT</h3>
            <blockquote>Orwell uses commanding imperatives and controlled vocabulary to depict power as invasive and inescapable, shaping the reader’s understanding of a society where control replaces freedom.</blockquote>
            <span aria-hidden="true" />
          </article>
        </div>

        <div className="hsc-method__support">
          <article className="hsc-method__expertise">
            <h2>Tutor expertise</h2>
            <ul>{expertise.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
          </article>

          <article className="hsc-method__matching">
            <h2>HSC tutor matching</h2>
            <img src="/media/hsc/method/tutor-matching-group.png" alt="" aria-hidden="true" />
            <p>We match students with tutors based on subject expertise, teaching style and personality—so the learning clicks.</p>
          </article>

          <figure className="hsc-method__photo">
            <img src="/media/hsc/method/da-method-tutor-session.png" alt="HSC tutor and student working through handwritten notes together" />
          </figure>
        </div>
      </motion.div>
    </section>
  );
}

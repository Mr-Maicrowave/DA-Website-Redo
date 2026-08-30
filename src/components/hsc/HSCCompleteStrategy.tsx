import { motion, useReducedMotion } from 'framer-motion';
import './HSCCompleteStrategy.css';

const strategyAsset = '/media/hsc/strategy/strategy-icons-sheet.png';
const processAsset = '/media/hsc/strategy/process-icons-sheet.png';
const progressAsset = '/media/hsc/strategy/progress-landscapes-sheet.png';

const strategies = [
  { title: 'SYLLABUS MASTERY', text: 'Deep understanding of every topic and syllabus requirement.' },
  { title: 'ASSESSMENT PREPARATION', text: 'Tests, quizzes and exams that build confidence.' },
  { title: 'EXAM TECHNIQUE', text: 'How to answer, structure and write for top marks.' },
  { title: 'TIME MANAGEMENT', text: 'Work smarter under pressure. Finish strong in the exam.' },
  { title: 'TRIAL PREPARATION', text: 'Targeted revision and exam simulations to be trial-ready.' },
  { title: 'PAST-PAPER PRACTICE', text: 'Curated past papers. Practice with purpose and feedback.' },
];

const process = [
  { title: 'MARKING CRITERIA', text: 'Learn what markers look for.' },
  { title: 'TESTING', text: 'Regular testing to track understanding.' },
  { title: 'CORRECTIONS', text: 'Every mistake is an opportunity.' },
  { title: 'FEEDBACK LOOPS', text: 'Ongoing feedback that drives improvement.' },
  { title: 'SUBJECT-SPECIFIC RESOURCES', text: 'Notes, summaries and worksheets.' },
];

const startingPoints = [
  { title: 'STRUGGLING', text: <>Rebuild foundations.<br />Build confidence.</> },
  { title: 'MAINTAINING', text: <>Keep consistent.<br />Stay on track.</> },
  { title: 'IMPROVING', text: <>Close gaps. Lift results.<br />Keep moving forward.</> },
  { title: 'BAND 6 TARGET', text: <>Precision and strategy<br />to achieve Band 6.</> },
];

function Sprite({ src, index, count, className }: { src: string; index: number; count: number; className: string }) {
  return (
    <span className={`hsc-strategy-sprite ${className}`} aria-hidden="true">
      <img src={src} alt="" style={{ width: `${count * 100}%`, left: `-${index * 100}%` }} />
    </span>
  );
}

export default function HSCCompleteStrategy() {
  const reduceMotion = useReducedMotion();
  const reveal = {
    initial: { opacity: reduceMotion ? 1 : .72, y: reduceMotion ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { amount: .18, once: true },
    transition: { duration: reduceMotion ? 0 : .72, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <section className="hsc-complete-strategy" aria-labelledby="hsc-complete-strategy-title">
      <motion.div className="hsc-complete-strategy__inner" {...reveal}>
        <header className="hsc-complete-strategy__header">
          <h2 id="hsc-complete-strategy-title">Our complete HSC strategy</h2>
          <span aria-hidden="true" />
        </header>

        <div className="hsc-complete-strategy__pillars">
          {strategies.map((item, index) => (
            <article key={item.title}>
              <Sprite src={strategyAsset} index={index} count={strategies.length} className="hsc-strategy-sprite--pillar" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className="hsc-complete-strategy__process">
          {process.map((item, index) => (
            <article key={item.title}>
              <Sprite src={processAsset} index={index} count={process.length} className="hsc-strategy-sprite--process" />
              <div><h3>{item.title}</h3><p>{item.text}</p></div>
            </article>
          ))}
        </div>

        <header className="hsc-complete-strategy__starting-header">
          <h2>Different starting points. Same goal.</h2>
          <p>We meet every student where they are.</p>
        </header>

        <div className="hsc-complete-strategy__starting-points">
          {startingPoints.map((item, index) => (
            <article key={item.title} className={index === 3 ? 'is-target' : undefined}>
              <Sprite src={progressAsset} index={index} count={startingPoints.length} className="hsc-strategy-sprite--progress" />
              {index === 3 && <span className="hsc-complete-strategy__flag" aria-hidden="true">★</span>}
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

import { motion, useReducedMotion } from 'framer-motion';
import './HSCCompleteStrategy.css';

const strategies = [
  { image: 'syllabus-mastery.png', title: 'SYLLABUS MASTERY', text: 'Deep understanding of every topic and syllabus requirement.' },
  { image: 'assessment-preparation.png', title: 'ASSESSMENT PREPARATION', text: 'Tests, quizzes and exams that build confidence.' },
  { image: 'exam-technique.png', title: 'EXAM TECHNIQUE', text: 'How to answer, structure and write for top marks.' },
  { image: 'time-management.png', title: 'TIME MANAGEMENT', text: 'Work smarter under pressure. Finish strong in the exam.' },
  { image: 'trial-preparation.png', title: 'TRIAL PREPARATION', text: 'Targeted revision and exam simulations to be trial-ready.' },
  { image: 'past-paper-practice.png', title: 'PAST-PAPER PRACTICE', text: 'Curated past papers. Practice with purpose and feedback.' },
];

const process = [
  { image: 'marking-criteria.png', title: 'MARKING CRITERIA', text: 'Learn what markers look for.' },
  { image: 'testing.png', title: 'TESTING', text: 'Regular testing to track understanding.' },
  { image: 'corrections.png', title: 'CORRECTIONS', text: 'Every mistake is an opportunity.' },
  { image: 'feedback-loops.png', title: 'FEEDBACK LOOPS', text: 'Ongoing feedback that drives improvement.' },
  { image: 'subject-resources.png', title: 'SUBJECT-SPECIFIC RESOURCES', text: 'Notes, summaries and worksheets.' },
];

const startingPoints = [
  { image: 'struggling.png', title: 'STRUGGLING', text: <>Rebuild foundations.<br />Build confidence.</> },
  { image: 'maintaining.png', title: 'MAINTAINING', text: <>Keep consistent.<br />Stay on track.</> },
  { image: 'improving.png', title: 'IMPROVING', text: <>Close gaps. Lift results.<br />Keep moving forward.</> },
  { image: 'band-6-target.png', title: 'BAND 6 TARGET', text: <>Precision and strategy<br />to achieve Band 6.</> },
];

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
          {strategies.map((item) => (
            <article key={item.title}>
              <img className="hsc-strategy-art hsc-strategy-art--pillar" src={`/media/hsc/strategy/${item.image}`} alt="" aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className="hsc-complete-strategy__process">
          {process.map((item) => (
            <article key={item.title}>
              <img className="hsc-strategy-art hsc-strategy-art--process" src={`/media/hsc/strategy/${item.image}`} alt="" aria-hidden="true" />
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
              <img className="hsc-strategy-art hsc-strategy-art--progress" src={`/media/hsc/strategy/${item.image}`} alt="" aria-hidden="true" />
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

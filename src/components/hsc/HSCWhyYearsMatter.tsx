import { motion, useReducedMotion } from 'framer-motion';
import HSCLearningFormatsExplorer from './HSCLearningFormatsExplorer';
import HSCCompleteStrategy from './HSCCompleteStrategy';
import HSCMethodInAction from './HSCMethodInAction';
import './HSCWhyYearsMatter.css';

function EditorialExplanation({ lead, children }: { lead: string; children: React.ReactNode }) {
  return (
    <div className="hsc-editorial-explanation">
      <span aria-hidden="true" />
      <em>{lead}</em>
      <p>{children}</p>
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
  const travel = reduceMotion ? 0 : 42;

  return (
    <section className="hsc-editorial" aria-labelledby="hsc-why-years-title">
      <div className="hsc-editorial-wash" aria-hidden="true" />

      <header className="hsc-editorial-intro">
        <p>WHY THESE YEARS MATTER</p>
        <span aria-hidden="true" />
        <h2 id="hsc-why-years-title">The final two years<br />can feel big.</h2>
        <em>But they don’t have to<br />navigate it alone.</em>
        <small>SCROLL TO EXPLORE</small>
        <div className="hsc-editorial-down" aria-hidden="true">⌄</div>
      </header>

      <article className="hsc-editorial-moment hsc-editorial-moment--marks">
        <motion.div className="hsc-editorial-side" initial={{ opacity: .72 }} whileInView={{ opacity: 1 }} viewport={{ amount: .28 }} transition={{ duration: .48 }}>
          <IdeaHeading number="01">EVERY MARK<br />COUNTS.</IdeaHeading>
          <EditorialExplanation lead="Every internal assessment contributes to the bigger picture.">
            We help students understand what matters, where marks are being lost, and what to work on next.
          </EditorialExplanation>
        </motion.div>
        <motion.div className="hsc-assessment-scene" initial={{ opacity: .72, x: travel, y: travel * .55 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ amount: .25 }} transition={{ duration: .82, ease: [0.16, 1, 0.3, 1] }}>
          <img
            className="hsc-generated-assessment"
            src="/media/hsc/editorial/assessment-card-complete.png"
            alt="Year 11 assessment task showing scores of 8 out of 10, 13 out of 15 and 17 out of 20, totalling 38 out of 45"
          />
        </motion.div>
      </article>

      <article className="hsc-editorial-moment hsc-editorial-moment--subjects">
        <div className="hsc-subject-stack" aria-label="Example HSC subject combination">
          <motion.img
            className="hsc-generated-subjects"
            src="/media/hsc/editorial/subject-stack-complete.png"
            alt="Example subject combination of Mathematics, English, Chemistry and Business Studies"
            initial={{ opacity: .72, x: -travel }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: .3 }}
            transition={{ duration: .72, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <motion.div className="hsc-editorial-side" initial={{ opacity: .72 }} whileInView={{ opacity: 1 }} viewport={{ amount: .28 }} transition={{ delay: .12, duration: .48 }}>
          <IdeaHeading number="02">THE RIGHT<br />SUBJECTS MATTER.</IdeaHeading>
          <EditorialExplanation lead="Scaling, workload, strengths and future goals all shape the right subject mix.">
            We help families think through the decision carefully rather than treating every student the same.
          </EditorialExplanation>
        </motion.div>
      </article>

      <article className="hsc-editorial-moment hsc-editorial-moment--technique">
        <motion.div className="hsc-editorial-side" initial={{ opacity: .72 }} whileInView={{ opacity: 1 }} viewport={{ amount: .28 }} transition={{ delay: .12, duration: .48 }}>
          <IdeaHeading number="03">KNOWING IT<br />ISN’T ENOUGH.</IdeaHeading>
          <EditorialExplanation lead="Strong knowledge does not always translate into strong marks.">
            We teach students how to turn what they know into the responses, working and exam technique that actually earn marks.
          </EditorialExplanation>
        </motion.div>
        <div className="hsc-feedback-scene">
          <motion.img
            className="hsc-generated-feedback"
            src="/media/hsc/editorial/feedback-papers-transparent.png"
            alt="English literature answer sheet beside tutor feedback calling for more specificity, evidence and stronger structure, scored 13 out of 20"
            initial={{ opacity: .72, x: travel, y: travel * .35 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ amount: .25 }}
            transition={{ duration: .82, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </article>

      <article className="hsc-editorial-moment hsc-editorial-moment--stamina">
        <div className="hsc-year-timeline" aria-label="Timeline from Year 11 through Trials to the HSC">
          <motion.img
            className="hsc-generated-timeline"
            src="/media/hsc/editorial/year-journey-timeline-no-flowers.png"
            alt="Year 11 to Trials to HSC journey: build strong foundations, refine and improve, then perform with confidence"
            initial={{ opacity: .72, x: -travel }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: .25 }}
            transition={{ duration: .82, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <motion.div className="hsc-editorial-side" initial={{ opacity: .72 }} whileInView={{ opacity: 1 }} viewport={{ amount: .28 }} transition={{ delay: .12, duration: .48 }}>
          <IdeaHeading number="04">THEY NEED TO<br />LAST THE YEAR.</IdeaHeading>
          <EditorialExplanation lead="Year 12 is a marathon.">
            We build the time management, consistency and confidence students need to protect their energy and perform at their best in the final exams.
          </EditorialExplanation>
        </motion.div>
      </article>

      <section className="hsc-support-journey" aria-labelledby="hsc-support-title">
        <motion.header
          className="hsc-support-intro"
          initial={{ opacity: .72, y: reduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: .35 }}
          transition={{ duration: .72, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hsc-support-destination" aria-hidden="true"><span>⚑</span><b>HSC</b></div>
          <h2 id="hsc-support-title">THERE’S NO ONE WAY<br />THROUGH HSC.</h2>
          <span className="hsc-support-rule" aria-hidden="true" />
          <p>Different students need<br />different kinds of support.</p>
        </motion.header>

        <motion.img
          className="hsc-support-pathways"
          src="/media/hsc/editorial/hsc-support-pathways.png"
          alt=""
          aria-hidden="true"
          initial={{ opacity: .72, y: reduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: .2 }}
          transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="hsc-support-options" aria-label="HSC support options">
          {[
            { title: 'PRIVATE TUITION', lead: <>Focused on them.<br />Every step of the way.</>, text: 'Individual support tailored to your child’s needs, goals and learning pace.' },
            { title: 'SMALL GROUP CLASSES', lead: <>Learn together.<br />Grow together.</>, text: 'Focused learning in small groups with expert tutors and like-minded peers.' },
            { title: 'HSC PREPARATION', lead: <>Build depth.<br />Achieve your best.</>, text: 'Master the content, develop exam technique and perform with confidence.' },
            { title: 'TRIAL PREPARATION', lead: <>Sharpen skills.<br />Boost performance.</>, text: 'Targeted practice and feedback to excel in Trials and enter exams with confidence.' },
          ].map(({ title, lead, text }) => (
            <article className="hsc-support-option" key={title}>
              <h3>{title}</h3>
              <p className="hsc-support-lead">{lead}</p>
              <span aria-hidden="true" />
              <p>{text}</p>
            </article>
          ))}
        </div>

        <motion.footer
          className="hsc-support-close"
          initial={{ opacity: .72, y: reduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: .5 }}
          transition={{ duration: .7 }}
        >
          <p>The question isn’t which option is best.</p>
          <em>It’s which one fits them.</em>
          <span aria-hidden="true">⌄</span>
        </motion.footer>
      </section>

      <HSCLearningFormatsExplorer />
      <HSCCompleteStrategy />
      <HSCMethodInAction />
    </section>
  );
}

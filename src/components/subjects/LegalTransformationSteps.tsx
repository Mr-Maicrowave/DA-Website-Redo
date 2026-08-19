import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Cog, Landmark, ShieldCheck, User, Lightbulb, Scale, HelpCircle, BookOpen, MessageCircle, X } from 'lucide-react';
import './LegalTransformationSteps.css';

type Tone = 'purple' | 'blue' | 'green' | 'orange' | 'gold' | 'red' | 'teal';

const toneClasses: Record<
  Tone,
  {
    text: string;
    border: string;
    bg: string;
    iconBg: string;
    iconColor: string;
    dotBorder: string;
    dotBg: string;
  }
> = {
  purple: {
    text: 'text-violet-700',
    border: 'border-violet-200',
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-700',
    dotBorder: 'border-violet-400',
    dotBg: 'bg-violet-400',
  },
  blue: {
    text: 'text-sky-700',
    border: 'border-sky-200',
    bg: 'bg-sky-50',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-700',
    dotBorder: 'border-sky-400',
    dotBg: 'bg-sky-400',
  },
  green: {
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    dotBorder: 'border-emerald-400',
    dotBg: 'bg-emerald-400',
  },
  orange: {
    text: 'text-orange-700',
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-700',
    dotBorder: 'border-orange-400',
    dotBg: 'bg-orange-400',
  },
  gold: {
    text: 'text-amber-700',
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    dotBorder: 'border-amber-400',
    dotBg: 'bg-amber-400',
  },
  red: {
    text: 'text-rose-700',
    border: 'border-rose-200',
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-700',
    dotBorder: 'border-rose-400',
    dotBg: 'bg-rose-400',
  },
  teal: {
    text: 'text-teal-700',
    border: 'border-teal-200',
    bg: 'bg-teal-50',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-700',
    dotBorder: 'border-teal-400',
    dotBg: 'bg-teal-400',
  },
};

const step1Columns: { tone: Tone; label: string; Icon: typeof Cog; body: string }[] = [
  {
    tone: 'purple',
    label: 'How',
    Icon: Cog,
    body: 'Explain the process or mechanism. Show HOW legal measures work to protect rights, not just what they are.',
  },
  {
    tone: 'blue',
    label: 'Legal measures',
    Icon: Landmark,
    body: 'Use legislation and cases. NOT media articles and NOT non-governmental organisations.',
  },
  {
    tone: 'green',
    label: 'Protect',
    Icon: ShieldCheck,
    body: 'Explain how rights are safeguarded, enforced or upheld — for example through criminal sanctions, prosecution, accountability and legal obligations.',
  },
  {
    tone: 'orange',
    label: 'Human rights',
    Icon: User,
    body: 'Focus on the specific human right being protected, such as freedom from slavery, exploitation and trafficking.',
  },
  {
    tone: 'gold',
    label: 'Example',
    Icon: Lightbulb,
    body: 'Use a specific example such as human trafficking and slavery.',
  },
];

const step2Weaknesses: { tone: Tone; Icon: typeof HelpCircle; lead: string; rest: string }[] = [
  { tone: 'gold', Icon: HelpCircle, lead: 'Too general', rest: '– lacks depth and detail' },
  { tone: 'blue', Icon: BookOpen, lead: 'Limited or no use', rest: 'of syllabus terminology' },
  { tone: 'green', Icon: User, lead: 'Example lacks', rest: 'READ: LCMID' },
  { tone: 'purple', Icon: MessageCircle, lead: 'Describes', rest: 'rather than explains' },
  { tone: 'red', Icon: X, lead: 'No judgement', rest: 'on effectiveness' },
];

type Segment = { text: string; tone?: Tone; italic?: boolean };

const step3Segments: Segment[] = [
  { text: 'Legal measures protect human rights by ' },
  { text: 'creating enforceable obligations, deterring violations and providing mechanisms for accountability,', tone: 'blue' },
  { text: ' as demonstrated in Australia’s response to ' },
  { text: 'human trafficking and modern slavery', tone: 'blue' },
  { text: '. For example, ' },
  { text: 'Division 270 and 271 of the Criminal Code Act 1995 (Cth) criminalise slavery, servitude and trafficking in persons.', tone: 'green' },
  { text: ' These provisions make it illegal to recruit, transport or harbour individuals through coercion for exploitation. Legally, these laws ' },
  { text: 'empower police to investigate and prosecute offenders', tone: 'orange' },
  { text: ', with penalties of up to 25 years imprisonment, which ' },
  { text: 'deters exploitation', tone: 'orange' },
  { text: ' and signals the seriousness of the offence. Cases such as ' },
  { text: 'R v Tang (2008) HCA 39', tone: 'purple', italic: true },
  { text: ' demonstrate the application of these laws, where the ' },
  { text: 'High Court upheld convictions for enslaving foreign workers', tone: 'purple' },
  { text: ' on Australian farms, confirming that victims of slavery have legal protection under Australian law. In addition, the ' },
  { text: 'Modern Slavery Act 2018 (Cth)', tone: 'red' },
  { text: ' requires large businesses to report on modern slavery risks in their operations and supply chains, ' },
  { text: 'increasing transparency and encouraging preventative action', tone: 'red' },
  { text: '. Ultimately, while enforcement challenges remain, these legal measures are ' },
  { text: 'effective', tone: 'teal', italic: true },
  { text: ' because they combine criminal sanctions with corporate accountability to reduce exploitation and better protect the human right to freedom from slavery.' },
];

const step3Annotations: { tone: Tone; text: string }[] = [
  { tone: 'blue', text: 'Clear topic sentence – immediately answers the question' },
  { tone: 'green', text: 'Directly links to legal protection mechanisms' },
  { tone: 'orange', text: 'Explains how the law works and its impact' },
  { tone: 'purple', text: 'Uses a case to provide depth and real-world application' },
  { tone: 'red', text: 'Adds another legal measure to strengthen the response' },
  { tone: 'teal', text: 'Makes an overall judgement about effectiveness' },
];

const StepHeader = ({ eyebrow, title, suffix }: { eyebrow: string; title: string; suffix?: string }) => (
  <div className="legal-transform-step-header">
    <h3>
      <span className="legal-transform-step-eyebrow">{eyebrow}</span> {title}
      {suffix && <span className="legal-transform-step-suffix"> {suffix}</span>}
    </h3>
    <div className="legal-transform-step-rule" aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  </div>
);

const LegalTransformationSteps = () => {
  const shouldReduceMotion = useReducedMotion();

  const panelVariants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
      };

  const staggerContainerVariants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.7, delayChildren: 0.15 } },
      };

  const staggerItemVariants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      };

  return (
    <section className="legal-transform-section" aria-labelledby="legal-transform-title">
      <div className="legal-transform-inner">
        <div className="legal-transform-intro">
          <span className="legal-transform-eyebrow">Short-answer mastery</span>
          <h2 id="legal-transform-title">From Band 3 to Band 6, One Sentence at a Time</h2>
          <p>
            See how a real HSC-style Human Rights question is deconstructed, compared against a typical student
            response, and rebuilt into a Band 6 answer &mdash; the exact process we teach in every session.
          </p>
        </div>

        {/* Step 1 */}
        <motion.div
          className="legal-transform-panel"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <StepHeader eyebrow="Step 1:" title="Deconstruct the Question" />

          <div className="legal-transform-card">
            <div className="legal-transform-question-box">
              <h4>
                Question 23 <span>(7 marks &middot; 2025 HSC)</span>
              </h4>
              <p>How do legal measures protect human rights? Support your answer with an example.</p>
            </div>

            <div className="legal-transform-column-grid">
              {step1Columns.map(({ tone, label, Icon, body }) => {
                const palette = toneClasses[tone];
                return (
                  <div key={label} className="legal-transform-column">
                    <div className="legal-transform-column-heading">
                      <span className={palette.text}>{label}</span>
                      <span className={`legal-transform-column-underline ${palette.text}`} aria-hidden="true">
                        <i />
                      </span>
                    </div>
                    <div className={`legal-transform-column-card ${palette.bg} ${palette.border}`}>
                      <span className={`legal-transform-column-icon ${palette.iconBg} ${palette.iconColor}`}>
                        <Icon aria-hidden="true" />
                      </span>
                      <strong className={palette.text}>{label}</strong>
                      <span className={`legal-transform-column-rule ${palette.border}`} aria-hidden="true" />
                      <p>{body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          className="legal-transform-panel"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <StepHeader eyebrow="Step 2:" title="What students often do" suffix="(Band 3 response)" />

          <div className="legal-transform-card">
            <div className="legal-transform-step2-grid">
              <div className="legal-transform-band3-copy">
                <div className="legal-transform-band3-heading">
                  <span aria-hidden="true" />
                  <Scale aria-hidden="true" />
                  <span aria-hidden="true" />
                </div>
                <strong>Before &ndash; Typical Band 3</strong>
                <span className="legal-transform-mini-rule" aria-hidden="true">
                  <i />
                </span>
                <p>
                  Legal measures protect human rights by making laws. For example, there are laws against slavery
                  and human trafficking. These laws make it illegal for people to exploit others. Police can catch
                  offenders and punish them. This helps protect people&rsquo;s rights.
                </p>
              </div>

              <div className="legal-transform-weakness-list">
                {step2Weaknesses.map(({ tone, Icon, lead, rest }) => {
                  const palette = toneClasses[tone];
                  return (
                    <div key={lead} className="legal-transform-weakness-row">
                      <span className={`legal-transform-weakness-icon ${palette.iconBg} ${palette.iconColor}`}>
                        <Icon aria-hidden="true" />
                      </span>
                      <p>
                        <strong className={palette.text}>{lead}</strong> {rest}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          className="legal-transform-panel"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <StepHeader eyebrow="Step 3:" title="The DA Transformation" suffix="(Band 6 response)" />

          <div className="legal-transform-card">
            <div className="legal-transform-step3-grid">
              <p className="legal-transform-paragraph">
                {step3Segments.map((segment, index) => {
                  if (!segment.tone) {
                    return <React.Fragment key={index}>{segment.text}</React.Fragment>;
                  }
                  const palette = toneClasses[segment.tone];
                  return (
                    <span
                      key={index}
                      className={`${palette.text} ${segment.italic ? 'legal-transform-italic' : ''}`}
                    >
                      {segment.text}
                    </span>
                  );
                })}
              </p>

              <motion.div
                className="legal-transform-annotations"
                variants={staggerContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {step3Annotations.map(({ tone, text }, index) => {
                  const palette = toneClasses[tone];
                  return (
                    <motion.div key={index} className="legal-transform-annotation-row" variants={staggerItemVariants}>
                      <span className={`legal-transform-annotation-dots ${palette.dotBorder}`} aria-hidden="true" />
                      <span className={`legal-transform-annotation-bar ${palette.dotBg}`} aria-hidden="true" />
                      <span className={palette.text}>{text}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LegalTransformationSteps;

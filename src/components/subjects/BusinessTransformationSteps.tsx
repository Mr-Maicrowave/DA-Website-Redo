import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  MessageSquare,
  Handshake,
  Settings,
  Target,
  Briefcase,
  HelpCircle,
  BookOpen,
  User,
  MessageCircle,
  X,
} from 'lucide-react';
import './BusinessTransformationSteps.css';

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

const deconstructPhrases: { text: string; tone?: Tone }[] = [
  { text: 'Discuss', tone: 'purple' },
  { text: 'the' },
  { text: 'implications', tone: 'blue' },
  { text: 'of' },
  { text: 'outsourcing', tone: 'green' },
  { text: 'the new desserts' },
  { text: 'for the' },
  { text: 'operation of this business.', tone: 'gold' },
];

const step1Columns: { tone: Tone; label: string; Icon: typeof MessageSquare; body: React.ReactNode }[] = [
  {
    tone: 'purple',
    label: 'Discuss',
    Icon: MessageSquare,
    body: 'Present both sides of the argument (positive and negative) and make a supported judgement or conclusion.',
  },
  {
    tone: 'blue',
    label: 'Implications',
    Icon: Target,
    body: 'The possible effects, consequences or results of a decision. Consider short-term and long-term impacts.',
  },
  {
    tone: 'green',
    label: 'Outsourcing',
    Icon: Handshake,
    body: (
      <>
        Getting a product or service from an external supplier instead of making it in-house.
        <span className="biz-transform-column-subhead">In this question:</span>
        <ul>
          <li>The cafe will get cakes from the local bakery (the supplier).</li>
          <li>The cakes are not made by the cafe itself.</li>
          <li>The cafe will then sell these cakes to its customers.</li>
        </ul>
      </>
    ),
  },
  {
    tone: 'gold',
    label: 'Operation of this business',
    Icon: Settings,
    body: 'How the business runs day-to-day. Consider impacts on efficiency, cost, quality, flexibility, resources, staff, customers and overall performance.',
  },
];

const step2Weaknesses: { tone: Tone; Icon: typeof HelpCircle; lead: string; rest: string }[] = [
  { tone: 'gold', Icon: HelpCircle, lead: 'Too general', rest: '– lacks depth and detail' },
  { tone: 'blue', Icon: BookOpen, lead: 'Limited business terminology', rest: '' },
  { tone: 'green', Icon: User, lead: 'Little reference', rest: 'to the scenario' },
  { tone: 'purple', Icon: MessageCircle, lead: 'Describes more', rest: 'than discusses' },
  { tone: 'red', Icon: X, lead: 'No clear judgement', rest: '' },
];

type Segment = { text: string; tone?: Tone };

const step3Segments: Segment[] = [
  { text: "Outsourcing the new desserts to a local bakery " },
  { text: "could improve the cafe's operations by increasing product variety without requiring additional in-house production resources", tone: 'blue' },
  { text: '. This ' },
  { text: 'may enhance flexibility', tone: 'green' },
  { text: ', as the cafe can expand its dessert range quickly while continuing to ' },
  { text: 'focus on its core strength', tone: 'green' },
  { text: ' of providing ' },
  { text: 'quality food and personalised service', tone: 'green' },
  { text: '. In addition, using a specialist bakery ' },
  { text: 'may improve quality', tone: 'orange' },
  { text: ' if the outsourced cakes are made by experienced suppliers, which ' },
  { text: 'could strengthen customer satisfaction and support repeat business', tone: 'orange' },
  { text: '. Outsourcing may also ' },
  { text: 'reduce the need for extra labour, equipment and preparation time', tone: 'orange' },
  { text: ', helping the cafe ' },
  { text: 'manage costs and efficiency more effectively', tone: 'orange' },
  { text: '. ' },
  { text: 'However, the cafe may face reduced control over quality and dependability, as any delays, inconsistent supply or lower-quality desserts', tone: 'purple' },
  { text: ' from the bakery ' },
  { text: 'could damage its reputation for quality service', tone: 'purple' },
  { text: '. ' },
  { text: "This is particularly important because the cafe's brand is built on quality food and friendly, personalised service, so poor outsourced products", tone: 'blue' },
  { text: ' ' },
  { text: 'may undermine customer expectations', tone: 'blue' },
  { text: '. While outsourcing could also ' },
  { text: "support the business's local community image", tone: 'teal' },
  { text: ' by partnering with a local bakery, the owners would need to ' },
  { text: 'monitor supplier performance carefully', tone: 'teal' },
  { text: '. Overall, outsourcing the desserts is likely to benefit the cafe’s operations if the bakery is reliable and maintains quality standards, as ' },
  { text: 'the gains in flexibility and efficiency are significant, but these benefits depend on strong supplier management', tone: 'green' },
  { text: '.' },
];

const step3Annotations: { tone: Tone; text: string }[] = [
  { tone: 'blue', text: 'Clear topic sentence – immediately answers the question' },
  { tone: 'green', text: 'Links to performance objective: flexibility' },
  { tone: 'orange', text: 'Uses business terminology and explains impact' },
  { tone: 'purple', text: 'Balances with a limitation' },
  { tone: 'blue', text: 'Strong scenario link' },
  { tone: 'teal', text: 'Sophisticated nuance / community image' },
  { tone: 'green', text: 'Clear overall judgement' },
];

const Chip = ({ text, tone }: { text: string; tone?: Tone }) => {
  if (!tone) {
    return <span className="biz-transform-plain-word">{text}</span>;
  }

  const palette = toneClasses[tone];

  return (
    <span className={`biz-transform-chip ${palette.bg} ${palette.border} ${palette.text}`}>{text}</span>
  );
};

const StepHeader = ({ eyebrow, title, suffix }: { eyebrow: string; title: string; suffix?: string }) => (
  <div className="biz-transform-step-header">
    <h3>
      <span className="biz-transform-step-eyebrow">{eyebrow}</span> {title}
      {suffix && <span className="biz-transform-step-suffix"> {suffix}</span>}
    </h3>
    <div className="biz-transform-step-rule" aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  </div>
);

const BusinessTransformationSteps = () => {
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
    <section className="biz-transform-section" aria-labelledby="biz-transform-title">
      <div className="biz-transform-inner">
        <div className="biz-transform-intro">
          <span className="biz-transform-eyebrow">Short-answer mastery</span>
          <h2 id="biz-transform-title">From Band 3 to Band 6, One Sentence at a Time</h2>
        </div>

        {/* Step 1 */}
        <motion.div
          className="biz-transform-panel"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <StepHeader eyebrow="Step 1:" title="Deconstruct the Question" />

          <div className="biz-transform-card">
            <div className="biz-transform-question-grid">
              <div className="biz-transform-question-left">
                <h4>Question 21</h4>
                <p>
                  A cafe produces quality food and friendly, personalised service. It donates its left-over food to
                  a local charity at the end of each day.
                </p>
              </div>
              <div className="biz-transform-question-right">
                <span className="biz-transform-marks-badge">
                  <strong>4</strong>
                  <small>marks</small>
                </span>
                <p>
                  <strong>(d)</strong> The owners of the cafe would like to expand their dessert range. They plan to
                  outsource cakes from the local bakery to sell at their cafe.
                </p>
                <p>
                  <strong>Discuss the implications</strong> of outsourcing the new desserts for the operation of
                  this business.
                </p>
              </div>
            </div>

            <div className="biz-transform-phrase-row">
              {deconstructPhrases.map((phrase, index) => (
                <Chip key={`${phrase.text}-${index}`} text={phrase.text} tone={phrase.tone} />
              ))}
            </div>

            <div className="biz-transform-column-grid">
              {step1Columns.map(({ tone, label, Icon, body }) => {
                const palette = toneClasses[tone];
                return (
                  <div key={label} className={`biz-transform-column-card ${palette.bg} ${palette.border}`}>
                    <span className={`biz-transform-column-icon ${palette.iconBg} ${palette.iconColor}`}>
                      <Icon aria-hidden="true" />
                    </span>
                    <strong className={palette.text}>{label}</strong>
                    <div className="biz-transform-column-body">{body}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          className="biz-transform-panel"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <StepHeader eyebrow="Step 2:" title="What students often do" suffix="(Band 3 response)" />

          <div className="biz-transform-card">
            <div className="biz-transform-step2-grid">
              <div className="biz-transform-band3-copy">
                <div className="biz-transform-band3-heading">
                  <span aria-hidden="true" />
                  <Briefcase aria-hidden="true" />
                  <span aria-hidden="true" />
                </div>
                <strong>Before &ndash; Typical Band 3</strong>
                <span className="biz-transform-mini-rule" aria-hidden="true">
                  <i />
                </span>
                <p>
                  Outsourcing the desserts could help the cafe because they would have more products to sell. This
                  may save time because the cakes are made by the bakery instead of the cafe. It could also make
                  customers happy because there is more choice. However, outsourcing could be bad because the cafe
                  might not control the quality. This could affect the business if customers do not like the
                  desserts.
                </p>
              </div>

              <div className="biz-transform-weakness-list">
                {step2Weaknesses.map(({ tone, Icon, lead, rest }) => {
                  const palette = toneClasses[tone];
                  return (
                    <div key={lead} className="biz-transform-weakness-row">
                      <span className={`biz-transform-weakness-icon ${palette.iconBg} ${palette.iconColor}`}>
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
          className="biz-transform-panel"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <StepHeader eyebrow="Step 3:" title="The DA Transformation" suffix="(Band 6 response)" />

          <div className="biz-transform-card">
            <div className="biz-transform-step3-grid">
              <p className="biz-transform-paragraph">
                {step3Segments.map((segment, index) => {
                  if (!segment.tone) {
                    return <React.Fragment key={index}>{segment.text}</React.Fragment>;
                  }
                  const palette = toneClasses[segment.tone];
                  return (
                    <span key={index} className={palette.text}>
                      {segment.text}
                    </span>
                  );
                })}
              </p>

              <motion.div
                className="biz-transform-annotations"
                variants={staggerContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {step3Annotations.map(({ tone, text }, index) => {
                  const palette = toneClasses[tone];
                  return (
                    <motion.div key={index} className="biz-transform-annotation-row" variants={staggerItemVariants}>
                      <span className={`biz-transform-annotation-dots ${palette.dotBorder}`} aria-hidden="true" />
                      <span className={`biz-transform-annotation-bar ${palette.dotBg}`} aria-hidden="true" />
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

export default BusinessTransformationSteps;

import React, { useCallback, useEffect, useRef, useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SubjectHero from '@/components/subjects/SubjectHero';
import SubjectTypedBanner from '@/components/subjects/SubjectTypedBanner';
import TrustedSchoolsStrip from '@/components/subjects/TrustedSchoolsStrip';
import BusinessSyllabusQuiz from '@/components/subjects/BusinessSyllabusQuiz';
import BusinessTransformationSteps from '@/components/subjects/BusinessTransformationSteps';
import BusinessCareerPathways from '@/components/subjects/BusinessCareerPathways';
import { BusinessStudiesIntroVideoGate } from '@/features/business-intro-video/BusinessStudiesIntroVideoGate';
import {
  Briefcase,
  LineChart,
  Target,
  FileEdit,
  Globe,
  Users,
  BookOpen,
  ClipboardCheck,
  MessageCircleQuestion,
  PenLine,
  Scale,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import SEO from '@/components/SEO';
import './BusinessStudies.css';

const businessTrustedSchools = [
  { name: 'Freeman Catholic College', logoSrc: '/images/schools/freeman-catholic-college.png' },
  { name: 'Mary MacKillop Catholic College', logoSrc: '/images/schools/mary-mackillop-catholic-college.png' },
  { name: 'Canley Vale High School', logoSrc: '/images/schools/canley-vale-high-school.png' },
  { name: 'Fairvale High School', logoSrc: '/images/schools/fairvale-high-school.png' },
  { name: 'Patrician Brothers Catholic College Fairfield', logoSrc: '/images/schools/patrician-brothers-fairfield.png' },
  { name: "St John's Park High School", logoSrc: '/images/schools/st-johns-park-high-school.png' },
  { name: 'Al-Faisal College', logoSrc: '/images/schools/al-faisal-college.png' },
  { name: 'Sefton High School', logoSrc: '/images/schools/sefton-high-school.png' },
  { name: 'Prairiewood High School', logoSrc: '/images/schools/prairiewood-high-school.png' },
  { name: 'Trinity Catholic College', logoSrc: '/images/schools/trinity-catholic-college.png' },
  { name: 'Macquarie Fields High School', logoSrc: '/images/schools/macquarie-fields-high-school.png' },
  { name: 'Amity College', logoSrc: '/images/schools/amity-college.png' },
  { name: 'Good Samaritan Catholic College', logoSrc: '/images/schools/good-samaritan-catholic-college.png' },
];

const businessExamStructureCards = [
  {
    title: '20 Marks -\nMultiple Choice',
    topic: 'Business Studies',
    Icon: ClipboardCheck,
    tone: 'purple',
    tips: [
      'Know the syllabus terminology precisely and train yourself to instantly identify which dot point of the syllabus it comes from.',
      'Practise HSC style multiple-choice questions under timed conditions.',
      "Don't just check the correct answer; explain why the other three options are wrong.",
      'Revise commonly confused concepts such as quality control vs quality assurance or market segmentation vs product differentiation.',
    ],
  },
  {
    title: '40 Marks -\nShort Answer',
    topic: 'Business Studies',
    Icon: MessageCircleQuestion,
    tone: 'green',
    tips: [
      'Use the traffic light system to revise syllabus dot points.',
      'Practise responding to different NESA glossary verbs: identify, describe, explain, analyse, assess, evaluate.',
      'Use business examples or case studies.',
      'Avoid simply defining a concept; explain how or why it affects business performance.',
      'Practise writing concise responses under time pressure.',
    ],
  },
  {
    title: '20 Marks -\nBusiness Report',
    topic: 'Business Studies',
    Icon: PenLine,
    tone: 'orange',
    tips: [
      'Familiarise yourself with the report structure: executive summary, headings, analysis and recommendations.',
      'Practise identifying the business problem in the stimulus before choosing strategies.',
      "Make recommendations that directly respond to the business's specific circumstances and objectives.",
      'Integrate syllabus terminology.',
      'Explain why each recommendation would work and link it to relevant performance objectives or business outcomes.',
    ],
  },
  {
    title: '20 Marks -\nBusiness Essay',
    topic: 'Business Studies',
    Icon: Scale,
    tone: 'blue',
    tips: [
      'For each major syllabus area, know several contemporary case studies you can adapt to different questions.',
      'Identify the directive verb, key syllabus concept and required judgement.',
      'Follow this evaluation structure: syllabus concept → business example → analysis → judgement.',
      'Link back to the key words from the question.',
    ],
  },
];

type BusinessMythOutcome = {
  number: string;
  label: string;
  text: string;
  Icon: LucideIcon;
};

type BusinessMythItem = {
  id: number;
  myth: string;
  headline: string;
  goldLine: string;
  body: Array<string | { strong: string }>;
  outcomes: BusinessMythOutcome[];
};

const businessMyths: BusinessMythItem[] = [
  {
    id: 1,
    myth: 'Business Studies is just common sense.',
    headline: 'Familiar ideas aren’t enough.',
    goldLine: 'Business thinking needs structure.',
    body: [
      'Business Studies can feel familiar because many of its concepts relate to real businesses, but high-level responses require much more than common sense. Students need to use ',
      { strong: 'precise syllabus terminology, apply concepts to unfamiliar scenarios, integrate relevant case studies and make clear business judgements' },
      '.',
      '\n\nAt DA, we teach students how to turn what they intuitively understand into the kind of ',
      { strong: 'structured, syllabus-driven response the HSC rewards' },
      '. The goal is not simply to know what a business might do, but to explain ',
      { strong: 'why a strategy works, how it affects business performance and when it is appropriate' },
      '.',
    ],
    outcomes: [
      { number: '01', label: 'Terminology', text: 'Use the language the syllabus rewards.', Icon: ClipboardCheck },
      { number: '02', label: 'Application', text: 'Apply concepts to real business situations.', Icon: Briefcase },
      { number: '03', label: 'Judgement', text: 'Explain why strategies work and when they are appropriate.', Icon: Scale },
    ],
  },
  {
    id: 2,
    myth: 'It’s an easy subject, so I don’t need tutoring.',
    headline: 'Accessible doesn’t mean easy to master.',
    goldLine: 'Top marks come from refinement.',
    body: [
      'Business Studies can be accessible to learn, but that does not automatically make it easy to score highly. The difference between an average response and a top-band response often comes down to ',
      { strong: 'application, depth, judgement, case-study integration and exam technique' },
      '.',
      '\n\nAt DA, we help students ',
      { strong: 'identify exactly where marks are being lost' },
      ' and refine those higher-level skills. Whether a student is struggling or already performing well, tutoring gives them the opportunity to ',
      { strong: 'practise more deliberately, receive targeted feedback' },
      ' and develop a much clearer understanding of ',
      { strong: 'what separates a good response from an excellent one' },
      '.',
    ],
    outcomes: [
      { number: '01', label: 'Identify', text: 'Find exactly where marks are being lost.', Icon: Target },
      { number: '02', label: 'Refine', text: 'Strengthen higher-level response skills.', Icon: FileEdit },
      { number: '03', label: 'Elevate', text: 'Turn good responses into top-band responses.', Icon: LineChart },
    ],
  },
  {
    id: 3,
    myth: 'I just need to memorise the textbook.',
    headline: 'Knowing the content is only step one.',
    goldLine: 'Using it earns the marks.',
    body: [
      'Knowing the content is important, but memorising definitions alone will not prepare students for questions that require them to ',
      { strong: 'analyse, assess, recommend or evaluate' },
      '. Students must be able to ',
      { strong: 'select the right syllabus content, connect it to a business scenario and explain its impact' },
      '.',
      '\n\nAt DA, we help students move beyond passive memorisation by teaching them ',
      { strong: 'how the syllabus connects, which examples are most useful, how to apply case studies strategically and how to construct strong business judgements' },
      '. Students learn the content with a purpose — so they can actually use it when the question changes.',
    ],
    outcomes: [
      { number: '01', label: 'Select', text: 'Choose the content the question actually needs.', Icon: BookOpen },
      { number: '02', label: 'Apply', text: 'Use case studies strategically.', Icon: Briefcase },
      { number: '03', label: 'Evaluate', text: 'Construct strong business judgements.', Icon: Scale },
    ],
  },
  {
    id: 4,
    myth: 'Business is one of those subjects you can cram for right before the exam.',
    headline: 'Cramming builds recognition.',
    goldLine: 'Practice builds performance.',
    body: [
      'Business Studies can feel overwhelming because students are expected to manage ',
      { strong: 'a lot of interconnected content across Operations, Marketing, Finance and Human Resources' },
      '. It can be hard to know what deserves the most attention, what needs to be remembered and how everything fits together. While cramming may help with recognising definitions, strong HSC responses require students to ',
      { strong: 'choose the right content, apply it confidently to the question and make clear business judgements under exam conditions' },
      '.',
      '\n\nAt DA, we work through this with students step by step. We ',
      { strong: 'break the course into manageable sections, revisit important ideas and give students regular opportunities to practise across multiple-choice questions, short answers, business reports and essays' },
      '. Over time, students begin to feel more certain about ',
      { strong: 'what to focus on, how to approach different question types and how to use what they know effectively' },
      '. By the time exams arrive, the goal is for students to feel prepared rather than overwhelmed — with ',
      { strong: 'greater confidence, stronger exam habits and a much clearer sense of how to tackle the paper' },
      '.',
    ],
    outcomes: [
      { number: '01', label: 'Build', text: 'Develop knowledge progressively.', Icon: BookOpen },
      { number: '02', label: 'Practise', text: 'Apply it across every exam section.', Icon: FileEdit },
      { number: '03', label: 'Perform', text: 'Enter the exam with a tested system.', Icon: Target },
    ],
  },
  {
    id: 5,
    myth: 'Tutoring is only useful if you’re failing.',
    headline: 'Tutoring isn’t only about catching up.',
    goldLine: 'It’s also about moving ahead.',
    body: [
      'Tutoring is not only about catching up. For many students, the greatest value comes from identifying the ',
      { strong: 'small weaknesses that are preventing a good response from becoming a top-band response' },
      '.',
      '\n\nAt DA, we can focus closely on each student’s ',
      { strong: 'writing, application, case-study use, business terminology, judgement and exam technique' },
      '. That personalised refinement is particularly valuable for students who already understand the content but want to become ',
      { strong: 'more precise, adaptable and confident under HSC conditions' },
      '.',
    ],
    outcomes: [
      { number: '01', label: 'Diagnose', text: 'Identify the small gaps holding marks back.', Icon: Target },
      { number: '02', label: 'Personalise', text: 'Target the individual student’s needs.', Icon: Users },
      { number: '03', label: 'Refine', text: 'Become more precise, adaptable and confident.', Icon: FileEdit },
    ],
  },
];

type BusinessPracticeTopic = 'Operations' | 'Marketing' | 'Finance' | 'Human Resources';
type BusinessPracticeMode = 'caseStudies' | 'contemporaryExamples';

type BusinessPracticeItem = {
  id: number;
  topic: BusinessPracticeTopic;
  title: string;
  subtitle: string;
  intro: string;
  sections: {
    title: string;
    content: string;
    bullet?: boolean;
    highlight?: string;
  }[];
  useThisIn: string;
};

const businessPracticeCaseStudies: BusinessPracticeItem[] = [
  {
    id: 1,
    topic: 'Operations',
    title: "McDonald's",
    subtitle: 'Global sourcing and cost leadership',
    intro: 'See how real businesses apply syllabus strategies to improve performance in operations.',
    sections: [
      {
        title: 'Syllabus dot point',
        content: 'Global factors -> global sourcing; performance objectives -> cost minimisation',
        bullet: true,
      },
      {
        title: 'Business context',
        content: "McDonald's operates on a global scale and relies on a large international supplier network to source inputs efficiently across markets.",
      },
      {
        title: 'Strategy / application',
        content: "Global sourcing allows McDonald's to purchase at scale, standardise supply processes and reduce input costs across its operations.",
      },
      {
        title: 'Result',
        content: 'This helps the business maintain competitive pricing, strong supply efficiency and consistent operational performance.',
      },
      {
        title: 'Evaluation',
        highlight: 'Highly effective - cost minimisation',
        content: 'The strategy is highly effective in achieving cost minimisation because scale lowers costs, although global sourcing can expose the business to supply disruptions.',
      },
    ],
    useThisIn: 'Global factors - Cost minimisation - Operation strategies',
  },
  {
    id: 2,
    topic: 'Marketing',
    title: 'Coca-Cola',
    subtitle: 'Branding and promotion',
    intro: 'See how real businesses apply syllabus strategies to improve performance in marketing.',
    sections: [
      {
        title: 'Syllabus dot point',
        content: 'Promotion -> advertising and branding; marketing objectives -> market share',
        bullet: true,
      },
      {
        title: 'Business context',
        content: 'Coca-Cola operates in a highly competitive global beverage market and relies on strong brand recognition to maintain customer loyalty.',
      },
      {
        title: 'Strategy / application',
        content: 'The business uses integrated promotion, large-scale advertising and consistent branding to strengthen brand identity and influence consumer demand.',
      },
      {
        title: 'Result',
        content: 'This supports high visibility, strong brand recall and sustained market share across multiple markets.',
      },
      {
        title: 'Evaluation',
        highlight: 'Highly effective - market share',
        content: 'The strategy is highly effective in building market share because strong branding differentiates Coca-Cola from competitors, although heavy promotional spending can be costly.',
      },
    ],
    useThisIn: 'Promotion - Branding - Marketing objectives',
  },
  {
    id: 3,
    topic: 'Finance',
    title: 'Qantas',
    subtitle: 'Cash flow and financial control',
    intro: 'See how real businesses apply syllabus strategies to improve performance in finance.',
    sections: [
      {
        title: 'Syllabus dot point',
        content: 'Financial management -> cash flow statement; financial objectives -> liquidity and profitability',
        bullet: true,
      },
      {
        title: 'Business context',
        content: 'Qantas operates in a capital-intensive industry where maintaining liquidity and managing cash flow are essential to long-term stability.',
      },
      {
        title: 'Strategy / application',
        content: 'The business uses careful financial control, monitoring of cash flow and strategic cost management to support operations and investment decisions.',
      },
      {
        title: 'Result',
        content: 'This helps Qantas manage short-term obligations, improve financial stability and support sustainable performance.',
      },
      {
        title: 'Evaluation',
        highlight: 'Effective - liquidity',
        content: 'The strategy is effective in improving liquidity because strong cash-flow management supports day-to-day operations, although external shocks can still place pressure on financial performance.',
      },
    ],
    useThisIn: 'Cash flow statement - Liquidity - Financial management',
  },
  {
    id: 4,
    topic: 'Human Resources',
    title: 'Google',
    subtitle: 'Training, rewards and culture',
    intro: 'See how real businesses apply syllabus strategies to improve performance in human resources.',
    sections: [
      {
        title: 'Syllabus dot point',
        content: 'Human resource management -> training and development; rewards; performance objectives -> employee satisfaction and productivity',
        bullet: true,
      },
      {
        title: 'Business context',
        content: 'Google is known for investing in workplace culture, employee development and reward systems to attract and retain high-performing staff.',
      },
      {
        title: 'Strategy / application',
        content: 'The business uses training, professional development opportunities and intrinsic and extrinsic rewards to improve motivation and workplace performance.',
      },
      {
        title: 'Result',
        content: 'This supports employee satisfaction, strong productivity and a positive organisational culture.',
      },
      {
        title: 'Evaluation',
        highlight: 'Highly effective - employee satisfaction',
        content: 'The strategy is highly effective in improving employee satisfaction because supportive culture and rewards can motivate staff, although such initiatives require significant ongoing investment.',
      },
    ],
    useThisIn: 'Training - Rewards - Employee satisfaction',
  },
];

const businessPracticeContemporaryExamples: BusinessPracticeItem[] = [
  {
    id: 1,
    topic: 'Operations',
    title: 'Tesla',
    subtitle: '2026 - Gigafactory efficiency and vertical integration',
    intro: 'Current business snapshots that help students connect operations theory to the real world.',
    sections: [
      {
        title: 'What happened',
        content: 'Tesla continued to scale production through its Gigafactory model, using automation, integrated manufacturing and close control over key stages of production to improve speed and efficiency.',
      },
      {
        title: 'Syllabus connection',
        content: 'Operations strategies -> technology, supply chain management, process efficiency, volume and flexibility.',
      },
      {
        title: 'Why it matters',
        content: 'Tesla shows how advanced technology and vertical integration can reduce production delays, improve coordination and support faster output across a large-scale manufacturing network.',
      },
      {
        title: 'HSC judgement',
        content: 'Highly effective - efficiency. Tesla demonstrates strong operational efficiency because integrated production systems and automation help streamline manufacturing and support output growth, although high capital costs remain a challenge.',
      },
    ],
    useThisIn: 'Technology - Supply chain management - Efficiency - Operations strategies',
  },
  {
    id: 2,
    topic: 'Marketing',
    title: 'Dove',
    subtitle: '2026 - real reviews campaign',
    intro: 'Current business snapshots that help students connect marketing theory to the real world.',
    sections: [
      {
        title: 'What happened',
        content: 'Dove partnered with Reddit and promised to publish the first 50 consumer reviews of its Intensive Repair 10-in-1 Serum Hair Mask exactly as written.',
      },
      {
        title: 'Syllabus connection',
        content: 'Marketing strategies -> promotion, social media, customer engagement, consumer trust.',
      },
      {
        title: 'Why it matters',
        content: 'The campaign used authenticity as a promotional strategy. It generated earned attention and showed how honest reviews can build trust and influence brand loyalty.',
      },
      {
        title: 'HSC judgement',
        content: 'Highly effective - customer engagement. Dove shows strong responsiveness to consumer demand for authenticity by turning honest reviews into a powerful promotional tool.',
      },
    ],
    useThisIn: 'Promotion - Social media - Consumer trust',
  },
  {
    id: 3,
    topic: 'Finance',
    title: 'Qantas',
    subtitle: '1H26 result - profitability and reinvestment',
    intro: 'Current business snapshots that help students connect financial theory to the real world.',
    sections: [
      {
        title: 'What happened',
        content: 'Qantas delivered a strong 1H26 result as its fleet expanded, allowing continued investment in aircraft renewal as well as a fully franked base dividend and share buy-back.',
      },
      {
        title: 'Syllabus connection',
        content: 'Financial management -> profitability, strategic investment, shareholder returns, financial objectives.',
      },
      {
        title: 'Why it matters',
        content: 'The result links financial performance to reinvestment and shareholder returns, showing how stronger profits can support growth and investor confidence.',
      },
      {
        title: 'HSC judgement',
        content: 'Effective - profitability. Qantas demonstrates sound financial management because strong earnings are being used to fund long-term growth while also rewarding shareholders.',
      },
    ],
    useThisIn: 'Profitability - Financial objectives - Shareholder returns',
  },
  {
    id: 4,
    topic: 'Human Resources',
    title: 'Walmart',
    subtitle: 'July 2026 - employee development and retention',
    intro: 'Current business snapshots that help students connect human resources theory to the real world.',
    sections: [
      {
        title: 'What happened',
        content: 'Walmart reported that many salaried U.S. store, club and supply chain leaders began as hourly associates. It also linked no-cost development programs to stronger promotion and retention outcomes.',
      },
      {
        title: 'Syllabus connection',
        content: 'Human resources strategies -> training and development, retention, motivation, career progression.',
      },
      {
        title: 'Why it matters',
        content: 'The example shows how employee development programs can strengthen promotion pathways, improve retention and support a more committed workforce.',
      },
      {
        title: 'HSC judgement',
        content: 'Highly effective - retention. Walmart demonstrates that investing in staff development can improve employee capability and long-term retention.',
      },
    ],
    useThisIn: 'Training and development - Retention - Motivation',
  },
];

const businessPracticeCollections: Record<BusinessPracticeMode, BusinessPracticeItem[]> = {
  caseStudies: businessPracticeCaseStudies,
  contemporaryExamples: businessPracticeContemporaryExamples,
};

const getAdjacentBusinessPracticeIndex = (index: number, direction: -1 | 1, total: number) =>
  (index + direction + total) % total;

const BusinessPracticeCarousel = () => {
  const [mode, setMode] = useState<BusinessPracticeMode>('caseStudies');
  const [activeByMode, setActiveByMode] = useState<Record<BusinessPracticeMode, number>>({
    caseStudies: 0,
    contemporaryExamples: 0,
  });
  const [direction, setDirection] = useState<'previous' | 'next' | null>(null);
  const hoverTimerRef = useRef<number | null>(null);

  const items = businessPracticeCollections[mode];
  const activeIndex = activeByMode[mode];
  const activeItem = items[activeIndex];
  const previousItem = items[getAdjacentBusinessPracticeIndex(activeIndex, -1, items.length)];
  const nextItem = items[getAdjacentBusinessPracticeIndex(activeIndex, 1, items.length)];
  const modeLabel = mode === 'caseStudies' ? 'Case Studies' : 'Contemporary Examples';

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  const navigate = useCallback((step: -1 | 1) => {
    clearHoverTimer();
    setDirection(step > 0 ? 'next' : 'previous');
    setActiveByMode((current) => ({
      ...current,
      [mode]: getAdjacentBusinessPracticeIndex(current[mode], step, businessPracticeCollections[mode].length),
    }));
    window.setTimeout(() => setDirection(null), 560);
  }, [clearHoverTimer, mode]);

  const scheduleHoverAdvance = (step: -1 | 1) => {
    clearHoverTimer();
    hoverTimerRef.current = window.setTimeout(() => {
      navigate(step);
      hoverTimerRef.current = null;
    }, 350);
  };

  const updateMode = (nextMode: BusinessPracticeMode) => {
    if (nextMode === mode) return;
    clearHoverTimer();
    setDirection(null);
    setMode(nextMode);
  };

  const selectTopic = (topic: BusinessPracticeTopic) => {
    const topicIndex = items.findIndex((item) => item.topic === topic);
    if (topicIndex < 0 || topicIndex === activeIndex) return;
    clearHoverTimer();
    setDirection(topicIndex > activeIndex ? 'next' : 'previous');
    setActiveByMode((current) => ({ ...current, [mode]: topicIndex }));
    window.setTimeout(() => setDirection(null), 560);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigate(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(1);
    }
  };

  return (
    <section
      className="biz-practice-section"
      aria-labelledby="biz-practice-title"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="biz-practice-tabs" role="tablist" aria-label="Business practice collections">
        {(['caseStudies', 'contemporaryExamples'] as BusinessPracticeMode[]).map((tabMode) => (
          <button
            key={tabMode}
            type="button"
            role="tab"
            aria-selected={mode === tabMode}
            className={`biz-practice-tab ${mode === tabMode ? 'is-active' : ''}`}
            onClick={() => updateMode(tabMode)}
          >
            {tabMode === 'caseStudies' ? 'Case Studies' : 'Contemporary Examples'}
          </button>
        ))}
      </div>

      <div className="biz-practice-topic-tabs" role="tablist" aria-label={`${modeLabel} topics`}>
        {items.map((item) => (
          <button
            key={item.topic}
            type="button"
            role="tab"
            aria-selected={activeItem.topic === item.topic}
            className={`biz-practice-topic-tab ${activeItem.topic === item.topic ? 'is-active' : ''}`}
            onClick={() => selectTopic(item.topic)}
          >
            {item.topic}
          </button>
        ))}
      </div>

      <div className="biz-practice-layout" data-mode={mode}>
        <aside key={`${mode}-${activeItem.topic}`} className="biz-practice-intro" aria-live="polite">
          <span className="biz-practice-topic">{activeItem.topic}</span>
          <h2 id="biz-practice-title">
            {mode === 'caseStudies' ? (
              <>
                <span className="biz-practice-heading-line">Business in</span>
                <span className="biz-practice-heading-line">Practice</span>
              </>
            ) : (
              <>
                <span className="biz-practice-heading-line">Contemporary</span>
                <span className="biz-practice-heading-line">Examples</span>
              </>
            )}
          </h2>
          <span className="biz-practice-rule" aria-hidden="true" />
          <p>{activeItem.intro}</p>
        </aside>

        <div
          className={[
            'biz-practice-carousel',
            direction ? `is-moving-${direction}` : '',
          ].filter(Boolean).join(' ')}
          aria-label={`${modeLabel} carousel`}
        >
          <button
            type="button"
            className="biz-practice-arrow biz-practice-arrow--previous"
            onClick={() => navigate(-1)}
            aria-label={`Show previous ${modeLabel.toLowerCase()} card`}
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          <BusinessPracticePreviewCard
            item={previousItem}
            label="Previous"
            onHoverStart={() => scheduleHoverAdvance(-1)}
            onHoverEnd={clearHoverTimer}
            onSelect={() => navigate(-1)}
          />

          <BusinessPracticeActiveCard item={activeItem} index={activeIndex} />

          <BusinessPracticePreviewCard
            item={nextItem}
            label="Next"
            onHoverStart={() => scheduleHoverAdvance(1)}
            onHoverEnd={clearHoverTimer}
            onSelect={() => navigate(1)}
          />

          <button
            type="button"
            className="biz-practice-arrow biz-practice-arrow--next"
            onClick={() => navigate(1)}
            aria-label={`Show next ${modeLabel.toLowerCase()} card`}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className="biz-practice-pagination" aria-label={`${modeLabel} pagination`}>
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => selectTopic(item.topic)}
              aria-label={`Show ${item.topic} ${modeLabel.toLowerCase()} card`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const BusinessPracticeActiveCard = ({ item, index }: { item: BusinessPracticeItem; index: number }) => (
  <article className="biz-practice-card biz-practice-card--active" aria-live="polite">
    <div className="biz-practice-spine" aria-hidden="true">
      <strong>{String(index + 1).padStart(2, '0')}</strong>
    </div>
    <div className="biz-practice-card-body">
      <span className="biz-practice-card-topic">{item.topic}</span>
      <h3>{item.title}</h3>
      <p className="biz-practice-subtitle">{item.subtitle}</p>

      {item.sections.map((section) => (
        <div className="biz-practice-card-section" key={section.title}>
          <h4>{section.title}</h4>
          {section.highlight && <strong className="biz-practice-evaluation">{section.highlight}</strong>}
          <p className={section.bullet ? 'biz-practice-bullet' : undefined}>{section.content}</p>
        </div>
      ))}

      <div className="biz-practice-card-section biz-practice-use">
        <h4>Use this in</h4>
        <p>{item.useThisIn}</p>
      </div>
    </div>
  </article>
);

const BusinessPracticePreviewCard = ({
  item,
  label,
  onHoverStart,
  onHoverEnd,
  onSelect,
}: {
  item: BusinessPracticeItem;
  label: 'Previous' | 'Next';
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onSelect: () => void;
}) => (
  <button
    type="button"
    className={`biz-practice-preview biz-practice-preview--${label.toLowerCase()}`}
    onClick={onSelect}
    onPointerEnter={(event) => {
      if (event.pointerType !== 'touch') onHoverStart();
    }}
    onPointerLeave={onHoverEnd}
    onFocus={onHoverEnd}
    aria-label={`${label} card: ${item.title}`}
  >
    <span className="biz-practice-preview-topic">{item.topic}</span>
    <strong>{item.title}</strong>
    <span>{item.subtitle}</span>
    <i aria-hidden="true" />
  </button>
);

const BUSINESS_MYTH_PAGE_TURN_MS = 720;

const renderBusinessMythBody = (body: BusinessMythItem['body']) =>
  body.map((part, index) => {
    if (typeof part !== 'string') {
      return <strong key={`strong-${index}`}>{part.strong}</strong>;
    }

    return part.split('\n').map((segment, segmentIndex) => (
      <React.Fragment key={`text-${index}-${segmentIndex}`}>
        {segmentIndex > 0 && <br />}
        {segment}
      </React.Fragment>
    ));
  });

const BusinessMythPage = ({ item, className = '' }: { item: BusinessMythItem; className?: string }) => (
  <div className={`biz-myth-page ${className}`}>
    <div className="biz-myth-page__inner">
      <span className="biz-myth-page__eyebrow">
        <i aria-hidden="true" />
        The DA Difference
        <i aria-hidden="true" />
      </span>
      <h3>{item.headline}</h3>
      <p className="biz-myth-page__gold-line">{item.goldLine}</p>
      <div className="biz-myth-page__rule" aria-hidden="true">
        <span />
        <i />
        <span />
      </div>
      <p className="biz-myth-page__body">{renderBusinessMythBody(item.body)}</p>

      <div className="biz-myth-outcomes" aria-label="Business Studies myth outcomes">
        {item.outcomes.map(({ number, label, text, Icon }) => (
          <div className="biz-myth-outcome" key={`${item.id}-${label}`}>
            <Icon aria-hidden="true" />
            <strong>
              <span>{number}.</span> {label}
            </strong>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BusinessStudiesMyths = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [nextPageIndex, setNextPageIndex] = useState<number | null>(null);
  const [isTurning, setIsTurning] = useState(false);
  const [reviewed, setReviewed] = useState<Set<number>>(() => new Set([0]));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const mythButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  const selectMyth = (index: number) => {
    if (index === activeIndex) return;

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setActiveIndex(index);
    setReviewed((current) => {
      const next = new Set(current);
      next.add(index);
      return next;
    });

    if (prefersReducedMotion) {
      setIsTurning(false);
      setNextPageIndex(null);
      setPageIndex(index);
      return;
    }

    setNextPageIndex(index);
    setIsTurning(true);
    timeoutRef.current = window.setTimeout(() => {
      setPageIndex(index);
      setNextPageIndex(null);
      setIsTurning(false);
      timeoutRef.current = null;
    }, BUSINESS_MYTH_PAGE_TURN_MS);
  };

  const handleMythKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = businessMyths.length - 1;
    let nextIndex: number | null = null;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = index === 0 ? lastIndex : index - 1;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = lastIndex;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    selectMyth(nextIndex);
    window.requestAnimationFrame(() => mythButtonRefs.current[nextIndex]?.focus());
  };

  const currentPage = businessMyths[pageIndex];
  const nextPage = nextPageIndex === null ? null : businessMyths[nextPageIndex];

  return (
    <section className="biz-myths-section" aria-labelledby="biz-myths-title">
      <div className="biz-myths-inner">
        <header className="biz-myths-header">
          <span className="biz-myths-eyebrow">
            <i aria-hidden="true" />
            Business Studies, Reframed
            <i aria-hidden="true" />
          </span>
          <h2 id="biz-myths-title">
            <span>What students assume.</span>{' '}
            <em>What actually drives results.</em>
          </h2>
          <p>Select a myth to turn the page and see the DA approach.</p>
        </header>

        <div className="biz-myths-board">
          <span className="biz-myths-board__corner biz-myths-board__corner--tl" aria-hidden="true" />
          <span className="biz-myths-board__corner biz-myths-board__corner--tr" aria-hidden="true" />
          <span className="biz-myths-board__corner biz-myths-board__corner--bl" aria-hidden="true" />
          <span className="biz-myths-board__corner biz-myths-board__corner--br" aria-hidden="true" />

          <div className="biz-myths-nav-column">
            <div className="biz-myths-progress" aria-label="Business myths progress">
              {businessMyths.map((item, index) => {
                const isActive = index === activeIndex;
                const isReviewed = reviewed.has(index);

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      'biz-myth-progress-dot',
                      isActive ? 'is-active' : '',
                      isReviewed && !isActive ? 'is-reviewed' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => selectMyth(index)}
                    aria-label={`Go to myth ${String(item.id).padStart(2, '0')}`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <span>{String(item.id).padStart(2, '0')}</span>
                    <i aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <div className="biz-myth-list" role="tablist" aria-label="Business Studies myths">
              {businessMyths.map((item, index) => {
                const isActive = index === activeIndex;
                const mythNumber = String(item.id).padStart(2, '0');

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="biz-myth-page"
                    className={`biz-myth-card ${isActive ? 'is-active' : ''}`}
                    ref={(node) => {
                      mythButtonRefs.current[index] = node;
                    }}
                    onClick={() => selectMyth(index)}
                    onKeyDown={(event) => handleMythKeyDown(event, index)}
                    tabIndex={isActive ? 0 : -1}
                    aria-label={`Select myth ${mythNumber}: ${item.myth}`}
                  >
                    <span className="biz-myth-card__meta">
                      <span>Myth</span>
                      <strong>{mythNumber}</strong>
                    </span>
                    <span className="biz-myth-card__divider" aria-hidden="true" />
                    <span className="biz-myth-card__copy">{item.myth}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="biz-myth-booklet" id="biz-myth-page" role="tabpanel" aria-live="polite">
            <div className="biz-myth-booklet__instruction">
              Click another myth to turn the page <RotateCcw aria-hidden="true" />
            </div>
            <div className="biz-myth-booklet__spine" aria-hidden="true">
              <span />
              <span />
            </div>
            <div className={`biz-myth-page-stack ${isTurning ? 'is-turning' : ''}`}>
              <span className="biz-myth-page-layer biz-myth-page-layer--back" aria-hidden="true" />
              <span className="biz-myth-page-layer biz-myth-page-layer--middle" aria-hidden="true" />
              {nextPage && <BusinessMythPage item={nextPage} className="biz-myth-page--next" />}
              <BusinessMythPage item={currentPage} className={isTurning ? 'biz-myth-page--turning' : 'biz-myth-page--current'} />
            </div>
          </div>
        </div>

        <div className="biz-myths-quote">
          <span aria-hidden="true"><i /></span>
          <figure>
            <blockquote>You don’t need to figure it all out on your own.</blockquote>
            <figcaption>We help students turn knowledge into confident business thinking.</figcaption>
          </figure>
          <span aria-hidden="true"><i /></span>
        </div>
      </div>
    </section>
  );
};

const BusinessStudies = () => {
  return (
    <div className="min-h-screen bg-white">
      <BusinessStudiesIntroVideoGate />
      <SEO
        title="HSC Business Studies Tutoring"
        description="Master business concepts through case studies and real-world applications at DA Tuition."
        canonicalUrl="/subjects/business-studies"
      />
      <NavigationNew />

      <SubjectHero
        eyebrow="Years 11-12 Business Studies"
        icon={Briefcase}
        headlineWhite="Business Studies can feel like a lot."
        headlineGold="We make it feel manageable."
        subtext="Whether you're building your understanding, learning how to use case studies or strengthening your writing, we'll meet you where you are and help you move forward with confidence."
        exploreTargetId="business-modules"
        showExploreButton={false}
        placeholderLabel="Business Studies classroom"
        backgroundImageSrc="/images/subjects/business-studies/hero-background.png"
        backgroundImageAlt="DA Tuition Business Studies classroom"
      />

      <TrustedSchoolsStrip schools={businessTrustedSchools} className="subject-school-strip-compact" />
      <SubjectTypedBanner
        imageSrc="/images/subjects/business-studies/master-business-studies-banner.png"
        imageAlt="Business Studies banner with business books, a globe, stationery, and a growth chart"
        headline="Master Business Studies."
        emphasis="Think strategically. Lead with insight."
      />

      <BusinessStudiesMyths />

      <BusinessSyllabusQuiz />

      {/* Exam Structure */}
      <section className="biz-exam-structure-section" aria-labelledby="biz-exam-structure-title">
        <div className="biz-exam-structure-inner">
          <div className="biz-exam-structure-heading">
            <h2 id="biz-exam-structure-title">Get to Know the Structure of Your Exam</h2>
            <div className="biz-exam-flip-prompt">
              <span aria-hidden="true" />
              <div>
                <RotateCcw aria-hidden="true" />
                <strong>Flip a card for study tips</strong>
              </div>
              <span aria-hidden="true" />
            </div>
          </div>

          <div className="biz-exam-card-grid">
            {businessExamStructureCards.map(({ title, topic, Icon, tone, tips }) => (
              <button
                type="button"
                key={title}
                className={`biz-exam-card biz-exam-card--${tone}`}
                aria-label={`Hover or focus to show study tips for ${title}`}
              >
                <span className="biz-exam-card-shell">
                  <span className="biz-exam-card-face biz-exam-card-face--front">
                    <span className="biz-exam-card-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="biz-exam-card-copy">
                      <span className="biz-exam-card-title">{title}</span>
                      <span className="biz-exam-card-rule" aria-hidden="true">
                        <i />
                      </span>
                      <span className="biz-exam-card-topic">{topic}</span>
                    </span>
                  </span>

                  <span className="biz-exam-card-face biz-exam-card-face--back">
                    <span className="biz-exam-card-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="biz-exam-card-back-heading">
                      <span className="biz-exam-card-title">{title}</span>
                      <span className="biz-exam-card-topic">{topic}</span>
                    </span>
                    <ul>
                      {tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="biz-exam-time">
            <span aria-hidden="true" />
            <strong>3 hours + 5 minutes reading time exam</strong>
            <span aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Case Study Approach */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="biz-realworld-eyebrow">Learning that matters</span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-midnight mt-3 mb-6">
                Real-World Business Learning
              </h2>
              <p className="text-brand-midnight/80 mb-6">
                We bring Business Studies to life with real-world, contemporary examples that help students stay
                informed, think critically, and connect theory to practice. This approach fosters deeper
                understanding, more meaningful discussions, and prepares students for the challenges of tomorrow.
              </p>
              <ul className="biz-realworld-list">
                <li>
                  <span className="biz-realworld-icon">
                    <Briefcase aria-hidden="true" />
                  </span>
                  <span className="text-brand-midnight/80">Current business examples and case studies</span>
                </li>
                <li>
                  <span className="biz-realworld-icon">
                    <Globe aria-hidden="true" />
                  </span>
                  <span className="text-brand-midnight/80">Awareness of real-world events and trends</span>
                </li>
                <li>
                  <span className="biz-realworld-icon">
                    <Users aria-hidden="true" />
                  </span>
                  <span className="text-brand-midnight/80">Richer classroom discussion and application</span>
                </li>
                <li>
                  <span className="biz-realworld-icon">
                    <BookOpen aria-hidden="true" />
                  </span>
                  <span className="text-brand-midnight/80">Practical learning that goes beyond the textbook</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="biz-feature-card">
                <span className="biz-feature-icon">
                  <FileEdit aria-hidden="true" />
                </span>
                <div>
                  <h4 className="text-xl font-bold mb-3">Business Report and Essay Writing</h4>
                  <p>
                    Master the art of business report and essay writing with structured approaches, professional
                    language, and strategic recommendations that demonstrate sophisticated understanding.
                  </p>
                </div>
              </div>

              <div className="biz-feature-card">
                <span className="biz-feature-icon">
                  <LineChart aria-hidden="true" />
                </span>
                <div>
                  <h4 className="text-xl font-bold mb-3">Financial Analysis</h4>
                  <p>
                    Develop confidence in financial calculations, ratio analysis, and interpretation of business
                    performance metrics essential for the finance module.
                  </p>
                </div>
              </div>

              <div className="biz-feature-card">
                <span className="biz-feature-icon">
                  <Target aria-hidden="true" />
                </span>
                <div>
                  <h4 className="text-xl font-bold mb-3">Strategic Thinking</h4>
                  <p>
                    Learn to think like a business manager, evaluating strategies, identifying opportunities,
                    and making recommendations based on business theory.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BusinessPracticeCarousel />

      <BusinessTransformationSteps />

      <BusinessCareerPathways />

      <FooterNew />
    </div>
  );
};

export default BusinessStudies;

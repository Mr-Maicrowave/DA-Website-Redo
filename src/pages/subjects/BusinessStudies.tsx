import React, { useCallback, useRef, useState } from 'react';
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

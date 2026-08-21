import React, { useEffect, useRef, useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SubjectHero from '@/components/subjects/SubjectHero';
import SubjectTypedBanner from '@/components/subjects/SubjectTypedBanner';
import TrustedSchoolsStrip from '@/components/subjects/TrustedSchoolsStrip';
import LegalSyllabusQuiz from '@/components/subjects/LegalSyllabusQuiz';
import LegalTransformationSteps from '@/components/subjects/LegalTransformationSteps';
import { Button } from '@/components/ui/button';
import {
  Scale,
  Gavel,
  ClipboardCheck,
  MessageCircleQuestion,
  PenLine,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Newspaper,
  Globe2,
  FileBarChart,
} from 'lucide-react';
import SEO from '@/components/SEO';
import './LegalStudies.css';

const LEGAL_SAMPLE_PAGE_COUNT = 16;
const getLegalSamplePageSrc = (page: number) =>
  `/images/subjects/legal-studies/sample-pages/page-${String(page).padStart(2, '0')}.png`;

const legalTrustedSchools = [
  { name: 'Freeman Catholic College', logoSrc: '/images/schools/freeman-catholic-college.png' },
  { name: 'Canley Vale High School', logoSrc: '/images/schools/canley-vale-high-school.png' },
  { name: 'Bonnyrigg High School', logoSrc: '/images/schools/bonnyrigg-high-school.png' },
  { name: 'Mary MacKillop Catholic College', logoSrc: '/images/schools/mary-mackillop-catholic-college.png' },
  { name: 'Al-Faisal College', logoSrc: '/images/schools/al-faisal-college.png' },
];

const lcmidMethod = [
  {
    letter: 'L',
    title: 'Legislation',
    description: 'Cite relevant statutes and explain their application.',
    Icon: Scale,
  },
  {
    letter: 'C',
    title: 'Cases',
    description: 'Use landmark cases to illustrate legal principles.',
    Icon: Gavel,
  },
  {
    letter: 'M',
    title: 'Media',
    description: 'Incorporate current examples and contemporary issues.',
    Icon: Newspaper,
  },
  {
    letter: 'I',
    title: 'International Law',
    description: 'Apply international treaties, conventions and decisions.',
    Icon: Globe2,
  },
  {
    letter: 'D',
    title: 'Documents, declarations or data/statistics',
    description: 'Use official documents, reports and data to support claims and show impact.',
    Icon: FileBarChart,
  },
];

const evaluationCriteria = [
  {
    letter: 'P',
    title: 'Protection of individual rights',
    question: "Does the law safeguard people's basic rights and protect against abuse?",
  },
  {
    letter: 'E',
    title: 'Enforceability',
    question: 'Can the law be monitored, investigated and upheld effectively?',
  },
  {
    letter: 'A',
    title: 'Accessibility',
    question: 'Can ordinary people access the legal system without prohibitive cost, delay or stress?',
  },
  {
    letter: 'R',
    title: 'Resource efficiency',
    question: 'Does the system use time and money wisely, or are there better alternatives?',
  },
  {
    letter: 'R',
    title: 'Responsiveness',
    question: 'Does the law adapt to changing social values and community needs?',
  },
  {
    letter: 'J',
    title: 'Justice has been achieved',
    question: 'Does the legal framework deliver fair and equitable outcomes?',
  },
  {
    letter: 'A',
    title: 'Application of the rule of law',
    question: 'Are all people treated equally under the law?',
  },
  {
    letter: 'M',
    title: "Meeting society's needs",
    question: "Does the law protect broader community interests and expectations?",
  },
];

const examStructureCards = [
  {
    title: '20 Marks -\nMultiple Choice',
    topic: 'Human Rights and Crime',
    Icon: ClipboardCheck,
    tone: 'purple',
    tips: [
      'Know your syllabus.',
      "Don't let legal jargon confuse you.",
      'Practise HSC multiple-choice questions under timed conditions.',
      "Don't just check the answer; explain why the other three options are wrong.",
      'Revise similar concepts, e.g. Division vs Separation of powers.',
    ],
  },
  {
    title: '15 Marks -\nShort Answer',
    topic: 'Human Rights',
    Icon: MessageCircleQuestion,
    tone: 'green',
    tips: [
      'Know the syllabus terminology precisely: recognition, protection, enforcement and effectiveness.',
      'Ensure you use examples (LCMID).',
      'Practise glossary verbs: identify, describe, explain, analyse and assess.',
      'For higher-mark questions, make a clear judgement rather than simply describing the law.',
      'Revise by syllabus dot point so you know what the question is testing.',
    ],
  },
  {
    title: '15 Marks Essay',
    topic: 'Crime',
    Icon: PenLine,
    tone: 'orange',
    tips: [
      'Prepare paragraph scaffolds: legislation + cases + media/reports + statistics.',
      'Do not memorise an essay.',
      'Organise revision around Crime syllabus themes and challenges.',
      'Know which evidence can be used for several different questions.',
      'Integrate criteria like enforceability, accessibility, resource efficiency and individual rights.',
    ],
  },
  {
    title: '50 Marks - TWO\n25 Mark Option Essays',
    topic: 'Option Essays',
    Icon: Scale,
    tone: 'blue',
    tips: [
      'Know your two options equally well; together they are worth half of the exam.',
      'Use contemporary issues as paragraphs.',
      'Create an evidence bank containing LCMID.',
      'Prioritise recent evidence that lets you evaluate the law in practice.',
      'Ensure every paragraph answers the question; avoid paragraphs that explain your notes.',
    ],
  },
];

const legalJourneySteps = [
  {
    number: '01',
    title: 'Learn',
    description: 'Break down a syllabus concept and clarify difficult terminology.',
  },
  {
    number: '02',
    title: 'Connect',
    description: 'Link legislation, cases, media, international law and contemporary examples.',
  },
  {
    number: '03',
    title: 'Apply',
    description: 'Work through HSC-style multiple choice, short answers or essays.',
  },
  {
    number: '04',
    title: 'Write',
    description: 'Construct and refine responses together.',
  },
  {
    number: '05',
    title: 'Feedback',
    description: 'Receive precise feedback on what moves the response higher.',
  },
];

const LegalStudies = () => {
  const [isSampleOpen, setIsSampleOpen] = useState(false);
  const [samplePage, setSamplePage] = useState(1);
  const accessSectionRef = useRef<HTMLElement>(null);
  const evaluationSectionRef = useRef<HTMLElement>(null);
  const examStructureRef = useRef<HTMLElement>(null);
  const journeySectionRef = useRef<HTMLElement>(null);
  const scrollLockRef = useRef({ top: 0, overflow: '', position: '', width: '' });
  const lastWheelPageTurnRef = useRef(0);

  const openSample = () => {
    setSamplePage(1);
    setIsSampleOpen(true);
  };

  const showPreviousSamplePage = () => {
    setSamplePage((current) => Math.max(1, current - 1));
  };

  const showNextSamplePage = () => {
    setSamplePage((current) => Math.min(LEGAL_SAMPLE_PAGE_COUNT, current + 1));
  };

  useEffect(() => {
    const node = accessSectionRef.current;
    if (!node) return;

    const setPreviewVisible = (isVisible: boolean) => {
      if (isVisible) {
        document.body.setAttribute('data-legal-access-visible', 'true');
      } else {
        document.body.removeAttribute('data-legal-access-visible');
      }
    };

    const updatePreviewVisibility = () => {
      const rect = node.getBoundingClientRect();
      setPreviewVisible(rect.top < window.innerHeight && rect.bottom > 0);
    };

    updatePreviewVisibility();
    window.addEventListener('scroll', updatePreviewVisibility, { passive: true });
    window.addEventListener('resize', updatePreviewVisibility);

    return () => {
      window.removeEventListener('scroll', updatePreviewVisibility);
      window.removeEventListener('resize', updatePreviewVisibility);
      document.body.removeAttribute('data-legal-access-visible');
    };
  }, []);

  useEffect(() => {
    const node = evaluationSectionRef.current;
    if (!node) return;

    const setEvaluationVisible = (isVisible: boolean) => {
      if (isVisible) {
        document.body.setAttribute('data-legal-evaluation-visible', 'true');
      } else {
        document.body.removeAttribute('data-legal-evaluation-visible');
      }
    };

    const updateEvaluationVisibility = () => {
      const rect = node.getBoundingClientRect();
      setEvaluationVisible(rect.top < window.innerHeight && rect.bottom > 0);
    };

    updateEvaluationVisibility();
    window.addEventListener('scroll', updateEvaluationVisibility, { passive: true });
    window.addEventListener('resize', updateEvaluationVisibility);

    return () => {
      window.removeEventListener('scroll', updateEvaluationVisibility);
      window.removeEventListener('resize', updateEvaluationVisibility);
      document.body.removeAttribute('data-legal-evaluation-visible');
    };
  }, []);

  useEffect(() => {
    const node = examStructureRef.current;
    if (!node) return;

    const setExamStructureVisible = (isVisible: boolean) => {
      if (isVisible) {
        document.body.setAttribute('data-legal-exam-structure-visible', 'true');
      } else {
        document.body.removeAttribute('data-legal-exam-structure-visible');
      }
    };

    const updateExamStructureVisibility = () => {
      const rect = node.getBoundingClientRect();
      setExamStructureVisible(rect.top < window.innerHeight && rect.bottom > 0);
    };

    updateExamStructureVisibility();
    window.addEventListener('scroll', updateExamStructureVisibility, { passive: true });
    window.addEventListener('resize', updateExamStructureVisibility);

    return () => {
      window.removeEventListener('scroll', updateExamStructureVisibility);
      window.removeEventListener('resize', updateExamStructureVisibility);
      document.body.removeAttribute('data-legal-exam-structure-visible');
    };
  }, []);

  useEffect(() => {
    const node = journeySectionRef.current;
    if (!node) return;

    const setJourneyVisible = (isVisible: boolean) => {
      if (isVisible) {
        document.body.setAttribute('data-legal-journey-visible', 'true');
      } else {
        document.body.removeAttribute('data-legal-journey-visible');
      }
    };

    const updateJourneyVisibility = () => {
      const rect = node.getBoundingClientRect();
      setJourneyVisible(rect.top < window.innerHeight && rect.bottom > 0);
    };

    updateJourneyVisibility();
    window.addEventListener('scroll', updateJourneyVisibility, { passive: true });
    window.addEventListener('resize', updateJourneyVisibility);

    return () => {
      window.removeEventListener('scroll', updateJourneyVisibility);
      window.removeEventListener('resize', updateJourneyVisibility);
      document.body.removeAttribute('data-legal-journey-visible');
    };
  }, []);

  useEffect(() => {
    if (!isSampleOpen) return;

    const scrollTop = window.scrollY;
    scrollLockRef.current = {
      top: scrollTop,
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      width: document.body.style.width,
    };
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollTop}px`;
    document.body.style.width = '100%';
    document.body.setAttribute('data-legal-sample-open', 'true');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSampleOpen(false);
      } else if (event.key === 'ArrowLeft') {
        showPreviousSamplePage();
      } else if (event.key === 'ArrowRight') {
        showNextSamplePage();
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (Math.abs(event.deltaY) < 18) return;

      const now = window.performance.now();
      if (now - lastWheelPageTurnRef.current < 520) return;

      if (event.deltaY > 0) {
        showNextSamplePage();
      } else {
        showPreviousSamplePage();
      }

      lastWheelPageTurnRef.current = now;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      const lockedTop = scrollLockRef.current.top;
      document.body.style.overflow = scrollLockRef.current.overflow;
      document.body.style.position = scrollLockRef.current.position;
      document.body.style.top = '';
      document.body.style.width = scrollLockRef.current.width;
      document.body.removeAttribute('data-legal-sample-open');
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.scrollTo(0, lockedTop);
    };
  }, [isSampleOpen]);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="HSC Legal Studies Tutoring"
        description="Master the Australian legal system through case analysis and critical evaluation at DA Tuition."
        canonicalUrl="/subjects/legal-studies"
      />
      <NavigationNew />

      <SubjectHero
        eyebrow="Years 11-12 Legal Studies"
        icon={Scale}
        headlineWhite="Legal Studies doesn't have"
        headlineGold="to feel complicated."
        subtext="With the right guidance, cases begin to connect, legislation starts to make sense and essay questions become far less intimidating. At DA, we work through it with you, building your understanding, strengthening your writing and helping you become a more confident Legal Studies student, one response at a time."
        exploreTargetId="legal-topics"
        showExploreButton={false}
        placeholderLabel="Legal Studies classroom"
        backgroundImageSrc="/images/subjects/legal-studies/hero-background-full.png"
        backgroundImageAlt="DA Tuition Legal Studies classroom"
        backgroundPosition="center center"
        backgroundFit="cover"
      />

      <TrustedSchoolsStrip schools={legalTrustedSchools} className="subject-school-strip-compact" />
      <SubjectTypedBanner
        imageSrc="/images/subjects/legal-studies/master-legal-studies-banner.png"
        imageAlt="Legal Studies banner with scales of justice, law books, and a gavel"
        headline="Master Legal Studies."
        emphasis="Understand the law. Think critically."
        variant="legal"
      />

      {/* Evaluation Criteria */}
      <section ref={evaluationSectionRef} className="legal-evaluation-section" aria-label="Evaluation Criteria">
        <div className="legal-evaluation-inner">
          <div className="legal-evaluation-grid">
            <div className="legal-method-panel">
              <div className="legal-panel-heading">
                <span className="legal-heading-medallion">
                  <Landmark aria-hidden="true" />
                </span>
                <div>
                  <h3>Master the LCMID Method</h3>
                  <i aria-hidden="true" />
                </div>
              </div>
              <p className="legal-method-intro">
                The key to Band 6 Legal Studies essays is the LCMID structure. We teach students to integrate
                these elements into sophisticated legal analysis.
              </p>

              <div className="legal-method-list">
                {lcmidMethod.map(({ letter, title, description, Icon }) => (
                  <div className="legal-method-item" key={letter}>
                    <span className="legal-letter-medallion">{letter}</span>
                    <Icon className="legal-method-icon" aria-hidden="true" />
                    <div>
                      <h4>{title}</h4>
                      <p>{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="legal-criteria-panel">
              <div className="legal-panel-heading">
                <span className="legal-heading-medallion">
                  <Landmark aria-hidden="true" />
                </span>
                <div>
                  <h3>Evaluation Criteria</h3>
                  <i aria-hidden="true" />
                </div>
              </div>

              <div className="legal-criteria-list">
                {evaluationCriteria.map(({ letter, title, question }, index) => (
                  <div className="legal-criteria-item" key={`${letter}-${title}`}>
                    <span className="legal-letter-medallion">{letter}</span>
                    <h4>{title}</h4>
                    <p>{question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Structure */}
      <section ref={examStructureRef} className="legal-exam-structure-section" aria-labelledby="legal-exam-structure-title">
        <div className="legal-exam-structure-inner">
          <div className="legal-exam-structure-heading">
            <h2 id="legal-exam-structure-title">Get to Know the Structure of Your Exam</h2>
            <div className="legal-exam-flip-prompt">
              <span aria-hidden="true" />
              <div>
                <RotateCcw aria-hidden="true" />
                <strong>Flip a card for study tips</strong>
              </div>
              <span aria-hidden="true" />
            </div>
          </div>

          <div className="legal-exam-card-grid">
            {examStructureCards.map(({ title, topic, Icon, tone, tips }) => (
                <button
                  type="button"
                  key={title}
                  className={`legal-exam-card legal-exam-card--${tone}`}
                  aria-label={`Hover or focus to show study tips for ${title}`}
                >
                  <span className="legal-exam-card-shell">
                    <span className="legal-exam-card-face legal-exam-card-face--front">
                      <span className="legal-exam-card-icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <span className="legal-exam-card-copy">
                        <span className="legal-exam-card-title">{title}</span>
                        <span className="legal-exam-card-rule" aria-hidden="true">
                          <i />
                        </span>
                        <span className="legal-exam-card-topic">{topic}</span>
                      </span>
                    </span>

                    <span className="legal-exam-card-face legal-exam-card-face--back">
                      <span className="legal-exam-card-icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <span className="legal-exam-card-back-heading">
                        <span className="legal-exam-card-title">{title}</span>
                        <span className="legal-exam-card-topic">{topic}</span>
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

          <div className="legal-exam-time">
            <span aria-hidden="true" />
            <strong>3 hours + 5 minutes reading time exam</strong>
            <span aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Legal Studies Resource Preview */}
      <section ref={accessSectionRef} className="legal-access-section" aria-labelledby="legal-access-title">
        <div className="legal-access-shell">
          <div className="legal-access-visual">
            <img
              src="/images/subjects/legal-studies/exclusive-access-background.png"
              alt="Legal Studies state rank notes and sample essays book with Crime, Human Rights, Family and Workplace topic pages"
              className="legal-access-image"
            />
            <img
              src="/images/subjects/legal-studies/exclusive-access-background.png"
              alt=""
              className="legal-book-pulse-image"
              aria-hidden="true"
            />
            <div className="legal-access-copy">
              <h2 id="legal-access-title">
                <span>Exclusive Access:</span>
                <em>State Rank Notes<br />&amp; Sample Essays</em>
              </h2>
              <p>
                Get ahead with premium resources<br />
                for all Legal Studies topics.
              </p>
              <ul aria-label="Included Legal Studies topics">
                <li><span aria-hidden="true">✓</span>Crime</li>
                <li><span aria-hidden="true">✓</span>Human Rights</li>
                <li><span aria-hidden="true">✓</span>Family</li>
                <li><span aria-hidden="true">✓</span>Workplace</li>
              </ul>
              <p>
                Plus guidance and resources across<br />
                all other Legal Studies Options
              </p>
            </div>
            <button
              type="button"
              className="legal-preview-button legal-preview-button--book"
              onClick={openSample}
              aria-label="Open the Legal Studies sample by clicking the book"
            />
            <button
              type="button"
              className="legal-preview-button legal-preview-button--badge"
              onClick={openSample}
              aria-label="Click to view the Legal Studies sample"
            >
              <span className="legal-preview-badge-label">Click<br />To View</span>
            </button>
          </div>
        </div>
      </section>

      <LegalSyllabusQuiz />

      <LegalTransformationSteps />

      {/* Legal Studies Journey */}
      <section ref={journeySectionRef} className="legal-journey-section" aria-labelledby="legal-journey-title">
        <div className="legal-journey-inner">
          <h2 id="legal-journey-title">What Legal Studies feels like at DA</h2>

          <div className="legal-journey-map" aria-label="Five step Legal Studies learning path">
            <svg
              className="legal-journey-path"
              viewBox="0 0 1000 122"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <filter id="legalJourneyGlow" x="-12%" y="-70%" width="124%" height="240%">
                  <feGaussianBlur stdDeviation="4.8" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="1 0 0 0 1 0 1 0 0 0.74 0 0 1 0 0.18 0 0 0 0.95 0"
                    result="goldGlow"
                  />
                  <feMerge>
                    <feMergeNode in="goldGlow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                className="legal-journey-path-base"
                d="M91 23 a38 38 0 1 1 0 76 a38 38 0 1 1 0 -76 M129 61 L258 61 M296 23 a38 38 0 1 1 0 76 a38 38 0 1 1 0 -76 M334 61 L462 61 M500 23 a38 38 0 1 1 0 76 a38 38 0 1 1 0 -76 M538 61 L666 61 M704 23 a38 38 0 1 1 0 76 a38 38 0 1 1 0 -76 M742 61 L871 61 M909 23 a38 38 0 1 1 0 76 a38 38 0 1 1 0 -76"
                pathLength="1000"
              />
              <path
                className="legal-journey-path-streak"
                d="M91 23 a38 38 0 1 1 0 76 a38 38 0 1 1 0 -76 M129 61 L258 61 M296 23 a38 38 0 1 1 0 76 a38 38 0 1 1 0 -76 M334 61 L462 61 M500 23 a38 38 0 1 1 0 76 a38 38 0 1 1 0 -76 M538 61 L666 61 M704 23 a38 38 0 1 1 0 76 a38 38 0 1 1 0 -76 M742 61 L871 61 M909 23 a38 38 0 1 1 0 76 a38 38 0 1 1 0 -76"
                pathLength="1000"
                filter="url(#legalJourneyGlow)"
              />
              {[194, 398, 602, 806].map((x) => (
                <rect
                  key={x}
                  className="legal-journey-diamond"
                  x={x - 4}
                  y="57"
                  width="8"
                  height="8"
                  transform={`rotate(45 ${x} 61)`}
                />
              ))}
            </svg>

            <div className="legal-journey-steps">
              {legalJourneySteps.map((step) => (
                <article className="legal-journey-step" key={step.number}>
                  <div className="legal-journey-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <div className="legal-journey-rule" aria-hidden="true">
                    <span />
                    <i />
                    <span />
                  </div>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>

          <p className="legal-journey-reassurance">You don't have to know everything before you walk through the door.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Excel in HSC Legal Studies
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Master legal thinking and achieve the Band 6 results you deserve
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
              Book Interview
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Call 0401 940 207
            </Button>
          </div>
        </div>
      </section>

      {isSampleOpen && (
        <div
          className="legal-sample-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Legal Studies sample preview"
          onClick={() => setIsSampleOpen(false)}
        >
          <div className="legal-sample-frame" onClick={(event) => event.stopPropagation()}>
            <img
              src={getLegalSamplePageSrc(samplePage)}
              alt={`DA Legal Studies sample page ${samplePage} of ${LEGAL_SAMPLE_PAGE_COUNT}`}
              className="legal-sample-page"
            />
          </div>
          <button
            type="button"
            className="legal-sample-nav legal-sample-nav--prev"
            onClick={(event) => {
              event.stopPropagation();
              showPreviousSamplePage();
            }}
            disabled={samplePage === 1}
            aria-label="Previous sample page"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="legal-sample-nav legal-sample-nav--next"
            onClick={(event) => {
              event.stopPropagation();
              showNextSamplePage();
            }}
            disabled={samplePage === LEGAL_SAMPLE_PAGE_COUNT}
            aria-label="Next sample page"
          >
            <ChevronRight aria-hidden="true" />
          </button>
          <div className="legal-sample-count" aria-live="polite">
            {samplePage} / {LEGAL_SAMPLE_PAGE_COUNT}
          </div>
            <button
              type="button"
              className="legal-sample-close"
              onClick={(event) => {
                event.stopPropagation();
                setIsSampleOpen(false);
              }}
              aria-label="Close Legal Studies sample preview"
            >
              <X aria-hidden="true" />
            </button>
        </div>
      )}

      <FooterNew />
    </div>
  );
};

export default LegalStudies;

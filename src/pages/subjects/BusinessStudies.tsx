import React from 'react';
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

      <BusinessTransformationSteps />

      <BusinessCareerPathways />

      <FooterNew />
    </div>
  );
};

export default BusinessStudies;

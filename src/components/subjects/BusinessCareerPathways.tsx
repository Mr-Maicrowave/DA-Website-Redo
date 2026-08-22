import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Briefcase,
  Calendar,
  ClipboardCheck,
  Cog,
  DollarSign,
  Globe,
  Handshake,
  Heart,
  Landmark,
  Lightbulb,
  Megaphone,
  Rocket,
  Search,
  ShoppingCart,
  Star,
  Store,
  Tag,
  Truck,
  User,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import './BusinessCareerPathways.css';

type Pathway = {
  number: number;
  title: string;
  Icon: LucideIcon;
  roles: string[];
  heroImage: string;
  column: 1 | 3;
  row: 1 | 2 | 3;
  intro: string;
  enjoy: string[];
  strengths: string[];
  skills: string[];
  involves: string;
  opportunities: {
    title: string;
    description: string;
    Icon: LucideIcon;
  }[];
};

const careerPathways: Pathway[] = [
  {
    number: 1,
    title: 'Finance & Accounting',
    Icon: Landmark,
    roles: ['Accountant', 'Financial Analyst', 'Banker', 'Auditor'],
    heroImage: '/images/subjects/business-studies/pathways/finance-accounting.png',
    column: 1,
    row: 1,
    intro:
      'Finance and accounting professionals help businesses understand their financial position, manage money, plan for the future and make informed decisions that drive growth and stability.',
    enjoy: [
      'You like working with numbers',
      'You enjoy solving logical problems',
      'You like analysing information',
      'You enjoy finding patterns',
      'You prefer working with facts over guesswork',
    ],
    strengths: ['Analytical thinking', 'Attention to detail', 'Organisation', 'Accuracy', 'Logical reasoning', 'Problem-solving'],
    skills: ['Financial analysis', 'Budgeting and forecasting', 'Interpreting data', 'Problem-solving', 'Decision-making', 'Time management'],
    involves:
      'You will analyse financial data, prepare reports, manage budgets, assess investment opportunities and help businesses make confident, informed decisions about their future.',
    opportunities: [
      { title: 'Accountant', description: 'Prepare financial reports, manage budgets and help businesses stay financially strong.', Icon: User },
      { title: 'Financial Analyst', description: 'Analyse financial data and trends to help businesses make smart investment decisions.', Icon: DollarSign },
      { title: 'Banker', description: 'Help individuals and businesses manage their money, loans and financial goals.', Icon: Landmark },
      { title: 'Auditor', description: 'Examine financial records to ensure accuracy, compliance and good business practice.', Icon: ClipboardCheck },
    ],
  },
  {
    number: 2,
    title: 'Marketing & Media',
    Icon: Megaphone,
    roles: ['Marketing Manager', 'Brand Strategist', 'Social Media Manager', 'Advertising Executive'],
    heroImage: '/images/subjects/business-studies/pathways/marketing-media.png',
    column: 3,
    row: 1,
    intro:
      'Marketing and media professionals help businesses understand their customers, build brands, promote products and communicate messages that inspire, engage and drive action.',
    enjoy: [
      'You enjoy creativity and coming up with ideas',
      'You like social media, advertising and trends',
      'You enjoy communicating with people',
      'You are curious about what influences people',
    ],
    strengths: ['Creativity', 'Communication', 'Curiosity', 'Adaptability', 'Empathy'],
    skills: ['Market research', 'Branding and positioning', 'Content creation', 'Communication', 'Data analysis'],
    involves:
      'You will explore how businesses promote products and services, understand customer needs, build brands and use creative strategies to reach the right audience.',
    opportunities: [
      { title: 'Marketing Manager', description: 'Develop and lead marketing strategies to grow brands and attract customers.', Icon: BarChart3 },
      { title: 'Brand Strategist', description: 'Build and position brands to create strong identities and customer loyalty.', Icon: Tag },
      { title: 'Social Media Manager', description: 'Create and manage content across platforms to engage and grow online communities.', Icon: Heart },
      { title: 'Advertising Executive', description: 'Plan and deliver campaigns that capture attention and influence audiences.', Icon: Megaphone },
    ],
  },
  {
    number: 3,
    title: 'Management & Consulting',
    Icon: Users,
    roles: ['Business Manager', 'Project Manager', 'Business Analyst', 'Management Consultant'],
    heroImage: '/images/subjects/business-studies/pathways/management-consulting.png',
    column: 1,
    row: 2,
    intro:
      'Management and consulting professionals help organisations make decisions, solve problems, manage teams and improve business performance.',
    enjoy: [
      'You like organising things',
      'You enjoy solving problems',
      'You like leading groups',
      'You enjoy planning',
      'You like improving how things work',
    ],
    strengths: ['Leadership', 'Confidence', 'Strategic thinking', 'Organisation', 'Decision-making'],
    skills: ['Project management', 'Teamwork', 'Problem-solving', 'Presenting', 'Strategic planning'],
    involves:
      'You will examine how businesses operate, coordinate people and resources, solve challenges and improve systems for stronger results.',
    opportunities: [
      { title: 'Business Manager', description: 'Oversee daily operations, lead teams and help a business perform effectively.', Icon: Users },
      { title: 'Project Manager', description: 'Coordinate timelines, budgets and tasks to deliver successful outcomes.', Icon: Calendar },
      { title: 'Business Analyst', description: 'Use information and data to improve processes and support decisions.', Icon: Search },
      { title: 'Management Consultant', description: 'Advise organisations on strategy, performance and solving complex problems.', Icon: Lightbulb },
    ],
  },
  {
    number: 4,
    title: 'Entrepreneurship',
    Icon: Rocket,
    roles: ['Entrepreneur', 'Business Owner', 'Start-up Founder', 'E-commerce Manager'],
    heroImage: '/images/subjects/business-studies/pathways/entrepreneurship.png',
    column: 3,
    row: 2,
    intro:
      'Entrepreneurship is about identifying opportunities, developing ideas, taking calculated risks and turning solutions into businesses that create value.',
    enjoy: [
      'You love coming up with ideas',
      'You enjoy solving problems',
      'You like taking initiative',
      'You want to create something of your own',
    ],
    strengths: ['Initiative', 'Resilience', 'Creativity', 'Confidence', 'Adaptability'],
    skills: ['Opportunity spotting', 'Business planning', 'Financial decision-making', 'Innovation', 'Networking and pitching'],
    involves:
      'You will learn how to identify opportunities, develop ideas, manage risks, build business models and create products or services customers value.',
    opportunities: [
      { title: 'Entrepreneur', description: 'Start and grow a business based on an idea, opportunity or passion.', Icon: Rocket },
      { title: 'Business Owner', description: 'Manage and scale a business that provides value in the market.', Icon: Store },
      { title: 'Start-up Founder', description: 'Build innovative solutions and bring them to life in a new venture.', Icon: Lightbulb },
      { title: 'E-commerce Manager', description: 'Oversee online sales, digital operations and customer growth.', Icon: ShoppingCart },
    ],
  },
  {
    number: 5,
    title: 'People & Human Resources',
    Icon: UsersRound,
    roles: ['HR Manager', 'Recruiter', 'Workplace Relations Adviser', 'People & Culture Manager'],
    heroImage: '/images/subjects/business-studies/pathways/people-human-resources.png',
    column: 1,
    row: 3,
    intro:
      'People and HR professionals focus on the people within a business: recruitment, workplace culture, training, employee development and workplace relations.',
    enjoy: [
      'You enjoy working with people',
      'You like helping others',
      'You enjoy solving people-related problems',
      'You care about fairness and positive workplace culture',
    ],
    strengths: ['Empathy', 'Communication', 'Patience', 'Fairness', 'Emotional intelligence'],
    skills: ['Recruitment', 'Communication and listening', 'Conflict resolution', 'Training and development', 'Workplace relations'],
    involves:
      'You will learn how to attract, develop and support employees, manage workplace relations, build strong teams and help organisations create productive work environments.',
    opportunities: [
      { title: 'HR Manager', description: 'Lead people strategies and support organisational success.', Icon: UsersRound },
      { title: 'Recruiter', description: 'Find and attract the right talent for organisations.', Icon: Search },
      { title: 'Workplace Relations Adviser', description: 'Support employees and employers to resolve workplace matters.', Icon: Handshake },
      { title: 'People & Culture Manager', description: 'Build positive workplace cultures that help people thrive.', Icon: Heart },
    ],
  },
  {
    number: 6,
    title: 'Global Business & Operations',
    Icon: Globe,
    roles: ['Supply Chain Manager', 'International Business Manager', 'Procurement Officer', 'Operations Manager'],
    heroImage: '/images/subjects/business-studies/pathways/global-business-operations.png',
    column: 3,
    row: 3,
    intro:
      'Global business and operations professionals focus on how businesses produce and deliver goods and services, manage suppliers and operate across different countries and markets.',
    enjoy: [
      'You enjoy planning',
      'You are interested in logistics',
      'You like systems and efficiency',
      'You enjoy solving practical problems',
      'You like understanding how businesses operate behind the scenes',
    ],
    strengths: ['Organisation', 'Problem-solving', 'Adaptability', 'Attention to detail', 'Strategic thinking'],
    skills: ['Supply chain management', 'Logistics', 'Procurement', 'Planning', 'Data analysis'],
    involves:
      'You will examine how goods and services move through a business, from sourcing and production to delivery, efficiency and global trade.',
    opportunities: [
      { title: 'Supply Chain Manager', description: 'Coordinate sourcing, production and delivery so products move efficiently.', Icon: Truck },
      { title: 'Operations Manager', description: 'Improve systems, workflow and day-to-day business performance.', Icon: Cog },
      { title: 'Procurement Officer', description: 'Manage purchasing decisions and build supplier relationships.', Icon: ClipboardCheck },
      { title: 'International Business Manager', description: 'Help organisations operate, trade and grow across global markets.', Icon: Globe },
    ],
  },
];

const BusinessCareerPathways = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pathwayButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [isSequenceVisible, setIsSequenceVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activePathwayNumber, setActivePathwayNumber] = useState<number | null>(null);
  const activePathway = careerPathways.find(({ number }) => number === activePathwayNumber);

  const closePathway = () => {
    const focusedPathwayNumber = activePathwayNumber;
    setActivePathwayNumber(null);
    window.setTimeout(() => {
      if (focusedPathwayNumber) {
        pathwayButtonRefs.current[focusedPathwayNumber]?.focus();
      }
    }, 0);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleReducedMotionChange = () => {
      if (mediaQuery.matches) {
        setPrefersReducedMotion(true);
        setIsSequenceVisible(true);
      } else {
        setPrefersReducedMotion(false);
      }
    };

    handleReducedMotionChange();

    if (mediaQuery.matches || !section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          setIsSequenceVisible(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.35, 0.4] },
    );

    observer.observe(section);
    mediaQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  useEffect(() => {
    if (!activePathwayNumber) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePathway();
      }
    };

    document.body.classList.add('biz-pathways-modal-open');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('biz-pathways-modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePathwayNumber]);

  return (
    <section
      ref={sectionRef}
      className={`biz-pathways-section${isSequenceVisible ? ' biz-pathways-section--visible' : ''}${
        prefersReducedMotion ? ' biz-pathways-section--reduced-motion' : ''
      }`}
      aria-labelledby="biz-pathways-title"
    >
      <div className="biz-pathways-inner">
        <div className="biz-pathways-head">
          <h2 id="biz-pathways-title">Where Can Business Studies Take You?</h2>
          <div className="biz-pathways-rule" aria-hidden="true">
            <span />
            <i />
            <span />
          </div>
        </div>

        <div className="biz-pathways-map">
          <svg className="biz-pathways-connectors" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true">
            <path d="M520 92 C600 94 606 128 622 158" />
            <path d="M920 92 C840 94 834 128 818 158" />
            <path d="M515 300 L610 300" />
            <path d="M925 300 L830 300" />
            <path d="M520 508 C600 506 606 472 622 442" />
            <path d="M920 508 C840 506 834 472 818 442" />
            <circle cx="520" cy="92" r="6" />
            <circle cx="622" cy="158" r="6" />
            <circle cx="920" cy="92" r="6" />
            <circle cx="818" cy="158" r="6" />
            <circle cx="515" cy="300" r="6" />
            <circle cx="610" cy="300" r="6" />
            <circle cx="925" cy="300" r="6" />
            <circle cx="830" cy="300" r="6" />
            <circle cx="520" cy="508" r="6" />
            <circle cx="622" cy="442" r="6" />
            <circle cx="920" cy="508" r="6" />
            <circle cx="818" cy="442" r="6" />
          </svg>

          <div className="biz-pathways-logo-wrap">
            <span className="biz-pathways-logo-ring" aria-hidden="true" />
            <img
              className="biz-pathways-logo"
              src="/images/subjects/business-studies/pathways/da-pathways-crest.png"
              alt="DA crest"
              loading="eager"
            />
          </div>

          {careerPathways.map(({ number, title, Icon, roles, column, row }) => (
            <button
              key={number}
              ref={(node) => {
                pathwayButtonRefs.current[number] = node;
              }}
              type="button"
              className={`biz-pathway-card biz-pathway-card--${number} biz-pathway-card--${
                column === 1 ? 'left' : 'right'
              }`}
              aria-label={`Open ${title} pathway details`}
              onClick={() => setActivePathwayNumber(number)}
              style={
                {
                  gridColumn: String(column),
                  gridRow: String(row),
                  '--reveal-delay': `${number}s`,
                } as React.CSSProperties
              }
            >
              <span className="biz-pathway-icon">
                <Icon aria-hidden="true" />
              </span>
              <div className="biz-pathway-copy">
                <h3>
                  <span className="biz-pathway-num">{number}.</span> {title}
                </h3>
                <span className="biz-pathway-rule" aria-hidden="true" />
                <ul className="biz-pathway-jobs" aria-label={`${title} career examples`}>
                  {roles.map((role) => (
                    <li key={role}>{role}</li>
                  ))}
                </ul>
              </div>
            </button>
          ))}
        </div>

        <div className="biz-pathways-footer">
          <div className="biz-pathways-footer-rule" aria-hidden="true">
            <span />
            <i />
            <span />
          </div>
          <p>
            Business Studies doesn&rsquo;t prepare students for one career &mdash; it introduces students to the way
            organisations, markets, people and money work across almost every industry.
          </p>
        </div>
      </div>

      {activePathway && (
        <div
          className="biz-pathway-detail"
          role="dialog"
          aria-modal="true"
          aria-labelledby="biz-pathway-detail-title"
        >
          <div className="biz-pathway-detail__left">
            <button className="biz-pathway-detail__back" type="button" onClick={closePathway}>
              <ArrowLeft aria-hidden="true" />
              Back to Pathways
            </button>

            <div className="biz-pathway-detail__title-row">
              <span className="biz-pathway-detail__hero-icon">
                <activePathway.Icon aria-hidden="true" />
              </span>
              <div>
                <h3 id="biz-pathway-detail-title">
                  <span>{activePathway.number}.</span> {activePathway.title}
                </h3>
                <div className="biz-pathway-detail__rule" aria-hidden="true">
                  <span />
                  <i />
                  <span />
                </div>
              </div>
            </div>

            <p className="biz-pathway-detail__intro">{activePathway.intro}</p>

            <div className="biz-pathway-detail__cards">
              <article className="biz-pathway-detail__info-card">
                <Heart aria-hidden="true" />
                <h4>You might enjoy this if...</h4>
                <ul>
                  {activePathway.enjoy.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="biz-pathway-detail__info-card">
                <Star aria-hidden="true" />
                <h4>Strengths that suit this field</h4>
                <ul>
                  {activePathway.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="biz-pathway-detail__info-card">
                <Briefcase aria-hidden="true" />
                <h4>Skills you&rsquo;ll use and build</h4>
                <ul>
                  {activePathway.skills.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="biz-pathway-detail__info-card">
                <BarChart3 aria-hidden="true" />
                <h4>What this field involves</h4>
                <p>{activePathway.involves}</p>
              </article>
            </div>
          </div>

          <aside className="biz-pathway-detail__right">
            <div className="biz-pathway-detail__image-panel" aria-hidden="true">
              <img src={activePathway.heroImage} alt="" />
            </div>
            <h4>Where Could It Take You?</h4>
            <div className="biz-pathway-detail__gold-rule" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>
            <div className="biz-pathway-detail__opportunities">
              {activePathway.opportunities.map(({ title, description, Icon }) => (
                <article key={title} className="biz-pathway-detail__opportunity">
                  <span>
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <h5>{title}</h5>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};

export default BusinessCareerPathways;

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  FileText,
  Gavel,
  Globe2,
  GraduationCap,
  Handshake,
  Heart,
  Home,
  Landmark,
  Megaphone,
  Newspaper,
  Scale,
  Search,
  ShieldCheck,
  Star,
  Users,
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

const legalCareerPathways: Pathway[] = [
  {
    number: 1,
    title: 'Law & Justice',
    Icon: Scale,
    roles: ['Lawyer', 'Paralegal', 'Police Officer'],
    heroImage: '/images/subjects/legal-studies/pathways/law-justice.png',
    column: 1,
    row: 1,
    intro:
      'Law and justice careers focus on upholding fairness, protecting rights and helping people navigate the legal system. This field suits students who are interested in justice, reasoning, evidence and understanding how laws shape society.',
    enjoy: [
      'You care about fairness and justice',
      'You enjoy debating ideas and viewpoints',
      'You like analysing evidence and situations',
      'You are interested in rules, rights and responsibilities',
      'You enjoy thinking critically about real-world issues',
    ],
    strengths: ['Analytical thinking', 'Attention to detail', 'Clear communication', 'Integrity', 'Problem-solving', 'Sound judgement'],
    skills: [
      'Legal research',
      'Evaluating evidence',
      'Constructing arguments',
      'Interpreting legislation and cases',
      'Decision-making',
      'Written and verbal communication',
    ],
    involves:
      'You will examine legal issues, analyse evidence, interpret laws and consider how justice is achieved in different situations. This field involves understanding how the legal system works and using reasoning, research and communication to solve problems and support fair outcomes.',
    opportunities: [
      { title: 'Lawyer', description: 'Represents clients, provides legal advice and helps resolve disputes or protect rights.', Icon: Scale },
      {
        title: 'Paralegal',
        description: 'Supports legal professionals by preparing documents, conducting research and organising case materials.',
        Icon: Briefcase,
      },
      { title: 'Police Officer', description: 'Enforces the law, protects the community and investigates possible offences.', Icon: ShieldCheck },
      { title: 'Barrister', description: 'Presents cases in court and specialises in advocacy and legal argument.', Icon: Landmark },
      { title: 'Judge', description: 'Oversees court proceedings, applies the law and makes fair, reasoned decisions.', Icon: Gavel },
    ],
  },
  {
    number: 2,
    title: 'Government & Policy',
    Icon: Landmark,
    roles: ['Policy Advisor', 'Diplomat', 'Public Servant'],
    heroImage: '/images/subjects/legal-studies/pathways/government-policy.png',
    column: 3,
    row: 1,
    intro:
      'Government and policy careers focus on shaping laws, developing reforms and helping governments respond to the needs of society. This field suits students who are interested in public issues, decision-making, leadership and understanding how laws and policies influence communities.',
    enjoy: [
      'You are interested in how governments make decisions',
      'You enjoy discussing current issues and public policy',
      'You like thinking about change and reform',
      'You are curious about how society is organised',
      'You enjoy reasoning through complex problems',
    ],
    strengths: ['Analytical thinking', 'Clear communication', 'Sound judgement', 'Leadership potential', 'Negotiation', 'Strategic thinking'],
    skills: ['Policy analysis', 'Researching social issues', 'Evaluating evidence', 'Writing persuasively', 'Decision-making', 'Public speaking'],
    involves:
      'You will examine how laws are created, applied and reformed, and consider how governments respond to social needs. This field involves researching issues, weighing competing perspectives and shaping practical recommendations that influence policy and public life.',
    opportunities: [
      {
        title: 'Policy Advisor',
        description: 'Researches issues and helps develop recommendations that guide government decisions and reform.',
        Icon: Users,
      },
      {
        title: 'Diplomat',
        description: 'Represents Australia internationally and helps manage relationships, negotiations and global issues.',
        Icon: Globe2,
      },
      {
        title: 'Public Servant',
        description: 'Works within government departments to deliver programs, implement policy and support the community.',
        Icon: Briefcase,
      },
      {
        title: 'Policy Analyst',
        description: 'Examines legislation, data and public issues to evaluate whether policies are effective.',
        Icon: BarChart3,
      },
      {
        title: 'Political Adviser',
        description: 'Supports elected representatives by researching issues, preparing briefs and helping shape responses.',
        Icon: Landmark,
      },
    ],
  },
  {
    number: 3,
    title: 'Business',
    Icon: Briefcase,
    roles: ['Compliance Officer', 'Human Resources', 'Risk Analyst'],
    heroImage: '/images/subjects/legal-studies/pathways/business.png',
    column: 1,
    row: 2,
    intro:
      'Business careers connected to Legal Studies focus on ensuring organisations act lawfully, make responsible decisions and manage risk effectively. This field suits students who are interested in ethics, commercial decision-making, regulation and how law shapes workplaces and business operations.',
    enjoy: [
      'You like understanding how businesses operate',
      'You are interested in rules, ethics and responsibility',
      'You enjoy solving practical problems',
      'You like working with information and systems',
      'You are interested in decision-making and strategy',
    ],
    strengths: ['Attention to detail', 'Logical reasoning', 'Organisation', 'Integrity', 'Risk awareness', 'Commercial thinking'],
    skills: ['Contract analysis', 'Compliance awareness', 'Problem-solving', 'Communication', 'Decision-making', 'Managing information'],
    involves:
      'You will examine how laws regulate business activity, workplaces and organisational behaviour, and consider how businesses balance profit, responsibility and legal obligations. This field involves applying legal thinking to commercial decisions, managing risk and supporting fair and effective business practice.',
    opportunities: [
      {
        title: 'Compliance Officer',
        description: 'Helps organisations follow laws, regulations and internal policies to reduce legal risk.',
        Icon: ClipboardCheck,
      },
      {
        title: 'Human Resources Manager',
        description: 'Supports staff, workplace processes and employment practices in line with legal obligations.',
        Icon: Users,
      },
      { title: 'Risk Analyst', description: 'Identifies potential legal and commercial risks and helps businesses make safer decisions.', Icon: BarChart3 },
      {
        title: 'Contract Manager',
        description: 'Oversees agreements and ensures contracts are accurate, compliant and well managed.',
        Icon: FileText,
      },
      {
        title: 'Corporate Governance Officer',
        description: 'Supports ethical decision-making and helps organisations meet their legal responsibilities.',
        Icon: Landmark,
      },
    ],
  },
  {
    number: 4,
    title: 'Social Sciences',
    Icon: Users,
    roles: ['Criminologist', 'Social Worker', 'Community Advocate'],
    heroImage: '/images/subjects/legal-studies/pathways/social-sciences.png',
    column: 3,
    row: 2,
    intro:
      'Social sciences careers connected to Legal Studies focus on understanding people, systems and the social issues that affect fairness and justice. This field suits students who are interested in communities, human behaviour, advocacy and how legal systems affect different groups in society.',
    enjoy: [
      'You are interested in people and communities',
      'You care about fairness and social issues',
      'You enjoy understanding different perspectives',
      'You want to help others navigate challenges',
      'You are curious about why societies function the way they do',
    ],
    strengths: ['Empathy', 'Communication', 'Critical thinking', 'Advocacy', 'Problem-solving', 'Cultural awareness'],
    skills: ['Community research', 'Evaluating social issues', 'Communication', 'Advocacy skills', 'Analysing evidence', 'Collaboration'],
    involves:
      'You will examine how law interacts with social issues, inequality and community experiences, and consider how legal systems affect people\'s lives. This field involves understanding social needs, interpreting evidence and working toward fairer outcomes for individuals and groups.',
    opportunities: [
      {
        title: 'Criminologist',
        description: 'Studies crime, justice systems and patterns of offending to better understand social behaviour.',
        Icon: Search,
      },
      {
        title: 'Social Worker',
        description: 'Supports individuals and families by connecting them with services, advocacy and practical assistance.',
        Icon: Heart,
      },
      {
        title: 'Community Advocate',
        description: 'Works with groups and organisations to promote fairness, rights and better outcomes.',
        Icon: Users,
      },
      {
        title: 'Youth Justice Worker',
        description: 'Supports young people involved in the justice system and helps guide positive change.',
        Icon: Scale,
      },
      {
        title: 'Case Manager',
        description: 'Coordinates support services and helps people navigate complex legal or social challenges.',
        Icon: ClipboardCheck,
      },
    ],
  },
  {
    number: 5,
    title: 'Media & Communication',
    Icon: Megaphone,
    roles: ['Journalist', 'Content Producer', 'Public Relations'],
    heroImage: '/images/subjects/legal-studies/pathways/media-communication.png',
    column: 1,
    row: 3,
    intro:
      'Media and communication careers connected to Legal Studies focus on explaining issues clearly, shaping public understanding and communicating with influence. This field suits students who are interested in current affairs, storytelling, public debate and helping others understand complex legal and social ideas.',
    enjoy: [
      'You enjoy writing and speaking clearly',
      'You are interested in news, issues and public debate',
      'You like turning complex ideas into simple explanations',
      'You enjoy persuasive communication',
      'You are curious about how media shapes society',
    ],
    strengths: ['Communication', 'Creativity', 'Critical analysis', 'Audience awareness', 'Persuasion', 'Confidence'],
    skills: ['Writing for different audiences', 'Public speaking', 'Researching issues', 'Media literacy', 'Explaining complex ideas', 'Storytelling'],
    involves:
      'You will examine how legal and social issues are communicated to the public, and consider how information shapes attitudes, debate and decision-making. This field involves researching issues, crafting messages and helping others understand complex ideas with clarity and impact.',
    opportunities: [
      {
        title: 'Journalist',
        description: 'Investigates issues, reports the facts and helps the public stay informed about important events.',
        Icon: Newspaper,
      },
      {
        title: 'Legal Reporter',
        description: 'Explains court cases, legal developments and justice issues for a wider audience.',
        Icon: Scale,
      },
      {
        title: 'Content Producer',
        description: 'Creates engaging written, video or digital content that informs and communicates ideas.',
        Icon: Megaphone,
      },
      {
        title: 'Public Relations Officer',
        description: 'Manages communication between organisations and the public to build trust and understanding.',
        Icon: Users,
      },
      {
        title: 'Communications Adviser',
        description: 'Develops clear messages and strategies to help organisations communicate effectively.',
        Icon: Megaphone,
      },
    ],
  },
  {
    number: 6,
    title: 'Education & Community',
    Icon: GraduationCap,
    roles: ['Teacher', 'Youth Worker', 'NGO Coordinator'],
    heroImage: '/images/subjects/legal-studies/pathways/education-community.png',
    column: 3,
    row: 3,
    intro:
      'Education and community careers connected to Legal Studies focus on helping others understand their rights, participate in society and build stronger communities. This field suits students who are interested in teaching, mentoring, supporting people and making a meaningful contribution to the lives of others.',
    enjoy: [
      'You enjoy helping others learn and grow',
      'You are patient and encouraging',
      'You like working with people and communities',
      'You care about fairness and inclusion',
      'You want to make a positive difference',
    ],
    strengths: ['Empathy', 'Communication', 'Leadership', 'Patience', 'Organisation', 'Adaptability'],
    skills: ['Teaching and mentoring', 'Communication', 'Community engagement', 'Leadership', 'Planning and organisation', 'Advocacy'],
    involves:
      'You will examine how legal knowledge can be used to educate, support and empower others, and consider how communities benefit when people understand their rights and responsibilities. This field involves teaching, mentoring and creating opportunities for people to participate confidently in society.',
    opportunities: [
      { title: 'Teacher', description: 'Educates students and helps them build knowledge, skills and confidence for the future.', Icon: BookOpen },
      {
        title: 'Youth Worker',
        description: 'Supports young people by promoting wellbeing, resilience and positive opportunities.',
        Icon: Heart,
      },
      {
        title: 'Community Educator',
        description: 'Designs and delivers programs that help people understand important social or legal issues.',
        Icon: Users,
      },
      {
        title: 'NGO Coordinator',
        description: 'Works with community organisations to manage programs, advocacy and support services.',
        Icon: Handshake,
      },
      {
        title: 'Community Development Officer',
        description: 'Helps strengthen communities by planning initiatives and responding to local needs.',
        Icon: Home,
      },
    ],
  },
];

const LegalCareerPathways = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pathwayButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [isSequenceVisible, setIsSequenceVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activePathwayNumber, setActivePathwayNumber] = useState<number | null>(null);
  const activePathway = legalCareerPathways.find(({ number }) => number === activePathwayNumber);

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
      aria-labelledby="legal-pathways-title"
    >
      <div className="biz-pathways-inner">
        <div className="biz-pathways-head">
          <span className="legal-pathways-eyebrow">Where Can It Take You?</span>
          <h2 id="legal-pathways-title">Why Legal Studies matters beyond school</h2>
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

          {legalCareerPathways.map(({ number, title, Icon, roles, column, row }) => (
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
            Legal Studies does not prepare students for one career. It builds the reasoning,
            communication and judgement students can carry into law, policy, business, media,
            education and community work.
          </p>
        </div>
      </div>

      {activePathway && (
        <div
          className="biz-pathway-detail legal-pathway-detail"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-pathway-detail-title"
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
                <h3 id="legal-pathway-detail-title">
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
                <h4>Skills you&apos;ll use and build</h4>
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
            <div className="biz-pathway-detail__image-panel legal-pathway-detail__image-panel" aria-hidden="true">
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

export default LegalCareerPathways;

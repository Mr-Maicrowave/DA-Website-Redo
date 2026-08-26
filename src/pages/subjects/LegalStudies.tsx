import React, { useCallback, useEffect, useRef, useState } from 'react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SubjectHero from '@/components/subjects/SubjectHero';
import SubjectTypedBanner from '@/components/subjects/SubjectTypedBanner';
import TrustedSchoolsStrip from '@/components/subjects/TrustedSchoolsStrip';
import LegalSyllabusQuiz from '@/components/subjects/LegalSyllabusQuiz';
import LegalTransformationSteps from '@/components/subjects/LegalTransformationSteps';
import LegalCareerPathways from '@/components/subjects/LegalCareerPathways';
import { LegalStudiesIntroVideoGate } from '@/features/legal-intro-video/LegalStudiesIntroVideoGate';
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
  { name: 'Sefton High School', logoSrc: '/images/schools/sefton-high-school.png' },
  { name: 'Prairiewood High School', logoSrc: '/images/schools/prairiewood-high-school.png' },
  { name: 'Trinity Catholic College', logoSrc: '/images/schools/trinity-catholic-college.png' },
  { name: 'Macquarie Fields High School', logoSrc: '/images/schools/macquarie-fields-high-school.png' },
  { name: 'Fairvale High School', logoSrc: '/images/schools/fairvale-high-school.png' },
  { name: 'Amity College', logoSrc: '/images/schools/amity-college.png' },
  { name: 'Good Samaritan Catholic College', logoSrc: '/images/schools/good-samaritan-catholic-college.png' },
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

type LegalAuthorityItem = {
  id: number;
  topic: 'Crime' | 'Human Rights';
  title: string;
  citation?: string;
  provision?: string;
  syllabusDotPoint: string;
  summary: string;
  outcome?: string;
  significance?: string;
  evaluationTerm: string;
  evaluationCriterion: string;
  evaluation: string;
};

type LegalAuthorityMode = 'cases' | 'legislation';

const legalCases: LegalAuthorityItem[] = [
  {
    id: 1,
    topic: 'Crime',
    title: 'Woolmington v DPP',
    citation: '[1935] AC 462',
    syllabusDotPoint: 'The criminal trial process — presumption of innocence and burden of proof',
    summary: 'Woolmington was convicted of murdering his wife, but the appeal focused on who had to prove intention and guilt. The House of Lords used the case to confirm a core criminal law principle.',
    outcome: 'The conviction was quashed, and the court reaffirmed the "golden thread" that the prosecution bears the burden of proving guilt.',
    evaluationTerm: 'Highly effective',
    evaluationCriterion: 'Protection of individual rights',
    evaluation: 'as Woolmington entrenches the presumption of innocence and places the burden of proving guilt on the prosecution, reducing the risk of wrongful conviction.',
  },
  {
    id: 2,
    topic: 'Crime',
    title: 'Dietrich v The Queen',
    citation: '[1992] 177 CLR 292',
    syllabusDotPoint: 'The criminal trial process — legal representation and the right to a fair trial',
    summary: 'Dietrich, who was charged with serious drug offences, was unrepresented because he could not afford counsel. The High Court used the case to consider when an accused person can receive a fair trial without legal representation.',
    outcome: 'The High Court held that, in serious criminal matters, a trial should generally be adjourned or stayed if an indigent accused is left without representation through no fault of their own.',
    evaluationTerm: 'Effective',
    evaluationCriterion: 'Accessibility',
    evaluation: 'because the decision strengthens procedural fairness, although access to justice still depends on the practical availability of legal aid.',
  },
  {
    id: 3,
    topic: 'Crime',
    title: 'R v Loveridge',
    citation: '[2014] NSWCCA 120',
    syllabusDotPoint: 'Sentencing and punishment — purposes of punishment and law reform in sentencing',
    summary: 'Loveridge fatally assaulted Thomas Kelly and seriously injured another victim in unprovoked alcohol-fuelled attacks. The appeal became a major example of how sentencing responds to public concern about one-punch violence.',
    outcome: 'The NSW Court of Criminal Appeal increased Loveridge’s aggregate sentence and reinforced denunciation and deterrence as key sentencing considerations in such offences.',
    evaluationTerm: 'Moderately effective',
    evaluationCriterion: "Meeting society's needs",
    evaluation: 'as the case highlights how sentencing can reflect community expectations, although it also shows how criminal law reform is often reactive after high-profile tragedies.',
  },
  {
    id: 4,
    topic: 'Crime',
    title: 'Bugmy v The Queen',
    citation: '[2013] HCA 37',
    syllabusDotPoint: 'Sentencing and punishment — judicial discretion, mitigating factors and achieving justice',
    summary: 'Bugmy, an Aboriginal man from a background of extreme deprivation, was sentenced for assaulting a correctional officer. The High Court considered how social disadvantage should be treated during sentencing.',
    outcome: 'The High Court held that the effects of profound deprivation do not diminish over time and remain relevant to moral culpability, even though no separate sentencing principle applies only to Aboriginal offenders.',
    evaluationTerm: 'Partly effective',
    evaluationCriterion: 'Justice has been achieved',
    evaluation: 'because the case promotes more individualised justice in sentencing, but it does not remove the broader systemic inequalities that continue to shape criminal offending and punishment.',
  },
  {
    id: 5,
    topic: 'Crime',
    title: 'R v Tang',
    citation: '[2008] HCA 39',
    syllabusDotPoint: 'International crime — slavery, trafficking and the effectiveness of domestic criminal law',
    summary: 'Wei Tang, a Melbourne brothel owner, was prosecuted for possessing and using women as slaves. The case tested the meaning of slavery under Commonwealth criminal law in a modern context.',
    outcome: 'The High Court upheld Tang’s convictions and confirmed that the offence of slavery could apply to exploitative control even without formal ownership in the historical sense.',
    evaluationTerm: 'Effective',
    evaluationCriterion: 'Enforceability',
    evaluation: 'because Australian courts can respond to serious international crimes domestically, but the small number of prosecutions suggests enforcement remains limited.',
  },
  {
    id: 6,
    topic: 'Human Rights',
    title: 'Mabo v Queensland (No 2)',
    citation: '(1992) 175 CLR 1',
    syllabusDotPoint: 'The nature and development of human rights — recognition of Indigenous rights and equality before the law',
    summary: 'Eddie Mabo and other Meriam people challenged the doctrine of terra nullius and sought recognition of their traditional land rights. The case became a defining example of rights development within Australian law.',
    outcome: 'The High Court rejected terra nullius and recognised native title, prompting major legal reform including the Native Title Act 1993 (Cth).',
    evaluationTerm: 'Highly effective',
    evaluationCriterion: 'Responsiveness',
    evaluation: 'as the decision marked a landmark step toward justice for Indigenous peoples, although the practical protection of land rights remains uneven and contested.',
  },
  {
    id: 7,
    topic: 'Human Rights',
    title: 'Toonen v Australia',
    citation: 'UNHRC (1994)',
    syllabusDotPoint: 'Promoting and enforcing human rights — the role of the UN and the ICCPR in protecting privacy and non-discrimination',
    summary: 'Nicholas Toonen challenged Tasmanian laws criminalising consensual homosexual conduct. The complaint was brought before the UN Human Rights Committee under the ICCPR.',
    outcome: 'The UN Human Rights Committee found Australia in breach of the ICCPR, and the case helped drive federal intervention and the later repeal of the Tasmanian laws.',
    evaluationTerm: 'Effective',
    evaluationCriterion: 'Protection of individual rights',
    evaluation: 'because international human rights mechanisms can influence domestic reform, though they still depend on political willingness and state compliance.',
  },
  {
    id: 8,
    topic: 'Human Rights',
    title: 'Minister for Immigration and Ethnic Affairs v Teoh',
    citation: '[1995] 183 CLR 273',
    syllabusDotPoint: 'Promoting and enforcing human rights — the role of treaties and the Convention on the Rights of the Child',
    summary: 'Teoh faced deportation despite having young children in Australia. The High Court examined whether Australia’s ratification of the Convention on the Rights of the Child should influence administrative decision-making.',
    outcome: 'The High Court held that ratification of the treaty could create a legitimate expectation that decision-makers would act consistently with it unless they clearly indicated otherwise.',
    evaluationTerm: 'Moderately effective',
    evaluationCriterion: 'Application of the rule of law',
    evaluation: 'because the case strengthened the domestic influence of international treaties, but its long-term effect has been uncertain because governments have tried to limit its reach.',
  },
  {
    id: 9,
    topic: 'Human Rights',
    title: 'A v Australia',
    citation: 'UNHRC (1997)',
    syllabusDotPoint: 'Promoting and enforcing human rights — UN review of arbitrary detention and state compliance',
    summary: 'A Cambodian asylum seeker was held in prolonged immigration detention in Australia without a clear end point. The complaint was brought before the UN Human Rights Committee as a challenge to arbitrary detention.',
    outcome: 'The UN Human Rights Committee found that Australia had breached the ICCPR because the detention was arbitrary, but Australia did not fully implement the Committee’s view.',
    evaluationTerm: 'Limited',
    evaluationCriterion: 'Enforceability',
    evaluation: 'because the case reveals the value of international scrutiny, yet it also exposes the weakness of enforcement when states choose not to comply fully.',
  },
  {
    id: 10,
    topic: 'Human Rights',
    title: 'Al-Kateb v Godwin',
    citation: '[2004] 219 CLR 562',
    syllabusDotPoint: 'Contemporary issue in human rights — refugee rights, detention and the limits of domestic protection',
    summary: 'Al-Kateb, a stateless asylum seeker, could not be removed from Australia but remained in immigration detention. The High Court considered whether the Migration Act allowed indefinite detention in those circumstances.',
    outcome: 'By majority, the High Court held that the Migration Act did permit indefinite detention of a stateless person who could not be deported.',
    evaluationTerm: 'Ineffective',
    evaluationCriterion: 'Protection of individual rights',
    evaluation: 'as the case illustrates how human rights can be vulnerable in Australia when there is no entrenched national bill of rights.',
  },
];

const legalLegislation: LegalAuthorityItem[] = [
  {
    id: 1,
    topic: 'Crime',
    title: 'Crimes Act 1900 (NSW)',
    provision: 's 18 — Murder',
    syllabusDotPoint: 'Criminal law — elements of major indictable offences and criminal liability',
    summary: 'The Crimes Act 1900 (NSW) is the central source of many serious criminal offences in New South Wales, including murder, manslaughter and assault.',
    significance: 'It gives prosecutors clear statutory foundations for serious offences and helps students connect offence elements to criminal responsibility.',
    evaluationTerm: 'Effective',
    evaluationCriterion: 'Enforceability',
    evaluation: 'because clear statutory offences assist investigation and prosecution, although outcomes still depend on evidence, resources and court process.',
  },
  {
    id: 2,
    topic: 'Crime',
    title: 'Bail Act 2013 (NSW)',
    provision: 'Unacceptable risk test',
    syllabusDotPoint: 'Criminal trial process — bail, remand and balancing community safety with individual rights',
    summary: 'The Bail Act 2013 (NSW) structures how courts decide whether an accused person should be released before trial.',
    significance: 'It requires decision-makers to weigh risks such as failing to appear, endangering victims or interfering with witnesses.',
    evaluationTerm: 'Partly effective',
    evaluationCriterion: 'Protection of individual rights',
    evaluation: 'because the Act recognises liberty before conviction, but strict bail settings can still increase remand and pressure vulnerable accused people.',
  },
  {
    id: 3,
    topic: 'Crime',
    title: 'Law Enforcement (Powers and Responsibilities) Act 2002 (NSW)',
    provision: 'Police powers',
    syllabusDotPoint: 'Investigation process — police powers, rights of suspects and safeguards',
    summary: 'LEPRA gives police powers to search, arrest, detain and question suspects while setting legal limits on how those powers may be used.',
    significance: 'It is a key statute for evaluating whether criminal investigations balance public protection with civil liberties.',
    evaluationTerm: 'Moderately effective',
    evaluationCriterion: 'Application of the rule of law',
    evaluation: 'because police powers are placed in legislation and reviewable by courts, although practical safeguards can be difficult for suspects to access.',
  },
  {
    id: 4,
    topic: 'Crime',
    title: 'Crimes (Sentencing Procedure) Act 1999 (NSW)',
    provision: 'Purposes of sentencing',
    syllabusDotPoint: 'Sentencing and punishment — purposes, discretion and achieving justice',
    summary: 'This Act sets out the purposes and principles courts consider when sentencing offenders in New South Wales.',
    significance: 'It helps explain denunciation, deterrence, rehabilitation, retribution and community protection in sentencing responses.',
    evaluationTerm: 'Effective',
    evaluationCriterion: "Meeting society's needs",
    evaluation: 'because it gives courts a structured sentencing framework, although public confidence can fluctuate when sentences appear too lenient or severe.',
  },
  {
    id: 5,
    topic: 'Crime',
    title: 'Criminal Code Act 1995 (Cth)',
    provision: 'Divisions 270–271',
    syllabusDotPoint: 'International crime — slavery, trafficking and domestic implementation',
    summary: 'The Commonwealth Criminal Code criminalises slavery, servitude and trafficking, allowing Australia to prosecute serious international crimes domestically.',
    significance: 'It connects international obligations to enforceable Australian offences, including offences considered in R v Tang.',
    evaluationTerm: 'Effective',
    evaluationCriterion: 'Responsiveness',
    evaluation: 'because domestic law has adapted to modern forms of exploitation, but prosecution numbers remain limited by detection and evidentiary barriers.',
  },
  {
    id: 6,
    topic: 'Human Rights',
    title: 'Racial Discrimination Act 1975 (Cth)',
    provision: 'Race discrimination protections',
    syllabusDotPoint: 'The nature and development of human rights — anti-discrimination and equality before the law',
    summary: 'The Racial Discrimination Act 1975 (Cth) makes racial discrimination unlawful and gives domestic effect to Australia’s international commitments.',
    significance: 'It is a key example of how human rights can be protected through ordinary legislation rather than a constitutional bill of rights.',
    evaluationTerm: 'Effective',
    evaluationCriterion: 'Protection of individual rights',
    evaluation: 'because it creates enforceable equality protections, although complaints processes can still be slow, stressful and resource-intensive.',
  },
  {
    id: 7,
    topic: 'Human Rights',
    title: 'Native Title Act 1993 (Cth)',
    provision: 'Recognition of native title',
    syllabusDotPoint: 'The nature and development of human rights — Indigenous rights and recognition',
    summary: 'The Native Title Act 1993 (Cth) was enacted after Mabo to recognise and regulate native title claims in Australia.',
    significance: 'It provides a legal process for recognising traditional land rights but also imposes complex evidentiary requirements.',
    evaluationTerm: 'Partly effective',
    evaluationCriterion: 'Accessibility',
    evaluation: 'because it creates a pathway for recognition, but the process is expensive, lengthy and difficult for many communities to navigate.',
  },
  {
    id: 8,
    topic: 'Human Rights',
    title: 'Migration Act 1958 (Cth)',
    provision: 'Immigration detention',
    syllabusDotPoint: 'Contemporary issue in human rights — asylum seekers, detention and domestic protection',
    summary: 'The Migration Act 1958 (Cth) regulates entry, visas, removal and immigration detention, including provisions considered in Al-Kateb v Godwin.',
    significance: 'It is central to debates about refugee rights, executive power and the limits of human rights protection in Australia.',
    evaluationTerm: 'Limited',
    evaluationCriterion: 'Protection of individual rights',
    evaluation: 'because the Act can prioritise border control over liberty, especially where detention becomes prolonged or indefinite.',
  },
  {
    id: 9,
    topic: 'Human Rights',
    title: 'Human Rights (Sexual Conduct) Act 1994 (Cth)',
    provision: 'Privacy protections',
    syllabusDotPoint: 'Promoting and enforcing human rights — domestic response to international human rights findings',
    summary: 'This Act was passed after Toonen v Australia and prevented arbitrary interference with adult consensual sexual conduct in private.',
    significance: 'It shows how international human rights scrutiny can trigger domestic law reform.',
    evaluationTerm: 'Highly effective',
    evaluationCriterion: 'Responsiveness',
    evaluation: 'because Parliament responded directly to a human rights breach and strengthened privacy and non-discrimination protections.',
  },
  {
    id: 10,
    topic: 'Human Rights',
    title: 'International Covenant on Civil and Political Rights',
    provision: 'ICCPR',
    syllabusDotPoint: 'Promoting and enforcing human rights — international law and state accountability',
    summary: 'The ICCPR protects civil and political rights and underpins several human rights complaints involving Australia.',
    significance: 'It provides international standards for rights such as liberty, privacy, equality and freedom from arbitrary detention.',
    evaluationTerm: 'Moderately effective',
    evaluationCriterion: 'Enforceability',
    evaluation: 'because it enables international scrutiny, but UN views depend heavily on state cooperation and are not directly enforceable like domestic court orders.',
  },
];

const legalAuthorityCollections: Record<LegalAuthorityMode, LegalAuthorityItem[]> = {
  cases: legalCases,
  legislation: legalLegislation,
};

const getAdjacentIndex = (index: number, direction: -1 | 1, total: number) =>
  (index + direction + total) % total;

const getTopicIntro = (mode: LegalAuthorityMode, topic: LegalAuthorityItem['topic']) => {
  const area = topic === 'Crime' ? 'criminal law' : 'human rights law';
  return `Authorities that help students understand, apply and evaluate ${area}.`;
};

const LegalAuthorityCarousel = () => {
  const [mode, setMode] = useState<LegalAuthorityMode>('cases');
  const [activeByMode, setActiveByMode] = useState<Record<LegalAuthorityMode, number>>({
    cases: 0,
    legislation: 0,
  });
  const [direction, setDirection] = useState<'previous' | 'next' | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const hoverTimerRef = useRef<number | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const dragIntentRef = useRef(false);

  const items = legalAuthorityCollections[mode];
  const activeIndex = activeByMode[mode];
  const activeItem = items[activeIndex];
  const previousItem = items[getAdjacentIndex(activeIndex, -1, items.length)];
  const nextItem = items[getAdjacentIndex(activeIndex, 1, items.length)];
  const modeLabel = mode === 'cases' ? 'Cases' : 'Legislation';
  const heading = mode === 'cases' ? 'Key Cases' : 'Key Legislation';

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
      [mode]: getAdjacentIndex(current[mode], step, legalAuthorityCollections[mode].length),
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

  const updateMode = (nextMode: LegalAuthorityMode) => {
    if (nextMode === mode) return;
    clearHoverTimer();
    setDirection(null);
    setDragOffset(0);
    setIsPointerDown(false);
    setMode(nextMode);
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

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, a')) return;
    clearHoverTimer();
    startPointRef.current = { x: event.clientX, y: event.clientY };
    dragIntentRef.current = false;
    setIsPointerDown(true);
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const startPoint = startPointRef.current;
    if (!isPointerDown || !startPoint) return;

    const deltaX = event.clientX - startPoint.x;
    const deltaY = event.clientY - startPoint.y;

    if (!dragIntentRef.current) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 12) {
        return;
      }
      if (Math.abs(deltaX) > 10) {
        dragIntentRef.current = true;
      }
    }

    if (dragIntentRef.current) {
      event.preventDefault();
      setDragOffset(Math.max(-92, Math.min(92, deltaX)));
    }
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const offset = dragOffset;
    startPointRef.current = null;
    dragIntentRef.current = false;
    setIsPointerDown(false);
    setDragOffset(0);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (Math.abs(offset) < 52) return;
    navigate(offset < 0 ? 1 : -1);
  };

  return (
    <section
      id="legal-authority-carousel"
      className="legal-authority-section"
      aria-labelledby="legal-authority-title"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="legal-authority-tabs" role="tablist" aria-label="Cases and legislation">
        {(['cases', 'legislation'] as LegalAuthorityMode[]).map((tabMode) => (
          <button
            key={tabMode}
            type="button"
            role="tab"
            aria-selected={mode === tabMode}
            className={`legal-authority-tab ${mode === tabMode ? 'is-active' : ''}`}
            onMouseUp={(event) => {
              event.stopPropagation();
              updateMode(tabMode);
            }}
            onClick={(event) => {
              if (event.detail === 0) updateMode(tabMode);
            }}
          >
            {tabMode === 'cases' ? 'Cases' : 'Legislation'}
          </button>
        ))}
      </div>

      <div className="legal-authority-layout" data-mode={mode}>
        <aside key={`${mode}-${activeItem.topic}`} className="legal-authority-intro" aria-live="polite">
          <span className="legal-authority-topic">{activeItem.topic.toUpperCase()} TOPIC</span>
          <h2 id="legal-authority-title">{heading}</h2>
          <span className="legal-authority-rule" aria-hidden="true" />
          <p>{getTopicIntro(mode, activeItem.topic)}</p>
        </aside>

        <div
          className={[
            'legal-authority-carousel',
            direction ? `is-moving-${direction}` : '',
            isPointerDown ? 'is-dragging' : '',
          ].filter(Boolean).join(' ')}
          style={{ '--legal-drag-offset': `${dragOffset}px` } as React.CSSProperties}
          aria-label={`${modeLabel} carousel`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
        >
          <button
            type="button"
            className="legal-authority-arrow legal-authority-arrow--previous"
            onMouseUp={(event) => {
              event.stopPropagation();
              navigate(-1);
            }}
            onClick={(event) => {
              if (event.detail === 0) navigate(-1);
            }}
            aria-label={`Show previous ${modeLabel.toLowerCase()} card`}
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          <LegalAuthorityPreviewCard
            item={previousItem}
            label="Previous"
            onHoverStart={() => scheduleHoverAdvance(-1)}
            onHoverEnd={clearHoverTimer}
            onSelect={() => navigate(-1)}
          />

          <LegalAuthorityActiveCard
            item={activeItem}
            index={activeIndex}
            mode={mode}
          />

          <LegalAuthorityPreviewCard
            item={nextItem}
            label="Next"
            onHoverStart={() => scheduleHoverAdvance(1)}
            onHoverEnd={clearHoverTimer}
            onSelect={() => navigate(1)}
          />

          <button
            type="button"
            className="legal-authority-arrow legal-authority-arrow--next"
            onMouseUp={(event) => {
              event.stopPropagation();
              navigate(1);
            }}
            onClick={(event) => {
              if (event.detail === 0) navigate(1);
            }}
            aria-label={`Show next ${modeLabel.toLowerCase()} card`}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className="legal-authority-pagination" aria-label={`${modeLabel} pagination`}>
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => {
                if (index === activeIndex) return;
                setDirection(index > activeIndex ? 'next' : 'previous');
                setActiveByMode((current) => ({ ...current, [mode]: index }));
                window.setTimeout(() => setDirection(null), 560);
              }}
              aria-label={`Show ${modeLabel.toLowerCase()} ${index + 1} of ${items.length}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const LegalAuthorityActiveCard = ({
  item,
  index,
  mode,
}: {
  item: LegalAuthorityItem;
  index: number;
  mode: LegalAuthorityMode;
}) => {
  const contentWeight = [
    item.title,
    item.citation ?? item.provision ?? '',
    item.syllabusDotPoint,
    item.summary,
    item.outcome ?? item.significance ?? '',
    item.evaluation,
  ].join(' ').length;
  const densityClass = contentWeight > 640 || item.title.length > 48 ? ' legal-authority-card--dense' : '';

  return (
    <article className={`legal-authority-card legal-authority-card--active${densityClass}`} aria-live="polite">
      <div className="legal-authority-spine" aria-hidden="true">
        <strong>{String(index + 1).padStart(2, '0')}</strong>
      </div>
      <div className="legal-authority-card-body">
        <span className="legal-authority-card-topic">{item.topic.toUpperCase()}</span>
        <h3>{item.title}</h3>
        <p className="legal-authority-citation">{item.citation ?? item.provision}</p>

        <LegalAuthoritySection title="Syllabus Dot Point" content={item.syllabusDotPoint} bullet />
        <LegalAuthoritySection title={mode === 'cases' ? 'Case Summary' : 'Legislation Summary'} content={item.summary} />
        <LegalAuthoritySection title={mode === 'cases' ? 'Outcome' : 'Significance'} content={item.outcome ?? item.significance ?? ''} />

        <div className="legal-authority-card-section">
          <h4>Evaluation</h4>
          <p>
            <strong>{item.evaluationTerm} in {item.evaluationCriterion.toLowerCase()}</strong>, {item.evaluation}
          </p>
        </div>
      </div>
    </article>
  );
};

const LegalAuthoritySection = ({ title, content, bullet = false }: { title: string; content: string; bullet?: boolean }) => (
  <div className="legal-authority-card-section">
    <h4>{title}</h4>
    <p className={bullet ? 'legal-authority-bullet' : undefined}>{content}</p>
  </div>
);

const LegalAuthorityPreviewCard = ({
  item,
  label,
  onHoverStart,
  onHoverEnd,
  onSelect,
}: {
  item: LegalAuthorityItem;
  label: 'Previous' | 'Next';
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onSelect: () => void;
}) => (
  <button
    type="button"
    className={`legal-authority-preview legal-authority-preview--${label.toLowerCase()}`}
    onMouseUp={(event) => {
      event.stopPropagation();
      onSelect();
    }}
    onClick={(event) => {
      if (event.detail === 0) onSelect();
    }}
    onPointerEnter={(event) => {
      if (event.pointerType !== 'touch') onHoverStart();
    }}
    onPointerLeave={onHoverEnd}
    onFocus={onHoverEnd}
    aria-label={`${label} card: ${item.title}`}
  >
    <span className="legal-authority-preview-topic">{item.topic.toUpperCase()}</span>
    <strong>{item.title}</strong>
    <span>{item.citation ?? item.provision}</span>
    <i aria-hidden="true" />
  </button>
);

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
      <LegalStudiesIntroVideoGate />
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

      <LegalAuthorityCarousel />

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

      <LegalCareerPathways />

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

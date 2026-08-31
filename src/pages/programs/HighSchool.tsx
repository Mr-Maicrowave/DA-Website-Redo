import { useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { CalendarCheck, ChartNoAxesColumnIncreasing, CheckCircle2, Mountain, Sprout, Star, Target, UserRound } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';
import { methodItems } from '@/components/programs/high-school-method-transition/methodTransitionData';
import './HighSchoolImmersive.css';

const ease = [0.22, 1, 0.36, 1] as const;
const outcomeIcons = [Sprout, Target, CalendarCheck, UserRound] as const;

const years = [
  { year: '07', title: 'Find your feet.', intro: 'A strong start to high school is about more than keeping up. It’s about building the foundations, habits and confidence students rely on for the years ahead.', outcomes: [{ title: 'Strengthen foundations', body: 'Rebuild understanding and close early gaps.' }, { title: 'Close early knowledge gaps', body: 'Address what was missed before it grows.' }, { title: 'Build reliable study routines', body: 'Create habits that lead to lasting progress.' }, { title: 'Gain confidence', body: 'Feel capable, prepared and ready for what’s next.' }], focuses: [{ title: 'Adjusting to high school', body: 'New subjects, new teachers, new expectations.' }, { title: 'Learning how to learn', body: 'Discovering what works best for them.' }, { title: 'Building good habits', body: 'Organisation, study routines and time management.' }, { title: 'Staying on track', body: 'Consistent effort today creates confidence tomorrow.' }] },
  { year: '08', title: 'Build your independence.', intro: 'Students begin taking greater responsibility for how they learn and organise themselves, with support that helps them become more capable and consistent.', outcomes: [{ title: 'Study with purpose', body: 'Move beyond simply completing the work.' }, { title: 'Organise effectively', body: 'Manage subjects, deadlines and priorities.' }, { title: 'Take greater ownership', body: 'Recognise what needs attention and act.' }, { title: 'Grow in confidence', body: 'Ask questions and approach challenges calmly.' }], focuses: [{ title: 'Managing workload', body: 'Balancing subjects and weekly commitments.' }, { title: 'Effective revision', body: 'Using time and practice more deliberately.' }, { title: 'Independent routines', body: 'Starting work without constant prompting.' }, { title: 'Strong foundations', body: 'Keeping early gaps from accumulating.' }] },
  { year: '09', title: 'Discover your strengths.', intro: 'As subject demands increase, students begin to see where their strengths, interests and challenges lie — turning uncertainty into genuine progress.', outcomes: [{ title: 'Identify strengths', body: 'Recognise where ability and interest meet.' }, { title: 'Target challenges', body: 'Focus support where it will matter most.' }, { title: 'Prepare for assessments', body: 'Plan, revise and respond with confidence.' }, { title: 'Explore pathways', body: 'Begin thinking clearly about future choices.' }], focuses: [{ title: 'Assessment skills', body: 'Preparing around each school’s requirements.' }, { title: 'Deeper understanding', body: 'Moving beyond memorising information.' }, { title: 'Consistent performance', body: 'Turning good work into reliable progress.' }, { title: 'Future direction', body: 'Connecting strengths with possible pathways.' }] },
  { year: '10', title: 'Choose your direction.', intro: 'Year 10 connects everything students have built with the senior years ahead, helping them strengthen weak areas and make informed choices.', outcomes: [{ title: 'Build HSC-ready skills', body: 'Prepare early for senior-school expectations.' }, { title: 'Address remaining gaps', body: 'Resolve weaknesses before Year 11 begins.' }, { title: 'Extend key strengths', body: 'Challenge students where they are ready.' }, { title: 'Choose with confidence', body: 'Make informed subject and pathway decisions.' }], focuses: [{ title: 'Senior preparation', body: 'Writing, problem solving and exam technique.' }, { title: 'Subject decisions', body: 'Understanding strengths and future demands.' }, { title: 'Independent study', body: 'Planning and revising with less prompting.' }, { title: 'A confident transition', body: 'Entering Year 11 prepared and focused.' }] },
] as const;

const startingPoints = [
  { name: 'Rebuild', copy: 'For students who have gaps, lost confidence or need stronger foundations.', outcomes: ['Identify what has been missed', 'Rebuild understanding step by step'], Icon: Mountain },
  { name: 'Progress', copy: 'For students who are doing okay — but could be doing much better with the right structure and support.', outcomes: ['Strengthen understanding and assessment performance', 'Build better study habits and consistency'], Icon: ChartNoAxesColumnIncreasing },
  { name: 'Extend', copy: 'For advanced students ready for greater depth, challenge and acceleration.', outcomes: ['Provide greater challenge and deeper thinking', 'Extension pathways for high-achieving students'], Icon: Star },
] as const;

const supportAreas = [
  { id: 'subjects', label: 'Subjects', title: 'Teaching becomes more specialised.', body: 'As students progress through high school, support becomes increasingly subject-specific — with clear guidance in English, Mathematics, Science and the skills each discipline demands.', points: ['English and analytical writing', 'Mathematics and problem solving', 'Science concepts and scientific reasoning'] },
  { id: 'assessments', label: 'Assessments', title: 'Prepared for what school asks of them.', body: 'We work around each school’s assessment requirements, helping students revise deliberately, understand marking expectations and perform under exam conditions.', points: ['School assessment preparation', 'Revision and exam technique', 'Structured, accurate responses'] },
  { id: 'habits', label: 'Study habits', title: 'A calmer way to manage the workload.', body: 'High school asks students to coordinate more subjects, more deadlines and more independent work. We make those demands manageable through practical routines.', points: ['Planning and organisation', 'Revision routines', 'Homework and time management'] },
  { id: 'independence', label: 'Independence', title: 'Support that gradually steps back.', body: 'Students learn to recognise weaknesses, ask better questions, review mistakes and take greater ownership of what happens next.', points: ['Identify what needs attention', 'Ask purposeful questions', 'Review and learn from mistakes'] },
  { id: 'hsc', label: 'HSC preparation', title: 'Senior-school thinking starts early.', body: 'Before Year 11, we begin developing the accuracy, structure, exam technique and independent revision habits that make senior study less overwhelming.', points: ['Structured responses', 'Accuracy and time management', 'Independent revision'] },
] as const;

function FixedLandscape() {
  return <div className="hs-film" aria-hidden="true"><video autoPlay muted loop playsInline preload="auto"><source src="/videos/high-school-landscape-loop.mp4" type="video/mp4" /></video><div className="hs-film__wash" /></div>;
}

function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } });
  return <section className="hs-immersive-hero" aria-labelledby="high-school-title"><motion.p {...enter(0.1)} className="hs-kicker">Years 7–10</motion.p><motion.h1 {...enter(0.2)} id="high-school-title">Find your feet.<br />Then find your direction.</motion.h1><motion.p {...enter(0.32)} className="hs-immersive-hero__intro">High school is where students begin discovering how they learn, what they’re capable of, and where they want to go.</motion.p><motion.a {...enter(0.45)} href="#year-journey" className="hs-scroll-cue">Explore the journey <span aria-hidden="true">↓</span></motion.a></section>;
}

function YearJourney() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const journeyRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: journeyRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', latest => {
    const nextYear = Math.min(years.length - 1, Math.floor(latest * years.length));
    setActive(nextYear);
  });
  const year = years[active];
  return <section ref={journeyRef} id="year-journey" className="hs-editorial-section hs-year-journey" aria-labelledby="year-journey-title"><div className="hs-year-journey__sticky"><div className="hs-year-journey__frame"><div className="hs-year-journey__media"><img src="/images/programs/highschool-hero-student.png" alt="A DA Tuition high-school student ready for class" /></div><div className="hs-year-journey__copy"><AnimatePresence mode="wait" initial={false}><motion.div key={year.year} initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease }}><p className="hs-section-label">High school · Year {year.year}</p><span className="hs-year-journey__number">{year.year}</span><h2 id="year-journey-title">{year.title}</h2><span className="hs-year-journey__title-rule" aria-hidden="true" /><p className="hs-year-journey__intro">{year.intro}</p><div className="hs-year-journey__outcomes">{year.outcomes.map((outcome, index) => { const Icon = outcomeIcons[index]; return <div key={outcome.title}><Icon aria-hidden="true" /><strong>{outcome.title}</strong><span>{outcome.body}</span></div>; })}</div><div className="hs-year-journey__focus"><p>What students focus on in Year {Number(year.year)}</p><div>{year.focuses.map(focus => <section key={focus.title}><CheckCircle2 aria-hidden="true" /><strong>{focus.title}</strong><span>{focus.body}</span></section>)}</div></div></motion.div></AnimatePresence></div></div><div className="hs-year-nav" role="group" aria-label="High-school year progress">{years.map((item, index) => <button key={item.year} type="button" className={active === index ? 'is-active' : ''} aria-pressed={active === index} onClick={() => setActive(index)}><span>{item.year}</span><i aria-hidden="true" /></button>)}</div></div></section>;
}

function StartingPoints() {
  return <section className="hs-editorial-section hs-starting" aria-labelledby="starting-title"><header><p className="hs-section-label">Different starting points</p><h2 id="starting-title">Every student arrives<br />somewhere different.</h2><p>So we don’t teach them as though they started in the same place.</p></header><div className="hs-starting__states">{startingPoints.map((item, index) => <article key={item.name}><div className="hs-starting__heading"><span className="hs-starting__icon"><item.Icon aria-hidden="true" /></span><div><span>0{index + 1}</span><h3>{item.name}</h3><i aria-hidden="true" /></div></div><p>{item.copy}</p><ul className="hs-starting__outcomes">{item.outcomes.map(outcome => <li key={outcome}><CheckCircle2 aria-hidden="true" />{outcome}</li>)}</ul></article>)}</div></section>;
}

function SupportHub() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const area = supportAreas[active];
  return <section className="hs-editorial-section hs-support" aria-labelledby="support-title"><header><p className="hs-section-label">High school support</p><h2 id="support-title">High school asks more of them.<br />So our teaching changes too.</h2></header><div className="hs-tabs" role="tablist" aria-label="High-school support areas">{supportAreas.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)}>{item.label}</button>)}</div><AnimatePresence mode="wait" initial={false}><motion.div key={area.id} className="hs-support__panel" role="tabpanel" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }}><h3>{area.title}</h3><p>{area.body}</p><ul>{area.points.map(point => <li key={point}>{point}</li>)}</ul></motion.div></AnimatePresence></section>;
}

function TeachingMethod() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const item = methodItems[active];
  return <section className="hs-editorial-section hs-method" aria-labelledby="method-title"><header><p className="hs-section-label">The DA teaching method</p><h2 id="method-title">A proven approach.<br />Personal to every student.</h2></header><div className="hs-method__layout"><nav aria-label="DA teaching method steps">{methodItems.map((step, index) => <button key={step.id} type="button" className={active === index ? 'is-active' : ''} aria-pressed={active === index} onClick={() => setActive(index)}><span>{step.number}</span>{step.label}</button>)}</nav><AnimatePresence mode="wait" initial={false}><motion.article key={item.id} style={{ '--method-accent': item.textAccent } as CSSProperties} initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.4, ease }}><div className="hs-method__heading"><p className="hs-method__step"><span>{item.number}</span></p><h3>{item.label}</h3><p className="hs-method__emotion">{item.emotionalSubheading}</p></div><div className="hs-method__introduction">{item.introduction.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><p className="hs-method__what-we-do">What we do</p><div className="hs-method__actions">{item.actions.map((action, index) => <div className="hs-method__action-row" key={action.title}><span className="hs-method__action-number">{index + 1}</span><div><strong>{action.title}</strong><span>{action.body}</span></div><em>{action.annotation}</em></div>)}</div></motion.article></AnimatePresence></div></section>;
}

export default function HighSchool() {
  return <div className="hs-immersive-page"><SEO title="High School Tutoring Years 7-10" description="Years 7-10 tutoring at DA Tuition builds the skills, habits, and confidence students need for senior school and beyond." canonicalUrl="/programs/high-school" /><FixedLandscape /><div className="hs-immersive-content"><NavigationNew /><main><Hero /><YearJourney /><StartingPoints /><SupportHub /><TeachingMethod /></main><footer className="hs-immersive-footer"><strong>DA <span>Tuition</span></strong><p>© 2025 DA Tuition · Sydney, Australia</p><p>hello@datuition.com.au</p></footer></div></div>;
}

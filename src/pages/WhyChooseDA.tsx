import { Link } from 'react-router-dom';
import {
  AlarmClock, ArrowRight, BarChart3, BookOpen, Brain, CheckCircle2, Eye, Flag,
  Gauge, Globe2, Heart, Lightbulb, MessageCircle, NotebookTabs, PencilLine,
  RotateCcw, Settings, ShieldCheck, Sparkles, Star, Target, Trophy,
  UserRound, UserRoundCheck, UsersRound,
} from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';
import WeKnowYouSection from '@/components/why-da/WeKnowYouSection';
import { useWhyDAMotion } from './useWhyDAMotion';
import './WhyChooseDA.css';

const personalPathLeft = [
  { title: 'Level', body: 'Right level of challenge', Icon: Gauge },
  { title: 'Pace', body: 'Right pace for progress', Icon: AlarmClock },
  { title: 'Materials', body: 'Right content for their level', Icon: BookOpen },
  { title: 'Learning plan', body: 'Structured yet flexible', Icon: NotebookTabs },
] as const;

const personalPathRight = [
  { title: 'Class format', body: 'Private / Small Group / Class / Advanced', Icon: UsersRound },
  { title: 'Tutor', body: 'Matched to their learning needs', Icon: UserRoundCheck },
  { title: 'Goals', body: 'Catch up / Improve / Excel', Icon: Settings },
  { title: 'Foundation → extension', body: 'From building basics to pushing potential', Icon: Sparkles },
] as const;

const proofPoints = [
  { value: '1500+', label: 'Students supported', Icon: UserRoundCheck, countTo: 1500, suffix: '+' },
  { value: '50+', label: 'Expert tutors', Icon: Globe2, countTo: 50, suffix: '+' },
  { value: 'Years 1–12', label: 'All subjects', Icon: Star, countTo: null, suffix: '' },
  { value: 'Personalised', label: 'For every learner', Icon: AlarmClock, countTo: null, suffix: '' },
] as const;

const proofPhotoLabels = ['Private support', 'Small-group learning', 'Working at the right level', 'Tutor connection'] as const;

const teachingCycle = [
  { title: 'UNDERSTAND', body: 'We explain clearly.', Icon: Lightbulb },
  { title: 'SEE IT', body: 'We work through examples.', Icon: Eye },
  { title: 'TRY IT', body: 'You have a go.', Icon: PencilLine },
  { title: 'TEST IT', body: 'We check understanding.', Icon: NotebookTabs },
  { title: 'CORRECT IT', body: 'We fix mistakes and fill gaps.', Icon: RotateCcw },
  { title: 'MASTER IT', body: 'You do it with confidence.', Icon: Star },
] as const;

const careValues = [
  { title: 'FEEL KNOWN', body: 'We build real relationships.', Icon: Heart },
  { title: 'FEEL SAFE', body: 'It’s okay to ask. We’re here to help.', Icon: ShieldCheck },
  { title: 'FEEL SUPPORTED', body: 'We notice, we guide, we never give up.', Icon: UsersRound },
  { title: 'FEEL CHALLENGED', body: 'For those ready to go further.', Icon: Sparkles },
  { title: 'FEEL PROUD', body: 'Progress is recognised and celebrated.', Icon: Trophy },
] as const;

const growthMilestones = [
  { year: 'YEAR 2', thought: 'I didn’t know how.' },
  { year: 'YEAR 4', thought: 'I’ll keep trying.' },
  { year: 'YEAR 7', thought: 'I think I understand.' },
  { year: 'YEAR 9', thought: 'I’m getting better.' },
  { year: 'YEAR 12', thought: 'I’ve got this.' },
] as const;

const growthQualities = [
  { label: 'Confidence', Icon: Sparkles }, { label: 'Curiosity', Icon: Brain },
  { label: 'Study habits', Icon: NotebookTabs }, { label: 'Independence', Icon: Flag },
  { label: 'Resilience', Icon: Heart }, { label: 'Tutor connection', Icon: UserRoundCheck },
] as const;

const achievementResults = [
  { title: 'CATCH UP SUCCESS', body: 'From falling behind to back on track.', result: '48% → 71%' },
  { title: 'IMPROVEMENT', body: 'Meaningful gains and stronger habits.', result: '67% → 84%' },
  { title: 'HIGH ACHIEVEMENT', body: 'Reaching goals and beyond.', result: 'Band 6' },
  { title: 'EXTENSION', body: 'Pushing potential further.', result: 'Top band', note: 'Advanced pathway' },
] as const;

const testimonials = [
  { quote: 'DA changed the way my daughter thinks about learning.', source: 'Parent' },
  { quote: 'More than a tutor. A mentor and a friend.', source: 'Year 12 Parent' },
  { quote: 'My confidence has grown so much since joining DA.', source: 'Year 10 Student' },
  { quote: 'The tutors explain things so clearly. I finally get it.', source: 'Year 8 Student' },
  { quote: '20+ years of helping students from Year 2 to Year 12 achieve their potential.', source: 'DA Tuition' },
] as const;

export default function WhyChooseDA() {
  const pageRef = useWhyDAMotion();

  return (
    <>
      <SEO
        title="Why DA? | Personalised Tutoring for Every Student"
        description="Discover how DA Tuition gets to know every learner and builds a personalised pathway around their strengths, needs and goals."
        canonicalUrl="/why-choose-da"
      />
      <NavigationNew heroMode />

      <main ref={pageRef} className="why-da-page">
        <section className="why-da-hero" data-testid="why-da-hero" aria-labelledby="why-da-title">
          <div className="why-da-hero__base" data-motion="hero-base" aria-hidden="true">
            <img src="/assets/why-da/hero-classroom.jpg" alt="" />
          </div>
          <div className="why-da-hero__background-slices" aria-hidden="true">
            <div className="why-da-hero__background-slice why-da-hero__background-slice--top" data-motion="hero-background-slice"><img src="/assets/why-da/hero-classroom.jpg" alt="" /></div>
            <div className="why-da-hero__background-slice why-da-hero__background-slice--middle" data-motion="hero-background-slice"><img src="/assets/why-da/hero-classroom.jpg" alt="" /></div>
            <div className="why-da-hero__background-slice why-da-hero__background-slice--bottom" data-motion="hero-background-slice"><img src="/assets/why-da/hero-classroom.jpg" alt="" /></div>
          </div>
          <div className="why-da-hero__tutor" data-testid="why-da-tutor-layer" aria-hidden="true">
            <img src="/assets/why-da/hero-classroom.jpg" alt="" />
          </div>
          <div className="why-da-hero__grade" data-motion="hero-grade" aria-hidden="true" />

          <div className="why-da-hero__copy" data-motion="hero-copy">
            <p className="why-da-hero__eyebrow" data-motion="hero-meta">WHY DA?</p>
            <h1 id="why-da-title">
              <span className="why-da-text-mask"><span data-motion="hero-line">NO TWO STUDENTS</span></span>
              <span className="why-da-text-mask"><span data-motion="hero-line">LEARN THE SAME.</span></span>
            </h1>
            <p className="why-da-hero__subheading" data-motion="hero-support">So why should they be taught the same way?</p>
          </div>

          <div className="why-da-hero__labels" aria-hidden="true">
            {['CONFIDENCE', 'PACE', 'ABILITY', 'GOALS'].map((label) => <span data-motion="hero-label" key={label}><i />{label}</span>)}
          </div>
          <p className="why-da-hero__statement" data-motion="hero-statement"><span>BEFORE WE TEACH,</span><strong>WE UNDERSTAND.</strong></p>
          <div className="why-da-hero__scroll" data-motion="hero-scroll" aria-hidden="true"><span>SCROLL TO UNDERSTAND</span><i /></div>
          <span className="why-da-hero__gold-line" aria-hidden="true" />
        </section>

        <WeKnowYouSection />

        <section id="why-da-personalise" className="why-da-personalise" data-testid="why-da-personalise" aria-labelledby="why-da-personalise-title">
          <div className="why-da-journey-thread" aria-hidden="true">
            <svg viewBox="0 0 1000 560" preserveAspectRatio="none">
              <path data-motion="journey-path" d="M90 0 C100 180 350 170 500 330" />
              <path data-motion="journey-path" d="M250 0 C260 190 390 205 500 330" />
              <path data-motion="journey-path" d="M410 0 C415 175 455 230 500 330" />
              <path data-motion="journey-path" d="M590 0 C585 175 545 230 500 330" />
              <path data-motion="journey-path" d="M750 0 C740 190 610 205 500 330" />
              <path data-motion="journey-path" d="M910 0 C900 180 650 170 500 330" />
            </svg>
          </div>
          <div className="why-da-personalise__intro">
            <div className="why-da-section-heading"><span>02</span><h2 id="why-da-personalise-title">WE PERSONALISE</h2></div>
            <p>We design a learning path that fits your child — not the other way around.</p>
          </div>
          <div className="why-da-path">
            <div className="why-da-path__list why-da-path__list--left">
              {personalPathLeft.map(({ title, body, Icon }) => (
                <article data-motion="path-item" data-path-title={title.toUpperCase()} key={title}><Icon aria-hidden="true" /><div><h3>{title}</h3><p>{body}</p></div></article>
              ))}
            </div>
            <div className="why-da-path__core">
              <div className="why-da-path__rings" data-motion="path-ring" aria-hidden="true" />
              <div className="why-da-path__disc" data-motion="path-centre"><Brain aria-hidden="true" /><span>YOUR CHILD&apos;S<br />PERSONALISED<br />PATH</span></div>
              {[1, 2, 3, 4, 5, 6].map((dot) => <i className={`why-da-path__dot why-da-path__dot--${dot}`} data-motion="path-node" aria-hidden="true" key={dot} />)}
            </div>
            <div className="why-da-path__list why-da-path__list--right">
              {personalPathRight.map(({ title, body, Icon }) => (
                <article data-motion="path-item" data-path-title={title.toUpperCase()} key={title}><Icon aria-hidden="true" /><div><h3>{title}</h3><p>{body}</p></div></article>
              ))}
            </div>
          </div>
        </section>

        <figure className="why-da-photo-strip" aria-label="Personalised tutoring in practice">
          {proofPhotoLabels.map((label, index) => (
            <div className={`why-da-photo-strip__panel why-da-photo-strip__panel--${index + 1}`} data-motion="proof-photo" key={label}>
              <picture>
                <source srcSet="/images/why-da-reference/why-da-tutoring-strip-v1.avif" type="image/avif" />
                <source srcSet="/images/why-da-reference/why-da-tutoring-strip-v1.webp" type="image/webp" />
                <img src="/images/why-da-reference/why-da-tutoring-strip-v1.png" alt="" loading="lazy" />
              </picture>
              <span>{label}</span>
            </div>
          ))}
        </figure>

        <section className="why-da-proof" data-testid="why-da-proof-band" aria-label="DA Tuition at a glance">
          {proofPoints.map(({ value, label, Icon, countTo, suffix }) => (
            <div className="why-da-proof__item" key={value}><Icon data-motion="proof-icon" aria-hidden="true" /><strong data-motion="proof-value" data-count-to={countTo ?? undefined} data-count-suffix={suffix}>{value}</strong><span>{label}</span></div>
          ))}
          <span className="why-da-continuation-thread" data-motion="continuation-thread" aria-hidden="true" />
        </section>

        <section className="why-da-teach" data-testid="why-da-teach" aria-labelledby="why-da-teach-title">
          <header className="why-da-chapter-heading" data-motion="chapter-heading">
            <div className="why-da-section-heading"><span>03</span><h2 id="why-da-teach-title">WE TEACH</h2></div>
            <p>A proven learning cycle that turns understanding into mastery.</p>
          </header>
          <ol className="why-da-cycle" aria-label="DA teaching cycle">
            {teachingCycle.map(({ title, body, Icon }, index) => (
              <li data-motion="teach-step" key={title}>
                <div className="why-da-cycle__icon"><Icon aria-hidden="true" /></div>
                <strong>{title}</strong><span>{body}</span>
                {index < teachingCycle.length - 1 && <ArrowRight className="why-da-cycle__arrow" aria-hidden="true" />}
              </li>
            ))}
          </ol>
          <div className="why-da-teach__practice">
            <figure data-motion="teach-photo"><img src="/images/why-da-reference/why-da-teach-classroom-v1.jpg" alt="Students applying what they have learned in a focused tutoring class" loading="lazy" decoding="async" /></figure>
            <article className="why-da-lesson-board" data-motion="lesson-board" aria-label="Example from a maths lesson">
              <span>Example from a lesson</span><p>Solve for x:</p>
              <div className="why-da-equation"><span>3x + 7 = 22</span><span>3x = 15</span><span>x = <strong>5</strong></span></div>
              <footer>MASTERED <CheckCircle2 aria-hidden="true" /></footer>
            </article>
          </div>
        </section>

        <section className="why-da-care" data-testid="why-da-care" aria-labelledby="why-da-care-title">
          <img className="why-da-care__image" src="/images/why-da-reference/why-da-care-v1.jpg" alt="A student feeling supported by two DA tutors" loading="lazy" decoding="async" />
          <div className="why-da-care__veil" aria-hidden="true" />
          <header className="why-da-care__heading" data-motion="chapter-heading">
            <div className="why-da-section-heading"><span>04</span><h2 id="why-da-care-title">WE CARE</h2></div>
            <p>Because students learn best when they feel safe, supported and encouraged.</p>
          </header>
          <div className="why-da-care__values">
            {careValues.map(({ title, body, Icon }) => <article data-motion="care-value" key={title}><Icon aria-hidden="true" /><strong>{title}</strong><p>{body}</p></article>)}
          </div>
          <p className="why-da-care__promise"><Heart aria-hidden="true" /> Great teaching matters. So does wanting to come back next week.</p>
        </section>

        <section className="why-da-connected" data-testid="why-da-connected" aria-labelledby="why-da-connected-title">
          <header className="why-da-chapter-heading" data-motion="chapter-heading">
            <div className="why-da-section-heading"><span>05</span><h2 id="why-da-connected-title">WE STAY CONNECTED</h2></div>
            <p>You’ll always know how your child is progressing.</p>
          </header>
          <div className="why-da-connected__dashboard">
            <article data-motion="connection-panel" className="why-da-report">
              <small>LESSON REPORT · 14 May</small><h3>Fractions &amp; Percentages</h3><strong>8 / 10</strong>
              <ul><li>Percentage increase</li><li>Fraction conversion</li></ul>
              <h4>WORKING ON</h4><p>Accuracy under time pressure.</p><h4>NEXT LESSON</h4><p>Re-test converting and moving forward.</p>
            </article>
            <article data-motion="connection-panel" className="why-da-progress">
              <small>PROGRESS OVER TIME</small>
              <div className="why-da-chart" aria-label="Progress increased from 62 to 84 percent"><svg viewBox="0 0 320 140" role="img"><title>Student progress from February to June</title><path d="M18 112 L82 96 L145 77 L210 58 L286 31" /><g><circle cx="18" cy="112" r="5"/><circle cx="82" cy="96" r="5"/><circle cx="145" cy="77" r="5"/><circle cx="210" cy="58" r="5"/><circle cx="286" cy="31" r="5"/></g></svg><div><span>62%</span><span>67%</span><span>71%</span><span>78%</span><span>84%</span></div></div>
              <dl><div><dt>Confidence</dt><dd>↑</dd></div><div><dt>Mistakes</dt><dd>↓</dd></div><div><dt>Independence</dt><dd>↑</dd></div></dl>
            </article>
            <article data-motion="connection-panel" className="why-da-messages">
              <small>PARENT COMMUNICATION</small>
              <div><span>Parent <time>10:24 am</time></span><p>She’s still struggling with algebra at school.</p></div>
              <div><span>DA <time>10:30 am</time></span><p>Thanks for letting us know. We’ll adjust next week’s lesson and focus on algebra basics.</p><Heart aria-hidden="true" /></div>
            </article>
          </div>
          <div className="why-da-connected__features" aria-label="How DA keeps families connected">
            <span><NotebookTabs aria-hidden="true" />Lesson reports<br />every session</span><span><BarChart3 aria-hidden="true" />Real-time<br />progress tracking</span><span><Target aria-hidden="true" />Strengths &amp; gaps<br />clearly identified</span><span><MessageCircle aria-hidden="true" />Responsive support<br />when it matters</span>
          </div>
        </section>

        <section className="why-da-grow" data-testid="why-da-grow" aria-labelledby="why-da-grow-title">
          <header className="why-da-chapter-heading" data-motion="chapter-heading">
            <div className="why-da-section-heading"><span>06</span><h2 id="why-da-grow-title">WE GROW</h2></div>
            <p>We build more than marks. We build skills for life.</p>
          </header>
          <div className="why-da-growth-line" aria-hidden="true"><span /></div>
          <div className="why-da-growth-milestones">
            {growthMilestones.map(({ year, thought }, index) => (
              <article data-motion="growth-milestone" key={year}>
                <strong>{year}</strong><i aria-hidden="true" />
                <div className={`why-da-growth-photo why-da-growth-photo--${index + 1}`}><img src="/images/why-da-reference/why-da-growth-v1.jpg" alt="" loading="lazy" decoding="async" /></div>
                <p>{thought}</p>
              </article>
            ))}
          </div>
          <div className="why-da-growth-qualities" aria-label="Skills students build at DA">
            {growthQualities.map(({ label, Icon }) => <span data-motion="growth-quality" key={label}><Icon aria-hidden="true" />{label}</span>)}
          </div>
        </section>

        <section className="why-da-achieve" data-testid="why-da-achieve" aria-labelledby="why-da-achieve-title">
          <div className="why-da-achieve__glow" aria-hidden="true" />
          <header className="why-da-achieve__heading" data-motion="chapter-heading">
            <div className="why-da-section-heading"><span>07</span><h2 id="why-da-achieve-title">WE ACHIEVE</h2></div>
            <p>Success looks different for every student.</p>
          </header>
          <div className="why-da-results">
            {achievementResults.map((achievement) => <article data-motion="result-card" key={achievement.title}><small>{achievement.title}</small><p>{achievement.body}</p><strong>{achievement.result}</strong>{'note' in achievement && <span>{achievement.note}</span>}</article>)}
          </div>
          <div className="why-da-transformations">
            <h3>Real transformations. Real impact.</h3>
            <div className="why-da-testimonials">
              {testimonials.map(({ quote, source }, index) => <blockquote data-motion="testimonial" className={index < 2 ? 'why-da-testimonial--large' : ''} key={quote}><div aria-label="5 out of 5 stars">★★★★★</div><p>“{quote}”</p><cite>— {source}</cite></blockquote>)}
            </div>
          </div>
        </section>

        <section className="why-da-closing" data-testid="why-da-closing-cta" aria-labelledby="why-da-closing-title">
          <img src="/images/why-da-reference/why-da-reception-v1.jpg" alt="The welcoming DA Tuition reception" loading="lazy" decoding="async" />
          <div className="why-da-closing__veil" aria-hidden="true" />
          <div className="why-da-closing__content" data-motion="closing-cta">
            <h2 id="why-da-closing-title">Whatever your child’s<br />starting point,</h2>
            <p>let’s work out what comes next.</p>
            <Link to="/book-interview">BOOK A CONSULTATION <ArrowRight aria-hidden="true" /></Link>
            <Link to="/programs" className="why-da-closing__secondary">EXPLORE LEARNING OPTIONS <ArrowRight aria-hidden="true" /></Link>
            <small>We’re here to help.</small>
          </div>
        </section>
      </main>
    </>
  );
}

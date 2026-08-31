import { Brain, Flag, Heart, NotebookTabs, Sparkles, UserRoundCheck } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import PageJourney from '@/components/page-journey/PageJourney';
import SEO from '@/components/SEO';
import WeKnowYouSection from '@/components/why-da/WeKnowYouSection';
import PersonaliseFilmSection from '@/components/why-da/PersonaliseFilmSection';
import WeCareFilmSection from '@/components/why-da/WeCareFilmSection';
import WeSucceedSection from '@/components/why-da/WeSucceedSection';
import { useWhyDAMotion } from './useWhyDAMotion';
import './WhyChooseDA.css';

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

const WHY_DA_JOURNEY_SECTIONS = [
  { id: 'why-da-introduction', label: 'Introduction', description: 'No two students learn alike' },
  { id: 'why-da-know-you', label: 'We know you', description: 'Understand the learner' },
  { id: 'why-da-personalise', label: 'We personalise', description: 'Build the right pathway' },
  { id: 'why-da-care', label: 'We care', description: 'Support that lasts' },
  { id: 'why-da-succeed', label: 'We succeed', description: 'Progress with purpose' },
  { id: 'why-da-grow', label: 'We grow', description: 'Skills for life' },
  { id: 'why-da-achieve', label: 'We achieve', description: 'Success looks different' },
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
        <section id="why-da-introduction" className="why-da-hero" data-testid="why-da-hero" aria-labelledby="why-da-title">
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

        <PersonaliseFilmSection />

        <WeCareFilmSection />

        <WeSucceedSection />

        <section id="why-da-grow" className="why-da-grow" data-testid="why-da-grow" aria-labelledby="why-da-grow-title">
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

        <section id="why-da-achieve" className="why-da-achieve" data-testid="why-da-achieve" aria-labelledby="why-da-achieve-title">
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

      </main>
      <PageJourney pageLabel="Why DA" sections={WHY_DA_JOURNEY_SECTIONS} />
      <FooterNew />
    </>
  );
}

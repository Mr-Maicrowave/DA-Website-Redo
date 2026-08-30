import { ArrowDownRight, Heart, MapPin, MessageCircle, Sparkles, Target } from 'lucide-react';

const observations = [
  {
    id: 'starting-point',
    number: '01',
    question: 'WHERE ARE THEY NOW?',
    label: 'Starting point',
    body: 'We identify their current level, academic gaps and learning habits to understand the real starting point.',
    image: '/images/why-da-reference/observations/starting-point.png',
    alt: 'An older DA Tuition student looking to the side while working through mathematics at her desk',
    Icon: MapPin,
  },
  {
    id: 'confidence',
    number: '02',
    question: 'DO THEY HAVE THE CONFIDENCE TO TRY?',
    label: 'Confidence',
    body: 'We notice how they respond when something feels difficult — whether they ask, attempt, hesitate or hold back.',
    image: '/images/why-da-reference/observations/confidence.png',
    alt: 'A young DA Tuition student raising her hand confidently during a classroom lesson',
    Icon: Heart,
  },
  {
    id: 'strengths-challenges',
    number: '03',
    question: "WHAT COMES NATURALLY — AND WHAT DOESN'T?",
    label: 'Strengths + challenges',
    body: 'We look for strengths to build on, gaps that may be holding them back, and the habits shaping how they learn.',
    image: '/images/why-da-reference/observations/strengths-challenges.png',
    alt: 'A DA Tuition student concentrating as he writes answers on his worksheet',
    Icon: Sparkles,
  },
  {
    id: 'goals',
    number: '04',
    question: 'WHAT ARE THEY WORKING TOWARDS?',
    label: 'Goals',
    body: 'Catch up. Build confidence. Improve. Move ahead. Aim higher. The destination helps shape the path.',
    image: '/images/why-da-reference/observations/goals.png',
    alt: 'Two DA Tuition students sitting together with their learning materials',
    Icon: Target,
  },
] as const;

export default function WeKnowYouSection() {
  return (
    <section id="why-da-know-you" className="why-da-know" data-testid="why-da-know-you" aria-labelledby="why-da-know-title">
      <header className="why-da-know__intro" data-motion="know-intro">
        <div className="why-da-know__chapter">
          <span className="why-da-number-mask"><span data-motion="know-number">01</span></span>
          <span aria-hidden="true" />
          <h2 id="why-da-know-title" data-motion="know-title">WE KNOW YOU</h2>
        </div>
        <div className="why-da-know__intro-grid">
          <h3><span data-motion="know-headline">A STUDENT IS MORE<br />THAN THE MARK ON<br />THEIR PAPER.</span></h3>
          <p data-motion="know-copy">Before we decide how to teach, we take the time to truly understand who your child is, where they are now, and where they want to go.</p>
        </div>
      </header>

      <div className="why-da-observations" data-motion="know-film" aria-label="What DA Tuition learns about each student">
        <span className="why-da-observations__line" aria-hidden="true" />
        <span className="why-da-observations__pulse" data-motion="know-timeline-point" aria-hidden="true" />
        <span className="why-da-observations__light" aria-hidden="true" />
        {observations.map(({ id, number, question, label, body, image, alt, Icon }) => (
          <article className={`why-da-observation why-da-observation--${id}`} data-motion="know-observation" key={id}>
            <div className="why-da-observation__journey" aria-hidden="true">
              <span>{number}</span>
              <i><Icon /></i>
            </div>
            <div className="why-da-observation__copy" data-motion="know-row-copy">
              <h3>{question}</h3>
              <p className="why-da-observation__label">{label}</p>
              <p>{body}</p>
            </div>
            <figure className="why-da-observation__photo" data-motion="know-photo">
              <img data-motion="know-image" src={image} alt={alt} loading={number === '01' ? 'eager' : 'lazy'} decoding="async" />
            </figure>
          </article>
        ))}
      </div>

      <div className="why-da-parent" data-motion="know-parent">
        <div className="why-da-parent__quote">
          <span>Illustrative parent concern</span>
          <blockquote>“She’s capable, but she’s starting to lose confidence.”</blockquote>
        </div>
        <div className="why-da-parent__copy">
          <div className="why-da-parent__icon" aria-hidden="true"><MessageCircle /></div>
          <p className="why-da-parent__eyeline">AND WHAT ARE YOU SEEING</p>
          <div className="why-da-parent__title-mask" data-motion="know-parent-title-mask"><h3 data-motion="know-parent-title">AT HOME?</h3></div>
          <p className="why-da-parent__aside">Your perspective matters.</p>
          <p>You know your child best. What you’re seeing at home gives us another part of the picture.</p>
          <p>We listen to your concerns, understand what you’re noticing, and use that perspective when deciding what support comes next.</p>
        </div>
      </div>

      <footer className="why-da-know__closing">
        <div data-motion="know-closing">
          <h3>WE LISTEN FIRST.</h3>
          <span className="why-da-know__listen-line" data-motion="know-listen-line" aria-hidden="true" />
          <p>Because understanding the student changes how we teach them.</p>
        </div>
        <a href="#why-da-personalise" aria-label="Continue to section 02, We Personalise">
          <span><small>NEXT</small><strong>02</strong></span>
          <span><b>WE PERSONALISE</b><small>Now that we know them,<br />we build around them.</small></span>
          <i aria-hidden="true"><ArrowDownRight /></i>
        </a>
      </footer>
    </section>
  );
}

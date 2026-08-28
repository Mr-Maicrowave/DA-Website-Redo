import { AFTER_CONSULTATION, CONSULTATION_STEPS, DURING_CONSULTATION } from './config.ts';
import './consultation-content.css';

const assetRoot = '/images/interview-consultation';

const howIcons = ['how-listen.png', 'how-understand.png', 'how-recommend.png', 'how-match.png', 'how-begin.png'];
const duringIcons = ['during-listen.png', 'during-student.png', 'during-clarify.png', 'during-pathway.png', 'during-direction.png'];
const afterIcons = ['after-recommend.png', 'after-match.png', 'after-begin.png', 'after-observe.png', 'after-adjust.png'];

function Arrow({ direction = 'horizontal' }: { direction?: 'horizontal' | 'vertical' }) {
  return <span className={`consultation-arrow consultation-arrow--${direction}`} aria-hidden="true">→</span>;
}

function HowCard() {
  return <section className="consultation-card consultation-how-card" aria-labelledby="consultation-how-title">
    <h2 id="consultation-how-title">How the consultation <span>works</span></h2>
    <div className="consultation-how-steps" aria-label="Consultation journey">
      {CONSULTATION_STEPS.map((item, index) => <div className="consultation-how-step-wrap" key={item.key}>
        <article className="consultation-how-step">
          <div className="consultation-icon-shell consultation-icon-shell--gold">
            <img src={`${assetRoot}/${howIcons[index]}`} alt="" width="128" height="128" loading="lazy" />
          </div>
          <p className="consultation-number">{String(index + 1).padStart(2, '0')}</p>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
        {index < CONSULTATION_STEPS.length - 1 ? <Arrow /> : null}
      </div>)}
    </div>
  </section>;
}

function DuringCard() {
  return <section className="consultation-card consultation-during-card" aria-labelledby="consultation-during-title">
    <h2 id="consultation-during-title">What happens <strong>DURING</strong> the consultation?</h2>
    <div className="consultation-during-steps">
      {DURING_CONSULTATION.map((item, index) => <article key={item.title}>
        <div className="consultation-timeline-icon">
          <img src={`${assetRoot}/${duringIcons[index]}`} alt="" width="96" height="96" loading="lazy" />
        </div>
        <div><h3>{item.title}</h3><p>{item.description}</p></div>
        {index < DURING_CONSULTATION.length - 1 ? <Arrow direction="vertical" /> : null}
      </article>)}
    </div>
    <img className="consultation-botanical" src={`${assetRoot}/botanical-corner.png`} alt="" width="420" height="420" loading="lazy" />
  </section>;
}

function AfterCard() {
  return <section className="consultation-card consultation-after-card" aria-labelledby="consultation-after-title">
    <h2 id="consultation-after-title">What happens <strong>AFTER</strong> the consultation?</h2>
    <div className="consultation-after-steps">
      {AFTER_CONSULTATION.map((item, index) => <div className="consultation-after-step-wrap" key={item.key}>
        <article>
          <div className="consultation-icon-shell consultation-icon-shell--blue">
            <img src={`${assetRoot}/${afterIcons[index]}`} alt="" width="112" height="112" loading="lazy" />
          </div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
        {index < AFTER_CONSULTATION.length - 1 ? <Arrow /> : null}
      </div>)}
    </div>
    <aside className="consultation-reassurance">
      <h3><span aria-hidden="true">♡</span> You don’t need to arrive with the answer.</h3>
      <ul>
        <li>You don’t need to know whether your child needs private tuition, a class, foundation work or extension.</li>
        <li>You don’t need to know exactly why their marks have changed.</li>
        <li>You don’t need to diagnose every weakness before speaking with us.</li>
      </ul>
    </aside>
    <p className="consultation-hand-note">That’s what the conversation is for. ♡</p>
  </section>;
}

export function ConsultationContent() {
  return <div className="interview-consultation-content">
    <HowCard />
    <div className="consultation-lower-grid">
      <DuringCard />
      <AfterCard />
    </div>
  </div>;
}

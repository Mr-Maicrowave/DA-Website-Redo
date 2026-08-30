import { Target, TrendingUp, UserRound, UsersRound } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { mathsClassOptions } from './mathsClassOptions';
import './maths-class-showcase.css';

const iconByOption = { private: UserRound, group: UsersRound, focus: Target, selective: TrendingUp } as const;

export function MathsClassShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = mathsClassOptions[activeIndex];

  return (
    <section id="maths-class-options" className="maths-classes">
      <span className="maths-classes-dots maths-classes-dots--tl" aria-hidden="true" />
      <span className="maths-classes-dots maths-classes-dots--br" aria-hidden="true" />
      <span className="maths-classes-star maths-classes-star--1" aria-hidden="true">✦</span>
      <span className="maths-classes-star maths-classes-star--2" aria-hidden="true">✦</span>
      <div className="maths-classes__inner maths-class-showcase-shell">
        <div>
          <p className="maths-class-showcase-kicker">Our Classes</p>
          <h2 className="maths-class-showcase-heading">Find the right maths class<br />for <span>your goals</span></h2>
          <div className="maths-class-choice-list" role="tablist" aria-label="Mathematics class styles">
            {mathsClassOptions.map((option, index) => {
              const Icon = iconByOption[option.icon];
              const isActive = index === activeIndex;
              return (
                <button key={option.title} type="button" role="tab" aria-selected={isActive} aria-controls="maths-class-detail" className={`maths-class-choice${isActive ? ' is-active' : ''}`} onClick={() => setActiveIndex(index)} style={{ '--tone': option.tone, '--tone-soft': option.softTone } as CSSProperties}>
                  <span className="maths-class-choice-icon" aria-hidden="true"><Icon /></span>
                  <span><span className="maths-class-choice-title">{option.title}</span><span className="maths-class-choice-short">{option.short}</span></span>
                  <span className="maths-class-choice-arrow" aria-hidden="true">›</span>
                </button>
              );
            })}
          </div>
        </div>

        <article id="maths-class-detail" className="maths-class-detail-card" role="tabpanel" aria-live="polite" style={{ '--active-tone': active.tone, '--active-image': `url(${active.image})` } as CSSProperties}>
          <div className="maths-class-detail-content" key={active.title}>
            <div className="maths-class-detail-media"><img src={active.image} alt={active.alt} /></div>
            <div className="maths-class-detail-copy">
              <h3>{active.title}</h3>
              <div className="maths-class-detail-rule" aria-hidden="true" />
              <p>{active.description}</p>
              <div className="maths-class-detail-stats">
                {active.stats.map(([label, value]) => <div key={label}><strong>{label}</strong><span>{value}</span></div>)}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

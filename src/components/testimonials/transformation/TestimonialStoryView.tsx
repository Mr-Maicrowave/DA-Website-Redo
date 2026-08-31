import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Heart, Sparkles } from 'lucide-react';
import type { Testimonial } from '../../../data/testimonials';
import { getTestimonialPresentation } from './presentation';
import { testimonialAssetRegistry } from './assets';
import type { ImpactMoment, TestimonialAssetKey } from './types';
import './TestimonialStoryView.css';

const TestimonialAsset = ({ assetKey, className = '' }: { assetKey: TestimonialAssetKey; className?: string }) => {
  const asset = testimonialAssetRegistry[assetKey];
  return <img className={`ts-asset ${className}`} src={asset.src} width={asset.width} height={asset.height} alt="" loading="lazy" decoding="async" />;
};

const ImpactItem = ({ impact, active = false }: { impact: ImpactMoment; active?: boolean }) => (
  <article className={`ts-impact ${active ? 'is-active' : ''}`} style={{ '--impact-accent': impact.accent } as CSSProperties}>
    <span className="ts-impact__icon"><TestimonialAsset assetKey={impact.assetKey} /></span>
    <div><strong>{impact.label}</strong><p>{impact.statement}</p></div>
  </article>
);

type Props = {
  testimonial: Testimonial;
  index: number;
  total: number;
  previous: Testimonial;
  next: Testimonial;
};

export default function TestimonialStoryView({ testimonial, index, total, previous, next }: Props) {
  const presentation = useMemo(() => getTestimonialPresentation(testimonial, index), [testimonial, index]);
  const [activePhase, setActivePhase] = useState(presentation.phases[0]?.id ?? '');
  const phaseRefs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    setActivePhase(presentation.phases[0]?.id ?? '');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActivePhase((visible.target as HTMLElement).dataset.phaseId ?? '');
    }, { rootMargin: '-20% 0px -55%', threshold: [0.15, 0.45, 0.7] });
    phaseRefs.current.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [presentation]);

  const activeImpactIndexes = presentation.phases.find((phase) => phase.id === activePhase)?.impactIndexes ?? [];
  const style = {
    '--ts-primary': presentation.palette.primary,
    '--ts-secondary': presentation.palette.secondary,
    '--ts-soft': presentation.palette.soft,
    '--ts-glow': presentation.palette.glow,
  } as CSSProperties;

  return (
    <article className="ts-story" style={style}>
      <header className="ts-intro">
        <div className="ts-intro__copy">
          <p className="ts-kicker">Real stories. Real growth.</p>
          <h1>{testimonial.title}</h1>
          <p className="ts-subtitle">{testimonial.subtitle}</p>
          <div className="ts-tags">{presentation.heroTags.map((tag) => <span key={tag}><Heart aria-hidden="true" />{tag}</span>)}</div>
        </div>
        <div className="ts-intro__art" aria-hidden="true"><TestimonialAsset assetKey={presentation.phases[0]?.assetKey ?? 'journey'} /></div>
        <div className="ts-progress"><span>{testimonial.type.replace('-', ' ')}</span><strong>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</strong></div>
      </header>

      <div className="ts-layout">
        <main className="ts-narrative">
          {presentation.phases.map((phase, phaseIndex) => {
            const quote = testimonial.pullQuotes[phaseIndex % Math.max(1, testimonial.pullQuotes.length)];
            const achievements = presentation.achievements.filter((achievement) => phase.paragraphIndexes.includes(achievement.sourceParagraphIndex));
            return (
              <section key={phase.id} className="ts-phase" data-phase-id={phase.id} ref={(node) => { if (node) phaseRefs.current.set(phase.id, node); else phaseRefs.current.delete(phase.id); }}>
                <div className="ts-phase__marker"><span>{String(phaseIndex + 1).padStart(2, '0')}</span></div>
                <h2>{phase.label}</h2>
                {phase.paragraphIndexes.map((paragraphIndex) => <p key={paragraphIndex}>{testimonial.bodyParagraphs[paragraphIndex]}</p>)}
                {quote && phaseIndex < testimonial.pullQuotes.length && <blockquote><span>“</span>{quote.text}</blockquote>}
                {achievements.map((achievement) => (
                  <aside key={achievement.id} className="ts-achievement" style={{ '--achievement-accent': achievement.accent } as CSSProperties}>
                    <TestimonialAsset assetKey={achievement.assetKey} />
                    <div><p>{achievement.context}</p><strong>{achievement.displayValue}</strong></div>
                  </aside>
                ))}
                <div className="ts-mobile-impacts">{phase.impactIndexes.map((impactIndex) => <ImpactItem key={presentation.impacts[impactIndex].id} impact={presentation.impacts[impactIndex]} />)}</div>
              </section>
            );
          })}
          {testimonial.bottomQuote && <footer className="ts-ending"><Sparkles aria-hidden="true" /><blockquote>{testimonial.bottomQuote}</blockquote><strong>{testimonial.bottomAuthor}</strong></footer>}
        </main>

        <aside className="ts-rail" aria-label="The impact DA made">
          <h2><Sparkles aria-hidden="true" /> The impact DA made <Sparkles aria-hidden="true" /></h2>
          <div className="ts-rail__scroll">{presentation.impacts.map((impact, impactIndex) => <ImpactItem key={impact.id} impact={impact} active={activeImpactIndexes.includes(impactIndex)} />)}</div>
          <p className="ts-rail__message">DA is not just about marks. It is about lasting confidence, discipline and belief.</p>
        </aside>
      </div>

      <nav className="ts-navigation" aria-label="Browse testimonials">
        <Link to={`/testimonials/${previous.slug}`}><ArrowLeft aria-hidden="true" /><span>Previous story<small>{previous.author}</small></span></Link>
        <strong>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</strong>
        <Link to={`/testimonials/${next.slug}`}><span>Next story<small>{next.author}</small></span><ArrowRight aria-hidden="true" /></Link>
      </nav>
    </article>
  );
}


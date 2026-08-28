import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { classFormats } from './hscLearningFormatsData';
import './HSCLearningFormatsExplorer.css';

export default function HSCLearningFormatsExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const activeFormat = classFormats[activeIndex];
  const previousIndex = (activeIndex - 1 + classFormats.length) % classFormats.length;
  const nextIndex = (activeIndex + 1) % classFormats.length;

  const selectFormat = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setIsFlipped(false);
    setActiveIndex(index);
  };
  const previous = () => selectFormat(previousIndex);
  const next = () => selectFormat(nextIndex);

  return (
    <section
      className="hsc-explorer"
      aria-labelledby="hsc-explorer-title"
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') previous();
        if (event.key === 'ArrowRight') next();
      }}
    >
      <aside className="hsc-explorer-selector">
        <p className="hsc-explorer-eyebrow">EXPLORE OUR FOUR<br />WAYS TO LEARN</p>
        <span className="hsc-explorer-gold-rule" aria-hidden="true" />
        <h2 id="hsc-explorer-title">Different students <br />need different <br />kinds of support.</h2>
        <p className="hsc-explorer-deck">Explore each option to see what<br />it looks like and who it’s for.</p>
        <div className="hsc-explorer-tabs" role="list" aria-label="Learning formats">
          {classFormats.map((format, index) => (
            <button key={format.id} type="button" className="hsc-explorer-tab" aria-current={index === activeIndex ? 'true' : undefined} onClick={() => selectFormat(index)}>
              <span>{format.number}</span><span><b>{format.title}</b><small>{format.navDescription}</small></span>
            </button>
          ))}
        </div>
        <p className="hsc-explorer-hint"><img src="/media/hsc/editorial/explorer/explorer-instruction-accent.png" alt="" />Click a class or use<br />the arrows to explore<br />each option.</p>
      </aside>

      <div className="hsc-explorer-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            className="hsc-explorer-panel"
            key={activeFormat.id}
            initial={{ opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : direction * -14 }}
            transition={{ duration: reduceMotion ? 0 : .42, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="hsc-explorer-panel-head"><span>{activeFormat.number}</span><div><h3>{activeFormat.title}</h3><p>{activeFormat.tagline}</p></div></header>
            <div className={`hsc-explorer-flip${isFlipped ? ' is-flipped' : ''}`}>
              <button type="button" className="hsc-explorer-face hsc-explorer-face--front" aria-pressed={isFlipped} aria-label={`Show parent questions for ${activeFormat.title}`} onClick={() => setIsFlipped(true)}>
                <img src={activeFormat.image} alt={activeFormat.imageAlt} />
                <span>Questions<br />parents ask ↗</span>
              </button>
              <section className="hsc-explorer-face hsc-explorer-face--back" aria-hidden={!isFlipped}>
                <header><h3>A LITTLE MORE REASSURANCE</h3><p>The things parents often ask us.</p></header>
                <div className="hsc-explorer-faqs">{activeFormat.parentQuestions.map(item => <article key={item.question}><img src={item.icon} alt="" /><div><h4>{item.question}</h4><p>{item.answer}</p></div></article>)}</div>
                <button type="button" onClick={() => setIsFlipped(false)} aria-label={`Return to ${activeFormat.title} photo`}>← Back to {activeFormat.title}</button>
              </section>
            </div>
            <div className="hsc-explorer-attributes">{activeFormat.attributes.map(item => <article key={item.title}><img src={item.icon} alt="" /><div><h4>{item.title}</h4><p>{item.description}</p></div></article>)}</div>
            <div className="hsc-explorer-details">
              <section><h4>BEST FOR</h4><ul>{activeFormat.bestFor.map(item => <li key={item}>✓ <span>{item}</span></li>)}</ul></section>
              <section><h4>HOW IT WORKS</h4><div className="hsc-explorer-process">{activeFormat.process.map((item, index) => <article key={item.title}><img src={item.icon} alt="" /><b>{item.title}</b><p>{item.description}</p>{index < activeFormat.process.length - 1 && <i aria-hidden="true">→</i>}</article>)}</div></section>
            </div>
            <nav className="hsc-explorer-nav" aria-label="Browse learning formats">
              <button type="button" onClick={previous} aria-label={`Previous: ${classFormats[previousIndex].title}`}>← <span>PREVIOUS<small>{classFormats[previousIndex].title}</small></span></button>
              <p><b>{activeFormat.number}</b> / 04 <span>{classFormats.map((format, index) => <i key={format.id} className={index === activeIndex ? 'is-active' : ''} />)}</span></p>
              <button type="button" onClick={next} aria-label={`Next: ${classFormats[nextIndex].title}`}><span>NEXT CLASS<small>{classFormats[nextIndex].title}</small></span> →</button>
            </nav>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}

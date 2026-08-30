import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PencilLine, School, Star, UserRound, UsersRound } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { programChoices } from './referenceStoryData';
import { selectProgram, type ProgramId } from './programSelection';

const programIcons = {
  'private-tuition': UserRound,
  'small-group': UsersRound,
  classes: School,
  'creative-writing': PencilLine,
  'advanced-enrichment': Star,
} as const;

const ProgramBag = () => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramId>('private-tuition');
  const [direction, setDirection] = useState(1);
  const reducedMotion = useReducedMotion();
  const selectedIndex = programChoices.findIndex((program) => program.id === selectedProgram);
  const program = programChoices[selectedIndex];

  const chooseProgram = (nextProgram: ProgramId) => {
    const nextIndex = programChoices.findIndex((choice) => choice.id === nextProgram);
    setDirection(nextIndex >= selectedIndex ? 1 : -1);
    setSelectedProgram((currentProgram) => selectProgram(currentProgram, nextProgram));
  };

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: .62, ease: [0.22, 1, 0.36, 1] as const };

  const moveSelection = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const lastIndex = programChoices.length - 1;
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? lastIndex
        : (selectedIndex + (event.key === 'ArrowRight' ? 1 : -1) + programChoices.length) % programChoices.length;
    const nextProgram = programChoices[nextIndex];
    chooseProgram(nextProgram.id);
    document.getElementById(`program-tab-${nextProgram.id}`)?.focus();
  };

  return (
    <section id="programs" className="primary-program-bag" aria-labelledby="programs-title" data-primary-reference-section="programs">
      <header className="primary-program-bag__intro">
        <p className="primary-program-bag__chapter">FIND THEIR RIGHT FIT</p>
        <h2 id="programs-title">The right learning environment changes everything.</h2>
        <p className="primary-program-bag__lead">
          Different children need different kinds of support.<br />
          One goal — helping your child thrive.
        </p>
      </header>

      <div className="primary-program-bag__photo-stage" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.img
            key={program.id}
            className="primary-program-bag__photo"
            src={program.photo}
            alt={program.alt}
            loading="lazy"
            decoding="async"
            custom={direction}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025, x: direction * 18 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: .975, x: direction * -14 }}
            transition={transition}
          />
        </AnimatePresence>
      </div>

      <div className="primary-program-bag__details">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={program.id}
            id="primary-program-panel"
            role="tabpanel"
            aria-labelledby={`program-tab-${program.id}`}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: .42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="primary-program-bag__detail-heading">
              {(() => {
                const Icon = programIcons[program.id];
                return <Icon aria-hidden="true" />;
              })()}
              <h3>{program.title}</h3>
            </div>
            <p>{program.description}</p>
            <p className="primary-program-bag__best-for"><strong>BEST FOR</strong>{program.bestFor}</p>
            <a className="primary-program-bag__learn-more" href="#contact">Learn more <span aria-hidden="true">→</span></a>
          </motion.div>
        </AnimatePresence>
        <button className="primary-program-bag__finder" type="button">
          Not sure which one? <span aria-hidden="true">↗</span>
        </button>
      </div>

      <div className="primary-program-bag__controls" role="tablist" aria-label="Choose a primary learning environment" onKeyDown={moveSelection}>
        {programChoices.map((choice) => {
          const isSelected = selectedProgram === choice.id;
          const Icon = programIcons[choice.id];

          return (
            <button
              key={choice.id}
              id={`program-tab-${choice.id}`}
              className="primary-program-bag__control"
              type="button"
              role="tab"
              aria-controls="primary-program-panel"
              aria-selected={isSelected}
              aria-pressed={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => chooseProgram(choice.id)}
            >
              {isSelected ? (
                <motion.span
                  className="primary-program-bag__active-indicator"
                  layoutId="primary-program-active-indicator"
                  transition={reducedMotion ? { duration: 0 } : { duration: .48, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                />
              ) : null}
              <Icon aria-hidden="true" />
              <span>{choice.shortTitle}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ProgramBag;

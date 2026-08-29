import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, GraduationCap, Quote } from 'lucide-react';
import { hscStories, type HSCStory } from './hscStories';
import './HSCSuccessStories.css';

type StoryFilter = 'all' | 'students' | 'English' | 'Mathematics' | 'Science';

const filterLabels: Array<{ id: StoryFilter; label: string }> = [
  { id: 'all', label: 'ALL STORIES' },
  { id: 'students', label: 'STUDENTS' },
  { id: 'English', label: 'ENGLISH' },
  { id: 'Mathematics', label: 'MATHEMATICS' },
  { id: 'Science', label: 'SCIENCE' },
];

function matchesFilter(story: HSCStory, filter: StoryFilter) {
  return filter === 'all' || filter === 'students' || story.subject.includes(filter);
}

function StorySideCard({ story, side }: { story: HSCStory; side: 'left' | 'right' }) {
  return (
    <motion.article
      className={`hsc-stories__side hsc-stories__side--${side}`}
      key={story.id}
      initial={{ opacity: 0, x: side === 'left' ? -35 : 35, rotate: side === 'left' ? -4 : 4 }}
      animate={{ opacity: .72, x: 0, rotate: side === 'left' ? -3 : 3 }}
      transition={{ duration: .72, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    >
      <Quote />
      <p>“{story.quote}”</p>
      <strong>{story.name}</strong>
      <small>{story.year} · {story.subject.split(',')[0]}</small>
      {story.result && <b>{story.result}</b>}
    </motion.article>
  );
}

export default function HSCSuccessStories() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<StoryFilter>('all');
  const [index, setIndex] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const stories = useMemo(() => hscStories.filter((story) => matchesFilter(story, filter)), [filter]);
  const active = stories[index] ?? stories[0];
  const previous = stories[(index - 1 + stories.length) % stories.length];
  const next = stories[(index + 1) % stories.length];

  const move = (direction: number) => setIndex((current) => (current + direction + stories.length) % stories.length);
  const selectFilter = (nextFilter: StoryFilter) => {
    setFilter(nextFilter);
    setIndex(0);
  };

  if (!active) return null;

  return (
    <section className="hsc-stories" aria-labelledby="hsc-stories-title">
      <img className="hsc-stories__plane" src="/media/hsc/testimonials/paper-plane-flight.png" alt="" aria-hidden="true" />
      <header className="hsc-stories__header">
        <p>THE HSC, IN THEIR WORDS</p>
        <h2 id="hsc-stories-title">Real stories. <em>Real results.</em></h2>
        <span>Different students. Different journeys.<br />The right support can change what happens next.</span>
      </header>

      <div className="hsc-stories__filters" role="group" aria-label="Filter HSC stories">
        {filterLabels.map((item) => {
          const count = item.id === 'students' ? hscStories.length : hscStories.filter((story) => matchesFilter(story, item.id)).length;
          return (
            <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => selectFilter(item.id)}>
              {item.label}<small>{count}</small>
            </button>
          );
        })}
      </div>

      <div
        className="hsc-stories__carousel"
        tabIndex={0}
        aria-label="HSC success stories carousel"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') move(-1);
          if (event.key === 'ArrowRight') move(1);
        }}
        onPointerDown={(event) => { pointerStart.current = event.clientX; }}
        onPointerUp={(event) => {
          if (pointerStart.current === null) return;
          const distance = event.clientX - pointerStart.current;
          if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
          pointerStart.current = null;
        }}
      >
        <button className="hsc-stories__arrow hsc-stories__arrow--left" type="button" aria-label="Previous story" onClick={() => move(-1)}><ChevronLeft /></button>
        <StorySideCard story={previous} side="left" />

        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            className="hsc-stories__featured"
            key={active.id}
            initial={{ opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : 45, scale: reduceMotion ? 1 : .94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : -45, scale: reduceMotion ? 1 : .94 }}
            transition={{ duration: reduceMotion ? .1 : .72, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hsc-stories__identity">
              <span>{active.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
              <p>VERIFIED HSC STORY</p>
              {active.result && <strong>{active.result}</strong>}
            </div>
            <div className="hsc-stories__quote">
              <Quote aria-hidden="true" />
              <blockquote>“{active.quote}”</blockquote>
              <p><strong>{active.name}</strong><span>{active.year}</span><span>{active.subject}</span></p>
              {(active.startingPoint || active.whatChanged || active.outcome) && (
                <div className="hsc-stories__journey">
                  {active.startingPoint && <section><b>STARTING POINT</b><p>{active.startingPoint}</p></section>}
                  {active.whatChanged && <i aria-hidden="true">→</i>}
                  {active.whatChanged && <section><b>WHAT CHANGED</b><p>{active.whatChanged}</p></section>}
                  {active.outcome && <i aria-hidden="true">→</i>}
                  {active.outcome && <section><b>OUTCOME</b><p>{active.outcome}</p></section>}
                </div>
              )}
            </div>
          </motion.article>
        </AnimatePresence>

        <StorySideCard story={next} side="right" />
        <button className="hsc-stories__arrow hsc-stories__arrow--right" type="button" aria-label="Next story" onClick={() => move(1)}><ChevronRight /></button>
      </div>

      <div className="hsc-stories__progress" aria-live="polite">
        <b>{String(index + 1).padStart(2, '0')}</b>
        <span><i style={{ width: `${((index + 1) / stories.length) * 100}%` }} /></span>
        <small>/ {stories.length}</small>
      </div>

      <div className="hsc-stories__proof" aria-label="Why families trust these stories">
        <span><GraduationCap />Real students<br />Real results</span>
        <span><Quote />Verified<br />experiences</span>
        <span><GraduationCap />Different subjects<br />Different starts</span>
      </div>

      <nav className="hsc-stories__rail" aria-label="Choose a success story">
        {stories.map((story, storyIndex) => (
          <button
            type="button"
            key={story.id}
            aria-label={`Read ${story.name}'s story`}
            aria-current={storyIndex === index ? 'true' : undefined}
            onClick={() => setIndex(storyIndex)}
          >
            <span>{story.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
            <small>{story.subject.split(',')[0]}</small>
          </button>
        ))}
      </nav>

      <footer className="hsc-stories__cta">
        <p>Still wondering what support would suit them?</p>
        <h2>Let’s plan their best HSC yet.</h2>
        <Link to="/book-interview">BOOK A CONSULTATION <span aria-hidden="true">→</span></Link>
      </footer>
    </section>
  );
}

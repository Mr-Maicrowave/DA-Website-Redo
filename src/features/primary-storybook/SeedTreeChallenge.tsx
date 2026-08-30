import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { createChallenge, createInitialLearningState, createLocalRecentQuestionStore, reduceLearningState, type LearningState } from './primaryChallengeEngine';
import type { PrimaryQuestion, PrimarySubject, PrimaryYear } from './primaryQuestionBank';
import SeedTreeTeachingPanel from './SeedTreeTeachingPanel';
import './seed-tree-challenge.css';

const growthAssets = ['/primary-reference/seed-tree/seed.png', '/primary-reference/seed-tree/germinating-seed.png', '/primary-reference/seed-tree/sprout.png', '/primary-reference/seed-tree/young-plant.png', '/primary-reference/seed-tree/sapling.png', '/primary-reference/seed-tree/mature-tree.png'] as const;
const encouragements = ['Great thinking!', 'Exactly!', 'You’ve got it!', 'Brilliant work!'];

const SeedTreeChallenge = () => {
  const [year, setYear] = useState<PrimaryYear>();
  const [subject, setSubject] = useState<PrimarySubject>();
  const [questions, setQuestions] = useState<PrimaryQuestion[]>([]);
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [learning, setLearning] = useState<LearningState>(createInitialLearningState);
  const [isGrowing, setIsGrowing] = useState(false);
  const timerRef = useRef<number>();
  const question = questions[questionIndex];
  const complete = started && correctCount === 6;
  const growthStage = Math.min(correctCount, 5);

  const advanceJourney = useCallback(() => {
    window.clearTimeout(timerRef.current);
    if (correctCount >= 6) return;
    const nextCount = correctCount + 1;
    setCorrectCount(nextCount);
    setIsGrowing(false);
    if (nextCount < 6) {
      setQuestionIndex((current) => current + 1);
      setLearning(createInitialLearningState());
    }
  }, [correctCount]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);
  useEffect(() => {
    if (!question || correctCount >= 6 || !['correct', 'ready-to-grow'].includes(learning.mode)) return;
    setIsGrowing(true);
    timerRef.current = window.setTimeout(advanceJourney, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 120 : 1100);
    return () => window.clearTimeout(timerRef.current);
  }, [advanceJourney, learning.mode, question, correctCount]);

  const startJourney = (nextYear = year, nextSubject = subject) => {
    if (!nextYear || !nextSubject) return;
    window.clearTimeout(timerRef.current);
    setYear(nextYear);
    setSubject(nextSubject);
    setQuestions(createChallenge({ year: nextYear, subject: nextSubject, store: createLocalRecentQuestionStore() }));
    setStarted(true);
    setQuestionIndex(0);
    setCorrectCount(0);
    setLearning(createInitialLearningState());
    setIsGrowing(false);
  };

  const resetJourney = (nextYear?: PrimaryYear, nextSubject?: PrimarySubject) => {
    window.clearTimeout(timerRef.current);
    setYear(nextYear);
    setSubject(nextSubject);
    setQuestions([]);
    setStarted(false);
    setQuestionIndex(0);
    setCorrectCount(0);
    setLearning(createInitialLearningState());
    setIsGrowing(false);
    if (nextYear && nextSubject) window.setTimeout(() => startJourney(nextYear, nextSubject), 0);
  };

  const answerQuestion = (answer: string) => {
    if (!question || learning.mode !== 'question') return;
    setLearning((current) => reduceLearningState(current, { type: 'answer', answer, question }));
  };
  const inTeachingMode = ['teaching', 'follow-up', 'follow-up-support', 'ready-to-grow'].includes(learning.mode);
  const positiveFeedback = encouragements[questionIndex % encouragements.length];

  return (
    <section id="primary-seed-challenge" className={`seed-tree-challenge seed-tree-challenge--stage-${growthStage}${isGrowing ? ' is-growing' : ''}${complete ? ' is-complete' : ''}${inTeachingMode ? ' is-teaching' : ''}`} style={{ '--growth-stage': growthStage } as CSSProperties} aria-labelledby="seed-tree-title">
      <div className="seed-tree-challenge__sun" aria-hidden="true" />
      <div className="seed-tree-challenge__garden" aria-label={`Plant growth: stage ${growthStage + 1} of 6`}>
        <div className="seed-tree-challenge__doodles" aria-hidden="true"><span>{subject === 'english' ? 'Aa' : '2 + 3'}</span><span>✦</span><span>{subject === 'english' ? '“ ”' : '△ ○'}</span></div>
        <div className="seed-tree-challenge__plant-stage" aria-hidden="true">
          {growthAssets.map((src, index) => <img key={src} src={src} alt="" className={index === growthStage ? 'is-current' : index < growthStage ? 'is-grown' : ''} loading="lazy" decoding="async" />)}
        </div>
        <div className="seed-tree-challenge__ground" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <p className="seed-tree-challenge__garden-caption">Understanding grows one step at a time.</p>
      </div>

      <div className="seed-tree-challenge__experience">
        {!started ? (
          <div className="seed-tree-challenge__intro">
            <p className="seed-tree-challenge__eyebrow">A little learning challenge</p>
            <h2 id="seed-tree-title">Grow your knowledge</h2>
            <p className="seed-tree-challenge__lead">Every new idea helps something grow.</p>
            <p>Choose your year and subject. If something feels tricky, we’ll work through it together.</p>
            <fieldset><legend>Year</legend><div className="seed-tree-challenge__choices seed-tree-challenge__choices--years">{([1, 2, 3, 4, 5, 6] as PrimaryYear[]).map((option) => <button key={option} type="button" aria-pressed={year === option} onClick={() => setYear(option)}>{option}</button>)}</div></fieldset>
            <fieldset><legend>Subject</legend><div className="seed-tree-challenge__choices">{(['maths', 'english'] as PrimarySubject[]).map((option) => <button key={option} type="button" aria-pressed={subject === option} onClick={() => setSubject(option)}>{option}</button>)}</div></fieldset>
            <button className="seed-tree-challenge__start" type="button" disabled={!year || !subject} onClick={() => startJourney()}>Start growing <span aria-hidden="true">→</span></button>
          </div>
        ) : complete && year && subject ? (
          <div className="seed-tree-challenge__complete" aria-live="polite">
            <p className="seed-tree-challenge__eyebrow">Look what you grew!</p>
            <h2 id="seed-tree-title">You completed the<br /><strong>Year {year} {subject} challenge</strong></h2>
            <p>You kept thinking, learned from each attempt, and grew your understanding.</p>
            <div className="seed-tree-challenge__complete-actions"><button type="button" onClick={() => resetJourney(year, subject === 'maths' ? 'english' : 'maths')}>Try {subject === 'maths' ? 'English' : 'Maths'}</button><button type="button" onClick={() => resetJourney()}>Try another year</button></div>
            <a href="#support-journey-title">Continue exploring Primary <span aria-hidden="true">→</span></a>
          </div>
        ) : question && year && subject ? (
          <div className={`seed-tree-challenge__game seed-tree-challenge__game--${learning.mode}`}>
            <div className="seed-tree-challenge__meta"><p>Year {year} <span>•</span> {subject} <span>•</span> {question.topic}</p><p>Question {questionIndex + 1} of 6</p></div>
            <div className="seed-tree-challenge__progress" aria-label={`${correctCount} of 6 questions completed`}>{questions.map((item, index) => <i key={item.id} className={index < correctCount ? 'is-complete' : index === questionIndex ? 'is-current' : ''} />)}</div>
            <div className="seed-tree-challenge__paper">
              {inTeachingMode ? <><p className="seed-tree-challenge__question seed-tree-challenge__question--compact">{question.question}</p><SeedTreeTeachingPanel question={question} state={learning} onNextStep={() => setLearning((current) => reduceLearningState(current, { type: 'show-next-step', question }))} onBeginFollowUp={() => setLearning((current) => reduceLearningState(current, { type: 'begin-follow-up', question }))} onFollowUpAnswer={(answer) => setLearning((current) => reduceLearningState(current, { type: 'answer-follow-up', answer, question }))} /></> : <><p className="seed-tree-challenge__question">{question.question}</p><div className="seed-tree-challenge__answers">{question.options.map((option) => <button key={option} type="button" disabled={learning.mode !== 'question'} className={learning.selectedAnswer === option ? 'is-correct' : ''} onClick={() => answerQuestion(option)}><span>{option}</span>{learning.selectedAnswer === option ? <b aria-hidden="true">✓</b> : null}</button>)}</div><div className="seed-tree-challenge__feedback" aria-live="polite">{learning.mode === 'correct' ? <><strong>{positiveFeedback}</strong><p>{question.explanation.steps.at(-1)}</p><button className="seed-tree-challenge__continue" type="button" onClick={advanceJourney}>Continue growing <span aria-hidden="true">→</span></button></> : <span>Choose the answer that fits best.</span>}</div></>}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default SeedTreeChallenge;

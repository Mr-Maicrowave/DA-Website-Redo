import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { getChallengeQuestions, type PrimarySubject, type PrimaryYear } from './primaryQuestionBank';
import './seed-tree-challenge.css';

const growthAssets = [
  '/primary-reference/seed-tree/seed.png',
  '/primary-reference/seed-tree/germinating-seed.png',
  '/primary-reference/seed-tree/sprout.png',
  '/primary-reference/seed-tree/young-plant.png',
  '/primary-reference/seed-tree/sapling.png',
  '/primary-reference/seed-tree/mature-tree.png',
] as const;

const encouragements = ['That’s it!', 'Great thinking!', 'You found it!', 'Brilliant work!'];

const SeedTreeChallenge = () => {
  const [year, setYear] = useState<PrimaryYear>();
  const [subject, setSubject] = useState<PrimarySubject>();
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [feedback, setFeedback] = useState('');
  const [isGrowing, setIsGrowing] = useState(false);
  const timerRef = useRef<number>();

  const questions = useMemo(
    () => year && subject ? getChallengeQuestions(year, subject) : [],
    [year, subject],
  );
  const question = questions[questionIndex];
  const complete = started && correctCount === 6;
  const growthStage = Math.min(correctCount, 5);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const resetJourney = (nextYear?: PrimaryYear, nextSubject?: PrimarySubject) => {
    window.clearTimeout(timerRef.current);
    setYear(nextYear);
    setSubject(nextSubject);
    setStarted(Boolean(nextYear && nextSubject));
    setQuestionIndex(0);
    setCorrectCount(0);
    setAttempts(0);
    setSelectedAnswer(undefined);
    setFeedback('');
    setIsGrowing(false);
  };

  const answerQuestion = (answer: string) => {
    if (!question || selectedAnswer === question.correctAnswer) return;
    setSelectedAnswer(answer);
    if (answer !== question.correctAnswer) {
      setAttempts((current) => current + 1);
      setFeedback(attempts === 0 ? 'Almost! Try once more.' : 'Good try — have another look.');
      return;
    }

    const nextCount = correctCount + 1;
    setFeedback(encouragements[questionIndex % encouragements.length]);
    setIsGrowing(true);
    timerRef.current = window.setTimeout(() => {
      setCorrectCount(nextCount);
      setIsGrowing(false);
      if (nextCount < 6) {
        setQuestionIndex((current) => current + 1);
        setAttempts(0);
        setSelectedAnswer(undefined);
        setFeedback('');
      }
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : 1050);
  };

  return (
    <section
      id="primary-seed-challenge"
      className={`seed-tree-challenge seed-tree-challenge--stage-${growthStage}${isGrowing ? ' is-growing' : ''}${complete ? ' is-complete' : ''}`}
      style={{ '--growth-stage': growthStage } as CSSProperties}
      aria-labelledby="seed-tree-title"
    >
      <div className="seed-tree-challenge__sun" aria-hidden="true" />
      <div className="seed-tree-challenge__garden" aria-label={`Plant growth: stage ${growthStage + 1} of 6`}>
        <div className="seed-tree-challenge__doodles" aria-hidden="true">
          <span>{subject === 'english' ? 'Aa' : '2 + 3'}</span><span>✦</span><span>{subject === 'english' ? '“ ”' : '△ ○'}</span>
        </div>
        <div className="seed-tree-challenge__plant-stage" aria-hidden="true">
          {growthAssets.map((src, index) => (
            <img
              key={src}
              src={src}
              alt=""
              className={index === growthStage ? 'is-current' : index < growthStage ? 'is-grown' : ''}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
        <div className="seed-tree-challenge__ground" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <p className="seed-tree-challenge__garden-caption">Great thinking grows one step at a time.</p>
      </div>

      <div className="seed-tree-challenge__experience">
        {!started ? (
          <div className="seed-tree-challenge__intro">
            <p className="seed-tree-challenge__eyebrow">A little learning challenge</p>
            <h2 id="seed-tree-title">Grow your knowledge</h2>
            <p className="seed-tree-challenge__lead">Every answer helps something grow.</p>
            <p>Choose your year and subject, then help your seed grow one question at a time.</p>

            <fieldset>
              <legend>Year</legend>
              <div className="seed-tree-challenge__choices seed-tree-challenge__choices--years">
                {([1, 2, 3, 4, 5, 6] as PrimaryYear[]).map((option) => (
                  <button key={option} type="button" aria-pressed={year === option} onClick={() => setYear(option)}>{option}</button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Subject</legend>
              <div className="seed-tree-challenge__choices">
                {(['maths', 'english'] as PrimarySubject[]).map((option) => (
                  <button key={option} type="button" aria-pressed={subject === option} onClick={() => setSubject(option)}>{option}</button>
                ))}
              </div>
            </fieldset>
            <button className="seed-tree-challenge__start" type="button" disabled={!year || !subject} onClick={() => setStarted(true)}>
              Start growing <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : complete && year && subject ? (
          <div className="seed-tree-challenge__complete" aria-live="polite">
            <p className="seed-tree-challenge__eyebrow">Look what you grew!</p>
            <h2 id="seed-tree-title">You completed the<br /><strong>Year {year} {subject} challenge</strong></h2>
            <p>Great thinking grows one step at a time.</p>
            <div className="seed-tree-challenge__complete-actions">
              <button type="button" onClick={() => resetJourney(year, subject === 'maths' ? 'english' : 'maths')}>Try {subject === 'maths' ? 'English' : 'Maths'}</button>
              <button type="button" onClick={() => resetJourney()}>Try another year</button>
            </div>
            <a href="#support-journey-title">Continue exploring Primary <span aria-hidden="true">→</span></a>
          </div>
        ) : question && year && subject ? (
          <div className={`seed-tree-challenge__game${selectedAnswer === question.correctAnswer ? ' is-correct' : ''}`}>
            <div className="seed-tree-challenge__meta">
              <p>Year {year} <span>•</span> {subject}</p>
              <p>Question {questionIndex + 1} of 6</p>
            </div>
            <div className="seed-tree-challenge__progress" aria-label={`${correctCount} of 6 questions completed`}>
              {questions.map((item, index) => <i key={item.id} className={index < correctCount ? 'is-complete' : index === questionIndex ? 'is-current' : ''} />)}
            </div>
            <div className="seed-tree-challenge__paper">
              <p className="seed-tree-challenge__question">{question.question}</p>
              <div className="seed-tree-challenge__answers">
                {question.options.map((option) => {
                  const correct = option === question.correctAnswer && selectedAnswer === option;
                  const tried = selectedAnswer === option && !correct;
                  return (
                    <button key={option} type="button" className={`${correct ? 'is-correct' : ''}${tried ? ' is-tried' : ''}`} onClick={() => answerQuestion(option)}>
                      <span>{option}</span>{correct ? <b aria-hidden="true">✓</b> : null}
                    </button>
                  );
                })}
              </div>
              <div className="seed-tree-challenge__feedback" aria-live="polite">
                {feedback ? <strong>{feedback}</strong> : <span>Choose the answer that fits best.</span>}
                {attempts >= 2 && selectedAnswer !== question.correctAnswer ? <p><b>Hint 🌱</b> {question.hint}</p> : null}
                {selectedAnswer === question.correctAnswer ? <p>{question.explanation}</p> : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default SeedTreeChallenge;

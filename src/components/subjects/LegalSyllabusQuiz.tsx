import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, Gavel, RotateCcw, X } from 'lucide-react';
import {
  LEGAL_QUIZ_LENGTH,
  legalQuizBanks,
  LegalQuizQuestion,
  LegalQuizYear,
} from '@/data/legalSyllabusQuiz';

type QuizAnswer = {
  questionId: string;
  selected: string;
  isCorrect: boolean;
};

const yearMeta: Record<
  LegalQuizYear,
  {
    title: string;
    description: string;
    Icon: typeof BookOpen;
  }
> = {
  year11: {
    title: 'Year 11',
    description: 'The Legal System, The Individual and the Law, and The Law in Practice.',
    Icon: BookOpen,
  },
  year12: {
    title: 'Year 12',
    description: 'Human Rights and Crime, the two HSC core topics, in one combined practice run.',
    Icon: Gavel,
  },
};

const normaliseAnswer = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// Standard edit-distance calculation, used to forgive small typos (missing/extra
// letter, a dropped plural "s", a swapped character) in typed answers.
const levenshteinDistance = (a: string, b: string) => {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const distances: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) distances[i][0] = i;
  for (let j = 0; j < cols; j += 1) distances[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      if (a[i - 1] === b[j - 1]) {
        distances[i][j] = distances[i - 1][j - 1];
      } else {
        distances[i][j] = 1 + Math.min(
          distances[i - 1][j], // deletion
          distances[i][j - 1], // insertion
          distances[i - 1][j - 1], // substitution
        );
      }
    }
  }

  return distances[a.length][b.length];
};

// Accepts near-miss spelling: allows roughly one typo per 6 characters
// (minimum of 1), so close spellings mark correct without accepting
// genuinely different answers.
const isCloseEnough = (candidate: string, target: string) => {
  if (candidate === target) return true;
  if (!candidate || !target) return false;

  const tolerance = Math.max(1, Math.floor(Math.max(candidate.length, target.length) * 0.18));
  return levenshteinDistance(candidate, target) <= tolerance;
};

const isAnswerCorrect = (question: LegalQuizQuestion, value: string) => {
  const answers = question.acceptedAnswers?.length ? question.acceptedAnswers : [question.answer];
  const normalisedValue = normaliseAnswer(value);

  return answers.some((answer) => isCloseEnough(normaliseAnswer(answer), normalisedValue));
};

const getHintValue = (answer: string) => answer.trim().match(/[a-z0-9]/i)?.[0] ?? '';

const shuffle = <T,>(items: T[]) => {
  const output = [...items];

  for (let index = output.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [output[index], output[randomIndex]] = [output[randomIndex], output[index]];
  }

  return output;
};

const buildQuestionSet = (year: LegalQuizYear) => {
  const bank = legalQuizBanks[year];
  const multipleChoice = shuffle(bank.filter((question) => question.type === 'multiple-choice')).slice(0, 10);
  const fillBlank = shuffle(bank.filter((question) => question.type === 'fill-blank')).slice(0, 5);
  const shortAnswer = shuffle(bank.filter((question) => question.type === 'short-answer')).slice(0, 5);
  const selectedQuestions = [...multipleChoice, ...fillBlank, ...shortAnswer];

  if (selectedQuestions.length < LEGAL_QUIZ_LENGTH) {
    const selectedIds = new Set(selectedQuestions.map((question) => question.id));
    selectedQuestions.push(
      ...shuffle(bank.filter((question) => !selectedIds.has(question.id))).slice(
        0,
        LEGAL_QUIZ_LENGTH - selectedQuestions.length,
      ),
    );
  }

  return shuffle(selectedQuestions).slice(0, LEGAL_QUIZ_LENGTH);
};

const LegalSyllabusQuiz = () => {
  const [selectedYear, setSelectedYear] = useState<LegalQuizYear | null>(null);
  const [questions, setQuestions] = useState<LegalQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentResult = currentQuestion
    ? answers.find((answer) => answer.questionId === currentQuestion.id)
    : undefined;
  const correctCount = answers.filter((answer) => answer.isCorrect).length;
  const wrongCount = answers.filter((answer) => !answer.isCorrect).length;
  const isComplete = questions.length > 0 && currentIndex >= questions.length;
  const progressValue = isComplete
    ? 100
    : questions.length
      ? Math.round(((currentIndex + (isSubmitted ? 1 : 0)) / questions.length) * 100)
      : 0;
  const isTypedQuestion = currentQuestion?.type === 'fill-blank' || currentQuestion?.type === 'short-answer';
  const yearLabel = selectedYear ? yearMeta[selectedYear].title : 'Practice quiz';
  const resultIsStrong = correctCount >= 15;
  const resultHeading = resultIsStrong ? 'Syllabus strength recognised' : `${yearLabel} review`;
  const resultMessage = resultIsStrong
    ? 'Excellent work. You are recalling the syllabus with confidence, which is exactly what strong Legal Studies responses are built on.'
    : 'Keep going. A few focused attempts will sharpen your recall and make the syllabus feel much easier to use in exam responses.';

  const questionOptions = useMemo(() => {
    if (!currentQuestion?.options) return [];
    return shuffle(currentQuestion.options);
  }, [currentQuestion]);

  const startQuiz = (year: LegalQuizYear) => {
    setSelectedYear(year);
    setQuestions(buildQuestionSet(year));
    setCurrentIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
    setIsSubmitted(false);
  };

  const resetToYears = () => {
    setSelectedYear(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
    setIsSubmitted(false);
  };

  const submitAnswer = (value: string) => {
    if (!currentQuestion || isSubmitted) return;

    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    const isCorrect = isAnswerCorrect(currentQuestion, trimmedValue);
    setAnswers((current) => [
      ...current,
      {
        questionId: currentQuestion.id,
        selected: trimmedValue,
        isCorrect,
      },
    ]);
    setCurrentAnswer(trimmedValue);
    setIsSubmitted(true);
  };

  const goToNextQuestion = () => {
    setCurrentIndex((current) => current + 1);
    setCurrentAnswer('');
    setIsSubmitted(false);
  };

  const retryQuiz = () => {
    if (!selectedYear) return;
    startQuiz(selectedYear);
  };

  return (
    <section id="legal-topics" className="legal-quiz-section" aria-labelledby="legal-quiz-title">
      <div className="legal-quiz-inner">
        <div className="legal-quiz-ornament" aria-hidden="true">
          <span />
          <i>✦</i>
          <span />
        </div>

        {!selectedYear && (
          <>
            <div className="legal-quiz-heading">
              <h2 id="legal-quiz-title">How well do you know the syllabus?</h2>
              <p>Take this Practice quiz</p>
            </div>

            <div className="legal-quiz-topic-grid">
              {(Object.keys(yearMeta) as LegalQuizYear[]).map((year) => {
                const { Icon, title, description } = yearMeta[year];

                return (
                  <button
                    key={year}
                    type="button"
                    className="legal-quiz-topic-card"
                    onClick={() => startQuiz(year)}
                    aria-label={`Start ${title} syllabus quiz`}
                  >
                    <Icon aria-hidden="true" />
                    <strong>{title}</strong>
                    <span className="legal-quiz-topic-rule">
                      <i />
                    </span>
                    <span className="legal-quiz-topic-arrow">
                      <ArrowRight aria-hidden="true" />
                    </span>
                    <small>{description}</small>
                  </button>
                );
              })}
            </div>

            <p className="legal-quiz-caption">
              A strong knowledge of the syllabus is essential for answering <strong>Multiple Choice</strong>{' '}
              questions and understanding <strong>essay questions.</strong>
            </p>
          </>
        )}

        {selectedYear && !isComplete && currentQuestion && (
          <div className="legal-quiz-live" aria-live="polite">
            <div className="legal-quiz-live-header">
              <button type="button" className="legal-quiz-back" onClick={resetToYears}>
                Change year
              </button>
              <div className="legal-quiz-scorebox" aria-label="Quiz score">
                <span className="legal-quiz-count">{currentIndex + 1} / {LEGAL_QUIZ_LENGTH}</span>
                <span className="legal-quiz-right">Correct {correctCount}</span>
                <span className="legal-quiz-wrong">Wrong {wrongCount}</span>
              </div>
            </div>

            <div
              className="legal-quiz-progress"
              role="progressbar"
              aria-label="Quiz progress"
              aria-valuenow={progressValue}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${progressValue}%` }} />
            </div>

            <div className="legal-quiz-card">
              <div className="legal-quiz-card-meta">
                <span>{yearLabel}</span>
                <span>{currentQuestion.syllabusArea}</span>
              </div>

              <h3>{currentQuestion.prompt}</h3>

              {currentQuestion.type === 'multiple-choice' && (
                <div className="legal-quiz-options">
                  {questionOptions.map((option) => {
                    const isCorrectOption = option === currentQuestion.answer;
                    const isSelected = currentResult?.selected === option;
                    const stateClass = isSubmitted
                      ? isCorrectOption
                        ? 'is-correct'
                        : isSelected
                          ? 'is-wrong'
                          : ''
                      : '';

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`legal-quiz-option ${stateClass}`}
                        onClick={() => submitAnswer(option)}
                        disabled={isSubmitted}
                      >
                        <span>{option}</span>
                        {isSubmitted && isCorrectOption && <Check aria-hidden="true" />}
                        {isSubmitted && isSelected && !isCorrectOption && <X aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {isTypedQuestion && (
                <form
                  className="legal-quiz-fill"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitAnswer(currentAnswer);
                  }}
                >
                  <label htmlFor="legal-quiz-answer">Your answer</label>
                  <div className="legal-quiz-fill-row">
                    <input
                      id="legal-quiz-answer"
                      type="text"
                      value={currentAnswer}
                      onChange={(event) => setCurrentAnswer(event.target.value)}
                      disabled={isSubmitted}
                      autoComplete="off"
                    />
                    <button type="submit" disabled={isSubmitted || !currentAnswer.trim()}>
                      Check
                    </button>
                  </div>
                  <button
                    type="button"
                    className="legal-quiz-hint"
                    onClick={() => setCurrentAnswer(getHintValue(currentQuestion.answer))}
                    disabled={isSubmitted || !getHintValue(currentQuestion.answer)}
                  >
                    Hint
                  </button>
                </form>
              )}

              {isSubmitted && currentResult && (
                <div className={`legal-quiz-feedback ${currentResult.isCorrect ? 'is-correct' : 'is-wrong'}`}>
                  <strong>
                    {currentResult.isCorrect ? (
                      <>
                        <Check aria-hidden="true" /> Correct
                      </>
                    ) : (
                      <>
                        <X aria-hidden="true" /> Not quite
                      </>
                    )}
                  </strong>
                  {!currentResult.isCorrect && (
                    <p>Correct answer: <span>{currentQuestion.answer}</span></p>
                  )}
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}

              <div className="legal-quiz-actions">
                <span>{isSubmitted ? 'Feedback shown instantly.' : 'Answer to unlock the next question.'}</span>
                <button type="button" onClick={goToNextQuestion} disabled={!isSubmitted}>
                  {currentIndex + 1 === LEGAL_QUIZ_LENGTH ? 'See score' : 'Next question'}
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedYear && isComplete && (
          <div className="legal-quiz-results">
            <div className="legal-quiz-score-final">
              <span>Final score</span>
              <strong>{correctCount}/{LEGAL_QUIZ_LENGTH}</strong>
            </div>
            <div className="legal-quiz-review">
              {resultIsStrong && <span className="legal-quiz-recognition">15+ achieved</span>}
              <h3>{resultHeading}</h3>
              <p>{resultMessage}</p>
              <div className="legal-quiz-result-actions">
                <button type="button" onClick={retryQuiz}>
                  <RotateCcw aria-hidden="true" />
                  Try again
                </button>
                <button type="button" onClick={resetToYears}>
                  Choose another year
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LegalSyllabusQuiz;

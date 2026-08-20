import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, GraduationCap, RotateCcw, TrendingUp, X } from 'lucide-react';
import {
  BUSINESS_QUIZ_LENGTH,
  businessQuizBanks,
  BusinessQuizQuestion,
  BusinessQuizYear,
} from '@/data/businessSyllabusQuiz';

type QuizAnswer = {
  questionId: string;
  selected: string;
  isCorrect: boolean;
};

const yearMeta: Record<
  BusinessQuizYear,
  {
    title: string;
    description: string;
    Icon: typeof GraduationCap;
  }
> = {
  year11: {
    title: 'Year 11',
    description: 'Nature of Business, Business Management, and Business Planning.',
    Icon: GraduationCap,
  },
  year12: {
    title: 'Year 12',
    description: 'Operations, Marketing, Finance, and Human Resources.',
    Icon: TrendingUp,
  },
};

const shuffle = <T,>(items: T[]) => {
  const output = [...items];

  for (let index = output.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [output[index], output[randomIndex]] = [output[randomIndex], output[index]];
  }

  return output;
};

const buildQuestionSet = (year: BusinessQuizYear) => {
  const bank = businessQuizBanks[year];
  return shuffle(bank).slice(0, BUSINESS_QUIZ_LENGTH);
};

const BusinessSyllabusQuiz = () => {
  const [selectedYear, setSelectedYear] = useState<BusinessQuizYear | null>(null);
  const [questions, setQuestions] = useState<BusinessQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
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
  const yearLabel = selectedYear ? yearMeta[selectedYear].title : 'Practice quiz';
  const resultIsStrong = correctCount >= Math.ceil(BUSINESS_QUIZ_LENGTH * 0.7);
  const resultHeading = resultIsStrong ? 'Syllabus strength recognised' : `${yearLabel} review`;
  const resultMessage = resultIsStrong
    ? 'Excellent work. You are recalling the syllabus with confidence across topics, which is exactly what strong Business Studies responses are built on.'
    : 'Keep going. A few focused attempts will sharpen your recall and make the syllabus feel much easier to use in exam responses.';

  const questionOptions = useMemo(() => {
    if (!currentQuestion?.options) return [];
    return shuffle(currentQuestion.options);
  }, [currentQuestion]);

  const startQuiz = (year: BusinessQuizYear) => {
    setSelectedYear(year);
    setQuestions(buildQuestionSet(year));
    setCurrentIndex(0);
    setAnswers([]);
    setIsSubmitted(false);
  };

  const resetToYears = () => {
    setSelectedYear(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setIsSubmitted(false);
  };

  const submitAnswer = (value: string) => {
    if (!currentQuestion || isSubmitted) return;

    const isCorrect = value === currentQuestion.answer;
    setAnswers((current) => [
      ...current,
      {
        questionId: currentQuestion.id,
        selected: value,
        isCorrect,
      },
    ]);
    setIsSubmitted(true);
  };

  const goToNextQuestion = () => {
    setCurrentIndex((current) => current + 1);
    setIsSubmitted(false);
  };

  const retryQuiz = () => {
    if (!selectedYear) return;
    startQuiz(selectedYear);
  };

  return (
    <section id="business-quiz" className="business-quiz-section" aria-labelledby="business-quiz-title">
      <div className="business-quiz-inner">
        <div className="business-quiz-ornament" aria-hidden="true">
          <span />
          <i>✦</i>
          <span />
        </div>

        {!selectedYear && (
          <>
            <div className="business-quiz-heading">
              <h2 id="business-quiz-title">How well do you know the syllabus?</h2>
              <p>Take this Multiple Choice practice quiz</p>
            </div>

            <div className="business-quiz-year-grid">
              {(Object.keys(yearMeta) as BusinessQuizYear[]).map((year) => {
                const { Icon, title, description } = yearMeta[year];

                return (
                  <button
                    key={year}
                    type="button"
                    className="business-quiz-year-card"
                    onClick={() => startQuiz(year)}
                    aria-label={`Start ${title} syllabus quiz`}
                  >
                    <Icon aria-hidden="true" />
                    <strong>{title}</strong>
                    <span className="business-quiz-year-rule">
                      <i />
                    </span>
                    <span className="business-quiz-year-arrow">
                      <ArrowRight aria-hidden="true" />
                    </span>
                    <small>{description}</small>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {selectedYear && !isComplete && currentQuestion && (
          <div className="business-quiz-live" aria-live="polite">
            <div className="business-quiz-live-header">
              <button type="button" className="business-quiz-back" onClick={resetToYears}>
                Change year
              </button>
              <div className="business-quiz-scorebox" aria-label="Quiz score">
                <span className="business-quiz-count">{currentIndex + 1} / {BUSINESS_QUIZ_LENGTH}</span>
                <span className="business-quiz-right">Correct {correctCount}</span>
                <span className="business-quiz-wrong">Wrong {wrongCount}</span>
              </div>
            </div>

            <div
              className="business-quiz-progress"
              role="progressbar"
              aria-label="Quiz progress"
              aria-valuenow={progressValue}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${progressValue}%` }} />
            </div>

            <div className="business-quiz-card">
              <div className="business-quiz-card-meta">
                <span>{yearLabel}</span>
                <span>{currentQuestion.syllabusArea}</span>
              </div>

              <h3>{currentQuestion.prompt}</h3>

              <div className="business-quiz-options">
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
                      className={`business-quiz-option ${stateClass}`}
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

              {isSubmitted && currentResult && (
                <div className={`business-quiz-feedback ${currentResult.isCorrect ? 'is-correct' : 'is-wrong'}`}>
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

              <div className="business-quiz-actions">
                <span>{isSubmitted ? 'Feedback shown instantly.' : 'Answer to unlock the next question.'}</span>
                <button type="button" onClick={goToNextQuestion} disabled={!isSubmitted}>
                  {currentIndex + 1 === BUSINESS_QUIZ_LENGTH ? 'See score' : 'Next question'}
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedYear && isComplete && (
          <div className="business-quiz-results">
            <div className="business-quiz-score-final">
              <span>Final score</span>
              <strong>{correctCount}/{BUSINESS_QUIZ_LENGTH}</strong>
            </div>
            <div className="business-quiz-review">
              {resultIsStrong && <span className="business-quiz-recognition">Strong result</span>}
              <h3>{resultHeading}</h3>
              <p>{resultMessage}</p>
              <div className="business-quiz-result-actions">
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

export default BusinessSyllabusQuiz;

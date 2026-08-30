import type { PrimaryQuestion } from './primaryQuestionBank';
import type { LearningState } from './primaryChallengeEngine';

type Props = {
  question: PrimaryQuestion;
  state: LearningState;
  onNextStep: () => void;
  onBeginFollowUp: () => void;
  onFollowUpAnswer: (answer: string) => void;
};

const SeedTreeTeachingPanel = ({ question, state, onNextStep, onBeginFollowUp, onFollowUpAnswer }: Props) => {
  if (state.mode === 'ready-to-grow') {
    return (
      <div className="seed-tree-challenge__understood" aria-live="polite">
        <p className="seed-tree-challenge__teaching-label">Understanding found <span aria-hidden="true">✓</span></p>
        <strong>{state.revealedAnswer ? `The answer is ${state.revealedAnswer}. We worked it out together.` : 'Exactly — you’ve got it!'}</strong>
        <p>{question.followUp.explanation}</p>
      </div>
    );
  }

  if (state.mode === 'teaching') {
    const finalStep = state.explanationStep >= question.explanation.steps.length - 1;
    const misconception = state.selectedAnswer ? question.misconceptionFeedback[state.selectedAnswer] : undefined;
    return (
      <div className="seed-tree-challenge__teaching" aria-live="polite">
        <p className="seed-tree-challenge__teaching-label">Let’s work through it <span aria-hidden="true">🌱</span></p>
        <p className="seed-tree-challenge__acknowledgement">{misconception ?? 'Good attempt — let’s look at the important information together.'}</p>
        <ol className="seed-tree-challenge__steps">
          {question.explanation.steps.slice(0, state.explanationStep + 1).map((step, index) => (
            <li key={step} className={index === state.explanationStep ? 'is-new' : ''}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>
          ))}
        </ol>
        <div className="seed-tree-challenge__method"><span>Correct answer</span><strong>{finalStep ? question.correctAnswer : 'Let’s find it together…'}</strong></div>
        <button className="seed-tree-challenge__continue" type="button" onClick={finalStep ? onBeginFollowUp : onNextStep}>
          {finalStep ? 'Try a quick check' : 'Show the next step'} <span aria-hidden="true">→</span>
        </button>
      </div>
    );
  }

  const isSupportedRetry = state.mode === 'follow-up-support';
  return (
    <div className="seed-tree-challenge__follow-up" aria-live="polite">
      <p className="seed-tree-challenge__teaching-label">Your turn <span aria-hidden="true">🌱</span></p>
      {isSupportedRetry ? <p className="seed-tree-challenge__support-note">You’re close. Use this clue: <strong>{question.hint}</strong> Then choose once more.</p> : null}
      <p className="seed-tree-challenge__follow-up-question">{question.followUp.question}</p>
      <div className="seed-tree-challenge__answers">
        {question.followUp.options.map((option) => <button key={option} type="button" onClick={() => onFollowUpAnswer(option)}><span>{option}</span></button>)}
      </div>
    </div>
  );
};

export default SeedTreeTeachingPanel;

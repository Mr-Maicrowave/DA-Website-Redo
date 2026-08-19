import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, Check, Lightbulb, RotateCcw } from 'lucide-react';
import {
  TRANSFORMATION_JOURNEY,
  GUIDED_SELECT_PLACEHOLDER,
  evaluateExplanation,
  evaluatePrediction,
  completeGuidedStep,
  hasReachedExperimentTarget,
  summariseMastery,
  type GuidedPhase,
  type GuidedProgress,
  type StepResult,
} from './guided-transformations';
import type { ParameterKey } from './equation-presets';
import { InlineLatexText } from './InlineLatexText';
import { LatexEquation } from './LatexEquation';

type GuidedJourneyPanelProps = {
  progress: GuidedProgress;
  onProgressChange: (progress: GuidedProgress) => void;
  onRestart: () => void;
  onRevisit: (stepIndex: number) => void;
  onControlsUnlockedChange: (unlocked: boolean) => void;
  parameterValues: Record<ParameterKey, number>;
  controls?: ReactNode;
};

const STATUS_STYLES = {
  secure: 'bg-[#e6f4ed] text-[#1d664d]',
  developing: 'bg-[#fff5d8] text-[#76550b]',
  revisit: 'bg-[#fff0f2] text-[#963147]',
};

export const GuidedJourneyPanel = ({ progress, onProgressChange, onRestart, onRevisit, onControlsUnlockedChange, parameterValues, controls }: GuidedJourneyPanelProps) => {
  const step = TRANSFORMATION_JOURNEY[Math.min(progress.stepIndex, TRANSFORMATION_JOURNEY.length - 1)];
  const [phase, setPhase] = useState<GuidedPhase>('predict');
  const [attempts, setAttempts] = useState(0);
  const [predictionCorrect, setPredictionCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [explanationAnswers, setExplanationAnswers] = useState<Record<string, string>>({});
  const [explanationCorrect, setExplanationCorrect] = useState<boolean | undefined>();
  const experimentTargetReached = hasReachedExperimentTarget(step, parameterValues);

  useEffect(() => {
    setPhase('predict');
    setAttempts(0);
    setPredictionCorrect(false);
    setFeedback('');
    setExplanationAnswers({});
    setExplanationCorrect(undefined);
  }, [progress.stepIndex]);

  useEffect(() => {
    onControlsUnlockedChange(phase !== 'predict');
  }, [onControlsUnlockedChange, phase]);

  if (progress.completed) {
    const mastery = summariseMastery(progress.results);
    return (
      <aside className="graph-lab-panel rounded-2xl border border-[#071629]/12 bg-white p-5" aria-labelledby="mastery-heading">
        <p className="text-sm font-black text-[#7a5709]">Journey complete</p>
        <h2 id="mastery-heading" className="mt-1 font-serif text-3xl font-medium tracking-[-0.03em] text-[#071629]">Your transformation mastery</h2>
        <p className="mt-3 text-sm leading-6 text-[#40516b]">This is practice evidence, not a mark. Your first prediction helps you choose what to practise next.</p>
        <div className="mt-5 space-y-3">
          {mastery.map((item, index) => (
            <div key={item.id} className="border-t border-[#071629]/10 pt-3 first:border-0 first:pt-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-[#071629]">{item.label}</p>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-black capitalize ${STATUS_STYLES[item.status]}`}>{item.status}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-[#536077]">{item.note}</p>
              <button type="button" onClick={() => onRevisit(index)} className="mt-3 inline-flex min-h-9 items-center rounded-lg border border-[#071629]/20 px-3 text-xs font-black text-[#071629] outline-none hover:bg-[#f3f7fb] focus-visible:ring-2 focus-visible:ring-[#5d568e] focus-visible:ring-offset-2">
                Review this challenge
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-2">
          <button type="button" onClick={onRestart} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#071629]/20 px-4 text-sm font-black text-[#071629] outline-none hover:bg-[#f3f7fb] focus-visible:ring-2 focus-visible:ring-[#5d568e]">
            <RotateCcw className="mr-2 h-4 w-4" /> Try the journey again
          </button>
        </div>
      </aside>
    );
  }

  const submitPrediction = (answerId: string) => {
    const result = evaluatePrediction(step, answerId, attempts);
    setAttempts(result.attempts);
    setPredictionCorrect(result.correct);
    setFeedback(result.message);
    setPhase(result.nextPhase);
  };

  const finishExperiment = () => {
    setPhase(step.explanationFields?.length ? 'explain' : 'review');
    setFeedback(step.explanationFields?.length ? 'Build a precise explanation from the mathematical terms below.' : step.workedExplanation);
  };

  const submitExplanation = () => {
    const correct = evaluateExplanation(step, explanationAnswers);
    setExplanationCorrect(correct);
    setFeedback(correct ? 'That explanation uses the transformation language correctly.' : step.workedExplanation);
    setPhase('review');
  };

  const continueJourney = () => {
    const result: StepResult = { attempts, predictionCorrect, explanationCorrect };
    onProgressChange(completeGuidedStep(progress, result));
  };

  return (
    <aside className="graph-lab-panel rounded-2xl border border-[#071629]/12 bg-white p-5" aria-labelledby="guided-step-heading">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black text-[#7a5709]">Function transformations</p>
        <span className="rounded-full bg-[#f3f7fb] px-2.5 py-1 text-[11px] font-black text-[#40516b]">{progress.stepIndex + 1} of {TRANSFORMATION_JOURNEY.length}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e5ebf2]" aria-hidden="true"><div className="h-full rounded-full bg-[#5d568e] transition-[width] duration-200" style={{ width: `${((progress.stepIndex + 1) / TRANSFORMATION_JOURNEY.length) * 100}%` }} /></div>
      <h2 id="guided-step-heading" className="mt-5 font-serif text-2xl font-medium leading-tight tracking-[-0.025em] text-[#071629]">{step.title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#40516b]"><InlineLatexText>{step.question}</InlineLatexText></p>

      {phase === 'predict' ? (
        <fieldset className="mt-5 space-y-2">
          <legend className="mb-3 text-xs font-black text-[#536077]">Predict before using the controls</legend>
          {step.predictionOptions.map((option) => (
            <button key={option.id} type="button" onClick={() => submitPrediction(option.id)} className="flex min-h-11 w-full items-center rounded-lg border border-[#071629]/18 px-3 text-left text-sm font-bold text-[#172033] outline-none hover:border-[#5d568e] hover:bg-[#f7f3fa] focus-visible:ring-2 focus-visible:ring-[#5d568e]">
              <InlineLatexText>{option.label}</InlineLatexText>
            </button>
          ))}
        </fieldset>
      ) : null}

      {phase === 'experiment' ? (
        <div className="mt-5">
          {step.targetLatex ? (
            <div className="mb-3 rounded-lg border border-[#5d568e]/20 bg-white px-3 py-3">
              <p className="text-[11px] font-black text-[#536077]">Match this equation</p>
              <LatexEquation latex={step.targetLatex} className="mt-1 block max-w-full overflow-hidden whitespace-nowrap text-lg font-bold text-[#5d568e] [&_.katex]:text-inherit" />
            </div>
          ) : null}
          <p className="rounded-lg bg-[#f3f0f8] p-3 text-sm leading-6 text-[#392e59]"><Lightbulb className="mr-2 inline h-4 w-4" /><InlineLatexText>{step.experimentInstruction}</InlineLatexText></p>
          <p className="mt-3 rounded-lg border border-[#5d568e]/15 bg-[#f7f3fa] px-3 py-2 text-xs font-semibold leading-5 text-[#392e59]"><span className="font-black">Look for: </span><InlineLatexText>{step.observation}</InlineLatexText></p>
          {controls ? <div className="mt-4 border-t border-[#071629]/10 pt-4">{controls}</div> : null}
          {!experimentTargetReached ? <p className="mt-3 text-xs font-bold leading-5 text-[#6f4d05]">Match the requested values with the sliders to continue.</p> : null}
          <button type="button" disabled={!experimentTargetReached} onClick={finishExperiment} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#071629] px-4 text-sm font-black text-white outline-none hover:bg-[#153458] focus-visible:ring-2 focus-visible:ring-[#5d568e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40">
            I’ve tested the change <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      ) : null}

      {phase === 'explain' && step.explanationFields ? (
        <div className="mt-5 space-y-4">
          {step.explanationFields.map((field) => (
            <label key={field.id} className="block text-xs font-black text-[#536077]">
              <InlineLatexText>{field.prompt}</InlineLatexText>
              <select value={explanationAnswers[field.id] ?? ''} onChange={(event) => setExplanationAnswers((current) => ({ ...current, [field.id]: event.target.value }))} className="mt-1 h-11 w-full rounded-lg border border-[#071629]/20 bg-white px-3 text-sm font-bold text-[#172033] outline-none focus:border-[#5d568e] focus:ring-2 focus:ring-[#5d568e]/20">
                <option value="">{GUIDED_SELECT_PLACEHOLDER}</option>
                {field.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
          ))}
          <button type="button" disabled={step.explanationFields.some((field) => !explanationAnswers[field.id])} onClick={submitExplanation} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#071629] px-4 text-sm font-black text-white outline-none hover:bg-[#153458] focus-visible:ring-2 focus-visible:ring-[#5d568e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40">Check my explanation</button>
        </div>
      ) : null}

      {phase === 'review' ? (
        <button type="button" onClick={continueJourney} className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#071629] px-4 text-sm font-black text-white outline-none hover:bg-[#153458] focus-visible:ring-2 focus-visible:ring-[#5d568e] focus-visible:ring-offset-2">
          <Check className="mr-2 h-4 w-4" /> {progress.stepIndex === TRANSFORMATION_JOURNEY.length - 1 ? 'See my mastery summary' : 'Continue'}
        </button>
      ) : null}

      <p className={`mt-4 min-h-12 rounded-lg px-3 py-2 text-xs leading-5 ${feedback ? 'bg-[#fff7df] text-[#6f4d05]' : 'bg-[#f3f7fb] text-[#68758b]'}`} aria-live="polite">
        <InlineLatexText>{feedback || 'Your prediction is not a mark. It helps you notice what changes before the graph reveals it.'}</InlineLatexText>
      </p>
    </aside>
  );
};

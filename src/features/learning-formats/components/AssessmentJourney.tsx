/**
 * SECTION 02 — "Find Their Fit"
 *
 * One assessment, completed once. Year first, then the four stage questions,
 * one at a time, with full backward navigation. Answers live in shared state
 * so changing one never clears the others.
 */

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { getStageQuestions } from "../config/questions";
import type { QuestionSlot } from "../logic/types";
import type { LearningFormatsController } from "../state/useLearningFormatsState";
import AssessmentProgress from "./AssessmentProgress";
import AssessmentQuestion from "./AssessmentQuestion";
import PreliminaryResult from "./PreliminaryResult";
import YearSelector from "./YearSelector";
import { WF } from "./wireframe";

interface AssessmentJourneyProps {
  controller: LearningFormatsController;
}

/** step -1 = year selector, 0..3 = questions */
function firstUnansweredStep(
  answers: Partial<Record<QuestionSlot, string>>,
  slots: QuestionSlot[],
): number {
  const idx = slots.findIndex((slot) => !answers[slot]);
  return idx === -1 ? slots.length - 1 : idx;
}

const AssessmentJourney = ({ controller }: AssessmentJourneyProps) => {
  const { state, setYear, setAnswer, assessmentComplete, bundle } = controller;
  const questions = getStageQuestions(state.stage);
  const slots = useMemo(
    () => questions.map((q) => q.slot),
    [questions],
  );

  const [step, setStep] = useState<number>(state.year == null ? -1 : 0);

  // Resume at the right place after refresh / year change.
  useEffect(() => {
    if (state.year == null) {
      setStep(-1);
    } else if (step === -1) {
      setStep(firstUnansweredStep(state.answers, slots));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.year, state.stage]);

  const totalSteps = questions.length;
  const onYearStep = step === -1;
  const activeQuestion = !onYearStep ? questions[step] : null;
  const activeAnswer = activeQuestion
    ? state.answers[activeQuestion.slot]
    : undefined;

  const canGoBack = step > -1;
  const isLastQuestion = step === totalSteps - 1;

  const goBack = () => setStep((s) => Math.max(-1, s - 1));
  const goNext = () => setStep((s) => Math.min(totalSteps - 1, s + 1));

  return (
    <div className="grid gap-4">
      <div className={WF.card}>
        {onYearStep ? (
          <YearSelector
            value={state.year}
            onChange={(year) => {
              setYear(year);
              setStep(0);
            }}
          />
        ) : (
          activeQuestion && (
            <>
              <AssessmentProgress current={step + 1} total={totalSteps} />
              <AssessmentQuestion
                name={`lf-${state.stage}-${activeQuestion.slot}`}
                question={activeQuestion.question}
                options={activeQuestion.options}
                value={activeAnswer}
                onChange={(optionId) =>
                  setAnswer(activeQuestion.slot, optionId)
                }
              />
            </>
          )
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            className={WF.btnGhost}
            onClick={goBack}
            disabled={!canGoBack}
          >
            Back
          </button>
          {!onYearStep && !isLastQuestion && (
            <button
              type="button"
              className={WF.btnPrimary}
              onClick={goNext}
              disabled={!activeAnswer}
            >
              Next
            </button>
          )}
          {isLastQuestion && activeAnswer && !assessmentComplete && (
            <span className={cn(WF.body, "text-brand-navy/50")}>
              Answer every question to see a starting point.
            </span>
          )}
        </div>
      </div>

      {assessmentComplete && bundle.recommendation && (
        <PreliminaryResult recommendation={bundle.recommendation} />
      )}
    </div>
  );
};

export default AssessmentJourney;

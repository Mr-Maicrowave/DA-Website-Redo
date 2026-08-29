/**
 * SECTION 03 (part 2) — subject follow-ups, all on ONE screen.
 *
 * Only subjects with a specialist pathway ask a question. Everything else is
 * listed as "no additional questions needed". This is not another journey.
 */

import { cn } from "@/lib/utils";
import { getSubjectFollowUp, subjectLabel } from "../config/subjects";
import type { LearningFormatsController } from "../state/useLearningFormatsState";
import AssessmentQuestion from "./AssessmentQuestion";
import { WF } from "./wireframe";

interface SubjectFollowUpsProps {
  controller: LearningFormatsController;
}

const SubjectFollowUps = ({ controller }: SubjectFollowUpsProps) => {
  const { state, visibleFollowUps, setSubjectAnswer } = controller;

  const noQuestionSubjects = state.selectedSubjects.filter(
    (subject) => !getSubjectFollowUp(subject, state.stage),
  );

  if (state.selectedSubjects.length === 0) return null;

  return (
    <div className="grid gap-4">
      {visibleFollowUps.map(({ config, answered }) => (
        <div
          key={config.key}
          className={cn(
            WF.card,
            answered ? "border-brand-navy/15" : "border-brand-gold/50",
          )}
        >
          <p className={cn(WF.sectionKicker, "mb-2")}>
            {subjectLabel(config.subject)} follow-up
          </p>
          <AssessmentQuestion
            name={`lf-followup-${config.key}`}
            question={config.question}
            options={config.options}
            value={state.subjectAnswers[config.key]}
            onChange={(optionId) => setSubjectAnswer(config.key, optionId)}
          />
        </div>
      ))}

      {noQuestionSubjects.length > 0 && (
        <div className={cn(WF.card, "border-dashed")}>
          <p className={WF.sectionKicker}>No additional questions needed</p>
          <p className={cn(WF.body, "mt-1")}>
            {noQuestionSubjects.map((s) => subjectLabel(s)).join(", ")} —{" "}
            {noQuestionSubjects.length === 1 ? "it" : "they"} will inherit the
            core learning environment.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubjectFollowUps;

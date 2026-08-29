/**
 * PURE STATE TRANSITIONS
 *
 * All assessment-state mutations live here as pure functions so they can be
 * unit-tested without React. `useLearningFormatsState` is a thin wrapper.
 */

import { stageForYear } from "../config/stages.ts";
import { getSubjectFollowUp, isSubjectAvailable } from "../config/subjects.ts";
import type {
  AssessmentState,
  LearningStage,
  QuestionSlot,
  SubjectFollowUpKey,
  SubjectId,
} from "../logic/types.ts";

export const EMPTY_STATE: AssessmentState = {
  year: null,
  stage: null,
  answers: {},
  selectedSubjects: [],
  subjectAnswers: {},
};

export function applyStage(
  state: AssessmentState,
  stage: LearningStage,
): AssessmentState {
  if (stage === state.stage) return state;
  return { ...state, year: null, stage, answers: {}, subjectAnswers: {} };
}

/**
 * Change the child's year.
 *  - same resulting stage  → keep every answer
 *  - different stage       → reset the four assessment answers + follow-ups,
 *                            and drop any now-ineligible subjects
 */
export function applyYear(
  state: AssessmentState,
  year: number,
): AssessmentState {
  const nextStage = stageForYear(year);
  if (nextStage === state.stage) {
    return { ...state, year };
  }
  return {
    year,
    stage: nextStage,
    answers: {},
    selectedSubjects: state.selectedSubjects.filter((s) =>
      isSubjectAvailable(s, year, nextStage),
    ),
    subjectAnswers: {},
  };
}

export function applyAnswer(
  state: AssessmentState,
  slot: QuestionSlot,
  optionId: string,
): AssessmentState {
  return { ...state, answers: { ...state.answers, [slot]: optionId } };
}

export function applyToggleSubject(
  state: AssessmentState,
  subject: SubjectId,
): AssessmentState {
  if (state.selectedSubjects.includes(subject)) {
    const followUp = getSubjectFollowUp(subject, state.stage);
    const subjectAnswers = { ...state.subjectAnswers };
    if (followUp) delete subjectAnswers[followUp.key];
    return {
      ...state,
      selectedSubjects: state.selectedSubjects.filter((s) => s !== subject),
      subjectAnswers,
    };
  }
  return { ...state, selectedSubjects: [...state.selectedSubjects, subject] };
}

export function applySubjectAnswer(
  state: AssessmentState,
  key: SubjectFollowUpKey,
  optionId: string,
): AssessmentState {
  return {
    ...state,
    subjectAnswers: { ...state.subjectAnswers, [key]: optionId },
  };
}

/**
 * CENTRAL STATE  (single source of truth for the whole tool)
 *
 * Persists to sessionStorage so a refresh mid-session keeps progress.
 * ONLY the assessment shape is stored — no names, no free text:
 *   year, stage, assessment answer ids, selected subjects, follow-up answers.
 *
 * All mutations are pure functions in ./transitions.ts (unit-tested there).
 * This hook adds React state + sessionStorage persistence + derived selectors.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { stageForYear } from "../config/stages.ts";
import { getSubjectFollowUp, isSubjectAvailable, subjectsForStage } from "../config/subjects.ts";
import {
  buildRecommendation,
  isAssessmentComplete,
  type RecommendationBundle,
} from "../logic/buildRecommendation.ts";
import type {
  AssessmentState,
  QuestionSlot,
  SubjectFollowUpConfig,
  SubjectFollowUpKey,
  SubjectId,
} from "../logic/types.ts";
import {
  applyAnswer,
  applyStage,
  applySubjectAnswer,
  applyToggleSubject,
  applyYear,
  EMPTY_STATE,
} from "./transitions.ts";

const STORAGE_KEY = "da-learning-formats-v1";

function readStorage(): AssessmentState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<AssessmentState>;
    return {
      year: typeof parsed.year === "number" ? parsed.year : null,
      stage: parsed.stage ?? stageForYear(parsed.year ?? null),
      answers: parsed.answers ?? {},
      selectedSubjects: Array.isArray(parsed.selectedSubjects)
        ? (parsed.selectedSubjects as SubjectId[])
        : [],
      subjectAnswers: parsed.subjectAnswers ?? {},
    };
  } catch {
    return EMPTY_STATE;
  }
}

function writeStorage(state: AssessmentState): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private mode / quota — non-fatal */
  }
}

export interface VisibleFollowUp {
  config: SubjectFollowUpConfig;
  answered: boolean;
}

export interface LearningFormatsController {
  state: AssessmentState;
  eligibleSubjects: SubjectId[];
  visibleFollowUps: VisibleFollowUp[];
  assessmentComplete: boolean;
  allFollowUpsAnswered: boolean;
  bundle: RecommendationBundle;

  setYear: (year: number) => void;
  setStage: (stage: NonNullable<AssessmentState["stage"]>) => void;
  setAnswer: (slot: QuestionSlot, optionId: string) => void;
  toggleSubject: (subject: SubjectId) => void;
  setSubjectAnswer: (key: SubjectFollowUpKey, optionId: string) => void;
  reset: () => void;
}

export function useLearningFormatsState(): LearningFormatsController {
  const [state, setState] = useState<AssessmentState>(readStorage);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    writeStorage(state);
  }, [state]);

  const setYear = useCallback(
    (year: number) => setState((prev) => applyYear(prev, year)),
    [],
  );
  const setStage = useCallback(
    (stage: NonNullable<AssessmentState["stage"]>) =>
      setState((prev) => applyStage(prev, stage)),
    [],
  );
  const setAnswer = useCallback(
    (slot: QuestionSlot, optionId: string) =>
      setState((prev) => applyAnswer(prev, slot, optionId)),
    [],
  );
  const toggleSubject = useCallback(
    (subject: SubjectId) =>
      setState((prev) => applyToggleSubject(prev, subject)),
    [],
  );
  const setSubjectAnswer = useCallback(
    (key: SubjectFollowUpKey, optionId: string) =>
      setState((prev) => applySubjectAnswer(prev, key, optionId)),
    [],
  );
  const reset = useCallback(() => {
    setState(EMPTY_STATE);
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* non-fatal */
      }
    }
  }, []);

  const eligibleSubjects = useMemo(
    () =>
      subjectsForStage(state.stage).filter((s) =>
        isSubjectAvailable(s, state.year, state.stage),
      ),
    [state.stage, state.year],
  );

  const visibleFollowUps = useMemo<VisibleFollowUp[]>(() => {
    if (!state.stage) return [];
    const seen = new Set<string>();
    const out: VisibleFollowUp[] = [];
    for (const subject of state.selectedSubjects) {
      const config = getSubjectFollowUp(subject, state.stage);
      if (!config || seen.has(config.key)) continue;
      seen.add(config.key);
      out.push({ config, answered: Boolean(state.subjectAnswers[config.key]) });
    }
    return out;
  }, [state.stage, state.selectedSubjects, state.subjectAnswers]);

  const assessmentComplete = useMemo(() => isAssessmentComplete(state), [state]);
  const allFollowUpsAnswered = useMemo(
    () => visibleFollowUps.every((f) => f.answered),
    [visibleFollowUps],
  );
  const bundle = useMemo(() => buildRecommendation(state), [state]);

  return {
    state,
    eligibleSubjects,
    visibleFollowUps,
    assessmentComplete,
    allFollowUpsAnswered,
    bundle,
    setYear,
    setStage,
    setAnswer,
    toggleSubject,
    setSubjectAnswer,
    reset,
  };
}

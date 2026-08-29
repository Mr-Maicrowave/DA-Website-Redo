/**
 * TOP-LEVEL RECOMMENDATION ORCHESTRATOR
 *
 * calculateSignals → calculateEnvironment → buildRecommendationReasons
 *                 → calculateSubjectRecommendations
 *
 * Returns null until the core assessment (year + stage + Q1–Q4) is complete.
 */

import { getStageQuestions } from "../config/questions.ts";
import { buildRecommendationReasons } from "./buildRecommendationReasons.ts";
import { calculateEnvironment } from "./calculateEnvironment.ts";
import { calculateSignals } from "./calculateSignals.ts";
import { calculateSubjectRecommendations } from "./calculateSubjectRecommendations.ts";
import type { AssessmentState, Recommendation, Signals } from "./types.ts";

export function isAssessmentComplete(state: AssessmentState): boolean {
  if (state.stage == null) return false;
  const questions = getStageQuestions(state.stage);
  return questions.every((q) => Boolean(state.answers[q.slot]));
}

export interface RecommendationBundle {
  signals: Signals;
  recommendation: Recommendation | null;
}

export function buildRecommendation(
  state: AssessmentState,
): RecommendationBundle {
  const signals = calculateSignals(state);

  if (!isAssessmentComplete(state)) {
    return { signals, recommendation: null };
  }

  const env = calculateEnvironment(signals);
  const reasons = buildRecommendationReasons(
    state.answers,
    signals,
    env.primaryEnvironment,
  );
  const subjects = calculateSubjectRecommendations(
    state,
    signals,
    env.primaryEnvironment,
  );

  return {
    signals,
    recommendation: {
      primaryEnvironment: env.primaryEnvironment,
      secondaryEnvironment: env.secondaryEnvironment,
      close: env.close,
      reasons,
      subjects,
    },
  };
}

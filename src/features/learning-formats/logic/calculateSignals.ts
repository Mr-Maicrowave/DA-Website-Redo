/**
 * SIGNAL ENGINE
 *
 * Turns the parent's answers into a flat bag of numeric signals. Fully
 * data-driven from ../config/questions.ts and ../config/subjects.ts — there
 * are no hard-coded question branches here.
 *
 * Includes:
 *  - the four core assessment answers (Layer A + shared signals)
 *  - any answered subject follow-ups (Layer B signals)
 */

import { getStageQuestions } from "../config/questions.ts";
import { SUBJECT_FOLLOW_UPS } from "../config/subjects.ts";
import type {
  AssessmentState,
  ScoreMap,
  SignalKey,
  Signals,
} from "./types.ts";

export const SIGNAL_KEYS: SignalKey[] = [
  "privateScore",
  "classScore",
  "challengeSignal",
  "confidenceSupportSignal",
  "foundationSignal",
  "creativeWritingSignal",
  "accuracySignal",
  "accountabilitySignal",
  "assessmentSignal",
  "organisationSignal",
  "examReadinessSignal",
  "hscPrepSignal",
  "trialSignal",
  "focusMathsSignal",
  "focusEnglishSignal",
];

export function emptySignals(): Signals {
  return SIGNAL_KEYS.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as Signals);
}

function applyScores(target: Signals, scores: ScoreMap | undefined): void {
  if (!scores) return;
  for (const [key, value] of Object.entries(scores)) {
    if (value == null) continue;
    target[key as SignalKey] = (target[key as SignalKey] ?? 0) + value;
  }
}

export function calculateSignals(state: AssessmentState): Signals {
  const signals = emptySignals();

  // --- Core assessment (Q1–Q4 for the current stage) ---
  for (const question of getStageQuestions(state.stage)) {
    const answerId = state.answers[question.slot];
    if (!answerId) continue;
    const option = question.options.find((o) => o.id === answerId);
    applyScores(signals, option?.scores);
  }

  // --- Subject follow-ups (only answered ones contribute) ---
  for (const [key, answerId] of Object.entries(state.subjectAnswers)) {
    if (!answerId) continue;
    const followUp = SUBJECT_FOLLOW_UPS[key];
    if (!followUp) continue;
    const option = followUp.options.find((o) => o.id === answerId);
    applyScores(signals, option?.scores);
  }

  return signals;
}

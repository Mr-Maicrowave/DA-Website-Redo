import type { AssessmentAnswers } from "./assessmentTypes";
import { isCompleteAssessment } from "./recommendationTypes.ts";

export const JOURNEY_SESSION_KEY = "da-learning-journey:v1";
const JOURNEY_SESSION_VERSION = 1;

export interface JourneyStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

export interface JourneySession {
  answers: AssessmentAnswers;
  revealed: boolean;
}

const academicLevels = new Set(["rebuilding", "year-level", "above-level"]);
const confidenceAnswers = new Set(["quiet", "encouraged", "confident"]);
const learningHabits = new Set(["guided", "check-in", "independent"]);
const motivationAnswers = new Set([
  "needs-encouragement",
  "persistent",
  "challenge-seeking",
]);
const goalsAnswers = new Set([
  "confidence-foundations",
  "steady-progress",
  "extension",
]);

const isNullableMember = (
  value: unknown,
  values: ReadonlySet<string>,
): value is string | null => value === null || (typeof value === "string" && values.has(value));

const isAssessmentAnswers = (value: unknown): value is AssessmentAnswers => {
  if (!value || typeof value !== "object") return false;
  const answers = value as Record<string, unknown>;
  return (
    isNullableMember(answers.academicLevel, academicLevels) &&
    isNullableMember(answers.confidence, confidenceAnswers) &&
    isNullableMember(answers.learningHabits, learningHabits) &&
    isNullableMember(answers.motivation, motivationAnswers) &&
    isNullableMember(answers.goals, goalsAnswers)
  );
};

export const readJourneySession = (
  storage: JourneyStorage,
): JourneySession | null => {
  try {
    const raw = storage.getItem(JOURNEY_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (
      parsed.version !== JOURNEY_SESSION_VERSION ||
      typeof parsed.revealed !== "boolean" ||
      !isAssessmentAnswers(parsed.answers)
    ) {
      return null;
    }
    if (parsed.revealed && !isCompleteAssessment(parsed.answers)) return null;
    return { answers: parsed.answers, revealed: parsed.revealed };
  } catch {
    return null;
  }
};

export const writeJourneySession = (
  storage: JourneyStorage,
  answers: AssessmentAnswers,
  revealed: boolean,
) => {
  try {
    storage.setItem(
      JOURNEY_SESSION_KEY,
      JSON.stringify({
        version: JOURNEY_SESSION_VERSION,
        answers,
        revealed: revealed && isCompleteAssessment(answers),
      }),
    );
  } catch {
    // Session persistence is optional; the journey remains functional without it.
  }
};

export const clearJourneyResult = (storage: JourneyStorage) => {
  try {
    const session = readJourneySession(storage);
    if (!session) {
      storage.removeItem(JOURNEY_SESSION_KEY);
      return;
    }
    writeJourneySession(storage, session.answers, false);
  } catch {
    // Storage may be disabled by the browser or privacy settings.
  }
};

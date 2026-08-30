export type AcademicLevelAnswer = "rebuilding" | "year-level" | "above-level";
export type ConfidenceAnswer = "quiet" | "encouraged" | "confident";
export type LearningHabitsAnswer = "guided" | "check-in" | "independent";
export type MotivationAnswer = "needs-encouragement" | "persistent" | "challenge-seeking";
export type GoalsAnswer = "confidence-foundations" | "steady-progress" | "extension";

export type EncounterPhase =
  | "arriving"
  | "awaiting-answer"
  | "confirming"
  | "complete";

export interface AssessmentAnswers {
  academicLevel: AcademicLevelAnswer | null;
  confidence: ConfidenceAnswer | null;
  learningHabits: LearningHabitsAnswer | null;
  motivation: MotivationAnswer | null;
  goals: GoalsAnswer | null;
}

export const initialAssessmentAnswers: AssessmentAnswers = {
  academicLevel: null,
  confidence: null,
  learningHabits: null,
  motivation: null,
  goals: null,
};

export const setAcademicLevel = (
  answers: AssessmentAnswers,
  academicLevel: AcademicLevelAnswer,
): AssessmentAnswers => ({ ...answers, academicLevel });

export const setConfidence = (
  answers: AssessmentAnswers,
  confidence: ConfidenceAnswer,
): AssessmentAnswers => ({ ...answers, confidence });

export const setLearningHabits = (
  answers: AssessmentAnswers,
  learningHabits: LearningHabitsAnswer,
): AssessmentAnswers => ({ ...answers, learningHabits });

export const setMotivation = (
  answers: AssessmentAnswers,
  motivation: MotivationAnswer,
): AssessmentAnswers => ({ ...answers, motivation });

export const setGoals = (
  answers: AssessmentAnswers,
  goals: GoalsAnswer,
): AssessmentAnswers => ({ ...answers, goals });
